/**
 * 
 */
grid.directive('gridTable', [
	function () {
		'use strict';
		return {
			restrict: 'EA',
			require: ['^gridTable', '^ngModel'],
			templateUrl: 'grid-table.html',
			controller: 'gridTableCtrl',
			controllerAs: '$gridCtrl',
			compile: function (iElement, iAttrs) {
				return function (scope, element, attrs, ctrls) {
					var $grid = ctrls[0],
						ngModel = ctrls[1];
				};
			}
		};
	}
]);
