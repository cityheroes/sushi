const initializeMatchers = (operationSpec) => {
	let falsyEval = () => { return false; },
		evalKeyMatch = falsyEval,
		evalValueMatch = falsyEval,
		keyMatchExists,
		valueMatchExists;

	if ('undefined' !== typeof operationSpec.keyMatch) {
		let keyMatch = operationSpec.keyMatch;
		keyMatchExists = true;
		evalKeyMatch = (key) => {
			if (key.match) {
				return key.match(keyMatch);
			} else {
				return key === keyMatch;
			}
		};
	}
	if ('undefined' !== typeof operationSpec.valueMatch) {
		let valueMatch = operationSpec.valueMatch;
		valueMatchExists = true;
		evalValueMatch = (value) => {
			if (value) {
				if (value.match) {
					return value.match(valueMatch);
				} else {
					return value === valueMatch;
				}
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
		evalKeyMatch,
		evalValueMatch,
		keyMatchExists,
		valueMatchExists
	};
};

export default {
	initializeMatchers
};
