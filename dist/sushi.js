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
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cheff = __webpack_require__(6);

var _Cheff2 = _interopRequireDefault(_Cheff);

var _Helper = __webpack_require__(8);

var _Helper2 = _interopRequireDefault(_Helper);

var _filters = __webpack_require__(10);

var _filters2 = _interopRequireDefault(_filters);

var _pickers = __webpack_require__(12);

var _pickers2 = _interopRequireDefault(_pickers);

var _mappers = __webpack_require__(11);

var _mappers2 = _interopRequireDefault(_mappers);

var _reducers = __webpack_require__(13);

var _reducers2 = _interopRequireDefault(_reducers);

var _Tools = __webpack_require__(7);

var _Tools2 = _interopRequireDefault(_Tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var processesStore = {
	filters: _filters2.default,
	pickers: _pickers2.default,
	mappers: _mappers2.default,
	reducers: _reducers2.default
};

var injectParameters = function injectParameters(recipe, parameters) {

	var serializedRecipe = JSON.stringify(recipe);

	for (var parameterName in parameters) {
		serializedRecipe = serializedRecipe.replace(new RegExp('#' + parameterName + '#', 'g'), parameters[parameterName]);
	}

	return JSON.parse(serializedRecipe);
};

var applyStep = function applyStep(collection, step) {
	step = step || {};

	collection = step.overturn ? _Cheff2.default.overturn(collection, step.overturn) : collection;
	collection = step.filters ? _Cheff2.default.filter(collection, step.filters, applyProcess) : collection;
	collection = step.pickers ? _Cheff2.default.pick(collection, step.pickers, applyProcess) : collection;
	collection = step.mappers ? _Cheff2.default.map(collection, step.mappers, applyProcess) : collection;
	collection = step.reducers ? [_Cheff2.default.reduce(collection, step.reducers, applyProcess)] : collection;

	return collection;
};

var applyProcess = function applyProcess(type, name) {
	for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		rest[_key - 2] = arguments[_key];
	}

	if (processesStore[type + 's'][name]) {

		rest.push(_Helper2.default);

		return processesStore[type + 's'][name].apply(undefined, rest);
	} else {
		return notFound(type, name);
	}
};

var notFound = function notFound(type, name) {
	console.warn(type + ' ' + name + ' was not found in the available processes.');
	return false;
};

var invalidProcess = function invalidProcess(type, name) {
	console.warn(type + ' is not a valid process type.');
	return false;
};

// Cannot use 'export default' for compatibility issues
module.exports = function () {
	function Sushi() {
		_classCallCheck(this, Sushi);
	}

	_createClass(Sushi, [{
		key: 'addProcessesBundle',
		value: function addProcessesBundle(processesBundle) {
			this.addProcesses('filter', processesBundle.filters);
			this.addProcesses('picker', processesBundle.pickers);
			this.addProcesses('mapper', processesBundle.mappers);
			this.addProcesses('reducer', processesBundle.reducers);
		}
	}, {
		key: 'addProcesses',
		value: function addProcesses(type, processes) {
			for (var name in processes) {
				this.addProcess(type, name, processes[name]);
			}
		}
	}, {
		key: 'addProcess',
		value: function addProcess(type, name, method) {

			if (!type) {
				return invalidProcess();
			}

			processesStore[type + 's'][name] = method;
		}
	}, {
		key: 'addFilter',
		value: function addFilter(name, method) {
			this.addProcess('filter', name, method);
		}
	}, {
		key: 'addMapper',
		value: function addMapper(name, method) {
			this.addProcess('mapper', name, method);
		}
	}, {
		key: 'addReducer',
		value: function addReducer(name, method) {
			this.addProcess('reducer', name, method);
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
				recipe = injectParameters(recipe, parameters);
			}

			var that = this;
			recipe.forEach(function (step) {
				collection = applyStep(collection, step);
			});

			return collection;
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
		// 	return processesStore.expanders[expander.name] ? processesStore.expanders[expander.name](item, expander, Helper) : notFound('expander', expander.name);
		// }

	}]);

	return Sushi;
}();

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Tools = __webpack_require__(7);

var _Tools2 = _interopRequireDefault(_Tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var overturnProcess = function overturnProcess(collection, item, pivot, dest) {
	var parent = _Tools2.default.omit(item, pivot);
	var child = item[pivot];

	if (!child || !_Tools2.default.isObject(child)) {
		return collection;
	}

	if (_Tools2.default.isArray(child)) {
		return collection.concat(child.map(function (subitem) {
			subitem[dest] = parent;
			return subitem;
		}));
	} else {
		child[dest] = parent;
		collection.push(child);
		return collection;
	}
};

var overturn = function overturn(collection, _overturn) {

	if (!_overturn.pivot) {
		console.warn('Overturn operation needs a \'pivot\' parameter.');
		return collection;
	}

	var pivot = _overturn.pivot,
	    dest = _overturn.dest || 'parent';

	return collection.reduce(function (reducedItems, item) {
		return overturnProcess(reducedItems, item, pivot, dest);
	}, []);
};

var filter = function filter(collection, filters, applyProcess) {

	if (!filters || filters.length === 0) {
		return collection;
	}

	return collection.filter(function (item) {
		return filters.reduce(function (previousResult, filter) {
			return previousResult && applyProcess('filter', filter.name, item, filter);
		}, true);
	});
};

var pick = function pick(collection, pickers, applyProcess) {

	if (!pickers || pickers.length === 0) {
		return collection;
	}

	return collection.map(function (item) {
		return Object.keys(item).reduce(function (pickedItem, key) {
			pickers.forEach(function (picker) {
				if (applyProcess('picker', picker.name, key, picker)) {
					pickedItem[key] = item[key];
				}
			});
			return pickedItem;
		}, {});
	});
};

var map = function map(collection, mappers, applyProcess) {

	if (!mappers || mappers.length === 0) {
		return collection;
	}

	return collection.map(function (item) {
		return mappers.reduce(function (mappedItem, mapper) {
			if (mapper.dest) {
				mappedItem[mapper.dest] = applyProcess('mapper', mapper.name, item, mapper);
				return mappedItem;
			} else {
				return Object.assign(mappedItem, applyProcess('mapper', mapper.name, item, mapper));
			}
		}, {});
	});
};

var reduce = function reduce(collection, reducers, applyProcess) {

	if (!reducers || reducers.length === 0) {
		return collection;
	}

	return reducers.reduce(function (mappedItem, reducer, applyProcess) {

		mappedItem[reducer.dest] = collection.reduce(function (memo, item) {
			return applyProcess('reducer', reducer.name, item, reducer, memo);
		}, reducer.start || 0);

		return mappedItem;
	}, {});
};

// Cheff API
exports.default = {
	overturn: overturn,
	filter: filter,
	pick: pick,
	map: map,
	reduce: reduce
};

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Tools = __webpack_require__(7);

var _Tools2 = _interopRequireDefault(_Tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parsePath = function parsePath(pathParam) {
	return !_Tools2.default.isArray(pathParam) ? [pathParam] : pathParam;
};

var extract = function extract(obj, path, defaultValue) {

	if (_Tools2.default.isArray(path)) {
		defaultValue = path[1];
		path = path[0];
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
			obj = obj[comp];
		}
	}

	return obj || defaultValue;
};

var extractMap = function extractMap(item, paths, defaultValue) {
	return parsePath(paths).map(function (path) {
		return extract(item, path, defaultValue);
	});
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

	return operators[operator](lvalue, rvalue);
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
		return operators[operator].method(parseFloat(value) || operators[operator].neutral, memo);
	}, operators[operator].neutral);
};

exports.default = {
	parsePath: parsePath,
	extract: extract,
	extractMap: extractMap,
	compare: compare,
	calculate: calculate
};

/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {

	match: function match(item, filter, helper) {
		return helper.extract(item, filter.src) === filter.match;
	},

	mismatch: function mismatch(item, filter, helper) {
		return helper.extract(item, filter.src) !== filter.match;
	},

	compare: function compare(item, filter, helper) {
		return helper.compare(helper.extract(item, filter.src), filter.match, filter.operator);
	},

	start: function start(item, filter, helper) {
		return helper.extract(item, filter.src, '').indexOf(filter.match) !== -1;
	},

	end: function end(item, filter, helper) {
		var subject = helper.extract(item, filter.src, '');
		return subject.indexOf(filter.match, subject.length - filter.match.length) !== -1;
	}

};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {

	extract: function extract(item, mapper, helper) {
		return helper.parsePath(mapper.src).map(function (src) {
			return helper.extract(item, src, mapper.default);
		}).join(mapper.separator || ' ');
	},

	concat: function concat(item, mapper, helper) {
		return helper.parsePath(mapper.src).map(function (src) {
			return helper.extract(item, src, mapper.default);
		}).join(mapper.separator || ' ');
	},

	convert: function convert(item, mapper, helper) {
		var comparison = helper.compare(helper.extract(item, mapper.src), mapper.match, mapper.operator);
		return comparison ? mapper.truth : mapper.false;
	},

	// translate: (item, mapper, helper) => {
	// 	let translations = mapper.translations || {};

	// 	Object.keys(item).forEach((key) => {
	// 		translations[helper.extract(item, mapper.src)];
	// 	});

	// 	return item;
	// },

	operation: function operation(item, mapper, helper) {
		return helper.calculate([helper.extract(item, mapper.src), mapper.operand], mapper.operator);
	},

	sum: function sum(item, mapper, helper) {
		return helper.calculate([helper.extract(item, mapper.src), mapper.operand], 'addition');
	},

	operationMap: function operationMap(item, mapper, helper) {
		return helper.calculate(helper.extractMap(item, mapper.src), mapper.operator);
	}

};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {

	contains: function contains(key, picker, helper) {
		picker.matches = picker.matches || [];

		return picker.matches.reduce(function (previousValidation, match) {
			return previousValidation || key.indexOf(match) !== -1;
		}, false);
	}

};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {

	total: function total(item, reducer, previousValue, helper) {
		return previousValue + 1;
	},

	count: function count(item, reducer, previousValue, helper) {
		var value = helper.extract(item, reducer.src);
		return value ? previousValue + 1 : previousValue;
	},

	countCompare: function countCompare(item, reducer, previousValue, helper) {
		return helper.compare(helper.extract(item, reducer.src), reducer.match, reducer.operator) ? previousValue + 1 : previousValue;
	},

	operation: function operation(item, reducer, previousValue, helper) {
		return helper.calculate([helper.extract(item, reducer.src), previousValue], reducer.operator);
	},

	sum: function sum(item, reducer, previousValue, helper) {
		return helper.calculate([helper.extract(item, reducer.src), previousValue], 'addition');
	},

	sumAndOperation: function sumAndOperation(item, reducer, previousValue, helper) {
		var sum = helper.calculate([helper.extract(item, reducer.src), previousValue], 'addition');

		return helper.calculate([sum, reducer.operand], reducer.operator);
	}

};

/***/ })
/******/ ]);
});