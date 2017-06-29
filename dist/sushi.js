(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Sushi"] = factory();
	else
		root["Sushi"] = factory();
})(this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Tools = __webpack_require__(1);

var _Tools2 = _interopRequireDefault(_Tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parsePath = function parsePath(pathParam) {
	return !_Tools2.default.isArray(pathParam) ? [pathParam] : pathParam;
};

var get = function get(obj, path, defaultValue) {

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
			obj = obj[comp];
		}
	}

	return obj || defaultValue;
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

	operator = operator || 'sum';

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
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Tools = __webpack_require__(1);

var _Tools2 = _interopRequireDefault(_Tools);

var _Helper = __webpack_require__(0);

var _Helper2 = _interopRequireDefault(_Helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Uni operations
var overturnOperation = function overturnOperation(collection, item, pivot, parentDest, childDest) {
	var parent = _Tools2.default.omit(item, pivot);
	var child = item[pivot];

	if (_Tools2.default.isArray(child)) {
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
	} else if (_Tools2.default.isObject(child)) {
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
	    child = _overturn.child || null;

	return collection.reduce(function (reducedItems, item) {
		return overturnOperation(reducedItems, item, pivot, dest, child);
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
		console.warn('A \'path\' parameter must be provided for uniq operation.');
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

// Multi operations
var filter = function filter(collection, filters, applyOperation) {

	if (!filters || filters.length === 0) {
		return collection;
	}

	return collection.filter(function (item) {
		return filters.reduce(function (previousResult, filter) {
			return previousResult && applyOperation('filter', filter.name, item, filter);
		}, true);
	});
};

var sort = function sort(collection, sorters, applyOperation) {

	if (!sorters || sorters.length === 0) {
		return collection;
	}

	return collection.sort(function (item) {
		return sorters.reduce(function (previousResult, sorter) {
			return previousResult && applyOperation('sorter', sorter.name, item, sorter);
		}, true);
	});
};

var map = function map(collection, mappers, applyOperation) {

	if (!mappers || mappers.length === 0) {
		return collection;
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

var implode = function implode(collection, _implode) {
	return collection.reduce(function (resultCollection, item) {
		return resultCollection.concat(Object.keys(item).reduce(function (implodedItem, key) {

			var resultItem = {};

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

var select = function select(collection, selectors, applyOperation) {

	if (!selectors || selectors.length === 0) {
		return collection;
	}

	return collection.map(function (item) {
		return selectors.reduce(function (resultItem, selector) {
			resultItem[selector.dest] = applyOperation('selector', selector.name, item, selector);
			return resultItem;
		}, {});
	});
};

var reduce = function reduce(collection, reducers, applyOperation) {

	if (!reducers || reducers.length === 0) {
		return collection;
	}

	return reducers.reduce(function (resultItem, reducer) {

		var start = reducer.start || 0;

		if (reducer.group && reducer.path) {

			var auxResult = resultItem;

			if (reducer.dest) {
				resultItem[reducer.dest] = {};
				auxResult = resultItem[reducer.dest];
			}

			collection.forEach(function (item) {
				var groupKey = _Helper2.default.get(item, reducer.group);

				auxResult[groupKey] = applyOperation('reducer', reducer.name, reducer, auxResult[groupKey] || start, _Helper2.default.get(item, reducer.path));
			});
		} else if (reducer.path && reducer.dest) {
			resultItem[reducer.dest] = collection.reduce(function (memo, item) {

				return applyOperation('reducer', reducer.name, reducer, memo, _Helper2.default.get(item, reducer.path));
			}, start);
		} else if (reducer.keys) {

			collection.forEach(function (item) {
				_Helper2.default.iterateKeys(item, reducer.keys, function (key) {

					resultItem[key] = applyOperation('reducer', reducer.name, reducer, resultItem[key] || start, item[key]);
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
	reduce: reduce
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Tools = __webpack_require__(1);

var _Tools2 = _interopRequireDefault(_Tools);

var _Helper = __webpack_require__(0);

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
		return _Helper2.default.get(item, filter.path) === filter.match;
	},

	mismatch: function mismatch(item, filter) {
		return applyMatch(_Helper2.default.get(item, filter.path), filter.match, function (value, match) {
			return value !== match;
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Helper = __webpack_require__(0);

var _Helper2 = _interopRequireDefault(_Helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
		var convertions = mapper.convertions || {};
		return typeof convertions[value] !== 'undefined' ? convertions[value] : value;
	},

	classify: function classify(value, mapper) {
		var convertions = mapper.convertions || {};
		var roundedValue = Math.round(value);
		return typeof convertions[roundedValue] !== 'undefined' ? convertions[roundedValue] : value;
	}

};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Tools = __webpack_require__(1);

var _Tools2 = _interopRequireDefault(_Tools);

var _Helper = __webpack_require__(0);

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

	average: function average(reducer, previousValue, value) {
		return matchBehavior(reducer, previousValue, value, function () {
			return _Helper2.default.average([value, previousValue], reducer.operator);
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Helper = __webpack_require__(0);

var _Helper2 = _interopRequireDefault(_Helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
		return selector.paths.map(function (path) {
			return _Helper2.default.get(item, path, selector.default);
		}).split(selector.separator || ' ');
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
	}

};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import coreSorters from './CoreOperations/sorters';


var _Cheff = __webpack_require__(2);

var _Cheff2 = _interopRequireDefault(_Cheff);

var _Helper = __webpack_require__(0);

var _Helper2 = _interopRequireDefault(_Helper);

var _filters = __webpack_require__(3);

var _filters2 = _interopRequireDefault(_filters);

var _mappers = __webpack_require__(4);

var _mappers2 = _interopRequireDefault(_mappers);

var _selectors = __webpack_require__(6);

var _selectors2 = _interopRequireDefault(_selectors);

var _reducers = __webpack_require__(5);

var _reducers2 = _interopRequireDefault(_reducers);

var _Tools = __webpack_require__(1);

var _Tools2 = _interopRequireDefault(_Tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var operationsStore = {
	filters: _filters2.default,
	mappers: _mappers2.default,
	selectors: _selectors2.default,
	reducers: _reducers2.default
};

var applyStep = function applyStep(collection, step) {
	step = step || {};

	collection = step.overturn ? _Cheff2.default.overturn(collection, step.overturn) : collection;
	collection = step.filters ? _Cheff2.default.filter(collection, step.filters, applyOperation) : collection;
	collection = step.pick ? _Cheff2.default.pick(collection, step.pick) : collection;
	// collection = step.sorters ? Cheff.sort(collection, step.sorters, applyOperation) : collection;
	collection = step.mappers ? _Cheff2.default.map(collection, step.mappers, applyOperation) : collection;
	collection = step.explode ? _Cheff2.default.explode(collection, step.explode) : collection;
	collection = step.selectors ? _Cheff2.default.select(collection, step.selectors, applyOperation) : collection;
	collection = step.uniq ? _Cheff2.default.uniq(collection, step.uniq) : collection;
	collection = step.reducers ? [_Cheff2.default.reduce(collection, step.reducers, applyOperation)] : collection;

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

// Cannot use 'export default' for compatibility issues
module.exports = function () {
	function Sushi() {
		_classCallCheck(this, Sushi);
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

			if (_Tools2.default.isObject(recipe)) {
				recipe = [recipe];
			} else if (!_Tools2.default.isArray(recipe)) {
				recipe = [];
			}

			if (parameters) {
				recipe = this.applyParameters(recipe, parameters);
			}

			var that = this;
			recipe.forEach(function (step) {
				collection = applyStep(collection, step);
			});

			return collection;
		}
	}, {
		key: 'helper',
		value: function helper() {
			return _Helper2.default;
		}

		// _expand (obj, expanders) {
		// 	var that = this;
		// 	return Object.keys(obj).map((key) => {
		// 		return expanders.reduce((expandedItem, expander) => {
		// 			expandedItem[expander.output] = that._applyExpander(expander, obj[key]);
		// 			return expandedItem;
		// 		}, {});
		// 	});
		// }

		// _applyExpander (expander, item) {
		// 	return operationsStore.expanders[expander.name] ? operationsStore.expanders[expander.name](item, expander, Helper) : notFound('expander', expander.name);
		// }

	}]);

	return Sushi;
}();

/***/ })
/******/ ]);
});