import Tools from '../common/Tools';

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

export default overturn;
