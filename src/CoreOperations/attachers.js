import Helper from '../Helper';

export default {

	formulaTemplate: (item, attacher, index) => {
		if (!attacher.template) {
			console.warn('Missing attacher parameter (\'template\').');
			return null;
		}

		let context = {
			$index: index,
			item: item
		};

		if (attacher.context) {
			context.context = attacher.context;
		}

		return Helper.evalTemplate(attacher.template, context);
	},

	template: (item, attacher) => {
		if (!attacher.template) {
			console.warn('Missing attacher parameter (\'template\').');
			return null;
		}

		return attacher.template;
	}

};
