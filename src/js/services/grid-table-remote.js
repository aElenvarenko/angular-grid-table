/**
 * Factory gridTableRemote
 */
grid.factory('gridTableRemote', [
	'$q',
	'$http',
	'$parse',
	function ($q, $http/*, $parse*/) {
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
			set: function (/*items*/) {
				// TODO add save method
			},
			/**
			 * Get
			 * @param {Object} data
			 * @return {Object}
			 */
			get: function (data) {
				return $q(function (resolve/*, reject*/) {
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
			sync: function (/*items*/) {
				// TODO add sync editing method
			}
		};
	}
]);