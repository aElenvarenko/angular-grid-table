/**
 * Directive gridTableToolbar
 */
grid.directive('gridTableToolbar', [
	'gridTableConfig',
	function (config) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-toolbar.html';
			}
		};
	}
]);