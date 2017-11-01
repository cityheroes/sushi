
import Cheff from './Cheff';
import Helper from './Helper';
import coreFilters from './CoreOperations/filters';
// import coreSorters from './CoreOperations/sorters';
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

const operationsMap = {
	overturn: (collection, step) => {
		return Cheff.overturn(collection, step.cont);
	},
	filters: (collection, step) => {
		return Cheff.filter(collection, step.cont, applyOperation);
	},
	pick: (collection, step) => {
		return Cheff.pick(collection, step.cont);
	},
	// sorters: (collection, step) => {
	// 	return Cheff.sort(collection, step.cont, applyOperation);
	// },
	mappers: (collection, step) => {
		return Cheff.map(collection, step.cont, applyOperation);
	},
	explode: (collection, step) => {
		return Cheff.explode(collection, step.cont);
	},
	selectors: (collection, step) => {
		return Cheff.select(collection, step.cont, applyOperation);
	},
	uniq: (collection, step) => {
		return Cheff.uniq(collection, step.cont);
	},
	reducers: (collection, step) => {
		return [Cheff.reduce(collection, step.cont, applyOperation)];
	},
};

const operationsList = [
	'overturn',
	'filters',
	'pick',
	'sorters',
	'mappers',
	'explode',
	'selectors',
	'uniq',
	'reducers'
];

const convertFromLegacy = (recipe, verbose) => {
	var testStep = recipe[0];
	if (testStep && operationsList.reduce((memo, operationName) => {
		return memo || !!testStep[operationName];
	}, false)) {

		var newRecipe = [];

		recipe.forEach((step) => {
			Object.keys(step).forEach((key) => {
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

const applyStep = (collection, step) => {
	step = step || {};

	if (operationsMap[step.op]) {
		collection = operationsMap[step.op](collection, step);
	} else {
		console.warn('Not found: ' + step.op + '.');
	}

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

	constructor (options = {}) {
		this.options = options;
	}

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

	applyParameters (recipe, parameters) {

		var serializedRecipe = JSON.stringify(recipe);

		for (var parameterName in parameters) {
			serializedRecipe = serializedRecipe.replace(new RegExp('#' + parameterName + '#', 'g'), parameters[parameterName]);
		}

		return JSON.parse(serializedRecipe);
	}

	cook (collection, recipe, parameters) {

		if (tools.isObject(recipe)) {
			recipe = [recipe];
		} else if (!tools.isArray(recipe)) {
			recipe = [];
		}

		recipe = convertFromLegacy(recipe, this.options.verbose);

		if (parameters) {
			recipe = this.applyParameters(recipe, parameters);
		}

		recipe.forEach((step) => {
			collection = applyStep(collection, step);
		});

		return collection;
	}

	helper () {
		return Helper;
	}

};