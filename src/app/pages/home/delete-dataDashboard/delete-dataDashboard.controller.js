(function () {
    'use strict';
    /**
     * @ 删除知识库
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.home');
    app.controller("deleteDataDashboardController", deleteDataDashboardController);
    deleteDataDashboardController.$inject = ['$uibModalInstance', 'HomeService', 'transferData', '$rootScope', 'toastr'];

    function deleteDataDashboardController($uibModalInstance, HomeService, transferData, $rootScope, toastr) {
        var vm = this;
        console.log(transferData);
        vm.id = transferData;
        vm.data = {
            id: transferData
        }

        vm.method = {
            submit: submit,
            cancel: cancel
        }
        
        function submit(id) {
            HomeService.deleteDataDashboard({ id: id }, function (res) {
                $rootScope.$broadcast('deleteDataDashboardSuccess');
                toastr.success('删除成功!', '成功提示');
                // 关闭
                cancel();
            })
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();