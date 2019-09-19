(function () {
	'use strict'
	angular
		.module('LoginsightUiApp.page.logSearch')
		.controller('logSearchMainContextCtrl', logSearchMainContextCtrl);

	logSearchMainContextCtrl.$inject = ['$scope', '$state', '$filter', '$timeout', 'urlParams', 'EsService', '$uibModalInstance'];

	function logSearchMainContextCtrl($scope, $state, $filter, $timeout, urlParams, EsService, $uibModalInstance) {
		var vm = this;
		vm._ = _;
		console.log("urlParams", urlParams);
		vm.urlParams = urlParams;
		vm.esContext = [];
		vm.cancel = cancel;
		vm.fullScreen = fullScreen;
		vm.keyup = keyup;
		var filterInput = {};
		var ofset = {};
		ofset.up = parseInt(urlParams.linenum) || 0;
		ofset.down = parseInt(urlParams.linenum) || 0;
		ofset.NUMBER = 100; // 默认上下翻页的时候 多少行数据
		filterInput.name = urlParams.event_name;
		vm.upLinenum = upLinenum;
		vm.downLinenum = downLinenum;


		// console.log("urlParams", urlParams);
		vm.params = {};
		vm.params['filename'] = urlParams.filename;
		vm.params['filepath'] = urlParams.filepath;
		vm.params['hostname'] = urlParams.hostname;
		// vm.params['filterInput'] = filterInput;
		vm.params['index'] = urlParams.index;
		vm.params['types'] = urlParams.type ? urlParams.type : [];
		// vm.params['linenum'] = urlParams.linenum;
		vm.params['upLinenum'] = ofset.up + ofset.NUMBER;
		vm.params['downLinenum'] = ofset.down - ofset.NUMBER;
		vm.params['size'] = 300;
		vm.params['sortFields'] = { "@linenum": "asc" }
		getContext(vm.params, "push");
		// 获取前upLinenum 行和后downLinenum 行的数据
		function getContext(params, pageType) {
			EsService.getUpDownContext.post(params, onSuccess, onError);
			function onSuccess(_d) {

				vm.esContext = [];
				_d.hit.forEach(function (_f) {
					vm.esContext.push(_f);
				})
				vm.esContext = sortEsContext();
				// 排序
				function sortEsContext() {
					return vm._.sortBy(vm.esContext, function (_d) {
						return _d.sort[0];
					})
				}
			};
			function onError(err) {
				console.log(err)
			}
		}
		function downLinenum() {
			var _params = angular.copy(vm.params);
			ofset.up = ofset.up + ofset.NUMBER;
			_params['upLinenum'] = ofset.up;
			getContext(_params, "push");
		}
		function upLinenum() {
			var _params = angular.copy(vm.params);
			ofset.down = ofset.down - ofset.NUMBER;
			_params['downLinenum'] = ofset.down;
			getContext(_params, "push");
		}
		// 键盘事件
		function keyup(evnet) {
			switch (evnet.keyCode) {
				case 40:
					downLinenum();
					break;
				case 38:
					upLinenum();
					break;
				default:
					console.log(evnet);
			}
		}
		// 关闭当前页面
		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}
		// 全屏
		function fullScreen(type) {
			// $uibModalInstance.close({urlParams:vm.urlParams, type: type});
		}
	}
})();
