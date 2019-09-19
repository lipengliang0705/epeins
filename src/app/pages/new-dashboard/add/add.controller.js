(function() {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.controller("newDashboardAddController", newDashboardAddController);
    newDashboardAddController.$inject = ['$uibModalInstance', 'newDashboardService', 'toastr', '$rootScope', '$state'];

    function newDashboardAddController($uibModalInstance, newDashboardService, toastr, $rootScope, $state) {
        var vm = this;

        vm.data = {
            name: '',
            description: '',
            layouts: []
        };

        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function submit() {
            var item = {
                name: vm.data.name,
                description: vm.data.description,
                layouts: JSON.stringify(vm.data.layouts)
            };

            // 调接口，储存
            newDashboardService.add(item, function(res) {
                console.log(res);
                if (res.status == 0) {
                    // 储存成功后，跳转到列表页，并且刷新页面
                    $rootScope.$broadcast('addDashboardSuccess');
                    toastr.success('仪表盘新建成功！');
                }

            });
            // 关闭
            cancel();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();