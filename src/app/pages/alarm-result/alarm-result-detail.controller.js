(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-result')
        .controller('AlarmResultDetailController', AlarmResultDetailController);

    AlarmResultDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'AlarmResult', 'EventRule', '$uibModalInstance', 'AlarmInfoService'];

    function AlarmResultDetailController($scope, $rootScope, $stateParams, previousState, entity, AlarmResult, EventRule, $uibModalInstance, AlarmInfoService) {
        var vm = this;
      // console.log('详情entity',entity);
        vm.alarmResult = entity;
        vm.previousState = previousState.name;
        vm.setChecked = setChecked;
        vm.clear = clear;
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


            // if(flag==false){
            //     $rootScope.unCheckedCount=$rootScope.unCheckedCount+1;
            //     console.log('vm.unCheckedCount---未读数量4：',$rootScope.unCheckedCount);
            // }
            // if(flag==true){
            //     $rootScope.unCheckedCount=$rootScope.unCheckedCount-1;
            //     console.log('vm.unCheckedCount---未读数量4：',$rootScope.unCheckedCount);
            // }
            
            // AlarmInfoService.getAlarmCheckedCount().then(function (promise) {
            //     $rootScope.unCheckedCount = promise.unCheckedCount;
            //     console.log('vm.unCheckedCount---未读数量4：',promise);
            //     console.log('vm.unCheckedCount---未读数量4：',$rootScope.unCheckedCount);
            //  }, function (promise) {
            //     vm.apiCount = true;
               
            // });

        }

        var unsubscribe = $rootScope.$on('tssLoginsightUiApp:alarmResultUpdate', function(event, result) {
            vm.alarmResult = result;
           // console.log('详情result',result);
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
