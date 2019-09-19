(function () {
    'use strict';
    /**
     * 不使用api/search/es-info-search接口，关键字查询和高级查询数据返回不一样，非常的麻烦，更梁瑞沟通后，
     * 直接才用SQL和SPL的方式
     * 为了保持返回数据一致，方便做报表
     * Author：Veiss， Date：2019/7/27
     */
    var app = angular.module('LoginsightUiApp.page.logSearch');
    app.controller('logSearchNewCtrl', logSearchNewCtrl);

    logSearchNewCtrl.$inject = ['$scope', '$rootScope', '$stateParams', '$log', '$q', '$sce', '$state', '$timeout', '$filter', 'EsService', 'Principal', 'EventRule', '$uibModal', 'DataDashboard', 'toastr', '$window'];

    function logSearchNewCtrl($scope, $rootScope, $stateParams, $log, $q, $sce, $state, $timeout, $filter, EsService, Principal, EventRule, $uibModal, DataDashboard, toastr, $window) {
        moment.locale('zh-cn');
        var vm = this;

        // 变量管理
        vm.data = {
            app: '', // 选中的业务系统
            isSearch: true, // 搜索框时候可以用
            query: '', // 查询框
            baseQuery: {
                sql: '',
                spl: ''
            },
            // 是否展示下拉框,历史使用
            defaultDropDownMeun: {
                isShow: false,
                list: [
                    { sql: "select * from gdpoc* where @message like '%11G103709968%'", appName: 'gdpoc' },
                    { sql: '| source = gdpoc*', appName: 'gdpoc' },
                    { sql: '| source = gdpoc* @linenum > 50', appName: 'gdpoc' },
                    { sql: '| source = gdpoc* @linenum > 1 level = "16"', appName: 'gdpoc' },
                    // { sql: '| source = gdpoc*', appName: 'gdpoc' },
                    // { sql: "select * from enkalog*", appName: 'enkalog' },
                    // { sql: "select * from gdpoc* ", appName: 'gdpoc' },
                    // { sql: "select * from gdpoc* where @linenum > 50", appName: 'gdpoc' },
                    { sql: "select * from gdpoc* where @linenum > 5 and level like '%16%'", appName: 'gdpoc' },
                    { sql: 'select * from gdpoc* where Module like \'%t1/t2通道插件%\'', appName: 'gdpoc' },
                    { sql: "select * from gdpoc* where level like '%16%'", appName: 'gdpoc' },
                    { sql: "select * from gdpoc* where @linenum > 50 and ID = 12014", appName: 'gdpoc' },
                    { sql: "select * from gdpoc* order by @linenum desc", appName: 'gdpoc' },
                    // { sql: "select  count(*), max(@linenum), sum(@linenum) as sum, min(@linenum) , avg(@linenum) from gdpoc* group by ID", appName: 'gdpoc' }
                ]
            },
            // 展示结果切换
            logResult: {
                currentIndex: 0, // 当前选中
                list: [
                    { name: "事件" },
                    { name: '统计' }
                ]
            },
            // fields字段
            fields: {
                list: [],
                nodeList: [], // 全部的二级节点
            },

            // 查询方式
            search: {
                currentIndex: 0,
                current: { name: 'SQL' },
                list: [
                    { name: 'SQL' },
                    { name: 'SPL' }
                ]
            },

            // 提取到的type
            type: [],
            // 左侧节点
            filterList: [],
            // 图表数据
            tableList: [],

            // 传递的参数
            paramsOptions: [],

            // 分页
            page: {
                from: 0,
                size: 15
            },

            // 是否重置分页
            isRefreshCurrentPage: false
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

        // vm.reTab = reTab;
        // vm.searchLog = searchLog;
        vm.searchModel = "KEYWORD"; // 查询类型
        vm.saveAsBtn = saveAsBtn; // 另存为
        vm.quickSearch = {}; // 快速检索
        vm.quickSearch.state = true;

        // 时间选择
        vm.dateRange = {
            startDate: vm.endTime || moment().subtract(2, 'year'), //moment().subtract(15, 'minute'),
            endDate: vm.startTime || moment()
        };

        // 查询语句
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
            eventHandlers: {
                'apply.daterangepicker': function (event, picker) {
                    // 选择的时候重新赋值一次
                    vm.dateRangeOptions.ranges = {
                        '15分钟前': [moment().subtract(15, 'minute'), moment()],
                        '1个小时前': [moment().subtract(1, 'hour'), moment()],
                        '一天前': [moment().subtract(1, 'day'), moment()],
                        '三天前': [moment().subtract(3, 'day'), moment()],
                        '一周前': [moment().subtract(1, 'week'), moment()],
                        '当天': [moment().startOf('days'), moment()],
                        '当月': [moment().startOf('month'), moment().endOf('month')]
                    }
                }
            },
        }

        // 格式化显示时间
        vm.formatShowTime = formatShowTime;

        // 分页参数
        vm.paginationConf = {
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 15,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                vm.data.page.size = vm.paginationConf.itemsPerPage;
                vm.data.page.from = vm.paginationConf.currentPage || 1;
                submit(false);
            }
        };

        // 方法集合
        vm.method = {
            showMenuList: showMenuList, // 显示下拉框
            hideMenuList: hideMenuList, // 隐藏下拉框
            logResultToggle: logResultToggle, // 结果menu切换
            resetPopoverStaus: resetPopoverStaus, // 重置状态
            // filterNode: filterNode, // 过滤节点
            submit: submit,
            selectedSearchType: selectedSearchType, // 筛选查询方式
            isSearch: isSearch, // 是否可以搜索
            buildParamsOptions: buildParamsOptions, //组装参数
            buildEcharts: buildEcharts, // 刷新echarts
        }

        // 页面初始化
        function init() {
            getCategoryList();

            if ($stateParams.type && $stateParams.type == '1') {
                getStateParams();
            }
        };

        //切换业务
        function changeView() {
            getTypeList();
        };

        //获取业务列表
        function getCategoryList() {
            EventRule.query({}, function (res) {
                // 获取app列表
                var appList = res.map(function (d) {
                    return d['category']
                });
                // 过滤name相同的字段
                vm.appList = _.uniqBy(appList, 'name');
                console.log(vm.appList);
            }, function (err) {
                console.log(err);
            });
        };

        //获取类型,根据业务系统查询日志
        function getTypeList() {
            console.log('选择的业务系统', vm.app);
            if (vm.app) {
                EventRule.getTypeList({ category_id: vm.app.id }, function (res) {
                    // 日志来源的类型 [as_fund,oracle,tiandan]
                    vm.typeList = res;

                    // 业务系统下面的字段
                    vm.data.fields.list = res;

                    // 默认节点都不过滤
                    angular.forEach(vm.data.fields.list, function (item, index) {
                        item.status = true;
                        // 三级节点屏蔽和查询
                        angular.forEach(item.fields, function (val, i) {
                            val.filterAggregations = function (title, arr, status) {
                                console.log(arr);
                                // 循环获取到它的status，是否是选中状态
                                // is is_not is_one_of is_not_one_of
                                // 这种方式有问题
                                // ************************************************* // 
                                var filterFields = {};
                                // 如果选中一个，用is， 两个以上用 is_not_of
                                var filterArr = arr.filter(function (item, index) {
                                    return item.status == true;
                                });

                                console.log(filterArr, filterArr.length);

                                if (filterArr.length == 1) {
                                    filterFields['is'] = {};
                                } else {
                                    filterFields['is_one_of'] = {};
                                    filterFields['is_one_of'][title] = '';
                                }

                                angular.forEach(arr, function (item, index) {
                                    if (filterArr.length == 1 && item.status) {
                                        filterFields['is'][title] = item.value;
                                    } else if (filterArr.length != 1 && item.status) {
                                        if (index == arr.length - 1) {
                                            filterFields['is_one_of'][title] += (item.value);
                                        } else {
                                            filterFields['is_one_of'][title] += (item.value + ',');
                                        }
                                    }
                                });

                                // 对象合并
                                // vm.queryParams.filterFields = 
                                Object.assign(vm.queryParams.filterFields, filterFields);
                                // ************************************************* // 

                                // var _query = vm.filter.q;
                                // var _status = status ? 'OR' : 'NOT';
                                // var _str = '';


                                // // 采用数据添加到收索框的方式
                                // angular.forEach(arr, function(item, index) {
                                //     if (item.status) {

                                //     }
                                //     // if (filterArr.length == 1 && item.status) {
                                //     //     filterFields['is'][title] = item.value;
                                //     // } else if (filterArr.length != 1 && item.status) {
                                //     //     if (index == arr.length - 1) {
                                //     //         filterFields['is_one_of'][title] += (item.value);
                                //     //     } else {
                                //     //         filterFields['is_one_of'][title] += (item.value + ',');
                                //     //     }
                                //     // }
                                // });


                                // searchLog();
                                console.log(filterFields);
                            }
                        })
                    })

                    console.log('vm.typeList1------', vm.typeList);
                    vm.select_type = {};
                    angular.forEach(vm.typeList, function (t) {
                        vm.select_type[t.name] = true;
                        t.fields.map(function _fun(d) {
                            d.show = false;
                            d.filterHideOrShow = false;
                            d.showOrHide = function () { // 单击收回 取消
                                d.show = !d.show;
                            }
                            d.onOff = function () {
                                d.filterHideOrShow = !d.filterHideOrShow
                            }
                            d.findFilter = function (key, val) {
                                if (!vm.queryParams.filterFields['is']) {
                                    vm.queryParams.filterFields['is'] = {}
                                }
                                vm.queryParams.filterFields['is'][key] = val;
                                // resetTab();
                            }
                        });
                    })

                    getFields();
                }, function (err) {
                    console.log(err);
                });
            }
        };

        // function onChange(title, current, arr) {
        //     console.log(title, arr);
        //     angular.forEach(vm.getAggregations[title], function(item, index) {
        //         if (item != current) {
        //             item.status = false;
        //         }
        //     })
        // }

        // 系统二级节点过滤
        // function filterNode(item, $index, status) {
        //     vm.data.fields.list[$index].status = status;
        //     console.log(item);
        //     console.log();

        //     var types = [];
        //     // 获取到types，写入节点中做查询
        //     angular.forEach(vm.data.fields.list, function (item, index) {
        //         if (item.status) {
        //             types.push(item.name);
        //         }
        //     });

        //     console.log(types);
        //     var query = bulidQuery(types);

        //     query.types = types;

        //     console.log(query);

        //     searchLog(query);
        // }


        // 重置弹框的状态
        function resetPopoverStaus() {
            angular.forEach(vm.typeList, function (item, index) {
                item.fields.map(function (value, i) {
                    value.filterHideOrShow = false;
                })
            })
        }

        // 根据类型 获取所有类型下的字段
        function getFields() {
            console.log("已选类型", vm.typeList);

            // 选中的字段
            vm.selectedFields = [];

            // 默认的timestamp字段和默认的message字段
            vm.selectedFields.push({
                name: "timestamp",
                title: "时间戳",
                enableDel: false
            }, {
                name: "@message",
                title: "日志消息",
                enableDel: false
            });
            var result = [];
            var type = vm.select_type;

            // 筛选所有选中的type
            var types = [];
            for (var d in type) {
                if (type[d]) { // 只过滤值为true的type
                    types.push(d);
                }
            }

            var list = _.isEmpty(vm.typeList) ? [] : vm.typeList;

            // 判断系统是否只选择了一个二级节点，
            // 选择一个二级节点则展示二级节点下面的可筛选字段，否则不展示
            if (types && types.length != 1) {
                result = [];
            } else {
                result = (_.find(list, { name: types[0] }))['fields']
            }

            // 
            vm.unSelectFields = vm.fieldsCountList = result;
            console.log("选择二级节点集合", vm.unSelectFields);

            // 获取到二级节点的名称
            vm.fieldsList = result.map(function (_f) {
                return _f['name'];
            });

            var typesx = [];

            // 提取所有的二级节点名称
            angular.forEach(vm.typeList, function (item, index) {
                angular.forEach(item.fields, function (val, i) {
                    if (val.name != 'timestamp') {
                        typesx.push(val.name);
                    }
                })
            })

            vm.data.fields.nodeList = typesx;

            console.log("所有的二级节点", typesx);

            console.log('二级节点的名称', vm.fieldsList);

            // searchLog();
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
            // searchLog();
        };
        /**
         *  从已过滤字段加入待选字段
         **/
        function removefultered(d) {
            vm._.remove(vm.selectedFields, d);
            vm.unSelectFields.push(d);
            // searchLog();
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

        // 构建查询语句,用于调用接口查询日志
        function bulidQuery(types) {
            vm.queryParams.index = vm.app ? vm.app.alias + '*' : '';

            angular.forEach(vm.select_type, function (v, k) {
                vm.queryParams.types.push(k);
            });

            vm.queryParams.startTime = moment(vm.dateRange.startDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
            vm.queryParams.endTime = moment(vm.dateRange.endDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
            // vm.queryParams.fields = vm.fieldsList;
            vm.queryParams.fields = vm.data.fields.nodeList;
            vm.queryParams.filterFieldsShow = true;

            // 二级节点处理
            if (types != undefined) {
                vm.queryParams.types = types;
            } else if (vm.select_type) {
                vm.queryParams.types = getType();
            }
            if (vm.filter.q) {
                vm.queryParams.queryString = vm.filter.q;
            } else {
                vm.queryParams.queryString = undefined;
            }

            // if (vm.queryParams.types.length == 1) {
            //     // vm.queryParams.fields = vm.fieldsList;
            //     vm.queryParams.fields = vm.data.fields.nodeList;
            // }
            if (vm.pagesize || vm.pagefrom) {
                vm.queryParams.size = vm.pagesize;
                vm.queryParams.from = vm.pagefrom;
            }
            // if(vm.queryParams.filterFields.length > 0){

            // }

            console.log('查询语句', vm.queryParams);

            return vm.queryParams;
        };

        // 字段过滤
        // function filterTableDate(data) {
        //     console.log("表格数据", data);
        //     var result = [];
        //     // return result;
        //     return data;
        // }


        /**
         * 另存为，分为sql-spl 和 关键字
         * 暂时取消关键字储存 
         * Veiss
         * 2019/7/30
         **/
        function saveAsBtn() {
            // var queryParams = angular.copy(vm.queryParams);
            // queryParams.queryString = vm.filter.q;
            // var timeParams = {
            //     startTime: vm.dateRange.startDate,
            //     endTime: vm.dateRange.endDate
            // };
            var params = {
                app: vm.data.app,
                config: {
                    query: vm.data.query,
                    baseQuery: vm.data.baseQuery
                },
                timeParams: {
                    startTime: vm.dateRange.startDate,
                    endTime: vm.dateRange.endDate
                }
            };

            console.log('另存为的数据', params);
            // $state.go('log-saveAs', { data: { appInfo: vm.app, queryParams: queryParams, timeParam: timeParam } });
            $state.go('log-saveAs', { data: params });
            // console.log('queryParams-----', queryParams)
        };

        refreshUserPred();
        // 刷新用户保存条件
        function refreshUserPred() {
            DataDashboard.getDataDashboardByType({ type: 'FORM_LUCENE' }, onSuccess, onError);

            function onSuccess(d) {
                // vm.quickSearch.list = d;
                vm.quickSearch.list = d;
                vm.quickSearch.list.map(function (_d) {
                    _d.selectUserView = function (__d) {
                        console.log(JSON.parse(__d.options || {}), '___d');
                        vm.queryParams = JSON.parse(__d.options || {}).queryParams;
                        vm.filter.q = vm.queryParams.queryString;
                        vm.app = JSON.parse(__d.options || {}).appInfo;
                        // vm.dateRange.startDate = moment(vm.queryParams.startTime).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
                        // vm.dateRange.endDate = moment(vm.queryParams.endTime).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z"); 
                        vm.dateRange.startDate = moment(vm.queryParams.startTime);
                        vm.dateRange.endDate = moment(vm.queryParams.endTime);
                        vm.quickSearch.selectStatus = __d.id;
                        // searchLog();
                    }
                });
            };

            function onError(_e) {
                toastr.error('error', _e);
            };
        };

        //显示详细
        function showDetil(d) {
            vm.gridOptions.data.map(function (_d) {
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


            angular.forEach(filter, function (v, k) {
                vm.queryParams.filterFields[type][k] = v;
            })

            vm.filtereds.filterStatus = false;
        };

        // 删除filter方法
        function rmFilter(t, type) {
            var _type = type || 'is';
            console.log(vm.queryParams.filterFields[_type], 'ppp')
            delete vm.queryParams.filterFields[_type][t.name];
            // searchLog();
        };

        // 修改filter方法
        function editFilter(type, obj) {
            console.log(type, obj, "------")
            var _type = type || 'is';
            vm._.remove(vm.queryParams.filterFields[_type], function (v, b) {
                console.log(v, b, '000')
                // return v.term == t || v.exists == t;
            });

            vm.filtereds.entityFilter = obj;
            vm.filtereds.filterStatus = true;
        };

        // 导出数据
        function openDownload() {
            var data = {
                "queryParams": bulidQuery(),
                appInfo: vm.app
            };
            $state.go('log-download', data, { reload: false })
        };

        // 重定向到统计视图
        // function reTab(selected, field) {
        //     /**
        //      *   0 事件计数
        //      *   1 字段值统计
        //      *   2 字段值分类
        //      *   3 累计百分比
        //      *   4 数值分段统计
        //      *   5 时间分段统计
        //      **/
        //     vm.tabActive = 0;
        //     vm.viewParams = {};
        //     vm.viewParams.selected = selected || 0;
        //     vm.viewParams.fields = field;
        // };

        /**
         * 展示下拉选择框
         */
        function showMenuList() {
            vm.data.defaultDropDownMeun.isShow = true;
        }

        /**
         * 关闭下拉框，执行一次自动查询
         * @param {*} item 
         */
        function hideMenuList(item) {
            console.log(item);
            console.log(vm.appList);
            // vm.filter.q = item.sql;
            vm.data.query = item.sql;
            vm.data.defaultDropDownMeun.isShow = false;
            // vm.searchLog('query');

            angular.forEach(vm.appList, function (value, index) {
                if (value.alias == item.appName) {
                    vm.data.app = value;
                }
            })
        }

        /**
         * 切换视图查看
         * @param {*} index 
         */
        function logResultToggle(index) {
            vm.data.logResult.currentIndex = index;
            if (index == 0) {
                vm.method.buildEcharts();
            } else if (index == 1) {
                vm.method.buildParamsOptions();
            }
        }

        /**
         * 更具不同的查询方式，调用不同的数据接口
         * sql  /api/sql/http-sql
         * spl /api/spl-2-sql/spl-to-sql 转换成sql 在调用sql
         * keyworld  /api/search/es-info-search 接口
         */
        function submit(isRefreshCurrentPage) {
            // 刷新分页，重置到第一页
            vm.data.isRefreshCurrentPage = isRefreshCurrentPage;

            if (vm.data.search.current.name == 'SQL') {
                sqlSearch();
            } else if (vm.data.search.current.name == "SPL") {
                // 在这里组装spl语句
                splSearch();
            } else {
                // searchLog();
                console.log('查询出错');
            }
        }

        // spl查询 -> spl
        function splSearch() {
            var params = {
                'spl': bulidSearchQuery(vm.data.search.current.name, vm.data.query)
            }
            // 把查询语句储存起来，用于另存为
            vm.data.baseQuery.spl = params.spl;
            // 接口
            EsService.logSearchForSpl().post(params, function (res) {
                console.log("spl查询结果", res);
                // 解析成功
                if (res.sql.indexOf('select') > -1) {
                    sqlSearch(res.sql);
                } else {
                    toastr.error('查询错误');
                }
            }, function (err) {
                console.log(err);
            });
        }

        // sql查询,不能转换成keyworld查询
        function sqlSearch(sql) {
            console.log('ql查询,不能转换成keyworld查询', sql)
            var params = {
                sql: sql || bulidSearchQuery(vm.data.search.current.name, vm.data.query)
            }
            // 把查询语句储存起来，用于另存为
            vm.data.baseQuery.sql = params.sql;
            // 接口
            EsService.logSearchForSql().post(params, function (res) {
                console.log("sql查询结果", res);
                var result = res.hits.hits;
                // 提取type和type下面的字段
                console.log('表格数据', result);

                // 图表数据
                vm.data.tableList = result;

                var queryUpper = angular.copy(vm.data.query).toUpperCase();
                // 高亮代码, 小写，原生，大写
                var heightCode = codeHighlight(params.sql, vm.data.query, queryUpper);
                console.log('需要高亮的字段', heightCode);

                // 替换高亮
                angular.forEach(vm.data.tableList, function (item, index) {
                    for (var i in heightCode) {
                        item._source['@message'] = item._source['@message'].split(heightCode[i]).join('<em class="hlt1">' + heightCode[i] + '</em>');
                    }
                })


                // 重置到第一页
                if (vm.data.isRefreshCurrentPage) {
                    vm.paginationConf.currentPage = 1;
                }

                var _type = [];
                var _arr = [];
                angular.forEach(result, function (item, index) {
                    if (_type.indexOf(item._type) == -1) {
                        _type.push(item._type);

                        var _obj = {};
                        _obj.name = item._type;
                        _obj.children = [];
                        // 提取下面的二级字段
                        // console.log('提取下面的二级字段', item);
                        angular.forEach(item._source, function (value, key) {
                            var temp = {};
                            // 没@和@message
                            if (key.indexOf('@') == -1 || key.indexOf('@message') > -1) {
                                temp.name = key;
                                // console.log(value, key);
                                temp.show = false;
                                temp.filterHideOrShow = false;
                                temp.showOrHide = function () { // 单击收回 取消
                                    temp.show = !temp.show;
                                }
                                temp.onOff = function () {
                                    temp.filterHideOrShow = !temp.filterHideOrShow
                                };
                                // 字段筛选
                                temp.filterAggregations = function (item, sub, status) {
                                    // console.log(item, sub, status);
                                    var params = {
                                        type: item.name,
                                        query: []
                                    }
                                    angular.forEach(sub.sub, function (item, index) {
                                        var _obj = {};
                                        if (item.status) {
                                            _obj.name = sub.name;
                                            _obj.value = item.name;
                                            _obj.status = status == '1' ? 'like' : 'not like';
                                            params.query.push(_obj);
                                        }
                                    })
                                    console.log('筛选的数据', params);
                                    // 组装搜索语句
                                    vm.data.query = addSerchcQuery(vm.data.query, vm.data.search.current.name, params);
                                    // 关闭
                                    temp.onOff();
                                };
                                _obj.children.push(temp);
                            }
                        });
                        _arr.push(_obj);
                    }
                });
                console.log('提取到的type', _type, _arr);

                // 提取到的type
                vm.data.type = _type;

                // 统计二级这字段的数量
                vm.data.filterList = nodeNum(result, _arr);

                // 统计数量
                function nodeNum(node, res) {
                    console.log(node, res);
                    angular.forEach(res, function (item, index) {
                        console.log(item);
                        angular.forEach(item.children, function (value, key) {
                            var _item = value;
                            function sub() {
                                var arr = [];
                                angular.forEach(node, function (item, index) {
                                    angular.forEach(item._source, function (value, key) {
                                        var _obj = {};
                                        if (_item.name == key) {
                                            _obj.name = value;
                                            _obj.value = 0;
                                            arr.push(_obj);
                                        }
                                    })
                                });

                                // 对象去从
                                var result = [];
                                var obj = {};
                                for (var i = 0; i < arr.length; i++) {

                                    if (!obj[arr[i].name]) {
                                        result.push(arr[i]);
                                        obj[arr[i].name] = true;
                                    } else {
                                        for (var j in result) {
                                            if (result[j].name == arr[i].name) {
                                                result[j].value = result[j].value + 1;
                                            }
                                        }
                                    }
                                }

                                return result;
                            };

                            value.sub = sub();

                        });
                    })

                    console.log('处理的结果', res);
                    return res;
                }

                // 统计
                if (vm.data.logResult.currentIndex == 1) {
                    console.log('统计数据');
                    buildParamsOptions();
                    $rootScope.$broadcast('buildParamsOptionsSuccess', vm.data.paramsOptions);
                } else {
                    // 构建图表
                    buildEcharts();
                }

                // 分页
                vm.paginationConf.totalItems = res.hits.total;
            }, function (err) {
                toastr.error("查询出错", "错误提示", err);
            });
        }

        // 把筛选字段添加到搜索框
        function addSerchcQuery(query, type, params) {
            // var str = "where type = as_fund and city like '%连接建立%'";
            // var str = "where type = as_fund and city not like '%连接建立%'";
            console.log(query, type, params);
            // 如果是sql，检测是否含有where语句， ok
            // 是否含有字段中的type ，有则不管，没有则添加上去。 
            // 是否含有搜索的的 字段
            // 是否含有相反的like 语句
            // 是否含有相同的like 语句
            var iswhere = false;
            var isType = false;
            var formatQuery = query.replace(/\s*/g, ""); // 去除所有空格;
            var sql = '';
            var spl = '';

            console.log(formatQuery);

            if (query.indexOf('where') > -1) {
                iswhere = true;
            }

            if (query.indexOf(params.type) > -1) {
                isType = true;
            }

            console.log(iswhere, isType);

            if (type == 'SQL') {
                if (iswhere && isType) {
                    sql += ' and ';
                } else if (iswhere && !isType) {
                    // sql += 'and type = ' + params.type + ' and ';
                    sql += ' and ';
                } else {
                    sql += 'where ';
                }

                // 循环组装
                params.query.forEach(function (item, index) {
                    // var formatLikeQuery = item.name + 'like' + "'%" + item.value + "%'";
                    // var formatNotLikeQuery = item.name + 'notlike' + "'%" + item.value + "%'";
                    // console.log('like',formatLikeQuery);
                    // console.log('notLike',formatNotLikeQuery);
                    console.log(item);

                    // 含有相同,不处理
                    // if(iswhere && formatQuery.indexOf(formatLikeQuery) > -1){
                    // 	
                    // }
                    // 
                    // // 含有相反,去掉相反
                    // if(iswhere && formatQuery.indexOf(formatNotLikeQuery) > -1){
                    // 	
                    // }

                    // 最后一个
                    if (index == params.query.length - 1) {
                        sql += item.name + ' ' + item.status + ' ' + "'%" + _.trim(item.value) + "%'";
                    } else {
                        sql += item.name + ' ' + item.status + ' ' + "'%" + _.trim(item.value) + "%'" + ' and ';
                    }
                })

                console.log(sql);

                // 组装的sql语句
                query += ' ' + sql;
                console.log(query);
                return query;
            } else if (type == 'SPL') {
                // 循环组装
                params.query.forEach(function (item, index) {
                    spl += item.name + ' = "' + _.trim(item.value) + '" ';
                })

                query += ' ' + spl;
                console.log(query);
                return query;
            }
        }

        // 切换查询方式,切换查询方式
        function selectedSearchType(item, index) {
            vm.data.search.currentIndex = index;
            vm.data.search.current = item;
            console.log(vm.data.search.current);
        }

        // 选中业务后才能查询,监听vm.app
        function isSearch() {
            console.log(vm.data.app)
            if (vm.data.app) {
                vm.data.isSearch = false;
                // 查询类型
                supplyQuery(vm.data.search.current.name);
            } else {
                vm.data.isSearch = true;
            }
        }


        //根据选择的业务系统 补全查询语句
        function supplyQuery(type) {
            var result = '';
            if (type == 'SQL') {
                result = isSQL();

            } else if (type == 'SPL') {
                result = isSPL();
            }

            vm.data.query = result;

            function isSQL() {
                var _str = 'select * from ';
                _str = _str + vm.data.app.alias + '*';
                return _str;
            }

            function isSPL() {
                var _str = '| source = ';
                _str = _str + vm.data.app.alias + '*';
                return _str;
            }

        }

        function bulidSearchQuery(type, query) {
            console.log('构建查询语句', type, query);
            if (!query) {
                toastr.error('查询条件不能为空');
                return;
            }
            if (vm.data.isRefreshCurrentPage) {
                vm.data.page.from = 1;
                vm.data.page.size = 15;
            }
            var _dateSql = " timestamp >'" + moment(vm.dateRange.startDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z") + "' and timestamp <='" + moment(vm.dateRange.endDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z") + "'";
            var _limit = " limit " + vm.data.page.from + "," + vm.data.page.size;
            var _orderBy = " order by timestamp desc";
            var _dateSpl = " timestamp >'" + moment(vm.dateRange.startDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z") + "' timestamp <'" + moment(vm.dateRange.endDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z") + "' | head 15";
            var result = query.toLowerCase();

            // return result;

            // 有where 添加到后面，没有者添加
            if (type == 'SQL') {
                if (query.indexOf('where') > -1) {
                    // 在where 后面添加时间
                    var arr = query.split('where');
                    // 拼接
                    angular.forEach(arr, function (item, index) {
                        if (index == 0) {
                            result = item;
                        } else {
                            result += 'where' + _dateSql + ' and' + item;
                        }
                    })
                    result += _limit;
                } else if (query.indexOf('order') > -1) {
                    var arr1 = query.split('order');
                    angular.forEach(arr1, function (item, index) {
                        if (index == 0) {
                            result = item;
                        } else {
                            result += 'where' + _dateSql + 'order' + item;
                        }
                    })
                    result += _limit;
                } else if (query.indexOf('group') > -1) {
                    var arr2 = query.split('group');
                    angular.forEach(arr2, function (item, index) {
                        if (index == 0) {
                            result = item;
                        } else {
                            result += 'where' + _dateSql + 'group' + item;
                        }
                    })
                    result += _limit;
                } else {
                    result += ' where' + _dateSql + _orderBy + _limit;
                }
            } else if (type == 'SPL') {
                // 有source，没有按关键字查询
                if (result.indexOf('source') > -1) {
                    result += _dateSpl;
                }
            }
            console.log(result);
            return result;
        }

        // 统计图表构建
        // 查询api/statistic/event-count 接口 
        // 拿到数据构建图表
        function buildEcharts() {
            var params = {
                index: vm.data.app ? vm.data.app.alias + '*' : '',
                endTime: moment(vm.dateRange.endDate).format('YYYY-MM-DD\\THH:mm:ss.SSS\\Z'),
                filterFields: {},
                format: "yyyy-MM-dd HH:mm:ss",
                minutesInterval: vm.dateRange.minutesInterval || 30,
                startTime: moment(vm.dateRange.startDate).format('YYYY-MM-DD\\THH:mm:ss.SSS\\Z'),
                types: [], //系统
            }

            // 提取系统
            angular.forEach(vm.data.filterList, function (item, index) {
                params.types.push(item.name);
            });

            console.log(params);
            EsService.getEventCount.post(params, function (res) {
                console.log('图表数据', res);
                drawEcharts(res);
            }, function (err) {
                console.log(err);
            });
        }

        // 做图加载到页面上
        function drawEcharts(res) {
            console.log(res);
            var _series = [{
                name: '数量',
                type: 'bar',
                data: [],
                itemStyle: {
                    normal: {
                        color: '#399bff'
                    }
                }
            }];

            var _xAxis = {
                data: [],
                splitLine: {
                    show: false
                }
            };

            var option = {
                title: {
                    text: ''
                },
                backgroundColor: '#fff',
                tooltip: {},
                // legend: res.config.legend,
                xAxis: _xAxis,
                yAxis: {
                    splitLine: {
                        show: false
                    }
                },
                series: _series,
                dataZoom: [{
                    type: "inside"
                }],
                grid: {
                    left: '4%',
                    right: '0',
                    top: '5%',
                    // bottom: '5%'
                }
            };

            //数据处理
            angular.forEach(res.aggregations, function (item, index) {
                _series[0].data.push(item.y);
                _xAxis.data.push(item.x);
            });

            $timeout(function () {
                vm.data.echarts = echarts.init(document.getElementById('eChartContant')); //div 标签id
                vm.data.echarts.showLoading();
                // true重新加载
                // console.log('id' + index, option);
                vm.data.echarts.setOption(option, true);
                vm.data.echarts.hideLoading();
                vm.data.echarts.resize();
                window.onresize = function () {
                    vm.data.echarts.resize();
                };

                vm.data.echarts.on('click', function (item) {
                    console.log(item);
                    vm.data.echarts.off('click');
                    vm.dateRange = {
                        startDate: moment(item.name),
                        endDate: vm.dateRange.minutesInterval ? moment(item.name).subtract(-1, 'minutes') : moment(item.name).subtract(-30, 'minutes'),
                        minutesInterval: 1
                    };
                    submit(true);
                })
            }, 1000)
        }


        // 切换到统计需要传递的参数构建
        function buildParamsOptions() {
            var params = {
                app: vm.data.app, // 选中的app
                fields: vm.data.filterList, // 左侧列表
                table: vm.data.tableList, // 右侧数据
                date: {
                    startTime: moment(vm.dateRange.startDate).format(),
                    endTime: moment(vm.dateRange.endTime).format()
                },
                query: vm.data.query, // 查询语句
            }
            console.log(params);
            vm.data.paramsOptions = params;
        }

        // 代码高亮
        function codeHighlight(sql, baseSql, upperSql) {
            console.log('代码高亮', sql, baseSql);
            // 获取到搜索语句，查询like中的数据
            var reg = /\%(.+?)\%/g;
            var temp;
            var result = [];
            while ((temp = reg.exec(sql)) != null) {
                result.push(temp[1]);
            }
            while ((temp = reg.exec(baseSql)) != null) {
                result.push(temp[1]);
            }

            while ((temp = reg.exec(upperSql)) != null) {
                result.push(temp[1]);
            }
            return result;
        }

        // 检测参数
        function getStateParams() {
            var name = 'homelogSearchReload';
            var data = localStorage.getItem(name);
            data = JSON.parse(data);
            console.log(data);

            if (!data) {
                return;
            }

            // 类型
            if (data.type == 'sql_spl' && data.options.config.query.indexOf('|') > -1) {
                vm.data.search.current.name = 'SPL';
            } else {
                vm.data.search.current.name = 'SQL';
            }

            // 查询系统
            vm.data.app = data.options.app;
            // 搜索框时候可以用
            vm.data.isSearch = false;
            // 查询语句
            vm.data.query = data.options.config.query;

            // 时间
            vm.dateRange.startDate = data.options.timeParams.startDate;
            vm.dateRange.endDate = data.options.timeParams.endDate;

            // 判断查询方式
            if (data.type == 'sql_spl' && data.options.config.query.indexOf('select') > -1) {
                vm.searchModel = 'SQL';
            } else if (data.type == 'sql_spl' && data.options.config.query.indexOf('|') > -1) {
                vm.searchModel = 'SPL';
            } else {
                vm.queryParams = data.options.queryParams;
                vm.searchModel = 'KEYWORD';
            }

            submit(true);

            // 删除本地
            localStorage.removeItem(name);

        }

        // 切换查询语句
        // current: { name: 'SQL' },
        // vm.data.query
        $scope.$watch("vm.data.query", function (n, o) {
            console.log(n, o);
            if (n && n != o) {
                // 判断是否为spl
                var isSpl = function (queryStr) {
                    return (queryStr.indexOf("|") == 0);
                };
                // 判断是否为sql
                var isSql = function () {
                    return (queryStr.indexOf("select") == 0);
                };

                var queryStr = n.trim(); // 删除之前和之后的空格
                if (isSpl(queryStr)) {
                    vm.data.search.currentIndex = 0;
                    vm.data.search.current.name = "SPL";
                } else if (isSql(queryStr)) {
                    vm.data.search.currentIndex = 1;
                    vm.data.search.current.name = "SQL";
                } else {
                    vm.data.search.query.name = "KEYWORD";
                }
            }
        })



        // 英藏下拉框
        $window.onclick = function (event) {
            if (event.toElement.className.indexOf('euiFieldText') === -1) {
                vm.data.defaultDropDownMeun.isShow = false;
                $scope.$apply();
            }
        };

        // 加载历史查询数据
        $scope.$on('logSearchReloadSuccess', function (event, data) {
            data.options = JSON.parse(data.options);
            console.log("加载查询", data);
            // 类型
            if (data.type == 'sql_spl' && data.options.config.query.indexOf('|') > -1) {
                vm.data.search.current.name = 'SPL';
            } else {
                vm.data.search.current.name = 'SQL';
            }

            // 查询系统
            vm.data.app = data.options.app;
            // 搜索框时候可以用
            vm.data.isSearch = false;
            // 查询语句
            vm.data.query = data.options.config.query;

            // 时间
            vm.dateRange.startDate = data.options.timeParams.startDate;
            vm.dateRange.endDate = data.options.timeParams.endDate;

            // 判断查询方式
            if (data.type == 'sql_spl' && data.options.config.query.indexOf('select') > -1) {
                vm.searchModel = 'SQL';
            } else if (data.type == 'sql_spl' && data.options.config.query.indexOf('|') > -1) {
                vm.searchModel = 'SPL';
            } else {
                vm.queryParams = data.options.queryParams;
                vm.searchModel = 'KEYWORD';
                // changeView(); // 刷新列表
            }

            submit(true);
        });

        init();

    };
})();