import Helper from '../common/Helper';

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

export default implode;
