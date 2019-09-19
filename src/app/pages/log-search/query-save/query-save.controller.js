(function() {
    'use strict';
    /**
     * @ 储存查询的图表
     * Author:Veiss Date:2019/6/23
     *  */
    var app = angular.module('LoginsightUiApp.page.logSearch');
    app.controller("logSearchStatisticViewQuerySaveCtrl", logSearchStatisticViewQuerySaveCtrl);

    logSearchStatisticViewQuerySaveCtrl.$inject = ['$uibModalInstance', 'newDashboardService', 'toastr', 'transferData'];

    function logSearchStatisticViewQuerySaveCtrl($uibModalInstance, newDashboardService, toastr, transferData) {
        var vm = this;

        console.log('接受到的数据', transferData);

        vm.data = {
            title: '',
            description: '',
            parameters: JSON.stringify(transferData)
        }
        vm.method = {
            submit: submit,
            cancel: cancel
        }

        function init() {}

        function submit() {
            // 处理
            // var _parameters = {
            //     app: vm.data.parameters.app,
            //     config: vm.data.parameters.config,
            //     query: vm.data.parameters.query
            // };
            // _parameters.query.minutesInterval = vm.data.parameters.interval;

            var params = {
                title: vm.data.title,
                description: vm.data.description,
                parameters: vm.data.parameters
            }

            console.log(params);

            // 接口传过去了99.9kb的数据，好忧伤...看后期有没有优化的空间. 解决2019/7/20
            newDashboardService.chartInfoAdd(params, function(res) {
                // console.log(params)
                if (res.id) {
                    toastr.success('图表储存成功');
                    // 关闭弹窗
                    cancel();
                }
            })
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        init();
    }
})();