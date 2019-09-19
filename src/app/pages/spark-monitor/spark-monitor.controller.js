(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.spark-monitor')
        .controller('SparkMonitorController', SparkMonitorController);

    SparkMonitorController.$inject = ['SparkMonitor','$scope', 'NgTableParams', 'toastr'];

    function SparkMonitorController(SparkMonitor, $scope, NgTableParams, toastr) {
    
        var vm = this;

        vm.changeView = changeView;

        vm.jobLinesCharts = {};
        vm.jobErrorCharts = {};  
        //饼图 
        vm.sinkCharts = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },   
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '75%',
                    center: ['50%', '50%'],
                    data:[                        
                    ],
                    
                    itemStyle: {
                        normal: {
                          label:{  
                            show:true,  
                            formatter:'{b} : {c} '  
                          },  
                          labelLine:{show:true}
                        },  
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
 
        vm.esSink = {};
        vm.hdfsSink = {};
        getSummary();
        function getSummary(){
            vm.sinkCharts.series[0].data = [];
            SparkMonitor.getSummary({}, onSuccess, onError);
            function onSuccess(result, headers) {
                console.log('getSummary', result); 
                vm.esSink = (_.filter(result, {'type': 'spark-es-sink'}))[0]; 
                vm.hdfsSink = (_.filter(result, {'type': 'spark-hdfs-sink'}))[0];  
                // console.log(vm.esSink, vm.hdfsSink, vm.sinkCharts.series[0].data);
                var esSinkValue = vm.esSink.count || 0;  
                var hdfsSinkValue = vm.hdfsSink.count|| 0;
                vm.sinkCharts.series[0].data.push({value: hdfsSinkValue, name:'HDFS Sink'});
                vm.sinkCharts.series[0].data.push({value: esSinkValue, name:'ES Sink'});  
                // console.log(vm.esSink, vm.hdfsSink, vm.sinkCharts.series[0].data,vm.sinkCharts );
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        }

        vm.apps = [];
        getApps();
        function getApps(){
            SparkMonitor.getApps({}, onSuccess, onError);
            function onSuccess(res, headers) {
               console.log('getApps', res); 
               vm.apps = res;
               if(vm.apps.length>0){
                 vm.app = vm.apps[0];
                 changeView();
               }
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        }
        function changeView(){
          if(vm.app && vm.app.appid){
              getAppById(vm.app.appid);
          }
        } 

        vm.esJob = [];
        function getAppById(id){ 
            // id = 'application_1548910005543_0008';
            SparkMonitor.getAppById({'appid': id}, onSuccess, onError);
            function onSuccess(result, headers) {
              console.log('getAppById', result); 
              vm.esJob = result; 
              loadJobLineChart();
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        }

        function loadJobLineChart(){
          vm.jobLinesCharts.data = [];
          vm.jobLinesCharts.config = { 
              // "title": 'Job execute time compare',
              "height": 400,
              "width": "100%", 
              'type': 'line',
              "dataZoom": [{
                  type: 'inside',
                  start: 0,
                  end: 10
              }],
              "toolbox": {
                show : false
              }  
          };
          var data = vm.esJob.data;
            // 查找值
          var getVal = function( val){
              // 先复制 避免修改原来的值
              var copyData = angular.copy(data);
              return copyData.map(function(d) {return {'x':d['time'], 'y':d[val]}});
          }   
          vm.jobLinesCharts.data[0] = {"name": "Schedaling delay", "type":"line", "datapoints": getVal('scheduling_delay')};
          vm.jobLinesCharts.data[1] = {"name": "Processing time", "type":"line", "datapoints": getVal('processing_time')};
          vm.jobLinesCharts.data[2] = {"name": "Total delay", "type":"line",  "datapoints": getVal('total_delay')}; 
        } 

        getEventCount(); 
        vm.esJobError = [];
        function getEventCount(){ 
           var param = {'index': 'log_count-2019-02-25', 'types':['LOG_ERROR_COUNT'], 
                'startTime':'2019-02-25','endTime':'2019-02-26', 'format':'yyyy-MM-dd HH', 'minutesInterval': '60'}; 
           SparkMonitor.getEventCount(param, onSuccess, onError);
            function onSuccess(result, headers) {
                console.log('getEventCount', result); 
                vm.esJobError = result;
                loadJobErrorLineChart();
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        }

        function loadJobErrorLineChart(){
          vm.jobErrorCharts.data = [];
          vm.jobErrorCharts.config = { 
              // "title": 'Job error',
              "height": 400,
              "width": "100%", 
              'type': 'line',
              "dataZoom": [{
                  type: 'inside',
                  start: 0,
                  end: 10
              }],
              "toolbox": {
                show : false
              }  
          };
          var data = vm.esJobError.aggregations;   
          vm.jobErrorCharts.data.push({"name": "Job error", "type":"line", "datapoints": data});
        } 
 



        //job图
        // vm.jobLinesCharts = {
        //     title: {
        //         text: 'Job execute time compare',
        //         x:'0',
        //         y:'0',
        //         textStyle: {
        //             fontFamily: "microsoft yahei",
        //                 fontSize: 14,
        //                 fontStyle: 'normal',
        //                 color:'#fff'
        //             },
        //         },
        //       tooltip: {
        //           trigger: 'axis',
        //           axisPointer: {
        //               type: 'cross'
        //           }
        //       },
        //       legend: {
        //           x: 'center',
        //           y:'20',
        //           data:['Schedaling delay','Processing time','Total delay'],
        //           textStyle:{    //图例文字的样式
        //               color:'#000',
        //               fontSize:12
        //           }
        //       },
        //       xAxis:  {
        //           type: 'category',
        //           axisLabel: {
        //               textStyle: {
        //                   color: '#999',//坐标值得具体的颜色
   
        //               }
        //           },
        //           boundaryGap: false,
        //           data: ['11:00','11:10','11:20','11:30','11:40','11:50','12:00']
        //       },
        //       yAxis: {
        //           type: 'value',
        //           axisLabel: {
        //               formatter: '{value}',
        //               textStyle: {
        //                  color: '#999'
        //              }
        //           },
        //           axisPointer: {
        //               snap: true
        //           },
        //           splitLine:{  
        //       　　　　show:false  
        //       　　 }  
        //       },
        //       grid: {
        //           left: '3%',
        //           right: '3%',
        //           bottom: '13%',
        //           containLabel: true
        //       },
        //       series: [
        //           {
        //               name:'Schedaling delay',
        //               type:'line',
        //               smooth: true,
        //               symbol:'none',
        //               data: [300, 250, 270, 300, 550, 500, 600 ],
        //               itemStyle: {
        //                   normal:{
        //                       color:'#ff8900'
        //                   }
        //               }
  
        //           },
        //           {
        //               name:'Processing time',
        //               type:'line',
        //               smooth: true,
        //               symbol:'none',
        //               data: [200, 220, 170, 400, 250,234, 500 ],
        //               itemStyle: {
        //                   normal:{
        //                       color:'#98be3b'
        //                   }
        //               }
        //           },
        //           {
        //             name:'Total delay',
        //             type:'line',
        //             smooth: true,
        //             symbol:'none',
        //             data: [100, 20, 70, 40, 25,134, 200 ],
        //             itemStyle: {
        //                 normal:{
        //                     color:'#98be3b'
        //                 }
        //             }
        //         }
        //       ]
        // };
        //Job erro
        // var base = +new Date(1968, 9, 3);
        // var oneDay = 24 * 3600 * 1000;
        // var date = [];

        // var data = [Math.random() * 300];

        // for (var i = 1; i < 20000; i++) {
        //     var now = new Date(base += oneDay);
        //     date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        //     data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
        // }

        // vm.jobErroCharts = {
        //     tooltip: {
        //         trigger: 'axis',
        //         position: function (pt) {
        //             return [pt[0], '10%'];
        //         }
        //     },
        //     title: {
        //         left: 'left',
        //         text: 'Job error',
        //     },
        //     xAxis: {
        //         type: 'category',
        //         boundaryGap: false,
        //         data: date
        //     },
        //     yAxis: {
        //         type: 'value',
        //         boundaryGap: [0, '100%']
        //     },
        //     dataZoom: [{
        //         type: 'inside',
        //         start: 0,
        //         end: 10
        //     }, {
        //         start: 0,
        //         end: 10,
        //         handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        //         handleSize: '80%',
        //         handleStyle: {
        //             color: '#fff',
        //             shadowBlur: 3,
        //             shadowColor: 'rgba(0, 0, 0, 0.6)',
        //             shadowOffsetX: 2,
        //             shadowOffsetY: 2
        //         }
        //     }],
        //     series: [
        //         {
        //             name:'模拟数据',
        //             type:'line',
        //             smooth:true,
        //             symbol: 'none',
        //             sampling: 'average',
        //             itemStyle: {
        //                 color: 'rgb(255, 70, 131)'
        //             },
        //             areaStyle: {
        //                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //                     offset: 0,
        //                     color: 'rgb(255, 158, 68)'
        //                 }, {
        //                     offset: 1,
        //                     color: 'rgb(255, 70, 131)'
        //                 }])
        //             },
        //             data: data
        //         }
        //     ]
        // };
        
    }
})();
