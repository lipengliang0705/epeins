(function () {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.user-groups');
    app.controller("userGroupsModityController", userGroupsModityController);
    userGroupsModityController.$inject = ['$uibModalInstance', 'newDashboardService', 'toastr', '$rootScope', 'RoleManagement', 'transferData', 'UserGroupsService', 'User'];

    function userGroupsModityController($uibModalInstance, newDashboardService, toastr, $rootScope, RoleManagement, transferData, UserGroupsService, User) {
        var vm = this;

        vm.userList = [];

        vm.roleList = [];

        vm.data = transferData || {};
        if(vm.data.member) vm.data.member = angular.fromJson(vm.data.member);
        vm.originMember = angular.copy(vm.data.member);
        // vm.data.roles = angular.fromJson(vm.data.roles);
        vm.addMember = [], vm.removeMember = [];
        console.log(vm.data);
        vm.method = {
            submit: submit,
            cancel: cancel,
            handleChangeMember: handleChangeMember,
        }

        loadAll();

        function loadAll() {
            getRoleList();
            getUserList();
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
                vm.roleList=[];
                angular.forEach(data,function (item) {
                    vm.roleList.push({
                        id:item.id,
                        name:item.name
                    })
                })
            }, function (data) {

            })
        }

        function submit() {
            var data = angular.copy(vm.data);

            var member=[];

            angular.forEach(vm.addMember,function (item) {
                member.push({
                    id:item.id,
                    status:1
                })
            });
            angular.forEach(vm.removeMember,function (item) {
                member.push({
                    id:item.id,
                    status:0
                })
            });

            updateUserStatus(member).then(function () {
                data.member = angular.toJson(data.member);
                // data.roles = angular.toJson(data.roles);
                console.log(data);

                UserGroupsService.update(data, function (data) {
                    $rootScope.$broadcast('userGroupsUpdateSuccess', vm.data);
                    toastr.success('修改成功！','成功提示');
                    // 关闭
                    cancel();
                }, function (err) {
                    toastr.error(err.data.message,'错误提示');
                })
            });
        }

        function cancel() {
            console.log('add',vm.addMember);
            console.log('remove',vm.removeMember);
            $uibModalInstance.dismiss('cancel');
        }

        function handleChangeMember(e) {
            console.log(e);
        }

        vm.select = function (e) {

            angular.forEach(vm.data.member,function (item) {
                var isEsist=false;

                angular.forEach(vm.originMember,function (item2) {
                    if(item2.id===item.id){
                        isEsist=true;
                        return;
                    }
                });

                if(!isEsist){
                    if(vm.addMember.indexOf(item)===-1){
                        vm.addMember.push(item);
                    }
                }

            });

            // for(var i = 0; i < vm.data.member.length; i++){
            //     var isExist = false;
            //     for(var j = 0; j < vm.originMember.length; j++){
            //         if(vm.originMember[j].id == vm.data.member[i].id){
            //             isExist = true;
            //             break;
            //         }
            //     }
            //     if(!isExist){
            //        if(vm.addMember.indexOf(vm.data.member[i])===-1){
            //             vm.addMember.push(vm.data.member[i]);
            //         }
            //     }
            // }

            console.log('add',vm.addMember);

            // console.log(vm.addMember);
        }

        vm.remove = function (e) {
            angular.forEach(vm.originMember,function (item) {
                var isExist=false;

                angular.forEach(vm.data.member,function (item2) {
                    if(item2.id===item.id){
                        isExist=true;
                        return;
                    }
                });

                if(!isExist){
                    if(vm.removeMember.indexOf(item)===-1){
                        vm.removeMember.push(item);
                    }
                }
            });

            // for(var i = 0; i < vm.originMember.length; i++){
            //     var isExist = false;
            //     for(var j = 0; j < vm.data.member.length; j++){
            //         if(vm.data.member[j].id == vm.originMember[i].id){
            //             isExist = true;
            //             break;
            //         }
            //     }
            //     if(!isExist){
            //         if(vm.removeMember.indexOf(vm.originMember[i])===-1){
            //             vm.removeMember.push(vm.originMember[i]);
            //         }
            //     }
            // }
            console.log('remove',vm.removeMember);
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
// (function () {
//     'use strict';
//     /**
//      * @ 修改仪表盘
//      * Author:Veiss Date:2019/6/21
//      *  */
//     var app = angular.module('LoginsightUiApp.page.user-groups');
//     app.controller("userGroupsModityController", userGroupsModityController);
//     userGroupsModityController.$inject = ['$uibModalInstance', 'newDashboardService', 'transferData', '$rootScope', 'toastr'];
//
//     function userGroupsModityController($uibModalInstance, newDashboardService, transferData, $rootScope, toastr) {
//         var vm = this;
//
//         vm.data = {
//             name: transferData.name
//         }
//         vm.method = {
//             submit: submit,
//             cancel: cancel
//         }
//
//         function submit() {
//             transferData.name = vm.data.name;
//
//             // $rootScope.$broadcast('modifyDashboardSuccess', transferData);
//
//             toastr.info('修改成功！');
//
//             // 关闭
//             cancel();
//         }
//
//         function cancel() {
//             $uibModalInstance.dismiss('cancel');
//         }
//     }
// })();