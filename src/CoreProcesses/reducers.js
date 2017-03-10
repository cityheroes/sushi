export default {

	total: (item, reducer, previousValue, helper) => {
		return previousValue + 1;
	},

	count: (item, reducer, previousValue, helper) => {
		var value = helper.extract(item, reducer.src);
		return value ? previousValue + 1 : previousValue;
	},

	countCompare: (item, reducer, previousValue, helper) => {
		return helper.compare(
			helper.extract(item, reducer.src),
			reducer.match,
			reducer.operator
		) ? previousValue + 1 : previousValue;
	},

	operation: (item, reducer, previousValue, helper) => {
		return helper.calculate(
			[helper.extract(item, reducer.src), previousValue],
			reducer.operator
		);
	},

	sum: (item, reducer, previousValue, helper) => {
		return helper.calculate(
			[helper.extract(item, reducer.src), previousValue],
			'addition'
		);
	},

	sumAndOperation: (item, reducer, previousValue, helper) => {
		var sum = helper.calculate(
			[helper.extract(item, reducer.src), previousValue],
			'addition'
		);

		return helper.calculate(
			[sum, reducer.operand],
			reducer.operator
		);
	},

};