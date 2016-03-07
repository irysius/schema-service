'use strict';

var _ = require('lodash');
var fs = require('fs');
var PATH = require('path');
var validate = require('jsonschema').validate;

function validateData(data, schema) {
	return Promise.resolve().then(function () {
		if (!schema) {
			throw new Error('No schema provided when validating data.');
		}
		var results = validate(data, schema);
		if (results.errors.length > 0) {
			var message = 'Schema Validation Error (' + schema.description + ')';
			var error = new Error(message);
			error.instance = results.instance;
			error.errors = results.errors;
			throw error;
		}
		return results.instance;
	});
}

function SchemaService() {
	var schemas;

	function initializeSchemas(schemaFolder) {
		console.info('SchemaService initializing.');
		schemas = {};
		var records = [];
		try {
			records = fs.readdirSync(schemaFolder);
		} catch (e) {/* Ignore missing folder errors */}

		var names = records.filter(function (x) {
			return x.endsWith('.json');
		}).map(function (x) {
			return x.replace(/\.json$/, '');
		});

		names.forEach(function (name) {
			var path = PATH.resolve(PATH.join(schemaFolder, name + '.json'));
			try {
				var rawText = fs.readFileSync(path, 'utf8');
				var json = JSON.parse(rawText);
				schemas[name] = json;
			} catch (e) {
				console.error('Error reading schema from: ' + path);
				console.error(e);
			}
		});
		return Promise.resolve();
	}

	var proxy = {
		initialize: initializeSchemas
	};

	Object.defineProperty(proxy, 'schemas', {
		enumerable: true,
		get: function get() {
			if (!schemas) {
				throw new Error('Schemas not initialized.');
			}
			return schemas;
		}
	});

	return proxy;
}

SchemaService.validate = validateData;

module.exports = SchemaService;
