/**
 * Directive gridTable
 */
grid.directive('gridTable', [
	'$parse',
	function ($parse) {
		return {
			restrict: 'EA',
			require: ['^gridTable', '^ngModel'],
			templateUrl: 'grid-table.html',
			controller: 'gridTableCtrl',
			controllerAs: '$gridCtrl',
			compile: function () {
				return function (scope, element, attrs, ctrls) {
					var $grid = ctrls[0];
					$grid.init(element, attrs);
					element = $grid.renderTpl(element, attrs);
					$grid.compileTpl(scope, element);
					if (attrs.columns) {
						$grid.setColumns($parse(attrs.columns)(scope));
						scope.$watchCollection(attrs.columns, function (newValue, oldValue) {
							if (angular.equals(newValue, oldValue)) {
								return;
							}
							$grid.setColumns(newValue);
						});
					} else {
						var items = $parse(attrs.ngModel)(scope);
						if (items && items.length > 0) {
							$grid.setColumnsByModel(items[0]);
						}
						scope.$watchCollection(attrs.ngModel, function (newValue, oldValue) {
							if (angular.equals(newValue, oldValue)) {
								return;
							}
							if (newValue && newValue.length > 0) {
								$grid.setColumnsByModel(newValue[0]);
							}
						});
					}
					$grid.setItems($parse(attrs.ngModel)(scope));
					scope.$watchCollection(attrs.ngModel, function (newValue, oldValue) {
						if (angular.equals(newValue, oldValue)) {
							return;
						}
						$grid.setItems(newValue);
					});
				};
			}
		};
	}
]);