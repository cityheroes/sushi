import Helper from '../common/Helper';

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

export default explode;
