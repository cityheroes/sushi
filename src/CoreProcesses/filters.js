export default {

	match: (item, filter, helper) => {
		return helper.extract(item, filter.src) === filter.match;
	},

	mismatch: (item, filter, helper) => {
		return helper.extract(item, filter.src) !== filter.match;
	},

	compare: (item, filter, helper) => {
		return helper.compare(
			helper.extract(item, filter.src),
			filter.match,
			filter.operator
		);
	},

	start: (item, filter, helper) => {
		return helper.extract(item, filter.src, '').indexOf(filter.match) !== -1;
	},

	end: (item, filter, helper) => {
		var subject = helper.extract(item, filter.src, '');
		return subject.indexOf(filter.match, subject.length - filter.match.length) !== -1;
	},

};