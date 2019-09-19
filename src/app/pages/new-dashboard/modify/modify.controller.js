(function() {
    'use strict';
    /**
     * @ 修改仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.controller("newDashboardModityController", newDashboardModityController);
    newDashboardModityController.$inject = ['$uibModalInstance', 'newDashboardService', 'transferData', '$rootScope', 'toastr'];

    function newDashboardModityController($uibModalInstance, newDashboardService, transferData, $rootScope, toastr) {
        var vm = this;

        vm.data = {
            id: transferData.id,
            name: '',
            description: '',
            layouts: [],
            createdBy: '',
            createdTime: ''
        }
        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function init() {
            // 初始化
            details(vm.data.id);
        }


        function submit() {
            //修改后的参数
            var item = {
                id: vm.data.id,
                name: vm.data.name,
                description: vm.data.description,
                layouts: vm.data.layouts,
                createdBy: vm.data.createdBy,
                createdTime: vm.data.createdTime
            }

            // 调接口，储存
            newDashboardService.modify(item, function(res) {
                console.log(res);
                // 检测到id
                if (res.id) {
                    // 储存成功后，跳转到列表页，并且刷新页面
                    $rootScope.$broadcast('modifyDashboardSuccess', item);
                    toastr.success('仪表盘修改成功！', '成功提示');
                }
            })

            // 关闭
            cancel();
        }


        function details(id) {
            newDashboardService.details({ id: id }, function(res) {
                if (res.id) {
                    vm.data.name = res.name;
                    vm.data.description = res.description;
                    vm.data.layouts = res.layouts;
                    vm.data.createdBy = res.createdBy;
                    vm.data.createdTime = res.createdTime;
                }
            })
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        init();
    }
})();