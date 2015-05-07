/**
 * Directive gridTableHeader
 */
grid.directive('gridTableHeader', [
	'gridTableGlobals',
	function (cGlobals) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return cGlobals.tplUrl + 'grid-table-header.html';
			}
		};
	}
]);