import Helper from '../Helper';

export default {

	total: (item, reducer, previousValue) => {
		return previousValue + 1;
	},

	count: (item, reducer, previousValue) => {
		var value = Helper.get(item, reducer.path);
		return value ? previousValue + 1 : previousValue;
	},

	countCompare: (item, reducer, previousValue) => {
		return Helper.compare(
			Helper.get(item, reducer.path),
			reducer.match,
			reducer.operator
		) ? previousValue + 1 : previousValue;
	},

	operation: (item, reducer, previousValue) => {
		return Helper.calculate(
			[Helper.get(item, reducer.path), previousValue],
			reducer.operator
		);
	},

	average: (item, reducer, previousValue) => {
		return Helper.average(
			[Helper.get(item, reducer.path), previousValue],
			reducer.operator
		);
	},

	sum: (item, reducer, previousValue) => {
		return Helper.calculate(
			[Helper.get(item, reducer.path), previousValue],
			'addition'
		);
	},

	sumAndOperation: (item, reducer, previousValue) => {
		var sum = Helper.calculate(
			[Helper.get(item, reducer.path), previousValue],
			'addition'
		);

		return Helper.calculate(
			[sum, reducer.operand],
			reducer.operator
		);
	},

};