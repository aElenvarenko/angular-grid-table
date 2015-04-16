/**
 * Directive gridTableItems
 */
grid.directive('gridTableItems', [
	function () {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-items.html';
			}
		};
	}
]);