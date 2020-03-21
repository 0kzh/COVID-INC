// dependencies
var express = require('express');
var http = require('http');
const https = require('https');
const request = require('request');
var fs = require('fs');
var ioServer = require('socket.io');
var app = express();

const IS_PRODUCTION = process.env.NODE_ENV == 'production';
const PORT = IS_PRODUCTION ? 80 : 3000;
// start http server
const httpServer = http.createServer(app);

var io = new ioServer();
io.attach(httpServer);

// start https if prod
if (IS_PRODUCTION) {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/covidinc.io/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/covidinc.io/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/covidinc.io/chain.pem', 'utf8');
  
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  const httpsServer = https.createServer(credentials, app);
  io.attach(httpsServer);
  
  app.all('*', httpsRedir);

  httpsServer.listen(443, function () {
    console.log('HTTPS server running on port 443');
  });
}

httpServer.listen(PORT, function () {
  console.log('HTTP server running on port ' + PORT);
});

// serve front-end website
app.use(express.static('./client'));

function httpsRedir(req, res, next) {
  if(req.secure){
    return next();
  };
  res.redirect('https://' + req.hostname + req.url);
}

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

function getNews(callback) {
  request('https://6ezcou7jl9.execute-api.us-east-1.amazonaws.com/default/news', (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var importedJSON = JSON.parse(body);
      callback(importedJSON);
    }
  })
}

function readJsonFileSync(filepath, encoding){
  if (typeof (encoding) == 'undefined'){
      encoding = 'utf8';
  }

  const file = fs.readFileSync(filepath, encoding);
  return JSON.parse(file);
}

function getPorts() {
  const filepath = __dirname + '/ports.json';
  return readJsonFileSync(filepath);
}

const now = formatDate(new Date());
io.on('connection', function(socket){
  socket.on('get_cases', function(day=now){
    getCases(day, (json) => {
      socket.json.emit('load_finish', json);
    });
  });

  socket.on('get_news', function() {
    console.log("getting news");
    getNews((json) => {
      console.log(json);
      socket.json.emit('news_loaded', json);
    });
  });

  socket.on('get_ports', function(){
    const jsonPorts = getPorts();
    socket.json.emit('ports_loaded', jsonPorts);
  });
});
