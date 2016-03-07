#Schema Service

Relies on a global implementation of Promise.

This service assumes an application that takes a very particular shape, and may not be applicable for all purposes.

It is intended to load a bunch of schemas in a folder, and provide helper methods for validating javascript objects against these loaded schemas.

For all paths, it is suggested an absolute path be provided.

## Installation

	$ npm install @irysius/schema-service
	
## Usage

To instantiate a service:

	var SchemaService = require('@irysius/schema-service');
	var schemaService = SchemaService();
	
Before using it, you need to initialize the service with the schema folder's location:

	schemaService.initialize('./schemas').then(() => {
		return schemaService.validate(
			{}, // config object
			schemaService.schemas['configuration']).then(instance => {
				// continue working with the validated object.
			}).catch(err => {
				// handle validation error.
			});
	});
	
For consistency with my other services, initialize always returns a Promise.

The above example assumes a file at `./schemas/configuration.json` exists, that follows the format specified by [json-schema](http://json-schema.org)