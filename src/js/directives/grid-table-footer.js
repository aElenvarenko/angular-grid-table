/**
 * Directive gridTableFooter
 */
grid.directive('gridTableFooter', [
	'gridTableGlobals',
	function (cGlobals) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return cGlobals.tplUrl + 'grid-table-footer.html';
			}
		};
	}
]);