/**
 * Directive gridTableColumns
 */
grid.directive('gridTableColumns', [
	function () {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: 'grid-table-columns.html'
		};
	}
]);