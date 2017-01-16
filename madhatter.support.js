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
			"fs": "fs",
			"esprima": "esprima",
			"check": "syntax-error",
			"unused": "unused"
		}
	@end-include
*/

var asea = require("asea");
var esprima = require("esprima");

if (asea.SERVER) {
	var _check = require("syntax-error");
	var _fs = require("fs");
	var _unused = require("unused");
}

var madhatter = function madhatter(script) {
	/*;
 	@meta-configuration:
 		{
 			"script:required": "string"
 		}
 	@end-meta-configuration
 */

	if (asea.client) {
		try {
			esprima.parse(script);
		} catch (error) {
			return error;
		}

		return false;
	} else if (asea.server) {
		if (/^(\.*\~*\/*[a-zA-Z0-9\_\-\.\~]+)+(\.[a-zA-Z0-9\_\-]+)+$/.test(script)) {
			try {
				fs.accessSync(script);
			} catch (error) {
				return error;
			}

			script = fs.readFileSync(script, "utf8");
		}

		try {
			esprima.parse(script);
		} catch (error) {
			return error;
		}

		var error = check(script);

		if (error) {
			return error;
		}

		var unusedVariable = unused(script).filter(function onEachUnused(variable) {
			return !variable.param;
		}).map(function onEachUnused(variable) {
			var name = variable.name,
			    loc = variable.loc;


			return name + ":( " + loc.line + ", " + loc.column + " )";
		});

		if (unusedVariable.length) {
			return new Error("error unused variable, " + unusedVariable.join(", ") + ", " + script);
		}

		return false;
	}

	//: This is erroneous.
	return true;
};

module.exports = madhatter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hZGhhdHRlci5qcyJdLCJuYW1lcyI6WyJhc2VhIiwicmVxdWlyZSIsImVzcHJpbWEiLCJTRVJWRVIiLCJjaGVjayIsImZzIiwidW51c2VkIiwibWFkaGF0dGVyIiwic2NyaXB0IiwiY2xpZW50IiwicGFyc2UiLCJlcnJvciIsInNlcnZlciIsInRlc3QiLCJhY2Nlc3NTeW5jIiwicmVhZEZpbGVTeW5jIiwidW51c2VkVmFyaWFibGUiLCJmaWx0ZXIiLCJvbkVhY2hVbnVzZWQiLCJ2YXJpYWJsZSIsInBhcmFtIiwibWFwIiwibmFtZSIsImxvYyIsImxpbmUiLCJjb2x1bW4iLCJsZW5ndGgiLCJFcnJvciIsImpvaW4iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0RBLElBQU1BLE9BQU9DLFFBQVMsTUFBVCxDQUFiO0FBQ0EsSUFBTUMsVUFBVUQsUUFBUyxTQUFULENBQWhCOztBQUVBLElBQUlELEtBQUtHLE1BQVQsRUFBaUI7QUFDaEIsS0FBTUMsU0FBUUgsUUFBUyxjQUFULENBQWQ7QUFDQSxLQUFNSSxNQUFLSixRQUFTLElBQVQsQ0FBWDtBQUNBLEtBQU1LLFVBQVNMLFFBQVMsUUFBVCxDQUFmO0FBQ0E7O0FBRUQsSUFBTU0sWUFBWSxTQUFTQSxTQUFULENBQW9CQyxNQUFwQixFQUE0QjtBQUM3Qzs7Ozs7Ozs7QUFRQSxLQUFJUixLQUFLUyxNQUFULEVBQWlCO0FBQ2hCLE1BQUc7QUFDRlAsV0FBUVEsS0FBUixDQUFlRixNQUFmO0FBRUEsR0FIRCxDQUdDLE9BQU9HLEtBQVAsRUFBYztBQUNkLFVBQU9BLEtBQVA7QUFDQTs7QUFFRCxTQUFPLEtBQVA7QUFFQSxFQVZELE1BVU0sSUFBSVgsS0FBS1ksTUFBVCxFQUFpQjtBQUN0QixNQUFNLHlEQUFGLENBQThEQyxJQUE5RCxDQUFvRUwsTUFBcEUsQ0FBSixFQUFrRjtBQUNqRixPQUFHO0FBQ0ZILE9BQUdTLFVBQUgsQ0FBZU4sTUFBZjtBQUVBLElBSEQsQ0FHQyxPQUFPRyxLQUFQLEVBQWM7QUFDZCxXQUFPQSxLQUFQO0FBQ0E7O0FBRURILFlBQVNILEdBQUdVLFlBQUgsQ0FBaUJQLE1BQWpCLEVBQXlCLE1BQXpCLENBQVQ7QUFDQTs7QUFFRCxNQUFHO0FBQ0ZOLFdBQVFRLEtBQVIsQ0FBZUYsTUFBZjtBQUVBLEdBSEQsQ0FHQyxPQUFPRyxLQUFQLEVBQWM7QUFDZCxVQUFPQSxLQUFQO0FBQ0E7O0FBRUQsTUFBSUEsUUFBU1AsTUFBT0ksTUFBUCxDQUFiOztBQUVBLE1BQUlHLEtBQUosRUFBVztBQUNWLFVBQU9BLEtBQVA7QUFDQTs7QUFFRCxNQUFJSyxpQkFBaUJWLE9BQVFFLE1BQVIsRUFDbkJTLE1BRG1CLENBQ1gsU0FBU0MsWUFBVCxDQUF1QkMsUUFBdkIsRUFBaUM7QUFDekMsVUFBTyxDQUFDQSxTQUFTQyxLQUFqQjtBQUNBLEdBSG1CLEVBSW5CQyxHQUptQixDQUlkLFNBQVNILFlBQVQsQ0FBdUJDLFFBQXZCLEVBQWlDO0FBQUEsT0FDaENHLElBRGdDLEdBQ2xCSCxRQURrQixDQUNoQ0csSUFEZ0M7QUFBQSxPQUMxQkMsR0FEMEIsR0FDbEJKLFFBRGtCLENBQzFCSSxHQUQwQjs7O0FBR3RDLFVBQVdELElBQVgsV0FBdUJDLElBQUlDLElBQTNCLFVBQXNDRCxJQUFJRSxNQUExQztBQUNBLEdBUm1CLENBQXJCOztBQVVBLE1BQUlULGVBQWVVLE1BQW5CLEVBQTJCO0FBQzFCLFVBQU8sSUFBSUMsS0FBSiw2QkFBc0NYLGVBQWVZLElBQWYsQ0FBcUIsSUFBckIsQ0FBdEMsVUFBd0VwQixNQUF4RSxDQUFQO0FBQ0E7O0FBRUQsU0FBTyxLQUFQO0FBQ0E7O0FBRUQ7QUFDQSxRQUFPLElBQVA7QUFDQSxDQS9ERDs7QUFpRUFxQixPQUFPQyxPQUFQLEdBQWlCdkIsU0FBakIiLCJmaWxlIjoibWFkaGF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qO1xuXHRAbW9kdWxlLWxpY2Vuc2U6XG5cdFx0VGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cdFx0QG1pdC1saWNlbnNlXG5cblx0XHRDb3B5cmlnaHQgKEBjKSAyMDE3IFJpY2hldmUgU2lvZGluYSBCZWJlZG9yXG5cdFx0QGVtYWlsOiByaWNoZXZlLmJlYmVkb3JAZ21haWwuY29tXG5cblx0XHRQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5cdFx0b2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuXHRcdGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcblx0XHR0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5cdFx0Y29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5cdFx0ZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuXHRcdFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuXHRcdGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblx0XHRUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5cdFx0SU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5cdFx0RklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5cdFx0QVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuXHRcdExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5cdFx0T1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblx0XHRTT0ZUV0FSRS5cblx0QGVuZC1tb2R1bGUtbGljZW5zZVxuXG5cdEBtb2R1bGUtY29uZmlndXJhdGlvbjpcblx0XHR7XG5cdFx0XHRcInBhY2thZ2VcIjogXCJtYWRoYXR0ZXJcIixcblx0XHRcdFwicGF0aFwiOiBcIm1hZGhhdHRlci9tYWRoYXR0ZXIuanNcIixcblx0XHRcdFwiZmlsZVwiOiBcIm1hZGhhdHRlci5qc1wiLFxuXHRcdFx0XCJtb2R1bGVcIjogXCJtYWRoYXR0ZXJcIixcblx0XHRcdFwiYXV0aG9yXCI6IFwiUmljaGV2ZSBTLiBCZWJlZG9yXCIsXG5cdFx0XHRcImNvbnRyaWJ1dG9yc1wiOiBbXG5cdFx0XHRcdFwiSm9obiBMZW5vbiBNYWdoYW5veSA8am9obmxlbm9ubWFnaGFub3lAZ21haWwuY29tPlwiXG5cdFx0XHRdLFxuXHRcdFx0XCJlTWFpbFwiOiBcInJpY2hldmUuYmViZWRvckBnbWFpbC5jb21cIixcblx0XHRcdFwicmVwb3NpdG9yeVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS92b2xrb3Zhc3lzdGVtcy9tYWRoYXR0ZXIuZ2l0XCIsXG5cdFx0XHRcInRlc3RcIjogXCJtYWRoYXR0ZXItdGVzdC5qc1wiLFxuXHRcdFx0XCJnbG9iYWxcIjogdHJ1ZVxuXHRcdH1cblx0QGVuZC1tb2R1bGUtY29uZmlndXJhdGlvblxuXG5cdEBtb2R1bGUtZG9jdW1lbnRhdGlvbjpcblx0XHRDaGVja3MgZm9yIHN5bnRheCBlcnJvciBhbmQgdW51c2VkIHZhcmlhYmxlLlxuXG5cdFx0UmV0dXJucyBmYWxzZSBpZiB0aGVyZSdzIG5vIGVycm9yLlxuXG5cdFx0UmV0dXJucyBhbiBlcnJvciBvciB0cnVlIGlmIGVycm9uZW91cy5cblx0QGVuZC1tb2R1bGUtZG9jdW1lbnRhdGlvblxuXG5cdEBpbmNsdWRlOlxuXHRcdHtcblx0XHRcdFwiYXNlYVwiOiBcImFzZWFcIixcblx0XHRcdFwiZnNcIjogXCJmc1wiLFxuXHRcdFx0XCJlc3ByaW1hXCI6IFwiZXNwcmltYVwiLFxuXHRcdFx0XCJjaGVja1wiOiBcInN5bnRheC1lcnJvclwiLFxuXHRcdFx0XCJ1bnVzZWRcIjogXCJ1bnVzZWRcIlxuXHRcdH1cblx0QGVuZC1pbmNsdWRlXG4qL1xuXG5jb25zdCBhc2VhID0gcmVxdWlyZSggXCJhc2VhXCIgKTtcbmNvbnN0IGVzcHJpbWEgPSByZXF1aXJlKCBcImVzcHJpbWFcIiApO1xuXG5pZiggYXNlYS5TRVJWRVIgKXtcblx0Y29uc3QgY2hlY2sgPSByZXF1aXJlKCBcInN5bnRheC1lcnJvclwiICk7XG5cdGNvbnN0IGZzID0gcmVxdWlyZSggXCJmc1wiICk7XG5cdGNvbnN0IHVudXNlZCA9IHJlcXVpcmUoIFwidW51c2VkXCIgKTtcbn1cblxuY29uc3QgbWFkaGF0dGVyID0gZnVuY3Rpb24gbWFkaGF0dGVyKCBzY3JpcHQgKXtcblx0Lyo7XG5cdFx0QG1ldGEtY29uZmlndXJhdGlvbjpcblx0XHRcdHtcblx0XHRcdFx0XCJzY3JpcHQ6cmVxdWlyZWRcIjogXCJzdHJpbmdcIlxuXHRcdFx0fVxuXHRcdEBlbmQtbWV0YS1jb25maWd1cmF0aW9uXG5cdCovXG5cblx0aWYoIGFzZWEuY2xpZW50ICl7XG5cdFx0dHJ5e1xuXHRcdFx0ZXNwcmltYS5wYXJzZSggc2NyaXB0ICk7XG5cblx0XHR9Y2F0Y2goIGVycm9yICl7XG5cdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdH1lbHNlIGlmKCBhc2VhLnNlcnZlciApe1xuXHRcdGlmKCAoIC9eKFxcLipcXH4qXFwvKlthLXpBLVowLTlcXF9cXC1cXC5cXH5dKykrKFxcLlthLXpBLVowLTlcXF9cXC1dKykrJC8gKS50ZXN0KCBzY3JpcHQgKSApe1xuXHRcdFx0dHJ5e1xuXHRcdFx0XHRmcy5hY2Nlc3NTeW5jKCBzY3JpcHQgKTtcblxuXHRcdFx0fWNhdGNoKCBlcnJvciApe1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9XG5cblx0XHRcdHNjcmlwdCA9IGZzLnJlYWRGaWxlU3luYyggc2NyaXB0LCBcInV0ZjhcIiApO1xuXHRcdH1cblxuXHRcdHRyeXtcblx0XHRcdGVzcHJpbWEucGFyc2UoIHNjcmlwdCApO1xuXG5cdFx0fWNhdGNoKCBlcnJvciApe1xuXHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdH1cblxuXHRcdGxldCBlcnJvciA9ICBjaGVjayggc2NyaXB0ICk7XG5cblx0XHRpZiggZXJyb3IgKXtcblx0XHRcdHJldHVybiBlcnJvcjtcblx0XHR9XG5cblx0XHRsZXQgdW51c2VkVmFyaWFibGUgPSB1bnVzZWQoIHNjcmlwdCApXG5cdFx0XHQuZmlsdGVyKCBmdW5jdGlvbiBvbkVhY2hVbnVzZWQoIHZhcmlhYmxlICl7XG5cdFx0XHRcdHJldHVybiAhdmFyaWFibGUucGFyYW07XG5cdFx0XHR9IClcblx0XHRcdC5tYXAoIGZ1bmN0aW9uIG9uRWFjaFVudXNlZCggdmFyaWFibGUgKXtcblx0XHRcdFx0bGV0IHsgbmFtZSwgbG9jIH0gPSB2YXJpYWJsZTtcblxuXHRcdFx0XHRyZXR1cm4gYCR7IG5hbWUgfTooICR7IGxvYy5saW5lIH0sICR7IGxvYy5jb2x1bW4gfSApYDtcblx0XHRcdH0gKTtcblxuXHRcdGlmKCB1bnVzZWRWYXJpYWJsZS5sZW5ndGggKXtcblx0XHRcdHJldHVybiBuZXcgRXJyb3IoIGBlcnJvciB1bnVzZWQgdmFyaWFibGUsICR7IHVudXNlZFZhcmlhYmxlLmpvaW4oIFwiLCBcIiApIH0sICR7IHNjcmlwdCB9YCApO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vOiBUaGlzIGlzIGVycm9uZW91cy5cblx0cmV0dXJuIHRydWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1hZGhhdHRlcjtcbiJdfQ==
