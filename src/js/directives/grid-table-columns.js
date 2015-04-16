/**
 * Directive gridTableColumns
 */
grid.directive('gridTableColumns', [
	'gridTableConfig',
	function (config) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-columns.html';
			}
		};
	}
]);