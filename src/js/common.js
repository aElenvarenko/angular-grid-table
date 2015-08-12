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
	pager: {
		pagesMaxCount: 5
	},
	/**/
	text: {
		tools: 'Tools:',
		refresh: '↻',
		refreshTitle: 'Refresh',
		clearFilter: 'X',
		clearFilterTitle: 'Clear filter',
		pager: 'Pages:',
		viewBy: 'View by:',
		numbers: '#',
		actions: 'Actions',
		asc: '⇣',
		desc: '⇡',
		empty: 'Empty',
		viewed: 'Viewed:',
		total: 'total:'
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