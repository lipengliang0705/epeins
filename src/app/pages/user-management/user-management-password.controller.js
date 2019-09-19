(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.pages.user-management')
        .controller('PasswordController', PasswordController);

    PasswordController.$inject = ['Auth', 'Principal','toastr'];

    function PasswordController (Auth, Principal,toastr) {
        var vm = this;




        vm.changePassword = changePassword;
        vm.doNotMatch = null;
        vm.error = null;
        vm.success = null;

        Principal.identity().then(function(account) {
            vm.account = account;
        });

        function changePassword () {
            if (vm.password !== vm.confirmPassword) {
                vm.error = null;
                vm.success = null;
                vm.doNotMatch = 'ERROR';
            } else {
                vm.doNotMatch = null;
                Auth.changePassword({
                    currentPassword: vm.currentPassword,
                    newPassword: vm.password
                }).then(function (data) {
                    console.log(data);
                    if(data.returnCode==200){
                        vm.error = null;
                        vm.success = 'OK';
                        toastr.info('密码修改成功！');
                        location.href = "/auth.html"
                    }else{
                        toastr.error(data.message);
                    }

                }).catch(function () {
                    vm.success = null;
                    vm.error = 'ERROR';
                });
            }
        }
    }
})();
