import Helper from './Helper';
import moment from 'moment';

const safeEval = function () {

	let _dateDiffMeasurements = {
		years: 'years',
		months: 'months',
		weeks: 'weeks',
		days: 'days',
		hours: 'hours',
		minutes: 'minutes',
		seconds: 'seconds',
		y: 'years',
		m: 'months',
		w: 'weeks',
		d: 'days',
		h: 'hours',
		m: 'minutes',
		s: 'seconds',
	}

	function now () {
		return new moment().format();
	}

	function dateDiff (dateA, dateB, type) {
		type = _dateDiffMeasurements[type] || 'days';
		return moment(dateA).diff(moment(dateB), type);
	}

	return function (item, expression) {
		let values = [];
		for (var i = expression.paths.length - 1; i >= 0; i--) {
			values[i] = Helper.get(item, expression.paths[i]);
		}
		return eval(expression.parsedExpr);
	}
}();

export default (function () {

	const exprVarsRegex = /\{\{(.+)\}\}/g;

	return {
		safeEval (item, expression) {
			return safeEval(item, expression);
		},
		parseExpression (expression) {
			if ('string' === typeof expression) {
				let variableHash = {};
				let pathsArray = [];
				let parsedExpr = {
					originalExpr: expression,
					parsedExpr: expression.replace(exprVarsRegex, (variable, path) => {
						if (!variableHash[path]) {
							variableHash[path] = pathsArray.length;
							pathsArray.push(path);
						}
						return 'values[' + variableHash[path] + ']';
					}),
					paths: pathsArray
				};
				expression = parsedExpr;
			}
			return expression;
		}
	};

}());
