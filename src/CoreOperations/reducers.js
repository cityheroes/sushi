import tools from '../Tools';
import Helper from '../Helper';

export default {

	total: (reducer, previousValue, value) => {
		return previousValue + 1;
	},

	count: (reducer, previousValue, value) => {
		return value ? previousValue + 1 : previousValue;
	},

	countCompare: (reducer, previousValue, value) => {
		return Helper.compare(
			Helper.get(reducer.path),
			reducer.match,
			reducer.operator
		) ? previousValue + 1 : previousValue;
	},

	operation: (reducer, previousValue, value) => {
		return Helper.calculate(
			[value, previousValue],
			reducer.operator
		);
	},

	average: (reducer, previousValue, value) => {
		return Helper.average(
			[value, previousValue],
			reducer.operator
		);
	},

	sum: (reducer, previousValue, value) => {
		return Helper.calculate(
			[value, previousValue],
			'addition'
		);
	},

	sumAndOperation: (reducer, previousValue, value) => {
		var sum = Helper.calculate(
			[value, previousValue],
			'addition'
		);

		return Helper.calculate(
			[sum, reducer.operand],
			reducer.operator
		);
	},

	array: (reducer, previousValue, value) => {
		previousValue = tools.isArray(previousValue) ? previousValue : [];
		previousValue.push(value);
		return previousValue;
	},

};