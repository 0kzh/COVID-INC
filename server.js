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

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

function getCases(day, callback){
  request('https://af18f64x36.execute-api.us-east-1.amazonaws.com/prod/coronavirus?day=' + day, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var importedJSON = JSON.parse(body);
      callback(importedJSON);
    }
  })
}

const now = formatDate(new Date());
io.on('connection', function(socket){
  socket.on('get_cases', function(day=now){
    getCases(day, (json) => {
      socket.json.emit('load_finish', json);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log('server running on port ' + PORT);
});
