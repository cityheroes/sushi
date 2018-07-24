import tools from '../Tools';
import Helper from '../Helper';

const matchBehavior = (reducer, previousValue, value, reduceOperation) => {
	if (reducer.match) {
		if (reducer.match === value) {
			return reduceOperation();
		} else {
			return previousValue;
		}
	} else {
		return reduceOperation();
	}
};

export default {

	count: (reducer, previousValue, value) => {
		return matchBehavior(
			reducer,
			previousValue,
			value,
			() => {
				return value ? previousValue + 1 : previousValue;
			}
		);
	},

	operation: (reducer, previousValue, value) => {
		return matchBehavior(
			reducer,
			previousValue,
			value,
			() => {
				return Helper.calculate(
					[value, previousValue],
					reducer.operator
				);
			}
		);
	},

	average: (reducer, previousValue, value, index, size) => {
		return matchBehavior(
			reducer,
			previousValue,
			value,
			() => {
				let result = Helper.calculate(
					[value, previousValue],
					'addition'
				);

				if (index < size - 1) {
					return result;
				} else {
					return result / size;
				}
			}
		);
	},

	sum: (reducer, previousValue, value) => {
		return matchBehavior(
			reducer,
			previousValue,
			value,
			() => {
				return Helper.calculate(
					[value, previousValue],
					'addition'
				);
			}
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
	}

};