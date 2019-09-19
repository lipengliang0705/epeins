(function() {
    'use strict';
    /**
     * @ 删除仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.file-place-recovery');
    app.controller("DeleteController", DeleteController);
    DeleteController.$inject = ['$uibModalInstance', 'transferData', '$rootScope', 'toastr','FilePlaceService','FilePlaceRecoveryService'];

    function DeleteController($uibModalInstance, transferData, $rootScope, toastr,FilePlaceService,FilePlaceRecoveryService) {
        var vm = this;
        // vm.data = {
        //     id: transferData
        // }
        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function submit() {
            // transferData
            delSnapshot(transferData.snapshot);
        }

        function delSnapshot(snapshotName) {
            vm.isLoading=true;
            var params={
                snapshotName:snapshotName
            };
            FilePlaceRecoveryService.remove(params,function (res) {
                // res=acknowledged: true
                vm.isLoading=false;
                if(res.acknowledged){

                    toastr.success('操作成功！','成功提示');
                    cancel();
                    $rootScope.$broadcast('delete-snapshot-success');
                }else{
                    toastr.error('操作失败！','失败提示');
                }
            },function (err) {
                vm.isLoading=false;
                toastr.error('操作失败！','失败提示');
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();