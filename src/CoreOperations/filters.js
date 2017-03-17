import Helper from '../Helper';

export default {

	match: (item, filter) => {
		return Helper.get(item, filter.path) === filter.match;
	},

	mismatch: (item, filter) => {
		return Helper.get(item, filter.path) !== filter.match;
	},

	compare: (item, filter) => {
		return Helper.compare(
			Helper.get(item, filter.path),
			filter.match,
			filter.operator
		);
	},

	start: (item, filter) => {
		return Helper.get(item, filter.path, '').indexOf(filter.match) !== -1;
	},

	end: (item, filter) => {
		let subject = Helper.get(item, filter.path, '');
		return subject.indexOf(filter.match, subject.length - filter.match.length) !== -1;
	},

};