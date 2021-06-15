import Helper from '../common/Helper';
import Utils from './Utils';

const remove = (collection, remove) => {
	let {
		evalKeyMatch,
		evalValueMatch,
		keyMatchExists,
		valueMatchExists
	} = Utils.initializeMatchers(remove);
	let paths = remove.paths;

	return collection.map((item) => {

		if (paths) {
			paths.forEach((path) => {
				Helper.remove(item, path);
			});
		}

		if (
			keyMatchExists ||
			valueMatchExists
		) {
			let key;
			Helper.deepDelete(item, (obj, value, path = []) => {
				key = path.slice(-1)[0];
				return evalKeyMatch(key) || evalValueMatch(value);
			});
		}

		return item;
	});
};

export default remove;
