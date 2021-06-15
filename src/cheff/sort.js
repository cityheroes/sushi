import Helper from '../common/Helper';

const sort = (collection, sorters) => {

	if (!sorters) {
		return collection;
	}

	if (!Array.isArray(sorters)) {
		sorters = [sorters];
	}

	sorters = sorters.map(sorter => ({
		path: sorter.path,
		order: sorter.order === 'desc' ? -1 : 1
	}));

	const sortFn = (item1, item2) => {
		const sortersLength = sorters.length;
		let value1;
		let value2;
		let difference = 0;
		for (let i = 0; i < sortersLength; i++) {

			// Retrieve values
			value1 = Helper.get(item1, sorters[i].path, '');
			value2 = Helper.get(item2, sorters[i].path, '');

			// Calculate difference
			if ('number' === typeof value1 && 'number' === typeof value2) {
				difference = value1 - value2;
			} else {
				difference = String(value1).localeCompare(String(value2));
			}

			if (difference === 0) {
				// If values are equal, keep checking with next sorters
				continue;
			} else {
				// If values different, include sorter's order and return
				difference = difference * sorters[i].order;
				return difference;
			}
		}
		return difference;
	};

	return collection.sort(sortFn);
};

export default sort;
