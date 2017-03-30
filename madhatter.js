"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "madhatter",
			"path": "madhatter/madhatter.js",
			"file": "madhatter.js",
			"module": "madhatter",
			"author": "Richeve S. Bebedor",
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/madhatter.git",
			"test": "madhatter-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Checks for syntax error and unused variable.

		Returns false if there's no error.

		Returns an error or true if erroneous.
	@end-module-documentation

	@include:
		{
			"asea": "asea",
			"esprima": "esprima",
			"lire": "lire",
			"check": "syntax-error",
			"unused": "unused"
		}
	@end-include
*/

const asea = require( "asea" );
const esprima = require( "esprima" );

//: @server:
const check = require( "syntax-error" );
const lire = require( "lire" );
const unused = require( "unused" );
//: @end-server

const FILE_PATH_PATTERN = /^(\.*\~*\/*[a-zA-Z0-9\_\-\.\~]+)+(\.[a-zA-Z0-9\_\-]+)+$/;

const madhatter = function madhatter( script ){
	/*;
		@meta-configuration:
			{
				"script:required": "string"
			}
		@end-meta-configuration
	*/

	if( asea.client ){
		try{
			esprima.parse( script );

		}catch( error ){
			return new Error( `parse error, ${ error.stack }` );
		}

		return false;

	}else if( asea.server ){
		if( FILE_PATH_PATTERN.test( script ) ){
			try{
				script = lire( script, true );

			}catch( error ){
				return new Error( `cannot read script file, ${ error.stack }` );
			}
		}

		try{
			esprima.parse( script );

		}catch( error ){
			return new Error( `parse error, ${ error.stack }` );
		}

		let error = check( script );

		if( error ){
			return new Error( `syntax error, ${ error.stack }` );
		}

		let unusedVariable = unused( script )
			.filter( function onEachUnused( variable ){
				return !variable.param;
			} )
			.map( function onEachUnused( variable ){
				let { name, loc } = variable;

				return `${ name }:( ${ loc.line }, ${ loc.column } )`;
			} );

		if( unusedVariable.length ){
			return new Error( `error unused variable, ${ unusedVariable.join( ", " ) }, ${ script }` );
		}

		return false;
	}

	//: This is erroneous.
	return true;
};

module.exports = madhatter;
