/**
 * Directive gridTableFooter
 */
grid.directive('gridTableFooter', [
	function () {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: 'grid-table-footer.html'
		};
	}
]);