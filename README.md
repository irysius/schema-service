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
		return SchemaService.validate(
			{}, // config object
			schemaService.schemas['configuration']).then(instance => {
				// continue working with the validated object.
			}).catch(err => {
				// handle validation error.
			});
	});
	
For consistency with my other services, initialize always returns a Promise.

The above example assumes a file at `./schemas/configuration.json` exists, that follows the format specified by [json-schema](http://json-schema.org).

## API
### SchemaService.validate
`SchemaService.validate(data: any, schema: any) => Promise<any>`

Validates given object data against provided schema. 

If the data validates, returns the data wrapped in a Promise.

If the data isn't valid, returns an Error object with the additional fields: `instance` and `errors`, for further inspection.
 
### instance.initialize
`instance.initialize(schemaFolder: String) => Promise`

Goes through the provided folder and attaches all json files to `instance.schemas`.

You gain access to the different schemas by referring to them by filename in `instance.schemas`.

For example, if the file `outbound.json` exists in the schema folder, then you can access its contents via `instance.schemas['outbound']`.

### instance.schemas
`instance.schemas`

Returns a hash of all schemas located via `instance.initialize`.

If this property is accessed before initializing the service, the service throws an error.