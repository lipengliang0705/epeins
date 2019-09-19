(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.logSearch')
        .directive('logSearchStatisticViewQueryNew', logSearchStatisticViewQueryNew)
        .controller('StatisticViewQueryNewCtrl', StatisticViewQueryNewCtrl);
    //utils.factory('DataUtil', DataUtil);
    StatisticViewQueryNewCtrl.$inject = ['$scope', '$stateParams', '$log', '$q', '$sce', '$state', '$timeout', 'EsService', 'Principal', 'NgTableParams', '$uibModal'];

    function StatisticViewQueryNewCtrl($scope, $stateParams, $log, $q, $sce, $state, $timeout, EsService, Principal, NgTableParams, $uibModal) {
        var vm = this;

        console.log(vm);
        // data
        vm.data = {
            app: vm.params.app,
            fields: vm.params.fields,
            query: vm.params.query,
            table: vm.params.table,
            date: vm.params.date,
            selectedFields: '', // 选择的tpye
            fieldsChild: [], // 选择type二级节点
            selectedFieldsChild: '', // 默认选择的第一个二级节点下面的第一给节点

            echartsParams: {}, // 储存的时候传的图表参数

            // 事件计数
            event: {
                interval: 30,
                chatType: 'bar',
                chatTypeList: [
                    { name: '线图', value: 'line' },
                    { name: '柱状图', value: 'bar' },
                    { name: '饼图', value: 'pie' }
                ],
                intervalList: [
                    { name: '一分钟', value: 1 },
                    { name: '五分钟', value: 5 },
                    { name: '十分钟', value: 10 },
                    { name: '三十分钟', value: 30 },
                    { name: '一小时', value: 60 }
                ]
            },

            // 字段值统计
            fieldValue: {
                interval: 30,
                polymerType: 'avg',
                chatType: 'bar',
                field: vm.params.fields[0].children[0].name,
                fieldList: vm.params.fields[0].children,
                chatTypeList: [
                    { name: '线图', value: 'line' },
                    { name: '柱状图', value: 'bar' },
                    { name: '饼图', value: 'pie' }
                ],
                polymerTypeList: [
                    { name: '平均值', value: 'avg' },
                    { name: '最大值', value: 'max' },
                    { name: '最小值', value: 'min' },
                    { name: '总数', value: 'count' }
                ],
                intervalList: [
                    { name: '一分钟', value: 1 },
                    { name: '五分钟', value: 5 },
                    { name: '十分钟', value: 10 },
                    { name: '三十分钟', value: 30 },
                    { name: '一小时', value: 60 }
                ]
            },

            // 字段值分类
            fieldGroup: {
                field: vm.params.fields[0].children[0].name,
                fieldList: vm.params.fields[0].children,
                chatType: 'bar',
                top: 30,
                topList: [
                    { name: '5', value: 5 },
                    { name: '10', value: 10 },
                    { name: '20', value: 20 },
                    { name: '30', value: 30 },
                ],
                chatTypeList: [
                    { name: '线图', value: 'line' },
                    { name: '柱状图', value: 'bar' },
                    { name: '饼图', value: 'pie' }
                ],
            },

            // 百分比
            filedPercentage: {
                field: vm.params.fields[0].children[0].name,
                fieldList: vm.params.fields[0].children,
                chatType: 'bar'
            },

            // 数字分组
            numberGroup: {
                field: vm.params.fields[0].children[0].name,
                fieldList: vm.params.fields[0].children,
                chatType: 'bar',
                rangesList: [
                    { min: 0, max: 0 },
                ]
            },

            // 时间分组
            timeGroup: {
                chatType: 'bar',
                rangesList: [{
                    from: '',
                    to: '',
                    isFromOpen: false,
                    isToOpen: false
                }]
            }
        }

        // 方法
        vm.method = {
            selectedList: selectedList,
            showSaveModal: showSaveModal,
            buildEcharts: buildEcharts,
            addNumberGroupItem: addNumberGroupItem, // 添加数值分段
            deleteNumberGroupItem: deleteNumberGroupItem, // 删除数值分段
            openDateDropMeun: openDateDropMeun, // 时间下拉框
            addTimeGroupItem: addTimeGroupItem,
            deleteTimeGroupItem: deleteTimeGroupItem,
            changeFileds: changeFileds
        }


        vm.options = vm.options || 0;

        // 页面初始化init
        function init() {
            // 默认选择第一个type
            vm.data.selectedFields = vm.data.fields[0].name;
        }

        // vm.chartfilter = {};

        // var toolbox = function(d) {
        //     var tbx = {
        //         show: true,
        //         feature: {
        //             // dataZoom: {
        //             //     yAxisIndex: 'none'
        //             // },
        //             mark: { show: true },
        //             dataZoom: { show: true },
        //             dataZoomReset: { show: true },
        //             // dataView: { readOnly: false },
        //             magicType: { type: ['line', 'bar'] },
        //             restore: {},
        //             // saveAsImage: {},
        //             // myTool1: {
        //             //     show: true,
        //             //     title: '保存为Excel',
        //             //     icon: 'path://M832 972.8h-633.6c-108.8 0-147.2-44.8-147.2-153.6v-620.8c0-108.8 32-147.2 147.2-147.2h486.4c6.4 0 12.8 0 19.2 6.4l256 204.8c6.4 6.4 12.8 12.8 12.8 19.2v531.2c0 108.8-25.6 160-140.8 160z m-633.6-864c-83.2 0-89.6 12.8-89.6 89.6v620.8c0 83.2 6.4 96 89.6 96h633.6c70.4 0 83.2-6.4 83.2-96v-518.4l-236.8-192h-480z" fill="" p-id="1505"></path><path d="M697.6 409.6h-371.2c-32 0-64-6.4-64-64v-256c0-6.4 6.4-12.8 12.8-12.8s12.8 6.4 12.8 12.8v256c0 25.6 0 32 32 32h371.2c25.6 0 32 0 32-32v-211.2c0-6.4 6.4-12.8 12.8-12.8s12.8 6.4 12.8 12.8v211.2c6.4 44.8 0 64-51.2 64z" fill="" p-id="1506"></path><path d="M614.4 294.4c-12.8 0-32-12.8-32-32v-83.2c0-12.8 12.8-25.6 32-25.6 12.8 0 25.6 12.8 25.6 25.6v83.2c0 19.2-12.8 32-25.6 32zM403.2 614.4h-115.2c-6.4 0-12.8-6.4-12.8-12.8s6.4-12.8 12.8-12.8h115.2c6.4 0 12.8 6.4 12.8 12.8 6.4 6.4 0 12.8-12.8 12.8zM608 614.4h-140.8c-6.4 0-12.8-6.4-12.8-12.8s6.4-12.8 12.8-12.8h140.8c6.4 0 12.8 6.4 12.8 12.8s-6.4 12.8-12.8 12.8zM723.2 614.4h-57.6c-6.4 0-12.8-6.4-12.8-12.8s6.4-12.8 12.8-12.8h57.6c6.4 0 12.8 6.4 12.8 12.8s-6.4 12.8-12.8 12.8z" fill="" p-id="1507"></path><path d="M345.6 684.8h-57.6c-6.4 0-12.8-6.4-12.8-12.8s6.4-12.8 12.8-12.8h57.6c6.4 0 12.8 6.4 12.8 12.8 6.4 6.4 0 12.8-12.8 12.8zM518.4 684.8h-115.2c-6.4 0-12.8-6.4-12.8-12.8s6.4-12.8 12.8-12.8h115.2c6.4 0 12.8 6.4 12.8 12.8 6.4 6.4 0 12.8-12.8 12.8zM723.2 684.8h-140.8c-6.4 0-12.8-6.4-12.8-12.8s6.4-12.8 12.8-12.8h140.8c6.4 0 12.8 6.4 12.8 12.8s-6.4 12.8-12.8 12.8z" fill="" p-id="1508"></path><path d="M435.2 768h-140.8c-6.4 0-12.8-6.4-12.8-12.8s6.4-12.8 12.8-12.8h140.8c6.4 0 12.8 6.4 12.8 12.8s-6.4 12.8-12.8 12.8zM537.6 768h-44.8c-6.4 0-12.8-6.4-12.8-12.8s6.4-12.8 12.8-12.8h44.8c6.4 0 12.8 6.4 12.8 12.8s-6.4 12.8-12.8 12.8z',
        //             //     onclick: function () {
        //             //         saveAsExcel(d)("d");
        //             //     }
        //             // }
        //         }
        //     }
        //     return tbx;
        // }

        // var initialParams = { count: 5 };
        // var initialSettings = { counts: [5, 10, 15, 20, 50] };
        // vm.tableParams = new NgTableParams({ count: initialParams.count }, { counts: initialSettings.counts, dataset: [] });
        // vm.fields = [];
        // // 所有chart的对象 都在这里
        // vm.chart = {};
        // // 当前的
        // vm.tabActive = [];
        // // 事件统计
        // vm.chart.event_count = {};
        // vm.chart.event_count.interval = vm.chart.event_count.interval || 30;
        // vm.chart.event_count.setEvevtCount = setEvevtCount;
        // // vm.chart.event_count.fields = vm.strsearch ? vm.strsearch.fields:  [];
        // vm.chart.event_count.config = {
        //     "height": 380,
        //     "width": "100%",
        //     'type': 'bar',
        //     "color": ["#299498"],
        //     "isConnNulls": false,
        //     "legend": { show: false },
        //     "xAxis": { splitLine: { show: false } },
        //     "yAxis": { splitLine: { show: false } },
        //     "grid": {
        //         left: '2%',
        //         right: '2%',
        //         bottom: '2%',
        //         top: '12%',
        //         containLabel: true
        //     },
        //     // "dataZoom": [{
        //     //     type: 'inside',
        //     //     start: 0,
        //     //     end: 10
        //     // }],
        //     "onclick": function(params) {
        //         //  console.log("--------------------", params);
        //     },
        //     toolbox: {},
        //     "noDataText": " "
        //         // "borderColor": "red"
        // };
        // vm.chart.event_count.data = [];
        // // 字段值统计
        // vm.chart.field_statistics = {};
        // vm.chart.field_statistics.getFields = getFields;
        // vm.chart.field_statistics.setFieldStatistics = setFieldStatistics;
        // vm.chart.field_statistics.config = {
        //     "height": 220,
        //     "width": "100%",
        //     "showAllSymbol": true,
        //     "showSymbol": true,
        //     'type': 'bar',
        //     "color": ["#299498"],
        //     "isConnNulls": false,
        //     "legend": { show: false },
        //     "xAxis": { splitLine: { show: false } },
        //     "yAxis": { splitLine: { show: false } },
        //     "grid": {
        //         left: '2%',
        //         right: '2%',
        //         bottom: '2%',
        //         top: '12%',
        //         containLabel: true
        //     },
        //     // "dataZoom": [{
        //     //     type: 'inside',
        //     //     start: 0,
        //     //     end: 10
        //     // }],
        //     toolbox: {},
        //     "onclick": function(params) {
        //         // console.log("--------------------", params);
        //     },
        //     "noDataText": " "
        //         // "borderColor": "red"
        // };
        // vm.chart.field_statistics.data = [];
        // // 字段值分类
        // vm.chart.field_group = {};
        // vm.chart.field_group.setFieldGroup = setFieldGroup; // cumulative_percentage
        // vm.chart.field_group.config = {
        //     "height": 220,
        //     "width": "100px",
        //     'type': 'pie',
        //     'radius': '35%',
        //     'center': ['58%', '60%'],
        //     "pieLableLinePosition": 'outside',
        //     "grid": {
        //         left: '2%',
        //         right: '2%',
        //         bottom: '2%',
        //         top: '12%',
        //         containLabel: true
        //     },
        //     "onclick": function(params) {
        //         // console.log("--------------------", params);
        //     },
        //     toolbox: { show: false },
        //     legend: {
        //         orient: 'vertical',
        //         y: '30px',
        //         x: 'left',
        //         textStyle: {
        //             color: 'auto'
        //         }

        //     },
        //     "noDataText": " "
        //         // "borderColor": "red"
        // };
        // vm.chart.field_group.data = [];

        // // 累计百分比
        // vm.chart.cumulative_percentage = {};
        // vm.chart.cumulative_percentage.getFields = getFields;
        // vm.chart.cumulative_percentage.setCumulativePercentage = setCumulativePercentage;
        // vm.chart.cumulative_percentage.tableParams = new NgTableParams({ count: initialParams.count }, { counts: initialSettings.counts, dataset: [] });;

        // // 数值分段统计
        // vm.chart.numerical_group = {};
        // vm.chart.numerical_group.getFields = getFields;
        // vm.chart.numerical_group.inputGroup = [{
        //     'before': 0,
        //     "after": 0,
        //     "show": true
        // }]; // 默认值
        // vm.chart.numerical_group.getNumericalInputGroup = getNumericalInputGroup;
        // vm.chart.numerical_group.setNumericalGroup = setNumericalGroup;
        // vm.chart.numerical_group.data = [];
        // vm.chart.numerical_group.config = {
        //     "height": 220,
        //     "width": "100%",
        //     "color": ["#299498"],
        //     "toolbox": { show: false },
        //     "grid": {
        //         left: '2%',
        //         right: '2%',
        //         bottom: '2%',
        //         top: '4%',
        //         containLabel: true
        //     },
        //     "onclick": function(params) {
        //         //  console.log("--------------------", params);
        //     },
        //     "noDataText": " "
        //         // "borderColor": "red"
        // };

        // // 时间分段统计
        // vm.chart.timeslicing_group = {};
        // vm.chart.timeslicing_group.getFields = getFields;
        // vm.chart.timeslicing_group.inputGroup = [{
        //     'startDate': 0,
        //     "endDate": 0
        // }]; // 默认值
        // vm.chart.timeslicing_group.getTimeslicingInputGroup = getTimeslicingInputGroup;
        // vm.chart.timeslicing_group.setTimeslicingGroup = setTimeslicingGroup;
        // vm.chart.timeslicing_group.data = [];
        // vm.chart.timeslicing_group.config = {
        //     "height": 220,
        //     "width": "100%",
        //     "color": ["#299498"],
        //     "isConnNulls": false,
        //     "legend": { show: false },
        //     "xAxis": { splitLine: { show: false } },
        //     "yAxis": { splitLine: { show: false } },
        //     "toolbox": { show: false },
        //     "grid": {
        //         left: '2%',
        //         right: '2%',
        //         bottom: '2%',
        //         top: '4%',
        //         containLabel: true
        //     },
        //     "onclick": function(params) {
        //         //  console.log("--------------------", params);
        //     },
        //     "noDataText": " "
        //         // "borderColor": "red"
        // };

        // function setEvevtCount() {
        //     console.log('123456789------------------------');
        //     // vm.chartfilter.filterStatus = false; 
        //     vm.chartfilter.options = vm.options;

        //     var query = bulidQuery(vm.chart.event_count);
        //     // console.log('setEvevtCount', query, vm.chart.event_count.interval, vm.chart.event_count.config);
        //     // 如果没有选择时间 则不刷新
        //     if (vm.chart.event_count.interval) {
        //         query["minutesInterval"] = vm.chart.event_count.interval;
        //         //console.log(query);
        //         EsService.getEventCount.post(query, onSuccess, onError);

        //         function onSuccess(data) {
        //             var _data = data.aggregations; //data.aggregations[0]; 
        //             vm.chart.event_count.data[0] = {
        //                 "name": "数量",
        //                 "type": vm.chart.event_count.config.type || "line",
        //                 "datapoints": []
        //             };
        //             // angular.forEach(_data, function (value, key) {
        //             //     var xy = {
        //             //         x: key,
        //             //         y: value
        //             //     };
        //             //     vm.chart.event_count.data[0].datapoints.push(xy)
        //             // })
        //             vm.chart.event_count.data[0].datapoints = _data;
        //             vm.chart.event_count.config.toolbox = toolbox(vm.chart.event_count.data[0].datapoints)
        //             vm.tableParams.settings({
        //                 dataset: vm.chart.event_count.data[0].datapoints
        //             })

        //             // 查询配置
        //             console.log('setEvevtCount', query, vm.chart.event_count);
        //         }

        //         function onError(err) {
        //             //   console.log(err, "=====")
        //             vm.chart.event_count.data[0].datapoints = [];
        //         }
        //     }
        // }

        // function setFieldStatistics() {
        //     // vm.chartfilter.filterStatus = false;
        //     vm.chartfilter.options = vm.options;

        //     var query = bulidQuery();
        //     if (vm.chart.field_statistics.field) {
        //         var _field = [];
        //         _field.push(vm.chart.field_statistics.field);
        //         query['fields'] = _field;
        //         EsService.getFieldStatistics.post(query, onSuccess, onError);
        //     }

        //     if (vm.chart.field_statistics.interval) {
        //         query["minutesInterval"] = vm.chart.field_statistics.interval;
        //     }
        //     if (vm.chart.field_statistics.polymerType) {
        //         query["aggType"] = vm.chart.field_statistics.polymerType;
        //     }


        //     function onSuccess(data) {
        //         //  console.log(data, '0000=====')
        //         var _data = data.aggregations[vm.chart.field_statistics.polymerType]; //data.aggregations[0][vm.chart.field_statistics.polymerType];
        //         //  console.log(_data, '0000=====')
        //         vm.chart.field_statistics.data[0] = {
        //             "name": "数值",
        //             "type": vm.chart.field_statistics.config.type || "line",
        //             "datapoints": []
        //         };
        //         // angular.forEach(_data, function (d) {
        //         //     angular.forEach(d, function (value, key) {
        //         //         var xy = {
        //         //             x: key,
        //         //             y: value
        //         //         };
        //         //         vm.chart.field_statistics.data[0].datapoints.push(xy)
        //         //     })

        //         // })
        //         vm.chart.field_statistics.data[0].datapoints = _data;
        //         vm.chart.field_statistics.config.toolbox = toolbox(vm.chart.field_statistics.data[0].datapoints)
        //         vm.tableParams.settings({
        //             dataset: vm.chart.field_statistics.data[0].datapoints
        //         })

        //     }

        //     function onError(err) {
        //         // console.log(err)
        //     }
        // }

        // function setFieldGroup() {
        //     // vm.chartfilter.filterStatus = false;
        //     vm.chartfilter.options = vm.options;

        //     var query = bulidQuery();

        //     // 如果没有选择时间 则不刷新
        //     if (vm.chart.field_group.field) {
        //         var _field = [];
        //         _field.push(vm.chart.field_group.field);
        //         query['fields'] = _field;
        //         EsService.getFieldType.post(query, onSuccess, onError);
        //     }

        //     function onSuccess(data) {
        //         var _data = data.aggregations['data']; //data.aggregations[0]['data'];
        //         // console.log(data, '0000=====')
        //         vm.chart.field_group.data[0] = {
        //             "name": "数量",
        //             "type": vm.chart.field_group.config.type || "pie",
        //             "datapoints": [],
        //         };

        //         // angular.forEach(_data, function (d) {
        //         //     angular.forEach(d, function (value, key) {
        //         //         var xy = {
        //         //             x: key,
        //         //             y: value
        //         //         };
        //         //         vm.chart.field_group.data[0].datapoints.push(xy)
        //         //     })

        //         // })
        //         vm.chart.field_group.data[0].datapoints = _data;
        //         if (vm.chart.field_group.config.type && vm.chart.field_group.config.type == 'bar') {
        //             vm.chart.field_group.config.toolbox = toolbox(vm.chart.field_group.data[0].datapoints);
        //         } else {
        //             vm.chart.field_group.config.toolbox = { show: false };
        //         }
        //         vm.tableParams.settings({
        //             dataset: vm.chart.field_group.data[0].datapoints
        //         })
        //         console.log('vm.chart.field_group----', _data)

        //     }

        //     function onError(err) {
        //         // console.log(err)
        //     }

        // };

        // function setCumulativePercentage() {
        //     // vm.chartfilter.filterStatus = false;
        //     vm.chartfilter.options = vm.options;

        //     var query = bulidQuery();
        //     // 如果没有选择时间 则不刷新
        //     if (vm.chart.cumulative_percentage.field) {
        //         var _field = [];
        //         _field.push(vm.chart.cumulative_percentage.field);
        //         query['fields'] = _field;
        //         EsService.getTotalPercent.post(query, onSuccess, onError);
        //     }

        //     function onSuccess(data) {
        //         var _data = data.aggregations;
        //         vm.chart.cumulative_percentage.tableParams.settings({
        //             dataset: _data
        //         })
        //     }

        //     function onError(err) {
        //         //  console.log(err, "=====")
        //     }
        // }

        // function getFields() {
        //     console.log('---------------');
        //     console.log(vm.fields);
        //     var fields = (vm.fields || []).filter(function(d) {
        //         return d['type'] == 'number';
        //     });
        //     // console.log(fields);
        //     return fields;
        // }

        // function getNumericalInputGroup() {
        //     return vm.chart.numerical_group.inputGroup.map(function(d) {
        //         d.rmmyself = function() { // 添加删除固定元素的方法的方法
        //             d["show"] = false;
        //         }
        //         d.addoption = function() { // 添加增加元素的方法的方法
        //             vm.chart.numerical_group.inputGroup.push({
        //                 'before': 0,
        //                 "after": 0,
        //                 "show": true
        //             })
        //         }
        //         d.isuniq = function() { // 添加验证是否是唯一的一个
        //             return vm.chart.numerical_group.inputGroup.filter(function(_d) {
        //                 return _d.show
        //             }).length == 1;
        //         }
        //         return d;
        //     });
        // }

        // function setNumericalGroup() {
        //     // vm.chartfilter.filterStatus = false;
        //     vm.chartfilter.options = vm.options;

        //     var query = bulidQuery();

        //     var inputGroup = vm.chart.numerical_group.inputGroup.filter(function(_d) {
        //         return _d.show
        //     });
        //     if (inputGroup.length > 0) {
        //         var queryranges = {}
        //         inputGroup.map(function(d) {
        //             queryranges[d.before] = d.after
        //         })
        //         query['ranges'] = queryranges;
        //     }
        //     // 如果没有选择字段 则不刷新
        //     if (vm.chart.numerical_group.field)
        //         var _field = [];
        //     _field.push(vm.chart.numerical_group.field);
        //     query['fields'] = _field;


        //     EsService.getSegmentStatistic.post(query, onSuccess, onError);

        //     function onSuccess(data) {
        //         var _data = data.aggregations;
        //         //  console.log(data, '0000=====')
        //         vm.chart.numerical_group.data[0] = {
        //             "name": "值",
        //             "type": "bar",
        //             "datapoints": []
        //         };

        //         vm.chart.numerical_group.data[0].datapoints = _data.map(function(d) {
        //             return {
        //                 x: d['key'],
        //                 y: d['count']
        //             };
        //         })
        //     }

        //     function onError(err) {
        //         //  console.log(err)
        //     }
        // }


        // function getTimeslicingInputGroup() {
        //     return vm.chart.timeslicing_group.inputGroup.map(function(d) {
        //         d.rmmyself = function() { // 添加删除固定元素的方法的方法
        //             d["show"] = false;
        //         }
        //         d.addoption = function() { // 添加增加元素的方法的方法
        //             vm.chart.timeslicing_group.inputGroup.push({
        //                 "startDate": 0,
        //                 "endDate": 0
        //             })
        //         }
        //         d.isuniq = function() { // 添加验证是否是唯一的一个
        //             return vm.chart.timeslicing_group.inputGroup.filter(function(_d) {
        //                 return _d.show != false
        //             }).length == 1;
        //         }
        //         return d;
        //     });
        // }

        // function setTimeslicingGroup() {
        //     // vm.chartfilter.filterStatus = false;
        //     vm.chartfilter.options = vm.options;

        //     var query = bulidQuery();
        //     var field = vm.chart.timeslicing_group.field || 'timestamp'; // 选择的字段
        //     var _field = [];
        //     _field.push(field);
        //     query['fields'] = _field;
        //     var inputGroup = vm.chart.timeslicing_group.inputGroup.filter(function(_d) {
        //         return _d.show != false
        //     });
        //     if (inputGroup.length > 0) {
        //         var cstToutc = function(cst) {
        //                 if (cst == undefined || cst == null) {
        //                     return null;
        //                 } else {
        //                     var d = new Date(cst);
        //                     d.setHours(d.getHours() + 8);
        //                     return d;
        //                 }
        //             }
        //             // var queryranges = {}
        //             // inputGroup.map(function (d) {
        //             //     queryranges[cstToutc(d.startDate)] = cstToutc(d.endDate);
        //             // })
        //             // query['ranges'] = queryranges;
        //         var timeRanges = inputGroup.map(function(d) {
        //             return {
        //                 "from": cstToutc(d.startDate),
        //                 "to": cstToutc(d.endDate)
        //             };
        //         });
        //         query['timeRanges'] = JSON.stringify(timeRanges);
        //     }
        //     // 如果没有选择字段 则不刷新
        //     if (field)
        //         EsService.getTimeSegmentStatistic.post(query, onSuccess, onError);

        //     function onSuccess(data) {
        //         var _data = data.aggregations;
        //         //  console.log(data, '0000=====')
        //         vm.chart.timeslicing_group.data[0] = {
        //             "name": "值",
        //             "type": "bar",
        //             "datapoints": []
        //         };

        //         vm.chart.timeslicing_group.data[0].datapoints = _data.map(function(d) {
        //             return {
        //                 x: d['key'],
        //                 y: d['count']
        //             };
        //         });
        //     }

        //     function onError(err) {
        //         //   console.log(err)
        //     }
        //     // logSearchStatisticViewService.exec(vm.app, query, function (data) {
        //     //     var _data = data.getBody();
        //     //     var _row = data.getHead();
        //     //     console.log("_data", _data);

        //     //     vm.chart.timeslicing_group.data[0] = {
        //     //         "name": "值",
        //     //         "type": "bar",
        //     //         "datapoints": []
        //     //     };
        //     //     vm.chart.timeslicing_group.data[0].datapoints = _data.map(function (d) {
        //     //         return {
        //     //             x: d['timeslicing'],
        //     //             y: d['count']
        //     //         };
        //     //     })
        //     // })

        // }
        // vm.dateRangeOptions = {
        //     "timePicker": true,
        //     "timePicker24Hour": true,
        //     "ranges": {
        //         '15分钟前': [moment().subtract(15, 'minute'), moment()],
        //         '30分钟前': [moment().subtract(30, 'minute'), moment()],
        //         '1个小时前': [moment().subtract(1, 'hour'), moment()],
        //         '6个小时前': [moment().subtract(6, 'hour'), moment()],
        //         '12小时前': [moment().subtract(12, 'hour'), moment()],
        //         '24小时前': [moment().subtract(24, 'hour'), moment()],
        //         '当天': [moment().startOf('days'), moment()],
        //         '当月': [moment().startOf('month'), moment().endOf('month')]
        //     },
        //     "locale": {
        //         "format": "YYYY-MM-DD HH:mm:ss",
        //         "separator": " ~ ",
        //         "applyLabel": "应用",
        //         "cancelLabel": "取消",
        //         "fromLabel": "From",
        //         "toLabel": "To",
        //         "customRangeLabel": "自定义",
        //         "daysOfWeek": [
        //             "日",
        //             "一",
        //             "二",
        //             "三",
        //             "四",
        //             "五",
        //             "六"
        //         ],
        //         "monthNames": [
        //             "一月",
        //             "二月",
        //             "三月",
        //             "四月",
        //             "五月",
        //             "六月",
        //             "七月",
        //             "八月",
        //             "九月",
        //             "十月",
        //             "十一月",
        //             "十二月"
        //         ],
        //         "firstDay": 1
        //     },
        // };
        // // 加之前选择的条件
        // function bulidQuery(chart) {
        //     if (vm.strsearch) {
        //         var obj = {
        //             "index": vm.strsearch.index,
        //             "types": vm.strsearch.types,
        //             "format": "yyyy-MM-dd HH:mm:ss",
        //             "startTime": vm.strsearch.startTime,
        //             "endTime": vm.strsearch.endTime,
        //         };
        //         if (vm.strsearch.queryString) {
        //             obj.queryString = vm.strsearch.queryString;
        //         }
        //         if (vm.strsearch.filterFields) {
        //             obj.filterFields = vm.strsearch.filterFields;
        //         }
        //         return obj;
        //     }

        // }

        /**
         * 选择图表方式
         * @param {*} str 
         */
        function selectedList(str) {
            console.log(str);
            vm.options = str | '0';
        }

        /**
         * 储存查询的图表
         */
        function showSaveModal() {
            // 把查询语句和生成的图表储存
            // var params = angular.copy(vm.chart.event_count);
            // params.query = bulidQuery();
            // params.app = vm.appinfo; // 系统信息
            var params = vm.data.echartsParams;
            params.query = vm.data.query;
            params.app = vm.data.app;
            $uibModal.open({
                templateUrl: 'app/pages/log-search/query-save/query-save.html',
                controller: 'logSearchStatisticViewQuerySaveCtrl',
                controllerAs: 'vm',
                resolve: {
                    transferData: params
                },
                backdrop: 'static'
            });
        }

        // $scope.$watch("vm.strsearch", function(n, o) {
        //     console.log('vm.strsearch', vm.strsearch);
        //     if (vm.strsearch) {
        //         setEvevtCount();
        //         // console.log("vm.strsearch", vm);
        //     }
        // }, true);

        // $scope.$watch("vm.options", function(n, o) {

        //     if (vm.options) {
        //         console.log('vm.options.selected', vm.options.selected);
        //         /**
        //          *   0 事件计数
        //          *   1 字段值统计
        //          *   2 字段值分类
        //          *   3 累计百分比
        //          *   4 数值分段统计
        //          *   5 时间分段统计
        //          **/
        //         switch (vm.options.selected) {
        //             case 0:

        //                 break;
        //             case 1:

        //                 break;
        //             case 2:
        //                 // vm.tabActive = [];
        //                 // vm.tabActive[vm.options.selected] = true;
        //                 vm.chart.field_group.field = vm.options.fields;
        //                 vm.chart.field_group.setFieldGroup();
        //                 break;
        //             case 3:

        //                 break;
        //             default:
        //                 // console.error("不存在的tab");
        //                 break;
        //         }
        //     }
        // }, true)


        /**
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         */

        function buildEcharts(index) {
            vm.data.echarts = echarts.init(document.getElementById('echarts')); //div 标签id
            // 选择的图表
            console.log(index);
            if (index == 0) {
                // 事件计数
                charts0();
            } else if (index == 1) {
                // 字段值统计
                charts1();
            } else if (index == 2) {
                // 字段值分类
                charts2();
            } else if (index == 3) {
                // 累计百分比
                charts3();
            } else if (index == 4) {
                // 数值分段统计
                charts4();
            } else if (index == 5) {
                // 时间分段统计
                charts5();
            }
        }

        function charts0() {
            var params = {
                index: vm.data.app ? vm.data.app.alias + '*' : '',
                endTime: vm.data.date.endTime,
                filterFields: {},
                format: "yyyy-MM-dd HH:mm:ss",
                minutesInterval: vm.data.event.interval,
                startTime: vm.data.date.startTime,
                types: [vm.data.selectedFields], //系统
            };
            var type = vm.data.event.chatType;

            // 储存查询参数，用于保存图表
            vm.data.echartsParams = {
                params: params,
                charType: type,
                index: vm.options
            };

            echartsData(params).then(function(res) {
                console.log('0返回的数据', res);
                // 统一构建函数构建图表
                drawEcharts(res, type);
            })
        }

        function charts1() {
            var params = {
                index: vm.data.app ? vm.data.app.alias + '*' : '',
                endTime: vm.data.date.endTime,
                filterFields: {},
                format: "yyyy-MM-dd HH:mm:ss",
                minutesInterval: vm.data.fieldValue.interval,
                startTime: vm.data.date.startTime,
                types: [vm.data.selectedFields], //系统
                fields: [vm.data.fieldValue.field],
                aggType: vm.data.fieldValue.polymerType,
            }
            var type = vm.data.fieldValue.chatType;
            // 储存查询参数，用于保存图表
            vm.data.echartsParams = {
                params: params,
                charType: type,
                index: vm.options
            };

            echartsData(params).then(function(res) {
                console.log('1返回的数据', res);
                // 统一构建函数构建图表
                drawEcharts(res, type);
            })
        }

        function charts2() {
            var params = {
                index: vm.data.app ? vm.data.app.alias + '*' : '',
                endTime: vm.data.date.endTime,
                filterFields: {},
                format: "yyyy-MM-dd HH:mm:ss",
                minutesInterval: vm.data.fieldGroup.interval,
                startTime: vm.data.date.startTime,
                types: [vm.data.selectedFields], //系统
                fields: [vm.data.fieldGroup.field],
                aggType: vm.data.fieldGroup.polymerType,
            }
            var type = vm.data.fieldGroup.chatType;
            // 储存查询参数，用于保存图表
            vm.data.echartsParams = {
                params: params,
                charType: type,
                index: vm.options
            };

            echartsData(params).then(function(res) {
                console.log('2返回的数据', res);
                // 统一构建函数构建图表
                drawEcharts(res, type);
            })
        }

        function charts3() {
            console.log(vm.data.filedPercentage);
            var params = {
                index: vm.data.app ? vm.data.app.alias + '*' : '',
                endTime: vm.data.date.endTime,
                filterFields: {},
                format: "yyyy-MM-dd HH:mm:ss",
                startTime: vm.data.date.startTime,
                types: [vm.data.selectedFields], //系统
                fields: [vm.data.filedPercentage.field]
            }
            var type = vm.data.filedPercentage.chatType;
            // 储存查询参数，用于保存图表
            vm.data.echartsParams = {
                params: params,
                charType: type,
                index: vm.options
            };

            echartsData(params).then(function(res) {
                console.log('3返回的数据', res);
                // 统一构建函数构建图表
                drawEcharts(res, type);
            })
        }

        // 数值分段统计
        function charts4() {
            var params = {
                index: vm.data.app ? vm.data.app.alias + '*' : '',
                endTime: vm.data.date.endTime,
                filterFields: {},
                format: "yyyy-MM-dd HH:mm:ss",
                startTime: vm.data.date.startTime,
                types: [vm.data.selectedFields], //系统
                fields: [vm.data.numberGroup.field],
                ranges: {}, //范围
            }
            var type = vm.data.numberGroup.chatType;

            // {0: "100", 333: "2121"}
            // 组装数据
            angular.forEach(vm.data.numberGroup.rangesList, function(item, index) {
                if (item.max > item.min) {
                    params.ranges[item.min] = item.max;
                } else {
                    params.ranges[item.max] = item.min;
                }
            })

            // 储存查询参数，用于保存图表
            vm.data.echartsParams = {
                params: params,
                charType: type,
                index: vm.options
            };

            echartsData(params).then(function(res) {
                console.log('4返回的数据', res);
                // 统一构建函数构建图表
                drawEcharts(res, type);
            })
        }

        function charts5() {
            var params = {
                index: vm.data.app ? vm.data.app.alias + '*' : '',
                endTime: vm.data.date.endTime,
                filterFields: {},
                format: "yyyy-MM-dd HH:mm:ss",
                startTime: vm.data.date.startTime,
                types: [vm.data.selectedFields], //系统
                fields: ['timestamp'],
                timeRanges: []
            };
            var type = vm.data.timeGroup.chatType;

            // 组装数据
            angular.forEach(vm.data.timeGroup.rangesList, function(item, index) {
                var _obj = { from: '', to: '' };
                _obj.from = moment(item.from).format();
                _obj.to = moment(item.to).format();
                params.timeRanges.push(_obj);
            })

            params.timeRanges = JSON.stringify(params.timeRanges);

            // 储存查询参数，用于保存图表
            vm.data.echartsParams = {
                params: params,
                charType: type,
                index: vm.options
            };

            echartsData(params).then(function(res) {
                console.log('5返回的数据', res);
                // 统一构建函数构建图表
                drawEcharts(res, type);
            })
        }

        // 拿数据构建图表
        function echartsData(params) {
            var deferred = $q.defer();
            var apiType = '';
            // 选择不同的统计类型
            if (vm.options == 0) {
                apiType = 'getEventCount';
            } else if (vm.options == 1) {
                apiType = 'getFieldStatistics';
            } else if (vm.options == 2) {
                apiType = 'getFieldType';
            } else if (vm.options == 3) {
                apiType = 'getTotalPercent';
            } else if (vm.options == 4) {
                apiType = 'getSegmentStatistic';
            } else if (vm.options == 5) {
                apiType = 'getTimeSegmentStatistic';
            }
            console.log(params);

            EsService[apiType].post(params, function(res) {
                deferred.resolve(res);
            }, function(err) {
                deferred.reject();
            });

            return deferred.promise;
        }

        // 构建图表
        function drawEcharts(res, type) {
            // console.log('返回的数据',res);
            console.log('图表类型', type);
            var option = {};

            // 柱状图和条形图
            var baseOption = {
                title: {
                    text: ''
                },
                backgroundColor: '#fff',
                tooltip: {},
                xAxis: {
                    data: [],
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: '数量',
                    type: type,
                    data: [],
                    itemStyle: {
                        normal: {
                            color: '#399bff'
                        }
                    }
                }],
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

            var pieOption = {
                title: {},
                legend: {
                    // orient: 'vertical',
                    // x: 'left',
                    data: [],
                },
                series: [{
                    // name: '访问来源',
                    type: type,
                    data: [],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b} ({d}%)'
                            },
                            labelLine: {
                                show: true
                            }
                        }
                    }
                }]
            }

            if (type == 'bar' || type == 'line') {
                option = baseOption;
            } else if (type == 'pie') {
                option = pieOption;
            }

            //数据处理
            // 返回的数据格式不通，需要特别处理
            if (vm.options == 0) {
                angular.forEach(res.aggregations, function(item, index) {
                    var _obj = {};
                    if (type == 'bar' || type == 'line') {
                        option.series[0].data.push(item.y);
                        option.xAxis.data.push(item.x);
                    } else if (type == 'pie') {
                        _obj.name = item.x;
                        _obj.value = item.y;
                        option.series[0].data.push(_obj);
                        option.legend.data.push(item.x);
                    }
                });
            } else if (vm.options == 1) {
                angular.forEach(res.aggregations[vm.data.fieldValue.polymerType], function(item, index) {
                    // option.series[0].data.push(item.y);
                    // option.xAxis.data.push(item.x);
                    var _obj = {};
                    if (type == 'bar' || type == 'line') {
                        option.series[0].data.push(item.y);
                        option.xAxis.data.push(item.x);
                    } else if (type == 'pie') {
                        _obj.name = item.x;
                        _obj.value = item.y;
                        option.series[0].data.push(_obj);
                        option.legend.data.push(item.x);
                    }
                });
            } else if (vm.options == 2) {
                angular.forEach(res.aggregations.data, function(item, index) {
                    var _obj = {};
                    if (type == 'bar' || type == 'line') {
                        option.series[0].data.push(item.y);
                        option.xAxis.data.push(item.x);
                    } else if (type == 'pie') {
                        _obj.name = item.x;
                        _obj.value = item.y;
                        option.series[0].data.push(_obj);
                        option.legend.data.push(item.x);
                    }
                });
            } else if (vm.options == 3) {
                // var会变量提升，所以取了个没品味的变量，避免重复
                var _temp3 = [];
                // 解析成数组，在排序，在组装
                angular.forEach(res.aggregations[0], function(key, value) {
                    var _obj = {};
                    _obj.x = +value;
                    _obj.y = key;
                    _temp3.push(_obj);

                })
                var sort_temp3 = _.orderBy(_temp3, ['x', 'asc']);

                angular.forEach(sort_temp3, function(item, index) {
                    option.series[0].data.push(item.y);
                    option.xAxis.data.push(item.x + '%');
                })
            } else if (vm.options == 4) {
                var temp4_count = [10, 20, 22, 24, 12, 12, 59, 10, 20, 22, 24, 12, 12, 59]
                angular.forEach(res.aggregations, function(item, index) {
                    // option.series[0].data.push(item.count);
                    option.series[0].data.push(temp4_count[index]);
                    option.xAxis.data.push(item.key);
                })
            } else if (vm.options == 5) {
                angular.forEach(res.aggregations, function(item, index) {
                    option.series[0].data.push(item.count);
                    option.xAxis.data.push(item.key);
                })
            }

            console.log('图表配置', option);

            $timeout(function() {
                vm.data.echarts = vm.data.echarts || echarts.init(document.getElementById('echarts')); //div 标签id
                vm.data.echarts.showLoading();
                // true重新加载
                // console.log('id' + index, option);
                vm.data.echarts.setOption(option, true);
                vm.data.echarts.hideLoading();
                vm.data.echarts.resize();
                window.onresize = function() {
                    vm.data.echarts.resize();
                };
            }, 1000)
        }

        // 添加数值分段
        function addNumberGroupItem() {
            var _obj = { min: 0, max: 0 }
            vm.data.numberGroup.rangesList.push(_obj);
        }

        // 删除数值分段
        function deleteNumberGroupItem(index) {
            vm.data.numberGroup.rangesList.splice(index, 1);
        }

        // 添加时间分段
        function addTimeGroupItem() {
            var _obj = {
                from: '',
                to: '',
                isFromOpen: false,
                isToOpen: false
            };
            vm.data.timeGroup.rangesList.push(_obj);
        }

        // 删除时间分段
        function deleteTimeGroupItem(index) {
            vm.data.timeGroup.rangesList.splice(index, 1);
        }

        // 打开时间下拉框
        function openDateDropMeun(e, item, index, status) {
            // console.log(item, index);
            e.preventDefault();
            e.stopPropagation();
            // vm.data.dateTimepicker.startTimeOpts.isOpen = true;
            if (status == 0) {
                vm.data.timeGroup.rangesList[index].isFromOpen = true;
            } else {
                vm.data.timeGroup.rangesList[index].isToOpen = true;
            }
        }

        // 切换类型
        function changeFileds(index) {
            console.log(index);
            vm.data.fieldValue.field = vm.data.fields[index].children[0].name;
            vm.data.fieldValue.fieldList = vm.params.fields[index].children;

            vm.data.fieldGroup.field = vm.data.fields[index].children[0].name;
            vm.data.fieldGroup.fieldList = vm.params.fields[index].children;

            vm.data.filedPercentage.field = vm.data.fields[index].children[0].name;
            vm.data.filedPercentage.fieldList = vm.params.fields[index].children;

            vm.data.numberGroup.field = vm.data.fields[index].children[0].name;
            vm.data.numberGroup.fieldList = vm.params.fields[index].children;
        }

        $scope.$on('buildParamsOptionsSuccess', function(event, data) {
            console.log('buildParamsOptionsSuccess', event, data);
            vm.params = data;
            // vm.data.app = data.app;
            // vm.data.fields = data.fields;
            // vm.data.query = data.query;
            // vm.data.table = data.table;
            // vm.data.date = data.date;

            vm.data.app = vm.params.app;
            vm.data.fields = vm.params.fields;
            vm.data.query = vm.params.query;
            vm.data.table = vm.params.table;
            vm.data.date = vm.params.date;

            // 默认选择第一个type
            vm.data.selectedFields = data.fields[0].name;

            changeFileds(0);
        })


        // 初始化
        init();
    }

    function tableSaveAsExcel(table) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
            base64 = function(s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            format = function(s, c) {
                return s.replace(/{(\w+)}/g, function(m, p) {
                    return c[p];
                })
            },
            trow = function(a) {
                return ['<tr>', a.map(function(c) {
                    return ['<td>', c, '</td>'].join('')
                }).join(''), '</tr>'].join('')
            },
            srow = function(h, r) {
                return trow(Object.keys(h).map(function(k) {
                    return r[k]
                }))
            },
            html = function(d) {
                var h = d.shift();
                return ['<table><tbody>', trow(Object.keys(h)), d.map(function(r) {
                    return srow(h, r)
                }).join(''), '</tbody></table>'].join('')
            }

        return function(name) {
            var ctx = {
                worksheet: name || 'Worksheet',
                table: table
            };
            // window.location.href = uri + base64(format(template, ctx))
            window.open(uri + base64(format(template, ctx)), '_blank');
        }
    };

    function saveAsExcel(data) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
            base64 = function(s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            format = function(s, c) {
                return s.replace(/{(\w+)}/g, function(m, p) {
                    return c[p];
                })
            },
            trow = function(a) {
                return ['<tr>', a.map(function(c) {
                    return ['<td>', c, '</td>'].join('')
                }).join(''), '</tr>'].join('')
            },
            srow = function(h, r) {
                return trow(Object.keys(h).map(function(k) {
                    return r[k]
                }))
            },
            html = function(d) {
                var h = d.shift();
                return ['<table><tbody>', trow(Object.keys(h)), d.map(function(r) {
                    return srow(h, r)
                }).join(''), '</tbody></table>'].join('')
            }
            //, html = function(d) { var h = d.shift(); return ['<table><tbody>', trow(Object.keys(h)), d.map(function(r){ return srow(h, r) }).join(''), '</tbody></table>'].join('') }

        return function(name) {
            data.map(function(r) {
                delete r.$$hashKey;
            });
            var ctx = {
                worksheet: name || 'Worksheet',
                table: html(data)
            };
            //console.log(html(data));
            //console.log(format(template, ctx));
            // window.location.href = uri + base64(format(template, ctx))
            window.open(uri + base64(format(template, ctx)), '_blank');
        }
    };

    /**
     * 统计页面
     */
    function logSearchStatisticViewQueryNew() {
        return {
            restrict: 'EA',
            controller: 'StatisticViewQueryNewCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/pages/log-search/log-search-statistic-view-query-new.html',
            bindToController: true,
            scope: {
                params: '='
            },
            link: function(scope, element, attrs) {

            }
        }
    }
})();