(function () {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.user-groups');
    app.controller("userGroupsAddController", userGroupsAddController);
    userGroupsAddController.$inject = ['$uibModalInstance', 'newDashboardService', 'toastr', '$rootScope', 'RoleManagement', 'UserGroupsService', 'User'];

    function userGroupsAddController($uibModalInstance, newDashboardService, toastr, $rootScope, RoleManagement, UserGroupsService, User) {
        var vm = this;

        vm.userList = [];

        vm.roleList = [];

        vm.data = {}
        vm.method = {
            submit: submit,
            cancel: cancel
        }

        loadAll();

        function loadAll() {
            getUserList();
            getRoleList();
        }

        function getUserList() {
            User.query({}, function (data) {
                vm.userList = data.filter(function (item) {
                    return item.isInGroup ? (item.isInGroup == 0) : item;
                });
            }, function (err) {
                toastr.error(err.data.message,'错误提示');
            });
        }

        function getRoleList() {
            RoleManagement.query({}, function (data) {
                console.log(data);
                vm.roleList = [];
                angular.forEach(data, function (item) {
                    vm.roleList.push({
                        id: item.id,
                        name: item.name
                    })
                })
            }, function (data) {

            })
        }

        function submit() {
            var data = angular.copy(vm.data);

            var member = [];
            angular.forEach(data.member, function (item) {
                member.push({
                    id: item.id,
                    status: 1
                })
            });

            console.log('member', member);

            updateUserStatus(member).then(function () {
                data.member = angular.toJson(data.member);
                // data.roles = angular.toJson(data.roles);

                UserGroupsService.save(data, function (data) {
                    $rootScope.$broadcast('userGroupsAddSuccess', data);
                    toastr.success('新建成功！','成功提示');
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