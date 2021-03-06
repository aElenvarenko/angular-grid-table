/**
 * Controller gridTableCtrl
 */
grid.controller('gridTableCtrl', [
	'$scope',
	'$compile',
	'$parse',
	'$filter',
	'$interval',
	'gridTableGlobals',
	'gridTableSettings',
	'gridTablePager',
	function ($scope, $compile, $parse, $filter, $interval, cGlobals, fSettings, fPager) {
		var ctrl = this;
		$scope.$grid = {
			/* Variables */
			/* Enable or disable debug mode */
			debug: false,
			/* Remote data store */
			remote: false,
			/* Template */
			template: null,
			/* Text */
			text: {},
			/* Loading status */
			loading: false,
			/* ngModel variable */
			ngModelVar: '',
			/* Show or hide row numbers column */
			rowNumbers: false,
			/* Show or hide checkbox column */
			checkboxes: false,
			/* Columns */
			columns: [],
			/* Columns count */
			columnsCount: 0,
			/* Hidden columns */
			hiddenColumns: [],
			/* Link columns */
			linkColumns: [],
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
			/* Filter timeout in milliseconds */
			filterTimeout: 500,
			/* View by count */
			viewBy: 10,
			/* View by list */
			viewByList: [10, 25, 50],
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
				/* Pages max view count */
				pagesMaxCount: null,
				/* Pager items */
				items: []
			},
			/* Enable or disable select item */
			selectable: true,
			/* Enable or disable multi items select */
			multiSelect: false,
			/* Selected item or items */
			selected: null,
			/* Items */
			items: [],
			/* Items count */
			itemsCount: 0,
			/* Items actions */
			itemActions: null,
			/* Items actions show expression */
			itemActionsExp: null,
			/* Items actions column width */
			itemActionsWidth: null,
			/* Request params */
			params: {},
			/* Request params variables */
			paramsVars: {},
			/* Errors */
			errors: null,
			/* Supported events */
			events: [
				/* On current page update */
				'onPage',
				/* On view by update */
				'onViewBy',
				/* On sort update */
				'onSort',
				/* On filter update */
				'onFilter',
				/* On row click */
				'onRowClick',
				/* On row dbl click */
				'onRowDblClick',
				/* On row column click */
				'onRowColumnClick',
				/* On select update */
				'onSelect',
				/* On params update */
				'onParams',
				/* On columns update */
				'onColumnsUpdate',
				/* On items update */
				'onItemsUpdate',
				/* On update */
				'onUpdate',
				/* On error */
				'onError'
			],
			/* Event listeners */
			listeners: {},
			/* Methods */
			/**
			 * Generate id function
			 * @param {String} name
			 * @return {String}
			 */
			genId: function (name) {
				return name.replace(/\.|_/g, '-');
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
						for (prop in columns) {
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
						columnType: 'actions',
						width: this.itemActionsWidth ? this.itemActionsWidth : null
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
			 * @return {Array}
			 */
			getColumns: function () {
				return this.columns || [];
			},
			/**
			 * Check column is hidden function
			 * @param {String} name
			 * @return {Boolean}
			 */
			isColumnHidden: function (name) {
				return this.hiddenColumns.indexOf(name) !== -1;
			},
			/**
			 * Check column is linked function
			 * @param {String} name
			 * @return {Boolean}
			 */
			isLinkColumn: function (name) {
				return this.linkColumns.indexOf(name) !== -1;
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
					if (!this.isColumnHidden(name)) {
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
				var columns = [],
					i;

				for (i in this.columns) {
					if (!this.isColumnHidden(this.columns[i].name) || this.columns[i].columnType !== 'data') {
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

				this.pager.items = fPager.createItems(this.pager.current, this.viewBy, this.pager.total, this.pager.pagesMaxCount);

				if (!this.remote) {
					this.items = items.slice(this.pager.current * this.viewBy, (this.pager.current + 1) * this.viewBy);
				} else {
					this.items = items;
				}

				this.itemsCount = this.items.length || 0;

				if (!this.remote) {
					this.loading = false;
				}

				this.triggerEvent('onItemsUpdate');
			},
			/**
			 * Items getter function
			 * @return {Array}
			 */
			getItems: function () {
				return this.items || [];
			},
			/**
			 * Row click event handler function
			 * @param {Object} item
			 * @param {Object} event
			 */
			rowClick: function (item, event) {
				event.preventDefault();
				event.stopPropagation();

				if (this.selectable) {
					this.itemSelect(item);
				}

				this.triggerEvent('onRowClick');
			},
			/**
			 * Row dbl click event handler function
			 * @param {Object} item
			 * @param {Object} event
			 */
			rowDblClick: function (item, event) {
				event.preventDefault();
				event.stopPropagation();

				this.triggerEvent('onRowDblClick');
			},
			/**
			 * Row column click event handler function
			 * @param {Object} item
			 * @param {Object} column
			 * @param {Object} event
			 */
			rowColumnClick: function (item, column, event) {
				this.triggerEvent('onRowColumnClick', [item, column]);
			},
			/**
			 * Check item is selected function
			 * @param {Object} item
			 * @return {Boolean}
			 */
			isItemSelected: function (item) {
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
			itemSelect: function (item) {
				if (!item) {
					this.selected = null;
					return;
				}

				var selected = this.isItemSelected(item);

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
			 *
			 * @param {Object} item
			 */
			itemActionsShow: function (item) {
				if (!this.itemActionsExp) {
					return true;
				}
				var value = true;

				try {
					value = eval(this.itemActionsExp);
				} catch (e) {
					value = false;
				}

				return value;
			},
			/**
			 * @param item
			 * @param action
			 */
			itemActionExp: function (item, action) {
				if (action.exp) {
					var result;

					try {
						result = eval(action.exp);
						return result;
					} catch (error) {
						return false;
					}
				} else {
					return true;
				}
			},
			/**
			 * Call item action function
			 * @param {Function} fn
			 * @param {Object} item
			 * @param {Object} event
			 */
			itemActionCall: function (fn, item, event) {
				event.preventDefault();
				event.stopPropagation();
				fn(item);
			},
			/**
			 * Refresh grid
			 * @param {Object} event
			 */
			refresh: function (event) {
				event.preventDefault();
				event.stopPropagation();

				this.updateParams();
				this.update();
			},
			/**
			 * Clear filter
			 * @param {Object} event
			 */
			clearFilter: function (event) {
				event.preventDefault();
				event.stopPropagation();

				this.setFilter({});
				this.updateParams();
				this.update();
			},
			/**
			 * Set current page function
			 * @param {Number} index
			 * @param {Object} event
			 */
			setPage: function (index, event) {
				event.preventDefault();
				event.stopPropagation();

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
				event.stopPropagation();

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
				event.stopPropagation();

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

				if (this.events.indexOf(event) !== -1) {
					if (this.listeners[event] === undefined) {
						this.listeners[event] = [];
					}

					if (this.listeners[event].indexOf(callback) === -1) {
						this.listeners[event].push(callback);
					}
				}
			},
			/**
			 * Trigger event function
			 * @param {String} event
			 * @param {Object} [params]
			 */
			triggerEvent: function (event, params) {
				if (!event) {
					return;
				}

				if (this.events.indexOf(event) !== -1) {
					this[event](params);
				}
			},
			/**
			 * Remove event listener function
			 * @param {String} event
			 */
			removeEvent: function (event) {
				if (!event) {
					return;
				}

				if (this.events[event] && this.listeners[event]) {
					this.listeners[event] = null;
				}
			},
			/* Listeners call */
			listenersCall: function (event, args) {
				if (this.listeners[event] !== null && angular.isArray(this.listeners[event])) {
					for (var i in this.listeners[event]) {
						var fn = this.listeners[event][i];

						if (angular.isFunction(fn)) {
							if (!angular.isArray(args)) {
								args = [args];
							}

							fn.apply(this, args);
						}
					}
				}
			},
			/**
			 * Columns update event function
			 */
			onColumnsUpdate: function () {
				if (this.debug) {
					console.info('grid-table: columns update event handler');
				}

				this.listenersCall('onColumnsUpdate', this.columns);
			},
			/**
			 * Items update event function
			 */
			onItemsUpdate: function () {
				if (this.debug) {
					console.info('grid-table: items update event handler');
				}

				this.listenersCall('onItemsUpdate', this.items);
			},
			/**
			 * Row click event function
			 */
			onRowClick: function () {
				if (this.debug) {
					console.info('grid-table: row click event handler');
				}

				this.listenersCall('onRowClick', this.selected);
			},
			/**
			 * Row dbl click function
			 */
			onRowDblClick: function () {
				if (this.debug) {
					console.info('grid-table: row dbl click event handler');
				}

				this.listenersCall('onItemDblClick', this.selected);
			},
			/**
			 * Row column click function
			 */
			onRowColumnClick: function (params) {
				if (this.debug) {
					console.info('grid-table: row column click event handler');
				}

				this.listenersCall('onRowColumnClick', params);
			},
			/**
			 * Item select event function
			 */
			onSelect: function () {
				if (this.debug) {
					console.info('grid-table: item select event handler');
				}

				this.listenersCall('onSelect', this.selected);
			},
			/**
			 * View by event function
			 */
			onViewBy: function () {
				if (this.debug) {
					console.info('grid-table: view by count event handler');
				}

				this.listenersCall('onViewBy', this.viewBy);
			},
			/**
			 * Page event function
			 */
			onPage: function () {
				if (this.debug) {
					console.info('grid-table: page update event handler');
				}

				this.listenersCall('onPage', this.pager);
			},
			/**
			 * Sort event function
			 */
			onSort: function () {
				if (this.debug) {
					console.info('grid-table: sort update event handler');
				}

				this.listenersCall('onSort', this.sort);
			},
			/**
			 * Filter event function
			 */
			onFilter: function () {
				if (this.debug) {
					console.info('grid-table: filter update handler');
				}

				this.listenersCall('onFilter', this.filter);
			},
			/**
			 * Params event function
			 */
			onParams: function () {
				if (this.debug) {
					console.info('grid-table: params update event handler');
				}

				this.listenersCall('onParams', this.params);
			},
			/**
			 * Update event function
			 */
			onUpdate: function () {
				if (this.debug) {
					console.info('grid-table: update event handler');
				}

				this.listenersCall('onUpdate', [this.items, this.columns, this.pager, this.viewBy, this.sort, this.filter]);
			},
			/**
			 * Error event function
			 */
			onError: function () {
				if (this.debug) {
					console.info('grid-table: error event handler');
				}

				this.listenersCall('onError', this.errors);
			}
		};
		/**
		 * Init function
		 */
		ctrl.init = function (element, attrs) {
			var globals = cGlobals;
			/**/
			if (attrs.settings) {
				// TODO
			}
			/**/
			if (attrs.debug) {
				$scope.$grid.debug = attrs.debug;
			}
			/**/
			if (attrs.remote) {
				$scope.$grid.remote = $parse(attrs.remote)($scope);
			}
			/**/
			if (attrs.template) {
				$scope.$grid.template = $parse(attrs.template)($scope);
			} else {
				$scope.$grid.template = globals.template;
			}
			/**/
			if (attrs.text) {
				var text = $parse(attrs.text)($scope);
				$scope.$grid.text = angular.extend(globals.text, text);
			} else {
				$scope.$grid.text = globals.text;
			}
			/**/
			if (attrs.ngModel) {
				$scope.$grid.ngModelVar = attrs.ngModel;
			}
			/**/
			if (attrs.sorted) {
				$scope.$grid.sorted = attrs.sorted;
			}
			/**/
			if (attrs.rowNumbers) {
				$scope.$grid.rowNumbers = attrs.rowNumbers;
			}
			/**/
			if (attrs.checkboxes) {
				$scope.$grid.checkboxes = attrs.checkboxes;
			}
			/**/
			if (attrs.filtered) {
				$scope.$grid.filtered = attrs.filtered;
			}
			/**/
			if (attrs.filters) {
				$scope.$grid.filters = $parse(attrs.filters)($scope);
			}
			/**/
			if (attrs.selectable) {
				$scope.$grid.selectable = $parse(attrs.selectable)($scope);
			}
			/**/
			if (attrs.multiSelect) {
				$scope.$grid.multiSelect = $parse(attrs.multiSelect)($scope);
			}
			/**/
			if (attrs.linkColumns) {
				$scope.$grid.linkColumns = $parse(attrs.linkColumns)($scope);
			}
			/**/
			if (attrs.actions) {
				$scope.$grid.itemActions = $parse(attrs.actions)($scope);
			}
			/**/
			if (attrs.actionsExp) {
				$scope.$grid.itemActionsExp = attrs.actionsExp;
			}
			/**/
			if (attrs.actionsWidth) {
				$scope.$grid.itemActionsWidth = attrs.actionsWidth;
			}
			/**/
			if (attrs.pagesMaxCount) {
				$scope.$grid.pager.pagesMaxCount = parseInt(attrs.pagesMaxCount);
			}
			/**/
			for (var i in $scope.$grid.events) {
				var eventName = $scope.$grid.events[i];

				if (attrs[eventName]) {
					var fn = $parse(attrs[eventName])($scope);

					if (fn && angular.isFunction(fn)) {
						$scope.$grid.addEvent(eventName, fn);
					}
				}
			}
		};
		/**
		 * Load settings function
		 */
		ctrl.loadSetting = function () {
			// TODO
		};
		/**
		 * Parse settings function
		 */
		ctrl.parseSetting = function () {
			// TODO
		};
		/**
		 * Render template function
		 * @param {Object} element
		 * @param {Object} attrs
		 * @return {Object}
		 */
		ctrl.renderTpl = function (element, attrs) {
			var matches = $scope.$grid.template.match(/\{[a-z\:]+\}/g),
				i,
				fn,
				params;

			if (matches && matches.length > 0) {
				for (i in matches) {
					fn = matches[i].replace(/\{|\}/g, '');
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
		 * @param {String} [key]
		 * @param {Object} [value]
		 */
		ctrl.set = function () {
			if (!angular.isString(arguments[0])) {
				throw new Error('First argument must be a string');
			}

			var key = Array.prototype.splice.call(arguments, 0, 1) + '',
				setter = 'set',
				fnName = setter + key.substr(0, 1).toUpperCase() + key.substr(1);

			if (ctrl[fnName]) {
				if (angular.isFunction(ctrl[fnName])) {
					ctrl[fnName].apply(this, arguments);
				} else {
					throw new Error('Setter {' + fnName + '} must be a function');
				}
			} else if (ctrl[key] !== undefined) {
				if (angular.isFunction(ctrl[key])) {
					ctrl[key].apply(this, arguments);
				} else {
					ctrl[key] = arguments[0];
				}
			} else if ($scope.$grid[fnName]) {
				if (angular.isFunction($scope.$grid[fnName])) {
					$scope.$grid[fnName].apply($scope.$grid, arguments);
				} else {
					throw new Error('Setter {' + fnName + '} must be a function');
				}
			} else if ($scope.$grid[key] !== undefined) {
				if (angular.isFunction($scope.$grid[key])) {
					$scope.$grid[key].apply($scope.$grid, arguments);
				} else {
					$scope.$grid[key] = arguments[0];
				}
			} else {
				throw new Error('Can set undefined variable {' + key + '}');
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

			if (ctrl[fnName]) {
				if (angular.isFunction(ctrl[fnName])) {
					return ctrl[fnName]();
				} else {
					throw new Error('Getter {' + fnName + '} must be a function');
				}
			} else if (ctrl[key] !== undefined) {
				if (angular.isFunction(ctrl[key])) {
					return ctrl[key]();
				} else {
					return ctrl[key];
				}
			} else if ($scope.$grid[fnName]) {
				if (angular.isFunction($scope.$grid[fnName])) {
					return $scope.$grid[fnName]();
				} else {
					throw new Error('Getter {' + fnName + '} must be a function');
				}
			} else if ($scope.$grid[key] !== undefined) {
				if (angular.isFunction($scope.$grid[key])) {
					return $scope.$grid[key]();
				} else {
					return $scope.$grid[key];
				}
			} else {
				return undefined;
			}
		};
	}
]);