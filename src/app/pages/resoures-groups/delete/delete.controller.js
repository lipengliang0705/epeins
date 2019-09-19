(function () {
    'use strict';
    /**
     * @ 删除仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.resoures-groups');
    app.controller("resouresGroupsDeleteController", resouresGroupsDeleteController);
    resouresGroupsDeleteController.$inject = ['$uibModalInstance', 'newDashboardService', 'transferData', '$rootScope', 'toastr','ResouresGroupsService'];

    function resouresGroupsDeleteController($uibModalInstance, newDashboardService, transferData, $rootScope, toastr,ResouresGroupsService) {
        var vm = this;

        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function submit() {

            ResouresGroupsService.delete({id:transferData.id},function (data) {
                $rootScope.$broadcast('resouresGroupsDeleteSuccess', transferData);
                toastr.info('用户分组删除成功！');

                // 关闭
                cancel();
            },function (err) {
                toastr.info(err.data.message);
            })
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();