import Helper from '../common/Helper';
import Utils from './Utils';

const processReplacement = (replacement, context, fvCache) => {
	return Helper.evalFV(replacement, context, fvCache);
};

const processMatchResult = (matchResult, matchDomain, baseContext) => {
	if (Array.isArray(matchResult)) {
		let context = {
			[matchDomain]: {}
		};
		for (var i = 0; i < matchResult.length; i++) {
			context[matchDomain][i] = matchResult[i];
		}
		return Object.assign(context, baseContext);
	} else {
		return baseContext;
	}
};

const processItem = (item, index, operationSpec) => {
	let matchers = Utils.initializeMatchers(operationSpec);

	if (matchers.keyMatchExists || matchers.valueMatchExists) {
		let replacement = operationSpec.replacement,
			key,
			keyMatchResult,
			valueMatchResult,
			baseContext = {
				$index: index,
				item: item
			},
			context,
			fvCache = {};

		Helper.deepNavigate(item, (obj, value, path = []) => {
			key = path.slice(-1)[0];
			keyMatchResult = matchers.evalKeyMatch(key);
			valueMatchResult = matchers.evalValueMatch(value);

			context = null;
			if (keyMatchResult) {
				context = processMatchResult(keyMatchResult, 'keyMatch', baseContext);
			}
			if (valueMatchResult) {
				context = processMatchResult(valueMatchResult, 'valueMatch', baseContext);
			}

			if (context) {
				obj[key] = processReplacement(replacement, context, fvCache);
			}
		});
	}

	return item;
};

const replace = (collection, replacers = []) => {
	return collection.map((item, index) => {
		replacers.forEach((replacer) => {
			item = processItem(item, index, replacer);
		});

		return item;
	});
};

export default replace;
