var curry = require('ramda').curry;
var reference = require('tangram-reference');

const Ref = reference.load('1.0.0');

var TangramReference = {};



const getProperty = curry(function (type, prop) {
	const obj = Ref.symbolizers[type];
	return prop ? obj[prop] : obj;
});

TangramReference.getPoint = getProperty('markers');

TangramReference.getLine = getProperty('line');

TangramReference.getPolygon = getProperty('polygon');

TangramReference.getText = getProperty('text');

TangramReference.getPolygonPattern = getProperty('polygon-pattern');

TangramReference.checkSymbolizer = curry(function (sym, c3ss) {
	return c3ss.symbolizers.indexOf(sym) !== -1 ? c3ss : null;
});

TangramReference.checkType = curry(function (ref, val) {
	return ref.type.indexOf(val) !== -1 ? val : null;
});


module.exports = TangramReference;