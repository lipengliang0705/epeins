(function () {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.host-monitor');
    app.controller("SettingController", SettingController);
    SettingController.$inject = ['$uibModalInstance', 'toastr', '$rootScope', '$state', 'EventRule', 'entry', 'AgentRule'];

    function SettingController($uibModalInstance, toastr, $rootScope, $state, EventRule, entry, AgentRule) {
        var vm = this;


        vm.dateRangeOptions = {
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
            },
        };
        vm.agent = entry.agent || {};
        vm.searchWord = entry.searchWord || '';
        vm.dateRange = entry.dateRange || {
            "startDate": moment().subtract(7, 'day'),
            "endDate": moment()
        };
        vm.agents = [];


        vm.method = {
            submit: submit,
            cancel: cancel,
        }

        loadAll();

        function loadAll() {
            getAgent();
        }

        function getAgent() {
            AgentRule.query(function (result) {
                if (result) {
                    vm.agents = result;

                    // if (entry.agentId) {
                    //     vm.agent = result.filter(function (item) {
                    //         return item.id == entry.agentId;
                    //     })[0];
                    //     console.log(vm.agent);
                    // } else {
                    //     vm.agent = vm.agents[0];
                    // }
                }
            });

            // HostMonitor.getHosts(function(result) {
            //     if(result){
            //         vm.hosts = result;
            //         vm.agent = vm.hosts[0];
            //     }
            //     console.log('getHosts', vm.hosts, vm.host);
            // });
        }


        function submit() {

            console.log(vm.agent);
            console.log(vm.searchWord);
            console.log(vm.dateRange);
            var params = {
                agent: vm.agent,
                searchWord: vm.searchWord,
                dateRange: vm.dateRange
            }
            $rootScope.$broadcast('host-monitor-setting-success', params);
            toastr.success('新建归档成功！');

            // 关闭
            cancel();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();