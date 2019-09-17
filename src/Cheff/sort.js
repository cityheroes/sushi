import Helper from '../common/Helper';

const sort = (collection, sorters, applyOperation) => {

	if (!sorters) {
		return collection;
	}

	if (!Array.isArray(sorters)) {
		sorters = [sorters];
	}

	return collection.sort((item) => {
		return sorters.reduce((previousResult, sorter) => {
			return previousResult && applyOperation('sorter', sorter.name, item, sorter);
		}, true);
	});
};

export default sort;
