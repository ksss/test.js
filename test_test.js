#! /usr/bin/env node

var Test = require('./test.js');

Test.run(function () {
	ok("in run ok", 1, 1);
	is("in run is", {a:1, b:1}, {a:1, b:1});
	notdefine();
}).error(function(ex){
	ok("cathe error", Object.prototype.toString.call(ex), '[object Error]');
});

Test.ok("before include ok", 1, 1);
Test.is("before include is", {a:1, b:1}, {a:1, b:1});

Test.include();
ok("after include ok", 1, 1);
is("after include is", {a:1, b:1}, {a:1, b:1});

Test.remove();
try {
	ok("global ok", 1, 1);
} catch(ex) {
	Test.ok("can't use all Test methods as global in after Test.remove", Object.prototype.toString.call(ex), '[object Error]');
}
