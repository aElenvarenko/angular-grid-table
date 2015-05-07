/**
 * Factory gridTableSettings
 */
grid.factory('gridTableSettings', [
	function () {
		var defaults = {
				template: '{toolbar}{header}{items}{footer}',
				text: {
					viewBy: 'View by: ',
					numbers: '#',
					actions: 'Actions',
					asc: '⇣',
					desc: '⇡',
					empty: 'Empty',
					total: 'Total: '
				},
				pageParams: {
					page: 'page',
					perPage: 'per-page'
				},
				viewByList: [10, 25, 50],
				sorted: false,
				multiSort: false,
				sortParams: {
					asc: 'asc',
					desc: 'desc'
				},
				filtered: false,
				filterTimeout: 500,
				multiSelect: false
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