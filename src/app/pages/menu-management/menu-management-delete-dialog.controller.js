(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.menu-management')
        .controller('MenuManagementDeleteController',MenuManagementDeleteController);

    MenuManagementDeleteController.$inject = ['$uibModalInstance', 'entity', 'MenuManagement'];

    function MenuManagementDeleteController($uibModalInstance, entity, MenuManagement) {
        var vm = this;

        vm.menu = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            MenuManagement.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
