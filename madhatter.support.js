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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hZGhhdHRlci5zdXBwb3J0LmpzIl0sIm5hbWVzIjpbImFzZWEiLCJyZXF1aXJlIiwiZXNwcmltYSIsIm1hZGhhdHRlciIsInNjcmlwdCIsImNsaWVudCIsInBhcnNlIiwiZXJyb3IiLCJzZXJ2ZXIiLCJ0ZXN0IiwiZnMiLCJhY2Nlc3NTeW5jIiwicmVhZEZpbGVTeW5jIiwiY2hlY2siLCJ1bnVzZWRWYXJpYWJsZSIsInVudXNlZCIsImZpbHRlciIsIm9uRWFjaFVudXNlZCIsInZhcmlhYmxlIiwicGFyYW0iLCJtYXAiLCJuYW1lIiwibG9jIiwibGluZSIsImNvbHVtbiIsImxlbmd0aCIsIkVycm9yIiwiam9pbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErREEsSUFBTUEsT0FBT0MsUUFBUyxNQUFULENBQWI7QUFDQSxJQUFNQyxVQUFVRCxRQUFTLFNBQVQsQ0FBaEI7O0FBSUEsSUFBTUUsWUFBWSxTQUFTQSxTQUFULENBQW9CQyxNQUFwQixFQUE0QjtBQUM3Qzs7Ozs7Ozs7QUFRQSxLQUFJSixLQUFLSyxNQUFULEVBQWlCO0FBQ2hCLE1BQUc7QUFDRkgsV0FBUUksS0FBUixDQUFlRixNQUFmO0FBRUEsR0FIRCxDQUdDLE9BQU9HLEtBQVAsRUFBYztBQUNkLFVBQU9BLEtBQVA7QUFDQTs7QUFFRCxTQUFPLEtBQVA7QUFFQSxFQVZELE1BVU0sSUFBSVAsS0FBS1EsTUFBVCxFQUFpQjtBQUN0QixNQUFNLHlEQUFGLENBQThEQyxJQUE5RCxDQUFvRUwsTUFBcEUsQ0FBSixFQUFrRjtBQUNqRixPQUFHO0FBQ0ZNLE9BQUdDLFVBQUgsQ0FBZVAsTUFBZjtBQUVBLElBSEQsQ0FHQyxPQUFPRyxLQUFQLEVBQWM7QUFDZCxXQUFPQSxLQUFQO0FBQ0E7O0FBRURILFlBQVNNLEdBQUdFLFlBQUgsQ0FBaUJSLE1BQWpCLEVBQXlCLE1BQXpCLENBQVQ7QUFDQTs7QUFFRCxNQUFHO0FBQ0ZGLFdBQVFJLEtBQVIsQ0FBZUYsTUFBZjtBQUVBLEdBSEQsQ0FHQyxPQUFPRyxLQUFQLEVBQWM7QUFDZCxVQUFPQSxLQUFQO0FBQ0E7O0FBRUQsTUFBSUEsUUFBU00sTUFBT1QsTUFBUCxDQUFiOztBQUVBLE1BQUlHLEtBQUosRUFBVztBQUNWLFVBQU9BLEtBQVA7QUFDQTs7QUFFRCxNQUFJTyxpQkFBaUJDLE9BQVFYLE1BQVIsRUFDbkJZLE1BRG1CLENBQ1gsU0FBU0MsWUFBVCxDQUF1QkMsUUFBdkIsRUFBaUM7QUFDekMsVUFBTyxDQUFDQSxTQUFTQyxLQUFqQjtBQUNBLEdBSG1CLEVBSW5CQyxHQUptQixDQUlkLFNBQVNILFlBQVQsQ0FBdUJDLFFBQXZCLEVBQWlDO0FBQUEsT0FDaENHLElBRGdDLEdBQ2xCSCxRQURrQixDQUNoQ0csSUFEZ0M7QUFBQSxPQUMxQkMsR0FEMEIsR0FDbEJKLFFBRGtCLENBQzFCSSxHQUQwQjs7O0FBR3RDLFVBQVdELElBQVgsV0FBdUJDLElBQUlDLElBQTNCLFVBQXNDRCxJQUFJRSxNQUExQztBQUNBLEdBUm1CLENBQXJCOztBQVVBLE1BQUlWLGVBQWVXLE1BQW5CLEVBQTJCO0FBQzFCLFVBQU8sSUFBSUMsS0FBSiw2QkFBc0NaLGVBQWVhLElBQWYsQ0FBcUIsSUFBckIsQ0FBdEMsVUFBd0V2QixNQUF4RSxDQUFQO0FBQ0E7O0FBRUQsU0FBTyxLQUFQO0FBQ0E7O0FBRUQ7QUFDQSxRQUFPLElBQVA7QUFDQSxDQS9ERDs7QUFpRUF3QixPQUFPQyxPQUFQLEdBQWlCMUIsU0FBakIiLCJmaWxlIjoibWFkaGF0dGVyLnN1cHBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuLyo7XG5cdEBtb2R1bGUtbGljZW5zZTpcblx0XHRUaGUgTUlUIExpY2Vuc2UgKE1JVClcblx0XHRAbWl0LWxpY2Vuc2VcblxuXHRcdENvcHlyaWdodCAoQGMpIDIwMTcgUmljaGV2ZSBTaW9kaW5hIEJlYmVkb3Jcblx0XHRAZW1haWw6IHJpY2hldmUuYmViZWRvckBnbWFpbC5jb21cblxuXHRcdFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcblx0XHRvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5cdFx0aW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuXHRcdHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcblx0XHRjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcblx0XHRmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5cdFx0VGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5cdFx0Y29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuXHRcdFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcblx0XHRJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcblx0XHRGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcblx0XHRBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5cdFx0TElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcblx0XHRPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuXHRcdFNPRlRXQVJFLlxuXHRAZW5kLW1vZHVsZS1saWNlbnNlXG5cblx0QG1vZHVsZS1jb25maWd1cmF0aW9uOlxuXHRcdHtcblx0XHRcdFwicGFja2FnZVwiOiBcIm1hZGhhdHRlclwiLFxuXHRcdFx0XCJwYXRoXCI6IFwibWFkaGF0dGVyL21hZGhhdHRlci5qc1wiLFxuXHRcdFx0XCJmaWxlXCI6IFwibWFkaGF0dGVyLmpzXCIsXG5cdFx0XHRcIm1vZHVsZVwiOiBcIm1hZGhhdHRlclwiLFxuXHRcdFx0XCJhdXRob3JcIjogXCJSaWNoZXZlIFMuIEJlYmVkb3JcIixcblx0XHRcdFwiY29udHJpYnV0b3JzXCI6IFtcblx0XHRcdFx0XCJKb2huIExlbm9uIE1hZ2hhbm95IDxqb2hubGVub25tYWdoYW5veUBnbWFpbC5jb20+XCJcblx0XHRcdF0sXG5cdFx0XHRcImVNYWlsXCI6IFwicmljaGV2ZS5iZWJlZG9yQGdtYWlsLmNvbVwiLFxuXHRcdFx0XCJyZXBvc2l0b3J5XCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3ZvbGtvdmFzeXN0ZW1zL21hZGhhdHRlci5naXRcIixcblx0XHRcdFwidGVzdFwiOiBcIm1hZGhhdHRlci10ZXN0LmpzXCIsXG5cdFx0XHRcImdsb2JhbFwiOiB0cnVlXG5cdFx0fVxuXHRAZW5kLW1vZHVsZS1jb25maWd1cmF0aW9uXG5cblx0QG1vZHVsZS1kb2N1bWVudGF0aW9uOlxuXHRcdENoZWNrcyBmb3Igc3ludGF4IGVycm9yIGFuZCB1bnVzZWQgdmFyaWFibGUuXG5cblx0XHRSZXR1cm5zIGZhbHNlIGlmIHRoZXJlJ3Mgbm8gZXJyb3IuXG5cblx0XHRSZXR1cm5zIGFuIGVycm9yIG9yIHRydWUgaWYgZXJyb25lb3VzLlxuXHRAZW5kLW1vZHVsZS1kb2N1bWVudGF0aW9uXG5cblx0QGluY2x1ZGU6XG5cdFx0e1xuXHRcdFx0XCJhc2VhXCI6IFwiYXNlYVwiLFxuXHRcdFx0XCJmc1wiOiBcImZzXCIsXG5cdFx0XHRcImVzcHJpbWFcIjogXCJlc3ByaW1hXCIsXG5cdFx0XHRcImNoZWNrXCI6IFwic3ludGF4LWVycm9yXCIsXG5cdFx0XHRcInVudXNlZFwiOiBcInVudXNlZFwiXG5cdFx0fVxuXHRAZW5kLWluY2x1ZGVcbiovXG5cbmNvbnN0IGFzZWEgPSByZXF1aXJlKCBcImFzZWFcIiApO1xuY29uc3QgZXNwcmltYSA9IHJlcXVpcmUoIFwiZXNwcmltYVwiICk7XG5cblxuXG5jb25zdCBtYWRoYXR0ZXIgPSBmdW5jdGlvbiBtYWRoYXR0ZXIoIHNjcmlwdCApe1xuXHQvKjtcblx0XHRAbWV0YS1jb25maWd1cmF0aW9uOlxuXHRcdFx0e1xuXHRcdFx0XHRcInNjcmlwdDpyZXF1aXJlZFwiOiBcInN0cmluZ1wiXG5cdFx0XHR9XG5cdFx0QGVuZC1tZXRhLWNvbmZpZ3VyYXRpb25cblx0Ki9cblxuXHRpZiggYXNlYS5jbGllbnQgKXtcblx0XHR0cnl7XG5cdFx0XHRlc3ByaW1hLnBhcnNlKCBzY3JpcHQgKTtcblxuXHRcdH1jYXRjaCggZXJyb3IgKXtcblx0XHRcdHJldHVybiBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0fWVsc2UgaWYoIGFzZWEuc2VydmVyICl7XG5cdFx0aWYoICggL14oXFwuKlxcfipcXC8qW2EtekEtWjAtOVxcX1xcLVxcLlxcfl0rKSsoXFwuW2EtekEtWjAtOVxcX1xcLV0rKSskLyApLnRlc3QoIHNjcmlwdCApICl7XG5cdFx0XHR0cnl7XG5cdFx0XHRcdGZzLmFjY2Vzc1N5bmMoIHNjcmlwdCApO1xuXG5cdFx0XHR9Y2F0Y2goIGVycm9yICl7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH1cblxuXHRcdFx0c2NyaXB0ID0gZnMucmVhZEZpbGVTeW5jKCBzY3JpcHQsIFwidXRmOFwiICk7XG5cdFx0fVxuXG5cdFx0dHJ5e1xuXHRcdFx0ZXNwcmltYS5wYXJzZSggc2NyaXB0ICk7XG5cblx0XHR9Y2F0Y2goIGVycm9yICl7XG5cdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0fVxuXG5cdFx0bGV0IGVycm9yID0gIGNoZWNrKCBzY3JpcHQgKTtcblxuXHRcdGlmKCBlcnJvciApe1xuXHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdH1cblxuXHRcdGxldCB1bnVzZWRWYXJpYWJsZSA9IHVudXNlZCggc2NyaXB0IClcblx0XHRcdC5maWx0ZXIoIGZ1bmN0aW9uIG9uRWFjaFVudXNlZCggdmFyaWFibGUgKXtcblx0XHRcdFx0cmV0dXJuICF2YXJpYWJsZS5wYXJhbTtcblx0XHRcdH0gKVxuXHRcdFx0Lm1hcCggZnVuY3Rpb24gb25FYWNoVW51c2VkKCB2YXJpYWJsZSApe1xuXHRcdFx0XHRsZXQgeyBuYW1lLCBsb2MgfSA9IHZhcmlhYmxlO1xuXG5cdFx0XHRcdHJldHVybiBgJHsgbmFtZSB9OiggJHsgbG9jLmxpbmUgfSwgJHsgbG9jLmNvbHVtbiB9IClgO1xuXHRcdFx0fSApO1xuXG5cdFx0aWYoIHVudXNlZFZhcmlhYmxlLmxlbmd0aCApe1xuXHRcdFx0cmV0dXJuIG5ldyBFcnJvciggYGVycm9yIHVudXNlZCB2YXJpYWJsZSwgJHsgdW51c2VkVmFyaWFibGUuam9pbiggXCIsIFwiICkgfSwgJHsgc2NyaXB0IH1gICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly86IFRoaXMgaXMgZXJyb25lb3VzLlxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFkaGF0dGVyO1xuIl19
