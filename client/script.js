var socket = io();
const SVG_NS = "http://www.w3.org/2000/svg";
const icon = "https://cdn.mos.cms.futurecdn.net/JtVH5Khvihib7dBDFY9ZDR.jpg"
var needUpdate = true;

socket.emit('get_cases');
socket.emit('get_news');
socket.emit('get_ports');

// in: alpha 2 code, type ('airport', 'airport_closed', 'harbour', 'harbour_closed'), x/y in percentages
const addPort = (country, type, offsetX, offsetY) => {
  const path = document.querySelector(`path[data-id=${country}]`)
  
  const rect = path.getBoundingClientRect();

  var x = rect.left + offsetX * rect.width;
  var y = rect.top + offsetY * rect.height;

  var elem = `<img class="port"
                   src="static/img/${type}.jpg"
                   style="left: ${x}px; top: ${y}px;"
              />`

  $("#ports").append(elem);
}

const drawPorts = () => {
  if (window.portData) {
    portData = window.portData
    Object.keys(portData).map((country) => {
      const airports = portData[country]['airports']
      const harbours = portData[country]['harbours']

      airports.forEach((airport) => {
        const x = airport['offset_x'];
        const y = airport['offset_y'];
        const closed = airport['closed'];
        const fileName = closed ? 'airport_closed' : 'airport';
    
        addPort(country, fileName, x, y);
      })

      harbours.forEach((airport) => {
        const x = airport['offset_x'];
        const y = airport['offset_y'];
        const closed = airport['closed'];
        const fileName = closed ? 'harbour_closed' : 'harbour';
    
        addPort(country, fileName, x, y);
      })
    })
  }
}

const redrawMap = (id) => {
  if (id == "svgMap") {
    $(".svgMap-tooltip").remove();
    $("#ports").empty();
    $("#svgMap .svgMap-map-wrapper").remove();

    const date = formatDate(window.day);
    const today = formatDate(getCurrentDate());
    const todayData = window.data ? window.data[today] : {}
    const data = window.data ? window.data[date] : {}

    window.map = new svgMap({
      isClipPath: false,
      targetElementID: 'svgMap',
      initialZoom: 1,
      minZoom: 1,
      maxZoom: 1,
      data: {
        data: {
          total_cases: {
            visible: true,
            name: 'Total Cases',
            format: '{0}',
            thousandSeparator: ',',
            thresholdMax: 100000,
            thresholdMin: 0
          },
          active: {
            visible: true,
            name: 'Total Infected',
            format: '{0}',
            thousandSeparator: ',',
            thresholdMax: 100000,
            thresholdMin: 0
          },
          new_cases: {
            visible: true,
            name: 'New Infected',
            format: '{0}',
            thousandSeparator: ',',
            thresholdMax: 100000,
            thresholdMin: 0
          },
          total_deaths: {
            visible: true,
            name: 'Total Deaths',
            format: '{0}',
            thousandSeparator: ',',
            thresholdMax: 100000,
            thresholdMax: 0
          },
          new_deaths: {
            visible: true,
            name: 'New Deaths',
            format: '{0}',
            thousandSeparator: ',',
            thresholdMax: 100000,
            thresholdMin: 0
          },
          recovered: {
            visible: true,
            name: 'Total Recovered',
            format: '{0}',
            thousandSeparator: ',',
            thresholdMax: 100000,
            thresholdMax: 0
          },
          log_total_cases: {
            visible: false,
            name: 'Log Total Cases',
            format: '{0} Total Cases',
            thousandSeparator: ',',
            thresholdMax: 100,
            thresholdMin: 0
          }
        },
        applyData: 'log_total_cases',
        values: data
      }
    });

    if (todayData && needUpdate) {
      // Generate points
      $("#points").empty();
      Object.keys(data).forEach((key) => {
        generatePoints(key, getInfectedCount(date, key), data[key]['population']);
        needUpdate = false;
      });
    }

    if (data && todayData) {
      // Update points
      // Iterate through todayData to get all countries that have had data
      Object.keys(todayData).forEach((key) => {
        // If country no longer has any data - zero infections
        if (!data[key]) {
          updatePoints(key, 0, todayData[key]['population']);
        }
        // Otherwise, country still has data, access from current date's data
        else {
          updatePoints(key, getInfectedCount(date, key), data[key]['population']);
        }
      });
    }
    
  } else if (id == "svgBg") {
    // clearLayers();
    $("#svgBg .svgMap-map-wrapper").remove()

    window.bg = new svgMap({
      isClipPath: true,
      targetElementID: 'svgBg',
      initialZoom: 1,
      minZoom: 1,
      maxZoom: 1,
      data: {
        data: {
          gdp: {}
        },
        applyData: 'gdp',
        values: {}
      }
    });
  }
  drawPorts();
}

redrawMap("svgBg")

window.addEventListener("resize", function() {
  needUpdate = true; // we need an update after resize
  checkOrientation();
  redrawMap("svgBg")
  redrawMap("svgMap")
  clearHandlers()
  attachHandlers()
});

// generate css polygon (array of pts) from path
const pathToPoly = (path,samples) => {
  var doc = path.ownerDocument;
  // var poly = doc.createElementNS('http://www.w3.org/2000/svg','polygon');
  
  var points = [];
  var len  = path.getTotalLength();
  var step = step=len/samples;

  // Put each island as a separate polygon
  var curr_island = 0;
  points[curr_island] = [];

  // Track change in island
  var prev_p = path.getPointAtLength(0);
  var threshold = 100;
  
  for (var i=0;i<=len;i+=step){
    var p = path.getPointAtLength(i);

    // Old implementation: push all points
    // points.push([p.x, p.y]);

    // If same island
    if (Math.pow((p.x - prev_p.x), 2) + Math.pow((p.y - prev_p.y), 2) < threshold) {
      points[curr_island].push([p.x, p.y]);
      prev_p = p;
    }
    // If new island
    else if (i + step <= len) {
      curr_island += 1;
      points[curr_island] = [];
      prev_p = path.getPointAtLength(i+step);
    }
  }
  // poly.setAttribute('points',points.join(' '));
  return points;
}

const pointInPolygon = function (point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  var xi, xj, i, intersect,
      x = point[0],
      y = point[1],
      inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    xi = vs[i][0],
    yi = vs[i][1],
    xj = vs[j][0],
    yj = vs[j][1],
    intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// in: 2-letter abbreviation of country (ex. RU, CA, US, CN)
// out: void, generates random pt in country path 
const generatePoints = (country, infected, population) => {
  // select path element
  if (country.length != 2) return;
  
  const path = document.querySelector(`path[data-id=${country}]`);
  if (path) {
    // rectangular bounding box
    const bbox = path.getBBox();
    const area = bbox.width * bbox.height;

    // infected = population; // max dots

    // make it look nice - scale by area, infected, and population
    var numberDots = (Math.sqrt(area)/1000) * infected / Math.log(population);
    // var numberDots = 30000; // stress test
    if (numberDots > area/12)
    {
      numberDots = Math.round(area/12);
    }

    // console.log(area);
    // console.log(numberDots);

    const minX = bbox.x;
    const minY = bbox.y;
    const maxX = bbox.x + bbox.width;
    const maxY = bbox.y + bbox.height;

    // polygon representation of country
    var sampling = 200; // default sampling
    // Big/weird countries to increase sampling
    if (country === 'IT' || country === 'CN' || country === 'US' || country === 'RU' || country == 'CA') {
      sampling = 1000;
    }
    const poly = pathToPoly(path, sampling);
    
    // draw dots
    var g = d3.select("#points")
                .append("g")
                .attr("country", country)
                .attr("transform", window.transform);
    
    // let g = document.createElementNS(SVG_NS, "g");
    for (let i = 0; i < numberDots; i++) {
      let x = Math.floor(Math.random() * (maxX - minX) ) + minX;
      let y = Math.floor(Math.random() * (maxY - minY) ) + minY;
      // console.log([x, y])

      // Test each "island"
      var len = poly.length;
      for (var j = 0; j < len; j++) {
        if (pointInPolygon([x, y], poly[j])) {
          // console.log("inside");
          var size = Math.max(1.5, Math.random() * Math.log(area) / 3);

          var colour = "#670B07";
          var colourSelect = Math.random();
          if (colourSelect < 0.25) {
            colour = "#560000";
          }
          else if (colourSelect < 0.50) {
            colour = "#761E0D";
          }
          else if (colourSelect < 0.75) {
            colour = "#862B15"
          }
          
          var opacity = Math.floor(Math.random() * (1 - 0.7) ) + 0.7;
          
          g.append("circle")
                    .attr("style", `fill: ${colour}; fill-opacity: ${opacity};`)
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", size);
          break;
        }
      }
      
    }
  }
};

const updatePoints = (country, infected, population) => {
  const max = formatDate(getCurrentDate());
  const maxData = window.data ? window.data[max] : {};
  const parent = $(`g[country="${country}"]`)
  const children = parent.children();
  children.each((i, child) => {
    $(child).show();
  });
  
  if (maxData && maxData[country]) {
    const maxCases = maxData[country]['total_cases']

    // get ratio of cases of day of interest to present/max cases
    const ratio = 1 - (infected / maxCases);
    // console.log(ratio)

    const numPoints = children.length;
    const hideCount = Math.floor(ratio * numPoints);

    children.each((i, child) => {
      if (i < hideCount) {
        // console.log(child);
        $(child).hide()
      } else {
        return;
      }
    })
  }
}

const getInfectedCount = (date, selectedCountry) => {
  // Set to active - number of infections
  var infected = window.data[date][selectedCountry]['active'];
  if (infected == -1) {
    // If active doesn't exist, set to total cases
    infected = window.data[date][selectedCountry]['total_cases'];
    // If recovered exists, subtract from total cases
    recovered = window.data[date][selectedCountry]['recovered'];
    if (recovered != -1) {
      infected -= recovered;
    }
  }
  return infected;
  
  // Uncomment to not use active cases
  // return window.data[date][selectedCountry]['total_cases'];
}

var selectedCountry = 'WR';
const updateSelectedCountry = (date) => {
  if (selectedCountry == 'WR'){
    updateWorldData(date);
    fill(icon, "World", window.world_infected, window.world_dead, window.world_population);
    return;
  }
  // populate data
  const name = window.map.countries[selectedCountry];
  const flag = `https://cdn.jsdelivr.net/gh/hjnilsson/country-flags@latest/svg/${selectedCountry.toLowerCase()}.svg`;
  let infected, dead, population;
  if (window.data[date][selectedCountry]) {
    infected = getInfectedCount(date, selectedCountry);
    dead = window.data[date][selectedCountry]['total_deaths'];
    population = window.data[date][selectedCountry]['population'];
  } else {
    infected = 'No data';
    dead = 'No data';
    population = '0';
  }
  fill(flag, name, infected, dead, population);
}

const updateWorldData = (date) => {
  // populate world data
  window.world_infected = getInfectedCount(date, 'WR');
  window.world_dead = data[date]['WR']['total_deaths'];
  window.world_population = 7771104755;
}

const update = () => {
  var date = formatDate(window.day);

  if (data_loaded &&
      news_loaded &&
      ports_loaded) {
    redrawMap("svgMap");
    attachHandlers();
    updateWorldData(date);
    updateSelectedCountry(date);
    fillNewsBar(date);
    setNewsToCurrDate();
  }
}

var data_loaded = false;
socket.on('load_finish', (data) => {
  console.log(data)
  window.data = data
  
  data_loaded = true;
  initSlider();
  update();
});

var news_loaded = false;
socket.on('news_loaded', (data) => {
  console.log(data);
  window.newsData = data;
  populateNews();

  news_loaded = true;
  update();
});

var ports_loaded = false;
socket.on('ports_loaded', (data) => {
  window.portData = data;

  ports_loaded = true;
  update();
})

const clearHandlers = () => {
  $('path[id^="svgMap-map-country"]').off();
  $('.svgMap-map-wrapper').off();
}

const attachHandlers = () => {
  $('path[id^="svgMap-map-country"]').on("click touchstart", (e) => {
    e.stopPropagation();
    const country = e.target.getAttribute("data-id");

    const date = formatDate(window.day);

    selectedCountry = country;

    updateSelectedCountry(date);
  });

  $('.svgMap-map-wrapper').on("click touchstart", (e) => {
    fill(icon, "World", window.world_infected, window.world_dead, window.world_population);
  });
}
