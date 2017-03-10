import tools from './Tools';

const parsePath = (pathParam) => {
	return !tools.isArray(pathParam) ? [pathParam] : pathParam;
};

const extract = (obj, path, defaultValue) => {

	if (tools.isArray(path)) {
		defaultValue = path[1];
		path = path[0];
	}

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

const extractMap = (item, paths, defaultValue) => {
	return parsePath(paths).map((path) => {
		return extract(item, path, defaultValue);
	});
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
		return operators[operator].method(
			parseFloat(value) || operators[operator].neutral,
			memo
		);
	}, operators[operator].neutral);
};

export default {
	parsePath: parsePath,
	extract: extract,
	extractMap: extractMap,
	compare: compare,
	calculate: calculate
};