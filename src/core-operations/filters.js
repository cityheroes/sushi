import FormulaValues from 'formula-values';

import Tools from '../common/Tools';
import Helper from '../common/Helper';

let fvCache = {};

const applyMatch = (value, match, filterFunction) => {
	if (Tools.isArray(match)) {
		return match.reduce((memo, matchItem) => {
			return memo || filterFunction(value, matchItem);
		}, false);
	} else {
		return filterFunction(value, match);
	}
};

const extractSubject = (item = {}, filter = {}, defaultValue = null) => {
	defaultValue = defaultValue || filter.default || null;
	if (filter.path) {
		return Helper.get(item, filter.path, defaultValue);
	} else if (filter.expr) {
		let expr = filter.expr;

		if (!fvCache[expr]) {
			fvCache[expr] = new FormulaValues(expr);
		}

		let fv = fvCache[expr];
		return fv.eval(item);
	} else {
		return defaultValue;
	}
};

export default {

	match: (item, filter) => {
		return applyMatch(
			extractSubject(item, filter),
			filter.match,
			(value, match) => {
				return value === match;
			}
		);
	},

	mismatch: (item, filter) => {
		return applyMatch(
			extractSubject(item, filter),
			filter.match,
			(value, match) => {
				return value !== match;
			}
		);
	},

	matchType: (item, filter) => {
		return applyMatch(
			extractSubject(item, filter),
			filter.match,
			(value, match) => {
				return typeof value === match;
			}
		);
	},

	mismatchType: (item, filter) => {
		return applyMatch(
			extractSubject(item, filter),
			filter.match,
			(value, match) => {
				return typeof value !== match;
			}
		);
	},

	includes: (item, filter) => {
		return applyMatch(
			extractSubject(item, filter),
			filter.match,
			(value, match) => {
				return value.includes(match);
			}
		);
	},

	excludes: (item, filter) => {
		return applyMatch(
			extractSubject(item, filter),
			filter.match,
			(value, match) => {
				return !value.includes(match);
			}
		);
	},

	compare: (item, filter) => {
		return Helper.compare(
			extractSubject(item, filter),
			filter.match,
			filter.operator
		);
	},

	start: (item, filter) => {
		return applyMatch(
			extractSubject(item, filter, ''),
			filter.match,
			(value, match) => {
				return value.indexOf(match) === 0;
			}
		);
	},

	end: (item, filter) => {
		return applyMatch(
			extractSubject(item, filter, ''),
			filter.match,
			(value, match) => {
				return value.indexOf(match, value.length - match.length) !== -1;
			}
		);
	},

};