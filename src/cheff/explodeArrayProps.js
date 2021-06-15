
const explodeArrayProps = (collection, config = {}) => {
	if (!collection.length) {
		return collection;
	}
	let results = [];
	for (let index = 0; index < collection.length; index++) {
		results = results.concat(explodeItemProps(collection[index], config));
	}
	return results;
};

const explodeItemProps = (item, config = {}) => {
	const results = [];
	let newItem;
	const propsReference = extractPropsReference(item);
	const resultsSize = extractSize(item, config);

	for (let index = 0; index < resultsSize; index++) {
		newItem = {
			...processRegularProps(item, propsReference),
			...processArrayProps(item, propsReference, index)
		};
		results.push(newItem);
	}

	return results;
};

const extractPropsReference = (item = {}) => {
	const propsReference = {
		array: [],
		regular: []
	};

	for (const key in item) {
		if (Array.isArray(item[key])) {
			propsReference.array.push(key);
		} else {
			propsReference.regular.push(key);
		}
	}

	return propsReference;
};

const extractSize = (item, config = {}) => {
	let size = 0;
	if (
		config.reference
		&& item[config.reference]
		&& Array.isArray(item[config.reference])
	) {
		size = item[config.reference].length;
	} else {
		for (const key in item) {
			if (Array.isArray(item[key]) && item[key].length) {
				size = item[key].length;
			}
		}
	}
	return size;
};

const processRegularProps = (item, propsReference) => {
	return propsReference.regular.reduce((memo, key) => {
		memo[key] = item[key];
		return memo;
	}, {})
};

const processArrayProps = (item, propsReference, index) => {
	return propsReference.array.reduce((memo, key) => {
		memo[key] = item[key][index];
		return memo;
	}, {})
};

export default explodeArrayProps;
