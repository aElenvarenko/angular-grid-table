var grid = angular.module('gridTable', []);
/**
 * Constant gridTableConfig
 */
grid.constant('gridTableGlobals', {
	/**/
	tplUrl: '',
	/**/
	template: '{toolbar}{header}{items}{footer}',
	/**/
	theme: '',
	/**/
	text: {
		viewBy: 'View by: ',
		numbers: '#',
		actions: 'Actions',
		asc: '⇣',
		desc: '⇡',
		empty: 'Empty',
		total: 'Total: '
	},
	/**/
	formatters: {
		boolean: {
			'true': 'Yes',
			'false': 'No'
		},
		currency: {
			sep: ' '
		},
		date: {
			format: 'd.m.Y'
		},
		datetime: {
			format: 'd.m.Y H:i:s'
		}
	},
	/* Setter function */
	set: function (key, value) {
		if (angular.isObject(this[key])) {
			this[key] = angular.extend(this[key], value);
		} else {
			this[key] = value;
		}
	},
	/* Getter function */
	get: function (key) {
		return this[key] || null;
	}
});