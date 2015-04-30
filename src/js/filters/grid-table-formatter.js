/**
 * Filter gridTableFormatter
 */
grid.filter('gridTableFormatter', [
	'gridTableConfig',
	function (config) {
		var types = {
				'boolean': '',
				'integer': '',
				'string': '',
				'currency': '',
				'date': '',
				'datetime': '',
				'html': ''
			},
			formatters = {
				'boolean': function (input) {
					return (input == 1 || input == 'true' || input === true) ? config.formatters.boolean['true'] : config.formatters.boolean['false'];
				},
				'integer': function (input) {
					return input;
				},
				'string': function (input) {
					return input;
				},
				'currency': function (input) {
					input += '';
					if (input.indexOf('.') === -1) {
						input += '.00';
					}
					return input;
				},
				'date': function (input) {
					var exp = /([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/;
					input += '';
					if (exp.test(input)) {
						input = input.replace(exp, '$3.$2.$1');
					}
					return input;
				},
				'datetime': function (input) {
					var exp = /([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})\s(([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}))/;
					input += '';
					if (exp.test(input)) {
						input = input.replace(exp, '$3.$2.$1 $4');
					}
					return input;
				},
				'html': function (input) {
					return input;
				}
			};
		return function (input, type, format) {
			if (input === undefined || input === null) {
				return input;
			}
			if (formatters[type] && angular.isFunction(formatters[type])) {
				input = formatters[type](input, format);
			}
			return input;
		};
	}
]);