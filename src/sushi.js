
import Cheff from './Cheff';
import Helper from './Helper';
import coreFilters from './CoreProcesses/filters';
import corePickers from './CoreProcesses/pickers';
import coreMappers from './CoreProcesses/mappers';
import coreReducers from './CoreProcesses/reducers';
import tools from './Tools';

const processesStore = {
	filters: coreFilters,
	pickers: corePickers,
	mappers: coreMappers,
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
	collection = step.filters ? Cheff.filter(collection, step.filters, applyProcess) : collection;
	collection = step.pickers ? Cheff.pick(collection, step.pickers, applyProcess) : collection;
	collection = step.mappers ? Cheff.map(collection, step.mappers, applyProcess) : collection;
	collection = step.reducers ? [Cheff.reduce(collection, step.reducers, applyProcess)] : collection;

	return collection;
};

const applyProcess = (type, name, ...rest) => {
	if (processesStore[type + 's'][name]) {

		rest.push(Helper);

		return processesStore[type + 's'][name].apply(undefined, rest);
	} else {
		return notFound(type, name);
	}
};

const notFound = (type, name) => {
	console.warn(type + ' ' + name + ' was not found in the available processes.');
	return false;
};

const invalidProcess = (type, name) => {
	console.warn(type + ' is not a valid process type.');
	return false;
};

// Cannot use 'export default' for compatibility issues
module.exports = class Sushi  {

	addProcessesBundle (processesBundle) {
		this.addProcesses('filter', processesBundle.filters);
		this.addProcesses('picker', processesBundle.pickers);
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
			return invalidProcess();
		}

		processesStore[type + 's'][name] = method;
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

};