grid.directive('gridTableToolbar', [
	function () {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: 'grid-table-toolbar.html',
			compile: function () {
				return function (scope, element, attrs, ctrls) {};
			}
		};
	}
]);