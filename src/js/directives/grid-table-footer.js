/**
 * Directive gridTableFooter
 */
grid.directive('gridTableFooter', [
	'gridTableConfig',
	function (config) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-footer.html';
			}
		};
	}
]);