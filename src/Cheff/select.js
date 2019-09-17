import Helper from '../common/Helper';

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

export default select;
