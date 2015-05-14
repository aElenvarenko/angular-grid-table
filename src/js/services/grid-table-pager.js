/**
 * Factory gridTablePager
 */
grid.factory('gridTablePager', [
	'gridTableGlobals',
	function (cGlobals) {
		return {
			createItems: function (current, viewBy, itemsTotal, viewCount) {
				if (itemsTotal && itemsTotal <= 0) {
					return [];
				}
				var items = [],
					pagesCount = Math.ceil(itemsTotal / viewBy),
					step,
					start = 0,
					end = 0;
				viewCount = viewCount || cGlobals.pager.pagesMaxCount;
				if (viewCount % 2 === 0) {
					viewCount++;
				}
				step = Math.round(viewCount / 2);
				if (pagesCount > viewCount && current > 0) {
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
				if ((current + 1) <= step) {
					start = 0;
					end = viewCount;
				}
				if (current > pagesCount - 1) {
					start = current - step;
					end = start + viewCount;
				}
				if ((current + 1) > pagesCount - step) {
					start = pagesCount - viewCount;
					end = pagesCount;
				}
				if ((current + 1) < (pagesCount - step + 1) && (current + 1) > step) {
					start = (current + 1) - step;
					end = current + step;
				}
				if (pagesCount < viewCount) {
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
				if (pagesCount > viewCount && current < pagesCount - 1) {
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