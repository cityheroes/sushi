import Cheff from './cheff';
import Helper from './common/Helper';
import Tools from './common/Tools';
import coreFilters from './core-operations/filters';
import coreMappers from './core-operations/mappers';
import coreSelectors from './core-operations/selectors';
import coreReducers from './core-operations/reducers';
import coreAttachers from './core-operations/attachers';

var operationsStore = {
	filters: coreFilters,
	mappers: coreMappers,
	selectors: coreSelectors,
	reducers: coreReducers,
	attachers: coreAttachers,
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
	mappers: (collection, step) => {
		return Cheff.map(collection, step.cont, applyOperation);
	},
	explode: (collection, step) => {
		return Cheff.explode(collection, step.cont);
	},
	selectors: (collection, step) => {
		return Cheff.select(collection, step.cont, applyOperation);
	},
	reducers: (collection, step) => {
		return [Cheff.reduce(collection, step.cont, applyOperation)];
	},
	attachers: (collection, step) => {
		return Cheff.attach(collection, step.cont, applyOperation);
	},
	uniq: (collection, step) => {
		return Cheff.uniq(collection, step.cont);
	},
	pivot: (collection, step) => {
		return Cheff.pivot(collection, step.cont, applyOperation);
	},
	nest: function (collection, step) {
		let sourcePath = step.path,
			resultPath = step.dest || sourcePath;
		return collection.map((element) => {
			return Helper.set(element, resultPath, sushiCook.call(this, Helper.get(element, sourcePath, []), step.cont));
		});
	},
	classify: (collection, step) => {
		return Cheff.classify(collection, step.cont, applyOperation);
	},
	split: (collection, step) => {
		return Cheff.split(collection, step.cont, applyOperation);
	},
	remove: (collection, step) => {
		return Cheff.remove(collection, step.cont);
	},
	replace: (collection, step) => {
		return Cheff.replace(collection, step.cont);
	},
	explodeArrayProps: (collection, step) => {
		return Cheff.explodeArrayProps(collection, step.cont);
	}
};

const legacyOperationsList = [
	'overturn',
	'filters',
	'pick',
	'sorters',
	'mappers',
	'explode',
	'selectors',
	'uniq',
	'reducers',
	'pivot'
];

const convertFromLegacy = (recipe, verbose) => {
	var testStep = recipe[0];
	if (testStep && legacyOperationsList.reduce((memo, operationName) => {
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

const applyStep = function (collection, step, options) {
	step = step || {};

	if (operationsMap[step.op]) {
		collection = operationsMap[step.op].call(this, collection, step, options);
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

function sushiCook (collection, recipe, parameters) {

	if (Tools.isObject(recipe)) {
		recipe = [recipe];
	} else if (!Tools.isArray(recipe)) {
		recipe = [];
	}

	recipe = convertFromLegacy(recipe, this.options.verbose);

	if (parameters) {
		recipe = this.applyParameters(recipe, parameters);
	}

	recipe.forEach((step) => {
		collection = applyStep.call(this, collection, step);
	});

	return collection;
}

export default class Sushi  {

	constructor (options = {}) {
		this.options = options;
	}

	addOperationsBundle (processesBundle) {
		this.addOperations('filter', processesBundle.filters);
		this.addOperations('picker', processesBundle.pickers);
		this.addOperations('mapper', processesBundle.mappers);
		this.addOperations('reducer', processesBundle.reducers);
		this.addOperations('attach', processesBundle.attachers);
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
		return sushiCook.call(this, collection, recipe, parameters);
	}

	helper () {
		return Helper;
	}

};
