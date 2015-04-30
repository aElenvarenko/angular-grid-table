/**
 * Factory gridTableSettings
 */
grid.factory('gridTableSettings', [
	function () {
		var defaults = {
			template: '{toolbar}{header}{items}{footer}',
				sorted: false,
				multiSort: false,
				sortParams: {
					asc: 'asc',
					desc: 'desc'
				},
				pageParams: {
					page: 'page',
					perPage: 'per-page'
				},
				filtered: false,
				filterTimeout: 500,
				multiSelect: false,
				viewByList: [10, 25, 50],
				text: {
					viewBy: 'View by: ',
					numbers: '#',
					actions: 'Actions',
					asc: '⇣',
					desc: '⇡',
					empty: 'Empty',
					total: 'Total: '
				}
		};
		return {
			get: function () {
				return defaults;
			},
			extend: function (settings) {
				return angular.extend(defaults, settings);
			}
		};
	}
]);