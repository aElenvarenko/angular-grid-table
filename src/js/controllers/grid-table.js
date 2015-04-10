/**
 * Controller gridTableCtrl
 */
grid.controller('gridTableCtrl', [
	'$compile',
	'$scope',
	function ($compile, $scope) {
		var ctrl = this;
		$scope.$grid = {
			defaults: {
				template: '{header}{items}{footer}',
				sorted: false,
				sortParams: {
					asc: 'asc',
					desc: 'desc'
				},
				pageParams: {
					page: 'page',
					perPage: ''
				},
				filtered: false,
				multiSelect: false,
				viewByList: [10, 25, 50]
			},
			debug: true,
			columns: [],
			columnsCount: 0,
			hiddenColumns: [],
			items: [],
			itemsCount: 0,
			rowNumbers: false,
			itemActions: null,
			multiSelect: false,
			selected: null,
			sorted: false,
			sort: {},
			filtered: false,
			filter: {},
			viewBy: 10,
			viewByList: [10, 25, 50],
			pager: {
				current: 0,
				total: 0,
				limit: 0,
				offset: 0
			},
			params: {},
			paramsVars: {},
			events: {
				onColumnsUpdate: null,
				onItemsUpdate: null,
				onSelect: null,
				onSort: null,
				onFilter: null,
				onUpdate: null,
				onError: null
			},
			/**
			 * Columns setter function
			 * @param {Array|Object} columns
			 */
			setColumns: function (columns) {
				if (this.debug) {
					console.log('gridTableCtrl::grid::setColumns');
				}
				if (!columns) {
					return;
				}
				var column;
				this.columns = [];
				this.columnsCount = 0;
				if (this.rowNumbers) {
					this.columns.push({
						label: '#',
						columnType: 'numbers'
					});
					this.columnsCount++;
				}
				if (angular.isArray(columns) && columns.length > 0) {
					for (var i in columns) {
						column = columns[i];
						column.columnType = 'data';
						this.columns.push(column);
					}
				} else {
					for(var prop in columns) {
						column = columns[prop];
						column.columnType = 'data';
						this.columns.push(column);
					}
				}
				this.columnsCount += this.columns.length;
			},
			/**
			 * Columns setter function
			 * @param {Object} item
			 */
			setColumnsByModel: function (item) {
				if (this.debug) {
					console.log('gridTableCtrl::grid::setColumnsByModel');
				}
				if (!item) {
					return;
				}
				this.columns = [];
				this.columnsCount = 0;
				if (this.rowNumbers) {
					this.columns.push({
						label: '#',
						columnType: 'numbers'
					});
					this.columnsCount++;
				}
				for (var prop in item) {
					if (prop !== '$$hashKey') {
						this.columns.push({
							name: prop,
							label: prop,
							columnType: 'data'
						});
					}
				}
				this.columnsCount += this.columns.length;
			},
			/**
			 * Columns getter function
			 * @returns {Array}
			 */
			getColumns: function () {
				if (this.debug) {
					console.log('gridTableCtrl::grid::getColumns');
				}
				return this.columns || [];
			},
			/**
			 * Check column is hidden function
			 * @param {String} name
			 * @return {Boolean}
			 */
			isHiddenColumns: function (name) {
				if (this.debug) {
					console.log('gridTableCtrl::grid::isHiddenColumns');
				}
				return this.hiddenColumns.indexOf(name) !== -1;
			},
			/**
			 * Show or hide column function
			 * @param {String} name
			 * @param {Object} event
			 */
			showHideColumn: function (name, event) {
				if (this.debug) {
					console.log('gridTableCtrl::grid::showHideColumn');
				}
				if (!name) {
					this.hiddenColumns = [];
				} else {
					if (!this.isHiddenColumns(name)) {
						this.hiddenColumns.push(name);
					} else {
						this.hiddenColumns.splice(this.hiddenColumns.indexOf(name), 1);
					}
				}
				event.preventDefault();
			},
			/**
			 * Get not hidden columns function
			 * @return {Array}
			 */
			getShowColumns: function () {
				if (this.debug) {
					console.log('gridTableCtrl::grid::getShowColumns');
				}
				var columns = [];
				for (var i in this.columns) {
					if (!this.isHiddenColumns(this.columns[i].name) || this.columns[i].columnType !== 'data') {
						columns.push(this.columns[i]);
					}
				}
				return columns;
			},
			/**
			 * Items setter function
			 * @param {Array} items
			 */
			setItems: function (items) {
				if (this.debug) {
					console.log('gridTableCtrl::grid::setItems');
				}
				if (!items) {
					this.items = [];
					return;
				}
				this.items = items;
			},
			/**
			 * Items getter function
			 * @return {Array}
			 */
			getItems: function () {
				if (this.debug) {
					console.log('gridTableCtrl::grid::getItems');
				}
				return this.items || [];
			},
			/**
			 * Check item is selected function
			 * @param {Object} item
			 * @return {Boolean}
			 */
			isSelectedItem: function (item) {
				if (this.debug) {
					console.log('gridTableCtrl::grid::isSelectedItem');
				}
				if (this.selected) {
					if (this.multiSelect) {
						if (angular.isArray(this.selected) && this.selected.length > 0) {
							return this.selected.indexOf(item) !== -1;
						}
					} else {
						return this.selected === item;
					}
				}
				return false;
			},
			/**
			 * Select item function
			 * @param {Object} item
			 */
			selectItem: function (item) {
				if (this.debug) {
					console.log('gridTableCtrl::grid::selectItem');
				}
				if (!item) {
					this.selected = null;
					return;
				}
				var selected = this.isSelectedItem(item);
				if (this.multiSelect) {
					if (selected) {
						this.selected.splice(this.selected.indexOf(item), 1);
					} else {
						if (angular.isArray(this.selected)) {
							this.selected.push(item);
						} else {
							this.selected = [item];
						}
					}
				} else {
					if (selected) {
						this.selected = null;
					} else {
						this.selected = item;
					}
				}
			},
			/**
			 * Add event listener function
			 * @param {String} event
			 * @param {Function} callback
			 */
			addEvent: function (event, callback) {
				if (this.debug) {
					console.log('gridTableCtrl::grid::addEvent');
				}
				if (!event && !callback) {
					return;
				}
			},
			/**
			 * Trigger event function
			 * @param {String} event
			 * @param {Object} params
			 */
			triggerEvent: function (event, params) {
				if (this.debug) {
					console.log('gridTableCtrl::grid::triggerEvent');
				}
				if (!event) {
					return;
				}
			},
			/**
			 * Remove event listener function
			 * @param {String} event
			 */
			removeEvent: function (event) {
				if (this.debug) {
					console.log('gridTableCtrl::grid::removeEvent');
				}
				if (!event) {
					return;
				}
			}
		};
		/**
		 * Init function
		 */
		ctrl.init = function (element, attrs) {
			if ($scope.$grid.debug) {
				console.log('gridTableCtrl::init');
			}
			if (attrs.rowNumbers) {
				$scope.$grid.rowNumbers = attrs.rowNumbers;
			}
		};
		/**
		 * Render template function
		 * @param {Object} elemen
		 * @param {Object} attrs
		 * @return {Object}
		 */
		ctrl.renderTpl = function (element, attrs) {
			if ($scope.$grid.debug) {
				console.log('gridTableCtrl::renderTpl');
			}
			var template = attrs.template || $scope.$grid.defaults.template,
				matches = template.match(/\{[a-z\:]+\}/g);
			if (matches && matches.length > 0) {
				for (var i in matches) {
					var fn = matches[i].replace(/\{|\}/g, ''),
						params = null;
					if (fn.indexOf(':') !== -1) {
						params = fn.split(':');
						fn = params.splice(0, 1)[0];
					}
					fn = 'render' + fn[0].toUpperCase() + fn.substr(1);
					if (ctrl[fn] && angular.isFunction(ctrl[fn])) {
						element = ctrl[fn](element, attrs);
					}
				}
			}
			element.addClass('grid-table-wrapper');
			return element;
		};
		/**
		 * Render header function
		 * @param {Object} element
		 * @return {Object}
		 */
		ctrl.renderHeader = function (element) {
			if ($scope.$grid.debug) {
				console.log('gridTableCtrl::renderHeader');
			}
			var columns = angular.element(document.createElement('colgroup')),
				header = angular.element(document.createElement('thead'));
			columns.attr({
				'grid-table-columns': ''
			});
			columns.addClass('grid-table-columns');
			header.attr({
				'grid-table-header': ''
			});
			header.addClass('grid-table-header');
			element.find('table').append(columns);
			element.find('table').append(header);
			return element;
		};
		/**
		 * Render items function
		 * @param {Object} element
		 * @return {Object}
		 */
		ctrl.renderItems = function (element) {
			if ($scope.$grid.debug) {
				console.log('gridTableCtrl::renderItems');
			}
			var items = angular.element(document.createElement('tbody'));
			items.attr({
				'grid-table-items': ''
			});
			items.addClass('grid-table-items');
			element.find('table').append(items);
			return element;
		};
		/**
		 * Render footer function
		 * @param {Object} element
		 * @return {Object}
		 */
		ctrl.renderFooter = function (element) {
			if ($scope.$grid.debug) {
				console.log('gridTableCtrl::renderFooter');
			}
			var footer = angular.element(document.createElement('tfoot'));
			footer.attr({
				'grid-table-footer': ''
			});
			footer.addClass('grid-table-footer');
			element.find('table').append(footer);
			return element;
		};
		/**
		 * Compile template function
		 * @param {Object} scope
		 * @param {Object} element
		 */
		ctrl.compileTpl = function (scope, element) {
			if ($scope.$grid.debug) {
				console.log('gridTableCtrl::compileTpl');
			}
			$compile(element.contents())(scope);
		};
		/**
		 * Columns setter function
		 * @param {Array|Object} columns
		 */
		ctrl.setColumns = function (columns) {
			if ($scope.$grid.debug) {
				console.log('gridTableCtrl::setColumns');
			}
			$scope.$grid.setColumns(columns);
		};
		/**
		 * Columns setter function
		 * @param {Object} item
		 */
		ctrl.setColumnsByModel = function (item) {
			if ($scope.$grid.debug) {
				console.log('gridTableCtrl::setColumnsByModel');
			}
			$scope.$grid.setColumnsByModel(item);
		};
		/**
		 * Columns getter function
		 * @return {Array}
		 */
		ctrl.getColumns = function () {
			if ($scope.$grid.debug) {
				console.log('gridTableCtrl::getColumns');
			}
			return $scope.$grid.getColumns() || [];
		};
		/**
		 * Items setter function
		 */
		ctrl.setItems = function (items) {
			if ($scope.$grid.debug) {
				console.log('gridTableCtrl::setItems');
			}
			$scope.$grid.setItems(items);
		};
		/**
		 * Items getter function
		 */
		ctrl.getItems = function () {};
		/**
		 * Sort setter function
		 */
		ctrl.setSort = function () {};
		/**
		 * Sort getter function
		 */
		ctrl.getSort = function () {};
		/**
		 * Filter setter function
		 */
		ctrl.setFilter = function () {};
		/**
		 * Filter getter function
		 */
		ctrl.getFilter = function () {};
		ctrl.setViewBy = function () {};
		ctrl.getViewBy = function () {};
		ctrl.setPager = function () {};
		ctrl.getPager = function () {};
	}
]);