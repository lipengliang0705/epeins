(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.dashboard-builder')
        .controller('DashboardDeleteController',DashboardDeleteController);

    DashboardDeleteController.$inject = ['$uibModalInstance', 'entity', 'DataDashboard'];

    function DashboardDeleteController($uibModalInstance, entity, DataDashboard) {
        var vm = this;

        vm.dataDashboard = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) { 
            DataDashboard.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
