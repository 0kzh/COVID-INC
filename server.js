// dependencies
var express = require('express');
var http = require('http');
const https = require('https');
const request = require('request');
var fs = require('fs');
var ioServer = require('socket.io');
var app = express();

const privateKey = fs.readFileSync('/etc/letsencrypt/live/covidinc.io/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/covidinc.io/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/covidinc.io/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// start http and https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

var io = new ioServer();
io.attach(httpServer);
io.attach(httpsServer);


// serve front-end website
app.all('*', httpsRedir);
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
  request('***REMOVED***' + day, (error, response, body) => {
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



const PORT = process.env.NODE_ENV == 'production' ? 80 : 3000;
httpServer.listen(PORT, function () {
  console.log('HTTP server running on port ' + PORT);
});

httpsServer.listen(443, function () {
  console.log('HTTPS server running on port 443');
});
