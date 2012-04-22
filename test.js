(function () {

var util = require('util');
var is_run = false;
var is_error = false;
var error_callback = function(){};

/**
 * test is a simple test unit
 */
var test = {};

/**
 * test.run("test name", function () {
 *   ok(...);
 *   is(...);
 *   ...
 * });
 * (run async)
 *
 * throw exeption to top level if no write error method.
 */
test.run = function (name, callback) {
	is_run = true;
	if (arguments.length === 1) {
		callback = name;
		name = 'test.run';
	}
	setTimeout(function(){
		try {
			test.include();
			console.time(name);
			callback();
			console.timeEnd(name);
			test.remove();
		} catch (ex) {
			if (is_error) {
				error_callback(ex);
			} else {
				throw ex;
			}
		}
	}, 0);
	return test;
};

/**
 * simply throw object if use this as single.
 *
 * catch exeption and run callback if write error method after test.run().
 * test.run(function(){      // like try
 *   ...
 * }).error(function (ex) {  // like catch
 *   console.leg(ex);
 * });
 */
test.error = function (callback) {
	if (is_run) {
		is_error = true;
		error_callback = callback;
	} else {
		throw callback;
	}
};

// assert for Bool, Number and String
test.ok = function (name, l, r) {
	if (l === r) {
		console.log(name + " -> :ok");
	} else {
		console.log(name + " -> #####  ng  #####");
		console.log("# " + l);
		console.log("# " + r);
	}
};

// assert for Object
test.is = function (name, got, expected, depth) {
	if(!depth) depth = 5;
	if (JSON.stringify(got) === JSON.stringify(expected)) {
		console.log(name + " -> is ok");
	} else {
		console.log(name + " -> not ok");
		console.log("# " + util.inspect(got, true, depth));
		console.log("# " + util.inspect(expected, true, depth));
	}
};

// print all arguments
test.p = function () {
	console.log('\n# p');
	console.log(Array.prototype.slice.call(arguments));
	console.log();
};

// print arguments for Object
test.pp = function (obj, depth) {
	console.log('\n# pp');
	console.log(util.inspect(obj, true, depth || 5));
	console.log();
};

// include all function of this
test.include = function (obj) {
	if (!obj) obj = (function getGlobal() { return this; })();
	for (var key in test) if (test.hasOwnProperty(key)) {
		obj[key] = test[key];
	}
	return test;
};

// remove all function of test
test.remove = function (obj) {
	if (!obj) obj = (function getGlobal() { return this; })();
	for (var key in test) if (test.hasOwnProperty(key)) {
		delete obj[key];
	}
	return test;
};

// for node
// test = require('test');
// test.ok("use ok", true, true);
(function(){
 	if (typeof exports === 'object') {
		for (var it in test) if (test.hasOwnProperty(it)) {
			exports[it] = test[it];
		}
	}
})();

})();
