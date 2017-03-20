
import Cheff from './Cheff';
import Helper from './Helper';
import coreFilters from './CoreOperations/filters';
import coreMappers from './CoreOperations/mappers';
import coreSelectors from './CoreOperations/selectors';
import coreReducers from './CoreOperations/reducers';
import tools from './Tools';

var operationsStore = {
	filters: coreFilters,
	mappers: coreMappers,
	selectors: coreSelectors,
	reducers: coreReducers,
};

const injectParameters = (recipe, parameters) => {

	var serializedRecipe = JSON.stringify(recipe);

	for (var parameterName in parameters) {
		serializedRecipe = serializedRecipe.replace(new RegExp('#' + parameterName + '#', 'g'), parameters[parameterName]);
	}

	return JSON.parse(serializedRecipe);
};

const applyStep = (collection, step) => {
	step = step || {};

	collection = step.overturn ? Cheff.overturn(collection, step.overturn) : collection;
	collection = step.filters ? Cheff.filter(collection, step.filters, applyOperation) : collection;
	collection = step.pick ? Cheff.pick(collection, step.pick) : collection;
	collection = step.mappers ? Cheff.map(collection, step.mappers, applyOperation) : collection;
	collection = step.explode ? Cheff.explode(collection, step.explode) : collection;
	collection = step.selectors ? Cheff.select(collection, step.selectors, applyOperation) : collection;
	collection = step.reducers ? [Cheff.reduce(collection, step.reducers, applyOperation)] : collection;

	return collection;
};

const applyOperation = (type, name, ...rest) => {

	if (operationsStore[type + 's'][name]) {
		return operationsStore[type + 's'][name].apply(undefined, rest);
	}

	return notFound(type, name);
};

const notFound = (type, name) => {
	console.warn(type + ' ' + name + ' was not found in the available processes.');
	return false;
};

const invalidOperation = (type, name) => {
	console.warn(type + ' is not a valid process type.');
	return false;
};

// Cannot use 'export default' for compatibility issues
module.exports = class Sushi  {

	addOperationsBundle (processesBundle) {
		this.addOperations('filter', processesBundle.filters);
		this.addOperations('picker', processesBundle.pickers);
		this.addOperations('mapper', processesBundle.mappers);
		this.addOperations('reducer', processesBundle.reducers);
	}

	addOperations (type, processes) {
		for (var name in processes) {
			this.addOperation(type, name, processes[name]);
		}
	}

	addOperation (type, name, method) {

		if (!type) {
			return invalidOperation();
		}

		operationsStore[type + 's'][name] = method;
	}

	addFilter (name, method) {
		this.addOperation('filter', name, method);
	}

	addMapper (name, method) {
		this.addOperation('mapper', name, method);
	}

	addReducer (name, method) {
		this.addOperation('reducer', name, method);
	}

	cook (collection, recipe, parameters) {

		if (tools.isObject(recipe)) {
			recipe = [recipe];
		} else if (!tools.isArray(recipe)) {
			recipe = [];
		}

		if (parameters) {
			recipe = injectParameters(recipe, parameters);
		}

		var that = this;
		recipe.forEach((step) => {
			collection = applyStep(collection, step);
		});

		return collection;
	}

	helper () {
		return Helper;
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

};