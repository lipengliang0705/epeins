(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.role-management')
        .controller('RoleManagementController', RoleManagementController);

    RoleManagementController.$inject = ['Principal', 'RoleManagement', '$state', '$scope', 'toastr', 'NgTableParams'];

    function RoleManagementController(Principal, RoleManagement, $state, $scope, toastr, NgTableParams) {
        var vm = this; 
        vm.tableParams = new NgTableParams(); 

        loadAll ();
        function loadAll () {
             vm.dataload=true;
            RoleManagement.query({}, onSuccess, onError);
        }

        function onSuccess(data, headers) {
             vm.dataload=false;
            vm.menus = data;
            vm.tableParams = new NgTableParams(
                    {
                       filter: {},
                       sorting: {},
                       page: 1,//展示第一页
                       count: 10,//每页有15个数据项
                       url: ''
                    },
                    { dataset: vm.menus}
                ); 
        }

        function onError(error) {
            toastr.error(error.data.message);
        }
 
        function sort () {
            var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
            if (vm.predicate !== 'id') {
                result.push('id');
            }
            return result;
        }

        function loadPage (page) {
            vm.page = page;
            vm.transition();
        }

        function transition () {
            $state.transitionTo($state.$current, {
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
                search: vm.currentSearch
            });
        }
         // 值变更的时候触发
        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if(newValue != oldValue){
                vm.tableParams.filter({ $: vm.globalSearchTerm });
            }
        });

        $scope.data = {
        current: "0" // 1代表张三，2代表李四，3代表王五
        };
        $scope.tooltipShow=function (param) {
            vm.tooltipShow = true;
            $scope.data.current = param;
            
        }
    
        $scope.tooltipClose = function(param){
            vm.tooltipShow = false;
            $scope.data.current = param;

        }
    }
})();
