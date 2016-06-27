var _ = require('lodash');
var fs = require('fs');
var PATH = require('path');
var Logger = require('@irysius/utils').Logger;
var validate = require('jsonschema').validate;

function validateData(data, schema) {
	return Promise.resolve().then(() => {
		if (!schema) { throw new Error('No schema provided when validating data.'); }
		var results = validate(data, schema);
		if (results.errors.length > 0) {
			let message = `Schema Validation Error (${schema.description})`;
			let error = new Error(message);
			error.instance = results.instance;
			error.errors = results.errors;
			throw error;
		}
		return results.instance;
	});
}

function SchemaService({ logger = null } = {}) {
	logger = logger || Logger.silent();
	if (!Logger.isLoggerValid(logger)) {
		throw new Error('SchemaService is passed an invalid logger.');
	}

	var schemas;
	
	function initializeSchemas(schemaFolder) {
		logger.info('SchemaService initializing.');
		schemas = {};
		var records = [];
		try {
			records = fs.readdirSync(schemaFolder);
		} catch (e) { /* Ignore missing folder errors */ }
		
		var names = records
			.filter(x => x.endsWith('.json'))
			.map(x => x.replace(/\.json$/, ''));
		
		names.forEach(name => {
			let path = PATH.resolve(PATH.join(schemaFolder, name + '.json'));
			try {
				let rawText = fs.readFileSync(path, 'utf8');
				let json = JSON.parse(rawText);
				schemas[name] = json;
			} catch (e) {
				logger.error(`Error reading schema from: ${path}`);
				logger.error(e);
			}
		});
		return Promise.resolve(schemas);
	}
	
	var proxy = {
		initialize: initializeSchemas
	};
	
	Object.defineProperty(proxy, 'schemas', {
		enumerable: true,
		get: () => {
			if (!schemas) { throw new Error('Schemas not initialized.'); }
			return schemas;
		}
	});
	
	return proxy;
}

SchemaService.validate = validateData;

module.exports = SchemaService;