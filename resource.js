'use strict';

var _ = require('underscore');

function resource(connection, name) {
	return {
		findAll: function() {
			console.log('Retrieving resource --[', name, ']--');
			return connection.single('SELECT * FROM ' + name).spread(function(results, rows) { return rows });
		},

		findById: function(id) {
			console.log('Retrieving resource --[', name, ']-- id --[', id, ']--');
			var query = 'SELECT * FROM ' + name + ' WHERE ?';
			return connection.single(query, { id: id }).spread(function(results, rows) { return rows });
		},

		add: function(data) {
			console.log('Adding resource --[', name, ']--', data);
			var values = _.values(data);
			var params = new Array(values.length + 1).join('?').split().join(', ');
			var query = 'INSERT INTO ' + name + ' (' + _.keys(data) + ') VALUES (' + params + ')';
			return connection.single(query, values).then(function() { return data });
		},

		update: function(id, data) {
			console.log('Updating resource --[', name, ']-- id --[', id, ']--', data);
			var query = 'UPDATE ' + name + ' SET ? WHERE id="' + id + '"';
			return connection.single(query, data).then(function() { return data });
		},

		del: function(id) {
			console.log('Deleting resource --[', name, ']-- id --[', id, ']--');
			return connection.single('DELETE FROM ' + name + ' WHERE ?', { id: id }).then(function() { return id });
		}
	};
}

module.exports = resource;
