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

var SushiCore = {};

SushiCore.filters = {

	match: function(item, filter, helper) {
		return helper.extract(item, filter.path) === filter.match;
	},

	mismatch: function(item, filter, helper) {
		return helper.extract(item, filter.path) !== filter.match;
	}

};

SushiCore.transformations = {

	extract: function(item, transformation, helper) {
		return helper.parsePath(transformation.path).map(function(path) {
			return helper.extract(item, path, transformation.default);
		}).join(transformation.separator || ' ');
	},

	sum: function(item, transformation, helper) {
		return helper.parsePath(transformation.path).reduce(function(memo, path) {
			return parseFloat((helper.extract(item, path) || 0)) + memo;
		}, 0);
	},

	subtract: function(item, transformation, helper) {
		return helper.parsePath(transformation.path).reduce(function(memo, path) {
			return parseFloat((helper.extract(item, path) || 0)) - memo;
		}, 0);
	},

	multiply: function(item, transformation, helper) {
		return helper.parsePath(transformation.path).reduce(function(memo, path) {
			return parseFloat((helper.extract(item, path) || 1)) * memo;
		}, 1);
	},

	divide: function(item, transformation, helper) {
		return helper.parsePath(transformation.path).reduce(function(memo, path) {
			return parseFloat((helper.extract(item, path) || 1)) / memo;
		}, 1);
	},

};

SushiCore.aggregations = {

	count: function(item, aggregation, previousValue, helper) {
		return previousValue + 1;
	},

	sum: function(item, aggregation, previousValue, helper) {
		return previousValue + helper.parsePath(aggregation.path).reduce(function(memo, path) {
			return parseFloat((helper.extract(item, path) || 0)) + memo;
		}, 0);
	},

	subtract: function(item, aggregation, previousValue, helper) {
		return previousValue + helper.parsePath(aggregation.path).reduce(function(memo, path) {
			return parseFloat((helper.extract(item, path) || 0)) - memo;
		}, 0);
	},

	multiply: function(item, aggregation, previousValue, helper) {
		return previousValue + helper.parsePath(aggregation.path).reduce(function(memo, path) {
			return parseFloat((helper.extract(item, path) || 0)) * memo;
		}, 1);
	},

	divide: function(item, aggregation, previousValue, helper) {
		return previousValue + helper.parsePath(aggregation.path).reduce(function(memo, path) {
			return parseFloat((helper.extract(item, path) || 0)) / memo;
		}, 1);
	},

};

var Sushi = function() {

	this._filters = {};
	this._transformations = {};
	this._aggregations = {};

	this.addCartridges('filter', SushiCore.filters);
	this.addCartridges('transformation', SushiCore.transformations);
	this.addCartridges('aggregation', SushiCore.aggregations);
};

Sushi.prototype.addCartridges = function(type, cartridges) {
	for(var name in cartridges) {
		this.addCartridge(type, name, cartridges[name]);
	}
};

Sushi.prototype.addCartridge = function(type, name, method) {
	type = ['filter', 'transformation', 'aggregation'].indexOf(type) !== -1 ? type : false;

	if (!type) {
		return this._invalidCartridge();
	}

	this['_' + type + 's'][name] = method;
};

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
