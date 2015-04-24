var grid = angular.module('gridTable', []);
/**
 * Constant gridTableConfig
 */
grid.constant('gridTableConfig', {
	tplUrl: '',
	text: {
		viewBy: 'View by: ',
		numbers: '#',
		actions: 'Actions',
		asc: '⇣',
		desc: '⇡',
		empty: 'Empty',
		total: 'Total: '
	},
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
	}
});