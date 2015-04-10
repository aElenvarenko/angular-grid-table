/**
 * Directive gridTableHeader
 */
grid.directive('gridTableHeader', [
	function () {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: 'grid-table-header.html'
		};
	}
]);