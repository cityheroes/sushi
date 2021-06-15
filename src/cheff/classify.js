import Helper from '../common/Helper';

const classify = (collection, classify) => {

 	if (!classify || !classify.path) {
		console.warn('A \'path\' parameter must be provided for the classify operation.');
		return collection;
	}

	let classifier = classify.path,
		classifierValue,
		dest = classify.dest || 'dest',
		id = classify.id || classifier,
		defaultValue = classify.default,
		tempMap = {},
		size = collection.length,
		item;

	for (var i = 0; i < size; i++) {
		item = collection[i];
		classifierValue = Helper.get(item, classifier);
		classifierValue = 'undefined' !== typeof classifierValue ? classifierValue : defaultValue;
		tempMap[classifierValue] = tempMap[classifierValue] || {};
		tempMap[classifierValue][dest] = tempMap[classifierValue][dest] || [];
		tempMap[classifierValue][dest].push(item);
	}

	return Object.keys(tempMap).map((key) => {
		return {
			[id]: key,
			...tempMap[key]
		};
	});
};

export default classify;
