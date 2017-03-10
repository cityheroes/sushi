import tools from './Tools';

const overturnProcess = (collection, item, pivot, dest) => {
	var parent = tools.omit(item, pivot);
	let child = item[pivot];

	if (!child || !tools.isObject(child)) {
		return collection;
	}

	if (tools.isArray(child)) {
		return collection.concat(child.map((subitem) => {
			subitem[dest] = parent;
			return subitem;
		}));
	} else {
		child[dest] = parent;
		collection.push(child);
		return collection;
	}
};

const overturn = (collection, overturn) => {

	if (!overturn.pivot) {
		console.warn('Overturn operation needs a \'pivot\' parameter.');
		return collection;
	}

	var pivot = overturn.pivot,
			dest = overturn.dest || 'parent'
	;

	return collection.reduce((reducedItems, item) => {
		return overturnProcess(reducedItems, item, pivot, dest);
	}, []);
};

const filter = (collection, filters, applyProcess) => {

	if (!filters || filters.length === 0) {
		return collection;
	}

	return collection.filter((item) => {
		return filters.reduce((previousResult, filter) => {
			return previousResult && applyProcess('filter', filter.name, item, filter);
		}, true);
	});
};

const pick = (collection, pickers, applyProcess) => {

	if (!pickers || pickers.length === 0) {
		return collection;
	}

	return collection.map((item) => {
		return Object.keys(item).reduce((pickedItem, key) => {
			pickers.forEach((picker) => {
				if (applyProcess('picker', picker.name, key, picker)) {
					pickedItem[key] = item[key];
				}
			});
			return pickedItem;
		}, {});
	});
};

const map = (collection, mappers, applyProcess) => {

	if (!mappers || mappers.length === 0) {
		return collection;
	}

	return collection.map((item) => {
		return mappers.reduce((mappedItem, mapper) => {
			if (mapper.dest) {
				mappedItem[mapper.dest] = applyProcess('mapper', mapper.name, item, mapper);
				return mappedItem;
			} else {
				return Object.assign(
					mappedItem,
					applyProcess('mapper', mapper.name, item, mapper)
				);
			}
		}, {});
	});
};

const reduce = (collection, reducers, applyProcess) => {

	if (!reducers || reducers.length === 0) {
		return collection;
	}

	return reducers.reduce((mappedItem, reducer, applyProcess) => {

		mappedItem[reducer.dest] = collection.reduce((memo, item) => {
			return applyProcess('reducer', reducer.name, item, reducer, memo);
		}, (reducer.start || 0));

		return mappedItem;
	}, {});
};

// Cheff API
export default {
	overturn: overturn,
	filter: filter,
	pick: pick,
	map: map,
	reduce: reduce,
};