(function () {
    'use strict';
    /**
     * 不使用api/search/es-info-search接口，关键字查询和高级查询数据返回不一样，非常的麻烦，更梁瑞沟通后，
     * 直接才用SQL和SPL的方式
     * 为了保持返回数据一致，方便做报表
     * Author：Veiss， Date：2019/7/27
     */
    var app = angular.module('LoginsightUiApp.page.logSearch');
    app.controller('logSearchDslCtrl', logSearchDslCtrl);

    logSearchDslCtrl.$inject = ['$scope', '$rootScope', '$stateParams', '$log', '$q', '$sce', '$state', '$timeout', '$filter', 'EsService', 'Principal', 'EventRule', '$uibModal', 'DataDashboard', 'toastr', '$window', '$location'];

    function logSearchDslCtrl($scope, $rootScope, $stateParams, $log, $q, $sce, $state, $timeout, $filter, EsService, Principal, EventRule, $uibModal, DataDashboard, toastr, $window, $location) {
        moment.locale('zh-cn');
        var vm = this;
        var globalType = []; //点击左侧分类列表中的字段 要把type保存下来，接口查询时：types:[globalType]

        vm.data = {
            app: '',            // 选中的业务系统
            isSearch: true,     // 搜索框时候可以用
            query: '',          // 查询框
            historyName: '__LOGSEARCHHISTORY__',    // 历史查询名称
            baseQuery: {
                sql: '',
                spl: ''
            },

            loadDaxtaFirst: 1,  // 数据第一次加载标记，解决分页插件调用两次的bug
            timeCustom: {       // 展示自定义时间
                value: '',
                isShow: false
            },

            // 是否展示下拉框,历史使用
            defaultDropDownMeun: {
                isShow: false,
                list: [
                    { query: '*' },
                    { query: '| source = gdpoc* @linenum > 50' },
                    { query: '| source = gdpoc* @linenum > 1 level = "16"' },
                    { query: "select * from gdpoc* where @linenum > 5 and level like '%16%'" },
                    { query: 'select * from gdpoc* where Module like \'%t1/t2通道插件%\'' },
                    { query: "select * from gdpoc* where level like '%16%'" },
                    { query: "select * from gdpoc* where @linenum > 50 and ID = 12014" },
                    { query: "select * from gdpoc* order by @linenum desc" }
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
                current: { name: 'KEYWORD' },
                list: [
                    { name: 'SQL' },
                    { name: 'SPL' },
                    { name: 'KEYWORD' }
                ]
            },

            type: [],               // 提取到的type
            filterList: [],         // 左侧节点
            tableList: [],          // 图表数据
            paramsOptions: [],      // 传递的参数

            // 分页
            page: {
                from: 1,
                size: 15
            },

            isRefreshCurrentPage: false,    // 是否重置分页
            isRefreshCharts: true,          // 是否重置图表

            // 查询语句
            queryParams: {
                types: [],
                startTime: '',
                endTime: '',
                fields: [''],
                from: 0,
                // queryString: '',
                size: 15,
                sortFields: { timestamp: 'DESC' },
                filterFields: {}
            },

            // 时间选择配置
            dateRangePicker: {
                date: {
                    startDate: moment().subtract(2, 'year'),
                    endDate: moment()
                },
                picker: null,
                options: {
                    opens: "left",
                    timePicker: true,
                    timePicker24Hour: true,
                    ranges: {
                        '15分钟前': [moment().subtract(15, 'minute'), moment()],
                        '1个小时前': [moment().subtract(1, 'hour'), moment()],
                        '一天前': [moment().subtract(1, 'day'), moment()],
                        '三天前': [moment().subtract(3, 'day'), moment()],
                        '一周前': [moment().subtract(1, 'week'), moment()],
                        '当天': [moment().startOf('days'), moment()],
                        '当月': [moment().startOf('month'), moment().endOf('month')]
                    },
                    alwaysShowCalendars: true,
                    showCustomRangeLabel: true,
                    locale: {
                        format: 'YYYY-MM-DD HH:mm:ss',
                        separator: ' ~ ',
                        applyLabel: '确定',
                        cancelLabel: '取消',
                        fromLabel: 'From',
                        toLabel: 'To',
                        customRangeLabel: '自定义',
                        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                        firstDay: 1
                    },

                    eventHandlers: {
                        'apply.daterangepicker': function (event, picker) {
                            var timeString = chooseTimeToString(vm.data.dateRangePicker.date, event.opts.ranges);
                            vm.data.timeCustom.value = timeString ? timeString : '';
                            vm.data.timeCustom.isShow = timeString ? true : false;

                            // 选择的时候重新赋值一次
                            vm.data.dateRangePicker.ranges = {
                                '15分钟前': [moment().subtract(15, 'minute'), moment()],
                                '1个小时前': [moment().subtract(1, 'hour'), moment()],
                                '一天前': [moment().subtract(1, 'day'), moment()],
                                '三天前': [moment().subtract(3, 'day'), moment()],
                                '一周前': [moment().subtract(1, 'week'), moment()],
                                '当天': [moment().startOf('days'), moment()],
                                '当月': [moment().startOf('month'), moment().endOf('month')]
                            };
                        }
                    }
                }
            },

            // 分页参数
            paginationConf: {
                currentPage: 1,
                totalItems: 0,
                itemsPerPage: 15,
                pagesLength: 15,
                perPageOptions: [10, 20, 30, 40, 50],
                onChange: function () {
                    // 
                    if (vm.data.loadDaxtaFirst == 1) {
                        vm.data.page.from = vm.data.page.from - 1;   // 数据分页从第0条开始
                        vm.data.loadDaxtaFirst = 2;
                        submit(false, false);
                    } else if (vm.data.loadDaxtaFirst == 2) {
                        vm.data.page.from = ((vm.data.paginationConf.currentPage || 1) - 1) * vm.data.page.size;
                        vm.data.page.size = vm.data.paginationConf.itemsPerPage;
                        console.log('分页数据', vm.data.page.from, vm.data.page.size);
                        submit(false, false);
                    }
                }
            },

            // 保留关键字
            systemKeyword: {
                dsl: [
                    { name: 'AND' },
                    { name: 'OR' },
                    { name: 'key:value' },
                    { name: 'key:(value1 OR valu2)' },
                    { name: 'key.\*:(value)' },
                    { name: '_exists_:key' },
                ],
                spl: [],
                sql: []
            }
        }

        // console.log($.dateRangePicker)



        // vm._ = _;
        // vm.queryParams = {};
        // vm.queryParams.filterFields = {}
        // vm.queryParams.filterFieldsShow = true;
        // vm.getFields = getFields;
        // vm.addfiltered = addfiltered;
        // vm.removefultered = removefultered;
        // vm.selectedFields = [];
        // vm.unSelectFields = [];
        vm.filter = {};
        vm.select_type = {};
        // vm.tabActive = 0;
        // 表格的行
        vm.gridOptions = {};
        vm.gridOptions.columnDefs = [];
        // 表的数据
        vm.gridOptions.data = [];
        vm.showDetil = showDetil;
        // vm.getType = getType;
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
        vm.quickSearch = {}; // 快速检索
        // vm.quickSearch.state = true;


        // 方法集合
        vm.method = {
            showMenuList: showMenuList,             // 显示下拉框
            hideMenuList: hideMenuList,             // 隐藏下拉框
            logResultToggle: logResultToggle,       // 结果menu切换
            resetPopoverStaus: resetPopoverStaus,   // 重置状态
            submit: submit,
            selectedSearchType: selectedSearchType, // 筛选查询方式
            isSearch: isSearch,                     // 是否可以搜索
            // buildParamsOptions: buildParamsOptions, //组装参数
            buildEcharts: buildEcharts,             // 刷新echarts
            formatShowTime: formatShowTime,         // 格式化显示时间
            saveAsBtn: saveAsBtn,                   // 另存为
            openDownload: openDownload,             // 下载
            showChooseCategoryModal: showChooseCategoryModal,       // 选择业务弹框
            selectedSystemKeyword: selectedSystemKeyword,           // 选择关键字
            chooseFieldToSearch: chooseFieldToSearch,               // 选择字段快速选择
            keyBoardSubmit: keyBoardSubmit,                         // 关键字键盘提交事件
        }


        // 页面初始化
        function init() {
            getCategoryList();
            if ($stateParams.type && $stateParams.type == '1') {
                getStateParams();
            }
            // showChooseCategoryModal();
            makeExpandingArea('euiFieldText');
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

        // 重置弹框的状态
        function resetPopoverStaus(field, type) {
            //如果有冲入queryString就忽视掉
            if (vm.data.query.indexOf(field.name + ':' + '*') === -1) {
                //如果globaType长度>0 说明已经字段筛选过 需要用‘AND’ 拼接
                if (globalType.length > 0) {
                    vm.data.query += ' AND ' + field.name + ':' + '*';
                } else {
                    vm.data.query = field.name + ':' + '*';
                }
            }

            if (globalType.indexOf(type.name) === -1) {
                globalType.push(type.name);
            }

            submit(true, true);


            // angular.forEach(vm.data.filterList, function (item, index) {
            //     for (var i in item.children) {
            //         item.children[i].filterHideOrShow = false;
            //     }
            // })
        }

        // 格式化显示时间
        function formatShowTime(data) {
            return moment(data).format("YYYY/MM/DD HH:mm:ss");
        };

        /**
         * 另存为，分为sql-spl 和 关键字
         * 暂时取消关键字储存
         * Veiss
         * 2019/7/30
         **/
        function saveAsBtn() {
            var params = {
                app: vm.data.app,
                config: {
                    query: vm.data.query,
                    baseQuery: vm.data.baseQuery
                },
                timeParams: {
                    startTime: vm.data.dateRangePicker.date.startDate,
                    endTime: vm.data.dateRangePicker.date.endDate
                },
                type: ''
            };

            // 判断类型
            if (vm.data.search.current.name == 'KEYWORD') {
                params.type = vm.data.search.current.name;
            } else {
                params.type = 'sql_spl';
            }

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
                        // vm.data.dateRangePicker.date.startDate = moment(vm.queryParams.startTime).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
                        // vm.data.dateRangePicker.date.endDate = moment(vm.queryParams.endTime).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z"); 
                        vm.data.dateRangePicker.date.startDate = moment(vm.queryParams.startTime);
                        vm.data.dateRangePicker.date.endDate = moment(vm.queryParams.endTime);
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
            _.remove(vm.queryParams.filterFields[_type], function (v, b) {
                console.log(v, b, '000')
                // return v.term == t || v.exists == t;
            });

            vm.filtereds.entityFilter = obj;
            vm.filtereds.filterStatus = true;
        };

        // 导出数据
        function openDownload() {
            var data = {
                // 'queryParams': bulidQuery(),
                queryParams: {
                    xx: 111,
                },
                appInfo: vm.app
            };
            $state.go('log-download', data, { reload: false })
        };

        /**
         * 展示下拉选择框
         */
        function showMenuList() {
            // 获取历史查询数据
            getHistory();
            vm.data.defaultDropDownMeun.isShow = true;
        }

        /**
         * 关闭下拉框，执行一次自动查询
         * @param {*} item
         */
        function hideMenuList(item) {
            console.log(item);
            console.log(vm.appList);
            vm.data.query = item.query;
            vm.data.defaultDropDownMeun.isShow = false;
            // angular.forEach(vm.appList, function (value, index) {
            //     if (value.alias == item.appName) {
            //         vm.data.app = value;
            //     }
            // })
        }

        /**
         * 切换视图查看
         * @param {*} index
         */
        function logResultToggle(index) {
            vm.data.logResult.currentIndex = index;
            if (index == 0) {
                buildEcharts();
            } else if (index == 1) {
                buildParamsOptions();
            }
        }

        /**
         * 更具不同的查询方式，调用不同的数据接口
         * sql  /api/sql/http-sql
         * spl /api/spl-2-sql/spl-to-sql 转换成sql 在调用sql
         * keyworld  /api/search/es-info-search 接口
         */
        function submit(isRefreshCurrentPage, isRefreshCharts) {
            // 刷新分页，重置到第一页
            vm.data.isRefreshCurrentPage = isRefreshCurrentPage;
            // 是否重置图表
            vm.data.isRefreshCharts = (isRefreshCharts == false ? isRefreshCharts : true);

            if (vm.data.search.current.name == 'SQL') {
                sqlSearch();
            } else if (vm.data.search.current.name == "SPL") {
                // 在这里组装spl语句
                splSearch();
            } else {
                dslSearch();
            }

            // 储存到本地
            if (vm.data.isRefreshCurrentPage) {
                saveHistory(vm.data.query);
            }
        }

        // textarea 键盘事件
        function keyBoardSubmit(event) {
            if (event.keyCode == 13) {
                submit(true, true);
            }
        }

        // dsl查询
        function dslSearch() {
            console.log(vm.data.app);
            console.log(111111);
            // 需要获取全部的types
            getTypesList(vm.data.app.id).then(function (res) {
                console.log('选择的分类', res);
                // 清空元素types
                vm.data.queryParams.types = [];

                vm.data.filterList = [];
                // 分类提取
                angular.forEach(res, function (item, index) {
                    var _obj = {
                        name: item.name,
                        children: [],
                    };

                    angular.forEach(item.fields, function (val, i) {
                        var temp = {};
                        temp.name = val.name;
                        temp.filterHideOrShow = false;
                        temp.show = false;
                        temp.showOrHide = function () { // 单击收回取消
                            temp.show = !temp.show;
                        }
                        temp.onOff = function () {
                            temp.filterHideOrShow = !temp.filterHideOrShow;
                        };
                        // 字段筛选
                        temp.filterAggregations = function (item, sub, status) {
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
                            // temp.onOff();
                        };
                        // 子元素
                        temp.sub = [];
                        _obj.children.push(temp);
                    })

                    // 一级
                    vm.data.filterList.push(_obj);
                })

                angular.forEach(res, function (item, index) {
                    // 组合查询语句
                    if (globalType.length > 0) {
                        vm.data.queryParams.types = globalType;
                    } else {
                        vm.data.queryParams.types.push(item.name);
                    }

                    vm.data.queryParams.index = vm.data.app ? vm.data.app.alias + '*' : '';
                    vm.data.queryParams.startTime = moment(vm.data.dateRangePicker.date.startDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z")
                    vm.data.queryParams.endTime = moment(vm.data.dateRangePicker.date.endDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
                    vm.data.queryParams.size = vm.data.page.size;
                    // 有关键字才需要queryString字段
                    if (vm.data.query) {
                        vm.data.queryParams.queryString = vm.data.query;
                    } else {
                        delete vm.data.queryParams.queryString;
                    }

                    // 分页从第0页开始，解决没有分页数据展示不出来来的问题
                    if (vm.data.loadDaxtaFirst == 1) {
                        vm.data.queryParams.from = vm.data.page.from - 1;
                    } else {
                        vm.data.queryParams.from = vm.data.page.from;
                    }
                })

                console.log(vm.data.queryParams);
                getLogInfo(vm.data.queryParams).then(function (response) {
                    console.log('返回的日志', response);
                    // if(response.hit.length===0) return;
                    // 返回数据统一化
                    angular.forEach(response.hit, function (item, index) {
                        item._index = item.index;
                        item._id = item.id;
                        item._source = item.source;
                        item._type = item.type;
                    })

                    // 图表数据
                    vm.data.tableList = response.hit;

                    // 高亮代码
                    var heightCode = codeHighlight(vm.data.queryParams.queryString);
                    console.log('需要高亮的字段', heightCode);

                    // 替换高亮
                    angular.forEach(vm.data.tableList, function (item, index) {
                        for (var i in heightCode) {
                            item._source['@message'] = item._source['@message'].split(heightCode[i]).join('<em class="hlt1">' + heightCode[i] + '</em>');
                        }
                    })

                    // 重置到第一页
                    if (vm.data.isRefreshCurrentPage) {
                        vm.data.paginationConf.currentPage = 1;
                    }

                    // 分页
                    vm.data.paginationConf.totalItems = response.totalHits[0];

                    // 统计
                    if (vm.data.logResult.currentIndex == 1) {
                        console.log('统计数据');
                        buildParamsOptions();
                        $rootScope.$broadcast('buildParamsOptionsSuccess', vm.data.paramsOptions);
                    } else {
                        // 构建图表
                        if (vm.data.isRefreshCharts) {
                            console.log('构建图表');
                            buildEcharts();
                        }
                    }

                    // globalType=null;
                })
            });
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

                // 高亮代码
                var heightCode = codeHighlight(params.sql);
                console.log('需要高亮的字段', heightCode);

                // 替换高亮
                angular.forEach(vm.data.tableList, function (item, index) {
                    for (var i in heightCode) {
                        item._source['@message'] = item._source['@message'].split(heightCode[i]).join('<em class="hlt1">' + heightCode[i] + '</em>');
                    }
                })


                // 重置到第一页
                if (vm.data.isRefreshCurrentPage) {
                    vm.data.paginationConf.currentPage = 1;
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
                    if (vm.data.isRefreshCharts) {
                        buildEcharts();
                    }
                }

                // 分页
                vm.data.paginationConf.totalItems = res.hits.total;
            }, function (err) {
                toastr.error("查询出错", "错误提示", err);
            });
        }

        /**
         * 获取业务下面的tpyes
         * @param {*String} id [当前业务id]
         */
        function getTypesList(id) {
            var deferred = $q.defer();
            EventRule.getTypeList({ category_id: id }, function (res) {
                deferred.resolve(res);
            })
            return deferred.promise;
        }

        /**
         * 日志查询
         * @param {*} queryParams [数据库查询语句]
         */
        function getLogInfo(queryParams) {
            var deferred = $q.defer();
            EsService.getLogInfo.post(queryParams, function (res) {
                deferred.resolve(res);
            })
            return deferred.promise;
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
            } else if (type == 'KEYWORD') {
                result = '';
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
            var _dateSql = " timestamp >'" + moment(vm.data.dateRangePicker.date.startDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z") + "' and timestamp <='" + moment(vm.data.dateRangePicker.date.endDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z") + "'";
            var _limit = " limit " + vm.data.page.from + "," + vm.data.page.size;
            var _dateSpl = " timestamp >'" + moment(vm.data.dateRangePicker.date.startDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z") + "' timestamp <'" + moment(vm.data.dateRangePicker.date.endDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z") + "' | head 15";
            var result = query;

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
                    result += ' where' + _dateSql + _limit;
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
                endTime: moment(vm.data.dateRangePicker.date.endDate).format('YYYY-MM-DD\\THH:mm:ss.SSS\\Z'),
                filterFields: {},
                format: "yyyy-MM-dd HH:mm:ss",
                minutesInterval: vm.data.dateRangePicker.date.minutesInterval || 30,
                startTime: moment(vm.data.dateRangePicker.date.startDate).format('YYYY-MM-DD\\THH:mm:ss.SSS\\Z'),
                types: [], //系统
            }

            // 加载查询语句
            if (vm.data.search.current.name == 'KEYWORD' && vm.data.queryParams.queryString) {
                params.queryString = vm.data.queryParams.queryString;
            }

            // 提取系统
            angular.forEach(vm.data.filterList, function (item, index) {
                if (globalType.length > 0) {
                    params.types = globalType;
                } else {
                    params.types.push(item.name);
                }

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

                vm.data.echarts.off('click');

                vm.data.echarts.on('click', function (item) {
                    vm.data.dateRangePicker.date = {
                        startDate: moment(item.name),
                        endDate: vm.data.dateRangePicker.date.minutesInterval ? moment(item.name).subtract(-1, 'minutes') : moment(item.name).subtract(-30, 'minutes'),
                        minutesInterval: 1
                    };
                    submit(true, true);
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
                    startTime: moment(vm.data.dateRangePicker.date.startDate).format(),
                    endTime: moment(vm.data.dateRangePicker.date.endTime).format()
                },
                query: vm.data.query, // 查询语句
            }
            console.log(params);
            vm.data.paramsOptions = params;
        }

        // 代码高亮
        function codeHighlight(data) {
            // console.log('需要高亮的数据', data);
            if (!data) return;
            // 获取到搜索语句，查询like中的数据
            var reg = /\%(.+?)\%/g;
            var temp;
            var result = [];
            if (vm.data.search.current.name == 'SQL') {
                while ((temp = reg.exec(data)) != null) {
                    result.push(temp[1]);
                }
            } else if (vm.data.search.current.name == 'KEYWORD') {
                // 如果有AND,OR,
                if (data.indexOf(':') > -1) {
                    var dataFormat = data.split(':');
                    result.push(dataFormat[1]);
                } else {
                    result.push(data);
                }
                // 拿到原生查询，全部大写和全部小写都高亮
                result.forEach(function (item, index) {
                    result.push(item.toLowerCase(), item.toUpperCase());
                })
            }

            console.log('处理过的需要高亮的数据', result);
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
            if (data.type == 'FORM_LUCENE') {
                vm.data.search.current.name = 'KEYWOLD';
            } else if (data.type == 'sql_spl' && data.options.config.query.indexOf('|') > -1) {
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
            vm.data.dateRangePicker.date.startDate = data.options.timeParams.startDate;
            vm.data.dateRangePicker.date.endDate = data.options.timeParams.endDate;

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

        // 选择业务
        function showChooseCategoryModal() {
            $uibModal.open({
                templateUrl: 'app/pages/log-search/log-main/log-main.html',
                controller: 'logSearchMainCtrl',
                controllerAs: 'vm',
                backdrop: 'static',
                windowClass: 'log-choose-category_modal',
            });
        }

        // 获取历史查询语句
        function getHistory() {
            var result = localStorage.getItem(vm.data.historyName);
            if (result) {
                result = JSON.parse(result);
                vm.data.defaultDropDownMeun.list = result;
            }
            vm.data.defaultDropDownMeun.list = result ? result : [];
        }

        // 储存历史查询数据
        function saveHistory(data) {
            if (!data) {
                return;
            }
            var data = { query: data };
            var localData = localStorage.getItem(vm.data.historyName);
            if (localData) {
                localData = JSON.parse(localData);
                // 相同的删除原来的
                angular.forEach(localData, function (item, index) {
                    if (JSON.stringify(item) == JSON.stringify(data)) {
                        localData.splice(index, 1);
                    }
                })
                localData.unshift(data);

                // 大于10条删除原来的
                if (localData.length > 10) {
                    localData.length = 10;
                }
            } else {
                localData = [data];
            }
            localStorage.setItem(vm.data.historyName, JSON.stringify(localData));
        }

        // 选择关键字
        function selectedSystemKeyword(item) {
            var result = '';
            console.log(item);
            if (vm.data.query && (item.name == 'AND' || item.name == 'OR')) {
                result = vm.data.query + ' ' + item.name + ' ';
            } else if (vm.data.query && (item.name != 'AND' && item.name != 'OR')) {
                result = vm.data.query + ' AND ' + item.name;
            } else if (!vm.data.query && (item.name == 'AND' || item.name == 'OR')) {
                result = '*' + ' ' + item.name + ' ';
            } else if (!vm.data.query && (item.name != 'AND' || item.name != 'OR')) {
                result = '*' + ' AND ' + item.name;
            }
            vm.data.query = result;
        }


        // textarea高度自适应
        function makeExpandingArea(nodeId) {
            var el = document.getElementById(nodeId);
            var setStyle = function (el) {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
                console.log(el.scrollHeight);
                if (el.scrollHeight <= 52) {
                    el.style.height = 40 + 'px';
                }
                var menu = document.getElementById('euiFieldMenu');
                if (menu) {
                    menu.style.top = el.scrollHeight - 1 + 'px';
                    if (el.scrollHeight <= 52) {
                        menu.style.top = 40 - 1 + 'px';
                    }
                }
            }
            var delayedResize = function (el) {
                window.setTimeout(function () {
                    setStyle(el)
                }, 0);
            }
            if (el.addEventListener) {
                el.addEventListener('input', function () {
                    setStyle(el)
                }, false);
                // 避免回车换行
                el.addEventListener('keydown', function (event) {
                    if (event.keyCode == 13) {
                        event.preventDefault();
                    }
                });
                setStyle(el)
            } else if (el.attachEvent) {
                el.attachEvent('onpropertychange', function () {
                    setStyle(el)
                })
                setStyle(el)
            }
            if (window.VBArray && window.addEventListener) { //IE9
                el.attachEvent("onkeydown", function () {
                    var key = window.event.keyCode;
                    console.log(key);
                    if (key == 8 || key == 46) delayedResize(el);

                });
                el.attachEvent("oncut", function () {
                    delayedResize(el);
                });//处理粘贴
            }
        }


        // 时间选择问题、10分钟就是10分钟，不要时间间隔功能
        function chooseTimeToString(chooseDate, ranges) {
            var result = '';
            // 循环获取定义好的时间
            angular.forEach(ranges, function (item, index) {
                var startDateFormat1 = new Date(chooseDate.startDate).getTime();
                var startDateFormat2 = new Date(item[0]).getTime();
                var endDateFormat1 = new Date(chooseDate.endDate).getTime();
                var endDateFormat2 = new Date(item[1]).getTime();
                if (startDateFormat1 == startDateFormat2 && endDateFormat1 == endDateFormat2) {
                    result = index;
                }
            })
            return result;
        }

        // 点击数据中的某个字段，直接快捷查询功能。
        function chooseFieldToSearch(key, value) {
            var result = '';
            console.log(key, value);
            if (vm.data.query) {
                result = vm.data.query + ' AND ' + key + ':' + value;
            } else {
                result = key + ':' + value;
            }
            vm.data.query = result;
            // 自动触发查询
            submit(true);
        }

        // 选择业务
        $scope.$on('chooseCategorySuccess', function (event, data) {
            console.log('chooseCategorySuccess', data);
            // vm.data.dateRangePicker.date = {
            //     startDate: moment().subtract(2, 'year'),
            //     endDate: moment()
            // };
            // 选择业务
            vm.data.app = data;

            globalType = [];
            // 清空查询语句
            vm.data.query = '';
            // 清空图表
            vm.data.echarts = echarts.init(document.getElementById('eChartContant')); //div 标签id
            vm.data.echarts.clear();
            // 清空表格
            vm.data.tableList = [];
        })

        // 切换查询语句
        $scope.$watch('vm.data.query', function (newValue, oldValue) {
            // 没有值，模式改为KEYWORD
            if (!newValue) {
                vm.data.search.currentIndex = 2;
                vm.data.search.current.name = "KEYWORD";
            }
            if (newValue && newValue != oldValue) {
                // 判断是否为spl
                var isSpl = function (queryStr) {
                    return (queryStr.indexOf("|") == 0);
                };
                // 判断是否为sql
                var isSql = function () {
                    return (queryStr.indexOf("select") == 0);
                };

                var queryStr = newValue.trim(); // 删除之前和之后的空格
                if (isSpl(queryStr)) {
                    vm.data.search.currentIndex = 0;
                    vm.data.search.current.name = "SPL";
                } else if (isSql(queryStr)) {
                    vm.data.search.currentIndex = 1;
                    vm.data.search.current.name = "SQL";
                } else {
                    vm.data.search.currentIndex = 2;
                    vm.data.search.current.name = "KEYWORD";
                }
            }
        })

        // 隐藏下拉框
        $(document).click(function (e) {
            // 要隐藏的父标签
            var eventParentNode = $('.form-main');
            if (!eventParentNode.is(e.target) && eventParentNode.has(e.target).length === 0) {
                vm.data.defaultDropDownMeun.isShow = false;
                $scope.$apply();
            }
        })

        // 加载历史查询数据
        $scope.$on('logSearchReloadSuccess', function (event, data) {
            data.options = JSON.parse(data.options);
            console.log("加载查询", data);
            // 类型
            if (data.type == 'FORM_LUCENE') {
                vm.data.search.current.name = 'KEYWOLD';
            } else if (data.type == 'sql_spl' && data.options.config.query.indexOf('|') > -1) {
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
            vm.data.dateRangePicker.date.startDate = data.options.timeParams.startDate;
            vm.data.dateRangePicker.date.endDate = data.options.timeParams.endDate;

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
        });

        init();

    };
})();