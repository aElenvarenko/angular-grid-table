/*!
 * angular-grid-table
 * @version: 0.0.1 - 2015-04-08T11:24:18.813Z
 * @author: Alex Elenvarenko <alexelenvarenko@gmail.com>
 * @license: MIT
 */


(function () {
	'use strict';
/**
 * 
 */
var grid = angular.module('gridTable', []);
/**
 * 
 */
grid.controller('gridTableCtrl', [
	'$scope',
	function ($scope) {
		'use strict';
		var ctrl = this;
	}
]);

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

grid.run(["$templateCache", function($templateCache) {
$templateCache.put("grid-table.html","");
}]);
}());