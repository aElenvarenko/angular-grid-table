/**
 * Factory gridTableSettings
 */
grid.factory('gridTableSettings', [
	function () {
		var defaults = {};
		return {
			create: function (settings) {
				return angular.extend(defaults, settings);
			}
		};
	}
]);