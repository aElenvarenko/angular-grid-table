/**
 * Directive gridTableItemAction
 */
grid.directive('gridTableItemAction', [
	function () {
		return {
			restrict: 'EA',
			scope: {
				html: '=html'
			},
			compile: function () {
				return function (scope, element, attrs, ctrls) {
					element.append(scope.html);
				}
			}
		};
	}
]);