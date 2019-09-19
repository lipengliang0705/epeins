(function () {
    'use strict';
    /**
     * @ 删除知识库
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.controller("categoryDeleteController", categoryDeleteController);
    categoryDeleteController.$inject = ['$uibModalInstance', 'knowledgeBaseService', 'transferData', '$rootScope', 'toastr'];

    function categoryDeleteController($uibModalInstance, knowledgeBaseService, transferData, $rootScope, toastr) {
        var vm = this;
        vm.data = {
            id: transferData.id,
        }
        vm.method = {
            submit: submit,
            cancel: cancel
        }
        function submit(id) {
            knowledgeBaseService.deleteCategory({ id: vm.data.id }, function (res) {
                console.log(676767,res.id);
                if (res.status == 200) {
                    //请求删除数据
                    $rootScope.$broadcast('deleteKcategorySuccess', transferData);
                    toastr.success('删除成功！', '成功提示');
                    // 关闭
                    cancel();
                }

            });


        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();