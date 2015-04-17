/**
 * Directive gridTableItems
 */
grid.directive('gridTableItems', [
	'gridTableConfig',
	function (config) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-items.html';
			}
		};
	}
]);