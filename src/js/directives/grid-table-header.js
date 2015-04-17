/**
 * Directive gridTableHeader
 */
grid.directive('gridTableHeader', [
	'gridTableConfig',
	function (config) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-header.html';
			}
		};
	}
]);