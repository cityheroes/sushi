import Helper from '../common/Helper';

const map = (collection, mappers, applyOperation) => {

	if (!mappers) {
		return collection;
	}

	if (!Array.isArray(mappers)) {
		mappers = [mappers];
	}

	return collection.map((item) => {
		mappers.forEach((mapper) => {

			Helper.iterateKeys(item, mapper.keys, (key) => {
				item[key] = applyOperation('mapper', mapper.name, item[key], mapper);
			});

		}, {});

		return item;
	});
};

export default map;
