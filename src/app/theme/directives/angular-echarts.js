(function () {
    // 'use strict';
/**
 * generate directive link function
 *
 * @param {Service} $http, http service to make ajax requests from angular
 * @param {String} type, chart type
 */
function getLinkFunction($http, $timeout, $window, theme, util, type) {
    return function (scope, element, attrs) {
        scope.config = scope.config || {};
        console.log( scope.config, '----- scope.config')
        var ndWrapper = element.find('div')[0], ndParent = element.parent()[0], parentWidth = ndParent.clientWidth, parentHeight = ndParent.clientHeight, width, height, chart;
        var chartEvent = {};

        function getGridsterContainer() {
            //return scope.$parent.$parent.$parent;
            return scope.$parent == null ? null :
                scope.$parent.$parent == null ? null : scope.$parent.$parent.$parent;
        }

        function getSizes(config) {
            var grid = getGridsterContainer()==null ? null: getGridsterContainer().gridster;
            var item = getGridsterContainer()==null ? null: getGridsterContainer().gridsterItem;
             
            console.log("parentWidth-----", parentWidth);
            parentWidth = ndParent.clientWidth;  //full-size 指令对应

            if (item) {
                var ts_widget = $(element).parentsUntil(".ts-widget")[0];
                var fullWidth = $(window).innerWidth();
                var fullHeight = $(window).innerHeight();
                if (fullWidth - ts_widget.clientWidth >=20 ) {
                    width = Math.round(grid.curColWidth * item.sizeX) - 12;
                    height = Math.round(grid.curRowHeight * item.sizeY) - 12;
                } else {
                    width = fullWidth;
                    height = fullWidth / item.sizeX * item.sizeY;
                    if (height > fullHeight) {
                        height = fullHeight;
                        width = height / item.sizeY * item.sizeX;
                    }
                }

            } else {
                // in case of the same size
                //width = config.width || parentWidth || 240;
                width =  parentWidth || 240;
                height = config.height +40 || 200;
                // in case of maximize
/*                width = parentWidth || 240;
                height = Math.round(parentWidth / config.height / config.width) || 200;*/
            }
            if (config.isConnect) {
                width = parentWidth;
                height = parentHeight + 40;
            }
            ndWrapper.style.width = width + 'px';
            ndWrapper.style.height = height-40 + 'px';
            config.chartWidth = width;
        }
        function getOptions(dataInput, config, type) {

            var data = [];
            // grouping data item when grouping flag is true
            if (config.grouping) {
                var data2 = _.cloneDeep(dataInput);
                for (var i=0;i<data2.length;i++) {
                    var groups = _.groupBy(data2[i].datapoints, function(item){
                        return item.z
                    });
                    _.forEach(groups, function(value, key){
                        var items = [];
/*                        _.forEach(value, function(point){
                            items.push({"x": point.x, ""});
                        });*/
                        data.push({"name": data2[i].name+":"+key, "datapoints":value});
                    });
                }
            } else {
                data = _.cloneDeep(dataInput);
            }


            var warn = _.remove(data, function(serie) {
                return serie.type === 'warn';
            });
            if (warn != null && warn.length > 0) {
                var brushs = [];
                _(warn[0].datapoints).forEach( function(b) {
                    brushs.push({start:b.x, end:b.y});
                });
                config.brush = brushs;
            }

            if (data.length == 1) {
                data[0].datapoints = _.sortBy(data[0].datapoints, function(o) { return o.x; });
            }

            if (data.length > 1) {
                var lowerIndex = _.findIndex(data, function(o) { return o.type == 'lower'; });
                if (lowerIndex > 0 ) {
                    var lower = data.splice(lowerIndex,1);
                    data.unshift(lower[0]);
                }
            }
            if (data.length > 1) {
                // merge different xAxis
                var allX = [];
                angular.forEach(data, function (serie) {
                    angular.forEach(serie.datapoints, function (datapoint) {
                        allX.push(datapoint.x);
                    });
                });
                var uniqX = _.uniq(allX);
                angular.forEach(data, function (serie) {
                    var serieX = _.map(serie.datapoints, 'x');
                    for (i=0; i<uniqX.length; i++) {
                        if (!_.includes(serieX, uniqX[i])){
                            serie.datapoints.push({x:uniqX[i], y:undefined});
                        }
                    }
                    serie.datapoints = _.sortBy(serie.datapoints, function(o) { return o.x; });
                });

                // standarize process
                if (config && config.standardize == true) {
                    for(var i=0; i<data.length; i++) {
                        var allY = [];
                        var standard = [];
                        _.forEach(data[i].datapoints, function(point) {
                            allY.push(point.y);
                        });
                        var maxY = _.maxBy(allY);
                        var minY = _.minBy(allY);
                        _.map(data[i].datapoints, function (item) {
                            standard.push({x:item.x, y: _.round((item.y-minY)/(maxY-minY),2) });
                        });
                        data[i].datapoints = standard;
                    }
                }
            }

            // merge default config
            config = angular.extend({
                showXAxis: true,
                showYAxis: true,
                showLegend: true
            }, config);

            function isObjData(d) {
                try {
                    //var objY = angular.fromJson(d[0].datapoints[0].y);
                    var objY = angular.fromJson(d.datapoints[0].y);
                    return angular.isObject(objY);
                } catch (e) {
                    return false;
                }
            }

            function getAllKeys(items) {
                var allKeys = [];
                angular.forEach(items, function(item){
                    allKeys = _.concat(allKeys, _.keys(angular.fromJson(item.y)));
                });
                return _.uniq(allKeys);
            }

            // function getTop10(data) {
            //     var top10 = {};
            //     var Items = _.cloneDeep(data).datapoints;
            //     angular.forEach(items, )
            // }

            function isValid(ys) {
                var vArray = _.filter(ys, function(d){
                    return (d.y && d.y>0) ;
                })
                return vArray.length > 0;
            }
//             if (isObjData(dataInput)) {
//                 console.log(angular.toJson(dataInput[0]));
//                 var data2 = _.cloneDeep(data);
//                 data = [];
//                 for (var i=0;i<data2.length;i++) {
//                     var objY = angular.fromJson(data2[i].datapoints[0].y);
//                     var keys = _.keys(objY);
//                     _(keys).forEach( function(key){
//                         var dArray = [];
// /*                        _(data2[i].datapoints).forEach( function(d2) {
//                             dArray.push({x: d2.x, y:angular.fromJson(d2.y)[key]});
//                         });*/
//                         for (var j=0;j<data2[i].datapoints.length;j++) {
//                             dArray.push({x: data2[i].datapoints[j].x, y:angular.fromJson(data2[i].datapoints[j].y)[key]});
//                         }
//                         //data.push({name:key, datapoints:dArray, type:'bar', stack:data2[i].name});
//                         data.push({name:key, datapoints:dArray, type: data2[i].type, stack: config.multipleCharts != true && data2[i].type=='bar'? data2[i].name:null  });
//                     });
//                 }
//                 config.showLegend = false;
//                 config.labelShow = false;
//             }
            var hasObjectY = false;  // 当有json y值的时候 双Y轴的补丁
            for (var i=0;i<dataInput.length;i++) {
                if (isObjData(dataInput[i])) {
                    var data2 = _.cloneDeep(dataInput[i]);
                    data.splice(i,1);
                    //var data2 = getTop10(dataInput[i]);
                    //var objY = angular.fromJson(data2.datapoints[0].y);
                    //var keys = _.keys(objY);
                    var keys = _.sortBy(getAllKeys(data2.datapoints));
                    //console.log(keys);
                    //for test only start
                    //keys = _.take(keys, 50);
                    //for test only end
                    _(keys).forEach( function(key){
                        var dArray = [];
                        //var subTotal = 0;
                        for (var j=0;j<data2.datapoints.length;j++) {
                            dArray.push({x: data2.datapoints[j].x, y:angular.fromJson(data2.datapoints[j].y)[key]});
                            //subTotal += angular.fromJson(data2.datapoints[j].y)[key];
                        }
                        // if (isValid(dArray) == true) {
                            data.push({name:key, datapoints:dArray, type: data2.type, stack: config.multipleCharts != true && (data2.type=='bar' || data2.type=='area')? data2.name:null  });
                        // }
                    });
                    //config.showLegend = false;
                    config.labelShow = false;
                    hasObjectY = true;
                } else {
                    if (hasObjectY) {
                        dataInput[i].yAxisIndex = 1;
                        config.tooltipJson = true;
                    }
                    //data.push(dataInput[i]);      //  前面已经加过了，这里不用再加
                }
            }
            //console.log(data);


            var labelLen = 8;
            var xAxis = angular.extend({
                    orient: 'top',
                    axisLine: { show: true },
                    splitLine: {show: true, lineStyle: {width:1, color:"#ddd", opacity:0.5}},
                    axisLabel: {
                        rotate: config.shortenXaxis?20:0,
                        formatter: function (value, index) {
                            return config.shortenXaxis && (value.length > labelLen) ? value.substr(value.length-labelLen,labelLen) : value;
                        }
                    }
                }, angular.isObject(config.xAxis) ? config.xAxis : {});

            var yAxis = angular.extend({
                    type: 'value',
                    orient: 'right',
                    //scale: false,
                    scale: config.scale != null ? config.scale : (type=='line' ? true:false),
                    axisLine: { show: true },
                    splitLine: {show: true, lineStyle: {width:1, color:"#ddd", opacity:0.5}},
                    axisLabel: {
                        formatter: function (v) {
                            return util.formatKMBT(v);
                        }
                    }
                }, angular.isObject(config.yAxis) ? config.yAxis : {});

                // jzh
                var yAxis_array =[ yAxis ];
                angular.forEach(data, function(serie) {
                    if(serie["yAxisIndex"] &&(serie["type"]=="line" || serie["type"] == "bar"))
                        yAxis_array.push({});
                })

            // basic config
            var options = {
                    progressive: 50, // 浏览器性能差渲染效率的对应
                    title: util.getTitle(data, config, type),
                    grid: util.getGrid(data, config, type),
                    tooltip: util.getTooltip(data, config, type),
                    legend: util.getLegend(data, config, type),
                    toolbox: angular.extend({ show: config.isConnect ? false : true, right:30, feature: util.isAxisChart(type, data)?{saveAsImage:{}, dataView:{}, dataZoom:{}, magicType:{type:['line','bar']}}:{}},
                        angular.isObject(config.toolbox) ? config.toolbox : {}),
                    xAxis: [ angular.extend(xAxis, util.getAxisTicks(data, config, type)) ],
                    yAxis: yAxis_array,
                    color: util.getColor(data, config, type),
                    series: util.getSeries(data, config, type, null),
                    tooltip: util.getTooltip(data, config, type),
                    backgroundColor: util.getBgColor(data, config, type),
                    dataZoom: util.getZoom(data, config, type),
                    brush: util.getBrush(data, config, type),
                };

            // in case of multiple charts in one widget.
            if (Array.isArray(options.grid) && options.grid.length > 1) {
                var xAx = _.cloneDeep(options.xAxis[0]);
                var yAx = _.cloneDeep(options.yAxis[0]);
                var xAxs = [];
                var yAxs = [];
                for (i in options.grid) {
                    xAxs.push(_.cloneDeep(xAx));
                    xAxs[i].gridIndex = +i;
                    yAxs.push(_.cloneDeep(yAx));
                    yAxs[i].gridIndex = +i;
                }
                options.xAxis = xAxs;
                options.yAxis = yAxs;
            }

            if (!config.showXAxis) {
                angular.forEach(options.xAxis, function (axis) {
                    axis.axisLine = { show: false };
                    axis.axisLabel = { show: false };
                    axis.axisTick = { show: false };
                });
            }
            if (!config.showYAxis) {
                angular.forEach(options.yAxis, function (axis) {
                    axis.axisLine = { show: false };
                    axis.axisLabel = { show: false };
                    axis.axisTick = { show: false };
                });
            }
            if (!config.showLegend || type === 'gauge' || type === 'map') {
                delete options.legend;
            }
            if (!util.isAxisChart(type, data)) {
                delete options.xAxis;
                delete options.yAxis;
            }
            if (config.dataZoom) {
                options.dataZoom = angular.extend({
                    show: true,
                    realtime: true
                }, config.dataZoom);
            }
            if (config.dataRange) {
                options.dataRange = angular.extend({}, config.dataRange);
            }
            if (config.polar) {
                options.polar = config.polar;
            }
            //console.log(options);
            return options;
        }
        var isAjaxInProgress = false;
        var textStyle = {
                color: 'red',
                fontSize: 36,
                fontWeight: 900,
                fontFamily: 'Microsoft Yahei, Arial'
            };
        function setOptions() {

            function getNoDataOption(config) {
                var noDataOption = {
                    graphic: {
                        elements: [
                            {
                                type: 'text',
                                left: 'center',
                                top: 'middle',
                                style: {
                                    text: config.noDataText || '暂无数据',
                                    font: 'bolder 30px cursive',
                                    fill: '#369'
                                }
                            }
                        ]
                    }
                };
                return noDataOption;
            }
            if (!scope.data || !scope.config) {
                return;
            }



            var options;
            getSizes(scope.config);
            if (!chart) {
                chart = echarts.init(ndWrapper, theme.get(scope.config.theme || 'macarons'));
            }

            if (scope.data.length == 0) {
                chart.clear();
                chart.setOption(getNoDataOption(scope.config));
                chart.resize();
                return;
            }
            var totalNum = 0;
            angular.forEach(scope.data, function(item) {
                totalNum += item.datapoints.length;
            })
            if (totalNum == 0) {
                chart.clear();
                chart.setOption(getNoDataOption(scope.config));
                chart.resize();
                return;
            }


            if (scope.config.isConnect) {
                chart.group = 'tss-ui-group';
                echarts.connect('tss-ui-group');
            }
            if (scope.config.event) {

                var toFn = (function(x) {
                    try {
                        var fn = new Function('$name','$value',x);
                        return fn;

                    } catch (e) {
                        return null;
                    }
                });

                if (!Array.isArray(scope.config.event)) {
                    scope.config.event = [scope.config.event];
                }
                if (Array.isArray(scope.config.event)) {
                    scope.config.event.forEach(function (ele) {
                        if (!ele.type) ele.type = 'click';
                        if (!chartEvent[ele.type]) {
                            chartEvent[ele.type] = true;
                            chart.on(ele.type, function (param) {
                                //ele.fn(param);
                                var fn = toFn(ele.strFn);
                                if (fn) fn(param.name, param.value);
                            });
                        }
                    });
                }
            } else {
                //apply click event to save curent data into widget;
                //TODO: for TSS bigdata platform only
                var getWidget = function(){
                    return  scope.$parent.vm.widget;
                };
                if (!chartEvent['click']) {
                    chartEvent['click'] = true;
                    chart.on('click', scope.config.onclick || function (param) {
                        var curElement = {name:param.name, value:param.value};
                        //var widget = scope.$parent.$parent.vm.widget;
                        var widget = getWidget();
                        if(widget)
                            widget.curElement = curElement;
                        // alert(angular.toJson(scope.config.curElement));
                    });
                }
            }
/*            chart.on('legendselected', function (param) {
                console.log("legendselected");
            });*/

            // string type for data param is assumed to ajax datarequests
            if (angular.isString(scope.data)) {
                if (isAjaxInProgress) {
                    return;
                }
                isAjaxInProgress = true;
                // show loading
/*                chart.showLoading({
                    text: scope.config.loading || '\u594B\u529B\u52A0\u8F7D\u4E2D...',
                    textStyle: textStyle
                });*/
                // fire data request
                $http.get(scope.data).success(function (response) {
                    isAjaxInProgress = false;
                    chart.hideLoading();
                    if (response.data) {
                        options = getOptions(response.data, scope.config, type);
                        if (scope.config.forceClear) {
                            chart.clear();
                        }
                        if (options.series.length) {
                            chart.setOption(options);
                            chart.resize();
                        } else {
/*                            chart.showLoading({
                                text: scope.config.errorMsg || '\u6CA1\u6709\u6570\u636E',
                                textStyle: textStyle
                            });*/
                        }
                    } else {
/*                        chart.showLoading({
                            text: scope.config.emptyMsg || '\u6570\u636E\u52A0\u8F7D\u5931\u8D25',
                            textStyle: textStyle
                        });*/
                    }
                }).error(function (response) {
                    isAjaxInProgress = false;
/*                    chart.showLoading({
                        text: scope.config.emptyMsg || '\u6570\u636E\u52A0\u8F7D\u5931\u8D25',
                        textStyle: textStyle
                    });*/
                });    // if data is avaliable, render immediately
            } else {
                options = getOptions(scope.data, scope.config, type);
                //if (scope.config.forceClear) {
                    chart.clear();
                //}
                if (options.series.length) {
                    chart.setOption(options);
                    chart.resize();
                } else {
/*                    chart.showLoading({
                        text: scope.config.errorMsg || '\u6CA1\u6709\u6570\u636E',
                        textStyle: textStyle
                    });*/
                }
            }
            // brush
            if (scope.config.brush) {
                var areas = [];
                _(scope.config.brush).forEach( function (item) {
                    var range = [item.start, item.end];
                    areas.push({xAxisIndex: 0,
                        coordRange: range,
                    });
                });
                chart.dispatchAction({
                    type: 'brush',
                    itemStyle:{
                        normal:{color:"#ffffff"}
                    },
                    areas: areas
                });
            }
            // zoomX init range for bar type
            // var maxItems = 50;
            // if (scope.config.zoomX && scope.data[0] != null && scope.data[0].type=='bar' && scope.data[0].datapoints.length >= maxItems) {
            //     chart.dispatchAction({
            //         type: 'dataZoom',
            //         startValue: 0,
            //         endValue: maxItems - 1
            //     });
            // }

        }
        // update when charts config changes
        scope.$watch(function () {
            return scope.config;
        }, function (value, oldValue) {
            if (value) {
                if(scope.config.changing !== true) {
                    //setOptions();
                    $timeout(function() {
                        setOptions();
                    }, 500);
                }
            }
        }, true);

        scope.$watch(function () {
            return scope.data;
        }, function (value, oldValue) {
            if (value) {
            //console.log('reset data', scope.config.changing, scope.config);
                if(scope.config.changing !== true) {
                    if (scope.config.maxSize) {
                        setOptions();
                    } else {
                        $timeout(function() {
                            setOptions();
                        }, 500);
                    }
                    //setOptions();
                }
            }
        }, true);


        angular.element($window).bind('resize', function(){
            getSizes(scope.config);
            if (chart != null) {chart.resize()};
            //chart.setOption(options);
        });

        scope.$on('ui-view-width-changed', function(d,data) {
            getSizes(scope.config);
            if (chart != null) {chart.resize()};
        });


    };
}
/**
 * add directives
 */
var app = angular.module('angular-echarts', ['angular-echarts.theme', 'angular-echarts.util']);
var types = ['scatter', 'line', 'bar', 'area', 'pie', 'donut', 'gauge', 'map', 'radar', 'mix'];
for (var i = 0, n = types.length; i < n; i++) {
    (function (type) {
        app.directive(type + 'Chart', ['$http', '$timeout', '$window', 'theme', 'util', function ($http, $timeout, $window, theme, util) {
                    return {
                        restrict: 'EA',
                        template: '<div></div>',
                        scope: {
                            config: '=config',
                            data: '=data'
                        },
                        link: getLinkFunction($http, $timeout, $window, theme, util, type)
                    };
                }]);
    }(types[i]));
}
'use strict';
/**
 * util services
 */
angular.module('angular-echarts.util', []).factory('util', function () {
    function isPieChart(type, data) {

        return ['pie', 'donut'].indexOf(type) > -1
            || _.includes(_.map(data, 'type'),'pie')
            || _.includes(_.map(data, 'type'),'donut');
    }
    function isMapChart(type) {
        return ['map'].indexOf(type) > -1;
    }
    function isAxisChart(type, data) {
        if (isPieChart(type, data)) {
            return false;
        } else {
            console.log("echarttype-----1", type);
            console.log("echartdata-----", data);
            return ['scatter', 'line', 'area', 'upper', 'lower', 'bar', 'stack', 'mix'].indexOf(type) > -1;
        }
    }
    /**
     * get x axis ticks from the 1st serie
     */
    function getAxisTicks(data, config, type) {
        var ticks = [];
        if (data[0]) {
            angular.forEach(data[0].datapoints, function (datapoint) {
                ticks.push(datapoint.x);
                //ticks.push('test');
            });
        }
        return {
            type: 'category',
            //boundaryGap: type === 'bar',
            boundaryGap: type === 'bar' || _.includes(_.map(data, 'type'),'bar'),

            //splitNumber: 10,
            data: ticks
        };
    }
    /**
     * get series config
     *
     * @param {Array} data serie data
     * @param {Object} config options
     * @param {String} chart type
     */
    function getSeries(data, config, type, lows) {

        var lowers = lows;
        if (data.length > 1 && lowers == null) {
            lowers = _.find(data, function(o) { return o.type =='lower'; });
        }

        //in case of mixed charts
        if (type === 'mix') {
            var mixSeries = [];
            var itemSeries = [];
            var itemData = [];
            angular.forEach(data, function (item, idx) {
                console.log("echartitem-----1", item);
                itemData = [item];
                itemSeries = getSeries(itemData, config, item.type, lowers)

                // in case of multiple charts in one widget.
                if (config.multipleCharts) {
                    itemSeries[0].xAxisIndex = idx;
                    itemSeries[0].yAxisIndex = idx;
                }

                mixSeries.push(itemSeries[0]);
            });
            //console.log(mixSeries);
            return mixSeries;
        }

        var series = [];
        angular.forEach(data, function (serie, idx) {
            // datapoints for line, area, bar chart
            var datapoints = [];
            angular.forEach(serie.datapoints, function (datapoint) {
                if (serie.type === 'scatter') {
                    datapoints.push([datapoint.x,datapoint.y,datapoint.z]);
                } else if (serie.type === 'upper') {
                    var lower = _.find(lowers.datapoints, function(o) {
                            return o.x == datapoint.x; }
                        );
                    datapoints.push(datapoint.y - lower.y);
                } else {
                    datapoints.push(datapoint.y);
                }
            });
            var conf = {
                    type: type || 'line',
                    legend: {show:true},
                    name: serie.name,
                    data: datapoints,
                    showAllSymbol: config.showAllSymbol || false,
                    yAxisIndex: serie['yAxisIndex'] || 0,
                    symbol: 'emptyCircle',
                    showSymbol: config.showSymbol || false,
                    connectNulls: config.isConnNulls || false,
                    lineStyle: {normal: {
                        width: config.lineWidth || 2,
                        type: serie.lineType || 'solid'
                    }},
                    itemStyle: {normal:{}},
                    pieLableLinePosition: config.pieLableLinePosition || 'inner'
                };

            if (type === 'lower') {
                conf.stack = 'confidence-band';
                conf.symbol = 'none';
                conf.type = 'line';
                conf.lineStyle = {
                    normal: {
                        opacity: 0.5,
                        width:1,
                        //type: 'dashed'
                        //type: 'dotted'
                    }
                };
            }

            if (type === 'upper') {
                conf.stack = 'confidence-band';
                conf.symbol = 'none';
                conf.type = 'line';
                conf.lineStyle = {
                    normal: {
                        opacity: 0.5,
                        width:1,
                        //type: 'dashed'
                        //type: 'dotted'
                    }
                };
                conf.areaStyle = {
                    normal: {
                        color: serie.rangeColor || 'rgba(120, 36, 50, 0.3)'
                    }
                };
            }

            if (type === 'bar') {
                var gap = '';
                switch (data.length) {
                    case 1:
                        gap = '50%';
                        break;
                    case 2:
                    case 3:
                        gap = '30%';
                        break;
                    default:
                        gap = '20%'
                }
                conf.barCategoryGap = gap;
                conf.stack = serie.stack;
                conf.label = {
                    normal: {
                        show: config.labelShow,
                        position: 'top',
                        formatter: '{c}'
                    }
                };


                //handle single bar color
                var defaultColors = [
                    '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
                    '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
                    '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
                    '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
                ];
                var colors = config.color || defaultColors;
                if (config.singleBarColor) {
                    conf.itemStyle.normal.color = function(params) {
                        return colors[params.dataIndex];
                    };
                } else if(config.errorColor){
                        if(typeof config.errorColor == "function")
                            conf.itemStyle.normal.color = config.errorColor;
                        else
                            conf.itemStyle.normal.color = colors[0];
                } else {
                    if (conf.itemStyle.normal.color) {
                        delete conf.itemStyle.normal.color;
                    }
                }

                //console.log("conf", conf);

            }
            // scatter chart special config
            if (type === 'scatter') {
                conf.type = 'scatter';
                //conf.symbol = 'emptyCircle';
                delete conf.symbol;
                conf.symbolSize = function (point) {
                    //return Math.sqrt(point[1]) / 5e2;
                    return point[2] || 5;
                };
                conf.label = {
                    emphasis: {
                        show: true,
                        formatter: function (param) {
                            return param.name;
                        },
                        position: 'top'
                    }
                };
                conf.itemStyle = {
                    normal: {
                        shadowBlur: 5,
                        shadowColor: 'rgba(120, 36, 50, 0.5)',
                        shadowOffsetY: 2,
                    }
                };
            }
            // area chart is actually line chart with special itemStyle
            if (type === 'area') {
                conf.type = 'line';
                conf.smooth = false;
                conf.lineStyle = { normal: { shadowBlur: 0 , shadowColor:'transparent'} };
                conf.itemStyle = { normal: { areaStyle: { type: 'default' } } };
            }
            // gauge chart need many special config
            if (type === 'gauge') {
                conf = angular.extend(conf, {
                    splitNumber: 10,
                    // 分割段数，默认为5
                    axisLine: {
                        // 坐标轴线
                        lineStyle: {
                            // 属性lineStyle控制线条样式
                            color: [[0.2, '#228b22'], [0.8, '#48b'], [1, '#ff4500']],
                            width: 8
                        }
                    },
                    axisTick: {
                        // 坐标轴小标记
                        splitNumber: 10,
                        // 每份split细分多少段
                        length: 12,
                        // 属性length控制线长
                        lineStyle: {
                            // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        // 坐标轴文本标签，详见axis.axisLabel
                        textStyle: {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto'
                        }
                    },
                    splitLine: {
                        // 分隔线
                        show: true,
                        // 默认显示，属性show控制显示与否
                        length: 30,
                        // 属性length控制线长
                        lineStyle: {
                            // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    pointer: { width: 5 },
                    title: {
                        show: true,
                        offsetCenter: [0, '-40%'],
                        // x, y，单位px
                        textStyle: {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder'
                        }
                    },
                    detail: {
                        formatter: '{value}%',
                        textStyle: {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto',
                            fontWeight: 'bolder'
                        }
                    }
                }, config.gauge || {});
            }

            //add markArea
            if (isAxisChart(type, data) && serie.markRange) {
                conf.markArea = {};
                conf.markArea.slient = true;
                conf.markArea.data = [];
                conf.markArea.data.push([]);
                var areaData = conf.markArea.data[0];
                areaData.push({xAxis:serie.markRange.start});
                areaData.push({xAxis:serie.markRange.end});
            }

            // datapoints for pie chart and gauges are different
            if (!isAxisChart(type, data)) {
                conf.data = [];
                angular.forEach(serie.datapoints, function (datapoint) {
                    conf.data.push({
                        value: datapoint.y,
                        name: datapoint.x
                    });
                });
            }
            if (isPieChart(type, data)) {
                // donut charts are actually pie charts
                conf.type = 'pie';
                console.log('echarts-pie--',data)
                // pie chart need special radius, center config
                conf.center = config.center || ['55%', '50%'];
                conf.radius = config.radius || '65%';

                // donut chart require special itemStyle
                if (type === 'donut') {
                    conf.radius = config.radius || ['50%', '70%'];
                    conf = angular.extend(conf, {
                        label: {
                            normal:{
                                show: true,
                                position: "inside",
                                fontSize: 18,
                                formatter: "{d}%"
                            },
                        },
                        itemStyle: {
                            normal: {
                                shadowBlur: 30,
                                //shadowColor: '#222222',
                                //shadowOffsetX: 10,
                                //shadowOffsetY: 10,
                                // label: {
                                //     show: true
                                // }
                            },
                            // emphasis: {
                            //     label: {
                            //         show: tr,
                            //         position: 'center',
                            //         textStyle: {
                            //             fontSize: '20',
                            //             fontWeight: 'bold'
                            //         }
                            //     }
                            // }
                        }
                    }, config.donut || {});
                } else if (type === 'pie') {
                    conf.roseType = serie.roseType || false;
                    if (conf.roseType) {
                        conf.radius = ['15%','75%'];
                    } else {
                        delete conf.radius;
                    }
                    conf = angular.extend(conf, {
                        itemStyle: {
                            normal: {
                                label: {
                                    position: conf.pieLableLinePosition,
/*                                    formatter: function (a, b, c, d) {
                                        return (d - 0).toFixed(0) + '%';
                                    }*/
                                    formatter:  '{b}\n{d}%'
                                },
                                labelLine: {
                                             normal: {show: true} }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        fontWeight: 'bold'
                                              },
                                    formatter: '{b}\n{d}%'
                                }
                            }
                        }

                    }, config.pie || {});
                }
            }
            if (isMapChart(type)) {
                conf.type = 'map';
                conf = angular.extend(conf, {}, config.map || {});
            }
            // if stack set to true
            if (config.stack) {
                conf.stack = 'total';
            }
            if (type === 'radar') {
                conf.data = serie.data;
            }

            series.push(conf);
        });
        if (type != 'mix') {//console.log(series);
        }
        return series;
    }
    /**
     * get legends from data series
     */
    function getLegend(data, config, type) {
        //var legend = { data: [], textStyle:{color: "#999"} };
        var legend = { data: [], type:'scroll', pageButtonPosition:'start'};
        if (isPieChart(type, data)) {
            if (data[0]) {
                angular.forEach(data[0].datapoints, function (datapoint) {
                    legend.data.push(datapoint.x);
                });
            }
            legend.orient = 'verticle';
            legend.x = 'left';
            legend.y = 'center';
        } else {
            angular.forEach(data, function (serie) {
                legend.data.push(serie.name);
            });
            legend.orient = 'horizontal';
            //legend.left = data.length > 2 ? "left" : "center" ;
            legend.left = "left";
            //legend.width = config.chartWidth - 250;
            legend.top = 'top';
            legend.right = 200;
            legend.show = !(data.length == 1 && data[0].type == "bar");
        }
        return angular.extend(legend, config.legend || {});
    }
    /**
     * get tooltip config
     */
    function getTooltip(data, config, type) {
        var tooltip = {};
        var items = config.traces || data;  //TODO: for TSS bigdata platform, data in config.traces
        var itemType;
        if (angular.isArray(items)){
            // jzh
            if(items[0])
            itemType = items[0].type || type;
        } else {
            itemType = type;
        }
        //switch (type) {
        switch (itemType) {
        case 'line':
        case 'area':
        case 'mix':
        case 'upper':
        case 'lower':
        case 'bar':
            tooltip.trigger = 'axis';
            //tooltip.formatter = '{a} <br/>{b}: {c} ({d}%)';
            break;
        case 'pie':
        case 'donut':
        //case 'bar':
        //case 'mix':
        case 'map':
        case 'gauge':
            tooltip.trigger = 'item';
            break;

        }

        if (data.length > 1) {
            tooltip.trigger = 'axis';
        }
        if (type === 'pie') {
            tooltip.formatter = '{a} <br/>{b}: {c} ({d}%)';
        }
        if (type === 'map') {
            tooltip.formatter = '{b}';
        }
        if (config.tooltipJson) {
            tooltip.trigger = 'item';
            tooltip.formatter = function(params) {
                var lineData = _.find(data, {type:'line'});
                var linePoint = _.find(lineData.datapoints, {x: params.name});
                var tipStr = '';
                // angular.forEach(params, function(p){
                //     if (parseFloat(p.value)>0) {
                //         tipStr = tipStr + "<br/>" +  "<font size='4' color='" + p.color + "''>●</font>&nbsp;" + p.seriesName + ":&nbsp;" + p.value;
                //     }
                // });
                //console.log('aaaaaaaa',lineData, linePoint, linePoint.x, params);
                tipStr = linePoint.x + '<br/>' + lineData.name + ':&nbsp;' + linePoint.y + '<br/>' + params.seriesName + ':&nbsp;' + params.value;
                return tipStr;
            }
        }

        tooltip.axisPointer = {
            //type : itemType == 'bar' ? 'shadow' : 'line',
            type : 'line',
            lineStyle : {
                type: 'dashed',
                color: 'red'
            },
        };
        if (config.isConnect) {
            tooltip.position = [-10,0];
            tooltip.trigger = 'axis';
        }

        var upperIndex = _.findIndex(data, function(o) {return o.type=='upper'});
        if (upperIndex > 0) {
            tooltip.formatter = function (params, ticket, callback) {
                var strTip = params[0].name + "<br/>";

                for(var i=0; i<data.length;i++) {
                    if(params[i]) {
                        var value = (upperIndex==i) ? parseFloat(params[i].value) + parseFloat(params[0].value) : params[i].value;
                        strTip += "<font size='4' color='" + params[i].color + "''>●</font>&nbsp;" + params[i].seriesName + ": " + value + "<br/>";
                    }
                }
                return strTip;
            };
        }


        return angular.extend(tooltip, angular.isObject(config.tooltip) ? config.tooltip : {});
    }
    function getTitle(data, config, type) {
        if (angular.isObject(config.title)) {
            return config.title;
        }
        return isPieChart(type, data) ? null : {
            text: config.title,
            subtext: config.subtitle || '',
            x: 50
        };
    }
    function getBrush(data, config, type) {
        if (angular.isObject(config.brush)) {
            var brushObj = {
                brushType: 'lineX',
                xAxisIndex: 'all',
                transformable: false,
                //inBrush: {color:"#ffffff", colorAlpha:0.5},
                outOfBrush: {colorAlpha: 1},
                brushStyle: {
                    borderWidth: 1,
                    //color: 'rgba(230,175,175,0.5)',
                    color: 'rgba(255,185,128,0.3)',
                    //borderColor: 'rgba(120,140,180,0.8)',
                    borderColor: config['borderColor'] || 'rgba(255,185,128,0.8)',
                    width: null
                },
            }
            return brushObj;
        }
    }
    function getGrid(data, config, type) {
        if (config.multipleCharts == true) {
            //alert('multipleCharts');
            var grids = [];
            echarts.util.each(data, function() {
                grids.push(
                    {
                        show: true,
                        borderWidth: 0,
                        //backgroundColor: '#fff',
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                        shadowBlur: 2
                    }
                );
            });

            var rowNumber = Math.ceil(Math.sqrt(data.length));
            var chartsPerRow = rowNumber;
            if (config.chartsPerRow && _.isInteger(config.chartsPerRow)) {
                chartsPerRow = config.chartsPerRow;
                rowNumber = Math.ceil(data.length/chartsPerRow);
            }
            echarts.util.each(grids, function (grid, idx) {

                var top = 10;
                var left = 4;
                var bottom = 6;
                var right = 2;
                var padding = 6;

                var gridWidth = (1 / chartsPerRow * (100 - left - right - (chartsPerRow-1) * left));
                var gridHeight = (1 / rowNumber * (100 - top - bottom - (rowNumber-1) * padding));

                grid.left = (idx % chartsPerRow * (gridWidth + left) + left) + '%';
                grid.top = (Math.floor(idx / chartsPerRow) * (gridHeight + padding) + top) + '%';
                grid.width = gridWidth + '%';
                grid.height = gridHeight + '%';

            });

            return grids;

        }
        if (angular.isObject(config.grid)) {
            return config.grid;
        } else {
            //return {};
            var grid = [{show:false, left:50, top:40, right:40, bottom:  (config.zoomX || config.dataZoom) ? 60 : 40}];
            if (config.isConnect) {
                grid = [{show:true, left:30, top:30, right:40, bottom:40, containLabel: false}];
            }
            return grid;
        }
    }
    function getColor(data, config, type) {
        if (angular.isArray(config.color)) {
            return config.color;
        } else {
            return ['#FF0099','#00FF33', '#9966FF', '#0000CC', '#006600', '#009999',  '#CC6600', '#000033' ];
        }
    }
    function getBgColor(data, config, type) {
        if (config.bgColor) {
            return config.bgColor;
        } else {
            return 'transparent';
            //return "rgba(128, 128, 128, 0.1)";
        }
    }
    function getZoom(data, config, type) {
        //if (config.multipleCharts) return []; // in case of multiple charts in one widget, disable zoom function
        if (config.isConnect) {
            return [{
                type: 'slider',
                // left: '30',
                // right: '20',
                textStyle: {
                    color: 'red'
                },
                start: 0,
                end: 10,
                show: true
            }];
        }

        var maxIdx = config.multipleCharts ? data.length-1: 0
        var idxs = [];
        for (i=0;i<=maxIdx;i++) {idxs.push(i);}
        var zooms = [];
        var grid0 = getGrid(data, config, type)[0];
        if (config.zoomX == true) {
            zooms.push(
                {z:1, type:'slider', show:true, xAxisIndex: idxs, left:(grid0?grid0.left:40), right:40}
            );
        }
        if (config.zoomY == true && data[0] && data[0].stack == null) {
            zooms.push(
                {z:1, type:'slider', show:true, yAxisIndex: idxs, top:(grid0?grid0.top:40), bottom:40}
            );
        }
        return zooms;
    }
    function formatKMBT(y, formatter) {
        if (!formatter) {
            formatter = function (v) {
                return Math.round(v * 100) / 100;
            };
        }
        y = Math.abs(y);
        if (y >= 1000000000000) {
            return formatter(y / 1000000000000) + 'T';
        } else if (y >= 1000000000) {
            return formatter(y / 1000000000) + 'B';
        } else if (y >= 1000000) {
            return formatter(y / 1000000) + 'M';
        } else if (y >= 1000) {
            return formatter(y / 1000) + 'K';
        } else if (y < 1 && y > 0) {
            return formatter(y);
        } else if (y === 0) {
            return '';
        } else {
            return formatter(y);
        }
    }
    return {
        isPieChart: isPieChart,
        isAxisChart: isAxisChart,
        getAxisTicks: getAxisTicks,
        getColor: getColor,
        getBgColor: getBgColor,
        getZoom: getZoom,
        getSeries: getSeries,
        getLegend: getLegend,
        getTooltip: getTooltip,
        getTitle: getTitle,
        getBrush: getBrush,
        getGrid: getGrid,
        formatKMBT: formatKMBT
    };
});
'use strict';
/**
 * theme services
 * posible themes: infographic macarons shine dark blue green red gray default
 */
angular.module('angular-echarts.theme', []).factory('theme', ['infographic', 'macarons', 'shine', 'dark', 'blue', 'green', 'red', function (infographic, macarons, shine, dark, blue, green, red, grey) {
    var themes = {
        infographic: infographic,
        macarons: macarons,
        shine: shine,
        dark: dark,
        blue: blue,
        green: green,
        red: red,
        grey: grey,
    };

    return {
        get: function (name) {
            return themes[name] ? themes[name] : {};
        },
    };

}]);
'use strict';
/**
 * blue theme
 */
angular.module('angular-echarts.theme').factory('blue', function () {
    return {
        // 默认色板
        color: [
                    '#1790cf','#1bb2d8','#99d2dd','#88b0bb',
                    '#1c7099','#038cc4','#75abd0','#afd6dd'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#1790cf'
            }
        },
        // 值域
        dataRange: { color: ['#1178ad','#72bbd0'] },
        // 工具箱
        toolbox: { color: ['#1790cf','#1790cf','#1790cf','#1790cf'] },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#1790cf',
                    type: 'dashed'
                },
                crossStyle: { color: '#1790cf' },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#eee',
            // 数据背景颜色
            fillerColor: 'rgba(144,197,237,0.2)',
            // 填充颜色
            handleColor: '#1790cf'    // 手柄颜色
        },
        grid: { borderWidth: 1 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#1790cf'
                }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#1790cf'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)'] }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: { color: '#1790cf' },
            controlStyle: {
                normal: { color: '#1790cf' },
                emphasis: { color: '#1790cf' }
            }
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#1bb2d8',
                    // 阳线填充颜色
                    color0: '#99d2dd',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#1c7099',
                        // 阳线边框颜色
                        color0: '#88b0bb'    // 阴线边框颜色
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#c12e34' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#99d2dd' },
                    label: { textStyle: { color: '#c12e34' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#1790cf' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#1bb2d8'],[0.8, '#1790cf'],[1, '#1c7099']],
                    width: 8
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 10,
                // 每份split细分多少段
                length: 12,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {
                // 分隔线
                length: 18,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * dark theme
 */
angular.module('angular-echarts.theme').factory('dark', function () {
    return {
        // 全图默认背景
        backgroundColor: '#1b1b1b',
        // 默认色板
        color: [
                    '#FE8463','#9BCA63','#FAD860','#60C0DD','#0084C6',
                    '#D7504B','#C6E579','#26C0C0','#F0805A','#F4E001',
                    '#B5C334'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#fff'    // 主标题文字颜色
            }
        },
        // 图例
        legend: {
            itemGap: 8,
            textStyle: {
                color: '#000000'    // 图例文字颜色
            }
        },
        // 值域
        dataRange: {
            itemWidth: 15,
            color: ['#FFF808','#21BCF9'],
            textStyle: {
                color: '#ccc'    // 值域文字颜色
            }
        },
        toolbox: {
            color: ['#fff', '#fff', '#fff', '#fff'],
            effectiveColor: '#FE8463',
            disableColor: '#666',
            itemGap: 8
        },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(250,250,250,0.8)',
            // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#aaa'
                },
                crossStyle: { color: '#aaa' },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.2)'
                }
            },
            textStyle: { color: '#333' }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#555',
            // 数据背景颜色
            fillerColor: 'rgba(200,200,200,0.2)',
            // 填充颜色
            handleColor: '#eee'    // 手柄颜色
        },
        // 网格
        grid: { borderWidth: 1 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                show: false
            },
            axisTick: {
                // 坐标轴小标记
                show: false
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#ccc'
                }
            },
            splitLine: {
                // 分隔线
                show: false
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                show: false
            },
            axisTick: {
                // 坐标轴小标记
                show: false
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#ccc'
                }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#aaa'],
                    type: 'dashed'
                }
            },
            splitArea: {
                // 分隔区域
                show: false
            }
        },
        polar: {
            name: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#ccc'
                }
            },
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)'] }
            },
            splitLine: { lineStyle: { color: '#ddd' } }
        },
        timeline: {
            label: { textStyle: { color: '#ccc' } },
            lineStyle: { color: '#aaa' },
            controlStyle: {
                normal: { color: '#fff' },
                emphasis: { color: '#FE8463' }
            },
            symbolSize: 3
        },
        // 折线图默认参数
        line: { smooth: false },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#FE8463',
                    // 阳线填充颜色
                    color0: '#9BCA63',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#FE8463',
                        // 阳线边框颜色
                        color0: '#9BCA63'    // 阴线边框颜色
                    }
                }
            }
        },
        // 雷达图默认参数
        radar: {
            symbol: 'emptyCircle',
            // 图形类型
            symbolSize: 3    //symbol: null,         // 拐点图形类型
                 //symbolRotate: null,  // 图形旋转控制
        },
        pie: {
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                },
                emphasis: {
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 1)'
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#ccc' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#FE8463' },
                    label: { textStyle: { color: 'ccc' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#fff' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(228, 228, 228, 0.2)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(228, 228, 228, 0.2)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(228, 228, 228, 0.9)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(228, 228, 228, 0.9)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#9BCA63'],[0.8, '#60C0DD'],[1, '#D7504B']],
                    width: 3,
                    shadowColor: '#fff',
                    //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: {
                // 坐标轴小标记
                length: 15,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor: '#fff',
                    //默认透明
                    shadowBlur: 10
                }
            },
            axisLabel: {
                // 坐标轴小标记
                textStyle: {
                    // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor: '#fff',
                    //默认透明
                    shadowBlur: 10
                }
            },
            splitLine: {
                // 分隔线
                length: 25,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 1,
                    color: '#fff',
                    shadowColor: '#fff',
                    //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {
                // 分隔线
                shadowColor: '#fff',
                //默认透明
                shadowBlur: 5
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 20,
                    fontStyle: 'italic',
                    color: '#fff',
                    shadowColor: '#fff',
                    //默认透明
                    shadowBlur: 10
                }
            },
            detail: {
                shadowColor: '#fff',
                //默认透明
                shadowBlur: 5,
                offsetCenter: [0, '50%'],
                // x, y，单位px
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#fff'
                }
            }
        },
        funnel: {
            itemStyle: {
                normal: {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: 1
                },
                emphasis: {
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * green theme
 */
angular.module('angular-echarts.theme').factory('green', function () {
    return {
        // 默认色板
        color: [
                    '#408829','#68a54a','#a9cba2','#86b379',
                    '#397b29','#8abb6f','#759c6a','#bfd3b7'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#408829'
            }
        },
        // 值域
        dataRange: { color: ['#1f610a','#97b58d'] },
        // 工具箱
        toolbox: { color: ['#408829','#408829','#408829','#408829'] },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: { color: '#408829' },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#eee',
            // 数据背景颜色
            fillerColor: 'rgba(64,136,41,0.2)',
            // 填充颜色
            handleColor: '#408829'    // 手柄颜色
        },
        grid: { borderWidth: 1 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#408829'
                }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)'] }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: { color: '#408829' },
            controlStyle: {
                normal: { color: '#408829' },
                emphasis: { color: '#408829' }
            }
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    // 阳线填充颜色
                    color0: '#a9cba2',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        // 阳线边框颜色
                        color0: '#86b379'    // 阴线边框颜色
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#c12e34' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#99d2dd' },
                    label: { textStyle: { color: '#c12e34' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#408829' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#86b379'],[0.8, '#68a54a'],[1, '#408829']],
                    width: 8
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 10,
                // 每份split细分多少段
                length: 12,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {
                // 分隔线
                length: 18,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * infographic theme
 */
angular.module('angular-echarts.theme').factory('infographic', function () {
    return {
        // 默认色板
        color: [
                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#27727B'    // 主标题文字颜色
            }
        },
        // 图例
        legend: { itemGap: 8 },
        // 值域
        dataRange: {
            x: 'right',
            y: 'center',
            itemWidth: 5,
            itemHeight: 25,
            color: ['#C1232B','#FCCE10']
        },
        toolbox: {
            color: [
                            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                        ],
            effectiveColor: '#ff4500',
            itemGap: 8
        },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.5)',
            // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#27727B',
                    type: 'dashed'
                },
                crossStyle: { color: '#27727B' },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: 'rgba(181,195,52,0.3)',
            // 数据背景颜色
            fillerColor: 'rgba(181,195,52,0.2)',
            // 填充颜色
            handleColor: '#27727B'
        },
        // 网格
        grid: { borderWidth: 1 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#27727B'
                }
            },
            splitLine: {
                // 分隔线
                show: false
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                show: false
            },
            splitArea: { show: false },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#ccc'],
                    type: 'dashed'
                }
            }
        },
        polar: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)'] }
            },
            splitLine: { lineStyle: { color: '#ddd' } }
        },
        timeline: {
            lineStyle: { color: '#27727B' },
            controlStyle: {
                normal: { color: '#27727B' },
                emphasis: { color: '#27727B' }
            },
            symbol: 'emptyCircle',
            symbolSize: 3
        },
        // 柱形图默认参数
        bar: {
            itemStyle: {
                normal: { borderRadius: 0 },
                emphasis: { borderRadius: 0 }
            }
        },
        // 折线图默认参数
        line: {
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: '#fff',
                    lineStyle: { width: 1 }
                },
                emphasis: { borderWidth: 0 }
            },
            symbol: 'circle',
            // 拐点图形类型
            symbolSize: 3.5    // 拐点图形大小
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#C1232B',
                    // 阳线填充颜色
                    color0: '#B5C334',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#C1232B',
                        // 阳线边框颜色
                        color0: '#B5C334'    // 阴线边框颜色
                    }
                }
            }
        },
        // 散点图默认参数
        scatter: {
            itemdStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: 'rgba(200,200,200,0.5)'
                },
                emphasis: { borderWidth: 1 }
            },
            symbol: 'star4',
            // 图形类型
            symbolSize: 4    // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
        },
        // 雷达图默认参数
        radar: {
            symbol: 'emptyCircle',
            // 图形类型
            symbolSize: 3    //symbol: null,         // 拐点图形类型
                 //symbolRotate: null,  // 图形旋转控制
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#C1232B' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#fe994e' },
                    label: { textStyle: { color: 'rgb(100,0,0)' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#27727B' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            center: ['50%','80%'],
            radius: '100%',
            startAngle: 180,
            endAngle: 0,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#B5C334'],[0.8, '#27727B'],[1, '#C1232B']],
                    width: '40%'
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 2,
                // 每份split细分多少段
                length: 5,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#fff'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#fff',
                    fontWeight: 'bolder'
                }
            },
            splitLine: {
                // 分隔线
                length: '5%',
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: '#fff'
                }
            },
            pointer: {
                width: '40%',
                length: '80%',
                color: '#fff'
            },
            title: {
                offsetCenter: [0, -20],
                // x, y，单位px
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto',
                    fontSize: 20
                }
            },
            detail: {
                offsetCenter: [0, 0],
                // x, y，单位px
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto',
                    fontSize: 40
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * macarons theme
 */

angular.module('angular-echarts.theme').factory('macarons', function () {
    var colorPalette = [
        '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
        '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
        '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
        '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
    ];


    var theme = {
        color: colorPalette,

        title: {
            textStyle: {
                fontWeight: 'normal',
                color: '#008acd'
            }
        },

        visualMap: {
            itemWidth: 15,
            color: ['#5ab1ef','#e0ffff']
        },

        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: colorPalette[0]
                }
            }
        },

        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.5)',
            axisPointer : {
                type : 'line',
                lineStyle : {
                    color: '#008acd'
                },
                crossStyle: {
                    color: '#008acd'
                },
                shadowStyle : {
                    color: 'rgba(200,200,200,0.2)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#efefff',
            fillerColor: 'rgba(182,162,222,0.2)',
            handleColor: '#008acd'
        },

        grid: {
            borderColor: '#eee'
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#008acd'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#008acd'
                }
            },
            splitArea : {
                show : true,
                areaStyle : {
                    color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        timeline : {
            lineStyle : {
                color : '#008acd'
            },
            controlStyle : {
                normal : { color : '#008acd'},
                emphasis : { color : '#008acd'}
            },
            symbol : 'emptyCircle',
            symbolSize : 3
        },

        line: {
            smooth : true,
            symbol: 'emptyCircle',
            symbolSize: 3,
            lineStyle: {
                normal: {
                    //width: 3,
                    shadowColor: 'rgba(0,0,0,0.4)',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                }
            }
        },

        bar: {
            //barCategoryGap: '50%',
            //barWidth: 10
        },

        candlestick: {
            itemStyle: {
                normal: {
                    color: '#d87a80',
                    color0: '#2ec7c9',
                    lineStyle: {
                        color: '#d87a80',
                        color0: '#2ec7c9'
                    }
                }
            }
        },

        scatter: {
            symbol: 'circle',
            symbolSize: 4
        },

        map: {
            label: {
                normal: {
                    textStyle: {
                        color: '#d87a80'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#eee',
                    areaColor: '#ddd'
                },
                emphasis: {
                    areaColor: '#fe994e'
                }
            }
        },

        graph: {
            color: colorPalette
        },

        gauge : {
            axisLine: {
                lineStyle: {
                    color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']],
                    width: 10
                }
            },
            axisTick: {
                splitNumber: 10,
                length :15,
                lineStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length :22,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer : {
                width : 5
            }
        }
    };

    return theme;
});

angular.module('angular-echarts.theme').factory('macarons-old', function () {
    return {
        // 默认色板
        color: [
                    '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
                    '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
                    '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
                    '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#008acd'    // 主标题文字颜色
            }
        },
        // 图例
        legend: { itemGap: 8 },
        // 值域
        dataRange: {
            itemWidth: 15,
            //color:['#1e90ff','#afeeee']
            color: ['#2ec7c9','#b6a2de']
        },
        toolbox: {
            color: ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
            effectiveColor: '#ff4500',
            itemGap: 8
        },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.5)',
            // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#008acd',
                    type: 'dashed',
                    width: 1
                },
                crossStyle: {
                    color: '#008acd',
                    width: 1
                },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.2)'
                }
            }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#efefff',
            // 数据背景颜色
            fillerColor: 'rgba(182,162,222,0.2)',
            // 填充颜色
            handleColor: '#008acd'    // 手柄颜色
        },
        // 网格
        grid: { borderColor: '#eee' },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#008acd',
                    width: 1
                }
            },
            axisLabel: {
                // label
                skipFirst: true,
                margin: 3,
                textStyle: { color: '#999999' }
            },
            axisTick: {
                // 坐标轴线
                show: true,
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#008acd',
                    width: 1
                }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#008acd',
                    width: 1
                }
            },
            axisLabel: {
                // label
                skipFirst: true,
                margin: 3,
                textStyle: { color: '#999999' }
            },
            axisTick: {
                // 坐标轴线
                show: false,
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#008acd',
                    width: 1
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)'] }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        polar: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)'] }
            },
            splitLine: { lineStyle: { color: '#ddd' } }
        },
        timeline: {
            lineStyle: { color: '#008acd' },
            controlStyle: {
                normal: { color: '#008acd' },
                emphasis: { color: '#008acd' }
            },
            symbol: 'emptyCircle',
            symbolSize: 3
        },
        // 柱形图默认参数
        bar: {
            itemStyle: {
                normal: { borderRadius: 5 },
                emphasis: { borderRadius: 5 }
            }
        },
        // 折线图默认参数
        line: {
            smooth: true,
            symbol: 'circle',
            // 拐点图形类型
            symbolSize: 5    // 拐点图形大小
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#d87a80',
                    // 阳线填充颜色
                    color0: '#2ec7c9',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#d87a80',
                        // 阳线边框颜色
                        color0: '#2ec7c9'    // 阴线边框颜色
                    }
                }
            }
        },
        // 散点图默认参数
        scatter: {
            symbol: 'circle',
            // 图形类型
            symbolSize: 4    // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
        },
        // 雷达图默认参数
        radar: {
            symbol: 'emptyCircle',
            // 图形类型
            symbolSize: 3    //symbol: null,         // 拐点图形类型
                 //symbolRotate: null,  // 图形旋转控制
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#d87a80' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#fe994e' },
                    label: { textStyle: { color: 'rgb(100,0,0)' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#1e90ff' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']],
                    width: 10
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 20,
                // 每份split细分多少段
                length: 15,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {
                // 分隔线
                length: 22,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width: 5,
                color: 'auto'
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * red theme
 */
angular.module('angular-echarts.theme').factory('red', function () {
    return {
        // 默认色板
        color: [
                    '#d8361b','#f16b4c','#f7b4a9','#d26666',
                    '#99311c','#c42703','#d07e75'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#d8361b'
            }
        },
        // 值域
        dataRange: { color: ['#bd0707','#ffd2d2'] },
        // 工具箱
        toolbox: { color: ['#d8361b','#d8361b','#d8361b','#d8361b'] },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#d8361b',
                    type: 'dashed'
                },
                crossStyle: { color: '#d8361b' },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#eee',
            // 数据背景颜色
            fillerColor: 'rgba(216,54,27,0.2)',
            // 填充颜色
            handleColor: '#d8361b'    // 手柄颜色
        },
        grid: { borderWidth: 1 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#d8361b'
                }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#d8361b'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)'] }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: { color: '#d8361b' },
            controlStyle: {
                normal: { color: '#d8361b' },
                emphasis: { color: '#d8361b' }
            }
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#f16b4c',
                    // 阳线填充颜色
                    color0: '#f7b4a9',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#d8361b',
                        // 阳线边框颜色
                        color0: '#d26666'    // 阴线边框颜色
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#c12e34' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#99d2dd' },
                    label: { textStyle: { color: '#c12e34' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#d8361b' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#f16b4c'],[0.8, '#d8361b'],[1, '#99311c']],
                    width: 8
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 10,
                // 每份split细分多少段
                length: 12,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {
                // 分隔线
                length: 18,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * shine theme
 */
angular.module('angular-echarts.theme').factory('shine', function () {
    return {
        // 默认色板
        color: [
                    '#c12e34','#e6b600','#0098d9','#2b821d',
                    '#005eaa','#339ca8','#cda819','#32a487'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: { fontWeight: 'normal' }
        },
        // 图例
        legend: { itemGap: 8 },
        // 值域
        dataRange: {
            itemWidth: 15,
            // 值域图形宽度，线性渐变水平布局宽度为该值 * 10
            color: ['#1790cf','#a2d4e6']
        },
        // 工具箱
        toolbox: {
            color: ['#06467c','#00613c','#872d2f','#c47630'],
            itemGap: 8
        },
        // 提示框
        tooltip: { backgroundColor: 'rgba(0,0,0,0.6)' },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#dedede',
            // 数据背景颜色
            fillerColor: 'rgba(154,217,247,0.2)',
            // 填充颜色
            handleColor: '#005eaa'    // 手柄颜色
        },
        grid: { borderWidth: 1 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                show: false
            },
            axisTick: {
                // 坐标轴小标记
                show: false
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                show: false
            },
            axisTick: {
                // 坐标轴小标记
                show: false
            },
            splitArea: {
                // 分隔区域
                show: true,
                // 默认不显示，属性show控制显示与否
                areaStyle: {
                    // 属性areaStyle（详见areaStyle）控制区域样式
                    color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
                }
            }
        },
        timeline: {
            lineStyle: { color: '#005eaa' },
            controlStyle: {
                normal: { color: '#005eaa' },
                emphasis: { color: '#005eaa' }
            }
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#c12e34',
                    // 阳线填充颜色
                    color0: '#2b821d',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#c12e34',
                        // 阳线边框颜色
                        color0: '#2b821d'    // 阴线边框颜色
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#c12e34' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#e6b600' },
                    label: { textStyle: { color: '#c12e34' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#005eaa' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#2b821d'],[0.8, '#005eaa'],[1, '#c12e34']],
                    width: 5
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 10,
                // 每份split细分多少段
                length: 8,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {
                // 分隔线
                length: 12,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                width: 3,
                color: 'auto'
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});})();
