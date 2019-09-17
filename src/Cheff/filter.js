import Helper from '../common/Helper';

const filter = (collection, filters, applyOperation) => {

	if (!filters) {
		return collection;
	}

	if (!Array.isArray(filters)) {
		filters = [filters];
	}

	return collection.filter((item) => {
		return filters.reduce((previousResult, filter) => {
			return previousResult && applyOperation('filter', filter.name, item, filter);
		}, true);
	});
};

export default filter;