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