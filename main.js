'use strict';
//jshint white:false

var express = require('express');
var db = require('./db');
var resource = require('./resource');

var connection = db({
	port: '3306',
	host: '192.168.1.16',
	user: 'root',
	password: 'alreadybeend0ne',
	database: 'estahecho',
});

var app = express();
app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
});

function e(err) {
	console.error(err);
}

function createResource(name, plural) {
	plural = plural || name + 's';
	var handler = resource(connection, name);
	console.log('Creting resource REST', name);

	app.get(   '/v0/' + plural,          function(req, res) { handler.findAll()                      .then(res.send, e) });
	app.get(   '/v0/' + plural + '/:id', function(req, res) { handler.findById(req.params.id)        .then(res.send, e) });
	app.post(  '/v0/' + plural,          function(req, res) { debugger; handler.add(req.body)                  .then(res.send, e) });
	app.put(   '/v0/' + plural + '/:id', function(req, res) { handler.update(req.params.id, req.body).then(res.send, e) });
	app.delete('/v0/' + plural + '/:id', function(req, res) { handler.del(req.params.id)             .then(res.send, e) });
}

app.get('/v0/startup', function(req, res) {
	res.jsonp([{
		id: 0,
		name: 'Sunrise',
		description: 'Building a better calendar',
		url: 'http://www.sunrise.am/'
	}, {
		id: 1,
		name: 'Stellarkite',
		description: 'Stellarkite is a multidisciplinary group of scientists ' +
			'and engineers born to geekify the world',
		url: 'http://www.stellarkite.com'
	}, {
		id: 2,
		name: 'Lovely',
		description: 'Building a platform for apartment rentals - a $10bn market opportunity',
		url: 'http://livelovely.com/'
	}]);
});

app.get('/v0/startup/search', function(req, res) {
	var query = req.params.query;
	return connection.single('SELECT * FROM ' + name + ' WHERE name=? OR description=?', query, query)
		.spread(function(results, rows) { return rows });
});

createResource('startup');

app.listen(3000);
console.log('Listening on localhost:3000');
