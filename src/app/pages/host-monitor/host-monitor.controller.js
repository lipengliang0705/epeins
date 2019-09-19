(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.host-monitor')
        .controller('HostMonitorController', HostMonitorController);

    HostMonitorController.$inject = ['HostMonitor', '$scope', 'NgTableParams', 'toastr', '$filter', '$stateParams', 'AgentRule', '$uibModal','$rootScope'];

    function HostMonitorController(HostMonitor, $scope, NgTableParams, toastr, $filter, $stateParams, AgentRule, $uibModal,$rootScope) {
        moment.locale('zh-cn');
        var vm = this;

        vm.dateRange = {
            "startDate": moment().subtract(7, 'day'),
            "endDate": moment()
        };
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
        }
        vm.param = {};
        vm.agents = [];

        vm.searchClick = searchClick;
        vm.showSettingModal = showSettingModal;

        init();

        var areaLineData = {
            labels: [1, 2, 3, 4, 5, 6, 7, 8],
            series: [
                [5, 9, 7, 8, 5, 3, 5, 4]
            ]
        };
        var areaLineOptions = {
            fullWidth: true,
            height: "300px",
            low: 0,
            showArea: true,
            showLine: false,
            showPoint: false,
            axisX: {
                showGrid: false
            }
        };
        var biLineData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            series: [
                [1, 2, 3, 1, -2, 0, 1],
                [-2, -1, -2, -1, -2.5, -1, -2],
                [0, 0, 0, 1, 2, 2.5, 2],
                [2.5, 2, 1, 0.5, 1, 0.5, -1]
            ]
        };
        var biLineOptions = {
            height: "300px",
            high: 3,
            low: -3,
            showArea: true,
            showLine: false,
            showPoint: false,
            fullWidth: true,
            axisX: {
                showGrid: false
            }
        };
        setTimeout(function () {
            new Chartist.Line('#area-chart', areaLineData, areaLineOptions);
            new Chartist.Line('#bi-chart', biLineData, biLineOptions);
        })

        function init() {
            events();
            getAgent();
            loadAll();
        }

        function events() {
            $rootScope.$on('host-monitor-setting-success', function (e,params) {
                console.log(params);
                vm.agent = params.agent;
                vm.searchWord = params.searchWord;
                vm.dateRange = params.dateRange;
            });
        }

        function getAgent() {
            AgentRule.query(function (result) {
                if (result) {
                    vm.agents = result;

                    if ($stateParams.agentId) {
                        vm.agent = result.filter(function (item) {
                            return item.id == $stateParams.agentId;
                        })[0];
                        console.log(vm.agent);
                    } else {
                        vm.agent = vm.agents[0];
                    }
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

        function loadAll() {

        }

        function searchClick() {
            loadAll();
        }

        // 设置
        function showSettingModal() {
            $uibModal.open({
                templateUrl: 'app/pages/host-monitor/setting/setting.html',
                controller: 'SettingController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    entry: {agent: vm.agent,searchWord:vm.searchWord,dateRange:vm.dateRange}
                }
            });
        }

    }
})();
