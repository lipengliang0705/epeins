(function () {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.alarm-type', []);
    app.controller("AlarmTypeController", AlarmTypeController);
    AlarmTypeController.$inject = ['$uibModal', '$scope', '$window', '$rootScope','NgTableParams','AlarmTypeService','toastr'];

    function AlarmTypeController($uibModal, $scope, $window, $rootScope,NgTableParams,AlarmTypeService,toastr) {
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

        init();

        // 页面初始化
        function init() {
            $rootScope.$on('refresh-alarm-type', function (event, data) {
                getList();
            });
            getList();
        }

        function getList(){
            vm.dataload=true;
            AlarmTypeService.query({},function (data) {
                console.log(data);
                vm.dataload=false;
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
                templateUrl: 'app/pages/alarm-type/dialog/dialog.html',
                controller: 'DialogController',
                controllerAs: 'vm',
                size: 'md',
                backdrop: 'static',
                resolve: {
                    transferData: null
                }
            });
        }

        /**
         * 修改
         */
        function showMidifyModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/alarm-type/dialog/dialog.html',
                controller: 'DialogController',
                controllerAs: 'vm',
                size: 'md',
                backdrop: 'static',
                resolve: {
                    transferData: ['AlarmTypeService',function (AlarmTypeService) {
                        return AlarmTypeService.info({id:item.id}).$promise
                    }]
                }
            });
        }


        /**
         * 删除
         */
        function showDeleteModal(item) {
            console.log(item.member);
            $uibModal.open({
                templateUrl: 'app/pages/alarm-type/delete/delete.html',
                controller: 'AlarmTypeDeleteController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: item
                }
            });

        }

    }
})();