(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.data-source')
        .controller('DataSourceDeleteController',DataSourceDeleteController);

    DataSourceDeleteController.$inject = ['$uibModalInstance', 'entity', 'DataSource'];

    function DataSourceDeleteController($uibModalInstance, entity, DataSource) {
        var vm = this;

        vm.dataSource = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            DataSource.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
