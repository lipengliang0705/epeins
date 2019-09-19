(function() {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.file-place');
    app.controller("DataDictionaryDialogCtrl", DataDictionaryDialogCtrl);
    DataDictionaryDialogCtrl.$inject = ['$uibModalInstance', 'toastr', '$rootScope', '$state','transferData','DataDictionaryService'];

    function DataDictionaryDialogCtrl($uibModalInstance, toastr, $rootScope, $state,transferData,DataDictionaryService) {
        console.log(transferData);
        var vm = this;

        vm.data = transferData?angular.copy(vm.data = transferData):{
            "dictType": "",
            "dictKey": "",
            "dictValue": "",
            "description": "",
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
            if(vm.data.id){
                update(vm.data);
            }else{
                add(vm.data);
            }


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

        function add(params) {
            DataDictionaryService.save(params,function (res) {
                console.log(res);
                $rootScope.$broadcast('reloadDataDictionary');
                toastr.success('保存成功！','成功提示');
            })
        }

        function update(params) {
            DataDictionaryService.update(params,function (res) {
                console.log(res);
                $rootScope.$broadcast('reloadDataDictionary');
                toastr.success('保存成功！','成功提示');
            })
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();