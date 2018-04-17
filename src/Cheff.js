import tools from './Tools';
import Helper from './Helper';

// Uni operations
const overturnOperation = (collection, item, pivot, parentDest, childDest) => {
	var parent = tools.omit(item, pivot);
	let child = item[pivot];

	if (tools.isArray(child)) {
		return collection.concat(child.map((subitem) => {
			if (tools.isObject(subitem)) {
				subitem[parentDest] = parent;
			} else if (childDest) {
				let swapSubitem = {};
				swapSubitem[parentDest] = parent;
				swapSubitem[childDest] = subitem;
				subitem = swapSubitem;
			}
			return subitem;
		}));
	} else if (tools.isObject(child)) {
		child[parentDest] = parent;
		collection.push(child);
		return collection;
	}
	return collection;
};

const overturn = (collection, overturn) => {

	if (!overturn.pivot) {
		console.warn('Overturn operation needs a \'pivot\' parameter.');
		return collection;
	}

	var pivot = overturn.pivot,
			dest = overturn.dest || 'parent',
			child = overturn.child || null
	;

	return collection.reduce((reducedItems, item) => {
		return overturnOperation(reducedItems, item, pivot, dest, child);
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

const uniq = (collection, uniq) => {

	let resultCollection = [],
			seen = {}
	;

	if (!uniq || !uniq.path) {
		console.warn('A \'path\' parameter must be provided for uniq operation.');
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

const sort = (collection, sorters, applyOperation) => {

	if (!sorters || sorters.length === 0) {
		return collection;
	}

	return collection.sort((item) => {
		return sorters.reduce((previousResult, sorter) => {
			return previousResult && applyOperation('sorter', sorter.name, item, sorter);
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

const pivot = (collection, pivotCont) => {

	const aggregationOps = {
		sum: (previousValue, item) => {
			return previousValue + Helper.get(item, pivotCont.aggregationPath, 0);
		},
		count: (previousValue, item) => {
			return previousValue + 1;
		}
	};

	let result = [],
		tmpHash = {},
		rowSourcePath = pivotCont.rowSourcePath,
		rowTargetPath = pivotCont.rowTargetPath || rowSourcePath,
		columnPath = pivotCont.columnPath,
		aggregationOp = aggregationOps[pivotCont.aggregationOp];

	let item,
		processedItem,
		processedItemId,
		columnValue,
		previousValue;
	for (var i = 0, len = arr.length; i < len; i++) {
		item = arr[i];

		processedItemId = Helper.get(item, rowSourcePath, undefined);
		if (!processedItemId) {
			continue;
		} else if (!tmpHash[processedItemId]) {
			processedItem = {};
			tmpHash[processedItemId] = processedItem;
			result.push(processedItem);
			Helper.set(processedItem, rowTargetPath, processedItemId);
		} else {
			processedItem = tmpHash[processedItemId];
		}

		columnValue = Helper.get(item, columnPath, undefined);
		if (columnValue) {
			previousValue = Helper.get(processedItem, columnValue, 0);
			Helper.set(processedItem, columnValue, aggregationOp(previousValue, item));
		}

	}

	return result;
};

const implode = (collection, implode) => {
	return collection.reduce((resultCollection, item) => {
		return resultCollection.concat(Object.keys(item).reduce((implodedItem, key) => {

			let resultItem = {};

			if (implode.id) {
				if (implode.id.includes(key)) {
					return implodedItem;
				}

				resultItem.id = Helper.get(item, implode.id);
			}

			resultItem[(implode.key ? implode.key : 'key')] = key;
			resultItem[(implode.value ? implode.value : 'value')] = item[key];

			implodedItem.push(resultItem);

			return implodedItem;
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

		 if (reducer.group && reducer.path) {

		 	let auxResult = resultItem;

		 	if (reducer.dest) {
				resultItem[reducer.dest] = {};
				auxResult = resultItem[reducer.dest];
		 	}

			collection.forEach((item, index) => {
				let groupKey = Helper.get(item, reducer.group);

				auxResult[groupKey] = applyOperation(
					'reducer',
					reducer.name,
					reducer,
					auxResult[groupKey] || start,
					Helper.get(item, reducer.path),
					index,
					collection.length
				);

			});
		} else if (reducer.path && reducer.dest) {
			resultItem[reducer.dest] = collection.reduce((memo, item, index) => {

				return applyOperation(
					'reducer',
					reducer.name,
					reducer,
					memo,
					Helper.get(item, reducer.path),
					index,
					collection.length
				);

			}, start);
		} else if (reducer.keys) {

			collection.forEach((item, index) => {
				Helper.iterateKeys(item, reducer.keys, (key) => {

					resultItem[key] = applyOperation(
						'reducer',
						reducer.name,
						reducer,
						resultItem[key] || start,
						item[key],
						index,
						collection.length
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
	sort: sort,
	map: map,
	explode: explode,
	select: select,
	uniq: uniq,
	reduce: reduce,
};
