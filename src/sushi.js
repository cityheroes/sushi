
import SushiHelper from './SushiHelper';
import SushiCoreProcesses from './SushiCoreProcesses';

const isArray = (value) => {
	return Array.isArray(value);
};

const isObject = (obj) => {
	return obj === Object(obj);
};

// Cannot use 'export default' for compatibility issues
module.exports = class Sushi  {

	constructor() {
		this._filters = {};
		this._mappers = {};
		this._reducers = {};

		this.addProcessesBundle(SushiCoreProcesses);
	}

	addProcessesBundle (processesBundle) {
		this.addProcesses('filter', processesBundle.filters);
		this.addProcesses('mapper', processesBundle.mappers);
		this.addProcesses('reducer', processesBundle.reducers);
	}

	addProcesses (type, processes) {
		for (var name in processes) {
			this.addProcess(type, name, processes[name]);
		}
	}

	addProcess (type, name, method) {

		if (!type) {
			return this._invalidProcess();
		}

		this['_' + type + 's'][name] = method;
	}

	addFilter (name, method) {
		this.addProcess('filter', name, method);
	}

	addMapper (name, method) {
		this.addProcess('mapper', name, method);
	}

	addReducer (name, method) {
		this.addProcess('reducer', name, method);
	}

	roll (collection, recipe, parameters) {

		if (isObject(recipe)) {
			recipe = [recipe];
		} else if (!isArray(recipe)) {
			recipe = [];
		}

		if (parameters) {
			recipe = this._injectParameters(recipe, parameters);
		}

		var that = this;
		recipe.forEach((step) => {
			collection = that._applyStep(collection, step);
		});

		return collection;
	}

	_applyStep (collection, step) {
		step = step || {};

		collection = step.overturn ? this._overturn(collection, step.overturn) : collection;
		collection = step.filters ? this._filter(collection, step.filters) : collection;
		collection = step.mappers ? this._map(collection, step.mappers) : collection;
		collection = step.reducers ? [this._reduce(collection, step.reducers)] : collection;

		return collection;
	}

	_injectParameters (recipe, parameters) {

		var serializedRecipe = JSON.stringify(recipe);

		for (var parameterName in parameters) {
			serializedRecipe = serializedRecipe.replace(new RegExp('#' + parameterName + '#', 'g'), parameters[parameterName]);
		}

		return JSON.parse(serializedRecipe);
	}

	_overturn (collection, overturn) {
		var that = this;

		if (!overturn.pivot) {
			console.warn('Overturn operation needs a \'pivot\' parameter.');
			return collection;
		}

		var pivot = overturn.pivot,
				dest = overturn.dest
		;

		return collection.reduce((reducedItems, item) => {

			var parent = item[pivot];

			if (isArray(item[pivot])) {
				reducedItems = reducedItems.concat(item[pivot]);
			} else {

			}

			return reducedItems;
		}, []);
	}

	_filter (collection, filters) {
		var that = this;
		return collection.filter((item) => {
			return filters.reduce((previousResult, filter) => {
				return previousResult && that._applyFilter(filter, item);
			}, true);
		});
	}

	_applyFilter (filter, item) {
		return this._filters[filter.name] ? this._filters[filter.name](item, filter, SushiHelper) : this._notFound('filter', filter.name);
	}

	_map (collection, mappers) {
		var that = this;
		return collection.map((item) => {
			return mappers.reduce((mappedItem, mapper) => {
				mappedItem[mapper.output] = that._applyMapper(mapper, item);
				return mappedItem;
			}, {});
		});
	}

	_applyMapper (mapper, item) {
		return this._mappers[mapper.name] ? this._mappers[mapper.name](item, mapper, SushiHelper) : this._notFound('mapper', mapper.name);
	}

	_reduce (collection, reducers) {

		if (reducers.length === 0) {
			return collection;
		}

		var that = this;
		return reducers.reduce((mappedItem, reducer) => {

			mappedItem[reducer.output] = collection.reduce((memo, item) => {
				return that._applyReducer(reducer, item, memo);
			}, (reducer.start || 0));

			return mappedItem;

		}, {});
	}

	_applyReducer (reducer, item, memo) {
		return this._reducers[reducer.name] ? this._reducers[reducer.name](item, reducer, memo, SushiHelper) : this._notFound('reducer', reducer.name);
	}

	_expand (obj, expanders) {
		var that = this;
		return Object.keys(obj).map((key) => {
			return expanders.reduce((expandedItem, expander) => {
				expandedItem[expander.output] = that._applyExpander(expander, obj[key]);
				return expandedItem;
			}, {});
		});
	}

	_applyExpander (expander, item) {
		return this._expanders[expander.name] ? this._expanders[expander.name](item, expander, SushiHelper) : this._notFound('expander', expander.name);
	}

	_notFound (type, name) {
		console.warn(type + ' ' + name + ' was not found in the available processes.');
		return false;
	}

	_invalidProcess (type, name) {
		console.warn(type + ' is not a valid process type.');
		return false;
	}

};