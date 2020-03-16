var socket = io();
const SVG_NS = "http://www.w3.org/2000/svg";
const icon = "https://cdn.mos.cms.futurecdn.net/JtVH5Khvihib7dBDFY9ZDR.jpg"

socket.emit('get_cases');

const redrawMap = (id) => {
  if (id == "svgMap") {
    $("#svgMap .svgMap-map-wrapper").remove()
    $("#points").empty()
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
            format: '{0} Total Cases',
            thousandSeparator: ',',
            thresholdMax: 100000,
            thresholdMin: 1
          },
          log_total_cases: {
            visible: false,
            name: 'Log Total Cases',
            format: '{0} Total Cases',
            thousandSeparator: ',',
            thresholdMax: 12,
            thresholdMin: 1
          }
        },
        applyData: 'log_total_cases',
        values: window.data ? window.data : {}
      }
    });

    if (window.data) {
      // generate points
      Object.keys(window.data).forEach((key) => {
        generatePointInCountry(key, window.data[key]['total_cases'], window.data[key]['population'])
      });
    }
    
  } else if (id == "svgBg") {
    $("#svgBg .svgMap-map-wrapper").remove()
    window.bg = new svgMap({
      isClipPath: true,
      targetElementID: 'svgBg',
      initialZoom: 1,
      minZoom: 1,
      maxZoom: 1,
      data: {
        data: {
          gdp: {
            name: 'GDP per capita',
            format: '{0} USD',
            thousandSeparator: ',',
            thresholdMax: 50000,
            thresholdMin: 1000
          },
          change: {
            name: 'Change to year before',
            format: '{0} %'
          }
        },
        applyData: 'gdp',
        values: {
          AF: {gdp: 587, change: 4.73},
          AL: {gdp: 4583, change: 11.09},
          DZ: {gdp: 4293, change: 10.01}
          // ...
        }
      }
    });
  }
}

redrawMap("svgBg")

window.addEventListener("resize", function() {
  checkOrientation();
  redrawMap("svgBg")
  redrawMap("svgMap")
});

// generate css polygon (array of pts) from path
const pathToPoly = (path,samples) => {
  var doc = path.ownerDocument;
  // var poly = doc.createElementNS('http://www.w3.org/2000/svg','polygon');
  
  var points = [];
  var len  = path.getTotalLength();
  var step = step=len/samples;
  for (var i=0;i<=len;i+=step){
    var p = path.getPointAtLength(i);
    points.push([p.x, p.y]);
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
const generatePointInCountry = (country, infected, population) => {
  // select path element
  const path = document.querySelector(`path[data-id=${country}]`);
  if (path) {
    // rectangular bounding box
    const bbox = path.getBBox();
    const area = bbox.width * bbox.height;

    const numberDots = infected / Math.log(population);
    console.log(numberDots)

    const minX = bbox.x;
    const minY = bbox.y;
    const maxX = bbox.x + bbox.width;
    const maxY = bbox.y + bbox.height;

    // polygon representation of country
    const poly = pathToPoly(path, 100);
    // console.log(poly)
    
    // draw dots
    var g = d3.select("#points")
                .append("g")
                .attr("transform", window.transform);
    
    // let g = document.createElementNS(SVG_NS, "g");
    for (let i = 0; i < numberDots; i++) {
      let x = Math.floor(Math.random() * (maxX - minX) ) + minX;
      let y = Math.floor(Math.random() * (maxY - minY) ) + minY;
      // console.log([x, y])
      if (pointInPolygon([x, y], poly)) {
        // console.log("inside");
        g.append("circle")
                  .attr("style", "fill: #670B07;")
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", 1.2);
      }
    }
  }
};

socket.on('load_finish', (data) => {
  console.log(data)
  window.data = data

  redrawMap("svgMap")

  // populate world data
  window.world_infected = data['WR']['total_cases']
  window.world_dead = data['WR']['total_deaths']
  window.world_population = 7771104755
  fill(icon, "World", window.world_infected, window.world_dead, window.world_population)

  attachHandlers();
})

const attachHandlers = () => {
  $('path[id^="svgMap-map-country"]').click((e) => {
    e.stopPropagation();
    const country = e.target.getAttribute("data-id")
    const flag = `https://cdn.jsdelivr.net/gh/hjnilsson/country-flags@latest/svg/${country.toLowerCase()}.svg`
    const name = window.map.countries[country]

    var infected, dead, population;
    if (window.data[country]) {
      infected = window.data[country]['total_cases']
      dead = window.data[country]['total_deaths']
      population = window.data[country]['population']
    } else {
      infected = 'No data'
      dead = 'No data'
      population = '0'
    }

    fill(flag, name, infected, dead, population)
  });

  $('.svgMap-map-wrapper').click((e) => {
    fill(icon, "World", window.world_infected, window.world_dead, window.world_population)
  });
}
