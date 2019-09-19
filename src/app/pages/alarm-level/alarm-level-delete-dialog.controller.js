(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-level')
        .controller('AlarmLevelDeleteController',AlarmLevelDeleteController);

    AlarmLevelDeleteController.$inject = ['$uibModalInstance', 'entity', 'AlarmLevel'];

    function AlarmLevelDeleteController($uibModalInstance, entity, AlarmLevel) {
        var vm = this;

        vm.alarmLevel = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            AlarmLevel.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
