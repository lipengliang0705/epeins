(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-level')
        .controller('AlarmLevelDetailController', AlarmLevelDetailController);

    AlarmLevelDetailController.$inject = ['$scope', '$rootScope', '$stateParams', '$uibModalInstance', 'entity', 'AlarmLevel', 'AlarmRule'];

    function AlarmLevelDetailController($scope, $rootScope, $stateParams, $uibModalInstance, entity, AlarmLevel, AlarmRule) {
        var vm = this;

        vm.alarmLevel = entity;
        // vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('LoginsightUiApp.page.alarm-level:alarmLevelUpdate', function(event, result) {
            vm.alarmLevel = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.clear = clear;
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();  
