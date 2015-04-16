/**
 * Directive gridTableTaoolbar
 */
grid.directive('gridTableToolbar', [
	function () {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-toolbar.html';
			},
			compile: function () {
				return function (scope, element, attrs, ctrls) {};
			}
		};
	}
]);