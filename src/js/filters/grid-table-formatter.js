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
				'boolean': function (input) {},
				'integer': function (input) {},
				'string': function (input) {},
				'currency': function (input) {},
				'date': function (input) {},
				'datetime': function (input) {},
				'html': function (input) {}
			};
		return function (input, type, format) {
			if (!input) return input;
			return input;
		};
	}
]);