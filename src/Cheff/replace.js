import Helper from '../common/Helper';
import Utils from './Utils';

const processReplacement = (replacement, context, fvCache) => {
	return Helper.evalFV(replacement, context, fvCache);
};

const processItem = (item, index, operationSpec) => {
	let matchers = Utils.initializeMatchers(operationSpec);

	if (
		matchers.keyRegex ||
		matchers.valueRegex ||
		matchers.keyMatchExists ||
		matchers.valueMatchExists
	) {
		let replacement = operationSpec.replacement,
			key,
			context = {
				$index: index,
				item: item
			},
			fvCache = {};

		Helper.deepNavigate(item, (obj, value, path = []) => {
			key = path.slice(-1)[0];
			if (
				matchers.evalKeyRegex(key) ||
				matchers.evalValueRegex(value) ||
				matchers.evalKeyMatch(key) ||
				matchers.evalValueMatch(value)
			) {
				obj[key] = processReplacement(replacement, context, fvCache);
			}
		});
	}

	return item;
};

const replace = (collection, operationSpec) => {
	let replacers = operationSpec.cont || [];

	return collection.map((item, index) => {
		replacers.forEach((replacer) => {
			item = processItem(item, index, replacer);
		});

		return item;
	});
};

export default replace;
