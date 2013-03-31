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

function listener(callback) {
	return function(req, res) {
		callback(req).then(function(data) {
			console.log('[SUCCEED]', data);
			res.status(200).send(data);
		}, function(err) {
			console.error('[ERROR]', err);
			res.status(500).send(null);
		});
	};
}

function createResource(name, plural) {
	plural = plural || name + 's';
	var handler = resource(connection, name);
	console.log('Creting resource REST', name);

	app.get(   '/v0/' + plural,          listener(function(req) { return handler.findAll() }));
	app.get(   '/v0/' + plural + '/:id', listener(function(req) { return handler.findById(req.params.id) }));
	app.post(  '/v0/' + plural,          listener(function(req) { return handler.add(req.body) }));
	app.put(   '/v0/' + plural + '/:id', listener(function(req) { return handler.update(req.params.id, req.body) }));
	app.delete('/v0/' + plural + '/:id', listener(function(req) { return handler.del(req.params.id) }));
}

app.get('/v0/startups-search', function(req, res) {
	console.log(req.query);
	var query = '%' + req.query.query + '%';
	return connection.single('SELECT * FROM startup WHERE name LIKE ? OR short_desc LIKE ?', [ query, query ]).then(function(results) {
		res.status(200).jsonp(results);
	}, function(err) {
		res.status(500).send(null);
	});
});

createResource('startup');

app.listen(3000);
console.log('Listening on localhost:3000');
