(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.spl-sql-search')
        .directive('splSqlSearchView', splSqlSearchView)
        .factory('logSearchSplViewService', logSearchSplViewService)
        .controller('SplViewCtrl', SplViewCtrl);
    //utils.factory('DataUtil', DataUtil);
    logSearchSplViewService.$inject = ['$resource', '$http', '$filter', 'DateUtils', 'DataStore', 'EsService', 'toastr', 'ResultHandler', 'NgTableParams'];
    SplViewCtrl.$inject = ['$scope', '$stateParams', '$log', '$q', '$sce', '$state', '$timeout', 'EsService', 'Principal', 'toastr', 'logSearchSplViewService', 'ResultHandler', 'NgTableParams'];

    function SplViewCtrl($scope, $stateParams, $log, $q, $sce, $state, $timeout, EsService, Principal, toastr, logSearchSplViewService, ResultHandler, NgTableParams) {
        var vm = this;

        // vm.getLegentList = getLegentList;
        var data = [];
        // table 的参数
        vm.tableParams = new NgTableParams();
        vm.dataRow = [];
        vm.dataHead = [];
        vm.disable = false;



        vm.chartCountSelect = { selected: undefined, data: [] };
        vm.chartLegendSelect = { selected: undefined, data: [] };

        vm.numerical_group = {};
        vm.numerical_group.inputGroup = [];
        vm.numerical_group.getNumericalInputGroup = getNumericalInputGroup;
        vm.numerical_group.data = [];

        vm.line_numerical_group = {};
        vm.line_numerical_group.inputGroup = [];
        vm.line_numerical_group.getLineNumericalInputGroup = getLineNumericalInputGroup;
        vm.line_numerical_group.data = [];


        // logSearchSplViewService.execSpl("/db2*", "|stats sum WebContainer as sumweb by hostname");

        $scope.$watch("vm.expression", function(n, o) {

            // console.log(vm.expression, vm.model );
            var type = 'execSpl';
            if (n) {
                if (vm.model == 'SPL') {
                    type = 'execSpl';
                } else {
                    type = 'execSql';
                }
                logSearchSplViewService[type](vm.expression, function(_d) {
                    var body = ResultHandler.create(_d, false, false, false, false);
                    // console.log(body.body);
                    vm.dataHead = getTableParamsHead(body.getHead());
                    vm.dataRow = body.getBody();
                    retab(body.getBody());

                    function getTableParamsHead(body) {
                        var result = [];
                        _.forEach(body, function(row) {
                            var obj = {};
                            obj.title = row;
                            obj.field = row;
                            obj.sortable = row;

                            result.push(obj);
                            // 如果图例不是字符串，数值不是数字类型，则不能切换点击
                            if (result.length <= 1) {
                                vm.disable = true;
                                console.log('vm.disable---------', vm.disable);
                            } else {

                                console.log('vm.disable---------false', vm.disable);
                            }
                        })
                        return result;
                    }




                    //初始化环形图
                    vm.chartLegendSelect.data = [];
                    if (vm.dataHead.length > 0) {
                        vm.chartLegendSelect.selected = vm.dataHead[0];
                        vm.chartLegendSelect.data.push(vm.dataHead[0]);
                    }
                    vm.chartCountSelect.data = [];
                    for (var i = 1; i < vm.dataHead.length; i++) {
                        vm.chartCountSelect.data.push(vm.dataHead[i]);
                    }
                    if (vm.chartCountSelect.data.length > 0) {
                        vm.chartCountSelect.selected = vm.chartCountSelect.data[0];
                    }

                    // 初始化柱状图
                    vm.numerical_group.inputGroup = [];
                    vm.numerical_group.inputGroup.push({
                        data: vm.chartCountSelect.data,
                        selected: vm.chartCountSelect.selected,
                        show: true
                    });
                    // console.log('柱状111-----',vm.numerical_group.inputGroup)

                    // 初始化折线图
                    vm.line_numerical_group.inputGroup = [];
                    vm.line_numerical_group.inputGroup.push({
                        data: vm.chartCountSelect.data,
                        selected: vm.chartCountSelect.selected,
                        show: true
                    });
                    //  console.log('折线111-----',vm.line_numerical_group.inputGroup)
                });
            }
        }, true);

        function retab(data) {

            vm.tableParams = new NgTableParams({}, { dataset: data });
        }

        // 环形图
        vm.optionPie = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                // top: 'middle',
                top: 10,
                x: 'left',
                data: [],
                textStyle: {
                    color: '#777'
                }
            },

            series: [{
                type: 'pie',
                radius: ['30%', '40%'],
                center: ['55%', '60%'],
                selectedMode: 'single',
                data: []
            }]
        };
        $scope.$watch("vm.chartCountSelect.selected", function(n, o) {
            if (n) {
                vm.optionPie.legend.data = [];
                vm.optionPie.series[0].data = [];
                var dataName = [];
                var resultData = [];
                _.forEach(vm.dataRow, function(row) {
                    var countTitle = vm.chartCountSelect.selected.title;
                    dataName.push(row[vm.chartLegendSelect.selected.field]);
                    resultData.push({
                        name: row[vm.chartLegendSelect.selected.field],
                        value: row[countTitle]
                    });
                })
                vm.optionPie.legend.data = dataName;
                vm.optionPie.series[0].data = resultData;
                console.log('环形tuli-----', vm.optionPie.legend.data[0]);
                console.log('数值-----', vm.optionPie.series[0].data[0].value);
                // 如果图例不是字符串，数值不是数字类型，则不能切换点击
                if ((angular.isString(vm.optionPie.legend.data[0]) && angular.isNumber(vm.optionPie.series[0].data[0].value)) || (angular.isDate(vm.optionPie.legend.data[0]) && angular.isNumber(vm.optionPie.series[0].data[0].value))) {
                    vm.disable = false;
                    console.log('vm.disable---------', vm.disable);
                } else {
                    vm.disable = true;
                    console.log('vm.disable---------', vm.disable);
                }

            }
        }, true)

        vm.optionBar = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: []
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                data: [],
                axisLabel: {
                    rotate: 45,
                    interval: 5,
                    textStyle: {
                        color: '#777'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {

                    textStyle: {
                        color: '#777'
                    }
                }
            }],
            series: []
        };

        $scope.$watch("vm.numerical_group.inputGroup", function(n, o) {
            if (n) {
                var showGroup = vm.numerical_group.inputGroup.filter(function(_d) {
                    return _d.show && !_.isNil(_d.selected)
                });

                vm.optionBar.legend.data = [];
                vm.optionBar.xAxis.data = [];
                vm.optionBar.series = [];
                vm.chart_type;

                _.forEach(showGroup, function(item) {

                    vm.optionBar.legend.data.push(item.selected.title);
                    vm.optionBar.series.push({
                        name: item.selected.title,
                        type: 'bar',
                        data: []
                    });

                    _.forEach(vm.dataRow, function(row) {

                        vm.optionBar.series[vm.optionBar.series.length - 1].data.push(row[item.selected.title]);
                    });
                });
                _.forEach(vm.dataRow, function(row) {
                    vm.optionBar.xAxis[0].data.push(row[vm.chartLegendSelect.selected.field]);
                });
            }
        }, true)

        vm.optionLine = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: []
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                data: [],
                axisLabel: {
                    rotate: 45,
                    interval: 5,
                    textStyle: {
                        color: '#777'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {

                    textStyle: {
                        color: '#777'
                    }
                }
            }],
            series: []
        };

        $scope.$watch("vm.line_numerical_group.inputGroup", function(n, o) {
            if (n) {
                var showGroup = vm.line_numerical_group.inputGroup.filter(function(_d) {
                    return _d.show && !_.isNil(_d.selected)
                });

                vm.optionLine.legend.data = [];
                vm.optionLine.xAxis.data = [];
                vm.optionLine.series = [];


                _.forEach(showGroup, function(item) {

                    vm.optionLine.legend.data.push(item.selected.title);
                    vm.optionLine.series.push({
                        name: item.selected.title,
                        type: 'line',
                        data: []
                    });

                    _.forEach(vm.dataRow, function(row) {
                        vm.optionLine.series[0].data.push(row[item.selected.title]);
                    });
                });
                _.forEach(vm.dataRow, function(row) {
                    vm.optionLine.xAxis[0].data.push(row[vm.chartLegendSelect.selected.field]);
                });
            }
        }, true)

        function getNumericalInputGroup() {
            var ret = vm.numerical_group.inputGroup.map(function(d) {
                d.rmmyself = function() { // 添加删除固定元素的方法的方法
                    d["show"] = false;
                }
                d.addoption = function() { // 添加增加元素的方法的方法
                    vm.numerical_group.inputGroup.push({
                        data: vm.chartCountSelect.data,
                        selected: undefined,
                        show: true
                    })
                }
                d.canAdd = function() {
                    if (vm.numerical_group.inputGroup.filter(function(input) {
                            return _.isNil(input.selected);
                        }).length > 0) {
                        return false;
                    }

                    var group = this.data.filter(function(item) {
                        var selectedGroup = vm.numerical_group.inputGroup.filter(function(input) {
                            return !_.isNil(input.selected) && input.selected.title == item.title;
                        });
                        return selectedGroup.length == 0;
                    });
                    return group.length > 0;
                }
                d.isuniq = function() { // 添加验证是否是唯一的一个
                    return vm.numerical_group.inputGroup.filter(function(_d) {
                        return _d.show
                    }).length == 1;
                }
                d.getCanSelectGroup = function() { // 过滤已经选择的下拉框
                    var group = this.data.filter(function(item) {
                        var selectedGroup = vm.numerical_group.inputGroup.filter(function(input) {
                            return !_.isNil(input.selected) && input.selected.title == item.title;
                        });
                        return selectedGroup.length == 0;
                    });
                    return group;
                }
                return d;
            });
            return ret;
        }

        function getLineNumericalInputGroup() {
            var ret = vm.line_numerical_group.inputGroup.map(function(d) {
                d.rmmyself = function() { // 添加删除固定元素的方法的方法
                    d["show"] = false;
                }
                d.addoption = function() { // 添加增加元素的方法的方法
                    vm.line_numerical_group.inputGroup.push({
                        data: vm.chartCountSelect.data,
                        selected: undefined,
                        show: true
                    })
                }
                d.canAdd = function() {
                    if (vm.line_numerical_group.inputGroup.filter(function(input) {
                            return _.isNil(input.selected);
                        }).length > 0) {
                        return false;
                    }

                    var group = this.data.filter(function(item) {
                        var selectedGroup = vm.line_numerical_group.inputGroup.filter(function(input) {
                            return !_.isNil(input.selected) && input.selected.title == item.title;
                        });
                        return selectedGroup.length == 0;
                    });
                    return group.length > 0;
                }
                d.isuniq = function() { // 添加验证是否是唯一的一个
                    return vm.line_numerical_group.inputGroup.filter(function(_d) {
                        return _d.show
                    }).length == 1;
                }
                d.getCanSelectGroup = function() { // 过滤已经选择的下拉框
                    var group = this.data.filter(function(item) {
                        var selectedGroup = vm.line_numerical_group.inputGroup.filter(function(input) {
                            return !_.isNil(input.selected) && input.selected.title == item.title;
                        });
                        return selectedGroup.length == 0;
                    });
                    return group;
                }
                return d;
            });
            return ret;
        }
    }

    function logSearchSplViewService($resource, $http, $filter, DateUtils, DataStore, EsService, toastr, ResultHandler, NgTableParams) {

        function execSpl(body, callback) {
            EsService.logSearchForSpl().post({ spl: body }, function(data) {
                EsService.logSearchForSql().post({ "sql": data.sql }, callback, function(data) { toastr.error("错误", "查询时出错" + JSON.stringify(data)) })
            });
        }

        function execSql(sql, callback) {
            EsService.logSearchForSql().post({ "sql": sql }, callback, function(data) { toastr.error("错误", "sql 查询出错" + JSON.stringify(data)) })
        }

        return {
            "execSpl": execSpl,
            "execSql": execSql
        }
    }





    function splSqlSearchView() {
        return {
            restrict: 'EA',
            controller: 'SplViewCtrl',
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'app/pages/spl-sql-search/spl-sql-search-view.html',
            scope: {
                expression: '=',
                model: '='
            },
            link: function(scope, element, attrs) {

            }
        }
    }

})();