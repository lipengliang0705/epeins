(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.role-management')
        .controller('RoleManagementDialogController', RoleManagementDialogController);

    RoleManagementDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'toastr', 'entity', 'RoleManagement', 'MenuManagement','ResouresGroupsService'];

    function RoleManagementDialogController ($timeout, $scope, $stateParams, $uibModalInstance, toastr, entity, RoleManagement, MenuManagement,ResouresGroupsService) {
        var vm = this;

        vm.role = entity;

        vm.resourceGroups=[];
        vm.save = save;
        vm.clear = clear;

        // if(vm.role && vm.role.menuTree){
        //     vm.menu_select = vm.role.menuTree;
        // }

        getMenus();
        getResourceGroups();
        function getMenus () {
            MenuManagement.query({}, onSuccess, onError);
            function onSuccess(data, headers) {
                vm.menus = data; 
            }

            function onError(error) {
                toastr.error(error.data.message);
            }
        }

        function getResourceGroups() {
            ResouresGroupsService.query({}, function (data) {
                vm.resourceGroups=data;

            }, function (err) {
                console.log(err);
                toastr.error(err.data.message,'错误提示');
            })
        }

        function save () {
            vm.isSaving = true;
            console.log(vm.role,vm.role.menuTree);
            // if(vm.menu_select && vm.menu_select.id) vm.role.menu_tree_id = vm.menu_select.id; 
            if (vm.role.id !== null) {
                RoleManagement.update(vm.role, onSaveSuccess, onSaveError);
            } else {
                RoleManagement.save(vm.role, onSaveSuccess, onSaveError);
            }
        }


        function onSaveSuccess (result) {
            $scope.$emit('LoginsightUiApp.page.role-management:roleManagementSave', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

     
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        

    }
})();
