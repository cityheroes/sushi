export default {

	extract: (item, mapper, helper) => {
		return helper.parsePath(mapper.src).map((src) => {
			return helper.extract(item, src, mapper.default);
		}).join(mapper.separator || ' ');
	},

	concat: (item, mapper, helper) => {
		return helper.parsePath(mapper.src).map((src) => {
			return helper.extract(item, src, mapper.default);
		}).join(mapper.separator || ' ');
	},

	convert: (item, mapper, helper) => {
		var comparison = helper.compare(
			helper.extract(item, mapper.src),
			mapper.match,
			mapper.operator
		);
		return comparison ? mapper.truth : mapper.false;
	},

	// translate: (item, mapper, helper) => {
	// 	let translations = mapper.translations || {};

	// 	Object.keys(item).forEach((key) => {
	// 		translations[helper.extract(item, mapper.src)];
	// 	});

	// 	return item;
	// },

	operation: (item, mapper, helper) => {
		return helper.calculate(
			[helper.extract(item, mapper.src), mapper.operand],
			mapper.operator
		);
	},

	sum: (item, mapper, helper) => {
		return helper.calculate(
			[helper.extract(item, mapper.src), mapper.operand],
			'addition'
		);
	},

	operationMap: (item, mapper, helper) => {
		return helper.calculate(
			helper.extractMap(item, mapper.src),
			mapper.operator
		);
	},

};