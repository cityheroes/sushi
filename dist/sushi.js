(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["moment"], factory);
	else if(typeof exports === 'object')
		exports["Sushi"] = factory(require("moment"));
	else
		root["Sushi"] = factory(root["moment"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_18__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var isArray = function isArray(value) {
	return Array.isArray(value);
};

var isObject = function isObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

var omit = function omit(obj, keys) {

	if (!isObject(obj)) {
		return obj;
	}

	keys = !isArray(keys) ? [keys] : keys;

	var result = {};

	for (var property in obj) {
		if (obj.hasOwnProperty(property) && keys.indexOf(property) === -1) {
			result[property] = obj[property];
		}
	}

	return result;
};

exports.default = {
	isArray: isArray,
	isObject: isObject,
	omit: omit
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Tools = __webpack_require__(0);

var _Tools2 = _interopRequireDefault(_Tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parsePath = function parsePath(pathParam) {
	return !_Tools2.default.isArray(pathParam) ? [pathParam] : pathParam;
};

var get = function get(obj, path, defaultValue) {

	if (path === '') {
		return obj;
	}

	var arr = path.split('.');

	while (arr.length && obj) {
		var comp = arr.shift();
		var match = new RegExp('(.+)\\[([0-9]*)\\]').exec(comp);
		if (match !== null && match.length === 3) {
			var arrayData = { arrName: match[1], arrIndex: match[2] };
			if (obj[arrayData.arrName] !== undefined) {
				obj = obj[arrayData.arrName][arrayData.arrIndex];
			} else {
				obj = undefined;
			}
		} else {
			if (isNaN(comp)) {
				obj = obj[comp];
			} else {
				obj = obj['undefined' === typeof obj[comp] ? Number(comp) : comp];
			}
		}
	}

	return 'undefined' === typeof obj ? defaultValue : obj;
};

/**
 * @todo Enable same path options as get().
 */
var set = function set(obj, path, value) {

	path = path.split('.');

	var nested = obj,
	    key,
	    index = -1,
	    length = path.length,
	    lastIndex = length - 1;

	while (nested !== null && ++index < length) {

		key = path[index];

		if (index === lastIndex) {
			nested[key] = value;
		} else {
			nested[key] = typeof nested[key] !== 'undefined' ? nested[key] : {};
		}

		nested = nested[key];
	}

	return obj;
};

var extractMap = function extractMap(item, paths, defaultValue) {
	return parsePath(paths).map(function (path) {
		return get(item, path, defaultValue);
	});
};

var iterateMap = function iterateMap(item, paths, defaultValue, callback) {
	parsePath(paths).forEach(function (path) {
		callback(path, get(item, path, defaultValue));
	});
};

var wildcardSeparator = '*';

var evalKeys = function evalKeys(keys, value) {

	if (!keys) {
		return true;
	}

	keys = _Tools2.default.isArray(keys) ? keys : [keys];

	return keys.reduce(function (previousValidation, key) {
		var result = false;
		var firstWildcard = key.indexOf(wildcardSeparator);

		if (firstWildcard !== -1) {

			var lastWildcard = key.lastIndexOf(wildcardSeparator);

			if (lastWildcard !== -1 && firstWildcard !== lastWildcard) {
				result = value.includes(key.substring(firstWildcard + 1, lastWildcard));
			} else if (firstWildcard === 0) {
				result = value.endsWith(key.substr(1));
			} else if (firstWildcard === key.length - 1) {
				result = value.startsWith(key.slice(0, -1));
			}
		} else {
			result = value === key;
		}

		return previousValidation || result;
	}, false);
};

var extractKeys = function extractKeys(item, operationKeys) {
	return Object.keys(item).filter(function (key) {
		return evalKeys(operationKeys, key);
	});
};

var extractKeyValues = function extractKeyValues(item, operationKeys) {
	return extractKeys(item, operationKeys).map(function (key) {
		return item[key];
	});
};

var getKeys = function getKeys(item, operationKeys) {
	return Object.keys(item).filter(function (key) {
		return evalKeys(operationKeys, key);
	});
};

var iterateKeys = function iterateKeys(item, operationKeys, callback) {
	Object.keys(item).forEach(function (key) {
		if (evalKeys(operationKeys, key)) {
			callback(key);
		}
	});
};

var evalValue = function evalValue(value, subject) {

	if (_Tools2.default.isArray(subject) || _Tools2.default.isObject(subject)) {
		return false;
	}

	if (value.charAt(0) === '!') {
		return !subject.includes(value.substr(1));
	} else {
		return subject.includes(value);
	}
};

var evalValues = function evalValues(values, subject) {
	return values.reduce(function (previousValidation, value) {
		return previousValidation || evalValue(value, subject);
	}, false);
};

var compare = function compare(lvalue, rvalue, operator) {

	operator = operator || 'eq';

	var operators = {
		'eq': function eq(l, r) {
			return l === r;
		},
		'ne': function ne(l, r) {
			return l !== r;
		},
		'lt': function lt(l, r) {
			return l < r;
		},
		'gt': function gt(l, r) {
			return l > r;
		},
		'le': function le(l, r) {
			return l <= r;
		},
		'ge': function ge(l, r) {
			return l >= r;
		}
	};

	return operators[operator] ? operators[operator](lvalue, rvalue) : null;
};

var calculate = function calculate(operands, operator) {

	operator = operator || 'addition';

	var operators = {
		'addition': {
			method: function method(lvalue, rvalue) {
				return lvalue + rvalue;
			},
			neutral: 0
		},
		'subtraction': {
			method: function method(lvalue, rvalue) {
				return lvalue - rvalue;
			},
			neutral: 0
		},
		'division': {
			method: function method(lvalue, rvalue) {
				return lvalue / rvalue;
			},
			neutral: 1
		},
		'multiplication': {
			method: function method(lvalue, rvalue) {
				return lvalue * rvalue;
			},
			neutral: 1
		}
	};

	return operands.reduce(function (memo, value) {
		value = value === null || value === undefined ? 0 : value;
		return operators[operator].method(parseFloat(value) || operators[operator].neutral, memo);
	}, operators[operator].neutral);
};

var average = function average(values) {

	values = values.filter(function (value) {
		return value !== null && value !== undefined;
	});

	if (values.length === 0) {
		return 0;
	}

	return calculate(values, 'addition') / values.length;
};

var compareString = function compareString(lvalue, rvalue, operator) {

	operator = operator || 'eq';

	var operators = {
		'eq': function eq(l, r) {
			return l === r;
		},
		'ne': function ne(l, r) {
			return l !== r;
		},
		'includes': function includes(l, r) {
			return l.includes(r);
		},
		'startsWith': function startsWith(l, r) {
			return l.startsWith(r);
		},
		'endsWith': function endsWith(l, r) {
			return l.endsWith(r);
		}
	};

	return operators[operator](lvalue, rvalue);
};

exports.default = {
	get: get,
	set: set,
	extractMap: extractMap,
	iterateMap: iterateMap,
	extractKeys: extractKeys,
	extractKeyValues: extractKeyValues,
	getKeys: getKeys,
	iterateKeys: iterateKeys,
	evalValues: evalValues,
	compare: compare,
	calculate: calculate,
	average: average,
	compareString: compareString
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);



const ARRAY_REFERENCE_REGEX = /(.*)\[(@|\*|\d+)]/g;

const processPath = (context) => {
	if (!context) {
		return [];
	}
	let toProcess = context.split(/\.|::/),
		processed = [],
		processArray = (completeField, field, arrayValue) => {
			processed.push(field);
			if (arrayValue !== '@' && arrayValue !== '*') {
				arrayValue = Number(arrayValue);
			}
			processed.push(arrayValue);
			return '';
		};

	// Use of .shift() was preferred over other iteration methods for performance reasons.
	// check this test: https://jsperf.com/shift-vs-traditional-loop
	let element;
	while(toProcess.length > 0) {
		element = toProcess.shift();
		element = element.replace(ARRAY_REFERENCE_REGEX, processArray);
		if (element) {
			processed.push(element);
		}
	}
	return processed;
};

const assignTo = (variable, path, index, value) => {
	let pathRoute = processPath(path);
	if ('undefined' !== typeof index) {
		pathRoute.push(index);
	}

	let pathElement;
	while (pathRoute.length) {
		pathElement = pathRoute.shift();
		if (pathRoute.length > 0) {
			if (!variable[pathElement]) {
				if ('number' === typeof pathRoute[0]) {
					variable[pathElement] = [];
				} else {
					variable[pathElement] = {};
				}
			}
			variable = variable[pathElement];
		} else {
			variable[pathElement] = value;
		}
	}
};

const compact = (variable, path) => {
	let pathRoute = processPath(path),
		pathElement;
	while (pathRoute.length) {
		pathElement = pathRoute.shift();
		if (pathRoute.length > 0) {
			if (!variable[pathElement]) {
				if ('number' === typeof pathRoute[0]) {
					variable[pathElement] = [];
				} else {
					variable[pathElement] = {};
				}
			}
			variable = variable[pathElement];
		} else {
			variable[pathElement] = __WEBPACK_IMPORTED_MODULE_0_underscore___default.a.compact(variable[pathElement]);
		}
	}
};

const getDateTimeFormat = (date) => {
	if (!date || 'string' !== typeof date) {
		return '';
	}
	switch (date.length) {
		case 10:
			return 'YYYY-MM-DD';
		case 19:
			return 'YYYY-MM-DD HH:mm:ss';
		case 8:
			return 'HH:mm:ss';
		default:
			return '';
	}
};

const validateOperation = (date1format, date2format, unit) => {
	switch (unit) {
		case 'years':
		case 'months':
		case 'weeks':
		case 'days':
			if (date1format === 'HH:mm:ss' || date2format === 'HH:mm:ss') {
				return false;
			}
			break;
		case 'hours':
		case 'minutes':
		case 'seconds':
			if ((date1format === 'HH:mm:ss' || date2format === 'HH:mm:ss') && date1format !== date2format) {
				return false;
			}
			break;
		default:
			break;
	}
	return true;
};

const evalWithSafeEnvironment = (function () {

	const __defaultSpec = 'seconds',
		__availableSpecs = {
			Y: 'years',
			M: 'months',
			W: 'weeks',
			D: 'days',
			h: 'hours',
			m: 'minutes',
			s: 'seconds',
			years: 'years',
			months: 'months',
			weeks: 'weeks',
			days: 'days',
			hours: 'hours',
			minutes: 'minutes',
			seconds: 'seconds'
		};

	const __processStarOperator = (array, path) => {
		let result = [];
		if (array && __WEBPACK_IMPORTED_MODULE_0_underscore___default.a.isArray(array) && array.length) {
			let value,
				pushNestedElement = (nestedElement) => {
					value.push(eval('nestedElement' + path));
				};
			for (let i = 0, len = array.length; i < len; i++) {
				if (__WEBPACK_IMPORTED_MODULE_0_underscore___default.a.isArray(array[i])) {
					value = [];
					array[i].forEach(pushNestedElement);
				} else {
					value = null;
					try {
						value = eval('array[i]' + path);
					} catch (error) {
						console.warn(error);
					}
				}
				result.push(value);
			}
		}
		return result;
	};

	const dateDiff = (date1, date2, spec) => {
		let date1format = getDateTimeFormat(date1),
			date2format = getDateTimeFormat(date2);
		spec = __availableSpecs[spec] || __defaultSpec;
		if (validateOperation(date1format, date2format, spec)) {
			date1 = __WEBPACK_IMPORTED_MODULE_1_moment___default()(date1, date1format);
			date2 = __WEBPACK_IMPORTED_MODULE_1_moment___default()(date2, date2format);
			return date1.diff(date2, spec);
		} else {
			console.warn('Invalid inputs at dateDiff.');
			return null;
		}
	};

	const sum = (array) => {
		let total = 0;
		if (array && __WEBPACK_IMPORTED_MODULE_0_underscore___default.a.isArray(array) && array.length) {
			for (let i = 0, len = array.length; i < len; i++) {
				if (array[i]) {
					total += array[i];
				}
			}
		}
		return total;
	};

	const extract = (text, separator, index) => {
		text = 'string' === typeof text ? text : (text || '');
		separator = separator || ',';
		index = index || 0;

		let extractedValue = text.split(separator)[index];

		return isNaN(extractedValue) ? extractedValue : Number(extractedValue);
	};

	const flatten = __WEBPACK_IMPORTED_MODULE_0_underscore___default.a.flatten;

	const groupConcat = (array, separator = ', ') => {
		return array.join(separator);
	};

	function concat() {
		var elements = Array.prototype.slice.call(arguments);
		return elements.join('');
	}

	const count = (array) => {
		return array.length;
	};

	const avg = (array) => {
		let total = sum(array);
		if (array && __WEBPACK_IMPORTED_MODULE_0_underscore___default.a.isArray(array) && array.length > 0) {
			total /= array.length;
		}
		return total;
	};

	const formatDate = (date, format) => {
		return __WEBPACK_IMPORTED_MODULE_1_moment___default()(date).format(format);
	};

	return function(formula, data, metaData) {
		return eval(formula);
	};
}).call();

/* harmony default export */ __webpack_exports__["a"] = ({

	processPath: processPath,
	assignTo: assignTo,
	compact: compact,
	patterns: {
		variable: '{{([^}]+)}}',
		parsedExpression: '\\[\\*(\\d*)\\*\\]',
		invalidVariable: '\\[(?!(?:@|\\*|\\d+)\\]|[\\.$])|^[^\\[]*\\]|\\][^\\[]*\\]|[\\{\\}]|\\][]|\\][^\\.\\[]'
	},
	dataVarName: 'data',
	metaDataVarName: 'metaData',
	evalWithSafeEnvironment: evalWithSafeEnvironment

});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Variable__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Helpers__ = __webpack_require__(2);



const VARIABLE_REGEX = new RegExp(__WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* default */].patterns.variable, 'g');

class CompiledExpression {

	constructor(rules, expression) {
		this._variables = [];

		for(var i = 0, size = rules.length; i < size; i++) {
			var rule = rules[i];
			expression = expression.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
		}

		const variablesCache = {};
		this._parsedExpression = expression.replace(VARIABLE_REGEX, (match, variableText) => {
			if (__WEBPACK_IMPORTED_MODULE_0__Variable__["a" /* default */].isValid(variableText)) {
				if (!variablesCache[variableText]) {
					variablesCache[variableText] = this._variables.length;
					this._variables.push(new __WEBPACK_IMPORTED_MODULE_0__Variable__["a" /* default */](variableText));
				}
				return '[*' + variablesCache[variableText] + '*]';
			} else {
				return '{{' + variableText + '}}';
			}
		});
	}

	eval() {
		throw new Error('Eval is not implemented');
	}

	getDependencies() {
		throw new Error('GetDependencies is not implemented');
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = CompiledExpression;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Helpers__ = __webpack_require__(2);



const INVALID_VARIABLE_REGEX = new RegExp(__WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* default */].patterns.invalidVariable);

class Variable {

	constructor(text) {

		this._path = __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* default */].processPath(text);

		this._hasStar = this._path.indexOf('*') > -1;
		this._hasAt = this._path.indexOf('@') > -1;
		this._hasContext = this._hasAt;

		if (text.indexOf('::') > -1) {
			this._environment = __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* default */].metaDataVarName;
		} else {
			this._environment = __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* default */].dataVarName;
		}

		if (text === '') {
			this._parsedVariable = 'null';
		} else if (!this._hasContext) {
			this._parsedVariable = Variable._parse(this._path, this._environment);
		}
	}

	parseVariable(contextPath) {
		return (this._parsedVariable || this._parseWithContext(contextPath));
	}

	_parseWithContext(contextPath) {
		let index = 0,
			contextLength = contextPath.length,
			pathLength = this._path.length,
			fieldPath = this._path.slice();

		for (; index < contextLength && index < pathLength; index++) {
			if (fieldPath[index] === '@' && __WEBPACK_IMPORTED_MODULE_0_underscore___default.a.isNumber(contextPath[index])) {
				fieldPath[index] = Number(contextPath[index]);
			} else if (fieldPath[index] !== contextPath[index] || fieldPath[index] === '*') {
				break;
			}
		}
		for (; index < pathLength; index++) {
			if (fieldPath[index] === '@') {
				throw new Error('Context could not fully resolve');
			}
		}

		return Variable._parse(fieldPath, this._environment);
	}

	hasStar() {
		return this._hasStar;
	}

	hasAt() {
		return this._hasAt;
	}

	static isValid(text) {
		return !INVALID_VARIABLE_REGEX.test(text);
	}

	static _parse(path, environment) {
 		let pathElement,
			hasStarOperator = false,
			parsedVariable = environment;
		for (let i = 0, len = path.length; i < len; i++) {
			pathElement = path[i];
			if (pathElement === '*') {
				if (hasStarOperator) {
					parsedVariable += '")';
				} else {
					hasStarOperator = true;
				}
				parsedVariable = '__processStarOperator(' + parsedVariable + ',"';
			} else {
				parsedVariable += '[\'' + pathElement + '\']';
			}
		}
		if (hasStarOperator) {
			parsedVariable += '")';
		}
		return parsedVariable;
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Variable;



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return _;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16), __webpack_require__(17)(module)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Tools = __webpack_require__(0);

var _Tools2 = _interopRequireDefault(_Tools);

var _Helper = __webpack_require__(1);

var _Helper2 = _interopRequireDefault(_Helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Uni operations
var overturnOperation = function overturnOperation(collection, item, pivot, parentDest, childDest) {
	var includeEmpty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

	var parent = _Tools2.default.omit(item, pivot);
	var child = item[pivot];

	if (_Tools2.default.isArray(child)) {
		if (includeEmpty && child.length === 0) {
			child.push({});
		}
		return collection.concat(child.map(function (subitem) {
			if (_Tools2.default.isObject(subitem)) {
				subitem[parentDest] = parent;
			} else if (childDest) {
				var swapSubitem = {};
				swapSubitem[parentDest] = parent;
				swapSubitem[childDest] = subitem;
				subitem = swapSubitem;
			}
			return subitem;
		}));
	} else if (_Tools2.default.isObject(child) || includeEmpty && (child = {})) {
		child[parentDest] = parent;
		collection.push(child);
		return collection;
	}
	return collection;
};

var overturn = function overturn(collection, _overturn) {

	if (!_overturn.pivot) {
		console.warn('Overturn operation needs a \'pivot\' parameter.');
		return collection;
	}

	var pivot = _overturn.pivot,
	    dest = _overturn.dest || 'parent',
	    child = _overturn.child || null,
	    includeEmpty = !!_overturn.includeEmpty;

	return collection.reduce(function (reducedItems, item) {
		return overturnOperation(reducedItems, item, pivot, dest, child, includeEmpty);
	}, []);
};

var pick = function pick(collection, _pick) {

	return collection.map(function (item) {

		var resultItem = {};

		if (_pick.keys) {
			_Helper2.default.iterateKeys(item, _pick.keys, function (key) {
				if (_pick.values && _Helper2.default.evalValues(_pick.values, item[key])) {
					resultItem[key] = item[key];
				} else if (!_pick.values) {
					resultItem[key] = item[key];
				}
			});
		}

		if (_pick.paths) {
			_Helper2.default.iterateMap(item, _pick.paths, null, function (path, value) {
				resultItem = _Helper2.default.set(resultItem, path, value);
			});
		}

		return resultItem;
	});
};

var uniq = function uniq(collection, _uniq) {

	var resultCollection = [],
	    seen = {};

	if (!_uniq || !_uniq.path) {
		console.warn('A \'path\' parameter must be provided for the uniq operation.');
		return collection;
	}

	for (var i = collection.length - 1; i >= 0; i--) {
		if (seen[_Helper2.default.get(collection[i], _uniq.path)] !== 1) {
			seen[_Helper2.default.get(collection[i], _uniq.path)] = 1;
			resultCollection.push(collection[i]);
		}
	}

	return resultCollection;
};

var explode = function explode(collection, _explode) {
	return collection.reduce(function (resultCollection, item) {
		return resultCollection.concat(Object.keys(item).reduce(function (explodedItem, key) {

			var resultItem = {};

			if (_explode.id) {
				if (_explode.id.includes(key)) {
					return explodedItem;
				}

				resultItem.id = _Helper2.default.get(item, _explode.id);
			}

			resultItem[_explode.key ? _explode.key : 'key'] = key;
			resultItem[_explode.value ? _explode.value : 'value'] = item[key];

			explodedItem.push(resultItem);

			return explodedItem;
		}, []));
	}, []);
};

var pivot = function pivot(collection, pivotCont) {

	var aggregationOps = {
		sum: function sum(previousValue, item) {
			return previousValue + _Helper2.default.get(item, pivotCont.aggregationPath, 0);
		},
		count: function count(previousValue, item) {
			return previousValue + 1;
		}
	};

	var result = [],
	    tmpHash = {},
	    tmpColumnHeaders = [],
	    columnHeader = void 0,
	    rowSourcePath = pivotCont.rowSourcePath,
	    rowTargetPath = pivotCont.rowTargetPath || rowSourcePath,
	    columnPath = pivotCont.columnPath,
	    includeRowTotal = !!pivotCont.includeRowTotal,
	    includeColumnTotal = !!pivotCont.includeColumnTotal,
	    totalRowName = pivotCont.totalRowName || 'Total',
	    totalColumnName = pivotCont.totalColumnName || 'Total',
	    aggregationOp = aggregationOps[pivotCont.aggregationOp || 'count'];

	var item = void 0,
	    processedItem = void 0,
	    processedItemId = void 0,
	    previousValue = void 0;
	for (var i = 0, len = collection.length; i < len; i++) {
		item = collection[i];

		processedItemId = _Helper2.default.get(item, rowSourcePath, undefined);

		if (!processedItemId) {
			continue;
		} else if (!tmpHash[processedItemId]) {
			processedItem = {};

			for (var j = tmpColumnHeaders.length - 1; j >= 0; j--) {
				processedItem[tmpColumnHeaders[j]] = 0;
			}

			tmpHash[processedItemId] = processedItem;
			result.push(processedItem);
			_Helper2.default.set(processedItem, rowTargetPath, processedItemId);
		} else {
			processedItem = tmpHash[processedItemId];
		}

		columnHeader = _Helper2.default.get(item, columnPath, undefined);
		if (columnHeader) {

			if (tmpColumnHeaders.indexOf(columnHeader) === -1) {
				tmpColumnHeaders.push(columnHeader);
				for (var k = result.length - 1; k >= 0; k--) {
					result[k][columnHeader] = 0;
				}
			}

			previousValue = processedItem[columnHeader] || 0;
			processedItem[columnHeader] = aggregationOp(previousValue, item);
		}
	}

	if (includeRowTotal || includeColumnTotal) {
		var i;
		var i, length;
		var j;

		(function () {

			var resultItem = void 0,
			    columnTotalItem = {};

			if (includeColumnTotal) {
				for (i = tmpColumnHeaders.length - 1; i >= 0; i--) {
					columnTotalItem[tmpColumnHeaders[i]] = 0;
				}
				_Helper2.default.set(columnTotalItem, rowTargetPath, totalColumnName);
			}

			for (i = 0, length = result.length; i < length; i++) {

				resultItem = result[i];

				if (includeColumnTotal) {
					for (j = tmpColumnHeaders.length - 1; j >= 0; j--) {
						columnHeader = tmpColumnHeaders[j];
						columnTotalItem[columnHeader] += resultItem[columnHeader];
					}
				}

				if (includeRowTotal) {
					resultItem[totalRowName] = tmpColumnHeaders.reduce(function (partial, columnHeader) {
						return partial + resultItem[columnHeader];
					}, 0);
				}
			}

			if (includeColumnTotal) {
				if (includeRowTotal) {
					columnTotalItem[totalRowName] = tmpColumnHeaders.reduce(function (partial, columnHeader) {
						return partial + columnTotalItem[columnHeader];
					}, 0);
				}
				result.push(columnTotalItem);
			}
		})();
	}

	return result;
};

var implode = function implode(collection, _implode) {
	var resultItem = void 0;
	return collection.reduce(function (resultCollection, item) {
		return resultCollection.concat(Object.keys(item).reduce(function (implodedItem, key) {

			resultItem = {};

			if (_implode.id) {
				if (_implode.id.includes(key)) {
					return implodedItem;
				}

				resultItem.id = _Helper2.default.get(item, _implode.id);
			}

			resultItem[_implode.key ? _implode.key : 'key'] = key;
			resultItem[_implode.value ? _implode.value : 'value'] = item[key];

			implodedItem.push(resultItem);

			return implodedItem;
		}, []));
	}, []);
};

var classify = function classify(collection, _classify) {

	if (!_classify || !_classify.path) {
		console.warn('A \'path\' parameter must be provided for the classify operation.');
		return collection;
	}

	var classifier = _classify.path,
	    classifierValue = void 0,
	    dest = _classify.dest || 'dest',
	    id = _classify.id || classifier,
	    defaultValue = _classify.default,
	    tempMap = {},
	    size = collection.length,
	    item = void 0;

	for (var i = 0; i < size; i++) {
		item = collection[i];
		classifierValue = _Helper2.default.get(item, classifier);
		classifierValue = 'undefined' !== typeof classifierValue ? classifierValue : defaultValue;
		tempMap[classifierValue] = tempMap[classifierValue] || {};
		tempMap[classifierValue][dest] = tempMap[classifierValue][dest] || [];
		tempMap[classifierValue][dest].push(item);
	}

	return Object.keys(tempMap).map(function (key) {
		return _extends(_defineProperty({}, id, key), tempMap[key]);
	});
};

var processParts = function processParts(parts, item) {
	var collection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	var newItem,
	    size = parts.length,
	    pathsMap,
	    path;

	for (var i = 0; i < size; i++) {
		pathsMap = parts[i];
		newItem = {};
		for (path in pathsMap) {
			newItem[pathsMap[path]] = _Helper2.default.get(item, path);
		}
		collection.push(newItem);
	}

	return collection;
};

var split = function split(collection, options) {

	if (!options || !options.parts) {
		console.warn('A \'parts\' parameter must be provided for the split operation.');
		return collection;
	}

	var newCollection = [],
	    parts = options.parts,
	    size = collection.length;

	for (var i = 0; i < size; i++) {
		newCollection = processParts(parts, collection[i], newCollection);
	}

	return newCollection;
};

// Multi operations
var filter = function filter(collection, filters, applyOperation) {

	if (!filters) {
		return collection;
	}

	if (!Array.isArray(filters)) {
		filters = [filters];
	}

	return collection.filter(function (item) {
		return filters.reduce(function (previousResult, filter) {
			return previousResult && applyOperation('filter', filter.name, item, filter);
		}, true);
	});
};

var sort = function sort(collection, sorters, applyOperation) {

	if (!sorters) {
		return collection;
	}

	if (!Array.isArray(sorters)) {
		sorters = [sorters];
	}

	return collection.sort(function (item) {
		return sorters.reduce(function (previousResult, sorter) {
			return previousResult && applyOperation('sorter', sorter.name, item, sorter);
		}, true);
	});
};

var map = function map(collection, mappers, applyOperation) {

	if (!mappers) {
		return collection;
	}

	if (!Array.isArray(mappers)) {
		mappers = [mappers];
	}

	return collection.map(function (item) {
		mappers.forEach(function (mapper) {

			_Helper2.default.iterateKeys(item, mapper.keys, function (key) {
				item[key] = applyOperation('mapper', mapper.name, item[key], mapper);
			});
		}, {});

		return item;
	});
};

var select = function select(collection, selectors, applyOperation) {

	if (!selectors) {
		return collection;
	}

	if (!Array.isArray(selectors)) {
		selectors = [selectors];
	}

	return collection.map(function (item) {
		return selectors.reduce(function (resultItem, selector) {
			resultItem[selector.dest] = applyOperation('selector', selector.name, item, selector);
			return resultItem;
		}, {});
	});
};

var reduce = function reduce(collection, reducers, applyOperation) {

	if (!reducers) {
		return collection;
	}

	if (!Array.isArray(reducers)) {
		reducers = [reducers];
	}

	return reducers.reduce(function (resultItem, reducer) {

		var start = reducer.start || 0;

		if (reducer.group && reducer.path) {

			var auxResult = resultItem,
			    groupKey = void 0,
			    groupLengths = collection.reduce(function (memo, item) {
				groupKey = _Helper2.default.get(item, reducer.group);
				memo[groupKey] = memo[groupKey] || 0;
				memo[groupKey]++;
				return memo;
			}, {});

			if (reducer.dest) {
				resultItem[reducer.dest] = {};
				auxResult = resultItem[reducer.dest];
			}

			var groupIndexes = {};
			collection.forEach(function (item) {
				groupKey = _Helper2.default.get(item, reducer.group);

				groupIndexes[groupKey] = groupIndexes[groupKey] || 0;

				auxResult[groupKey] = applyOperation('reducer', reducer.name, reducer, auxResult[groupKey] || start, _Helper2.default.get(item, reducer.path), groupIndexes[groupKey], groupLengths[groupKey]);

				groupIndexes[groupKey]++;
			});
		} else if (reducer.path && reducer.dest) {
			resultItem[reducer.dest] = collection.reduce(function (memo, item, index) {

				return applyOperation('reducer', reducer.name, reducer, memo, _Helper2.default.get(item, reducer.path), index, collection.length);
			}, start);
		} else if (reducer.keys) {

			collection.forEach(function (item, index) {
				_Helper2.default.iterateKeys(item, reducer.keys, function (key) {

					resultItem[key] = applyOperation('reducer', reducer.name, reducer, resultItem[key] || start, item[key], index, collection.length);
				});
			});
		}

		return resultItem;
	}, {});
};

// Cheff API
exports.default = {
	overturn: overturn,
	filter: filter,
	pick: pick,
	sort: sort,
	map: map,
	explode: explode,
	select: select,
	uniq: uniq,
	reduce: reduce,
	pivot: pivot,
	classify: classify,
	split: split
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Tools = __webpack_require__(0);

var _Tools2 = _interopRequireDefault(_Tools);

var _Helper = __webpack_require__(1);

var _Helper2 = _interopRequireDefault(_Helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var applyMatch = function applyMatch(value, match, filterFunction) {
	if (_Tools2.default.isArray(match)) {
		return match.reduce(function (memo, matchItem) {
			return memo || filterFunction(value, matchItem);
		}, false);
	} else {
		return filterFunction(value, match);
	}
};

exports.default = {

	match: function match(item, filter) {
		return applyMatch(_Helper2.default.get(item, filter.path), filter.match, function (value, match) {
			return value === match;
		});
	},

	mismatch: function mismatch(item, filter) {
		return applyMatch(_Helper2.default.get(item, filter.path), filter.match, function (value, match) {
			return value !== match;
		});
	},

	matchType: function matchType(item, filter) {
		return applyMatch(_Helper2.default.get(item, filter.path), filter.match, function (value, match) {
			return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === match;
		});
	},

	mismatchType: function mismatchType(item, filter) {
		return applyMatch(_Helper2.default.get(item, filter.path), filter.match, function (value, match) {
			return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== match;
		});
	},

	includes: function includes(item, filter) {
		return applyMatch(_Helper2.default.get(item, filter.path), filter.match, function (value, match) {
			return value.includes(match);
		});
	},

	excludes: function excludes(item, filter) {
		return applyMatch(_Helper2.default.get(item, filter.path), filter.match, function (value, match) {
			return !value.includes(match);
		});
	},

	compare: function compare(item, filter) {
		return _Helper2.default.compare(_Helper2.default.get(item, filter.path), filter.match, filter.operator);
	},

	start: function start(item, filter) {
		return applyMatch(_Helper2.default.get(item, filter.path, ''), filter.match, function (value, match) {
			return value.indexOf(match) === 0;
		});
	},

	end: function end(item, filter) {
		return applyMatch(_Helper2.default.get(item, filter.path, ''), filter.match, function (value, match) {
			return value.indexOf(match, value.length - match.length) !== -1;
		});
	}

};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var castFunctions = {
	string: String,
	number: Number,
	boolean: Boolean
};

exports.default = {

	pass: function pass(value, mapper) {
		return value;
	},

	replace: function replace(value, mapper) {

		if (typeof value !== 'string') {
			return value;
		}

		var replacer = mapper.match || '';

		if (mapper.regex) {
			replacer = new RegExp(mapper.regex, 'i');
		}

		return value.replace(replacer, mapper.replacement || '');
	},

	substring: function substring(value, mapper) {

		if (typeof value !== 'string') {
			return value;
		}

		return value.substring(mapper.start || 0, mapper.end || undefined);
	},

	translate: function translate(value, mapper) {
		var conversions = mapper.conversions || mapper.convertions || {};
		return typeof conversions[value] !== 'undefined' ? conversions[value] : value;
	},

	classify: function classify(value, mapper) {
		var conversions = mapper.conversions || mapper.convertions || {},
		    roundedValue = Math.round(value);
		return typeof conversions[roundedValue] !== 'undefined' ? conversions[roundedValue] : value;
	},

	stratify: function stratify(value, mapper) {
		var conversions = mapper.conversions || mapper.convertions || {},
		    partialValue = mapper.default || value;

		Object.keys(conversions).forEach(function (key) {
			var bounds = key.split('-');

			if (bounds.length === 2 && value >= Number(bounds[0]) && value <= Number(bounds[1])) {
				partialValue = conversions[key];
			}
		});

		return partialValue;
	},

	cast: function cast(value, mapper) {
		var type = mapper.type || 'number';
		return castFunctions[type](value);
	}

};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Tools = __webpack_require__(0);

var _Tools2 = _interopRequireDefault(_Tools);

var _Helper = __webpack_require__(1);

var _Helper2 = _interopRequireDefault(_Helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var matchBehavior = function matchBehavior(reducer, previousValue, value, reduceOperation) {
	if (reducer.match) {
		if (reducer.match === value) {
			return reduceOperation();
		} else {
			return previousValue;
		}
	} else {
		return reduceOperation();
	}
};

exports.default = {

	count: function count(reducer, previousValue, value) {
		return matchBehavior(reducer, previousValue, value, function () {
			return value ? previousValue + 1 : previousValue;
		});
	},

	operation: function operation(reducer, previousValue, value) {
		return matchBehavior(reducer, previousValue, value, function () {
			return _Helper2.default.calculate([value, previousValue], reducer.operator);
		});
	},

	average: function average(reducer, previousValue, value, index, size) {
		return matchBehavior(reducer, previousValue, value, function () {
			var result = _Helper2.default.calculate([value, previousValue], 'addition');

			if (index < size - 1) {
				return result;
			} else {
				return result / size;
			}
		});
	},

	sum: function sum(reducer, previousValue, value) {
		return matchBehavior(reducer, previousValue, value, function () {
			return _Helper2.default.calculate([value, previousValue], 'addition');
		});
	},

	sumAndOperation: function sumAndOperation(reducer, previousValue, value) {
		var sum = _Helper2.default.calculate([value, previousValue], 'addition');

		return _Helper2.default.calculate([sum, reducer.operand], reducer.operator);
	},

	array: function array(reducer, previousValue, value) {
		previousValue = _Tools2.default.isArray(previousValue) ? previousValue : [];
		previousValue.push(value);
		return previousValue;
	}

};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Helper = __webpack_require__(1);

var _Helper2 = _interopRequireDefault(_Helper);

var _Tools = __webpack_require__(0);

var _Tools2 = _interopRequireDefault(_Tools);

var _formulaValues = __webpack_require__(15);

var _formulaValues2 = _interopRequireDefault(_formulaValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fvCache = {};

exports.default = {

	extract: function extract(item, selector) {
		return _Helper2.default.get(item, selector.path, selector.default);
	},

	join: function join(item, selector) {
		return selector.paths.map(function (path) {
			return _Helper2.default.get(item, path, selector.default);
		}).join(selector.separator || ' ');
	},

	split: function split(item, selector) {
		return _Helper2.default.get(item, selector.path, '').split(selector.separator || ' ');
	},

	format: function format(item, selector) {
		return selector.paths.reduce(function (partialFormat, path, index) {
			return partialFormat.replace('{' + index + '}', _Helper2.default.get(item, path, selector.default));
		}, selector.format || '');
	},

	compare: function compare(item, selector) {
		var comparison = _Helper2.default.compare(_Helper2.default.get(item, selector.path), selector.match, selector.operator);
		return comparison ? selector.truth : selector.false;
	},

	operation: function operation(item, selector) {
		if (selector.path) {
			return _Helper2.default.calculate([_Helper2.default.get(item, selector.path), selector.operand], selector.operator);
		} else if (selector.paths) {
			return _Helper2.default.calculate(_Helper2.default.extractMap(item, selector.paths), selector.operator);
		} else if (selector.keys) {
			return _Helper2.default.calculate(_Helper2.default.extractKeyValues(item, selector.keys), selector.operator);
		} else {
			return 0;
		}
	},

	average: function average(item, selector) {
		if (selector.paths) {
			return _Helper2.default.average(_Helper2.default.extractMap(item, selector.paths));
		} else if (selector.keys) {
			return _Helper2.default.average(_Helper2.default.extractKeyValues(item, selector.keys));
		} else {
			return 0;
		}
	},

	existsInArray: function existsInArray(item, selector) {

		var value = _Helper2.default.get(item, selector.path);

		if (!_Tools2.default.isArray(value)) {
			return value;
		}

		var matchValue = selector.matchValue || 1;
		var mismatchValue = selector.mismatchValue || 0;

		return value.indexOf(selector.match) !== -1 ? matchValue : mismatchValue;
	},

	pluck: function pluck(item, selector) {

		var value = _Helper2.default.get(item, selector.path);

		if (!_Tools2.default.isArray(value) || !selector.property) {
			return value;
		}

		return value.map(function (subItem) {
			return _Helper2.default.get(subItem, selector.property, selector.default || subItem);
		});
	},

	count: function count(item, selector) {

		var value = _Helper2.default.get(item, selector.path);

		if (!_Tools2.default.isArray(value)) {
			return value;
		}

		if (selector.match) {
			return value.filter(function (subItem) {
				return _Helper2.default.compare(subItem, selector.match, selector.operator);
			}).length;
		} else {
			return value.length;
		}
	},

	merge: function merge(item, selector) {
		var result = [],
		    value = void 0;
		selector.paths.forEach(function (path) {
			value = _Helper2.default.get(item, path);
			if (_Tools2.default.isArray(value)) {
				result = result.concat(value);
			}
		});
		return result;
	},

	zip: function zip(item, selector) {
		var result = [],
		    value = void 0,
		    i = void 0,
		    size = void 0;

		selector.paths.forEach(function (path) {
			value = _Helper2.default.get(item, path);
			if (_Tools2.default.isArray(value)) {
				size = value.length;
				for (i = 0; i < size; i++) {
					if (!result[i]) {
						result[i] = [];
					}
					result[i].push(value[i]);
				}
			}
		});
		return result;
	},

	itemAt: function itemAt(item, selector) {

		var value = _Helper2.default.get(item, selector.path);

		if (!_Tools2.default.isArray(value)) {
			return selector.default;
		}

		var index = 'undefined' !== typeof selector.index ? selector.index : 0,
		    size = value.length;

		if (size === 0) {
			return selector.default;
		}

		while (index < 0) {
			index = size + index;
		}

		return 'undefined' !== typeof value[index] ? value[index] : selector.default;
	},

	groupBy: function groupBy(item, selector) {

		var value = _Helper2.default.get(item, selector.path),
		    defaultValue = selector.default;

		if (!_Tools2.default.isArray(value)) {
			return defaultValue;
		}

		if (!selector.group) {
			console.warn('A \'group\' parameter must be provided for the groupBy operation.');
			return defaultValue;
		}

		var groupMap = {},
		    groupValue = void 0,
		    group = selector.group,
		    size = value.length - 1,
		    subItem = void 0;

		for (var i = size; i >= 0; i--) {
			subItem = value[i];
			groupValue = _Helper2.default.get(subItem, group);
			groupValue = 'undefined' !== typeof groupValue ? groupValue : defaultValue;
			groupMap[groupValue] = groupMap[groupValue] || [];
			groupMap[groupValue].push(subItem);
		}

		return groupMap;
	},

	objKeys: function objKeys(item, selector) {
		var value = _Helper2.default.get(item, selector.path);

		if (!_Tools2.default.isObject) {
			return value;
		}

		return Object.keys(value);
	},

	objValues: function objValues(item, selector) {
		var value = _Helper2.default.get(item, selector.path);

		if (!_Tools2.default.isObject) {
			return value;
		}

		return Object.values(value);
	},

	objEntries: function objEntries(item, selector) {
		var value = _Helper2.default.get(item, selector.path);

		if (!_Tools2.default.isObject) {
			return value;
		}

		return Object.entries(value);
	},

	formula: function formula(item, selector) {
		if (!selector.expr) {
			console.warn('Invalid FormulaValue expression (\'expr\').');
			return item;
		}

		if (!fvCache[selector.expr]) {
			fvCache[selector.expr] = new _formulaValues2.default(selector.expr);
		}

		var fv = fvCache[selector.expr];
		return fv.eval(item);
	}

};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cheff = __webpack_require__(6);

var _Cheff2 = _interopRequireDefault(_Cheff);

var _Helper = __webpack_require__(1);

var _Helper2 = _interopRequireDefault(_Helper);

var _filters = __webpack_require__(7);

var _filters2 = _interopRequireDefault(_filters);

var _mappers = __webpack_require__(8);

var _mappers2 = _interopRequireDefault(_mappers);

var _selectors = __webpack_require__(10);

var _selectors2 = _interopRequireDefault(_selectors);

var _reducers = __webpack_require__(9);

var _reducers2 = _interopRequireDefault(_reducers);

var _Tools = __webpack_require__(0);

var _Tools2 = _interopRequireDefault(_Tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var operationsStore = {
	filters: _filters2.default,
	mappers: _mappers2.default,
	selectors: _selectors2.default,
	reducers: _reducers2.default
};

var operationsMap = {
	overturn: function overturn(collection, step) {
		return _Cheff2.default.overturn(collection, step.cont);
	},
	filters: function filters(collection, step) {
		return _Cheff2.default.filter(collection, step.cont, applyOperation);
	},
	pick: function pick(collection, step) {
		return _Cheff2.default.pick(collection, step.cont);
	},
	mappers: function mappers(collection, step) {
		return _Cheff2.default.map(collection, step.cont, applyOperation);
	},
	explode: function explode(collection, step) {
		return _Cheff2.default.explode(collection, step.cont);
	},
	selectors: function selectors(collection, step) {
		return _Cheff2.default.select(collection, step.cont, applyOperation);
	},
	uniq: function uniq(collection, step) {
		return _Cheff2.default.uniq(collection, step.cont);
	},
	reducers: function reducers(collection, step) {
		return [_Cheff2.default.reduce(collection, step.cont, applyOperation)];
	},
	pivot: function pivot(collection, step) {
		return _Cheff2.default.pivot(collection, step.cont, applyOperation);
	},
	nest: function nest(collection, step) {
		var _this = this;

		var sourcePath = step.path,
		    resultPath = step.dest || sourcePath;
		return collection.map(function (element) {
			return _Helper2.default.set(element, resultPath, sushiCook.call(_this, _Helper2.default.get(element, sourcePath, []), step.cont));
		});
	},
	classify: function classify(collection, step) {
		return _Cheff2.default.classify(collection, step.cont, applyOperation);
	},
	split: function split(collection, step) {
		return _Cheff2.default.split(collection, step.cont, applyOperation);
	}
};

var operationsList = ['overturn', 'filters', 'pick', 'sorters', 'mappers', 'explode', 'selectors', 'uniq', 'reducers', 'pivot'];

var convertFromLegacy = function convertFromLegacy(recipe, verbose) {
	var testStep = recipe[0];
	if (testStep && operationsList.reduce(function (memo, operationName) {
		return memo || !!testStep[operationName];
	}, false)) {

		var newRecipe = [];

		recipe.forEach(function (step) {
			Object.keys(step).forEach(function (key) {
				newRecipe.push({
					op: key,
					cont: step[key]
				});
			});
		});

		if (verbose) {
			console.warn('Legacy recipe found.');
			console.log('New recipe :');
			console.log(JSON.stringify(newRecipe, null, 3));
		}

		return newRecipe;
	} else {
		return recipe;
	}
};

var applyStep = function applyStep(collection, step, options) {
	step = step || {};

	if (operationsMap[step.op]) {
		collection = operationsMap[step.op].call(this, collection, step, options);
	} else {
		console.warn('Not found: ' + step.op + '.');
	}

	return collection;
};

var applyOperation = function applyOperation(type, name) {
	for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		rest[_key - 2] = arguments[_key];
	}

	if (operationsStore[type + 's'][name]) {
		return operationsStore[type + 's'][name].apply(undefined, rest);
	}

	return notFound(type, name);
};

var notFound = function notFound(type, name) {
	console.warn(type + ' ' + name + ' was not found in the available processes.');
	return false;
};

var invalidOperation = function invalidOperation(type, name) {
	console.warn(type + ' is not a valid process type.');
	return false;
};

function sushiCook(collection, recipe, parameters) {
	var _this2 = this;

	if (_Tools2.default.isObject(recipe)) {
		recipe = [recipe];
	} else if (!_Tools2.default.isArray(recipe)) {
		recipe = [];
	}

	recipe = convertFromLegacy(recipe, this.options.verbose);

	if (parameters) {
		recipe = this.applyParameters(recipe, parameters);
	}

	recipe.forEach(function (step) {
		collection = applyStep.call(_this2, collection, step);
	});

	return collection;
}

// Cannot use 'export default' for compatibility issues
module.exports = function () {
	function Sushi() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Sushi);

		this.options = options;
	}

	_createClass(Sushi, [{
		key: 'addOperationsBundle',
		value: function addOperationsBundle(processesBundle) {
			this.addOperations('filter', processesBundle.filters);
			this.addOperations('picker', processesBundle.pickers);
			this.addOperations('mapper', processesBundle.mappers);
			this.addOperations('reducer', processesBundle.reducers);
		}
	}, {
		key: 'addOperations',
		value: function addOperations(type, processes) {
			for (var name in processes) {
				this.addOperation(type, name, processes[name]);
			}
		}
	}, {
		key: 'addOperation',
		value: function addOperation(type, name, method) {

			if (!type) {
				return invalidOperation();
			}

			operationsStore[type + 's'][name] = method;
		}
	}, {
		key: 'addFilter',
		value: function addFilter(name, method) {
			this.addOperation('filter', name, method);
		}
	}, {
		key: 'addMapper',
		value: function addMapper(name, method) {
			this.addOperation('mapper', name, method);
		}
	}, {
		key: 'addReducer',
		value: function addReducer(name, method) {
			this.addOperation('reducer', name, method);
		}
	}, {
		key: 'applyParameters',
		value: function applyParameters(recipe, parameters) {

			var serializedRecipe = JSON.stringify(recipe);

			for (var parameterName in parameters) {
				serializedRecipe = serializedRecipe.replace(new RegExp('#' + parameterName + '#', 'g'), parameters[parameterName]);
			}

			return JSON.parse(serializedRecipe);
		}
	}, {
		key: 'cook',
		value: function cook(collection, recipe, parameters) {
			return sushiCook.call(this, collection, recipe, parameters);
		}
	}, {
		key: 'helper',
		value: function helper() {
			return _Helper2.default;
		}
	}]);

	return Sushi;
}();

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CompiledExpression__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Variable__ = __webpack_require__(4);




const CLEANING_RULES = [{
		pattern: '\'',
		replacement: '\\\''
	}],
	VARIABLE_REGEX = new RegExp(__WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* default */].patterns.variable),
	PARSED_EXPRESSION_REGEX = new RegExp(__WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* default */].patterns.parsedExpression,'g');

class ConcatenatedText extends __WEBPACK_IMPORTED_MODULE_1__CompiledExpression__["a" /* default */] {

	constructor(expression = '') {
		super(CLEANING_RULES, expression);
	}

	eval(data, metaData, context) {
		let result = '';
		try {
			let contextPath = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* default */].processPath(context);

			let parsedVariables = this._variables.map((variable) => {
				if (variable.hasStar()) {
					return '';
				}
				return __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* default */].evalWithSafeEnvironment(
					variable.parseVariable(contextPath),
					data,
					metaData
				);
			});

			result = this._parsedExpression.replace(
				PARSED_EXPRESSION_REGEX,
				(match, number) => {
					return parsedVariables[parseInt(number)];
				});
		} catch (error) {
			console.warn(error);
		}
		return result;
	}

	getDependencies() {
		return this._variables.map((fieldPath) => fieldPath.split('::').shift());
	}

	static isConcatenatedText(expression) {
		return 'string' === typeof expression && VARIABLE_REGEX.test(expression);
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ConcatenatedText;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CompiledExpression__ = __webpack_require__(3);


class DefaultValue extends __WEBPACK_IMPORTED_MODULE_0__CompiledExpression__["a" /* default */] {

	constructor(expression) {
		super([], '');
		this.value = expression;
	}

	eval() {
		return this.value;
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = DefaultValue;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CompiledExpression__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Variable__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Helpers__ = __webpack_require__(2);




var CLEANING_RULES = [
	{
		pattern: '^=',
		replacement: ''
	},
	{
		pattern: '\'',
		replacement: '\\\''
	}
];

class Formula extends __WEBPACK_IMPORTED_MODULE_0__CompiledExpression__["a" /* default */] {

	constructor(expression) {
		super(CLEANING_RULES, expression);
	}

	eval(data, metaData, context) {
		let result = null;
		try {
			let contextPath = __WEBPACK_IMPORTED_MODULE_2__Helpers__["a" /* default */].processPath(context);
			let parsedVariables = this._variables.map((variable) => {
				return variable.parseVariable(contextPath);
			});
			let resolvedParsedExpression = this._parsedExpression.replace(/\[\*(\d*)\*\]/g, (match, number) => {
				return parsedVariables[parseInt(number)];
			});
			result = __WEBPACK_IMPORTED_MODULE_2__Helpers__["a" /* default */].evalWithSafeEnvironment(resolvedParsedExpression, data, metaData);
		} catch (error) {
			console.warn(error);
		}
		return result;
	}

	getDependencies() {
		return this._variables.map((fieldPath) => fieldPath.split('::').shift());
	}

	static isFormula(expression) {
		return 'string' === typeof expression && expression.indexOf('=') === 0;
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Formula;



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Formula__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ConcatenatedText__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__DefaultValue__ = __webpack_require__(13);




class FormulaValue {

	constructor(expression = '') {
		if (__WEBPACK_IMPORTED_MODULE_0__Formula__["a" /* default */].isFormula(expression)) {
			this.compiledExpression = new __WEBPACK_IMPORTED_MODULE_0__Formula__["a" /* default */](expression);
		} else if (__WEBPACK_IMPORTED_MODULE_1__ConcatenatedText__["a" /* default */].isConcatenatedText(expression)) {
			this.compiledExpression = new __WEBPACK_IMPORTED_MODULE_1__ConcatenatedText__["a" /* default */](expression);
		} else {
			this.compiledExpression = new __WEBPACK_IMPORTED_MODULE_2__DefaultValue__["a" /* default */](expression);
		}
	}

	eval(data = {}, metaData = {}, context = '') {
		return this.compiledExpression.eval(data, metaData, context);
	}

	static isFormulaValue(expression) {
		return __WEBPACK_IMPORTED_MODULE_0__Formula__["a" /* default */].isFormula(expression) || __WEBPACK_IMPORTED_MODULE_1__ConcatenatedText__["a" /* default */].isConcatenatedText(expression);
	}

}
/* harmony export (immutable) */ __webpack_exports__["default"] = FormulaValue;



/***/ }),
/* 16 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_18__;

/***/ })
/******/ ]);
});