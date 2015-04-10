/**
 * Directive gridTableItems
 */
grid.directive('gridTableItems', [
	function () {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: 'grid-table-items.html'
		};
	}
]);