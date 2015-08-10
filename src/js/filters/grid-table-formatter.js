/**
 * Filter gridTableFormatter
 */
grid.filter('gridTableFormatter', [
	'gridTableGlobals',
	function (cGlobals) {
		var formatters = {
				'boolean': function (input) {
					var t = [true, 'true', '1', 1],
						f = [null, undefined, '', false, 'false', '0', 0];

					if (t.indexOf(input) !== -1) {
						input = true;
					}

					if (f.indexOf(input) !== -1) {
						input = false;
					}

					return input ? cGlobals.formatters.boolean['true'] : cGlobals.formatters.boolean['false'];
				},
				'integer': function (input) {
					return input;
				},
				'string': function (input) {
					return input;
				},
				'currency': function (input) {
					if (input === undefined || input === null) {
						return input;
					}
					
					input += '';
					if (input.indexOf('.') === -1) {
						input += '.00';
					}
					
					return input;
				},
				'date': function (input) {
					if (input === undefined || input === null) {
						return input;
					}
					
					var exp = /([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/;
					input += '';
					if (exp.test(input)) {
						input = input.replace(exp, '$3.$2.$1');
					}
					return input;
				},
				'datetime': function (input) {
					if (input === undefined || input === null) {
						return input;
					}
					
					var exp = /([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})\s(([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}))(.*)/;
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
			if (formatters[type] && angular.isFunction(formatters[type])) {
				input = formatters[type](input, format);
			}
			return input;
		};
	}
]);