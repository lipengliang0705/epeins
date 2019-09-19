(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.data-dashboard')
        .controller('DataDashboardCtrl', DataDashboardCtrl);

    DataDashboardCtrl.$inject = ['$filter', '$timeout', '$uibModalInstance', 'DataDashboard', 'data', 'NgTableParams', 'toastr', '$rootScope', '$q'];

    function DataDashboardCtrl($filter, $timeout, $uibModalInstance, DataDashboard, data, NgTableParams, toastr, $rootScope, $q) {
        var vm = this;

        // data是type，
        console.log('传过来的数据', data);

        vm.cancel = cancel;
        vm.remove = remove;
        vm.options = options;

        vm.filter = data;
        // vm.filter = [];
        // console.log("vm.filter", vm.filter);

        var pagingParams = { page: 1, predicate: 'id', ascending: 'asc' };
        var paginationConstants = { itemsPerPage: 1000 };
        var initialParams = { count: 5 };
        var initialSettings = { counts: [] };

        vm.reload = function (row) {
            $rootScope.$broadcast('logSearchReloadSuccess', row);
            vm.cancel();
        }

        // init
        function loadAll() {
            // 需要查询"FORM_LUCENE" 和 "sql_spl"
            // $timeout(function() {
            //     // FORM_LUCENE
            //     DataDashboard.getDataDashboardByType(vm.filter, function(d) {
            //         var list = d;
            //         var datatable = new NgTableParams({ count: initialParams.count }, { counts: initialSettings.counts, dataset: list });
            //         vm.table = datatable;
            //     }, function(_e) {
            //         console.log(_e);
            //         toastr.error('error', _e);
            //     });
            // }, 200);

            // var list = getList();
            // console.log(list);
            $timeout(function () {
                $q.all(getList(vm.filter)).then(function (res) {
                    // console.log('列表数据', res, typeof res);
                    var list = [];
                    // 合并arr
                    angular.forEach(res, function (item, index) {
                        for (var i in item) {
                            // 筛选数据
                            if (item[i].id) {
                                list.push(item[i]);
                            }
                        }
                    })
                    console.log(list);
                    var datatable = new NgTableParams({ count: initialParams.count }, { counts: initialSettings.counts, dataset: list });
                    vm.table = datatable;
                })
            }, 200)

        }


        // 查询"FORM_LUCENE" 和 "sql_spl"两种类型的列表
        function getList(data) {
            var result = [];
            // angular.forEach(data, function(item, index) {
            //     console.log(data, item, index);

            // })
            angular.forEach(data, function (item, index) {
                console.log(item);
                result.push(function () {
                    var deferred = $q.defer();
                    // 调用接口
                    DataDashboard.getDataDashboardByType(item, function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject();
                    })
                    return deferred.promise;
                }());
            });
            return result;
        }

        // 删除
        function remove(row) {
            function onSaveSuccess(result) {
                loadAll();
                toastr.info('', '该记录已经被删除！');
            }

            function onSaveError() {
                toastr.error("", "删除记录时发生系统错误，请联系系统管理员核查！")
            }

            if (row.id !== null) {
                DataDashboard.delete({ 'id': row.id }, onSaveSuccess, onSaveError);
            }
        }

        // function getDate(date) {
        //     return $filter('date')(date, "yyyy-MM-dd HH:mm:ss");
        // }

        vm.filterFields = { 'is': ':', 'is_not': '!=', 'is_one_of': ':', 'is_not_one_of': '!=' };

        // 解析options字段，显示到页面
        function options(o, t) {
            // console.log(o, t);
            var json = angular.fromJson(o);
            if (t == 'FORM_LUCENE') {
                // console.log(json);
                // var html = "";
                // if (json.appInfo && json.appInfo.dateRange && json.appInfo.dateRange.startDate)
                //     html = "<p>起始时间：" + formatShowTime(json.appInfo.dateRange.startDate) + " - " + formatShowTime(json.appInfo.dateRange.endDate) + "</p>";
                // if (json.appInfo && json.appInfo.title) html = html + "<p>应用：" + json.appInfo.title + "</p>";
                // if (json.queryParams && json.queryParams.queryString) html = html + "<p>查询语句：" + json.queryParams.queryString + "</p>";
                // if (json.queryParams && json.queryParams.filterFields) {
                //     console.log(json.queryParams.filterFields);
                //     var fields = "";
                //     _.forEach(json.queryParams.filterFields, function (v, k) {
                //         var field = "";
                //         if (vm.filterFields[k]) {
                //             _.forIn(v, function (value, key) { field = key + vm.filterFields[k] + value; });
                //             fields = fields + field + ";"
                //         } else {
                //             if (k == 'does_not_exist') _.forIn(v, function (value, key) { field = "not exists:" + value; });
                //             if (k == 'exists') _.forIn(v, function (value, key) { field = "exists:" + value; });
                //             if (field) fields = fields + field + ";"
                //         }
                //     });
                //     if (fields) html = html + "<p>高级过滤：" + fields + "</p>";
                // }

                var html = "";
                if (json.timeParams) {
                    html = "<p>起始时间：" + formatShowTime(json.timeParams.startDate) + " - " + formatShowTime(json.timeParams.endDate) + "</p>";
                }
                if (json.app) {
                    html = html + "<p>应用：" + json.app.title +"</p>";
                }
                if (json.config) {
                    html = html + "<p>查询语句：" + json.config.query + "</p>";
                }
                return html;
            } else if (t == 'sql_spl') {
                // var html = "";
                // if (json.queryParams && json.queryParams.startTime)
                //     html = "<p>起始时间：" + formatShowTime(json.queryParams.startTime) + " - " + formatShowTime(json.queryParams.endTime) + "</p>";
                // if (json.queryParams && json.queryParams.queryString) html = html + "<p>查询语句：" + json.queryParams.queryString + "</p>";
                var html = "";
                if (json.timeParams) {
                    html = "<p>起始时间：" + formatShowTime(json.timeParams.startDate) + " - " + formatShowTime(json.timeParams.endDate) + "</p>";
                }
                if (json.config) {
                    html = html + "<p>查询语句：" + json.config.query + "</p>";
                }
                return html;
            } else {
                return "选项";
            }

        }

        // 格式化显示时间
        function formatShowTime(data) {
            if (data) return moment(data).format("YYYY/MM/DD HH:mm:ss");
        };

        // 关闭
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        // 初始化
        loadAll();
    }
})();