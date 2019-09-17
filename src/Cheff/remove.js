import Helper from '../common/Helper';

const remove = (collection, remove) => {
	let falsyEval = () => { return false; },
		evalKeyRegex = falsyEval,
		evalValueRegex = falsyEval,
		evalKeyMatch = falsyEval,
		evalValueMatch = falsyEval,
		keyRegex,
		valueRegex,
		keyMatch,
		keyMatchExists,
		valueMatch,
		valueMatchExists;

	if (remove.keyRegex) {
		keyRegex = new RegExp(remove.keyRegex, 'i');
		evalKeyRegex = (key) => {
			return key.match && key.match(keyRegex);
		};
	}
	if (remove.valueRegex) {
		valueRegex = new RegExp(remove.valueRegex, 'i');
		evalValueRegex = (value) => {
			return value.match && value.match(valueRegex);
		};
	}
	if ('undefined' !== typeof remove.keyMatch) {
		keyMatch = remove.keyMatch;
		keyMatchExists = true;
		evalKeyMatch = (key) => {
			return key === keyMatch;
		};
	}
	if ('undefined' !== typeof remove.valueMatch) {
		valueMatch = remove.valueMatch;
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

	return collection.map((item) => {

		if (remove.paths) {
			remove.paths.forEach((path) => {
				Helper.remove(item, path);
			});
		}

		if (
			keyRegex ||
			valueRegex ||
			keyMatchExists ||
			valueMatchExists
		) {
			let key;
			Helper.deepDelete(item, (obj, value, path = []) => {
				key = path.slice(-1)[0];
				return evalKeyRegex(key) ||
					evalValueRegex(value) ||
					evalKeyMatch(key) ||
					evalValueMatch(value);
			});
		}

		return item;
	});
};

export default remove;
