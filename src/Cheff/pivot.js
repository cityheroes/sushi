import Helper from '../common/Helper';

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

export default pivot;
