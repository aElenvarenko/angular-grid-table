/**
 * Directive gridTableHeader
 */
grid.directive('gridTableHeader', [
	function () {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-header.html';
			}
		};
	}
]);