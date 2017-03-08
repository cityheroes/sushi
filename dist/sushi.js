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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var SushiCoreProcesses = {};

SushiCoreProcesses.filters = {

	match: function match(item, filter, helper) {
		return helper.extract(item, filter.path) === filter.match;
	},

	mismatch: function mismatch(item, filter, helper) {
		return helper.extract(item, filter.path) !== filter.match;
	},

	compare: function compare(item, filter, helper) {
		return helper.compare(helper.extract(item, filter.path), filter.match, filter.operator);
	},

	start: function start(item, filter, helper) {
		return helper.extract(item, filter.path, '').indexOf(filter.match) !== -1;
	},

	end: function end(item, filter, helper) {
		var subject = helper.extract(item, filter.path, '');
		return subject.indexOf(filter.match, subject.length - filter.match.length) !== -1;
	}

};

SushiCoreProcesses.mappers = {

	extract: function extract(item, mapper, helper) {
		return helper.parsePath(mapper.path).map(function (path) {
			return helper.extract(item, path, mapper.default);
		}).join(mapper.separator || ' ');
	},

	convert: function convert(item, mapper, helper) {
		var comparison = helper.compare(helper.extract(item, mapper.path), mapper.match, mapper.operator);
		return comparison ? mapper.truth : mapper.false;
	},

	operation: function operation(item, mapper, helper) {
		return helper.calculate([helper.extract(item, mapper.path), mapper.operand], mapper.operator);
	},

	sum: function sum(item, mapper, helper) {
		return helper.calculate([helper.extract(item, mapper.path), mapper.operand], 'addition');
	},

	operationMap: function operationMap(item, mapper, helper) {
		return helper.calculate(helper.extractMap(item, mapper.path), mapper.operator);
	}

};

SushiCoreProcesses.reducers = {

	total: function total(item, reducer, previousValue, helper) {
		return previousValue + 1;
	},

	count: function count(item, reducer, previousValue, helper) {
		var value = helper.extract(item, reducer.path);
		return value ? previousValue + 1 : previousValue;
	},

	countCompare: function countCompare(item, reducer, previousValue, helper) {
		return helper.compare(helper.extract(item, reducer.path), reducer.match, reducer.operator) ? previousValue + 1 : previousValue;
	},

	operation: function operation(item, reducer, previousValue, helper) {
		return helper.calculate([helper.extract(item, reducer.path), previousValue], reducer.operator);
	},

	sum: function sum(item, reducer, previousValue, helper) {
		return helper.calculate([helper.extract(item, reducer.path), previousValue], 'addition');
	},

	sumAndOperation: function sumAndOperation(item, reducer, previousValue, helper) {
		var sum = helper.calculate([helper.extract(item, reducer.path), previousValue], 'addition');

		return helper.calculate([sum, reducer.operand], reducer.operator);
	}

};

exports.default = SushiCoreProcesses;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SushiHelper = function () {
	function SushiHelper() {
		_classCallCheck(this, SushiHelper);
	}

	_createClass(SushiHelper, null, [{
		key: 'parsePath',
		value: function parsePath(pathParam) {
			return !Array.isArray(pathParam) ? [pathParam] : pathParam;
		}
	}, {
		key: 'extract',
		value: function extract(obj, path, defaultValue) {

			if (Array.isArray(path)) {
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
		}
	}, {
		key: 'extractMap',
		value: function extractMap(item, paths, defaultValue) {
			var that = this;
			return this.parsePath(paths).map(function (path) {
				return that.extract(item, path, defaultValue);
			});
		}
	}, {
		key: 'compare',
		value: function compare(lvalue, rvalue, operator) {

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
		}
	}, {
		key: 'calculate',
		value: function calculate(operands, operator) {

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
		}
	}]);

	return SushiHelper;
}();

exports.default = SushiHelper;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SushiHelper = __webpack_require__(1);

var _SushiHelper2 = _interopRequireDefault(_SushiHelper);

var _SushiCoreProcesses = __webpack_require__(0);

var _SushiCoreProcesses2 = _interopRequireDefault(_SushiCoreProcesses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isArray = function isArray(value) {
	return Array.isArray(value);
};

var isObject = function isObject(obj) {
	return obj === Object(obj);
};

// Cannot use 'export default' for compatibility issues
module.exports = function () {
	function Sushi() {
		_classCallCheck(this, Sushi);

		this._filters = {};
		this._mappers = {};
		this._reducers = {};

		this.addProcessesBundle(_SushiCoreProcesses2.default);
	}

	_createClass(Sushi, [{
		key: 'addProcessesBundle',
		value: function addProcessesBundle(processesBundle) {
			this.addProcesses('filter', processesBundle.filters);
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
				return this._invalidProcess();
			}

			this['_' + type + 's'][name] = method;
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
		key: 'roll',
		value: function roll(collection, recipe, parameters) {

			if (isObject(recipe)) {
				recipe = [recipe];
			} else if (!isArray(recipe)) {
				recipe = [];
			}

			if (parameters) {
				recipe = this._injectParameters(recipe, parameters);
			}

			var that = this;
			recipe.forEach(function (step) {
				collection = that._applyStep(collection, step);
			});

			return collection;
		}
	}, {
		key: '_applyStep',
		value: function _applyStep(collection, step) {
			step = step || {};

			collection = step.overturn ? this._overturn(collection, step.overturn) : collection;
			collection = step.filters ? this._filter(collection, step.filters) : collection;
			collection = step.mappers ? this._map(collection, step.mappers) : collection;
			collection = step.reducers ? [this._reduce(collection, step.reducers)] : collection;

			return collection;
		}
	}, {
		key: '_injectParameters',
		value: function _injectParameters(recipe, parameters) {

			var serializedRecipe = JSON.stringify(recipe);

			for (var parameterName in parameters) {
				serializedRecipe = serializedRecipe.replace(new RegExp('#' + parameterName + '#', 'g'), parameters[parameterName]);
			}

			return JSON.parse(serializedRecipe);
		}
	}, {
		key: '_overturn',
		value: function _overturn(collection, overturn) {
			var that = this;

			if (!overturn.pivot) {
				console.warn('Overturn operation needs a \'pivot\' parameter.');
				return collection;
			}

			var pivot = overturn.pivot,
			    dest = overturn.dest;

			return collection.reduce(function (reducedItems, item) {

				var parent = item[pivot];

				if (isArray(item[pivot])) {
					reducedItems = reducedItems.concat(item[pivot]);
				} else {}

				return reducedItems;
			}, []);
		}
	}, {
		key: '_filter',
		value: function _filter(collection, filters) {
			var that = this;
			return collection.filter(function (item) {
				return filters.reduce(function (previousResult, filter) {
					return previousResult && that._applyFilter(filter, item);
				}, true);
			});
		}
	}, {
		key: '_applyFilter',
		value: function _applyFilter(filter, item) {
			return this._filters[filter.name] ? this._filters[filter.name](item, filter, _SushiHelper2.default) : this._notFound('filter', filter.name);
		}
	}, {
		key: '_map',
		value: function _map(collection, mappers) {
			var that = this;
			return collection.map(function (item) {
				return mappers.reduce(function (mappedItem, mapper) {
					mappedItem[mapper.output] = that._applyMapper(mapper, item);
					return mappedItem;
				}, {});
			});
		}
	}, {
		key: '_applyMapper',
		value: function _applyMapper(mapper, item) {
			return this._mappers[mapper.name] ? this._mappers[mapper.name](item, mapper, _SushiHelper2.default) : this._notFound('mapper', mapper.name);
		}
	}, {
		key: '_reduce',
		value: function _reduce(collection, reducers) {

			if (reducers.length === 0) {
				return collection;
			}

			var that = this;
			return reducers.reduce(function (mappedItem, reducer) {

				mappedItem[reducer.output] = collection.reduce(function (memo, item) {
					return that._applyReducer(reducer, item, memo);
				}, reducer.start || 0);

				return mappedItem;
			}, {});
		}
	}, {
		key: '_applyReducer',
		value: function _applyReducer(reducer, item, memo) {
			return this._reducers[reducer.name] ? this._reducers[reducer.name](item, reducer, memo, _SushiHelper2.default) : this._notFound('reducer', reducer.name);
		}
	}, {
		key: '_expand',
		value: function _expand(obj, expanders) {
			var that = this;
			return Object.keys(obj).map(function (key) {
				return expanders.reduce(function (expandedItem, expander) {
					expandedItem[expander.output] = that._applyExpander(expander, obj[key]);
					return expandedItem;
				}, {});
			});
		}
	}, {
		key: '_applyExpander',
		value: function _applyExpander(expander, item) {
			return this._expanders[expander.name] ? this._expanders[expander.name](item, expander, _SushiHelper2.default) : this._notFound('expander', expander.name);
		}
	}, {
		key: '_notFound',
		value: function _notFound(type, name) {
			console.warn(type + ' ' + name + ' was not found in the available processes.');
			return false;
		}
	}, {
		key: '_invalidProcess',
		value: function _invalidProcess(type, name) {
			console.warn(type + ' is not a valid process type.');
			return false;
		}
	}]);

	return Sushi;
}();

/***/ })
/******/ ]);
});