(function () {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.resoures-groups');
    app.controller("resouresGroupsController", resouresGroupsController);
    resouresGroupsController.$inject = ['$uibModal', '$scope', '$window', '$rootScope', 'ResouresGroupsService', 'toastr','NgTableParams'];

    function resouresGroupsController($uibModal, $scope, $window, $rootScope, ResouresGroupsService, toastr,NgTableParams) {
        var vm = this;
        vm.tableParams=new NgTableParams({
            filter: {},
            sorting: {},
            page: 1,//展示第一页
            count: 10,//每页有15个数据项
            url: ''
        });

        vm.method = {
            showAddModal: showAddModal,
            showMidifyModal: showMidifyModal,
            showDeleteModal: showDeleteModal
        }

        vm.applyGlobalSearch=applyGlobalSearch;

        // 页面初始化
        function init() {
            $rootScope.$on('resouresGroupsAddSuccess', function (event, data) {
                getList();
            });

            $rootScope.$on('resouresGroupsUpdateSuccess', function (event, data) {
                getList();
            });

            $rootScope.$on('resouresGroupsDeleteSuccess', function (event, data) {
                getList();
            });

            getList();
        }

        function getList() {
            ResouresGroupsService.query({}, function (data) {
                console.log(data);
                vm.tableParams.settings().dataset=data;
                vm.tableParams.reload();

            }, function (err) {
                console.log(err);
                toastr.error(err.data.message,'错误提示');
            })
        }


        /**
         * 新建
         */
        function showAddModal() {
            $uibModal.open({
                templateUrl: 'app/pages/resoures-groups/add/add.html',
                controller: 'resouresGroupsAddController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    mainTreeData: ['Category', function (Category) {
                        return Category.query().$promise;
                    }]
                }
            });
        }

        /**
         * 修改
         */
        function showMidifyModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/resoures-groups/modify/modify.html',
                controller: 'resouresGroupsModityController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    transferData: ['ResouresGroupsService', function (ResouresGroupsService) {
                        return ResouresGroupsService.info({id: item.id}).$promise;
                    }],
                    mainTreeData: ['Category', function (Category) {
                        return Category.query().$promise;
                    }]
                }
            });
        }


        /**
         * 删除
         */
        function showDeleteModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/resoures-groups/delete/delete.html',
                controller: 'resouresGroupsDeleteController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: item
                }
            });
        }


        init();

        function applyGlobalSearch(){
            vm.tableParams.filter({ $: vm.globalSearchTerm });
        }

        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if(newValue != oldValue){
                vm.tableParams.filter({ $: vm.globalSearchTerm });
            }
        });

    }
})();