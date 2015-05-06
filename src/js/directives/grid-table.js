/**
 * Directive gridTable
 */
grid.directive('gridTable', [
	'$parse',
	'gridTableConfig',
	function ($parse, config) {
		return {
			restrict: 'EA',
			require: ['^gridTable', 'ngModel'],
			templateUrl: function () {
				return config.tplUrl + 'grid-table.html';
			},
			controller: 'gridTableCtrl',
			controllerAs: '$gridCtrl',
			compile: function () {
				return function (scope, element, attrs, ctrls) {
					var $grid = ctrls[0];
					/* Init grid by element and attrs */
					$grid.init(element, attrs);
					/* Render element html */
					element = $grid.renderTpl(element, attrs);
					/* Compile element */
					$grid.compileTpl(scope, element);
					/* Can select items */
					if (attrs.selectable) {
						scope.$watch(attrs.selectable, function (newValue, oldValue) {
							if (angular.equals(newValue, oldValue)) {
								return;
							}
							$grid.set('selectable', $parse(attrs.selectable)(scope));
						});
					}
					/* Columns */
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
					/* ngModel */
					$grid.setItems($parse(attrs.ngModel)(scope));
					scope.$watchCollection(attrs.ngModel, function (newValue, oldValue) {
						if (angular.equals(newValue, oldValue)) {
							return;
						}
						$grid.setItems(newValue);
					});
					/* Loading */
					if (attrs.loading) {
						scope.$watch(attrs.loading, function (newValue, oldValue) {
							if (angular.equals(newValue, oldValue)) {
								return;
							}
							$grid.setLoading(newValue);
						});
					}
					/* Params */
					if (attrs.params) {
						scope.$watchCollection(attrs.params, function (newValue, oldValue) {
							if (angular.equals(newValue, oldValue)) {
								return;
							}
							$grid.setParams(newValue);
						});
					}
				};
			}
		};
	}
]);