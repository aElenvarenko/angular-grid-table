/**
 * Directive gridTableHeader
 */
grid.directive('gridTableHeader', [
	'gridTableGlobals',
	function (cGlobals) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return cGlobals.tplUrl + 'grid-table-header.html';
			},
			link: function (scope, element, attrs, ctrl) {
				var activeFilter;
				element.on('focusin', '.grid-table-filter input, .grid-table-filter select', function () {
					activeFilter = $(this).attr('id');
				});
				ctrl.set('addEvent', 'onFilter', function () {
					element.find('.grid-table-filter #' + activeFilter).focus();
				});
			}
		};
	}
]);