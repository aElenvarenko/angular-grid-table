/*!
 * angular-grid-table
 * @version: 0.0.1 - 2015-04-30T11:32:26.411Z
 * @author: Alex Elenvarenko <alexelenvarenko@gmail.com>
 * @license: MIT
 */


(function () {
	'use strict';
var grid = angular.module('gridTable', []);
/**
 * Constant gridTableConfig
 */
grid.constant('gridTableConfig', {
	tplUrl: '',
	text: {
		viewBy: 'View by: ',
		numbers: '#',
		actions: 'Actions',
		asc: '⇣',
		desc: '⇡',
		empty: 'Empty',
		total: 'Total: '
	},
	formatters: {
		boolean: {
			'true': 'Yes',
			'false': 'No'
		},
		currency: {
			sep: ' '
		},
		date: {
			format: 'd.m.Y'
		},
		datetime: {
			format: 'd.m.Y H:i:s'
		}
	}
});
/**
 * Controller gridTableCtrl
 */
grid.controller('gridTableCtrl', [
	'$scope',
	'$compile',
	'$parse',
	'$filter',
	'$interval',
	'gridTablePager',
	function ($scope, $compile, $parse, $filter, $interval, fPager) {
		var ctrl = this;
		$scope.$grid = {
			/* Defaults */
			defaults: {
				template: '{toolbar}{header}{items}{footer}',
				sorted: false,
				multiSort: false,
				sortParams: {
					asc: 'asc',
					desc: 'desc'
				},
				pageParams: {
					page: 'page',
					perPage: 'per-page'
				},
				filtered: false,
				filterTimeout: 500,
				multiSelect: false,
				viewByList: [10, 25, 50, 100],
				text: {
					viewBy: 'View by: ',
					numbers: '#',
					actions: 'Actions',
					asc: '⇣',
					desc: '⇡',
					empty: 'Empty',
					total: 'Total: '
				}
			},
			/* Enable or disable debug mode */
			debug: false,
			/* Remote actions */
			remote: false,
			/* Loading status */
			loading: false,
			/* ngModel variable */
			ngModelVar: '',
			/* Columns */
			columns: [],
			/* Columns count */
			columnsCount: 0,
			/* Hidden columns */
			hiddenColumns: [],
			/* Items */
			items: [],
			/* Items count */
			itemsCount: 0,
			/* Items actions */
			itemActions: null,
			/* Show or hide row numbers */
			rowNumbers: false,
			/* Enable or disable select item */
			selectable: true,
			/* Enable or disable multi items select */
			multiSelect: false,
			/* Selectted item or items */
			selected: null,
			/* Enable or disable sorting */
			sorted: false,
			/* Enable or disable multi sorting */
			multiSort: false,
			/* Sort */
			sort: {},
			/* Enable or disable filtering */
			filtered: false,
			/* Custom filters */
			filters: null,
			/* Filter */
			filter: {},
			/* Filter timeout id */
			filterTimeoutId: null,
			/* Filter timeout in miliseconds */
			filterTimeout: 500,
			/* View by count */
			viewBy: 10,
			/* View by list */
			viewByList: [10, 25, 50, 100],
			/* Pager */
			pager: {
				/* Current page */
				current: 0,
				/* Total items count */
				total: 0,
				/* Items limit */
				limit: 0,
				/* Items offset */
				offset: 0,
				/* Pager items */
				items: []
			},
			/* Request params */
			params: {},
			/* Request params variables */
			paramsVars: {},
			/* Errors */
			errors: null,
			/* Events */
			events: {
				/* On columns update event callback */
				onColumnsUpdate: null,
				/* On item click event callback */
				onItemClick: null,
				/* On item dbl click callback */
				onItemDblClick: null,
				/* On items update event callback */
				onItemsUpdate: null,
				/* On current page update event callback */
				onPage: null,
				/* On view by update event callback */
				onViewBy: null,
				/* On sort update event callback */
				onSort: null,
				/* On filter update event callback */
				onFilter: null,
				/* On select update event callback */
				onSelect: null,
				/* On params update event callback */
				onParams: null,
				/* On update event callback */
				onUpdate: null,
				/* On error update event callback */
				onError: null
			},
			/* Text */
			text: {},
			/**
			 * Build columns function
			 * @param {Array|Object} columns
			 * @param {Object} item
			 */
			buildColumns: function (columns, item) {
				var column,
					i,
					prop;
				this.columns = [];
				this.columnsCount = 0;
				if (this.rowNumbers) {
					this.columns.push({
						columnType: 'numbers'
					});
				}
				if (columns) {
					if (angular.isArray(columns) && columns.length > 0) {
						for (i in columns) {
							column = columns[i];
							column.columnType = 'data';
							this.columns.push(column);
						}
					} else {
						for(prop in columns) {
							column = columns[prop];
							column.columnType = 'data';
							this.columns.push(column);
						}
					}
				}
				if (item) {
					for (prop in item) {
						if (prop !== '$$hashKey') {
							this.columns.push({
								name: prop,
								label: prop,
								columnType: 'data'
							});
						}
					}
				}
				if (this.itemActions) {
					this.columns.push({
						columnType: 'actions'
					});
				}
				this.columnsCount = this.columns.length;
			},
			/**
			 * Columns setter function
			 * @param {Array|Object} columns
			 */
			setColumns: function (columns) {
				if (!columns) {
					return;
				}
				this.buildColumns(columns);
				this.triggerEvent('onColumnsUpdate');
			},
			/**
			 * Columns setter function
			 * @param {Object} item
			 */
			setColumnsByModel: function (item) {
				if (!item) {
					return;
				}
				this.buildColumns(null, item);
				this.triggerEvent('onColumnsUpdate');
			},
			/**
			 * Columns getter function
			 * @returns {Array}
			 */
			getColumns: function () {
				return this.columns || [];
			},
			/**
			 * Check column is hidden function
			 * @param {String} name
			 * @return {Boolean}
			 */
			isHiddenColumns: function (name) {
				return this.hiddenColumns.indexOf(name) !== -1;
			},
			/**
			 * Show or hide column function
			 * @param {String} name
			 * @param {Object} event
			 */
			showHideColumn: function (name, event) {
				event.preventDefault();
				if (!name) {
					this.hiddenColumns = [];
				} else {
					if (!this.isHiddenColumns(name)) {
						this.hiddenColumns.push(name);
					} else {
						this.hiddenColumns.splice(this.hiddenColumns.indexOf(name), 1);
					}
				}
			},
			/**
			 * Get not hidden columns function
			 * @return {Array}
			 */
			getShowColumns: function () {
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
				if (!this.remote) {
					this.loading = true;
				}
				if (!items) {
					this.items = [];
					return;
				}
				if (!this.remote) {
					if (this.sort.column && this.sort.dir) {
						var sort = this.sort;
						items = items.sort(function (a, b) {
							var v1 = a[sort.column],
								v2 = b[sort.column];
							if (sort.dir === 'asc') {
								return (v1 < v2) ? -1 : (v1 > v2) ? 1 : 0;
							} else {
								return (v1 < v2) ? 1 : (v1 > v2) ? -1 : 0;
							}
						});
					}
					if (this.filter) {
						items = $filter('filter')(items, this.filter);
					}
					this.pager.total = items.length;
				}
				if (this.pager.current > Math.ceil(this.pager.total / this.viewBy)) {
					this.pager.current = Math.ceil(this.pager.total / this.viewBy) - 1;
				}
				this.pager.items = fPager.createItems(this.pager.current, this.viewBy, this.pager.total);
				if (!this.remote) {
					this.items = items.slice(this.pager.current * this.viewBy, (this.pager.current + 1) * this.viewBy);
				} else {
					this.items = items;
				}
				this.itemsCount = this.items.length || 0;
				this.triggerEvent('onItemsUpdate');
				if (!this.remote) {
					this.loading = false;
				}
			},
			/**
			 * Items getter function
			 * @return {Array}
			 */
			getItems: function () {
				return this.items || [];
			},
			/**
			 * Check item is selected function
			 * @param {Object} item
			 * @return {Boolean}
			 */
			isSelectedItem: function (item) {
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
				this.triggerEvent('onSelect');
			},
			/**
			 * Call item action function
			 * @param {Function} fn
			 * @param {Object} item
			 * @param {Object} event
			 */
			callItemAction: function (fn, item, event) {
				event.preventDefault();
				event.stopPropagation();
				fn(item);
			},
			/**
			 * Get item value function
			 * @param {Object} item
			 * @param {String} key
			 * @return {Object}
			 */
			getValue: function (item, key) {
				return $parse(key)(item);
			},
			/**
			 * Set current page function
			 * @param {Number} page
			 */
			setPage: function (index, event) {
				event.preventDefault();
				if (this.pager.current == index) {
					return;
				}
				this.pager.current = index;
				this.pager.limit = this.viewBy;
				this.pager.offset = this.pager.current * this.pager.limit;
				this.updateParams();
				this.triggerEvent('onPage');
				this.update();
			},
			/**
			 * Get current page function
			 * @return {Number}
			 */
			getPage: function () {
				return this.pager.current || 0;
			},
			/**
			 * Set view by count function
			 * @param {Number} count
			 * @param {Object} event
			 */
			setViewBy: function (count, event) {
				event.preventDefault();
				if (this.viewBy == count) {
					return;
				}
				this.viewBy = count;
				this.updateParams();
				this.triggerEvent('onViewBy');
				this.update();
			},
			/**
			 * Get view by count function
			 * @return {Number}
			 */
			getViewBy: function () {
				return this.viewBy;
			},
			/**
			 * Sort setter function
			 * @param {Object} sort
			 */
			setSort: function (sort) {
				this.sort = sort;
				this.triggerEvent('onSort');
				this.update();
			},
			/**
			 * Sort getter function
			 * @return {Object}
			 */
			getSort: function () {
				return this.sort || {};
			},
			/**
			 * Set sort function
			 * @param {String} column
			 * @param {String} dir
			 * @param {Object} event
			 */
			setSortBy: function (column, dir, event) {
				event.preventDefault();
				if (this.sort.column === column) {
					this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
				} else {
					this.sort = {
						column: column,
						dir: dir ? dir : 'asc'
					};
				}
				this.updateParams();
				this.triggerEvent('onSort');
				this.update();
			},
			/**
			 * Get sort column function
			 * @return {String}
			 */
			getSortColumn: function () {
				return this.sort.column || null;
			},
			/**
			 * Get sort direction function
			 * @return {String}
			 */
			getSortDir: function () {
				return this.sort.dir || null;
			},
			/**
			 * Filter setter function
			 * @param {Object} filter
			 */
			setFilter: function (filter) {
				this.filter = filter;
				this.triggerEvent('onFilter');
			},
			/**
			 * Filter getter function
			 * @return {Object}
			 */
			getFilter: function () {
				return this.filter;
			},
			/**
			 * Set filter function
			 * @param {String} column
			 * @param {String} value
			 */
			setFilterBy: function () {
				var self = this;
				if (this.filterTimeoutId) {
					
				} else {
					this.filterTimeoutId = $interval(function () {
						self.updateParams();
						self.triggerEvent('onFilter');
						self.update();
					}, this.filterTimeout);
				}
			},
			/**
			 * Get filter column function
			 */
			getFilterColumn: function (/*column*/) {
			},
			/**
			 * Get filter column value function
			 */
			getFilterColumnValue: function (column) {
				return this.filter[column] || null;
			},
			/**
			 * Set params function
			 * @param {Object} params
			 */
			setParams: function (params) {
				if (params.viewBy) {
					this.viewBy = params.viewBy;
				}
				if (params.pager) {
					this.pager.current = params.pager.current;
					this.pager.total = params.pager.total;
				}
				if (params.sort) {
					this.sort.column = params.sort.column;
					this.sort.dir = params.sort.dir;
				}
				this.update();
			},
			/**
			 * Get params function
			 * @return {Object}
			 */
			getParams: function () {
				return this.params;
			},
			/**
			 * Update params function
			 */
			updateParams: function () {
				this.params = {};
				if (this.sort.column) {
					this.params.sort = (this.sort.dir == 'asc' ? '' : '-') + (this.sort.column ? this.sort.column : '');
				}
				this.params.page = this.pager.current + 1;
				this.params.perPage = this.viewBy;
				this.params = angular.extend(this.params, this.filter);
				this.triggerEvent('onParams');
			},
			/**
			 * Sync data function
			 */
			update: function () {
				if (this.filterTimeoutId) {
					$interval.cancel(this.filterTimeoutId);
					this.filterTimeoutId = null;
				}
				this.setItems($parse($scope.$grid.ngModelVar)($scope));
			},
			/**
			 * Add event listener function
			 * @param {String} event
			 * @param {Function} callback
			 */
			addEvent: function (event, callback) {
				if (!event && !callback) {
					return;
				}
				if (this.events[event] === null) {
					this.events[event] = callback;
				}
			},
			/**
			 * Trigger event function
			 * @param {String} event
			 * @param {Object} params
			 */
			triggerEvent: function (event, params) {
				if (!event) {
					return;
				}
				this[event](params);
			},
			/**
			 * Remove event listener function
			 * @param {String} event
			 */
			removeEvent: function (event) {
				if (!event) {
					return;
				}
				if (this.events[event]) {
					this.events[event] = null;
				}
			},
			/**
			 * Columns update event function
			 */
			onColumnsUpdate: function () {
				if (this.events.onColumnsUpdate !== null && angular.isFunction(this.events.onColumnsUpdate)) {
					this.events.onColumnsUpdate(this.columns);
				}
			},
			/**
			 * Items update event function
			 */
			onItemsUpdate: function () {
				if (this.events.onItemsUpdate !== null && angular.isFunction(this.events.onItemsUpdate)) {
					this.events.onItemsUpdate(this.items);
				}
			},
			/**
			 * Item click event function
			 */
			onItemClick: function () {
				if (this.events.onItemClick !== null && angular.isFunction(this.events.onItemClick)) {
					this.events.onItemClick(this.selected);
				}
			},
			/**
			 * Item dbl click function
			 */
			onItemDblClick: function () {
				if (this.events.onItemDblClick !== null && angular.isFunction(this.events.onItemDblClick)) {
					this.events.onItemDblClick(this.selected);
				}
			},
			/**
			 * Item select event function
			 */
			onSelect: function () {
				if (this.events.onSelect !== null && angular.isFunction(this.events.onSelect)) {
					this.events.onSelect(this.selected);
				}
			},
			/**
			 * View by event function
			 */
			onViewBy: function () {
				if (this.events.onViewBy !== null && angular.isFunction(this.events.onViewBy)) {
					this.events.onViewBy(this.viewBy);
				}
			},
			/**
			 * Page event function
			 */
			onPage: function () {
				if (this.events.onPage !== null && angular.isFunction(this.events.onPage)) {
					this.events.onPage(this.pager);
				}
			},
			/**
			 * Sort event function
			 */
			onSort: function () {
				if (this.events.onSort !== null && angular.isFunction(this.events.onSort)) {
					this.events.onSort(this.sort);
				}
			},
			/**
			 * Filter event function
			 */
			onFilter: function () {
				if (this.events.onFilter !== null && angular.isFunction(this.events.onFilter)) {
					this.events.onFilter(this.filter);
				}
			},
			/**
			 * Params event function
			 */
			onParams: function () {
				if (this.events.onParams !== null && angular.isFunction(this.events.onParams)) {
					this.events.onParams(this.params);
				}
			},
			/**
			 * Update event function
			 */
			onUpdate: function () {
				if (this.events.onUpdate !== null && angular.isFunction(this.events.onUpdate)) {
					this.events.onUpdate(this.items, this.columns, this.pager, this.viewBy, this.sort, this.filter);
				}	
			},
			/**
			 * Error event function
			 */
			onError: function () {
				if (this.events.onError !== null && angular.isFunction(this.events.onError)) {
					this.events.onError(this.errors);
				}
			}
		};
		/**
		 * Init function
		 */
		ctrl.init = function (element, attrs) {
			if (attrs.settings) {
				
			}
			if (attrs.debug) {
				$scope.$grid.debug = attrs.debug;
			}
			if (attrs.remote) {
				$scope.$grid.remote = $parse(attrs.remote)($scope);
			}
			if (attrs.ngModel) {
				$scope.$grid.ngModelVar = attrs.ngModel;
			}
			if (attrs.rowNumbers) {
				$scope.$grid.rowNumbers = attrs.rowNumbers;
			}
			if (attrs.filters) {
				$scope.$grid.filters = $parse(attrs.filters)($scope);
			}
			if (attrs.actions) {
				$scope.$grid.itemActions = $parse(attrs.actions)($scope);
			}
			if (attrs.text) {
				var text = $parse(attrs.text)($scope);
				$scope.$grid.text = angular.extend($scope.$grid.defaults.text, text);
			} else {
				$scope.$grid.text = $scope.$grid.defaults.text;
			}
			for (var eventName in $scope.$grid.events) {
				if (attrs[eventName] && $scope.$grid.events[eventName] === null) {
					var fn = $parse(attrs[eventName])($scope);
					if (fn && angular.isFunction(fn)) {
						$scope.$grid.events[eventName] = fn;
					}
				}
			}
		};
		/**
		 * Load settings function
		 */
		ctrl.loadSetting = function () {
			
		};
		/**
		 * Render template function
		 * @param {Object} element
		 * @param {Object} attrs
		 * @return {Object}
		 */
		ctrl.renderTpl = function (element, attrs) {
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
			return element;
		};
		/**
		 * Render toolbar function
		 * @param {Object} element
		 * @return {Object}
		 */
		ctrl.renderToolbar = function (element) {
			var toolbar = angular.element(document.createElement('div'));
			toolbar.addClass('grid-table-toolbar');
			toolbar.attr({
				'grid-table-toolbar': ''
			});
			element.find('.grid-table-wrapper').append(toolbar);
			return element;
		};
		/**
		 * Render table function
		 * @param {Object} element
		 * @return {Object}
		 */
		ctrl.renderTable = function (element) {
			if (element.find('table').length > 0) {
				return element;
			}
			var table = angular.element(document.createElement('table'));
			table.addClass('grid-table-table');
			table.attr({
				'ng-class': "{'loading': $grid.loading !== false}"
			});
			element.find('.grid-table-wrapper').append(table);
			return element;
		};
		/**
		 * Render header function
		 * @param {Object} element
		 * @return {Object}
		 */
		ctrl.renderHeader = function (element) {
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
			element = this.renderTable(element);
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
			var items = angular.element(document.createElement('tbody'));
			items.attr({
				'grid-table-items': ''
			});
			items.addClass('grid-table-items');
			element = this.renderTable(element);
			element.find('table').append(items);
			return element;
		};
		/**
		 * Render footer function
		 * @param {Object} element
		 * @return {Object}
		 */
		ctrl.renderFooter = function (element) {
			var footer = angular.element(document.createElement('tfoot'));
			footer.attr({
				'grid-table-footer': ''
			});
			footer.addClass('grid-table-footer');
			element = this.renderTable(element);
			element.find('table').append(footer);
			return element;
		};
		/**
		 * Compile template function
		 * @param {Object} scope
		 * @param {Object} element
		 */
		ctrl.compileTpl = function (scope, element) {
			$compile(element.contents())(scope);
		};
		/**
		 * Setter function
		 * @param {String} key
		 * @param {Object} value
		 */
		ctrl.set = function (key, value) {
			var setter = 'set',
				fnName = setter + key.substr(0, 1).toUpperCase() + key.substr(1);
			if (ctrl[key]) {
				if (angular.isFunction(ctrl[key])) {
					ctrl[key](value);
				} else {
					ctrl[key] = value;
				}
			} else if (ctrl[fnName]) {
				if (angular.isFunction(ctrl[fnName])) {
					ctrl[fnName](value);
				}
			}
		};
		/**
		 * Getter function
		 * @param {String} key
		 * @return {Object}
		 */
		ctrl.get = function (key) {
			var getter = 'get',
				fnName = getter + key.substr(0, 1).toUpperCase() + key.substr(1);
			if (ctrl[key]) {
				if (angular.isFunction(ctrl[key])) {
					return ctrl[key];
				} else {
					return ctrl[key];
				}
			} else if (ctrl[fnName]) {
				if (angular.isFunction(ctrl[fnName])) {
					return ctrl[fnName]();
				}
			}
		};
		/**
		 * Set loading status function
		 * @param {Boolean} status
		 */
		ctrl.setLoading = function (status) {
			$scope.$grid.loading = status ? true : false;
		};
		/**
		 * Columns setter function
		 * @param {Array|Object} columns
		 */
		ctrl.setColumns = function (columns) {
			$scope.$grid.setColumns(columns);
		};
		/**
		 * Columns setter function
		 * @param {Object} item
		 */
		ctrl.setColumnsByModel = function (item) {
			$scope.$grid.setColumnsByModel(item);
		};
		/**
		 * Columns getter function
		 * @return {Array}
		 */
		ctrl.getColumns = function () {
			return $scope.$grid.getColumns() || [];
		};
		/**
		 * Items setter function
		 * @param {Array} items
		 */
		ctrl.setItems = function (items) {
			$scope.$grid.setItems(items);
		};
		/**
		 * Items getter function
		 * @return {Array}
		 */
		ctrl.getItems = function () {
			return $scope.$grid.getItems();
		};
		/**
		 * Pager setter function
		 * @param {Object} pager
		 */
		ctrl.setPager = function (pager) {
			$scope.$grid.pager = pager;
		};
		/**
		 * Pager getter function
		 * @return {Object}
		 */
		ctrl.getPager = function () {
			return $scope.$grid.pager;
		};
		/**
		 * View by setter function
		 * @param {Number} viewBy
		 */
		ctrl.setViewBy = function (viewBy) {
			$scope.$grid.viewBy = viewBy;
		};
		/**
		 * View by getter function
		 * @return {Number}
		 */
		ctrl.getViewBy = function () {
			return $scope.$grid.viewBy;
		};
		/**
		 * Sort setter function
		 * @param {Object} sort
		 */
		ctrl.setSort = function (sort) {
			$scope.$grid.sort = sort;
		};
		/**
		 * Sort getter function
		 * @return {Object}
		 */
		ctrl.getSort = function () {
			return $scope.$grid.sort;
		};
		/**
		 * Filter setter function
		 * @param {Object} filter
		 */
		ctrl.setFilter = function (filter) {
			$scope.$grid.filter = filter;
		};
		/**
		 * Filter getter function
		 * @return {Object}
		 */
		ctrl.getFilter = function () {
			return $scope.$grid.filter;
		};
		/**
		 * Params setter function
		 * @param {Object} params
		 */
		ctrl.setParams = function (params) {
			$scope.$grid.setParams(params);
		};
		/**
		 * Params getter function
		 * @return {Object}
		 */
		ctrl.getParams = function () {
			return $scope.$grid.params;
		};
	}
]);
/**
 * Factory gridTableColumn
 */
grid.factory('gridTableColumn', [
	function () {
		return {
			
		};
	}
]);
/**
 * Factory gridTablePager
 */
grid.factory('gridTablePager', [
	function () {
		return {
			createItems: function (current, viewBy, itemsTotal, viewCount) {
				if (itemsTotal && itemsTotal <= 0) {
					return [];
				}
				var items = [],
					pagesCount = Math.ceil(itemsTotal / viewBy),
					start = 0,
					end = 0;
				if (pagesCount > 5 && current > 0) {
					items.push({
						label: '<<',
						index: 0,
						disable: current <= 0
					});
					items.push({
						label: '<',
						index: current <= 0 ? 0 : current - 1,
						disable: current === 0
					});
				}
				if (current < 3) {
					start = 0;
					end = 5;
				}
				if (current > pagesCount - 1) {
					start = current - 2;
					end = start + 5;
				}
				if (current > pagesCount - 4) {
					start = pagesCount - 5;
					end = pagesCount;
				}
				if (current < pagesCount - 2 && current > 2) {
					start = current - 2;
					end = current + 3;
				}
				if (pagesCount < 5) {
					start = 0;
					end = pagesCount;
				}
				if (pagesCount <= 1) {
					start = end = 0;
				}
				for (var i = start; i < end; i++) {
					items.push({
						label: i + 1,
						index: i
					});
				}
				if (pagesCount > 5 && current < pagesCount - 1) {
					items.push({
						label: '>',
						index: current < pagesCount - 1 ? current + 1 : current,
						disable: current == pagesCount - 1
					});
					items.push({
						label: '>>',
						index: pagesCount - 1,
						disable: current == pagesCount - 1
					});
				}
				return items;
			}
		};
	}
]);
/**
 * Factory gridTableRemote
 */
grid.factory('gridTableRemote', [
	'$q',
	'$http',
	'$parse',
	function ($q, $http, $parse) {
		var settings = {
			url: '',
			method: 'get',
			data: null,
			resultVar: 'data.data'
		};
		return {
			/**
			 * Set
			 * @param {Array|Object} items
			 */
			set: function (items) {
				// TODO add save method
			},
			/**
			 * Get
			 * @param {Object} data
			 * @return {Object}
			 */
			get: function (data) {
				return $q(function (resolve, reject) {
					$http({
						url: settings.url,
						method: settings.method.toUpperCase,
						data: data
					}).then(function (res) {
						resolve(res.data);
					}, function (res) {
						resolve(res.data);
					});
				});
			},
			/**
			 * Sync
			 * @param {Array|Object} items
			 */
			sync: function (items) {
				// TODO add sync editing method
			}
		};
	}
]);
/**
 * Factory gridTableSettings
 */
grid.factory('gridTableSettings', [
	function () {
		var defaults = {
			template: '{toolbar}{header}{items}{footer}',
				sorted: false,
				multiSort: false,
				sortParams: {
					asc: 'asc',
					desc: 'desc'
				},
				pageParams: {
					page: 'page',
					perPage: 'per-page'
				},
				filtered: false,
				filterTimeout: 500,
				multiSelect: false,
				viewByList: [10, 25, 50],
				text: {
					viewBy: 'View by: ',
					numbers: '#',
					actions: 'Actions',
					asc: '⇣',
					desc: '⇡',
					empty: 'Empty',
					total: 'Total: '
				}
		};
		return {
			get: function () {
				return defaults;
			},
			extend: function (settings) {
				return angular.extend(defaults, settings);
			}
		};
	}
]);
/**
 * Filter gridTableFormatter
 */
grid.filter('gridTableFormatter', [
	'gridTableConfig',
	function (config) {
		var types = {
				'boolean': '',
				'integer': '',
				'string': '',
				'currency': '',
				'date': '',
				'datetime': '',
				'html': ''
			},
			formatters = {
				'boolean': function (input) {
					return (input == 1 || input == 'true' || input === true) ? config.formatters.boolean['true'] : config.formatters.boolean['false'];
				},
				'integer': function (input) {
					return input;
				},
				'string': function (input) {
					return input;
				},
				'currency': function (input) {
					input += '';
					if (input.indexOf('.') === -1) {
						input += '.00';
					}
					return input;
				},
				'date': function (input) {
					var exp = /([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/;
					input += '';
					if (exp.test(input)) {
						input = input.replace(exp, '$3.$2.$1');
					}
					return input;
				},
				'datetime': function (input) {
					var exp = /([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})\s(([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}))(.*)/;
					input += '';
					if (exp.test(input)) {
						input = input.replace(exp, '$3.$2.$1 $4');
					}
					return input;
				},
				'html': function (input) {
					return input;
				}
			};
		return function (input, type, format) {
			if (input === undefined || input === null) {
				return input;
			}
			if (formatters[type] && angular.isFunction(formatters[type])) {
				input = formatters[type](input, format);
			}
			return input;
		};
	}
]);
/**
 * Directive gridTableColumns
 */
grid.directive('gridTableColumns', [
	'gridTableConfig',
	function (config) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-columns.html';
			}
		};
	}
]);
/**
 * Directive gridTableFooter
 */
grid.directive('gridTableFooter', [
	'gridTableConfig',
	function (config) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-footer.html';
			}
		};
	}
]);
/**
 * Directive gridTableHeader
 */
grid.directive('gridTableHeader', [
	'gridTableConfig',
	function (config) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-header.html';
			}
		};
	}
]);
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
/**
 * Directive gridTableItems
 */
grid.directive('gridTableItems', [
	'gridTableConfig',
	function (config) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-items.html';
			}
		};
	}
]);
/**
 * Directive gridTableToolbar
 */
grid.directive('gridTableToolbar', [
	'gridTableConfig',
	function (config) {
		return {
			restrict: 'EA',
			require: '^gridTable',
			templateUrl: function () {
				return config.tplUrl + 'grid-table-toolbar.html';
			}
		};
	}
]);
/**
 * Directive gridTable
 */
grid.directive('gridTable', [
	'$parse',
	'gridTableConfig',
	function ($parse, config) {
		return {
			restrict: 'EA',
			require: ['^gridTable', '^ngModel'],
			templateUrl: function () {
				return config.tplUrl + 'grid-table.html';
			},
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
					if (attrs.loading) {
						scope.$watch(attrs.loading, function (newValue, oldValue) {
							if (angular.equals(newValue, oldValue)) {
								return;
							}
							$grid.setLoading(newValue);
						});
					}
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
grid.run(["$templateCache", function($templateCache) {
$templateCache.put("grid-table-columns.html","<col ng-repeat=\"column in $grid.getShowColumns()\" class=\"{{\'grid-table-column-\' + column.columnType}}\">");
$templateCache.put("grid-table-footer.html","<tr><td colspan=\"{{$grid.columnsCount}}\">{{$grid.text.total}}{{$grid.itemsCount}}</td></tr>");
$templateCache.put("grid-table-header.html","<tr class=\"grid-table-headers\"><th ng-repeat=\"column in $grid.getShowColumns()\" ng-class=\"{\'sorted\': column.name === $grid.getSortColumn()}\"><span ng-if=\"column.columnType === \'data\'\"><a ng-click=\"$grid.setSortBy(column.name, null, $event)\" href=\"#\">{{column.label}} <i>{{column.name === $grid.getSortColumn() ? ($grid.getSortDir() === \'asc\' ? $grid.text.asc : $grid.text.desc) : \'\'}}</i></a></span> <span ng-if=\"column.columnType === \'checkbox\'\">{{$grid.text.checkbox}}</span> <span ng-if=\"column.columnType === \'numbers\'\">{{$grid.text.numbers}}</span> <span ng-if=\"column.columnType === \'actions\'\">{{$grid.text.actions}}</span></th></tr><tr class=\"grid-table-filter\"><td ng-repeat=\"column in $grid.getShowColumns()\"><span ng-if=\"column.columnType === \'data\'\"><span ng-if=\"$grid.filters[column.name]\"><span ng-if=\"$grid.filters[column.name].name\"><select ng-model=\"$grid.filter[$grid.filters[column.name].name]\" ng-change=\"$grid.setFilterBy()\"><option value=\"\"></option><option ng-repeat=\"val in $grid.filters[column.name].values\" value=\"{{val[$grid.filters[column.name].value]}}\">{{val[$grid.filters[column.name].label]}}</option></select></span> <span ng-if=\"!$grid.filters[column.name].name\"><select ng-model=\"$grid.filter[column.name]\" ng-change=\"$grid.setFilterBy()\"><option value=\"\"></option><option ng-repeat=\"val in $grid.filters[column.name].values\" value=\"{{val[$grid.filters[column.name].value]}}\">{{val[$grid.filters[column.name].label]}}</option></select></span></span> <span ng-if=\"!$grid.filters[column.name]\"><input ng-model=\"$grid.filter[column.name]\" ng-change=\"$grid.setFilterBy()\"></span></span></td></tr>");
$templateCache.put("grid-table-items.html","<tr ng-init=\"itemsIndex = $index + 1\" ng-repeat=\"item in $grid.getItems()\" ng-click=\"$grid.selectable ? $grid.selectItem(item) : return\" ng-class=\"{\'selectable\': $grid.selectable, \'active\': $grid.isSelectedItem(item)}\" class=\"grid-table-item\"><td ng-repeat=\"column in $grid.getShowColumns()\"><span ng-if=\"column.columnType == \'checkbox\'\"><input ng-click=\"$grid.selectItem(item)\" ng-checked=\"$grid.isSelected(item)\" type=\"checkbox\"></span> {{column.columnType == \'numbers\' ? itemsIndex : \'\'}} {{$grid.getValue(item, column.name) | gridTableFormatter:column.type}} <span ng-if=\"column.columnType == \'actions\' && $grid.itemActions\"><span ng-repeat=\"action in $grid.itemActions\" ng-click=\"$grid.callItemAction(action.fn, item, $event)\">{{action.text}} <span grid-table-item-action=\"\" html=\"action.html\"></span></span></span></td></tr><tr><td ng-show=\"$grid.itemsCount <= 0\" colspan=\"{{$grid.columnsCount}}\">{{$grid.text.empty}}</td></tr>");
$templateCache.put("grid-table-toolbar.html","<div class=\"grid-table-pager\"><ul class=\"pager\"><li ng-repeat=\"page in $grid.pager.items\" ng-click=\"$grid.setPage(page.index, $event)\" ng-class=\"{\'active\': page.index == $grid.getPage()}\" ng-disabled=\"page.disable\"><a href=\"#\">{{page.label}}</a></li></ul></div><div class=\"grid-table-view-by\"><span class=\"view-by-label\">{{$grid.text.viewBy}}</span><ul class=\"view-by\"><li ng-repeat=\"item in $grid.viewByList\" ng-click=\"$grid.setViewBy(item, $event)\" ng-class=\"{\'active\': item == $grid.viewBy}\"><a href=\"#\">{{item}}</a></li></ul></div><div class=\"grid-table-clear\"></div>");
$templateCache.put("grid-table.html","<div class=\"grid-table-wrapper\"></div>");
}]);
}());