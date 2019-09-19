(function() {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.medium-manage');
    app.controller("mediumManageAddController", mediumManageAddController);
    mediumManageAddController.$inject = ['$uibModalInstance', 'toastr', '$rootScope', '$state'];

    function mediumManageAddController($uibModalInstance, toastr, $rootScope, $state) {
        var vm = this;

        vm.data = {
            name: '',
            status: '',
            startTime:'',
            endTime:'',
            fileSize: ''
        };

        vm.method = {
            submit: submit,
            cancel: cancel
        }
        // 开始时间
        vm.startTimeOpts = {
            date: new Date(),
            isOpen: false,
            openCalendar: function (e) {
                e.preventDefault();
                e.stopPropagation();
                vm.startTimeOpts.isOpen = true;
            }
        }
         
        // 结束时间
        vm.endTimeOpts = {
            date: new Date(),
            isOpen: false,
            openCalendar: function (e) {
                e.preventDefault();
                e.stopPropagation();
                vm.startTimeOpts.isOpen = true;
            }
        }
        function submit() {
            var item = {
                name: vm.data.name,
                status: vm.data.status,
                startTime:vm.startTimeOpts.date,
                endTime:vm.endTimeOpts.date,
                fileSize: vm.data.fileSize,
                //layouts: JSON.stringify(vm.data.layouts)
            };
            $rootScope.$broadcast('addFilePlaceSuccess', item);
            toastr.success('新建归档成功！');
            // 调接口，储存
            // newDashboardService.add(item, function(res) {
            //     console.log(res);
            //     if (res.status == 0) {
            //         // 储存成功后，跳转到列表页，并且刷新页面
            //         $rootScope.$broadcast('addDashboardSuccess');
            //         toastr.success('仪表盘新建成功！');
            //     }

            // });
            // 关闭
            cancel();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();