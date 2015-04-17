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
			link: function (scope, element) {
				element.append(scope.html);
			}
		};
	}
]);