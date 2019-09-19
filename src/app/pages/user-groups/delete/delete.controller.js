(function () {
    'use strict';
    /**
     * @ 删除仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.user-groups');
    app.controller("userGroupsDeleteController", userGroupsDeleteController);
    userGroupsDeleteController.$inject = ['$uibModalInstance', 'newDashboardService', 'transferData', '$rootScope', 'toastr', 'UserGroupsService'];

    function userGroupsDeleteController($uibModalInstance, newDashboardService, transferData, $rootScope, toastr, UserGroupsService) {
        var vm = this;

        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function submit() {
            var member = [];
            angular.forEach(transferData.member, function (item) {
                member.push({
                    id: item.id,
                    status: 0
                })
            });

            updateUserStatus(member).then(function () {
                UserGroupsService.delete({id: transferData.id}, function (data) {
                    $rootScope.$broadcast('userGroupsDeleteSuccess', transferData);
                    toastr.success('删除成功！','成功提示');
                    // 关闭
                    cancel();
                }, function (err) {
                    toastr.error(err.data.message,'错误提示');
                })
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function updateUserStatus(users) {
            return new Promise(function (resolve, reject) {
                UserGroupsService.updateUserStatus(users, function (data) {
                    resolve(data)
                }, function (err) {
                    reject(err);
                })
            })
        }
    }
})();