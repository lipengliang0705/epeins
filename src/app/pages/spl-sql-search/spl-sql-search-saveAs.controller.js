(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.spl-sql-search')
        .controller("splSqlSearchSaveAsCtrl",splSqlSearchSaveAsCtrl);

        splSqlSearchSaveAsCtrl.$inject = ['$scope','$filter', 'Principal', 'data', '$uibModalInstance', 'toastr', 'DataDashboard'];
        function splSqlSearchSaveAsCtrl($scope, $filter, Principal, data, $uibModalInstance, toastr, DataDashboard){
            console.log("data222-------", data);
        	var vm = this;
            vm._ = _;
        	vm.cancel = cancel;
            vm.save = save;
            vm.queryParams = data.data.queryParams;
            vm.filter = {};
            vm.filter.dateRange = {};

            getAccount();
	        vm.type = 'sql_spl';

            // 时间查询条件
            function convertToFilter() {
                if(vm.queryParams){
                    vm.filter.dateRange.startDate = moment(vm.queryParams.startTime);
                    vm.filter.dateRange.endDate = moment(vm.queryParams.endTime);
                } 
            };
            convertToFilter();


            function bulidQuery(){                 
                vm.queryParams.startTime = moment(vm.filter.dateRange.startDate);
                vm.queryParams.endTime = moment(vm.filter.dateRange.endDate);             
                return {queryParams: vm.queryParams};
            };

            // 保存方法
            function save() {

                var params = {
                    name: vm.name || '未命名' ,
                    type: vm.type,
                    options: JSON.stringify(bulidQuery() || {}) ,
                    // createdTime: getDate() ,
                    // query: JSON.stringify({"app": vm.filter.name } || {}) ,
                    // createdBy: vm.account.login ,
                    // modifiedBy: null
                };
                if(vm.name) { 
                    DataDashboard.save(params, function() {
                        // toastr.pop("success", '', "该" +  vm.userView.name + "保存成功！")
                        $uibModalInstance.close({});
                    },  function(_e) {
                        console.error(_e);
                    })
                }
            };

            vm.nameValidateMsgFlag = false;
            vm.nameValidateMsg = '';
            // 登陆信息
            function getAccount(){
                Principal.identity().then(function(account){
                    vm.account = account;
                    vm.isAuthenticated = Principal.isAuthenticated;
                });
            };
            function getDate(){
                return $filter('date')(new Date(), "yyyy-MM-ddTHH:mm:ss.sss'Z'");
            };
        	// 关闭当前页面
			function cancel() {
	            $uibModalInstance.dismiss('cancel');
	        };
        }
})();
