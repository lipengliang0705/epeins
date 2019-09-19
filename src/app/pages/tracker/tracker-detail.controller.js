(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.tracker')
        .controller('TrackerDetailController', TrackerDetailController);

    TrackerDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'AlarmInfoService', 'AlarmResult', '$uibModalInstance', 'NgTableParams'];

    function TrackerDetailController($scope, $rootScope, $stateParams, AlarmInfoService, AlarmResult, $uibModalInstance, NgTableParams) {
        var vm = this;
        
        vm.categoryName = $stateParams.id;
 
        vm.setChecked = setChecked;
        vm.trackerDialogDeatil = trackerDialogDeatil;
        vm.clear = clear; 
        vm.alarmDetailResult=[];
        
         // table 的参数
        vm.tableParams = new NgTableParams(); 
        function tableLoadAll() {
            vm.dataload=true;
            vm.trackerDetailShow=false;
            AlarmInfoService.getAlarmInfoCategory($stateParams.id).then(function (result) {
                console.log('getAlarmInfoCategory', result);   
                vm.dataload=false;
                var list = _.orderBy(angular.copy(result),'createdTime','desc');
                vm.AlarmResult = list;
                // console.log('告警信息列表：',result);
                vm.searchQuery = null;
                vm.tableParams = new NgTableParams(
                   {
                       filter: {},
                       sorting: {},
                       page: 1,//展示第一页
                       count: 10,//每页有15个数据项
                       url: ''
                    },
                    { dataset: list}
                ); 

            }, function (error) { 
               // toastr.error('error', error);              
            }); 
        }
        tableLoadAll();

        function trackerDialogDeatil(result){            
            vm.trackerDetailShow = true;
            vm.alarmDetailResult = result;
            console.log('vm.alarmDetailResult---------',vm.alarmDetailResult) 
        }

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function setChecked(alarm, flag) {
            function onSaveSuccess (result) {
                $scope.$emit('tssLoginsightUiApp:alarmResultUpdate', result);
                
                vm.isSaving = true;
            }

            function onSaveError () {
                vm.isSaving = false;
            }
            alarm.checked = flag;
            AlarmResult.update(alarm,onSaveSuccess,onSaveError);
        }

        var unsubscribe = $rootScope.$on('tssLoginsightUiApp:alarmResultUpdate', function(event, result) {
            vm.alarmResult = result;
           // console.log('详情result',result);
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
