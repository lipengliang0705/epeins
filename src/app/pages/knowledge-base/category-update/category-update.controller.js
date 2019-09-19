(function() {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.controller("categoryUpdateController", categoryUpdateController);
    categoryUpdateController.$inject = ['$uibModalInstance', 'knowledgeBaseService', 'transferData', 'toastr', '$rootScope', '$state'];

    function categoryUpdateController($uibModalInstance, knowledgeBaseService, transferData, toastr, $rootScope, $state) {
        var vm = this;
        console.log(transferData);
        vm.data = {
            id: transferData.id,
            title:  transferData.title,
        }

        vm.method = {
            submit: submit,
            cancel: cancel
        }
        function submit() {
            //修改后的参数
            var kcat = {
                id: vm.data.id,
                title: vm.data.title,
            };
            // 调接口，储存
            knowledgeBaseService.modifyCategory(kcat, function (res) {
                console.log(88888899,res);
                // 检测到id
                if (res.id) {
                    // 储存成功后，跳转到列表页，并且刷新页面
                    toastr.success('修改成功！','成功提示');
                    // 储存成功后，跳转到列表页，并且刷新页面
                    $rootScope.$broadcast('modifyKcategorySuccess');
                    //$state.go('knowledge-base-list');
                }

            })
            cancel();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();