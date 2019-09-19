(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.data-source')
        .controller('DataSourceController', DataSourceController);

    DataSourceController.$inject = ['$scope','DataSource', 'NgTableParams'];

    function DataSourceController($scope, DataSource, NgTableParams) {

        var vm = this;

        vm.dataSources = [];
        // table 的参数
        vm.tableParams = new NgTableParams();
        loadAll();

        function loadAll() {
            if(vm.dataSources.length==0){
                    vm.dataload=true;
                    vm.dataempty= false;
                }
            DataSource.query(function(result) {
                vm.dataSources = result;
                vm.searchQuery = null;
                vm.tableParams = new NgTableParams(
                    {
                       filter: {},
                       sorting: {},
                       page: 1,//展示第一页
                       count: 10,//每页有15个数据项
                       url: ''
                    },
                    { dataset: vm.dataSources}
                );
                if(vm.dataSources.length==0){
                    vm.dataload=false;
                    vm.dataempty= true;
                }
                if(vm.dataSources.length>0&&vm.dataSources.length==result.length){
                    vm.dataload=false;
                    vm.dataempty=false;
                }
            });
        }
         // 回车的时候触发ng-submit，跟下面的watch二选一就可以
        function applyGlobalSearch(){
            var term = vm.globalSearchTerm;
            // if (vm.isInvertedSearch){
            //   term = "!" + term;
            // }
            console.log(term);
            vm.tableParams.filter({ $: term });
        }

        // 值变更的时候触发
        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if(newValue != oldValue){
                vm.tableParams.filter({ $: vm.globalSearchTerm });
            }
        });
    }
})();
