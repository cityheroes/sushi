import Helper from '../common/Helper';

const uniq = (collection, uniq) => {

	let resultCollection = [],
			seen = {};

	if (!uniq || !uniq.path) {
		console.warn('A \'path\' parameter must be provided for the uniq operation.');
		return collection;
	}


	for (var i = collection.length - 1; i >= 0; i--) {
		if (seen[Helper.get(collection[i], uniq.path)] !== 1) {
			seen[Helper.get(collection[i], uniq.path)] = 1;
			resultCollection.push(collection[i]);
		}
	}

	return resultCollection;
};

export default uniq;
