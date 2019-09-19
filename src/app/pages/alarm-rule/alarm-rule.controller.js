(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-rule')
        .controller('AlarmRuleController', AlarmRuleController);

    AlarmRuleController.$inject = ['$scope', 'AlarmRule', 'NgTableParams', '$rootScope'];

    function AlarmRuleController($scope, AlarmRule, NgTableParams, $rootScope) {

        var vm = this;

        vm.alarmRules = [];
        vm.changeStatus = changeStatus;
        // table 的参数
        vm.tableParams = new NgTableParams();

        loadAll();

        function loadAll() {
            vm.dataload = true;
            AlarmRule.query(function (result) {
                vm.dataload = false;
                vm.alarmRules = result;
                vm.searchQuery = null;
                vm.tableParams = new NgTableParams(
                    {
                        filter: {},
                        sorting: {},
                        page: 1,//展示第一页
                        count: 10,//每页有15个数据项
                        url: ''
                    },
                    {dataset: result}
                );
            });
        }

        // 回车的时候触发ng-submit，跟下面的watch二选一就可以
        function applyGlobalSearch() {
            var term = vm.globalSearchTerm;
            // if (vm.isInvertedSearch){
            //   term = "!" + term;
            // }
            console.log(term);
            vm.tableParams.filter({$: term});
        }

        // 值变更的时候触发
        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if (newValue != oldValue) {
                vm.tableParams.filter({$: vm.globalSearchTerm});
            }
        });

        // 改变状态
        function changeStatus(alarmRule) {
            console.log("close", alarmRule.status);
            // AlarmRule.update(alarmRule, onSaveSuccess, onSaveError);
            // AlarmRule.updateOn({id: alarmRule.id}, onSaveSuccess, onSaveError);
            if (alarmRule.status == "on")
                AlarmRule.switch({id: alarmRule.id, status: "off"}, onSaveSuccess, onSaveError);
            else
                AlarmRule.switch({id: alarmRule.id, status: "on"}, onSaveSuccess, onSaveError);
        }


        function onSaveSuccess(result) {
            // $scope.$emit('LoginsightUiApp.page.alarm-rule:alarmRuleUpdate', result);
            vm.isSaving = false;
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        // $rootScope.$on('alarmRuleAddSuccess', function (event, data) {
        //     console.log(vm.tableParams);
        //
        // });
        //
        // $rootScope.$on('alarmRuleUpdateSuccess', function (event, data) {
        //     console.log(data);
        // });
    }
})();
