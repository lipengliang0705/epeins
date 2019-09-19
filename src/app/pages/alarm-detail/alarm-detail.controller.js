(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-detail')
        .controller('AlarmDetailController', AlarmDetailController);

    AlarmDetailController.$inject = ['$scope', '$stateParams', 'AlarmResult', 'AlarmInfoService', 'NgTableParams'];

    function AlarmDetailController($scope, $stateParams, AlarmResult, AlarmInfoService, NgTableParams) {
        console.log("stateParams", $stateParams);
        var vm = this;
 
        vm.id = $stateParams['detailId'] || '';
        vm.type = $stateParams['type'] || '';

        vm.AlarmResult = [];
        vm.setChecked = setChecked;
        // table 的参数
        vm.tableParams = new NgTableParams();

        loadAll();
        function loadAll() {   
            if(vm.type && vm.type == 'AlarmLevel'){
                getByAlarmLevel();
            }else if(vm.type && vm.type == 'EventRule'){
                getByEventRule();
            }else if(vm.type && vm.type == 'Category'){
                getByCategory();
            }

        }

        function getByAlarmLevel(){ 
            AlarmInfoService.getAlarmByAlarmLevelId(vm.id).then(function (promise) {
                console.log('getAlarmByAlarmLevelId true', promise);
                vm.alarmResult = promise.alarmInfoReturnVMS;
                vm.alarmDetail = promise.detail; 
                vm.tableParams = new NgTableParams(
                    {},
                    { dataset: vm.alarmResult}
                );
                
            }, function (promise) { 
                console.log('getAlarmByAlarmLevelId false', promise);
                         
            });
        }
 
        function getByEventRule(){ 
            AlarmInfoService.getAlarmByEventRuleId(vm.id).then(function (promise) {
                console.log('getAlarmByEventRuleId true', promise);
                vm.alarmResult = promise.alarmInfoReturnVMS;
                vm.alarmDetail = promise.detail; 
                vm.tableParams = new NgTableParams(
                    {},
                    { dataset: vm.alarmResult}
                );
                
            }, function (promise) { 
                console.log('getAlarmByEventRuleId false', promise);
                         
            });
        }

        function getByCategory(){ 
            AlarmInfoService.getAlarmByCategoryId(vm.id).then(function (promise) {
                console.log('getAlarmByCategoryId true', promise);
                vm.alarmResult = promise.alarmInfoReturnVMS;
                vm.alarmDetail = promise.detail;
                vm.tableParams = new NgTableParams(
                    {},
                    { dataset: vm.alarmResult}
                ); 
                
            }, function (promise) { 
                console.log('getAlarmByCategoryId false', promise);
                         
            });
        }


 
        function setChecked(alarm, flag) { 
            // function onSaveSuccess (result) {
            //     $scope.$emit('tssLoginsightUiApp:alarmUpdate', result);
            //     vm.isSaving = false;
            // }

            // function onSaveError () {
            //     vm.isSaving = false;
            // }
            alarm.checked = flag;
            AlarmResult.update(alarm);
           // AlarmResult.update(alarm, onSaveSuccess, onSaveError);

        }

        // $scope.$watch(function() {
        //     return vm.checkboxAll;
        // }, function(newValue, oldValue) {
        //     if(newValue){
        //        console.log(vm.checkboxAll);
               

        //     }else{
        //        console.log(vm.checkboxAll);

        //     }
        // });

        vm.remove = function(row) { 
            function onSuccess(result) {
                loadTable();
                toaster.pop("success", '', '该告警已经被删除！');
            }

            function onError() {
                toaster.pop("error", "删除告警时发生系统错误，请联系系统管理员核查！")
            }

            var dlg = dialogs.confirm("删除确认", "您确认要删除此告警吗？", { 'size': 'sm', 'backdrop': 'static' });
            dlg.result.then(function (btn) {
                if (row.id !== null) {
                    AlarmResult.delete({id: row.id}).then(onSuccess, onError); 
                }
            })
        } 

 
    }
})();
