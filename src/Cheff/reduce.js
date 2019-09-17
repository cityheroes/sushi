import Helper from '../common/Helper';

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

export default reduce;
