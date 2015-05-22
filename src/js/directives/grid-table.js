/**
 * Directive gridTable
 */
grid.directive('gridTable', [
	'$parse',
	'gridTableGlobals',
	function ($parse, cGlobals) {
		return {
			restrict: 'EA',
			require: ['^gridTable', 'ngModel'],
			scope: true,
			templateUrl: function () {
				return cGlobals.tplUrl + 'grid-table.html';
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
						$grid.set('columns', $parse(attrs.columns)(scope));
						scope.$watchCollection(attrs.columns, function (newValue, oldValue) {
							if (angular.equals(newValue, oldValue)) {
								return;
							}
							$grid.set('columns', newValue);
						});
					} else {
						var items = $parse(attrs.ngModel)(scope);
						if (items && items.length > 0) {
							$grid.set('columnsByModel', items[0]);
						}
						scope.$watchCollection(attrs.ngModel, function (newValue, oldValue) {
							if (angular.equals(newValue, oldValue)) {
								return;
							}
							if (newValue && newValue.length > 0) {
								$grid.set('columnsByModel', newValue[0]);
							}
						});
					}
					/* ngModel */
					$grid.set('items', $parse(attrs.ngModel)(scope));
					scope.$watchCollection(attrs.ngModel, function (newValue, oldValue) {
						if (angular.equals(newValue, oldValue)) {
							return;
						}
						$grid.set('items', newValue);
					});
					/* Loading */
					if (attrs.loading) {
						scope.$watch(attrs.loading, function (newValue, oldValue) {
							if (angular.equals(newValue, oldValue)) {
								return;
							}
							$grid.set('loading', newValue);
						});
					}
					/* Params */
					if (attrs.params) {
						scope.$watchCollection(attrs.params, function (newValue, oldValue) {
							if (angular.equals(newValue, oldValue)) {
								return;
							}
							$grid.set('params', newValue);
						});
					}
				};
			}
		};
	}
]);