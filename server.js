// dependencies
var express = require('express');
var http = require('http');
const request = require('request');
var fs = require('fs');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// serve front-end website
app.use(express.static('./client'));

function readJsonFileSync(filepath, encoding){
  if (typeof (encoding) == 'undefined'){
      encoding = 'utf8';
  }

  const file = fs.readFileSync(filepath, encoding);
  return JSON.parse(file);
}

// locationId is id corresponding to location w/ respect to Google Places API
function getPhotos(locationId, callback){
  request('https://shotspot-server.s3.amazonaws.com/' + locationId + ".json", (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var importedJSON = JSON.parse(body);
      //  console.log(importedJSON);
      callback(importedJSON);
    }
  })
}

io.on('connection', function(socket){
  socket.on('load_city', function(locationId){
    getPhotos(locationId, (json) => {
      socket.json.emit('load_finish', json);
      // console.log(json);
    });
  });

  socket.on('place_location', function(data) {
    const obj = getPhotos("custom");
    const pos = data.pos;
    const name = data.name;
    const url = data.url;

    obj.locations.push({
      name: name,
      id: "-1",
      lat: pos.lat,
      long: pos.lng,
      photos: [url],
      urls: []
    })
    const toWrite = JSON.stringify(obj, null, 4); // pretty-print json
    console.log(toWrite)
    fs.writeFile(__dirname + '/locations/custom.json', toWrite, 'utf8', () => {
      socket.emit('update_custom');
    });
  })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log('server running on port ' + PORT);
});
