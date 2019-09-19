(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.spl-sql-search')
        .controller('SplSqlSearchController', SplSqlSearchController);
    // logSearchCtrl.$inject = ['$scope', '$stateParams', '$log', '$q', '$sce', '$state', '$timeout', '$filter', 'EsService', 'Principal', 'EventRule', '$uibModal'];

    function SplSqlSearchController($scope, $stateParams, $log, $q, $sce, $state, $timeout, $filter, toastr, EsService, Principal, EventRule, DataDashboard) {
        var vm = this;

        vm.searchLog = searchLog;
        // vm.searchModel = "KEYWORD";
        vm.searchModel = 'SQL';
        vm.saveAsBtn = saveAsBtn;
        vm.quickSearch = {};
        // vm.queryParams = {};
        vm.filter = {
            q: 'select * from gdpoc*'
        };
        vm.formatShowTime = formatShowTime;
        vm.loadQuickSearch = loadQuickSearch;

        // 时间选择
        vm.dateRange = {
            "startDate": vm.endTime || moment().subtract(2, 'year'), //moment().subtract(15, 'minute'),
            "endDate": vm.startTime || moment()
        };
        vm.queryParams = {
            "types": [],
            "startTime": "",
            "endTime": "",
            "fields": [""],
            "from": "0",
            "size": "15",
            "sortFields": { "timestamp": "DESC" },
            "filterFields": {}
        }
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
        // 格式化显示时间
        function formatShowTime(data) {
            return moment(data).format("YYYY/MM/DD HH:mm:ss");
        };


        // 构建查询语句
        function bulidQuery() {
            vm.queryParams.startTime = moment(vm.dateRange.startDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
            vm.queryParams.endTime = moment(vm.dateRange.endDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");

            if (vm.filter.q) {
                vm.queryParams.queryString = vm.filter.q;
            } else {
                vm.queryParams.queryString = undefined;
            }

            // if(vm.queryParams.filterFields.length > 0){

            // }

            return vm.queryParams;
        };

        /**
         * 另存为按钮
         **/
        function saveAsBtn() {
            console.log('queryParams-----', vm.queryParams)
            var queryParams = angular.copy(vm.queryParams);
            queryParams.queryString = vm.filter.q || "";
            queryParams.startTime = vm.dateRange.startDate;
            queryParams.endTime = vm.dateRange.endDate;
            $state.go('spl-saveAs', { data: { queryParams: queryParams } });
            // console.log('queryParams-----',queryParams)
        };

        refreshUserPred();

        // 刷新用户保存条件
        function refreshUserPred() {
            DataDashboard.getDataDashboardByType({ type: 'sql_spl' }, onSuccess, onError);

            function onSuccess(d) {
                // vm.quickSearch.list = d;
                vm.quickSearch.list = d;
                vm.quickSearch.list.map(function(_d) {
                    _d.selectUserView = function(__d) {
                        //  console.log(JSON.parse(__d.options || {}), '___d'); 
                        vm.queryParams = JSON.parse(__d.options || {}).queryParams;
                        vm.filter.q = vm.queryParams.queryString;
                        vm.dateRange.startDate = moment(vm.queryParams.startTime);
                        vm.dateRange.endDate = moment(vm.queryParams.endTime);
                        vm.quickSearch.selectStatus = __d.id;
                        searchLog();
                    }
                });
            };

            function onError(_e) {
                toastr.error("查询出错 ", err);
            };
        };

        function loadQuickSearch() {
            refreshUserPred();
        }

        function searchLog() {
            console.log(vm.searchModel);
            // 模式
            switch (vm.searchModel) {
                case "SPL":
                    // vm.tabActive = 2;
                    // console.log(vm.searchModel);
                    // vm.selectIndex = JSON.parse(vm.app);
                    vm.selectIndex = vm.app;
                    // console.log("SPL ... todo");
                    vm.splApp = {
                        "name": $scope.defaultApp
                    };
                    vm.searchModel = 'SPL';
                    vm.splExpression = vm.filter.q;

                    EsService.logSearchForSpl().post({ "spl": vm.filter.q }, function(res) {
                        console.log(res);
                    }, function(err) {
                        console.log(err);
                    });

                    break;
                case "SQL":
                    vm.searchModel = 'SQL';
                    vm.splExpression = vm.filter.q;
                    console.log("-------");
                    EsService.logSearchForSql().post({ "sql": vm.filter.q }, function(res) {
                        console.log(res.hits.hits);
                        vm.errorMsg = null;
                        vm.strsearch = bulidQuery();
                    }, function(err) {
                        toastr.error("查询出错，", err);
                    });

                    break;
                default:
                    break;

            }
        };

        $scope.$watch("vm.filter.q", function(n, o) {
            if (n != o) {
                /**
                 *   判断是否为spl
                 **/
                var isSpl = function(queryStr) {
                    return (queryStr.indexOf("|") == 0);
                };
                /**
                 *   判断是否为keyword
                 **/
                var isKeyWord = function() {

                };
                /**
                 *   判断是否为sql
                 **/
                var isSql = function() {
                    return (queryStr.indexOf("select") == 0);
                };
                //  console.log(n);
                var queryStr = n.trim(); // 删除之前和之后的空格
                if (isSpl(queryStr)) {
                    vm.searchModel = "SPL";
                } else if (isSql(queryStr)) {
                    vm.searchModel = "SQL";
                } else {
                    vm.searchModel = "KEYWORD";
                }

                //  console.log(vm.searchModel);
            }
        })

    };
})();