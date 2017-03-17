import tools from './Tools';

const parsePath = (pathParam) => {
	return !tools.isArray(pathParam) ? [pathParam] : pathParam;
};

const get = (obj, path, defaultValue) => {

	var arr = path.split('.');

	while (arr.length && obj) {
		var comp = arr.shift();
		var match = new RegExp('(.+)\\[([0-9]*)\\]').exec(comp);
		if ((match !== null) && (match.length === 3)) {
			var arrayData = { arrName: match[1], arrIndex: match[2] };
			if (obj[arrayData.arrName] !== undefined) {
				obj = obj[arrayData.arrName][arrayData.arrIndex];
			} else {
				obj = undefined;
			}
		} else {
			obj = obj[comp];
		}
	}

	return obj || defaultValue;
};

/**
 * @todo Enable same path options as get().
 */
const set = (obj, path, value) => {

	path = path.split('.');

	var nested = obj,
			key,
			index = -1,
			length = path.length,
			lastIndex = length - 1
	;

	while (nested !== null && ++index < length) {

		key = path[index];

		if (index === lastIndex) {
			nested[key] = value;
		} else {
			nested[key] = typeof nested[key] !== 'undefined' ? nested[key] : {};
		}

		nested = nested[key];
	}

	return obj;
};

const extractMap = (item, paths, defaultValue) => {
	return parsePath(paths).map((path) => {
		return get(item, path, defaultValue);
	});
};

const iterateMap = (item, paths, defaultValue, callback) => {
	parsePath(paths).forEach((path) => {
		callback(path, get(item, path, defaultValue));
	});
};

const evalKeys = (keys, value) => {
	keys = tools.isArray(keys) ? keys : [keys];

	return keys.reduce((previousValidation, key) => {
		let wildcardPosition = key.indexOf('*');
		let result;

		if (wildcardPosition === 0) {
			key = key.substr(1);
			result = value.endsWith(key);
		} else if (wildcardPosition === (key.length - 1)) {
			key = key.slice(0, -1);
			result = value.startsWith(key);
		} else if (key.charAt(0) === '!') {
			result = !value.includes(key);
		} else {
			result = value.includes(key);
		}

		return previousValidation || result;
	}, false);

};

const extractKeys = (item, operationKeys, callback) => {
	let result = [];
	Object.keys(item).forEach((key) => {
		if (evalKeys(operationKeys, key)) {
			result.push(item[key]);
		}
	});
	return result;
};

const getKeys = (item, operationKeys, callback) => {
	return Object.keys(item).filter((key) => {
		return evalKeys(operationKeys, key);
	});
};

const iterateKeys = (item, operationKeys, callback) => {
	Object.keys(item).forEach((key) => {
		if (evalKeys(operationKeys, key)) {
			callback(key);
		}
	});
};

const evalValue = (value, subject) => {

	if (tools.isArray(subject) || tools.isObject(subject)) {
		return false;
	}

	if (value.charAt(0) === '!') {
		return !subject.includes(value.substr(1));
	} else {
		return subject.includes(value);
	}
};

const evalValues = (values, subject) => {
	return values.reduce((previousValidation, value) => {
		return previousValidation || evalValue(value, subject);
	}, false);
};

const compare = (lvalue, rvalue, operator) => {

	operator = operator || 'eq';

	let operators = {
		'eq':      (l, r) => { return l === r; },
		'ne':      (l, r) => { return l !== r; },
		'lt':        (l, r) => { return l < r; },
		'gt':        (l, r) => { return l > r; },
		'le':       (l, r) => { return l <= r; },
		'ge':       (l, r) => { return l >= r; },
	};

	return operators[operator](lvalue, rvalue);
};

const calculate = (operands, operator) => {

	operator = operator || 'sum';

	const operators = {
		'addition': {
			method: (lvalue, rvalue) => {
				return lvalue + rvalue;
			},
			neutral: 0
		},
		'subtraction': {
			method: (lvalue, rvalue) => {
				return lvalue - rvalue;
			},
			neutral: 0
		},
		'division': {
			method: (lvalue, rvalue) => {
				return lvalue / rvalue;
			},
			neutral: 1
		},
		'multiplication': {
			method: (lvalue, rvalue) => {
				return lvalue * rvalue;
			},
			neutral: 1
		},
	};

	return operands.reduce((memo, value) => {
		value = value === null || value === undefined ? 0 : value;
		return operators[operator].method(
			parseFloat(value) || operators[operator].neutral,
			memo
		);
	}, operators[operator].neutral);
};

const average = (values) => {
	return calculate(
		values,
		'addition'
	) / values.length;
};

export default {
	get: get,
	set: set,
	extractMap: extractMap,
	iterateMap: iterateMap,
	extractKeys: extractKeys,
	getKeys: getKeys,
	iterateKeys: iterateKeys,
	evalValues: evalValues,
	compare: compare,
	calculate: calculate,
	average: average
};