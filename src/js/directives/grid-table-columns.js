/**
 * Directive gridTableColumns
 */
grid.directive('gridTableColumns', [
	function () {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-columns.html';
			}
		};
	}
]);