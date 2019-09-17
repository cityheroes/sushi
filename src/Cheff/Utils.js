const initializeMatchers = (operationSpec) => {
	let falsyEval = () => { return false; },
		evalKeyRegex = falsyEval,
		evalValueRegex = falsyEval,
		evalKeyMatch = falsyEval,
		evalValueMatch = falsyEval,
		keyRegex,
		valueRegex,
		keyMatchExists,
		valueMatchExists;

	if (operationSpec.keyRegex) {
		keyRegex = new RegExp(operationSpec.keyRegex, 'i');
		evalKeyRegex = (key) => {
			return key.match && key.match(keyRegex);
		};
	}
	if (operationSpec.valueRegex) {
		valueRegex = new RegExp(operationSpec.valueRegex, 'i');
		evalValueRegex = (value) => {
			return value.match && value.match(valueRegex);
		};
	}
	if ('undefined' !== typeof operationSpec.keyMatch) {
		let keyMatch = operationSpec.keyMatch;
		keyMatchExists = true;
		evalKeyMatch = (key) => {
			return key === keyMatch;
		};
	}
	if ('undefined' !== typeof operationSpec.valueMatch) {
		let valueMatch = operationSpec.valueMatch;
		valueMatchExists = true;
		evalValueMatch = (value) => {
			if (value) {
				return value === valueMatch;
			} else {
				// Allow flexibility for falsy values
				if (Object.is(value, NaN)) {
					return null == valueMatch;
				} else {
					return value == valueMatch;
				}
			}
		};
	}

	return {
		evalKeyRegex,
		evalValueRegex,
		evalKeyMatch,
		evalValueMatch,
		keyRegex,
		valueRegex,
		keyMatchExists,
		valueMatchExists
	};
};

export default {
	initializeMatchers
};
