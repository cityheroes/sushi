var isArray = function(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
};

var SushiHelper = {};

SushiHelper.parsePath = function(pathParam) {
	return !isArray(pathParam) ? [pathParam] : pathParam;
};

SushiHelper.extract = function(obj, path, defaultValue) {

	if (isArray(path)) {
		defaultValue = path[1];
		path = path[0];
	}

	var arr = path.split('.');

	while (arr.length && obj) {
		var comp = arr.shift();
		var match = new RegExp('(.+)\\[([0-9]*)\\]').exec(comp);
		if ((match !== null) && (match.length == 3)) {
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

SushiHelper.extractMap = function(item, paths, defaultValue) {
	var that = this;
	return this.parsePath(paths).map(function(path) {
		return that.extract(item, path, defaultValue);
	});
};

SushiHelper.compare = function(lvalue, rvalue, operator) {

	operator = operator || 'eq';

	var operators = {
		'eq':      function(l, r) { return l === r; },
		'ne':      function(l, r) { return l !== r; },
		'lt':        function(l, r) { return l < r; },
		'gt':        function(l, r) { return l > r; },
		'le':       function(l, r) { return l <= r; },
		'ge':       function(l, r) { return l >= r; },
	};

	return operators[operator](lvalue, rvalue);
};

SushiHelper.calculate = function(operands, operator) {

	operator = operator || 'sum';

	var operators = {
		'addition': {
			method: function(lvalue, rvalue) {
				return lvalue + rvalue;
			},
			neutral: 0
		},
		'subtraction': {
			method: function(lvalue, rvalue) {
				return lvalue - rvalue;
			},
			neutral: 0
		},
		'division': {
			method: function(lvalue, rvalue) {
				return lvalue / rvalue;
			},
			neutral: 1
		},
		'multiplication': {
			method: function(lvalue, rvalue) {
				return lvalue * rvalue;
			},
			neutral: 1
		},
	};

	return operands.reduce(function(memo, value) {
		return operators[operator].method(
			parseFloat(value) || operators[operator].neutral,
			memo
		);
	}, operators[operator].neutral);
};

var SushiCoreProcesses = {};

SushiCoreProcesses.filters = {

	match: function(item, filter, helper) {
		return helper.extract(item, filter.path) === filter.match;
	},

	mismatch: function(item, filter, helper) {
		return helper.extract(item, filter.path) !== filter.match;
	},

	compare: function(item, filter, helper) {
		return helper.compare(
			helper.extract(item, filter.path),
			filter.match,
			filter.operator
		);
	},

};

SushiCoreProcesses.transformations = {

	extract: function(item, transformation, helper) {
		return helper.parsePath(transformation.path).map(function(path) {
			return helper.extract(item, path, transformation.default);
		}).join(transformation.separator || ' ');
	},

	convert: function(item, transformation, helper) {
		var comparison = helper.compare(
			helper.extract(item, transformation.path),
			transformation.match,
			transformation.operator
		);
		return comparison ? transformation.truthful : transformation.truthful;
	},

	operation: function(item, transformation, helper) {
		return helper.calculate(
			[helper.extract(item, transformation.path), transformation.operand],
			transformation.operator
		);
	},

	sum: function(item, transformation, helper) {
		return helper.calculate(
			[helper.extract(item, transformation.path), transformation.operand],
			'addition'
		);
	},

	operationMap: function(item, transformation, helper) {
		return helper.calculate(
			helper.extractMap(item, transformation.path),
			transformation.operator
		);
	},

};

SushiCoreProcesses.aggregations = {

	total: function(item, aggregation, previousValue, helper) {
		return previousValue + 1;
	},

	count: function(item, aggregation, previousValue, helper) {
		var value = helper.extract(item, aggregation.path);
		return value ? previousValue + 1 : previousValue;
	},

	countCompare: function(item, aggregation, previousValue, helper) {
		return helper.compare(
			helper.extract(item, aggregation.path),
			aggregation.match,
			aggregation.operator
		) ? previousValue + 1 : previousValue;
	},

	operation: function(item, aggregation, previousValue, helper) {
		return helper.calculate(
			[helper.extract(item, aggregation.path), previousValue],
			aggregation.operator
		);
	},

	sum: function(item, aggregation, previousValue, helper) {
		return helper.calculate(
			[helper.extract(item, aggregation.path), previousValue],
			'addition'
		);
	},

	sumAndOperation: function(item, aggregation, previousValue, helper) {
		console.log(previousValue, helper.extract(item, aggregation.path));
		var sum = helper.calculate(
			[helper.extract(item, aggregation.path), previousValue],
			'addition'
		);

		return helper.calculate(
			[sum, aggregation.operand],
			aggregation.operator
		);
	},

};

var Sushi = function() {

	this._filters = {};
	this._transformations = {};
	this._aggregations = {};

	this._addProcesses('filter', SushiCoreProcesses.filters);
	this._addProcesses('transformation', SushiCoreProcesses.transformations);
	this._addProcesses('aggregation', SushiCoreProcesses.aggregations);
};

Sushi.prototype._addProcesses = function(type, cartridges) {
	for(var name in cartridges) {
		this._addProcess(type, name, cartridges[name]);
	}
};

Sushi.prototype._addProcess = function(type, name, method) {

	if (!type) {
		return this._invalidCartridge();
	}

	this['_' + type + 's'][name] = method;
};

Sushi.prototype.addFilter = function(name, method) { this._addProcess('filter', name, method); };
Sushi.prototype.addTransformation = function(name, method) { this._addProcess('transformation', name, method); };
Sushi.prototype.addAggregation = function(name, method) { this._addProcess('aggregation', name, method); };

Sushi.prototype.roll = function(collection, recipe) {

	recipe = recipe || {};

	collection = recipe.filters ? this._filter(collection, recipe.filters) : collection;
	collection = recipe.transformations ? this._transform(collection, recipe.transformations) : collection;
	collection = recipe.aggregations ? this._aggregate(collection, recipe.aggregations) : collection;

	return collection;
};

Sushi.prototype._filter = function(collection, filters) {
	var that = this;
	return collection.filter(function(item) {
		return filters.reduce(function(previousResult, filter) {
			return previousResult && that._applyFilter(filter, item);
		}, true);
	});
};

Sushi.prototype._applyFilter = function(filter, item) {
	return this._filters[filter.name] ? this._filters[filter.name](item, filter, SushiHelper) : this._notFound('filter', filter.name);
};

Sushi.prototype._transform = function(collection, transformations) {
	var that = this;
	return collection.map(function(item) {
		return transformations.reduce(function(transformedItem, transformation) {
			transformedItem[transformation.output] = that._applyTransformation(transformation, item);
			return transformedItem;
		}, {});
	});
};

Sushi.prototype._applyTransformation = function(transformation, item) {
	return this._transformations[transformation.name] ? this._transformations[transformation.name](item, transformation, SushiHelper) : this._notFound('transformation', transformation.name);
};

Sushi.prototype._aggregate = function(collection, aggregations) {

	if (aggregations.length === 0) {
		return collection;
	}

	var that = this;
	return aggregations.reduce(function(transformedItem, aggregation) {

		transformedItem[aggregation.output] = collection.reduce(function(memo, item) {
			return that._applyAggregation(aggregation, item, memo);
		}, (aggregation.start || 0));

		return transformedItem;

	}, {});
};

Sushi.prototype._applyAggregation = function(aggregation, item, memo) {
	return this._aggregations[aggregation.name] ? this._aggregations[aggregation.name](item, aggregation, memo, SushiHelper) : this._notFound('aggregation', aggregation.name);
};

Sushi.prototype._notFound = function(type, name) {
	console.warn(type + ' ' + name + ' was not found in the available cartridges.');
	return false;
};

Sushi.prototype._invalidCartridge = function(type, name) {
	console.warn(type + ' is not a valid cartridge type.');
	return false;
};
