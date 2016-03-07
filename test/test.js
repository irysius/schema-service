/* globals describe, it, before, after, __dirname */
if (typeof Promise === 'undefined') {
	require('babel-polyfill');
	console.info('Using babel-polyfill');	
}

var expect = require('chai').expect;
var PATH = require('path');
var SchemaService = require('./../dist/SchemaService');
var schemaPath = PATH.resolve(__dirname, './schemas');

describe('schema-service', function () {
	it('is expected to load schemas from a folder', function (done) {
		var schemaService = SchemaService();
		schemaService.initialize(schemaPath).then(function () {
			expect(schemaService.schemas).to.contain.keys('inbound', 'configuration');
		}).then(function () {
			done();	
		}).catch(function (err) {
			done(err);
		});
	});
	
	it('is expected to reject invalid objects', function (done) {
		var schemaService = SchemaService();
		var invalidObject = {};
		schemaService.initialize(schemaPath).then(function () {
			return schemaService.validate(
				invalidObject,
				schemaService.schemas['inbound']).then(function (result) {
					throw new Error('Expected invalid object to throw validation error.');
				}).catch(function (err) {
					expect(err).to.contain.keys('instance', 'errors');
				});
		}).then(function () {
			done();
		}).catch(function (err) {
			done(err);
		});
	});
	
	it('is expected to allow valid objects', function (done) {
		var schemaService = SchemaService();
		var validObject = {
			name: "eman",
			age: 21
		};
		schemaService.initialize(schemaPath).then(function () {
			return schemaService.validate(
				validObject,
				schemaService.schemas['inbound']).then(function (result) {
					expect(result).to.eql(validObject);
				});
		}).then(function () {
			done();	
		}).catch(function (err) {
			done(err);
		});
	});
});