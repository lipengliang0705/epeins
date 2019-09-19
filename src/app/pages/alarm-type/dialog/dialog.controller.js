(function () {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.alarm-type');
    app.controller("DialogController", DialogController);
    DialogController.$inject = ['$uibModalInstance', 'newDashboardService', 'toastr', '$rootScope', 'RoleManagement', 'transferData', 'AlarmTypeService'];

    function DialogController($uibModalInstance, newDashboardService, toastr, $rootScope, RoleManagement, transferData, AlarmTypeService) {
        var vm = this;

        vm.data=transferData||{};
        if(vm.data.id){
            vm.data.type+='';
        }

        console.log(vm.data);
        vm.method = {
            submit: submit,
            cancel: cancel,
        };

        function submit() {
            if(vm.data.id){
                udpate();
            }else{
                add();
            }
        }

        function add() {
            var data = angular.copy(vm.data);
            data.type=data.type*1;

            AlarmTypeService.create(data, function (data) {
                $rootScope.$broadcast('refresh-alarm-type', vm.data);
                toastr.success('添加成功！','成功提示');
                // 关闭
                cancel();
            }, function (err) {
                toastr.error(err.data.message,'错误提示');
            })
        }

        function udpate() {
            var data = angular.copy(vm.data);
            data.type=data.type*1;

            AlarmTypeService.update(data, function (data) {
                $rootScope.$broadcast('refresh-alarm-type', vm.data);
                toastr.success('修改成功！','成功提示');
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
