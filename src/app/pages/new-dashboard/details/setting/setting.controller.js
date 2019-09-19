(function() {
    'use strict';
    /**
     * @ 图表设置
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.controller("newDashboardDetailsSettingController", newDashboardDetailsSettingController);

    newDashboardDetailsSettingController.$inject = ['$scope', '$uibModalInstance', '$rootScope', 'newDashboardService', 'transferData', '$timeout', 'toastr'];

    function newDashboardDetailsSettingController($scope, $uibModalInstance, $rootScope, newDashboardService, transferData, $timeout, toastr) {
        var vm = this;

        console.log(transferData);

        vm.data = {
            id: transferData.id,
            currentIndex: 0,
            currentChartsType: '', // 图表类型
            date: {},
            dateRangeOptions: {
                "opens": "left",
                "timePicker": true,
                "timePicker24Hour": true,
                "ranges": {
                    '15分钟前': [moment().subtract(15, 'minute'), moment()],
                    '1个小时前': [moment().subtract(1, 'hour'), moment()],
                    '一天前': [moment().subtract(1, 'day'), moment()],
                    '三天前': [moment().subtract(3, 'day'), moment()],
                    '一周前': [moment().subtract(1, 'week'), moment()],
                    '当天': [moment().startOf('days'), moment()],
                    '当月': [moment().startOf('month'), moment().endOf('month')]
                },
                "locale": {
                    "format": "YYYY-MM-DD HH:mm:ss",
                    "separator": " ~ ",
                    "applyLabel": "应用",
                    "cancelLabel": "取消",
                    "fromLabel": "From",
                    "toLabel": "To",
                    "customRangeLabel": "自定义",
                    "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                    "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    "firstDay": 1
                }
            }
        }

        vm.resources = {
            menuList: [
                { name: '通用配置' },
                { name: '图表配置' },
                { name: '钻取配置' }
            ],
            chartsType: [
                { name: '饼图', value: 'pie' },
                { name: '折线图', value: 'line' },
                { name: '柱状图', value: 'bar' }
            ],
            details: []
        }

        vm.method = {
            submit: submit,
            cancel: cancel,
            formatTime: formatTime,
            selectedMenu: selectedMenu
        }

        function init() {
            // 图表详细信息
            details(vm.data.id);
        }

        // 格式化显示时间
        function formatTime(data) {
            return moment(data).format("YYYY/MM/DD HH:mm:ss");
        };

        // 图表详细信息
        function details(id) {
            newDashboardService.chartInfoById({ id: id }, function(res) {
                if (res.id) {
                    res.parameters = JSON.parse(res.parameters);
                    console.log(res);
                    vm.resources.details = res;

                    vm.data.date.startDate = vm.resources.details.parameters.params.startTime;
                    vm.data.date.endDate = vm.resources.details.parameters.params.endTime;

                    console.log(vm.data.date);

                    // 图表类型
                    vm.data.currentChartsType = vm.resources.details.parameters.charType;
                }
            })
        }

        // 切换menu
        function selectedMenu(index) {
            vm.data.currentIndex = index;
        }

        function submit() {
            // "id": 1,
            // "title": “xxx",
            // "description": “xx",
            // "parameters": "xxx"
            // 获取到最新的查询时间
            vm.resources.details.parameters.params.startTime = moment(vm.data.date.startDate).format();
            vm.resources.details.parameters.params.endTime = moment(vm.data.date.endDate).format();

            // 图表配置
            vm.resources.details.parameters.charType = vm.data.currentChartsType;

            var params = {
                id: vm.data.id,
                title: vm.resources.details.title,
                description: vm.resources.details.description,
                parameters: JSON.stringify(vm.resources.details.parameters)
            }

            console.log(params);

            // 储存查询字段
            newDashboardService.chartInfoModify(params, function(res) {
                if (res.id) {
                    toastr.success('配置更新成功');
                    // 回传id，用于刷新图表
                    $rootScope.$broadcast('echartSettingSuccess', { id: vm.data.id });
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
})()