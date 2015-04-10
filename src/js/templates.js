grid.run(["$templateCache", function($templateCache) {
$templateCache.put("grid-table-column.html","<td></td>");
$templateCache.put("grid-table-columns.html","<col ng-repeat=\"column in $grid.getShowColumns()\" class=\"{{\'grid-table-column-\' + column.columnType}}\">");
$templateCache.put("grid-table-footer.html","<tr><td></td></tr>");
$templateCache.put("grid-table-header.html","<tr><th ng-repeat=\"column in $grid.getShowColumns()\">{{column.label}}</th></tr>");
$templateCache.put("grid-table-items.html","<tr ng-click=\"$grid.selectItem(item)\" ng-class=\"{\'active\': $grid.isSelectedItem(item)}\" ng-repeat=\"item in $grid.getItems()\" ng-init=\"itemsIndex = $index + 1\"><td ng-repeat=\"column in $grid.getShowColumns()\">{{column.columnType == \'numbers\' ? itemsIndex : \'\'}}{{item[column.name]}}</td></tr>");
$templateCache.put("grid-table.html","<table class=\"grid-table-table\"></table>");
}]);