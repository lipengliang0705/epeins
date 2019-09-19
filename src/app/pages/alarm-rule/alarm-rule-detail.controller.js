(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-rule')
        .controller('AlarmRuleDetailController', AlarmRuleDetailController);

    AlarmRuleDetailController.$inject = ['$scope', '$rootScope', '$stateParams', '$uibModalInstance', 'entity', 'AlarmRule'];

    function AlarmRuleDetailController($scope, $rootScope, $stateParams, $uibModalInstance, entity, AlarmRule) {
        var vm = this;

        vm.alarmRule = entity;
        vm.alarmRule.conf = angular.fromJson(vm.alarmRule.conf);
        console.log(vm.alarmRule);
        // vm.previousState = previousState.name;
        // var unsubscribe = $rootScope.$on('LoginsightUiApp.page.alarm-rule:alarmRuleUpdate', function(event, result) {
        //     vm.alarmRule = result;
        // });
        // $scope.$on('$destroy', unsubscribe);

        vm.clear = clear;
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
        
    }
})();
