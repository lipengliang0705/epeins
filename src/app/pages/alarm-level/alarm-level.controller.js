(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-level')
        .controller('AlarmLevelController', AlarmLevelController);

    AlarmLevelController.$inject = ['$scope', 'AlarmLevel', 'AlarmLevelSearch', 'NgTableParams'];

    function AlarmLevelController($scope, AlarmLevel, AlarmLevelSearch, NgTableParams) {

        var vm = this;

        vm.alarmLevels = [];
        vm.clear = clear;
        vm.search = search;
        vm.loadAll = loadAll;
        // table 的参数
        vm.tableParams = new NgTableParams();

        loadAll();

        function loadAll() {
            vm.dataload=true;
            AlarmLevel.query(function(result) {
                vm.dataload=false;
                vm.alarmLevels = result;
                vm.searchQuery = null;
                vm.tableParams = new NgTableParams(
                    {
                       filter: {},
                       page: 1,//展示第一页
                       count: 10,//每页有15个数据项
                       url: ''
                    },
                    { dataset: vm.alarmLevels}
                ); 
            });
        }

        function search() {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            AlarmLevelSearch.query({query: vm.searchQuery}, function(result) {
                vm.alarmLevels = result;
                vm.currentSearch = vm.searchQuery;
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

        function clear() {
            vm.searchQuery = null;
            loadAll();
        }    }
})();
