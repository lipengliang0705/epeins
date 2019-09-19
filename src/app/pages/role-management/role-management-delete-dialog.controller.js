(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.role-management')
        .controller('RoleManagementDeleteController', RoleManagementDeleteController);

    RoleManagementDeleteController.$inject = ['$uibModalInstance', 'entity', 'RoleManagement', 'toastr'];

    function RoleManagementDeleteController($uibModalInstance, entity, RoleManagement, toastr) {
        var vm = this;

        vm.role = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            RoleManagement.delete({id: id},
                function () {
                    toastr.success('删除成功！','成功提示');
                    $uibModalInstance.close(true);
                }, function (err) {
                    toastr.error(err.data.message,'错误提示');
                });
        }
    }
})();
