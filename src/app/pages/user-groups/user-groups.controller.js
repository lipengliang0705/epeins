(function () {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.user-groups');
    app.controller("userGroupsController", userGroupsController);
    userGroupsController.$inject = ['$uibModal', '$scope', '$window', '$rootScope','NgTableParams','UserGroupsService','toastr'];

    function userGroupsController($uibModal, $scope, $window, $rootScope,NgTableParams,UserGroupsService,toastr) {
        var vm = this;
        vm.tableParams=new NgTableParams(
            {
                filter: {},
                sorting: {},
                page: 1,//展示第一页
                count: 10,//每页有15个数据项
                url: ''
            }
        );

        vm.method = {
            showAddModal: showAddModal,
            showMidifyModal: showMidifyModal,
            showDeleteModal: showDeleteModal
        }
        vm.applyGlobalSearch=applyGlobalSearch;

        init();

        // 页面初始化
        function init() {
            $rootScope.$on('userGroupsAddSuccess', function (event, data) {
                getList();
            });

            $rootScope.$on('userGroupsUpdateSuccess', function (event, data) {
                getList();
            })

            $rootScope.$on('userGroupsDeleteSuccess', function (event, data) {
                getList();
            });

            getList();
        }

        function getList(){
            vm.dataload=true;
            UserGroupsService.query({},function (data) {
                vm.dataload=false;
                angular.forEach(data,function (item) {
                    if(item.member) item.member=angular.fromJson(item.member);
                    // if(item.roles) item.roles=angular.fromJson(item.roles);
                });
                console.log(data);
                vm.tableParams.settings().dataset=data;
                vm.tableParams.reload();
            },function (err) {
                vm.dataload=false;
                toastr.error(err.data.message,'错误提示');
            })
        }

        /**
         * 新建
         */
        function showAddModal() {
            $uibModal.open({
                templateUrl: 'app/pages/user-groups/add/add.html',
                controller: 'userGroupsAddController',
                controllerAs: 'vm',
                size: 'md',
                backdrop: 'static',
            });
        }

        /**
         * 修改
         */
        function showMidifyModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/user-groups/modify/modify.html',
                controller: 'userGroupsModityController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    transferData: ['UserGroupsService',function (UserGroupsService) {
                        return UserGroupsService.info({id:item.id}).$promise
                    }]
                }
            });
        }


        /**
         * 删除
         */
        function showDeleteModal(item) {
            console.log(item.member);
            if(item.member.length>0){
                toastr.info('该用户组内有成员，清空成员后才能删除组！','消息提示');
            }else{
                $uibModal.open({
                    templateUrl: 'app/pages/user-groups/delete/delete.html',
                    controller: 'userGroupsDeleteController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        transferData: item
                    }
                });
            }

        }

        // 回车的时候触发ng-submit，跟下面的watch二选一就可以
        function applyGlobalSearch(){
            var term = vm.globalSearchTerm;
            // if (vm.isInvertedSearch){
            //   term = "!" + term;
            // }
            // console.log(term);
            vm.tableParams.filter({ $: term });
        }

        // 值变更的时候触发
        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if(newValue != oldValue){
                vm.tableParams.filter({ $: vm.globalSearchTerm });
            }
        });

    }
})();