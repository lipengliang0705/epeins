(function () {
    'use strict';

    angular.module('mu-utils').factory('OptionsUtil', OptionsUtil);
    angular.module('mu-directives', ['mu-utils']).directive('muEcharts', Echarts).controller('EchartsCtrl', EchartsCtrl);

    // var directives = angular.module('mu-directives', ['mu-utils']);
    // directives.directive('muEcharts', Echarts);
    // directives.controller('EchartsCtrl', EchartsCtrl);

    OptionsUtil.$inject = ['$filter', 'DataUtil'];
    Echarts.$inject = ['$window', '$interval', 'OptionsUtil', 'DataUtil'];
    EchartsCtrl.$inject = ['$scope', '$element', '$attrs', '$window', '$interval', 'DataUtil'];

    //options util
    function OptionsUtil($filter, DataUtil) {

        //TODO
        var noDataOptions = {

        };

        var _themeSetting = null;

        function getThemeSetting() {
            return _themeSetting;
        }

        function setThemeSetting(setting) {
            _themeSetting = setting;
        }

        // function randomThemeColor() {
        //     var colors = _.shuffle(getThemeSetting().color);

        // }

        function mergeOption(objVal, srcVal){
            if (srcVal == '') {
                return objVal;
            } else {
                return srcVal;
            }
        }

        //simulate xitmes for M2 only
        function simulateTimeSeries(startStr, endStr, interval) {
            //interval unit: minute
            var startTime = moment(startStr);
            var endTime = moment(endStr);
            var itmes = [];
            var stop = false;
            var nextStr = startStr;
            var nextTime = startTime;
            var items = [];
            while(!stop) {
                items.push({'M2-X': nextStr, 'M2-Y': 1});
                nextTime = nextTime.add(interval, "minute");
                nextStr = nextTime.format('YYYY-MM-DD HH:mm:[00]');
                stop = nextTime.isAfter(endTime);
            }
            return items;
        }

        function createOptions(dataItems, config) { 
            //if (config.type == null || config.type == '') return null;
            var options = {};
            if (config.themeColor != null) {options.color = config.themeColor;}

            //if (xField == null) {return options;}

            //TODO only for testing, comment out when go-live.
            // var isExample = _.get(config, 'datasource.type') == null && (data == null || data.length == 0);
            // if (isExample) {
            //     data = DataUtil.getSampleData();
            //     if (config.fieldMap == null)
            //         config.fieldMap = DataUtil.getSampleField();
            // }
            var data = _.get(dataItems, 'items');
            var markData = _.get(dataItems, 'items2');

            var interval = 5; // default 5 minutes
            //simulate xitmes for M2 only start
            if (markData != null && markData.length > 0 && (data == null || data.length == 0)) {
                var startStr = _.get(config, 'datasource2.params.timeStart');
                var endStr =  _.get(config, 'datasource2.params.timeEnd');
                data = simulateTimeSeries(startStr, endStr, interval);
                //yFields = [{field:'M2-Y', name:'M2'}];
                _.set(config, 'fieldMap.y', [{field:'M2-Y', name:' ', color:'transparent', isSimulated: true}]);
                //xField = 'M2-X';
                _.set(config, 'fieldMap.x', 'M2-X');
            }
            //simulate xitmes for M2 only end


            var xField = _.get(config, 'fieldMap.x');

            data = DataUtil.processData(data, config);

            // if (data == null || data.length == 0) {
            //     return noDataOptions;
            // }

            var type = config.type || 'line';

            //var type = config.type;

            function animationDelay(idx){
                return 500 + idx*500;
            }
            //var type = config.type;
            if (config.backgroundColor == '') {
                delete config.backgroundColor;
            } else {
                options.backgroundColor = config.backgroundColor;
            }
            options.blendMode = config.blendMode;
            options.animation = config.animation;
            options.animationEasing = config.animationEasing;
            //options.animationDuration = animationDelay;
            options.title = getTitle(data, config, type);
            options.legend = getLegend(data, config, type);
            options.grid = getGrid(data, config, type);
            options.tooltip = getTooltip(data, config, type);
            //options.series = getSeries(data, config, type, markData);
            options.visualMap = getVisualMap(data, config, type);
            options.dataZoom = getZoom(data, config, type);
            //if (isAxisChart(type)) {
            if (isAxisChartWithSub(config, type) && xField != null) {
                if (config.axisReverse == true) {
                    options.yAxis = getAxisX(data, config, type);
                    options.xAxis = getAxisY(data, config, type);
                }  else {
                    options.xAxis = getAxisX(data, config, type);
                    options.yAxis = getAxisY(data, config, type);
                }

            }
            if (isRadarChartWithSub(config, type)) {
                options.radar = getRadar(data, config, type);
            }
            if (isMapChart(type)) {
                options.geo = getGeo(data, config, type);
            }
            var shapes = _.get(config, 'shapes');
            if (shapes != null && shapes.length > 0) {
                if (options.graphic == null) options.graphic = [];
                options.graphic = _.concat(options.graphic, getShapes(data, config, type));
            }
            var texts = _.get(config, 'texts');
            if (texts != null && texts.length > 0) {
                if (options.graphic == null) options.graphic = [];
                options.graphic = _.concat(options.graphic, getTexts(data, config, type));
            }
            options.series = getSeries(data, config, type, markData);
            //console.log('options end ...',options);
            return options;
        }

        function isRadarChart(type) {
            return ['radar'].indexOf(type) > -1;
        }
        function isPieChart(type) {
            return ['pie', 'donut', 'rose', 'donut-gauge'].indexOf(type) > -1;
        }
        function isGaugeChart(type) {
            return ['gauge'].indexOf(type) > -1;
        }
        function isBarChart(type) {
            return ['bar','bar-stack'].indexOf(type) > -1;
        }
        function isAreaChart(type) {
            return ['stack','area'].indexOf(type) > -1;
        }
        function isMapChart(type) {
            return ['chinaMap', 'geo'].indexOf(type) > -1;
        }
        function isScatterChart(type) {
            return ['chinaMap', 'geo', 'scatter'].indexOf(type) > -1;
        }
        function isAxisChart(type) {
            return ['scatter', 'line', 'area', 'bar', 'stack', 'bar-stack', 'upper', 'lower'].indexOf(type) > -1;
        }
        function isLineChart(type) {
            return ['line', 'area', 'stack', 'upper', 'lower'].indexOf(type) > -1;
        }
        function getRealType(type) {
            if (isPieChart(type)) return 'pie';
            if (isGaugeChart(type)) return 'gauge';
            if (isLineChart(type)) return 'line';
            if (isBarChart(type)) return 'bar';
            if (isMapChart(type)) return 'scatter';
            return type;
        }

        function isAxisChartWithSub (config, type) {
            if (isAxisChart(type)) return true;

            var yFields = _.get(config, 'fieldMap.y');
            var subTypes = _.map(yFields, 'type');
            for (var i in subTypes) {
                if (isAxisChart(subTypes[i])) return true;
            }
            return false;
        }
        function isRadarChartWithSub (config, type) {
            if (isRadarChart(type)) return true;

            var yFields = _.get(config, 'fieldMap.y');
            var subTypes = _.map(yFields, 'type');
            for (var i in subTypes) {
                if (isRadarChart(subTypes[i])) return true;
            }
            return false;
        }

        function getGradientColor(color1, color2, centerX, centerY, weight) {
            //return new echarts.graphic.RadialGradient(0.4, 0.3, 0.8, [{
            if (centerX == null) centerX = 0.4;
            if (centerY == null) centerY = 0.3;
            if (weight == null) weight = 0.8;
            return new echarts.graphic.RadialGradient(centerX, centerY, weight, [{
                offset: 0,
                color: color1
            }, {
                offset: 1,
                color: color2
            }]);
        }

        function getZoom(data, config, type) {
            //if (config.multipleCharts) return []; // in case of multiple charts in one widget, disable zoom function
            if (data == null) return [];
            if (config.isConnect) {
                return [{
                    type: 'slider',
                    // left: '30',
                    // right: '20',
                    textStyle: {
                        color: 'red'
                    },
                    //start: 0,
                    //end: 10,
                    show: true,
                    handleSize: '90%'
                }];
            }
        }

        function getLinearGradientColor(color1, color2, direction) {
            if (direction == null) direction = '0,0,0,1';
            var dirs = direction.split(',');
            //return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            return new echarts.graphic.LinearGradient(dirs[0], dirs[1], dirs[2], dirs[3], [{
                offset: 0,
                color: color1
            }, {
                offset: 1,
                color: color2
            }]);
        }

        function getPlacdHolderStyle() {
            return {
                normal : {
                    color: 'rgba(0,0,0,0)',
                    label: {show:false},
                    labelLine: {show:false}
                },
                emphasis : {
                    color: 'rgba(0,0,0,0)'
                }
            };
        }

        function getSeries(data, config, type, markData) {

            var series = [];
            if (type == 'number') {
                return series;
            }
            // handing for radar type
            if (isRadarChart(type)) {
                var radarSerie = getRadarSeries(data, config);
                if (radarSerie.data != null) series.push(radarSerie);
                var subSeries = getCommSeries(data, config, type, markData);
                _.forEach(subSeries, function(serie) {
                    series.push(serie);
                });
                return series;
            } else {
                return getCommSeries(data, config, type, markData);
            }

        }

        function getRadarSeries(data, config) {

            var xField = _.get(config, 'fieldMap.x');
            if (xField == '') return [];

            var yFields = _.get(config, 'fieldMap.y') || [];
            yFields = _.filter(yFields, function(y){
                return (y.type == 'radar' || y.type == '') && y.field != '';
            })
            if (yFields.length == 0) return [];

            var items = [];
            _.forEach(data, function(d) {
                var item = {};
                var values = [];
                _.forEach(yFields, function(y) {
                    values.push(d[y.field]);
                })
                item.name = d[xField];
                item.value = values;
                item.symbol = _.get(config, 'dataComm.radarSymbol') || 'circle';
                item.symbolSize = _.get(config, 'dataComm.radarSymbolSize') || 10;
                item.itemStyle = {normal:{}};
                item.lineStyle = {normal:{}};
                item.areaStyle = {normal:{}};
                item.itemStyle.normal.opacity = _.get(config, 'dataComm.symbolOpacity') || 1.0;
                item.lineStyle.normal.type = _.get(config, 'dataComm.radarItemLineType') || 'solid';
                item.lineStyle.normal.width = _.get(config, 'dataComm.radarItemLineWidth') || 2;
                //item.lineStyle.normal.opacity = _.get(config, 'dataComm.symbolOpacity') || 1.0;
                item.areaStyle.normal.opacity = _.get(config, 'dataComm.areaOpacity') || 0.1;

                items.push(item);
            });

            var conf = {};
            conf.symbolSize = 0;
            conf.type = 'radar';
            conf.lineStyle = {normal: {width:1, opacity:0.8}}
            conf.data = items;

            return conf;
        }

        function getCommSeries(data, config, type, markData) {

            var isMarked = false;
            var series = [];

            var xItems = [];
            var xField = _.get(config, 'fieldMap.x');
            var yFields = _.get(config, 'fieldMap.y') || [];
            yFields = _.filter(yFields, function(y){
                //return y.field != '';
                return (type != 'radar' && y.field != '') || (type == 'radar' && y.type != 'radar' && y.type != '');
            })

            if (xField == null) {
                return null;
            } else {
                xItems = _.map(data, xField);
            }

            angular.forEach(yFields, function (y, idx) {

                //y.vmIdxSize = [];
                //y.vmIdxGradual = [];
                _.set(y,'vmIdxSize',[]);
                _.set(y,'vmIdxGradual',[]);

                var conf = {};
                var dType = (y.type != null && y.type != '') ? y.type : type;
                conf.type = getRealType(dType);
                conf.name = y.name || y.field;
                conf.yAxisIndex = y.yAxisIndex || 0;


                conf.data = [];
                // TODO need special prcess for scatter type
                var values = _.map(data, y.field);

                var interval = 5; //default 5 minutes

                // 时间序列并且为柱图时候，为不超出左右边界的补数处理
                if (config.isTimeSerie && dType == 'bar') {
                    var first = moment(xItems[0]).subtract(interval, "minute").format('YYYY-MM-DD HH:mm:[00]');
                    conf.data.push([first, null]);
                }

                angular.forEach(xItems, function(x, idx){
                    if (isGaugeChart(type)) {
                        //conf.data.push({name: conf.name, value: _.toNumber(values[idx])});
                        conf.data.push([conf.name, _.toNumber(values[idx])]);
                    } else if (type == 'donut-gauge') {
                        // 补上底色数字
                        // conf.data.push({name: 'NONE-ITEM', value: 1-values[idx]});
                        // conf.data.push({name: conf.name, value: _.toNumber(values[idx])});
                        conf.data.push(['NONE-ITEM', 1-values[idx]]);
                        conf.data.push([conf.name, _.toNumber(values[idx])]);
                    } else {
                        //conf.data.push({name: x, value: _.toNumber(values[idx])});
                        conf.data.push([x,_.toNumber(values[idx])]);
                    }
                });

                // 时间序列并且为柱图时候，为不超出左右边界的补数处理
                if (config.isTimeSerie && dType == 'bar') {
                    var last = moment(xItems[xItems.length-1]).add(interval, "minute").format('YYYY-MM-DD HH:mm:[00]');
                    conf.data.push([last, null]);
                }

                if (dType === 'rose') {
                    //conf.data = _.sortBy(conf.data, ['value']);
                    conf.data = _.sortBy(conf.data, function(item){
                        return item[1];
                    });
                }

                //set special color
                //if (y.color != null) {
                _.set(conf, 'itemStyle.normal.color', y.color);


                //set common properties
                _.set(conf, 'itemStyle.normal.opacity', y.symbolOpacity || _.get(config, 'dataComm.symbolOpacity') || 1.0);
                _.set(conf, 'itemStyle.normal.shadowBlur', y.shadowBlur || _.get(config, 'dataComm.shadowBlur') || 100);
                _.set(conf, 'itemStyle.normal.shadowColor', y.shadowColor || _.get(config, 'dataComm.shadowColor') || 'rgba(0, 0, 0, 0.5)');

                _.set(conf, 'itemStyle.normal.borderColor', y.borderColor  || null);
                _.set(conf, 'itemStyle.normal.borderWidth', y.borderWidth || 0);


                //双色渐变设置
                if (y.symbolColorGradualMethod == 'linear' && y.symbolColorGradualA != null && y.symbolColorGradualB != null){
                    var color = getLinearGradientColor(y.symbolColorGradualA, y.symbolColorGradualB, y.symbolColorGradualDirection);
                    _.set(conf, 'itemStyle.normal.color', color);
                    y.symbolColorGradual = false;
                }

                if (y.symbolColorGradualMethod == 'gradual' && y.symbolColorGradualA != null && y.symbolColorGradualB != null){
                    var color = getGradientColor(y.symbolColorGradualA, y.symbolColorGradualB, y.symbolColorGradualX, y.symbolColorGradualY, y.symbolColorGradualWeight);
                    _.set(conf, 'itemStyle.normal.color', color);
                    y.symbolColorGradual = false;
                }

                if (isLineChart(dType)) {
                    conf.symbol = y.symbol || _.get(config, 'dataComm.symbol');
                    conf.symbolSize = y.symbolSize || _.get(config, 'dataComm.symbolSize') || 10;
                    conf.smooth = y.smooth || _.get(config, 'dataComm.smooth');
                    _.set(conf, 'lineStyle.normal.width', y.lineWidth || _.get(config, 'dataComm.lineWidth') || 2);
                    _.set(conf, 'lineStyle.normal.type', y.lineType || _.get(config, 'dataComm.lineType') || 'solid');
                    _.set(conf, 'lineStyle.normal.opacity', y.lineOpacity || _.get(config, 'dataComm.lineOpacity') || 1.0);
                    _.set(conf, 'lineStyle.normal.shadowBlur', y.lineShadowBlur);
                    _.set(conf, 'lineStyle.normal.shadowColor', y.lineShadowColor);
                    _.set(conf, 'lineStyle.normal.shadowOffsetX', y.lineShadowOffsetX);
                    _.set(conf, 'lineStyle.normal.shadowOffsetY', y.lineShadowOffsetY);

                }
                if (type === 'stack') {
                    if(! _.get(config,'layout.isMultiple')) {conf.stack = 'stack-all';}
                }
                if (type === 'bar-stack') {
                    if(! _.get(config,'layout.isMultiple')) {conf.stack = 'bar-stack-all';}
                }
                if (isAreaChart(dType)) {
                    _.set(conf, 'areaStyle.normal.opacity', y.areaOpacity || _.get(config, 'dataComm.areaOpacity') || 0.5);

                    //面积双色渐变设置
                    if (y.areaColorGradualMethod == 'linear' && y.areaColorGradualA != null && y.areaColorGradualB != null){
                        var color = getLinearGradientColor(y.areaColorGradualA, y.areaColorGradualB, y.areaColorGradualDirection);
                        _.set(conf, 'areaStyle.normal.color', color);
                        //y.symbolColorGradual = false;
                    }

                    if (y.areaColorGradualMethod == 'gradual' && y.areaColorGradualA != null && y.areaColorGradualB != null){
                        var color = getGradientColor(y.areaColorGradualA, y.areaColorGradualB, y.areaColorGradualX, y.areaColorGradualY, y.areaColorGradualWeight);
                        _.set(conf, 'areaStyle.normal.color', color);
                        //y.symbolColorGradual = false;
                    }

                }
                if (isBarChart(dType)) {
                    var radius = y.barBorderRadius || _.get(config, 'dataComm.barBorderRadius') || 0;
                    _.set(conf, 'itemStyle.normal.barBorderRadius', [radius,radius,0,0]);
                    _.set(conf, 'barGap', y.barGap || _.get(config, 'dataComm.barGap') || '30%');
                    _.set(conf, 'barCategoryGap', y.barCategoryGap || _.get(config, 'dataComm.barCategoryGap') || '20%');

                }


                //markArea start
                if (isLineChart(dType) || isBarChart(dType)) {
                    var markFields = _.map(_.get(config, 'fieldMap2.y') || [],'field');
                    // area
                    if (!isMarked && markFields.length == 2) {

                        // function getIndex(xVal){
                        //     return _.findIndex(xItems, function(x) {
                        //         return x == xVal;
                        //     })
                        // }
                        var marks = [];
                        angular.forEach(markData, function(m){
                            var mark = [];
                            // mark.push({'coord': getIndex(m[markFields[0]])});
                            // mark.push({'coord': getIndex(m[markFields[1]])});
                            mark.push({'coord': [m[markFields[0]]]});
                            mark.push({'coord': [m[markFields[1]]]});
                            marks.push(mark);
                        });

                        _.set(conf, 'markArea.data', marks);
                        _.set(conf, 'markArea.itemStyle.normal.color', _.get(config, 'warning.color') || 'red');
                        _.set(conf, 'markArea.itemStyle.normal.opacity', _.get(config, 'warning.opacity') || 0.2);

                        isMarked = true;
                    }
                    // point
                    if (!isMarked && markFields.length == 1) {

                        var marks = [];
                        var group = _.countBy(markData, function(m){
                            var x = m[markFields[0]];
                            return _.sortedIndex(xItems,x);
                        });
                        angular.forEach(group, function(v,k){
                            var step = (1/v).toFixed(2);
                            for(var i=0; i<v; i++){
                                //marks.push({'coord': [parseInt(k), step*i]});
                                marks.push({'coord': [xItems[parseInt(k)], step*i]});
                            }
                        });
                        // angular.forEach(markData, function(m){
                        //     var x = m[markFields[0]];
                        //     var idx = _.sortedIndex(xItems,x)
                        //     var mark = {'coord': [idx, 0]};
                        //     marks.push(mark);
                        // });

                        _.set(conf, 'markPoint.data', marks);
                        //_.set(conf, 'markPoint.symbol', 'arrow');
                        _.set(conf, 'markPoint.symbolSize', 40);
                        _.set(conf, 'markPoint.itemStyle.normal.opacity', _.get(config, 'warning.opacity') || 0.5);
                        _.set(conf, 'markPoint.itemStyle.normal.color', _.get(config, 'warning.color') || 'red');
                        _.set(conf, 'markPoint.label.normal.formatter', 'M2');

                        isMarked = true;
                    }

                }
                //markArea end

                //
                if ((isPieChart(dType) || isGaugeChart(dType)) && config.fieldMap.y.length > 0) {
                    var chartsPerRow = Math.ceil(Math.sqrt(config.fieldMap.y.length));
                    var perRowConfig = _.get(config, 'layout.chartsPerRow')
                    if (_.isInteger(perRowConfig)) {
                        chartsPerRow = perRowConfig;
                    }
                    var rowNumber = Math.ceil(config.fieldMap.y.length/chartsPerRow);
                    var cx = Math.floor(100 / chartsPerRow * (idx % chartsPerRow + 0.5));
                    var cy = Math.floor(100 / rowNumber * (Math.floor(idx/chartsPerRow) + 0.5));

                    conf.center = [cx+'%',cy+'%'];

                    if (dType === 'pie') {
                        conf.radius = ['0%', 70/chartsPerRow + '%'];
                    }
                    if (dType === 'donut' || dType === 'donut-gauge') {
                        conf.radius = [ 40/chartsPerRow + '%', 70/chartsPerRow + '%'];
                    }
                    if (dType === 'rose') {
                        conf.radius = [ 20/chartsPerRow + '%', 70/chartsPerRow + '%'];
                        conf.roseType = y.roseType || 'radius';
                    }
                    if (dType === 'gauge') {
                        conf.radius = 85/chartsPerRow + '%';
                    }
                }
                if (isPieChart(dType)) {
                    conf.label = {normal:{show:true, formatter:'{a}\n{d}%'}};
                    _.set(conf, 'label.normal.position', y.pieLabelPosition || _.get(config, 'dataComm.pieLabelPosition') || 'outside');
                    _.set(conf, 'clockwise', y.pieClockwise || _.get(config, 'dataComm.pieClockwise')==false ? false : true);
                    _.set(conf, 'label.normal.textStyle.color', y.pieLabelColor || _.get(config, 'dataComm.pieLabelColor') || '#666');
                    _.set(conf, 'label.normal.textStyle.fontSize', y.pieLabelFontSize || _.get(config, 'dataComm.pieLabelFontSize') || '16');
                    _.set(conf, 'label.normal.lineStyle.opacity', 0.5);

                    var centerX = y.pieCenterX, centerY = y.pieCenterY;
                    var radiusIn = y.pieRadiusIn, radiusOut = y.pieRadiusOut;

                    if (dType == 'pie') radiusIn = 0;
                    if (centerX != null) conf.center[0] = centerX+'%';
                    if (centerY != null) conf.center[1] = centerY+'%';
                    if (radiusIn != null) conf.radius[0] = radiusIn+'%';
                    if (radiusOut != null) conf.radius[1] = radiusOut+'%';

                }

                if (dType=='donut-gauge') {
                    _.set(conf, 'label.normal.position', 'center');
                    //_.set(conf, 'label.normal.padding', [20,0,0,0]);
                    conf.label.normal.formatter = function(param) {
                        if (param.name == 'NONE-ITEM') {
                            //return conf.data[1].name;
                            return conf.data[1][0];
                        } else {
                            return param.percent + '%';
                        }
                    }
                    _.set(conf, 'itemStyle.normal.color', itemColor);
                    function itemColor(param) {
                        if (param.name == 'NONE-ITEM') {
                            return _.get(config, 'dataComm.donutNullColor') || '#eee';
                        } else {
                            return y.color || '#2ec7c9';
                        }
                    }
                }


                if (isGaugeChart(dType)) {

                    var gaugeAxisTickLength = y.gaugeAxisTickLength || 5;

                    var gaugeStyle = {

                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[y.gaugeLRatio || 0.2, y.gaugeLColor || 'lime'],
                                        [y.gaugeMRatio || 0.8, y.gaugeMColor || '#1e90ff'],
                                        [y.gaugeHRatio || 1.0, y.gaugeHColor || '#ff4500']],
                                width: gaugeAxisTickLength,
                                shadowColor : 'rgba(0, 0, 0, 0.5)', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisLabel: {            // 坐标轴小标记
                            textStyle: {       // 属性lineStyle控制线条样式
                                fontWeight: 'bolder',
                                color: y.gaugeAxisLabelColor || '#fff',
                                shadowColor : 'rgba(0, 0, 0, 0.5)', //默认透明
                                shadowBlur: 10
                            },
                            formatter: function (value) {
                                return Math.round(value);
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length : gaugeAxisTickLength + 8,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor : 'rgba(0, 0, 0, 0.5)', //默认透明
                                shadowBlur: 10
                            }
                        },
                        splitLine: {           // 分隔线
                            length : gaugeAxisTickLength + 12,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width:3,
                                color: '#fff',
                                shadowColor : 'rgba(0, 0, 0, 0.5)', //默认透明
                                shadowBlur: 10
                            }
                        },
                        pointer: {           // 分隔线
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 5,
                            width: y.gaugePointerWidth || 8
                        },
                        title : {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: y.gaugeTitleSize || 20,
                                fontFamily: y.gaugeTitleFont,
                                //fontStyle: 'italic',
                                color: y.gaugeTitleColor || '#fff',
                                shadowColor : 'rgba(0, 0, 0, 0.5)', //默认透明
                                shadowBlur: 10
                            },
                            offsetCenter: [0, '-50%'],
                        },
                        detail : {
                            //backgroundColor: 'rgba(30,144,255,0.8)',
                            borderWidth: 0,
                            //borderColor: '#fff',
                            shadowColor : 'rgba(0, 0, 0, 0.5)', //默认透明
                            shadowBlur: 5,
                            offsetCenter: [0, '40%'],       // x, y，单位px
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontFamily: y.gaugeDetailFont,
                                fontSize: y.gaugeDetailSize || 40,
                                color: y.gaugeDetailColor || '#fff',
                            }
                        }
                    };

                    _.mergeWith(conf, gaugeStyle, mergeOption);

                    conf.itemStyle.normal.color = 'auto';

                    var centerX = y.gaugeCenterX, centerY = y.gaugeCenterY; radius = y.gaugeRadius;
                    var pointerLength = y.gaugePointerLength;

                    if (centerX != null) conf.center[0] = centerX+'%';
                    if (centerY != null) conf.center[1] = centerY+'%';
                    if (radius != null) conf.radius = radius+'%';
                    if (pointerLength != null) conf.pointer.length = pointerLength+'%';
                    conf.min = y.gaugeMin || 0;
                    conf.max = y.gaugeMax || 100;
                    conf.splitNumber = y.gaugeSplitNumber || 10;
                    conf.startAngle = y.gaugeStartAngle || 225;
                    conf.endAngle = y.gaugeEndAngle || -45;



                }

                if (_.get(config,'layout.isMultiple')) {
                    conf.xAxisIndex = idx;
                    conf.yAxisIndex = 2*idx;
                }

                if (isMapChart(dType)) {
                    var topCount = y.topCount || _.get(config, 'dataComm.topCount') || 5;
                    var allData = conf.data;
                    var topData = allData.sort(function (a, b) {
                                    //return b.value - a.value;
                                    return b[1] - a[1];
                                }).slice(0, topCount);

                    conf.data = DataUtil.convertGeoData(allData);
                    conf.coordinateSystem = 'geo';

                    if (topCount > 0) {
                         // TOP itmes
                        var topSerie = getGeoTopSerie(topData, config, y);
                        series.push(topSerie);
                        y.vmIdxSize.push(series.length - 1);
                        var gradual = y.symbolColorGradual != null ? y.symbolColorGradual : _.get(config, 'dataComm.symbolColorGradual') || false;
                        if (gradual == true) {
                            y.vmIdxGradual.push(series.length - 1);
                        }
                    }

                }


                series.push(conf);
                if (isScatterChart(dType)) {
                    y.vmIdxSize.push(series.length - 1);
                }
                var gradual = y.symbolColorGradual != null ? y.symbolColorGradual : _.get(config, 'dataComm.symbolColorGradual') || false;
                if (gradual == true) {
                    y.vmIdxGradual.push(series.length - 1);
                }

            });
            return series;
        }

        function getGeoTopSerie(topData, config, y) {

            var topSerie = {
                name: 'Top ' + topData.length,
                type: 'effectScatter',
                coordinateSystem:'geo',
                data: DataUtil.convertGeoData(topData),
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true,
                        textStyle: {color: _.get(config, 'dataComm.mapLabelColor')}
                    }
                },
                // itemStyle: {
                //     normal: {
                //         //color: y.effectColor || '',
                //         color:''
                //     }
                // },
                zlevel: 1
            };

            //set common properties
            _.set(topSerie, 'itemStyle.normal.opacity', y.symbolOpacity || _.get(config, 'dataComm.symbolOpacity') || 1.0);
            _.set(topSerie, 'itemStyle.normal.shadowBlur', y.shadowBlur || _.get(config, 'dataComm.shadowBlur') || 100);
            _.set(topSerie, 'itemStyle.normal.shadowColor', y.shadowColor || _.get(config, 'dataComm.shadowColor') || 'rgba(0, 0, 0, 0.5)');

            _.set(topSerie, 'itemStyle.normal.borderColor', y.borderColor  || null);
            _.set(topSerie, 'itemStyle.normal.borderWidth', y.borderWidth || 0);


            //双色渐变设置
            if (y.symbolColorGradualMethod == 'linear' && y.symbolColorGradualA != null && y.symbolColorGradualB != null){
                var color = getLinearGradientColor(y.symbolColorGradualA, y.symbolColorGradualB, y.symbolColorGradualDirection);
                _.set(topSerie, 'itemStyle.normal.color', color);
                y.symbolColorGradual = false;
            }

            if (y.symbolColorGradualMethod == 'gradual' && y.symbolColorGradualA != null && y.symbolColorGradualB != null){
                var color = getGradientColor(y.symbolColorGradualA, y.symbolColorGradualB, y.symbolColorGradualX, y.symbolColorGradualY, y.symbolColorGradualWeight);
                _.set(topSerie, 'itemStyle.normal.color', color);
                y.symbolColorGradual = false;
            }

            if (y.effectColor != null) {
                _.set(topSerie, 'itemStyle.normal.color', y.effectColor);
            }

            return topSerie;
        }

        function getVisualMap(data, config, type) {
            var yFields = _.get(config, 'fieldMap.y') || [];
            yFields = _.filter(yFields, function(y){
                return y.field != '';
            });
            var visualMap = [];
            _.forEach(yFields, function(y, idx) {
                if (y.vmIdxGradual != null && y.vmIdxGradual.length > 0 ) {
                    var values = _.map(data, y.field);
                    var vm = {
                        show: false,
                        min: _.min(values) || 1,
                        max: _.max(values) || 100,
                        seriesIndex: y.vmIdxGradual,
                        inRange: {
                            colorLightness: [0.25, 0.5]
                        }
                    };
                    visualMap.push(vm);
                }
                if (y.vmIdxSize != null && y.vmIdxSize.length > 0 ) {
                    var values = _.map(data, y.field);
                    var sizeA = y.symbolSizeA != null ? y.symbolSizeA : _.get(config, 'dataComm.symbolSizeA') || 1;
                    var sizeB = y.symbolSizeB != null ? y.symbolSizeB : _.get(config, 'dataComm.symbolSizeB') || 20;
                    var vm = {
                        show: false,
                        min: _.min(values) || 1,
                        max: _.max(values) || 100,
                        seriesIndex: y.vmIdxSize,
                        inRange: {
                            symbolSize: [sizeA, sizeB]
                        }
                    };
                    visualMap.push(vm);
                }

            });
            return visualMap;
        }

        function getTitle(data, config, type) {
            var titles = [];
            var title = {
                left: 60,
            };

            titles.push(_.merge(title, config.title));
            return titles;
        }

        function getTexts(data, config, type) {
            var texts = [];
            _.forEach(config.texts, function(item){
                var group = {type: 'group', children: [], width: 0, height: 0};
                //'italic bolder 50px sans-serif'
                item.style.font = item.style.fontStyle + ' ' + item.style.fontWeight + ' ' + item.style.fontSize + 'px ' + item.style.fontFamily;
                var rect = _.merge({type: 'rect'}, item);
                var text = _.merge({type: 'text'}, item);

                rect.style.text = '';
                rect.style.lineWidth = 0;

                if (item.textColorGradualDirection != null &&
                    item.textColorGradualA != null && item.textColorGradualB != null) {
                    rect.shape = {};
                    if (item.textColorGradualDirection == '0,0,0,1' || item.textColorGradualDirection == '0,1,0,0') {
                    //上下渐变
                        rect.shape.width = 0;
                        rect.shape.height = item.gradientDeep;
                    } else {
                    //左右渐变
                        rect.shape.height = 0;
                        rect.shape.width = item.gradientDeep;
                    }
                    var color = getLinearGradientColor(item.textColorGradualA, item.textColorGradualB, item.textColorGradualDirection);
                    rect.style.fill = color;
                    text.style.fill = color;
                    //group.children.push(rect);
                } else {
                    rect.style.fill = item.textColorGradualA;
                    text.style.fill = item.textColorGradualA;
                }
                if(item.dataField && item.dataField != '') {
                    if (data!=null && data.length> item.dataIndex) {
                        if (angular.isNumber( data[item.dataIndex][item.dataField] ))
                            item.style.text = $filter('number')(data[item.dataIndex][item.dataField]);
                        else
                            item.style.text = data[item.dataIndex][item.dataField];
                    }
                }
                text.silent = true;
                group.children.push(rect);
                group.children.push(text);
                //group.silent = false;
                // group.cursor = 'pointer';
                // group.onclick = function(){
                //     alert('hhh');
                // }
                texts.push(group);
            });

            return texts;
        }


        function getShapes(data, config, type) {
            var shapes = [];
            _.forEach(config.shapes, function(item){
                var shape = _.merge({}, item);
                shapes.push(shape);
            });

            return shapes;
        }

        function getGeo(data, config, type) {

            var geos = [];

            var map = {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                silent: true,
                itemStyle: {
                    normal: {
                        areaColor: '#37376e',
                        borderColor: '#000'
                    },
                    // emphasis: {
                    //     areaColor: '#2a333d'
                    // }
                },
            };

            _.merge(map, config.geo);

            if (_.get(config, 'geo.itemStyle.normal.areaColor') == null) {
                map.itemStyle.normal.areaColor = '#37376e';
            }
            if (_.get(config, 'geo.itemStyle.normal.borderColor') == null) {
                map.itemStyle.normal.borderColor = '#000';
            }

            geos.push(_.cloneDeep(map));
            geos.push(_.cloneDeep(map));

            _.set(geos[1], 'itemStyle.normal.shadowBlur', 0);

            return geos;
        }

        function getRadar(data, config, type) {

            var radar = {
                  center: ['50%', '53%'],
                  radius: '80%',
                  splitNumber: 5,
                  //startAngle: 90,
                  shape: 'polygon',
                  axisLine: {
                      lineStyle: {
                          color: '#999',
                          opacity: 0.5,
                          type: 'solid'
                      }
                  },
                  splitLine: {
                      lineStyle: {
                          color: '#666',
                          type: 'dotted',
                          opacity: 0.5
                      }
                  },
                  splitArea: {
                      areaStyle: {
                          color: 'rgba(127,95,132,.3)',
                          opacity: 0.5,
                          shadowBlur: 300,
                          shadowColor: 'rgba(0,0,0,.5)',
                          shadowOffsetX: 0,
                          shadowOffsetY: 15,
                      }
                  },
                  indicator:[]
            };

            var y = config.dataComm;
            var ratioMax = 1.05;
            var ratioMin = 0.6;
            if (y != null) {
                if (y.radarRadius != null) radar.radius = y.radarRadius + '%';
                if (y.radarCenterX != null) radar.center[0] = y.radarCenterX + '%';
                if (y.radarCenterY != null) radar.center[1] = y.radarCenterY + '%';
                if (y.radarSplitAreaColor != null) radar.splitArea.areaStyle.color = y.radarSplitAreaColor;
                if (y.radarSplitNumber != null) radar.splitNumber = y.radarSplitNumber;
                if (y.radarShape != null) radar.shape = y.radarShape;

                if (y.radarAxisLineColor != null) radar.axisLine.lineStyle.color = y.radarAxisLineColor;
                if (y.radarAxisLineType != null) radar.axisLine.lineStyle.type = y.radarAxisLineType;
                if (y.radarAxisLineWidth != null) radar.axisLine.lineStyle.width = y.radarAxisLineWidth;

                if (y.radarSplitLineColor != null) radar.splitLine.lineStyle.color = y.radarSplitLineColor;
                if (y.radarSplitLineType != null) radar.splitLine.lineStyle.type = y.radarSplitLineType;
                if (y.radarSplitLineWidth != null) radar.splitLine.lineStyle.width = y.radarSplitLineWidth;

                //if (y.shadowBlur != null) radar.splitArea.areaStyle.shadowBlur = y.shadowBlur;
                //if (y.shadowColor != null) radar.splitArea.areaStyle.shadowColor = y.shadowColor;
                if (y.radarRatioMax != null) ratioMax = y.radarRatioMax;
                if (y.radarRatioMin != null) ratioMin = y.radarRatioMin;
            }

            var yFields = _.get(config, 'fieldMap.y') || [];
            yFields = _.filter(yFields, function(y){
                return y.field != '';
            });
            angular.forEach(yFields, function(y, idx){
                if (y.field != '' && (y.type == '' || y.type == 'radar')) {
                    var values = _.map(data, y.field);
                    var min = Math.round(_.min(values) * ratioMin) || 1;
                    var max = Math.round(_.max(values) * ratioMax) || 100;
                    radar.indicator.push({
                        name: y.name || y.field,
                        min: min,
                        max: max
                    })
                }
            });

            return radar;
        }

        function getTooltip(data, config, type) {
            var tooltip = {};

            if (type == 'number') {
                tooltip.trigger = 'none';
                return tooltip;
            }
            if (isLineChart(type)) {
                tooltip.trigger = 'axis'
            } else {
                tooltip.trigger = 'item';
            }
            if (isPieChart(type)) {
                tooltip.formatter = '{a} <br/>{b}: {c} ({d}%)';
            }
            if (type === 'map') {
                tooltip.formatter = '{b}';
            }

            tooltip.axisPointer = {
                //type : type == 'bar' ? 'shadow' : 'line',
                type : 'line',
                lineStyle : {
                    type: 'dashed',
                    color: 'red'
                },
            };

            return tooltip;
        }

        function getGrid(data, config, type) {
            if (_.get(config, 'layout.isMultiple')) {
                var grids = [];
                var yFields = _.get(config, 'fieldMap.y') || [];
                yFields = _.filter(yFields, function(y){
                    return y.field != '';
                });
                echarts.util.each(yFields, function() {
                    grids.push(
                        {
                            show: false,
                            borderWidth: 1,
                            //background: '#fff',
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 2
                        }
                    );
                });

                var chartsPerRow = Math.ceil(Math.sqrt(yFields.length));
                var perRowConfig = _.get(config, 'layout.chartsPerRow')
                if (_.isInteger(perRowConfig)) {
                    chartsPerRow = perRowConfig;
                }
                var rowNumber = Math.ceil(yFields.length/chartsPerRow);
                echarts.util.each(grids, function (grid, idx) {
                    var top = 10;
                    var left = 1;
                    var bottom = 1;
                    var right = 1;
                    var padding = 5;

                    var gridWidth = (1 / chartsPerRow * (100 - left - right - (chartsPerRow-1) * left));
                    var gridHeight = (1 / rowNumber * (100 - top - bottom - (rowNumber-1) * padding));

                    grid.left = (idx % chartsPerRow * (gridWidth + left) + left) + '%';
                    grid.top = (Math.floor(idx / chartsPerRow) * (gridHeight + padding) + top) + '%';
                    grid.width = gridWidth + '%';
                    grid.height = gridHeight + '%';
                    grid.containLabel = false;
                });
                return grids;
            } else {
                var defaultGrid = {show:false, containLabel:false, left:40, top:30, right:30, bottom:40};
                return [_.mergeWith(defaultGrid, config.grid, mergeOption)];
                //return [_.merge(defaultGrid, config.grid, mergeOption)];
            }
        }

        function getAxisX(data, config, type) {
            function getAxisTicks(data, config, type) {
                var xField = _.get(config, 'fieldMap.x');
                var ticks = [];
                if(xField != null && xField.length > 0) {ticks = _.map(data, xField);}
                //var isTime = moment(ticks[0])['_isValid'] && isLineChart(type);
                var isTime = moment(ticks[0])['_isValid'] && isAxisChart(type);
                config.isTimeSerie = isTime;
                var axisX =
                {
                    type: isTime ? 'time' : 'category',   //TODO: in case of value, time
                    splitNumber: 16,
                    //type: 'category',
                    //type: config.axisReverse ? 'value' : 'category',
                    show: _.get(config, 'xAxis.show') == false ? false : true,
                    position: config.axisReverse ?  (_.get(config, 'yAxis.inverse') ? 'right' : 'left')  : (_.get(config, 'yAxis.inverse') ? 'top' : 'bottom'),
                    //position: config.axisReverse ? 'left' : _.get(config, 'yAxis.inverse') == true ? 'top' : 'bottom',
                    axisLabel: {rotate: 0, textStyle:{color: _.get(config, 'Axis.labelColor') || '#369'}},
                    axisLine: {show:true, lineStyle:{color: _.get(config, 'Axis.lineColor') || '#369'}},
                    boundaryGap: isBarChart(type),
                    splitLine: {show: true, lineStyle: {width:1, color:"#ddd", opacity:0.5}},
                    //data: ticks
                };
                if (!isTime){
                    axisX.data = ticks;
                }
                var lineColor = _.get(config, 'Axis.lineColor');
                //if (lineColor != null) _.set(axisX, 'axisLine.lineStyle.color', lineColor);
                _.mergeWith(axisX, config.xAxis, mergeOption);
                return axisX;
            }

            var xAxis = getAxisTicks(data, config, type);
            var grids = getGrid(data, config, type);
            if (grids.length > 0) {
                var xAx = _.cloneDeep(xAxis);
                var xAxs = [];
                angular.forEach(grids, function(g,i){
                    xAxs.push(_.cloneDeep(xAx));
                    xAxs[i].gridIndex = i;
                });
                return xAxs;
            }
        }

        function getAxisY(data, config, type) {
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

            var yAxis = [];
            yAxis[0] = {
                type: 'value',
                //position: 'left',
                position: !config.axisReverse ? 'left' : _.get(config, 'xAxis.inverse') ? 'top' : 'bottom',
                show: _.get(config, 'yAxis.l_show') == false ? false : true,
                axisLabel: {
                    textStyle: {color: _.get(config, 'Axis.labelColor') || '#369'},
                    formatter: function (v) {
                        return formatKMBT(v);
                    }
                },
                axisLine: {show:true, lineStyle:{color: _.get(config, 'Axis.lineColor') || '#369'}},
                //splitLine: {show: true, lineStyle: {width:1, color:"#ddd", opacity:0.5}},
            };
            _.mergeWith(yAxis[0], config.yAxis, mergeOption);

            yAxis[1] = {
                type: 'value',
                //position: 'right',
                position: !config.axisReverse ? 'right' : 'bottom',
                show: _.get(config, 'yAxis.r_show') == true ? true : false,
                //show: false,
                axisLabel: {
                    textStyle: {color: _.get(config, 'Axis.labelColor') || '#369'},
                    formatter: function (v) {
                        return formatKMBT(v);
                        //return '';
                    }
                },
                axisLine: {show:true, lineStyle:{color: _.get(config, 'Axis.lineColor') || '#369'}},
                //splitLine: {show: true, lineStyle: {width:1, color:"#ddd", opacity:0.5}},
            };
            _.mergeWith(yAxis[1], config.yAxis, mergeOption);
            yAxis[1].name = null;
            var lineColor = _.get(config, 'Axis.lineColor');
            if (lineColor != null) {
                _.set(yAxis[0], 'axisLine.lineStyle.color', lineColor);
                _.set(yAxis[1], 'axisLine.lineStyle.color', lineColor);
            }

            var grids = getGrid(data, config, type);
            if (grids.length > 0) {
                var yAx = _.cloneDeep(yAxis);
                var yAxs = [];
                angular.forEach(grids, function(g,i){
                    yAxs.push(_.cloneDeep(yAx[0]));
                    yAxs.push(_.cloneDeep(yAx[1]));
                    yAxs[2*i].gridIndex = i;
                    yAxs[2*i+1].gridIndex = i;
                });
                return yAxs;
            }
        }

        function getLegend(data, config, type) {
            var legend = {data: [], left:'center', top:'auto', right:'auto', bottom:'auto', width:'auto', height:'auto', type:'scroll', pageButtonPosition:'start'};
            //var legend = {data: [],};
            if (isPieChart(type) || isGaugeChart(type)) return legend;

            _.mergeWith(legend, config.legend, mergeOption);
            if (legend.right != 'auto') delete legend.left
            if (legend.bottom != 'auto') delete legend.top;

            if (_.get(legend, 'selectedMode') === 'false') legend.selectedMode = false;
            if (_.get(legend, 'itemHeight') == null) legend.itemHeight = 14;

            if (isRadarChart(type)) {
                var fieldX = _.get(config, 'fieldMap.x');
                legend.data = _.map(data, fieldX);
                legend.icon = 'circle';
            } else {
                var yFields = _.get(config, 'fieldMap.y') || [];
                yFields = _.filter(yFields, function(y){
                    return y.field != '';
                });
                angular.forEach(yFields, function(y){
                    legend.data.push(y.name || y.field);
                });
            }

            return legend;
        }

        // provide service interface
        return {
            createOptions: createOptions,
            isRadarChart: isRadarChart,
            isAxisChart: isAxisChart,
            isLineChart: isLineChart,
            isPieChart: isPieChart,
            isGaugeChart: isGaugeChart,
            isMapChart: isMapChart,
            isBarChart: isBarChart,
            isAreaChart: isAreaChart,
            getThemeSetting: getThemeSetting,
            setThemeSetting: setThemeSetting,
            //randomThemeColor: randomThemeColor,
        }

    }

    // mu-echarts directive
    function Echarts($window, $interval, OptionsUtil, DataUtil) {
        return {
            restrict: 'EA',
            template: '<div></div>',
            scope: {
                //theme: '=',
                //type: '=',
                config: '=',
                options: '=',
                data: '='
            },
            controller: 'EchartsCtrl',
            link: buildLinkFunc($window, $interval, OptionsUtil, DataUtil)
        };
    }

    // mu-echarts controller
    function EchartsCtrl($scope, $element, $attrs, $window) {
/*        $scope.$on('theme-changed', function(d,data) {
            console.log(data);
        });*/

    }

    // mu-echarts link
    function buildLinkFunc($window, $interval, OptionsUtil, DataUtil) {

        var $timer = null;
        var $timer2 = null;

        return function (scope, ele, attrs) {
            var chart;
            var parent = ele[0].parentElement;
            //var container = ele[0];
            var container = parent;
            //var theme = _.get(scope, 'config.theme') || 'macarons';
            var theme = _.get(scope, 'config.theme') || 'dark';

            if (chart != null) {
                chart.dispose();
            }

            function getSizes() {
                // container.style.width = parent.style.width;
                // container.style.height = parent.style.height;
                //container.style.width = attrs.width || 300 + 'px';
                //container.style.height = attrs.height || 200 + 'px';
            }

            chart = echarts.init(container, theme);

            if (scope.config.isConnect) {
                chart.group = 'tss-ui-group';
                echarts.connect('tss-ui-group');
            }

            function updateChart(options, refresh) {
                if (!options) return;
                if (refresh) chart.clear();
                //chart.clear();
                chart.setOption(options);

                if (OptionsUtil.getThemeSetting() == null) {
                    OptionsUtil.setThemeSetting(chart.getOption());
                    var themeOptions = chart.getOption();
                }

            }

            scope.updateChart = updateChart;

            function needClear(value, oldValue){

                var newY = _.get(value,'fieldMap.y'), oldY = _.get(oldValue,'fieldMap.y');

                return value.type != oldValue.type || value.backgroundColor != oldValue.backgroundColor
                    || _.get(value, 'texts.length') != _.get(oldValue, 'texts.length')
                    //|| _.get(value, 'shapes.length') != _.get(oldValue, 'shapes.length')
                    || _.get(value, 'shapes') != _.get(oldValue, 'shapes')
                    || _.get(value,'layout.isMultiple') != _.get(oldValue,'layout.isMultiple')
                    || _.get(value,'dataComm.symbolColorGradual') != _.get(oldValue,'dataComm.symbolColorGradual')
                    || _.get(newY, 'length') != _.get(oldY, 'length')
                    || ! _.isEqual(_.filter(newY,{symbolColorGradual:true}) , _.filter(oldY,{symbolColorGradual:true}))
                    || ! _.isEqual(_.filter(newY,{areaColorGradual:true}) , _.filter(oldY,{areaColorGradual:true}))
                    || ! _.isEqual(_.filter(newY,function(y){return _.get(y,'vmIdxSize.length')>0}) , _.filter(oldY,function(y){return _.get(y,'vmIdxSize.length')>0}))
                    //|| ! _.isEqual(value.fieldMap, oldValue.fieldMap) ;
                    // vmIdxSize
            }

            scope.$watch('options', function (value, oldValue) {
                //if (angular.equals(newVal, oldVal)) return;
                if (scope.config && scope.config.optionOnly) {
                    updateChart(value, true);
                } else {
                    if (scope.config && scope.data) {
                        var options = OptionsUtil.createOptions(scope.data, scope.config);
                        //options.animation = false;
                        updateChart(options, false);
                    }
                }
            });

            scope.$watch(function () {
                return scope.config;
            }, function (value, oldValue) {
                if (scope.config && scope.data) {
                    var options = OptionsUtil.createOptions(scope.data, scope.config);
                    //options.animation = false;
                    var clear = needClear(value, oldValue);
                    if (scope.config.refresh) {
                        clear = true;
                        scope.config.refresh = false;
                    }
                    updateChart(options, clear);
                }
            }, true);


            scope.$watch(function () {
                return scope.config.datasource;
            }, function (value, oldValue) {

                if (value && (value.type=='rest' || value.type=='rest_post' || value.type=='es')) {
                    var interval = parseInt(value.interval);
                    //var $timer = null;
                    if (interval >= 1) {
                        $timer = $interval(fetchData, interval*1000);
                    } else {
                        $interval.cancel($timer);
                        fetchData();
                    }
                }

                function fetchData() { 
                    if (value.type && value.type=='es') {//runEsApi
                        DataUtil.runEsServiceApi(value, function(res){
                        //console.log(res);
                            scope.data.items = res;
                        },function(error){
                          console.log("error");
                        });
                    }
                    if ((value.host == null || value.host == '') && (value.url == null || value.url == '')) return; 
                    if (value.type=='rest') {
                        DataUtil.runRestApi(value, function(res){
                        //console.log(res);
                            scope.data.items = res;
                        },function(error){
                          console.log("error");
                        });
                    } else if (value.type=='rest_post') {//runRestPostApi
                        DataUtil.runRestPostUrlApi(value, function(res){
                        //console.log(res);
                            scope.data.items = res;
                        },function(error){
                          console.log("error");
                        });
                    } 
                }


            }, true);



            scope.$watch(function () {
                return scope.config.datasource2;
            }, function (value, oldValue) {

                if (value && (value.type=='rest' || value.type=='rest_post' || value.type=='es')) {
                    var interval = parseInt(value.interval);
                    //var $timer = null;
                    if (interval >= 1) {
                        $timer2 = $interval(fetchData2, interval*1000);
                    } else {
                        $interval.cancel($timer2);
                        fetchData2();
                    }
                }

                function fetchData2() {
                    if ((value.host == null || value.host == '') && (value.url == null || value.url == '')) return;
                    if (value.type=='rest') {
                        DataUtil.runRestApi(value, function(res){
                        //console.log(res);
                            scope.data.items2 = res;
                        },function(error){
                          console.log("error");
                        });
                    } else if (value.type=='rest_post') {
                        DataUtil.runRestPostApi(value, function(res){
                        //console.log(res);
                            scope.data.items2 = res;
                        },function(error){
                          console.log("error");
                        });
                    } else if (value.type=='es') {
                        DataUtil.runEsApi(value, function(res){
                        //console.log(res);
                            scope.data.items2 = res;
                        },function(error){
                          console.log("error");
                        });
                    }
                }

            }, true);


            scope.$watch(function () {
                return scope.data;
            }, function (value, oldValue) {
                if (scope.config && scope.data) {
                    //var options = OptionsUtil.createOptions(scope.data.items, scope.config);
                    var options = OptionsUtil.createOptions(scope.data, scope.config);
                    updateChart(options, false);
                }
            }, true);

            scope.$on("$destroy", function() {
                $interval.cancel($timer);
            });

            scope.$on('theme-changed', function(d,data) {
                // console.log('1530', chart, d,data);
                if (chart != null) {
                    chart.dispose();
                }
                scope.config.theme = data;
                chart = echarts.init(container, data);
                var options = OptionsUtil.createOptions(scope.data, scope.config);
                updateChart(options, true);

                // if (chart != null) {
                //     chart.dispose();
                // }
                // scope.config.theme = data;
                // chart = echarts.init(container, data);
                // var options = OptionsUtil.createOptions(scope.data, scope.config);
                // updateChart(options, true);
            });

            scope.$on('background-changed', function(d,data) {
                scope.config.backgroundColor = data; 
                // var options = {backgroundColor: data};
                // chart.setOption(options);
                var options = OptionsUtil.createOptions(scope.data, scope.config);
                updateChart(options, true);
            });

            scope.$watch(function () {
                return parent.style.height;
            }, function (value, oldValue) {
                if (value) {
                    getSizes();
                    chart.resize();
                }
            }, true);

            scope.$watch(function () {
                return parent.style.width;
            }, function (value, oldValue) {
                if (value) {
                    getSizes();
                    chart.resize();
                }
            }, true);

        };
    }

})();
