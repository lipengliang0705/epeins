(function() {
    'use strict';
    /**
     * @ 删除仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.controller("newDashboardDetailsDeleteController", newDashboardDetailsDeleteController);
    newDashboardDetailsDeleteController.$inject = ['$uibModalInstance', 'newDashboardService', '$rootScope', 'transferData'];

    function newDashboardDetailsDeleteController($uibModalInstance, newDashboardService, $rootScope, transferData) {
        var vm = this;

        console.log(transferData.id);

        vm.data = {
            name: ''
        }
        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function submit() {
            // 消息传递,删除成功
            $rootScope.$broadcast('echartsDeleteSuccess', { index: transferData.index });

            // 关闭
            cancel();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();