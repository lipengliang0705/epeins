(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.logSearch')
        .controller('logSearchCtrl', logSearchCtrl);
    // logSearchCtrl.$inject = ['$scope', '$stateParams', '$log', '$q', '$sce', '$state', '$timeout', '$filter', 'EsService', 'Principal', 'EventRule', '$uibModal'];

    function logSearchCtrl($scope, $stateParams, $log, $q, $sce, $state, $timeout, $filter, EsService, Principal, EventRule, $uibModal, DataDashboard, toastr, $window) {
        moment.locale('zh-cn');
        var vm = this;

        // 是否展示下拉框
        vm.defaultDropDownMeun = {
            isShow: false,
            list: [
                { sql: "(*)  |stats pct(apache.resp_len, 25,50,75,95,99)" },
                { sql: "(*)  |stats pct(apache.resp_len, 25,50,75,95,99)" },
                { sql: "(*)  |stats pct(apache.resp_len, 25,50,75,95,99)" },
                { sql: "(*)  |stats pct(apache.resp_len, 25,50,75,95,99)" },
            ]
        }

        // 展示结果切换
        vm.logResult = {
            currentIndex: 0, // 当前选中
            list: [
                { name: "事件" }
            ]
        }


        vm._ = _;
        vm.startTime = $stateParams['startTime'] || '';
        vm.endTime = $stateParams['endTime'] || '';
        vm.changeView = changeView;
        vm.queryParams = {};
        vm.queryParams.filterFields = {}
        vm.queryParams.filterFieldsShow = true;
        vm.getCategoryList = getCategoryList;
        vm.getFields = getFields;
        vm.addfiltered = addfiltered;
        vm.removefultered = removefultered;
        vm.openDownload = openDownload;
        vm.selectedFields = [];
        vm.unSelectFields = [];
        vm.filter = {};
        vm.select_type = {};
        vm.tabActive = 0;
        // 表格的行
        vm.gridOptions = {};
        vm.gridOptions.columnDefs = [];
        // 表的数据
        vm.gridOptions.data = [];
        vm.showDetil = showDetil;
        vm.getType = getType;
        // vm.strsearch = bulidQuery()|| {};

        vm.filtereds = {};
        vm.filtereds.entityFilter = {}; // 当前的filter 用于编辑filter
        vm.filtereds.addFilter = addFilter; // 增加条件
        vm.filtereds.rmFilter = rmFilter; // 删除条件
        vm.filtereds.editFilter = editFilter; // 删除条件
        vm.filtereds.filterList = [];

        vm.reTab = reTab;
        vm.searchLog = searchLog;
        vm.searchModel = "KEYWORD";
        vm.saveAsBtn = saveAsBtn;
        vm.quickSearch = {}; // 快速检索
        vm.quickSearch.state = true;
        vm.loadQuickSearch = loadQuickSearch;
        //翻页
        vm.paginationConf = {
            totalItems: 100
        }

        // 时间选择
        vm.dateRange = {
            "startDate": vm.endTime || moment().subtract(2, 'year'), //moment().subtract(15, 'minute'),
            "endDate": vm.startTime || moment()
        }; //

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
                "applyLabel": "确定",
                "cancelLabel": "取消",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "自定义",
                "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                "firstDay": 1
            },
        }

        // 格式化显示时间
        vm.formatShowTime = formatShowTime;
        // 分页参数
        vm.paginationConf = {
            currentPage: 0,
            totalItems: 0,
            itemsPerPage: 15,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function() {
                vm.pagesize = vm.paginationConf.itemsPerPage;
                vm.pagefrom = vm.paginationConf.currentPage || 0;
                searchLog();
            }
        };

        vm.method = {
            showMenuList: showMenuList,
            hideMenuList: hideMenuList,
            logResultToggle: logResultToggle
        }

        loadAll();

        function loadAll() {
            vm.getCategoryList()

        };
        //切换业务
        function changeView() {
            getTypeList();
        };
        //获取业务列表
        function getCategoryList() {
            EventRule.query({}, onSuccess, onError);

            function onSuccess(res) {
                var appList = res.map(function(d) {
                    return d['category']
                })
                vm.appList = _.uniqBy(appList, 'name')
            };

            function onError(err) {
                console.log(err)
            };
        };
        //获取类型
        function getTypeList() {
            if (vm.app) {
                EventRule.getTypeList({ category_id: vm.app.id }, onSuccess, onError);
            }

            function onSuccess(res) {
                vm.typeList = res;
                console.log('vm.typeList1------', vm.typeList);
                vm.select_type = {};
                angular.forEach(vm.typeList, function(t) {
                    vm.select_type[t.name] = true;
                    t.fields.map(function _fun(d) {
                        d.show = false;
                        d.filterHideOrShow = false;
                        d.showOrHide = function() { // 单击收回 取消
                            d.show = !d.show;
                        }
                        d.onOff = function() {
                            d.filterHideOrShow = !d.filterHideOrShow
                        }
                        d.findFilter = function(key, val) {
                            if (!vm.queryParams.filterFields['is']) {
                                vm.queryParams.filterFields['is'] = {}
                            }
                            vm.queryParams.filterFields['is'][key] = val
                                // resetTab();
                        }
                    });

                })
                getFields()
            };

            function onError(err) {
                console.log(err)
            };
        };
        // 根据类型 获取所有类型下的字段
        function getFields() {
            vm.selectedFields = []
            vm.selectedFields.push({
                name: "timestamp",
                title: "时间戳",
                enableDel: false
            }); // 默认的timestamp字段
            vm.selectedFields.push({
                name: "@message",
                title: "日志消息",
                enableDel: false
            }); // 默认的message字段
            var result = []
            var type = vm.select_type;
            var types = []; // 所有选中的type
            for (var d in type) {
                if (type[d]) { // 只过滤值为true的type
                    types.push(d);
                }
            }
            var list = _.isEmpty(vm.typeList) ? [] : vm.typeList;
            if (types && types.length != 1) {
                result = [];
            } else {
                result = (_.find(list, { name: types[0] }))['fields']
            }
            vm.fieldsList = result.map(function(_f) {
                return _f['name']
            })
            vm.unSelectFields = result;
            vm.fieldsCountList = result;

            console.log('字段选择的字段');

            console.log(vm.fieldsCountList);
            // console.log(vm.unSelectFields, '0000-------unSelectFields')
        };
        /**
         * 增加到已选过滤事件
         **/
        function addfiltered(d) {
            vm._.remove(vm.unSelectFields, d);
            d.enableDel = true;
            if (!(d.name == 'timestamp' || d.name == "@massage")) {
                vm.selectedFields.push(d);
            }
            searchLog();
        };
        /**
         *  从已过滤字段加入待选字段
         **/
        function removefultered(d) {
            vm._.remove(vm.selectedFields, d);
            vm.unSelectFields.push(d);
            searchLog();
        };

        // 格式化显示时间
        function formatShowTime(data) {
            return moment(data).format("YYYY/MM/DD HH:mm:ss");
        };

        // 获取es的_type
        function getType() {
            var result = [];
            for (var d in vm.select_type) {
                if (vm.select_type[d])
                    result.push(d);
            }
            // console.log(result, 'result-----------------------------result')
            return result;
        };

        function bulidQuery() {
            vm.queryParams.index = vm.app ? vm.app.alias + '*' : '',
                angular.forEach(vm.select_type, function(v, k) {
                    vm.queryParams.types.push(k)
                })
            vm.queryParams.startTime = moment(vm.dateRange.startDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
            vm.queryParams.endTime = moment(vm.dateRange.endDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
            // queryParams.fields = vm.fieldsList;
            if (vm.select_type) {
                vm.queryParams.types = getType()
            }
            if (vm.filter.q) {
                vm.queryParams.queryString = vm.filter.q;
            } else {
                vm.queryParams.queryString = undefined;
            }
            if (vm.queryParams.types.length == 1) {
                vm.queryParams.fields = vm.fieldsList;
            }
            if (vm.pagesize || vm.pagefrom) {
                vm.queryParams.size = vm.pagesize;
                vm.queryParams.from = vm.pagefrom;
            }
            // if(vm.queryParams.filterFields.length > 0){

            // }

            return vm.queryParams;
        };

        function searchLog() {
            // 刷新图表
            // vm.changeView();

            // 关闭下拉框
            vm.defaultDropDownMeun.isShow = false;
            var queryBody = bulidQuery();
            queryBody.filterFields = vm.queryParams.filterFields;
            EsService.getLogInfo.post(queryBody, onSuccess, onError);

            function onSuccess(v) {
                vm.errorMsg = null;
                vm.strsearch = bulidQuery();
                var data = v.hit || [];
                vm.getAggregations = v.aggregations?v.aggregations[0]:'';
                // console.log( vm.getAggregations)
                vm.paginationConf.totalItems = v.totalHits[0];
                vm.gridOptions.columnDefs = vm.selectedFields;
                var dataRow = [];
                data.map(function(_d) {
                    var _dataRow = [];
                    var hideRow = function(row) {
                        var arr = ['@message', 'source', 'score', 'hightlight', 'sort']; // 这些字段都是不在页面显示的
                        if (arr.indexOf(row) == -1)
                            return false;
                        else
                            return true;
                    }
                    vm.selectedFields.forEach(function(d) {
                        // 替换高亮

                        if (_d.hightlight && _d.hightlight[d.name]) { // 替换高亮
                            _d.source[d.name] = "";
                            _d.source[d.name] = _d.hightlight[d.name];
                        }
                        _dataRow.push({
                            "name": d.name,
                            "value": _d.source[d.name],
                        });
                    })
                    dataRow.push({
                        "dataRow": _dataRow,
                        "showOrHide": false,
                        "allData": _d.source,
                        "heard": _d,
                        "hideRow": hideRow
                    });
                })
                vm.gridOptions.data = dataRow;
            };

            function onError(err) {
                toastr.error("查询出错，", err);
                // vm.errorMsg = "语法错误: 高级语法查询field1:value1，不要单独使用特殊符号";
            };
        }

        function searchLog_allbak() {

            // 模式
            switch (vm.searchModel) {
                case "KEYWORD":
                    vm.tabActive = 0;
                    // console.log("vm.filterInput", vm.filterInput);
                    var queryBody = bulidQuery();
                    queryBody.filterFields = vm.queryParams.filterFields;
                    EsService.getLogInfo.post(queryBody, onSuccess, onError);

                    function onSuccess(v) {
                        vm.errorMsg = null;
                        vm.strsearch = bulidQuery();
                        var data = v.hit || [];
                        vm.getAggregations = v.aggregations[0];
                        // console.log( vm.getAggregations)
                        vm.paginationConf.totalItems = v.totalHits[0];
                        vm.gridOptions.columnDefs = vm.selectedFields;
                        var dataRow = [];
                        data.map(function(_d) {
                            var _dataRow = [];
                            var hideRow = function(row) {
                                var arr = ['@message', 'source', 'score', 'hightlight', 'sort']; // 这些字段都是不在页面显示的
                                if (arr.indexOf(row) == -1)
                                    return false;
                                else
                                    return true;
                            }
                            vm.selectedFields.forEach(function(d) {
                                // 替换高亮

                                if (_d.hightlight && _d.hightlight[d.name]) { // 替换高亮
                                    _d.source[d.name] = "";
                                    _d.source[d.name] = _d.hightlight[d.name];
                                }
                                _dataRow.push({
                                    "name": d.name,
                                    "value": _d.source[d.name],
                                });
                            })
                            dataRow.push({
                                "dataRow": _dataRow,
                                "showOrHide": false,
                                "allData": _d.source,
                                "heard": _d,
                                "hideRow": hideRow
                            });
                        })
                        vm.gridOptions.data = dataRow;
                    };

                    function onError(err) {
                        toastr.error("查询出错，", err);
                        // vm.errorMsg = "语法错误: 高级语法查询field1:value1，不要单独使用特殊符号";
                    };
                    break;
                case "SPL":
                    vm.tabActive = 2;
                    console.log(vm.searchModel);
                    // vm.selectIndex = JSON.parse(vm.app);
                    vm.selectIndex = vm.app;
                    console.log("SPL ... todo");
                    vm.splApp = {
                        "name": $scope.defaultApp
                    };
                    vm.searchModel = 'SPL';
                    vm.splExpression = vm.filter.q;
                    break;
                case "SQL":
                    vm.tabActive = 2;
                    vm.searchModel = 'SQL';
                    vm.splExpression = vm.filter.q;
                    EsService.logSearchForSql().post({ sql: vm.filter.q });
                    console.log("SQL ... todo");
                    break;
                default:
                    break;

            }
        };

        /**
         * 另存为恩妞
         **/

        function saveAsBtn() {
            var queryParams = angular.copy(vm.queryParams);
            queryParams.queryString = vm.filter.q;
            var timeParam = {};
            timeParam.startTime = vm.dateRange.startDate;
            timeParam.endTime = vm.dateRange.endDate;
            $state.go('log-saveAs', { data: { appInfo: vm.app, queryParams: queryParams, timeParam: timeParam } });
            console.log('queryParams-----', queryParams)
        };

        refreshUserPred();
        // 刷新用户保存条件
        function refreshUserPred() {
            DataDashboard.getDataDashboardByType({ type: 'FORM_LUCENE' }, onSuccess, onError);

            function onSuccess(d) {
                // vm.quickSearch.list = d;
                vm.quickSearch.list = d;
                vm.quickSearch.list.map(function(_d) {
                    _d.selectUserView = function(__d) {
                        console.log(JSON.parse(__d.options || {}), '___d');
                        vm.queryParams = JSON.parse(__d.options || {}).queryParams;
                        vm.filter.q = vm.queryParams.queryString;
                        vm.app = JSON.parse(__d.options || {}).appInfo;
                        // vm.dateRange.startDate = moment(vm.queryParams.startTime).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
                        // vm.dateRange.endDate = moment(vm.queryParams.endTime).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z"); 
                        vm.dateRange.startDate = moment(vm.queryParams.startTime);
                        vm.dateRange.endDate = moment(vm.queryParams.endTime);
                        vm.quickSearch.selectStatus = __d.id;
                        searchLog();
                    }
                });
            };

            function onError(_e) {
                toastr.error('error', _e);
            };
        };

        //显示详细
        function showDetil(d) {
            vm.gridOptions.data.map(function(_d) {
                if (_d == d) _d.showOrHide = !d.showOrHide;
            })
        };

        // addFilter
        function addFilter(obj) {
            vm.filtereds.entityFilter = {}; // 清空实体
            var symbol = obj.symbol ? obj.symbol.value : '';
            var field = obj.field ? obj.field.name : '';
            var value = obj.value || '';

            var type = 'is'; // 默认为must(is)
            var filter = {};
            switch (symbol) {
                case "IS":
                    var type = 'is';
                    filter = {};
                    filter[field] = value;
                    break;
                case "NOT IS":
                    var type = 'is_not';
                    filter = {};
                    filter[field] = value;
                    break;
                case "IS ONE OF":
                    var type = 'is_one_of';
                    filter = {};
                    filter[field] = value;
                    break;
                case "IS NOT ONE OF":
                    var type = 'is_not_one_of';
                    filter = {};
                    filter[field] = value;
                    break;
                case "EXISTS":
                    var type = 'exists';
                    filter = {};
                    filter['key'] = field;
                    break;
                case "DOES NOT EXIST":
                    var type = 'does_not_exist';
                    filter = {};
                    filter['key'] = field;
                    break;
                default:

            }

            if (!vm.queryParams.filterFields[type])
                vm.queryParams.filterFields[type] = {};


            angular.forEach(filter, function(v, k) {
                vm.queryParams.filterFields[type][k] = v;
            })

            vm.filtereds.filterStatus = false;
        };

        // 删除filter方法
        function rmFilter(t, type) {
            var _type = type || 'is';
            console.log(vm.queryParams.filterFields[_type], 'ppp')
            delete vm.queryParams.filterFields[_type][t.name];
            searchLog();
        };

        // 修改filter方法
        function editFilter(type, obj) {
            console.log(type, obj, "------")
            var _type = type || 'is';
            vm._.remove(vm.queryParams.filterFields[_type], function(v, b) {
                console.log(v, b, '000')
                    // return v.term == t || v.exists == t;
            });

            vm.filtereds.entityFilter = obj;
            vm.filtereds.filterStatus = true;
        };

        //openDownload
        function openDownload() {
            var data = {
                "queryParams": bulidQuery(),
                appInfo: vm.app
            };
            $state.go('log-download', data, { reload: false })
        };

        // 重定向到统计视图
        function reTab(selected, field) {

            /**
             *   0 事件计数
             *   1 字段值统计
             *   2 字段值分类
             *   3 累计百分比
             *   4 数值分段统计
             *   5 时间分段统计
             **/
            vm.tabActive = 0;
            vm.viewParams = {};
            vm.viewParams.selected = selected || 0;
            vm.viewParams.fields = field;
        };

        function loadQuickSearch() {
            refreshUserPred();
        }


        /**
         * 展示下拉选择框
         */
        function showMenuList() {
            console.log(111);
            vm.defaultDropDownMeun.isShow = true;
        }

        /**
         * 关闭下拉框，执行一次自动查询
         * @param {*} item 
         */
        function hideMenuList(item) {
            console.log(item);
            vm.filter.q = item.sql;
            vm.defaultDropDownMeun.isShow = false;
            vm.searchLog('query');
        }

        function logResultToggle(index) {
            vm.logResult.currentIndex = index;
        }


        $scope.$watch("vm.queryParams.filterFields", function(n, o) {
            console.log(n, o);
            if (n == null || angular.equals({}, n)) {
                vm.queryParams.filterFieldsShow = false;
            } else {
                vm.queryParams.filterFieldsShow = true;
            }
        }, true)

        $scope.$watch("vm.select_type", function(n, o) {
            if (n && vm.app) {
                searchLog()
            }
        }, true)

        $scope.$watch("vm.filter.q", function(n, o) {
            if (n && n != o) {
                /**
                 *   判断是否为spl
                 **/
                var isSpl = function(queryStr) {

                        return (queryStr.indexOf("|") == 0);
                    }
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
                // console.log(n);
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

        // $document.bind('click', function (event) {
        //     vm.defaultDropDownMeun.isShow = false;
        //     $scope.$apply();
        // })
        $window.onclick = function(event) {
            if (event.toElement.className.indexOf('euiFieldText') === -1) {
                vm.defaultDropDownMeun.isShow = false;
                $scope.$apply();
            }
        };
        // $scope.$watch("vm.filter.q", function (n, o) {
        //     if(n){
        //         bulidQuery().queryString = n
        //         console.log('wewe')
        //     }
        // }, true)


        $scope.$on('logSearchReloadSuccess', function(event, data) {
            console.log(data);
            console.log(JSON.parse(data.options))
        });

        // $scope.$on('echart-click',function (e, item) {
        //     console.log(item);
        //
        //     vm.dateRange={
        //         startDate:moment(item.name),
        //         endDate:vm.dateRange.minutesInterval?moment(item.name).subtract(-1,'minutes'):moment(item.name).subtract(-30,'minutes'),
        //         minutesInterval:1
        //     };
        //     // submit(true, true);
        // });
    };
})();