
const isArray = (value) => {
	return Array.isArray(value);
};

const isObject = (obj) => {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

const omit = (obj, keys) => {

	if (!isObject(obj)) {
		return obj;
	}

	keys = !isArray(keys) ? [keys] : keys;

	let result = {};

	for (var property in obj) {
		if (obj.hasOwnProperty(property) && keys.indexOf(property) === -1) {
			result[property] = obj[property];
		}
	}

	return result;
};

export default {
	isArray: isArray,
	isObject: isObject,
	omit: omit,
};