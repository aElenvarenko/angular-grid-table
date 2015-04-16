grid.run(["$templateCache", function($templateCache) {
$templateCache.put("grid-table-columns.html","<col ng-repeat=\"column in $grid.getShowColumns()\" class=\"{{\'grid-table-column-\' + column.columnType}}\">");
$templateCache.put("grid-table-footer.html","<tr><td colspan=\"{{$grid.columnsCount}}\">Total: {{$grid.itemsCount}}</td></tr>");
$templateCache.put("grid-table-header.html","<tr class=\"grid-table-headers\"><th ng-class=\"{\'sorted\': column.name === $grid.getSortColumn()}\" ng-repeat=\"column in $grid.getShowColumns()\"><span ng-if=\"column.columnType === \'data\'\"><a ng-click=\"$grid.setSortBy(column.name, null, $event)\" href=\"#\">{{column.label}} <i>{{column.name === $grid.getSortColumn() ? ($grid.getSortDir() === \'asc\' ? $grid.text.asc : $grid.text.desc) : \'\'}}</i></a></span> <span ng-if=\"column.columnType === \'numbers\'\">{{$grid.text.numbers}}</span> <span ng-if=\"column.columnType === \'actions\'\">{{$grid.text.actions}}</span></th></tr><tr class=\"grid-table-filter\"><td ng-repeat=\"column in $grid.getShowColumns()\"><span ng-if=\"column.columnType === \'data\'\"><span ng-if=\"$grid.filters[column.name]\"><select ng-change=\"$grid.setFilterBy()\" ng-model=\"$grid.filter[column.name]\"><option value=\"\"></option><option ng-repeat=\"val in $grid.filters[column.name].values\" value=\"{{val[$grid.filters[column.name].value]}}\">{{val[$grid.filters[column.name].label]}}</option></select></span> <span ng-if=\"!$grid.filters[column.name]\"><input ng-change=\"$grid.setFilterBy()\" ng-model=\"$grid.filter[column.name]\"></span></span></td></tr>");
$templateCache.put("grid-table-items.html","<tr ng-click=\"$grid.selectItem(item)\" ng-class=\"{\'active\': $grid.isSelectedItem(item)}\" ng-repeat=\"item in $grid.getItems()\" ng-init=\"itemsIndex = $index + 1\" class=\"grid-table-item\"><td ng-repeat=\"column in $grid.getShowColumns()\">{{column.columnType == \'numbers\' ? itemsIndex : \'\'}}{{item[column.name]}} <span ng-if=\"column.columnType == \'actions\' && $grid.itemActions\"><span ng-click=\"$grid.callItemAction(action.fn, item, $event)\" ng-repeat=\"action in $grid.itemActions\" href=\"#\">{{action.text}} <span grid-table-item-action=\"\" html=\"action.html\"></span></span></span></td></tr><tr><td ng-show=\"$grid.itemsCount <= 0\" colspan=\"{{$grid.columnsCount}}\">{{$grid.text.empty}}</td></tr>");
$templateCache.put("grid-table-toolbar.html","<div class=\"grid-table-pager\"><ul class=\"pager\"><li ng-click=\"$grid.setPage(page.index, $event)\" ng-class=\"{\'active\': page.index == $grid.getPage()}\" ng-disabled=\"page.disable\" ng-repeat=\"page in $grid.pager.items\"><a href=\"#\">{{page.label}}</a></li></ul></div><div class=\"grid-table-view-by\"><span class=\"view-by-label\">View by:</span><ul class=\"view-by\"><li ng-click=\"$grid.setViewBy(item, $event)\" ng-class=\"{\'active\': item == $grid.viewBy}\" ng-repeat=\"item in $grid.viewByList\"><a href=\"#\">{{item}}</a></li></ul></div><div class=\"grid-table-clear\"></div>");
$templateCache.put("grid-table.html","<div class=\"grid-table-wrapper\"></div>");
}]);