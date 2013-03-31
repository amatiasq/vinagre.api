'use strict';

var _ = require('underscore');
var mysql = require('mysql');
var Promise = require('./promise');

var connection = {
	connect: function() {
		//this.client.connect();
	},

	close: function() {
		//this.client.end();
	},

	execute: function(sql, params) {
		var prom = new Promise();
		console.log('[DB] Executing --[', sql, ']-- with params --[', params, ']--');
		this.client.query(sql, params, function(err, results, fields) {
			if (err) return prom.reject(err);
			prom.resolve(results);
		});
		return prom.future;
	},

	single: function(sql, params) {
		this.connect();
		return this.execute(sql, params).fin(this.close.bind(this));
	}
};

function init(options) {
	var client = mysql.createConnection(_.extend({
		host: '127.0.0.1',
		port: '3306',
	}, options));

	return Object.create(connection, {
		client: {
			get: function() {
				return client;
			}
		}
	});
}

module.exports = init;
