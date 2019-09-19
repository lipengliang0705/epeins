(function() {
    'use strict';
    /**
     * @ 删除仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.controller("newDashboardDeleteController", newDashboardDeleteController);
    newDashboardDeleteController.$inject = ['$uibModalInstance', 'newDashboardService', 'transferData', '$rootScope', 'toastr'];

    function newDashboardDeleteController($uibModalInstance, newDashboardService, transferData, $rootScope, toastr) {
        var vm = this;
        vm.data = {
            id: transferData
        }
        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function submit(id) {
            // 调接口，储存
            newDashboardService.delete({ id: vm.data.id }, function(res) {
                console.log(res)
                if (res.status == 1) {
                    // 储存成功后，跳转到列表页，并且刷新页面
                    $rootScope.$broadcast('deleteDashboardSuccess', transferData);

                    toastr.success('仪表盘删除成功！','成功提示');
                }

            })

            // 关闭
            cancel();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();