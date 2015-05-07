/**
 * Directive gridTableItems
 */
grid.directive('gridTableItems', [
	'gridTableGlobals',
	function (cGlobals) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return cGlobals.tplUrl + 'grid-table-items.html';
			}
		};
	}
]);