(function () {
    'use strict';
    /**
     * @ 删除仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.alarm-type');
    app.controller("AlarmTypeDeleteController", AlarmTypeDeleteController);
    AlarmTypeDeleteController.$inject = ['$uibModalInstance', 'transferData', '$rootScope', 'toastr', 'AlarmTypeService'];

    function AlarmTypeDeleteController($uibModalInstance, transferData, $rootScope, toastr, AlarmTypeService) {
        var vm = this;

        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function submit() {
            AlarmTypeService.delete({id: transferData.id}, function (data) {
                $rootScope.$broadcast('refresh-alarm-type', transferData);
                toastr.success('删除成功！','成功提示');
                // 关闭
                cancel();
            }, function (err) {
                toastr.error(err.data.message,'错误提示');
            })
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();