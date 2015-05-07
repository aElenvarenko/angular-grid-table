/**
 * Directive gridTableColumns
 */
grid.directive('gridTableColumns', [
	'gridTableGlobals',
	function (cGlobals) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return cGlobals.tplUrl + 'grid-table-columns.html';
			}
		};
	}
]);