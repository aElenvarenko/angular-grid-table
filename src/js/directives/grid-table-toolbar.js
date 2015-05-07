/**
 * Directive gridTableToolbar
 */
grid.directive('gridTableToolbar', [
	'gridTableGlobals',
	function (cGlobals) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return cGlobals.tplUrl + 'grid-table-toolbar.html';
			}
		};
	}
]);