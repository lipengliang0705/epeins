(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-detail')
        .controller('AlarmDetailDeleteController',AlarmDetailDeleteController);

    AlarmDetailDeleteController.$inject = ['$uibModalInstance', 'entity', 'AlarmResult'];

    function AlarmDetailDeleteController($uibModalInstance, entity, AlarmResult) {
        var vm = this;

        vm.alarmRule = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            AlarmResult.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
