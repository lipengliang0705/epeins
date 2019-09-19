(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.pages.user-management')
        .controller('UserManagementDialogController', UserManagementDialogController);

    UserManagementDialogController.$inject = ['$stateParams', '$uibModalInstance', 'entity', 'User', 'Authorities'];

    function UserManagementDialogController($stateParams, $uibModalInstance, entity, User, Authorities) {
        var vm = this;

        vm.authorities = [];//['ROLE_USER', 'ROLE_ADMIN'];
        vm.clear = clear;
        vm.languages = null;
        vm.save = save;
        vm.user = entity;

        getAuthorities();

        function getAuthorities() {
            Authorities.query({}, onSuccess, onError);

            function onSuccess(result) {
                console.log(result);
                vm.authorities = [];
                if (result) {
                    _.forEach(result, function (a) {
                        vm.authorities.push(a.name);
                    });
                }
            }

            function onError(e) {
                console.log(e);
            }
        }

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function onSaveSuccess(result) {
            vm.isSaving = false;
            $uibModalInstance.close(result);
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        function save() {
            vm.isSaving = true;
            if (vm.user.id !== null) {
                User.update(vm.user, onSaveSuccess, onSaveError);
            } else {
                vm.user.langKey = 'en';
                User.save(vm.user, onSaveSuccess, onSaveError);
            }
        }
    }
})();
