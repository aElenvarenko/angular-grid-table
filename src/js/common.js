var grid = angular.module('gridTable', []);
/**
 * Constant gridTableConfig
 */
grid.constant('gridTableConfig', {
	tplUrl: '',
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