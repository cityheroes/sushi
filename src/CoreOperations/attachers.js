import Helper from '../Helper';

export default {

	formulaTemplate: (item, attacher) => {
		if (!attacher.template) {
			console.warn('Missing attacher parameter (\'template\').');
			return null;
		}

		return Helper.evalTemplate(attacher.template, item);
	},

	template: (item, attacher) => {
		if (!attacher.template) {
			console.warn('Missing attacher parameter (\'template\').');
			return null;
		}

		return attacher.template;
	}

};
