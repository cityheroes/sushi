const SushiCoreProcesses = {};

SushiCoreProcesses.filters = {

	match: (item, filter, helper) => {
		return helper.extract(item, filter.path) === filter.match;
	},

	mismatch: (item, filter, helper) => {
		return helper.extract(item, filter.path) !== filter.match;
	},

	compare: (item, filter, helper) => {
		return helper.compare(
			helper.extract(item, filter.path),
			filter.match,
			filter.operator
		);
	},

	start: (item, filter, helper) => {
		return helper.extract(item, filter.path, '').indexOf(filter.match) !== -1;
	},

	end: (item, filter, helper) => {
		var subject = helper.extract(item, filter.path, '');
		return subject.indexOf(filter.match, subject.length - filter.match.length) !== -1;
	},

};

SushiCoreProcesses.mappers = {

	extract: (item, mapper, helper) => {
		return helper.parsePath(mapper.path).map((path) => {
			return helper.extract(item, path, mapper.default);
		}).join(mapper.separator || ' ');
	},

	convert: (item, mapper, helper) => {
		var comparison = helper.compare(
			helper.extract(item, mapper.path),
			mapper.match,
			mapper.operator
		);
		return comparison ? mapper.truth : mapper.false;
	},

	operation: (item, mapper, helper) => {
		return helper.calculate(
			[helper.extract(item, mapper.path), mapper.operand],
			mapper.operator
		);
	},

	sum: (item, mapper, helper) => {
		return helper.calculate(
			[helper.extract(item, mapper.path), mapper.operand],
			'addition'
		);
	},

	operationMap: (item, mapper, helper) => {
		return helper.calculate(
			helper.extractMap(item, mapper.path),
			mapper.operator
		);
	},

};

SushiCoreProcesses.reducers = {

	total: (item, reducer, previousValue, helper) => {
		return previousValue + 1;
	},

	count: (item, reducer, previousValue, helper) => {
		var value = helper.extract(item, reducer.path);
		return value ? previousValue + 1 : previousValue;
	},

	countCompare: (item, reducer, previousValue, helper) => {
		return helper.compare(
			helper.extract(item, reducer.path),
			reducer.match,
			reducer.operator
		) ? previousValue + 1 : previousValue;
	},

	operation: (item, reducer, previousValue, helper) => {
		return helper.calculate(
			[helper.extract(item, reducer.path), previousValue],
			reducer.operator
		);
	},

	sum: (item, reducer, previousValue, helper) => {
		return helper.calculate(
			[helper.extract(item, reducer.path), previousValue],
			'addition'
		);
	},

	sumAndOperation: (item, reducer, previousValue, helper) => {
		var sum = helper.calculate(
			[helper.extract(item, reducer.path), previousValue],
			'addition'
		);

		return helper.calculate(
			[sum, reducer.operand],
			reducer.operator
		);
	},

};

export default SushiCoreProcesses;