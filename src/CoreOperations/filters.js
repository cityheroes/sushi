import Tools from '../Tools';
import Helper from '../Helper';

const applyMatch = (value, match, filterFunction) => {
	if (Tools.isArray(match)) {
		return match.reduce((memo, matchItem) => {
			return memo || filterFunction(value, matchItem);
		}, false);
	} else {
		return filterFunction(value, match);
	}
};

export default {

	match: (item, filter) => {
		return applyMatch(
			Helper.get(item, filter.path),
			filter.match,
			(value, match) => {
				return value === match;
			}
		);
	},

	mismatch: (item, filter) => {
		return applyMatch(
			Helper.get(item, filter.path),
			filter.match,
			(value, match) => {
				return value !== match;
			}
		);
	},

	matchType: (item, filter) => {
		return applyMatch(
			Helper.get(item, filter.path),
			filter.match,
			(value, match) => {
				return typeof value === match;
			}
		);
	},

	mismatchType: (item, filter) => {
		return applyMatch(
			Helper.get(item, filter.path),
			filter.match,
			(value, match) => {
				return typeof value !== match;
			}
		);
	},

	includes: (item, filter) => {
		return applyMatch(
			Helper.get(item, filter.path),
			filter.match,
			(value, match) => {
				return value.includes(match);
			}
		);
	},

	excludes: (item, filter) => {
		return applyMatch(
			Helper.get(item, filter.path),
			filter.match,
			(value, match) => {
				return !value.includes(match);
			}
		);
	},

	compare: (item, filter) => {
		return Helper.compare(
			Helper.get(item, filter.path),
			filter.match,
			filter.operator
		);
	},

	start: (item, filter) => {
		return applyMatch(
			Helper.get(item, filter.path, ''),
			filter.match,
			(value, match) => {
				return value.indexOf(match) === 0;
			}
		);
	},

	end: (item, filter) => {
		return applyMatch(
			Helper.get(item, filter.path, ''),
			filter.match,
			(value, match) => {
				return value.indexOf(match, value.length - match.length) !== -1;
			}
		);
	},

};