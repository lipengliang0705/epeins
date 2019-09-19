(function() {
    'use strict';
    /**
     * @ 删除报表
     * Author:Veiss Date:2019/7/17
     *  */
    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.controller("newDashboardDetailsAddDeleteController", newDashboardDetailsAddDeleteController);
    newDashboardDetailsAddDeleteController.$inject = ['$uibModalInstance', 'transferData', 'newDashboardService', 'toastr', '$rootScope'];

    function newDashboardDetailsAddDeleteController($uibModalInstance, transferData, newDashboardService, toastr, $rootScope) {
        var vm = this;

        console.log(transferData);

        vm.data = {
            id: transferData.id,
            title: transferData.title
        }

        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function submit(id) {
            newDashboardService.chartInfoDelete({ id: id }, function(res) {
                console.log(res);

                // 删除
                $rootScope.$broadcast('echartsRemoveSuccess');
                // 提示
                toastr.success('图表删除成功');
                // 关闭
                cancel();
            })


        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();