(function() {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.controller("newDashboardDetailsAddController", newDashboardDetailsAddController);
    newDashboardDetailsAddController.$inject = ['$scope', '$uibModalInstance', 'newDashboardService', 'toastr', '$rootScope', '$uibModal', '$timeout'];

    function newDashboardDetailsAddController($scope, $uibModalInstance, newDashboardService, toastr, $rootScope, $uibModal, $timeout) {
        var vm = this;

        vm.data = {
            search: '',
        }

        vm.resoures = {
            list: [
                // { name: '监控指标图表表一', id: 1, ischecked: false }
            ]
        }

        vm.method = {
            submit: submit,
            cancel: cancel,
            // deleteItem: deleteItem, // 删除图表
            showDeleteModal: showDeleteModal
        }

        function init() {
            // 查询所有图表信息
            chartInfoAll();
        }

        function submit() {
            console.log(vm.resoures.list);
            // 获取选中的id
            var checkedId = [];
            angular.forEach(vm.resoures.list, function(item, index) {
                if (item.ischecked) {
                    checkedId.push(item.id);
                }
            })

            // 没有选中
            if (checkedId.length == 0) {
                toastr.error('请至少选择一个图表');
            } else {
                // 发送
                $rootScope.$broadcast('echartsAddSuccess', checkedId);
                // 提示
                toastr.info('添加成功');
                // 关闭
                cancel();
            }
        }

        // 删除
        function showDeleteModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/new-dashboard/details/add/delete/delete.html',
                controller: 'newDashboardDetailsAddDeleteController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: item
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function chartInfoAll() {
            $timeout(function() {
                newDashboardService.chartInfoAll({}, function(res) {
                    console.log(res);
                    var arr = [];
                    // 循环给状态
                    res.forEach(function(item, index) {
                        item.ischecked = false;
                        if (item.status == 0) {
                            arr.push(item);
                        }
                    })
                    vm.resoures.list = arr;
                })
            }, 1000)
        }

        // 删除后，刷新数据
        $scope.$on('echartsRemoveSuccess', function(event, data) {
            chartInfoAll();
        })

        init();
    }
})();