(function() {
    'use strict';
    /**
     * @ 删除仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.file-place');
    app.controller("filePlaceDeleteController", filePlaceDeleteController);
    filePlaceDeleteController.$inject = ['$uibModalInstance', 'transferData', '$rootScope', 'toastr','FilePlaceService'];

    function filePlaceDeleteController($uibModalInstance, transferData, $rootScope, toastr,FilePlaceService) {
        var vm = this;
        // vm.data = {
        //     id: transferData
        // }
        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function submit() {
            var params={
                id:transferData.id,
                jobId:transferData.xxlJobJson?transferData.xxlJobJson.id:''
            };

            FilePlaceService.delete(params,function (res) {
                if(res.code===200){
                    $rootScope.$broadcast('deleteFilePlaceSuccess', transferData);
                    toastr.success('删除成功！','成功提示');
                    // 关闭
                    cancel();
                }else{
                    toastr.error(res.msg,'错误提示');
                }

            },function (err) {
                toastr.error('删除失败！','错误提示');
            });



        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();