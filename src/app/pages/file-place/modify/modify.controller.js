(function() {
    'use strict';
    /**
     * @ 修改仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.file-place');
    app.controller("filePlaceModifyController", filePlaceModifyController);
    filePlaceModifyController.$inject = ['$uibModalInstance', 'transferData', '$rootScope', 'toastr'];

    function filePlaceModifyController($uibModalInstance, transferData, $rootScope, toastr) {
        var vm = this;
        console.log(transferData);
        vm.data = {
            name: transferData.name,
            status: transferData.status,
            fileSize: transferData.fileSize,
        }
        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function init() {
            // 初始化
        }

        
        function submit() {
            //修改后的参数
            var item = {
                name: vm.data.name,
                status: vm.data.status,
                fileSize: vm.data.fileSize,
            }

            // 调接口，储存
            // 储存成功后，跳转到列表页，并且刷新页面
            $rootScope.$broadcast('modifyFilePlaceSuccess', item);
            toastr.success('归档修改成功！');

            // 关闭
            cancel();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        init();
    }
})();