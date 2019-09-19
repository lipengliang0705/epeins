(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.dashboard-builder')
        .controller('WidgetConfigCtrl', WidgetConfigCtrl);

 
    WidgetConfigCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', '$filter', 'OptionsUtil', 'DataUtil', 'WIDGET_PARMS', 'toastr', 'NgTableParams', 'DataStore', 'EventRule', 'Category', 'AlarmRule', 'EsService'];

    function WidgetConfigCtrl ($rootScope, $scope, $uibModalInstance, $filter, OptionsUtil, DataUtil, WIDGET_PARMS, toastr, NgTableParams, DataStore, EventRule, Category, AlarmRule, EsService) {// $modalInstance,

        $scope.backgroundColor = WIDGET_PARMS.backgroundColor;
        $scope.titleBgColor = WIDGET_PARMS.titleBgColor;
        $scope.widget = WIDGET_PARMS.widget;
        $scope.group = WIDGET_PARMS.group;
        $scope.theme = $scope.widget.attrs.config.theme || WIDGET_PARMS.theme;
        $scope.tabIdx = 2;
        
        $scope.booleans = [{value:undefined, name:''},{value:true, name:'是'},{value:false, name:'否'}];
        $scope.fonts = ['sans-serif','Microsoft YaHei','Arial','Consolas','Helvetica','Tahoma','Trebuchet','Verdana',
            'Courier New','Georgia','Palatino','Times New Roman','Impact','Brush Script','cursive'];
        $scope.animationEasings = ['linear','quadraticIn','quadraticOut','quadraticInOut','cubicIn','cubicOut','cubicInOut',];    
        $scope.positions = ['inside','outside','center']
        $scope.shapes = [{value:'rect', name:'矩形'},{value:'ring', name:'环形'},{value:'sector', name:'扇形'},{value:'arc', name:'弧形'},{value:'polygon', name:'自定义'}];
        $scope.symbols = ['none','circle','emptyCircle','rect','roundRect','triangle','diamond','pin','arrow'];
        $scope.lineTypes = ['solid','dashed','dotted'];
        $scope.colorGraudualMethods = [{value:null, name:''},{value:'linear', name:'线性渐变'},{value:'gradual', name:'径向渐变'}];
        //$scope.colorGraudualDriections = [{value:'0,0,0,1', name:'上->下'},{value:'0,0,1,0', name:'左->右'},{value:'0,0,1,1', name:'左上->右下'},{value:'1,0,0,1', name:'右上->左下'}];
        $scope.colorGraudualDriections = [{value:null, name:'无渐变'},{value:'0,0,0,1', name:'上->下'},{value:'0,0,1,0', name:'左->右'},{value:'0,1,0,0', name:'下->上'},{value:'1,0,0,0', name:'右->左'},];
        $scope.yAxisIndexs = [{value:0, name:'左边'},{value:1, name:'右边'}];
        $scope.datasources = [
                // {value: '', name:'-- 无 --'},                
                {value:'es', name:'Elastic Search'},
                {value:'rest', name:'RESTFull(GET)'},
                {value:'rest_post', name:'RESTFull(POST)'},
                {value:'socket', name:'WebSocket数据源'},
                {value:'demo', name:'示例数据(收入支出)'},
                {value:'demo2', name:'示例数据(基金)'},
                {value:'geo', name:'示例数据(地图)'},
                {value:'gauge', name:'示例数据(仪表盘)'},
                {value:'donut-gauge', name:'示例数据(百分比圆盘)'},
                ];
        $scope.widgetCategories = [{value:'mu-echarts', name:'数据图形'},{value:'ng-table-factory', name:'数据表格'},{value:'html-bind', name:'HTML文本'}];  
        //$scope.widgetCategories = [{value:'mu-echarts', name:'数据图形'}];  
        $scope.blendModes = ['source-over', 'destination-over',
                'lighter', 'copy', 'xor', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
                'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 
                'exclusion', 'hue', 'saturation', 'color', 'luminosity']; 
        $scope.chartTypes = ['','line', 'stack', 'area', 'bar', 'bar-stack', 'pie', 'donut', 'rose', 'radar', 'chinaMap', 'donut-gauge', 'gauge']; 
        // 'table','number',
        $scope.subChartTypes = ['','number','line', 'upper', 'lower', 'area', 'pie', 'donut', 'rose'];  

        $scope.postTypes = [ 
                {value:'es', name:'Elastic Search'},
                {value:'self', name:'自定义'} 
                ];            

        $scope.allImages = [
          {url: 'shapes/svg/check.svg'},
          {url: 'shapes/svg/bag.svg'},
          {url: 'shapes/svg/box.svg'},
          {url: 'shapes/svg/calculator.svg'},
          {url: 'shapes/svg/graph-1.svg'},
          {url: 'shapes/svg/graph-2.svg'},
          {url: 'shapes/svg/graph-3.svg'},
          {url: 'shapes/svg/graph-4.svg'},
          {url: 'shapes/svg/graph-5.svg'},
          {url: 'shapes/svg/graph-6.svg'},
          {url: 'shapes/svg/graph-7.svg'},
          {url: 'shapes/svg/graph-8.svg'},
        ];

        $scope.es_indexs = [];
        $scope.es_types = [];
        $scope.es_alarmrules = [];
        // $scope.es_fields = [];
        $scope.es_ranges = [{value: '1', name:'1小时前'},{value: '2', name:'2小时前'},{value: '6', name:'6小时前'},
                            {value: '8', name:'8小时前'},{value: '12', name:'12小时前'},{value: '24', name:'24小时前'}
                             ,{value: '360', name:'半个月前'},{value: '720', name:'一个月前'},{value: '15000', name:'全部'} ];
        $scope.es_intervals = [{value: '5', name:'5分钟'},{value: '10', name:'10分钟'},{value: '15', name:'15分钟'},{value: '30', name:'30分钟'}];
        $scope.es_tops = [{value: '5', name:'5'},{value: '10', name:'10'},{value: '20', name:'20'},{value: '30', name:'30'},{value: '10000', name:'全部'}];
        $scope.es_functions = [{value: 'avg', name:'平均值'},{value: 'max', name:'最大值'},{value: 'min', name:'最小值'},{value: 'count', name:'总和'}];
        $scope.es_views = [ {value: 'EsService.getEventCount', name:'事件计数', type: 'datetime'},
                            {value: 'EsService.getFieldStatistics', name: '字段值统计', type: "number"},
                            {value: 'EsService.getFieldType', name: '字段值分类'}//,
                            // {value: 'EsService.getTotalPercent', name: '累计百分比', type: "number"}, 
                            // {value: 'EsService.getSegmentStatistic', name: '数值分段统计', type: "number"},
                            // {value: 'EsService.getTimeSegmentStatistic', name: '时间分段统计', type: "datetime"}
                          ];

        function getCategory() {
            Category.query({
                page: 0,
                size: 1000,
                sort: 'id'
            }, onSuccess, onError);
            function onSuccess(data, headers) {
              $scope.es_indexs = data;
            };
            function onError(error) {
                toastr.error('error', error.data.message);
            };
        }
        getCategory();   
        
        var palette;
        if (OptionsUtil.getThemeSetting()) {
          var colors = OptionsUtil.getThemeSetting().color;
          palette = _.chunk(colors, 5);
        }

        var defaultPalette = [
            ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
            ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
            ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
            ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
            ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
            ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
            ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
            ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
        ];

        $scope.colorPicker1 = {
                      showInput: true,
                      showAlpha: false,
                      allowEmpty: true,
                      showPalette: false,
                      preferredFormat: 'hex3',
                      chooseText: "确定",
                      cancelText: "取消",
                      palette: palette };

        $scope.colorPicker2 = {
                      showInput: true,
                      showAlpha: false,
                      allowEmpty: true,
                      showPalette: true,
                      preferredFormat: 'hex3',
                      chooseText: "确定",
                      cancelText: "取消",
                      palette: palette };
   
        $scope.colorPicker3 = {
                      showInput: true,
                      showAlpha: false,
                      allowEmpty: true,
                      showPaletteOnly: true,
                      togglePaletteOnly: true,
                      showInitial: true,
                      chooseText: "OK",
                      cancelText: "Cancel",
                      preferredFormat: 'hex3',
                      togglePaletteMoreText: 'more',
                      togglePaletteLessText: 'less',
                      palette: defaultPalette};

        $scope.isAxisChart = OptionsUtil.isAxisChart;
        $scope.isLineChart = OptionsUtil.isLineChart;
        $scope.isBarChart = OptionsUtil.isBarChart;
        $scope.isAreaChart = OptionsUtil.isAreaChart;
        $scope.isPieChart = OptionsUtil.isPieChart;
        $scope.isGaugeChart = OptionsUtil.isGaugeChart;
        $scope.isRadarChart = OptionsUtil.isRadarChart;
        $scope.isMapChart = OptionsUtil.isMapChart;


        function getDataStore() {
            DataStore.query({ 
                page: 0,
                size: 1000,
                sort: 'id'
            }, onSuccess, onError);
            function onSuccess(data, headers) { 
              $scope.dataStores = data; 
            };
            function onError(error) {
                toastr.error('error', error.data.message);
            };
        }
        getDataStore();


        $scope.addText = function() {
          if (_.get($scope.widget, 'attrs.config.texts') == null){
            _.set($scope.widget, 'attrs.config.texts', []);
          }
          var texts = $scope.widget.attrs.config.texts;
          texts.push(
            //item.style.fontStyle + ' ' + item.style.fontWeight + ' ' + item.style.fontSize + 'px ' + item.style.fontFamily;
            //{ style: {font: 'italic bolder 50px sans-serif'},
            { style: {fontStyle: 'italic', fontWeight: 'bold', fontSize: 50, fontFamily: 'sans-serif'},
              left:0, top:0, gradientDeep:100,
              textColorGradualA: '#999'
              //shape: {width: 200, height: 30},
              //draggable: true
          });
        }

        $scope.cloneText = function(item) {
          if (_.get($scope.widget, 'attrs.config.texts') == null){
            _.set($scope.widget, 'attrs.config.texts', []);
          }
          var texts = $scope.widget.attrs.config.texts;
          texts.push(_.cloneDeep(item));
        }

        $scope.delText = function(idx) {
          var texts = $scope.widget.attrs.config.texts;
          texts.splice(idx,1);
        }

        $scope.addShape = function() {
          if (_.get($scope.widget, 'attrs.config.shapes') == null){
            _.set($scope.widget, 'attrs.config.shapes', []);
          }
          var shapes = $scope.widget.attrs.config.shapes;
          shapes.push(
            { 
              type: 'image',
              style: {x: Math.round(Math.random()*100), y: Math.round(Math.random()*100), width:50, height:50,
                  image:'shapes/svg/graph-8.svg'
              },
          });
        }

        $scope.delShape = function(idx) {
          var shapes = $scope.widget.attrs.config.shapes;
          shapes.splice(idx,1);
        }

        $scope.randomColor = function() {
          var colors = OptionsUtil.getThemeSetting().color;
          _.set($scope.widget, 'attrs.config.themeColor', _.shuffle(colors));
        }

        $scope.exeGroup = function(){
          var data = _.get($scope.widget, 'attrs.data.items');
          var config = _.get($scope.widget, 'attrs.config');
          _.set(config, 'fieldMap.rawY', null);
          var newData = DataUtil.exeGroup(data, config);
          _.set($scope.widget, 'attrs.data.items', newData);
          setData(newData);
        }

        $scope.addMap = function(){
          var yItems = _.get($scope.widget, 'attrs.config.fieldMap.y');
          if (yItems != null) {
            yItems.push({field:'', name:'', type:''});
          } else {
            toastr.warning("", "请先取得数据！");
          }
        }

        $scope.addMap2 = function(){
          var yItems = _.get($scope.widget, 'attrs.config.fieldMap2.y');
          if (yItems != null) {
            yItems.push({field:'', name:'', type:''});
          } else {
            toastr.warning("", "请先取得数据！");
          }
        }

        $scope.addFormatter = function(){
          var yItems = _.get($scope.widget, 'attrs.config.fieldMap.formatter');
          if (yItems == null) {
            _.set($scope.widget, 'attrs.config.fieldMap.formatter', []);
            yItems = _.get($scope.widget, 'attrs.config.fieldMap.formatter');
          }
          yItems.push({field:'', name:'', formatter:''});
        }

        $scope.setSpecial = function(field, idx) {
          $scope.specialField = field; 
        }

        $scope.setFormatter = function(field, idx) {
          $scope.curFormatter = field; 
        }

        $scope.delMap = function(idx) {
          var yItems = _.get($scope.widget, 'attrs.config.fieldMap.y');
          yItems.splice(idx,1);
        }

        $scope.delMap2 = function(idx) {
          var yItems = _.get($scope.widget, 'attrs.config.fieldMap2.y');
          yItems.splice(idx,1);
        }

        $scope.delFormatter = function(idx) {
          var yItems = _.get($scope.widget, 'attrs.config.fieldMap.formatter');
          yItems.splice(idx,1);
        }

        $scope.getData = function(){
          var config = $scope.widget.attrs.config;
          var ds = _.get(config, 'datasource.type');
          var data = null;
          if (ds === 'demo') {
            data = DataUtil.getSampleData();
            setData(data);
          } else if (ds === 'demo2') {
            data = DataUtil.getSampleData2();
            setData(data);
          } else if (ds === 'geo') {
            data = DataUtil.getGeoData();
            setData(data);
          } else if (ds === 'gauge') {
            data = DataUtil.getGaugeData();
            setData(data);
          } else if (ds === 'donut-gauge') {
            data = DataUtil.getDonutGaugeData();
            setData(data);
          } else if (ds === 'rest') {
            fetchData();
            function fetchData() {
               DataUtil.runRestApi(config.datasource, function(res){
                //console.log(res);
                data = res;
                setData(data);
              },function(error){
                  console.log("error");
              });             
            }
          } else if (ds === 'rest_post') {
            fetchPostData();
            function fetchPostData() {
              //console.log(config, config.datasource);
              DataUtil.runRestPostUrlApi(config.datasource, function(res){
                //console.log(res);
                data = res;
                setData(data);
              },function(error){
                  console.log("error");
              });    
              // DataUtil.runRestPostApi(config.datasource, function(res){
              //   //console.log(res);
              //   data = res;
              //   setData(data);
              // },function(error){
              //     console.log("error");
              // });             
            }
          } else if (ds === 'es') {
            fetchEsData();
            function fetchEsData() {//runEsApi
              DataUtil.runEsServiceApi(config.datasource, function(res){
                // console.log('es fetchEsData',res);
                data = res;
                setData(data);
              },function(error){
                  console.log("error");
              });   

              // console.log('datasource ', config.datasource);
              // //时间处理      
              // var getDateHour = function(hour){
              //     var now = new Date();
              //     now.setHours(now.getHours() + hour); 
              //     var time = $filter('date')(now, "yyyy-MM-dd HH:mm");
              //     return time+":00";
              // };
              // var startTime = getDateHour(config.datasource.es_range.value); 
              // var endTime = getDateHour(0); 
              // var explorer = window.navigator.userAgent.toLowerCase(); 
              // if (explorer.indexOf("firefox") >= 0 && startTime && endTime) {
              //     startTime = startTime.replace(" ","T");
              //     endTime = endTime.replace(" ","T");
              // } 
              // console.log(new Date(startTime), new Date(endTime) );
              // var query = {
              //     "index": config.datasource.es_index.alias+"*",
              //     "format": "yyyy-MM-dd HH:mm:ss",
              //     "minutesInterval": config.datasource.es_interval.value,
              //     // "startTime": new Date(startTime),               
              //     // "endTime": new Date(endTime),
              //     "startTime": "2011-10-25T17:53:26.000Z",               
              //     "endTime": "2018-10-25T18:08:26.000Z",
              //     "types": [config.datasource.es_type.name], 
              //     "filterFields": {},
              //     "fields": [config.datasource.es_field.name],
              //     "queryString": config.datasource.queryString 
              // }  
              // var url = config.datasource.es_view.value;
              // if(url=='EsService.getEventCount'){
              //   EsService.getEventCount.post(query, onSuccess, onError); 

              // }else if(url=='EsService.getFieldType'){ //字段值分类 
              //   EsService.getFieldType.post(query, onSuccess, onError); 

              // }else if(url=='EsService.getFieldStatistics'){ //字段值统计
              //   query.aggType = config.datasource.es_function.value;
              //   EsService.getFieldStatistics.post(query, onSuccess, onError);  

              // } 
              // function onSuccess(res) {
              //     console.log(res);
              //     if(url=='EsService.getEventCount'){
              //       data = res.aggregations;

              //     }else if(url=='EsService.getFieldType'){ //字段值分类 
              //       data = res.aggregations.data; 

              //     }else if(url=='EsService.getFieldStatistics'){ //字段值统计
              //       query.aggType = config.datasource.es_function.value;
              //       data = res.aggregations[query.aggType];
              //     } 
              //     // data = res.aggregations;  
              //     setData(data);
              // }
              // function onError(err) {
              //     console.log(err);
              // }
                        
            }
          } else if (ds === 'socket') {

          } else {
            setData([]);
            //toastr.pop('error', "", "请选择数据源类别！");
            return;
          }

        }

        $scope.getAlarmData = function(){ //获取告警信息
          var config = $scope.widget.attrs.config;
          var ds = _.get(config, 'datasource.type');
          var data = null;
          if (ds === 'es') {
            fetchEsData();
            function fetchEsData() {
               console.log('告警信息', config.datasource2,config.datasource);
               var ds = angular.copy(config.datasource);
               if(config.datasource2){
                ds['maxCount'] = config.datasource2.maxCount==null?null:config.datasource2.maxCount;
                ds['interval'] = config.datasource2.interval==null?null:config.datasource2.interval;
                ds['es_range'] = config.datasource2.es_range==null?null:config.datasource2.es_range;
               }
               console.log(ds);
               DataUtil.runEsAlarmApi(ds, function(res){
                //console.log(res);
                data = res;
                setData2(data);
              },function(error){
                  console.log("error");
              });          
            }        
          }
        }


        $scope.getData2 = function(){
          var config = $scope.widget.attrs.config;
          var ds = _.get(config, 'datasource2.type');
          var data = null;
          if (ds === 'demo') {
            data = DataUtil.getSampleData();
            setData(data);
          } else if (ds === 'demo2') {
            data = DataUtil.getSampleData2();
            setData(data);
          } else if (ds === 'geo') {
            data = DataUtil.getGeoData();
            setData(data);
          } else if (ds === 'gauge') {
            data = DataUtil.getGaugeData();
            setData(data);
          } else if (ds === 'donut-gauge') {
            data = DataUtil.getDonutGaugeData();
            setData(data);
          } else if (ds === 'rest') {
            fetchData();
            function fetchData() {
               DataUtil.runRestApi(config.datasource2, function(res){
                //console.log(res);
                data = res;
                setData2(data);
              },function(error){
                  console.log("error");
              });             
            }
          } else if (ds === 'rest_post') {
            fetchPostData();
            function fetchPostData() {
               DataUtil.runRestPostApi(config.datasource2, function(res){
                //console.log(res);
                data = res;
                setData2(data);
              },function(error){
                  console.log("error");
              });             
            }
          } else if (ds === 'es') {
            fetchEsData();
            function fetchEsData() {
               DataUtil.runEsApi(config.datasource2, function(res){
                //console.log(res);
                data = res;
                setData2(data);
              },function(error){
                  console.log("error");
              });             
            }
          } else if (ds === 'socket') {

          } else {
            setData2([]);
            //toastr.pop('error', "", "请选择数据源类别！");
            return;
          }

        }

        function setData(data) {
          var config = $scope.widget.attrs.config;
          var maxCount = _.get(config, 'datasource.maxCount');
          if (maxCount != null) data = _.take(data, maxCount);

          if ($scope.widget.attrs.data == null) $scope.widget.attrs.data = {};
          $scope.widget.attrs.data.items = data;
          //$scope.dtdata = data;
          if (data != null && data.length > 0) {
            config.fields = _.keys(data[0]);
            config.fields.push('');

            var columns = [];
            _.forEach(config.fields, function(field) {
              columns.push({field: field, title: field, caption: field});
            });

            $scope.cols = columns;
            $scope.tableParams = new NgTableParams({

            }, {
              dataset: data
            });


            if (_.get(config, 'layout.isMultiple') == null) {_.set(config, 'layout.isMultiple', false);}
            if (config.fieldMap == null) {
              config.fieldMap = {x:'', y:[]};
            }
            toastr.success("", "成功得到数据！");
          } else {
            $scope.cols = [];
            config.fields = [];
            $scope.tableParams = new NgTableParams({
            }, {
              dataset: []
            });
            toastr.warning("", "数据为空！");
          }
        }

        function setData2(data) {

          var config = $scope.widget.attrs.config;
          var maxCount = _.get(config, 'datasource2.maxCount');
          if (maxCount != null) data = _.take(data, maxCount);

          if ($scope.widget.attrs.data == null) $scope.widget.attrs.data = {};
          $scope.widget.attrs.data.items2 = data;
          //$scope.dtdata = data;
          if (data != null && data.length > 0) {
            config.fields2 = _.keys(data[0]);
            config.fields2.push('');

            var columns = [];
            _.forEach(config.fields2, function(field) {
              columns.push({field: field, title: field, caption: field});
            });

            $scope.cols = columns;
            $scope.tableParams = new NgTableParams({

            }, {
              dataset: data
            });


            //if (_.get(config, 'layout.isMultiple') == null) {_.set(config, 'layout.isMultiple', false);}
            if (config.fieldMap2 == null) {
              config.fieldMap2 = {x:'', y:[]};
            }
            toastr.success("", "成功得到数据！");
          } else {
            $scope.cols = [];
            config.fields2 = [];
            $scope.tableParams = new NgTableParams({
            }, {
              dataset: []
            });
            toastr.warning("", "数据为空！");
          }
        }

        if ($scope.widget.category == 'mu-echarts' && $scope.widget.attrs.config.type == null) {
            $scope.widget.attrs.config.type = 'line';
        }

        $scope.chgTheme = function(){
            // console.log("current theme: " + $scope.theme);
            $rootScope.$broadcast('theme-changed', $scope.theme); 
        };

        $scope.chgChartBackground = function(color){ 
            if (color == null) color = 'transparent';
            $rootScope.$broadcast('background-changed', color); 
        };

        $scope.chgTitleBgColor = function(color){
            // console.log("current theme: " + $scope.theme);
            if (color == null) color = 'transparent';
            //vm.titleBgColor= color; 
            //WIDGET_PARMS.titleBgColor = color;
        };

        $scope.chgBackground = function(color){
            // console.log("current theme: " + $scope.theme);
            if (color == null) color = 'transparent';
            //vm.backgroundColor= color;
            //WIDGET_PARMS.backgroundColor = color;
        };

        $scope.ok = function(e) {
          $uibModalInstance.close();
          // $modalInstance.close();

          e.stopPropagation();
        };

        $scope.selCategory = function(widget) {
          //根据需要调整指令的 attrs
          // if (widget.category == 'ng-table-factory'){
          //   widget.attrs.options = {};
          // }
          console.info(widget);
        };
 
        $scope.$watch(function() {
            return $scope.widget.attrs.config.datasource!=null?$scope.widget.attrs.config.datasource.es_index:'';
        },function(newName,oldName){
            if(newName) { 
                EventRule.getTypeList({ category_id: $scope.widget.attrs.config.datasource.es_index.id }, onSuccess, onError);
                function onSuccess(data, headers) {
                    // console.log('getTypeList',data);
                    $scope.es_types = data;  
                    if($scope.widget.attrs.config.datasource.es_type){                        
                        var idx = _.find($scope.es_types, {"name": $scope.widget.attrs.config.datasource.es_type.name});
                        if(!idx) $scope.widget.attrs.config.datasource.es_type = ''; 
                    } 
                };
                function onError(error) {
                    toastr.error('error', error.data.message);
                }; 
            }
        });
 
        $scope.$watch(function() {
            return $scope.widget.attrs.config.datasource!=null?$scope.widget.attrs.config.datasource.es_type:'';
        },function(newName,oldName){
            if(newName) { 
               getFieldList(); 
               getAlarmRuleList();
            }
        });

        $scope.$watch(function() {
            return $scope.widget.attrs.config.datasource!=null?$scope.widget.attrs.config.datasource.es_view:'';
        },function(newName,oldName){
            if(newName) {
                getFieldList();
            }
        });

        function getFieldList(){ 
            var data = $scope.widget.attrs.config.datasource.es_type;
            var data_fields = data.fields!=null?data.fields:[];
            var fields = data_fields;
            if($scope.widget.attrs.config.datasource.es_view && $scope.widget.attrs.config.datasource.es_view.type){
              var type = $scope.widget.attrs.config.datasource.es_view.type;
              fields = (data_fields || []).filter(function (d) {
                  return d['type'] == type;
              });
            }
            $scope.es_fields = fields; 
            if($scope.widget.attrs.config.datasource.es_field){                        
                var idx = _.find($scope.es_fields, {"name": $scope.widget.attrs.config.datasource.es_field.name});
                if(!idx) $scope.widget.attrs.config.datasource.es_field = ''; 
            } 
        }

        function getAlarmRuleList(){
            console.log($scope.widget.attrs.config.datasource.es_type);
            // if(){}
            AlarmRule.getAlarmRulesByEventRuleId({ eventrule_id: $scope.widget.attrs.config.datasource.es_type.id }, onSuccess, onError);
            function onSuccess(data, headers) {
                console.log('getAlarmRuleList',data);
                $scope.es_alarmrules = data;  
                if($scope.widget.attrs.config.datasource.es_alarmrule){                        
                    var idx = _.find($scope.es_alarmrules, {"id": $scope.widget.attrs.config.datasource.es_alarmrule.id});
                    if(!idx) $scope.widget.attrs.config.datasource.es_alarmrule = ''; 
                } 
            };
            function onError(error) {
                toastr.error('error', error.data.message);
            };
        }
 

    }

})();
