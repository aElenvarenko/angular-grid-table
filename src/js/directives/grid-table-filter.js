/**
 * Directive gridTableFilter
 */
grid.directive('gridTableFilter', [
	'$compile',
	function ($compile) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			compile: function () {
				return function (scope, element) {
					if (scope.gridFilter.html) {
						element.append(scope.gridFilter.html);
						$compile(element.contents())(scope);
					}
				};
			}
		};
	}
]);