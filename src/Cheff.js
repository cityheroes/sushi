import Tools from './Tools';
import Helper from './Helper';

// Uni operations
const overturnOperation = (collection, item, pivot, parentDest, childDest, includeEmpty = false) => {
	var parent = Tools.omit(item, pivot);
	let child = item[pivot];

	if (Tools.isArray(child)) {
		if (includeEmpty && child.length === 0) {
			child.push({});
		}
		return collection.concat(child.map((subitem) => {
			if (Tools.isObject(subitem)) {
				subitem[parentDest] = parent;
			} else if (childDest) {
				let swapSubitem = {};
				swapSubitem[parentDest] = parent;
				swapSubitem[childDest] = subitem;
				subitem = swapSubitem;
			}
			return subitem;
		}));
	} else if (Tools.isObject(child) || (includeEmpty && (child = {}))) {
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
		child = overturn.child || null,
		includeEmpty = !!overturn.includeEmpty;

	return collection.reduce((reducedItems, item) => {
		return overturnOperation(reducedItems, item, pivot, dest, child, includeEmpty);
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
		tmpColumnHeaders = [],
		columnHeader,
		rowSourcePath = pivotCont.rowSourcePath,
		rowTargetPath = pivotCont.rowTargetPath || rowSourcePath,
		columnPath = pivotCont.columnPath,
		includeRowTotal = !!pivotCont.includeRowTotal,
		includeColumnTotal = !!pivotCont.includeColumnTotal,
		totalRowName = pivotCont.totalRowName || 'Total',
		totalColumnName = pivotCont.totalColumnName || 'Total',
		aggregationOp = aggregationOps[pivotCont.aggregationOp || 'count'];

	let item,
		processedItem,
		processedItemId,
		previousValue;
	for (var i = 0, len = collection.length; i < len; i++) {
		item = collection[i];

		processedItemId = Helper.get(item, rowSourcePath, undefined);

		if (!processedItemId) {
			continue;
		} else if (!tmpHash[processedItemId]) {
			processedItem = {};

			for (var j = tmpColumnHeaders.length - 1; j >= 0; j--) {
				processedItem[tmpColumnHeaders[j]] = 0;
			}

			tmpHash[processedItemId] = processedItem;
			result.push(processedItem);
			Helper.set(processedItem, rowTargetPath, processedItemId);
		} else {
			processedItem = tmpHash[processedItemId];
		}

		columnHeader = Helper.get(item, columnPath, undefined);
		if (columnHeader) {

			if (tmpColumnHeaders.indexOf(columnHeader) === -1) {
				tmpColumnHeaders.push(columnHeader);
				for (var k = result.length - 1; k >= 0; k--) {
					result[k][columnHeader] = 0;
				}
			}

			previousValue = processedItem[columnHeader] || 0;
			processedItem[columnHeader] = aggregationOp(previousValue, item);
		}

	}

	if (includeRowTotal || includeColumnTotal) {

		let resultItem,
			columnTotalItem = {};

		if (includeColumnTotal) {
			for (var i = tmpColumnHeaders.length - 1; i >= 0; i--) {
				columnTotalItem[tmpColumnHeaders[i]] = 0;
			}
			Helper.set(columnTotalItem, rowTargetPath, totalColumnName);
		}

		for (var i = 0, length = result.length; i < length; i++) {

			resultItem = result[i];

			if (includeColumnTotal) {
				for (var j = tmpColumnHeaders.length - 1; j >= 0; j--) {
					columnHeader = tmpColumnHeaders[j];
					columnTotalItem[columnHeader] += resultItem[columnHeader];
				}
			}

			if (includeRowTotal) {
				resultItem[totalRowName] = tmpColumnHeaders.reduce((partial, columnHeader) => {
					return partial + resultItem[columnHeader];
				}, 0);
			}
		}

		if (includeColumnTotal) {
			if (includeRowTotal) {
				columnTotalItem[totalRowName] = tmpColumnHeaders.reduce((partial, columnHeader) => {
					return partial + columnTotalItem[columnHeader];
				}, 0);
			}
			result.push(columnTotalItem);
		}
	}

	return result;
};

const implode = (collection, implode) => {
	let resultItem;
	return collection.reduce((resultCollection, item) => {
		return resultCollection.concat(Object.keys(item).reduce((implodedItem, key) => {

			resultItem = {};

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

// Multi operations
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

const select = (collection, selectors, applyOperation) => {

	if (!selectors) {
		return collection;
	}

	if (!Array.isArray(selectors)) {
		selectors = [selectors];
	}

	return collection.map((item) => {
		return selectors.reduce((resultItem, selector) => {
			resultItem[selector.dest] = applyOperation('selector', selector.name, item, selector);
			return resultItem;
		}, {});
	});
};

const reduce = (collection, reducers, applyOperation) => {

	if (!reducers) {
		return collection;
	}

	if (!Array.isArray(reducers)) {
		reducers = [reducers];
	}

	return reducers.reduce((resultItem, reducer) => {

		let start = (reducer.start || 0);

		 if (reducer.group && reducer.path) {

		 	let auxResult = resultItem,
		 		groupKey,
		 		groupLengths = collection.reduce((memo, item) => {
					groupKey = Helper.get(item, reducer.group);
					memo[groupKey] = memo[groupKey] || 0;
					memo[groupKey]++;
		 			return memo;
		 		}, {});

		 	if (reducer.dest) {
				resultItem[reducer.dest] = {};
				auxResult = resultItem[reducer.dest];
		 	}

		 	let groupIndexes = {};
			collection.forEach((item) => {
				groupKey = Helper.get(item, reducer.group);

				groupIndexes[groupKey] = groupIndexes[groupKey] || 0;

				auxResult[groupKey] = applyOperation(
					'reducer',
					reducer.name,
					reducer,
					auxResult[groupKey] || start,
					Helper.get(item, reducer.path),
					groupIndexes[groupKey],
					groupLengths[groupKey]
				);

				groupIndexes[groupKey]++;
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

const attach = (collection, attachers, applyOperation) => {

	if (!attachers) {
		return collection;
	}

	if (!Array.isArray(attachers)) {
		attachers = [attachers];
	}

	return collection.map((item, index) => {
		attachers.forEach((attacher) => {
			item[attacher.dest] = applyOperation(
				'attacher',
				attacher.name,
				item,
				attacher,
				index
			);
		});

		return item;
	});
};

const remove = (collection, remove) => {
	let falsyEval = () => { return false; },
		evalKeyRegex = falsyEval,
		evalValueRegex = falsyEval,
		evalKeyMatch = falsyEval,
		evalValueMatch = falsyEval,
		keyRegex,
		valueRegex,
		keyMatch,
		valueMatch;

	if (remove.keyRegex) {
		keyRegex = new RegExp(remove.keyRegex, 'i');
		evalKeyRegex = (key) => {
			return key.match && key.match(keyRegex);
		};
	}
	if (remove.valueRegex) {
		valueRegex = new RegExp(remove.valueRegex, 'i');
		evalValueRegex = (value) => {
			return value.match && value.match(valueRegex);
		};
	}
	if (remove.keyMatch) {
		keyMatch = remove.keyMatch;
		evalKeyMatch = (key) => {
			return key === keyMatch;
		};
	}
	if (remove.valueMatch) {
		valueMatch = remove.valueMatch;
		evalValueMatch = (value) => {
			return value === valueMatch;
		};
	}

	return collection.map((item) => {

		if (remove.paths) {
			remove.paths.forEach((path) => {
				Helper.remove(item, path);
			});
		}

		if (keyRegex || valueRegex) {
			let key;
			Helper.deepNavigate(item, (obj, value, path = []) => {
				key = path.slice(-1)[0];
				if (
					evalKeyRegex(key) ||
					evalValueRegex(value) ||
					evalKeyMatch(key) ||
					evalValueMatch(value)
				) {
					delete obj[key];
				}
			});
		}

		return item;
	});
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
	pivot: pivot,
	classify: classify,
	split: split,
	attach: attach,
	remove: remove
};
