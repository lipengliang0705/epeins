(function() {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.controller("addClassifyController", addClassifyController);
    addClassifyController.$inject = ['$uibModalInstance', 'knowledgeBaseService', 'toastr', '$rootScope', '$state'];

    function addClassifyController($uibModalInstance, knowledgeBaseService, toastr, $rootScope, $state) {
        var vm = this;

        vm.data = {
            title: '',
        };

        vm.method = {
            submit: submit,
            cancel: cancel
        }
        function submit() {
            var item = {
                title: vm.data.title,
            };
            // 调接口，储存
            console.log(99991,item);
            knowledgeBaseService.createKcategory(item, function (res) {
                //console.log(9999,item);
                if (res.status == 0) {
                    // 储存成功后，跳转到列表页，并且刷新页面
                    toastr.success('添加成功！','成功提示');
                    $rootScope.$broadcast('createKcategorySuccess');
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