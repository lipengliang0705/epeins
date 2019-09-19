(function () {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.controller("NewDashboardController", NewDashboardController);
    NewDashboardController.$inject = ['$uibModal', '$scope', '$rootScope', 'newDashboardService', 'NgTableParams'];

    function NewDashboardController($uibModal, $scope, $rootScope, newDashboardService, NgTableParams) {
        var vm = this;

        vm.data = {
            search: '',
            pageParams: {
                page: 1, //展示第一页
                count: 10, //每页有15个数据项
            },
            tableParams: null
        }

        vm.method = {
            showAddModal: showAddModal,
            showMidifyModal: showMidifyModal,
            showDeleteModal: showDeleteModal
        }

        // 页面初始化
        function init() {
            checkNewDashboardsInfo();
        }

        // 新建
        function showAddModal() {
            $uibModal.open({
                templateUrl: 'app/pages/new-dashboard/add/add.html',
                controller: 'newDashboardAddController',
                controllerAs: 'vm',
                backdrop: 'static'
            });
        }

        // 修改
        function showMidifyModal(id) {
            console.log(id);
            $uibModal.open({
                templateUrl: 'app/pages/new-dashboard/modify/modify.html',
                controller: 'newDashboardModityController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    transferData: { id: id }
                }
            });
        }

        // 删除
        function showDeleteModal(id) {
            $uibModal.open({
                templateUrl: 'app/pages/new-dashboard/delete/delete.html',
                controller: 'newDashboardDeleteController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: id
                }
            });
        }

        // 获取仪表盘信息列表
        function checkNewDashboardsInfo() {
            newDashboardService.checkNewDashboardsInfo({}, function (res) {
                console.log(res);
                vm.data.tableParams = new NgTableParams(vm.data.pageParams, {
                    dataset: res
                })
            })
        }

        // 新建图表成功
        $rootScope.$on('addDashboardSuccess', function (event, data) {
            checkNewDashboardsInfo();
        })

        // 修改图表成功
        $rootScope.$on('modifyDashboardSuccess', function (event, data) {
            checkNewDashboardsInfo();

        })

        // 删除图表成功        
        $rootScope.$on('deleteDashboardSuccess', function (event, data) {
            checkNewDashboardsInfo();
        })

        // 表格搜索
        $scope.$watch("vm.data.search", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.data.tableParams.filter({});
            } else if (newValue != oldValue) {
                vm.data.tableParams.filter({ $: vm.data.search });
            }
        });

        init();
    }
})();