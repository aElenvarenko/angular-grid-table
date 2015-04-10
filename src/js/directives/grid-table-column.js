/**
 * Directive gridTableColumn
 */
grid.directive('gridTableColumn', [
	function () {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: 'grid-table-column.html'
		};
	}
]);