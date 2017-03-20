import tools from './Tools';
import Helper from './Helper';

// Uni operations
const overturnOperation = (collection, item, pivot, dest) => {
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
		return overturnOperation(reducedItems, item, pivot, dest);
	}, []);
};

const pick = (collection, pick) => {

	return collection.map((item) => {

		let resultItem = {};

		if (pick.keys) {
			Helper.iterateKeys(item, pick.keys, (key) => {
				if (pick.values && Helper.evalValues(pick.values, item[key])) {
					resultItem[key] = item[key];
				} else if (!pick.values) {
					resultItem[key] = item[key];
				}
			});
		}

		if (pick.paths) {
			Helper.iterateMap(item, pick.paths, null, (path, value) => {
				resultItem = Helper.set(resultItem, path, value);
			});
		}

		return resultItem;
	});
};

// Multi operations
const filter = (collection, filters, applyOperation) => {

	if (!filters || filters.length === 0) {
		return collection;
	}

	return collection.filter((item) => {
		return filters.reduce((previousResult, filter) => {
			return previousResult && applyOperation('filter', filter.name, item, filter);
		}, true);
	});
};

const map = (collection, mappers, applyOperation) => {

	if (!mappers || mappers.length === 0) {
		return collection;
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

const explode = (collection, explode) => {
	return collection.reduce((resultCollection, item) => {
		return resultCollection.concat(Object.keys(item).reduce((explodedItem, key) => {

			let resultItem = {};

			if (explode.id) {
				if (explode.id.includes(key)) {
					return explodedItem;
				}

				resultItem.id = Helper.get(item, explode.id);
			}

			resultItem[(explode.key ? explode.key : 'key')] = key;
			resultItem[(explode.value ? explode.value : 'value')] = item[key];

			explodedItem.push(resultItem);

			return explodedItem;
		}, []));
	}, []);
};

const select = (collection, selectors, applyOperation) => {

	if (!selectors || selectors.length === 0) {
		return collection;
	}

	return collection.map((item) => {
		return selectors.reduce((resultItem, selector) => {
			resultItem[selector.dest] = applyOperation('selector', selector.name, item, selector);
			return resultItem;
		}, {});
	});
};

const reduce = (collection, reducers, applyOperation) => {

	if (!reducers || reducers.length === 0) {
		return collection;
	}

	return reducers.reduce((resultItem, reducer) => {

		let start = (reducer.start || 0);

		if (reducer.dest && reducer.path) {
			resultItem[reducer.dest] = collection.reduce((memo, item) => {

				return applyOperation(
					'reducer',
					reducer.name,
					reducer,
					memo,
					Helper.get(item, reducer.path)
				);

			}, start);
		} else if (reducer.keys) {

			collection.forEach((item) => {
				Helper.iterateKeys(item, reducer.keys, (key) => {

					resultItem[key] = applyOperation(
						'reducer',
						reducer.name,
						reducer,
						resultItem[key] || start,
						item[key]
					);

				});
			});
		}

		return resultItem;
	}, {});
};

// Cheff API
export default {
	overturn: overturn,
	filter: filter,
	pick: pick,
	map: map,
	explode: explode,
	select: select,
	reduce: reduce,
};