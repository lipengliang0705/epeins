(function() {
    'use strict';
    /**
     * @ 删除仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.file-place-recovery');
    app.controller("RestoreController", RestoreController);
    RestoreController.$inject = ['$uibModalInstance', 'transferData', '$rootScope', 'toastr','FilePlaceService','FilePlaceRecoveryService'];

    function RestoreController($uibModalInstance, transferData, $rootScope, toastr,FilePlaceService,FilePlaceRecoveryService) {
        var vm = this;
        // vm.data = {
        //     id: transferData
        // }
        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function submit() {
            restoreIndice(transferData.snapshot);
        }

        function restoreIndice(snapshot) {
            var params={
                snapshotName:snapshot
            }
            FilePlaceRecoveryService.restore(params,function (res) {
                toastr.success('恢复成功！','成功提示');
                cancel();
                // if(res.code===200){
                //     toastr.success('恢复成功！','成功提示');
                // }else{
                //     toastr.error('恢复失败！','失败提示');
                // }
            },function (err) {
                toastr.error('恢复失败！','失败提示');
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();