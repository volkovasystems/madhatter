"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
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
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/madhatter.git",
			"test": "madhatter-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Returns false if there's no error.

		Returns an error or true if erroneous.
	@end-module-documentation

	@example:
	@end-example

	@include:
		{
			"asea": "asea",
			"fs": "fs",
			"esprima": "esprima",
			"check": "syntax-error"
		}
	@end-include
*/

if( typeof window == "undefined" ){
	var asea = require( "asea" );
	var fs = require( "fs" );
	var esprima = require( "esprima" );
	var check = require( "syntax-error" );
}

if( typeof window != "undefined" &&
	!( "asea" in window ) )
{
	throw new Error( "asea is not defined" );
}

if( asea.client &&
	!( "esprima" in window ) )
{
	throw new Error( "esprima is not defined" );
}

var madhatter = function madhatter( script ){
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
			return error;
		}

		return false;

	}else if( asea.server ){
		if( ( /^(\.*\~*\/*[a-zA-Z0-9\_\-\.\~]+)+(\.[a-zA-Z0-9\_\-]+)+$/ ).test( script ) ){
			try{
				fs.accessSync( script );

			}catch( error ){
				return error;
			}

			script = fs.readFileSync( script, "utf8" );
		}

		try{
			esprima.parse( script );

		}catch( error ){
			return error;
		}

		return check( script ) || false;
	}

	//: This is erroneous.
	return true;
};

if( asea.server ){
	module.exports = madhatter;
}
