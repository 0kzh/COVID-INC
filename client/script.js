const SVG_NS = "http://www.w3.org/2000/svg";

new svgMap({
  isClipPath: false,
  targetElementID: 'svgMap',
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

new svgMap({
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
const generatePointInCountry = (country) => {
  // select path element
  const path = document.querySelector(`path[data-id=${country}]`);

  // rectangular bounding box
  const bbox = path.getBBox();

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
  for (let i = 0; i < 1500; i++) {
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
      // drawCircle({ cx: x, cy: y, r: 1 }, g);
    }
  }
  // svg.append(g);
  // console.log(bbox);
  

};

generatePointInCountry("CN");