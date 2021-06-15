import Helper from '../common/Helper';

const processParts = (parts, item, collection = []) => {
	var newItem,
		size = parts.length,
		pathsMap,
		path;

	for (var i = 0; i < size; i++) {
		pathsMap = parts[i];
		newItem = {};
		for (path in pathsMap) {
			newItem[pathsMap[path]] = Helper.get(item, path);
		}
		collection.push(newItem);
	}

	return collection;
}

const split = (collection, options) => {

 	if (!options || !options.parts) {
		console.warn('A \'parts\' parameter must be provided for the split operation.');
		return collection;
	}

	let newCollection = [],
		parts = options.parts,
		size = collection.length;

	for (var i = 0; i < size; i++) {
		newCollection = processParts(parts, collection[i], newCollection);
	}

	return newCollection;
};

export default split;
