var config = require('./config');
var fs = require('fs');
var express = require('express');
var app = express();

var ssi = require("ssi");
var ssiParser = new ssi();

config.staticFolders.forEach(function(staticFolder){
	app.use(staticFolder, express.static(config.siteRoot.concat(staticFolder)));
});

app.get('/', function (req, res) {
	console.log(config.siteRoot.concat(config.indexFile));
	res.sendFile(config.siteRoot.concat(config.indexFile));
});

app.get(config.ssiFilePattern, function (req, res) {
	var fileName = config.siteRoot.concat(req.originalUrl);
	console.log('SSI GET ' + fileName);
	fs.readFile(fileName, function(err, fileContents) {
		if(err && err.code == 'ENOENT') {
			console.log('404');
			res.status(404).end();
			return;
		}
		var html = ssiParser.parse(fileName, fileContents.toString());
		res.send(html.contents);
    });
});

app.post('*', function (req, res) {
    console.log('POST ' + req.originalUrl);
    res.sendFile(config.siteRoot.concat(req.originalUrl));
});

var server = app.listen(config.expressPort, function () {
  console.log('SSI server listening at http://localhost:%s', server.address().port);
});