(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.kafka-monitor')
        .controller('KafkaMonitorController', KafkaMonitorController);

    KafkaMonitorController.$inject = ['KafkaMonitor', '$scope', 'NgTableParams', 'toastr', '$filter', 'AlarmInfoService'];

    function KafkaMonitorController(KafkaMonitor, $scope, NgTableParams, toastr, $filter, AlarmInfoService) {
    
        var vm = this;

        //CPU Usage
 		vm.CpuUsageCharts = {
            title: {
                text: 'CPU Usage',
                x:'center',
                y:'0',
                textStyle: {
                    fontFamily: "microsoft yahei",
                        fontSize: 14,
                        fontStyle: 'normal',
                        color:'#008acd'
                    },
                },
            tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross'
                  }
              },
            legend: {
                  x: 'left',
                  y:'bottom',
                  data:['192.168.112.129:9990'],
                  textStyle:{    //图例文字的样式
                      color:'#008acd',
                      fontSize:12
                  }
            },
            xAxis:  {
                  type: 'category',
                  axisLabel: {
                      textStyle: {
                          color: '#008acd',//坐标值得具体的颜色
   
                      }
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  
                  boundaryGap: false,
                  data: ['15:15','15:20','15:25','15:30','15:35','15:40']
            },
            yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: '{value}',
                      textStyle: {
                         color: '#008acd'
                     }
                  },
                  axisPointer: {
                      snap: true
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  splitArea:{  
              　　　　show:true  
              　　 },  
            },
            grid: {
            	    top:'13%',
                  left: '3%',
                  right: '3%',
                  bottom: '12%',
                  containLabel: true
            },
            series: [
                  {
                      name:'192.168.112.129:9990',
                      type:'line',
                      smooth: false,
                      symbol:'none',
                      data: [0.0128, 0.0228, 0.0308, 0.0110, 0.0300, 0.0408 ],
                      itemStyle: {
                          normal:{
                              color:'#299498'
                          }
                      }
  
                  }
            ]
        };
  
        //JVM Memory Used
        vm.JvmMomoryUsedCharts = {
            title: {
                text: 'JVM Memory Used',
                x:'center',
                y:'0',
                textStyle: {
                    fontFamily: "microsoft yahei",
                        fontSize: 14,
                        fontStyle: 'normal',
                        color:'#008acd'
                    },
                },
            tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross'
                  }
              },
            legend: {
                  x: 'left',
                  y:'bottom',
                  data:['192.168.112.129:9990'],
                  textStyle:{    //图例文字的样式
                      color:'#008acd',
                      fontSize:12
                  }
            },
            xAxis:  {
                  type: 'category',
                  axisLabel: {
                      textStyle: {
                          color: '#008acd',//坐标值得具体的颜色
   
                      }
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  boundaryGap: false,
                  data: ['15:15','15:20','15:25','15:30','15:35','15:40']
            },
            yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: '{value} MiB',
                      textStyle: {
                         color: '#008acd'
                     }
                  },
                  axisPointer: {
                      snap: true
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  splitArea:{  
              　　　　show:true  
              　　 } 
            },
            grid: {
                  top:'13%',
                  left: '3%',
                  right: '3%',
                  bottom: '12%',
                  containLabel: true
            },
            series: [
                  {
                      name:'192.168.112.129:9990',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [190, 200,220, 180, 150, 248 ],
                      itemStyle: {
                          normal:{
                              color:'#299498'
                          }
                      }
  
                  }
            ]
        };

        //Time spent in GC
        vm.TimeSpentCharts = {
            title: {
                text: 'Time spent in GC',
                x:'center',
                y:'0',
                textStyle: {
                    fontFamily: "microsoft yahei",
                        fontSize: 14,
                        fontStyle: 'normal',
                        color:'#008acd'
                    },
                },
            tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross'
                  }
              },
            legend: {
                  x: 'left',
                  y:'bottom',
                  data:['192.168.112.129:9990'],
                  textStyle:{    //图例文字的样式
                      color:'#008acd',
                      fontSize:12
                  }
            },
            xAxis:  {
                  type: 'category',
                  axisLabel: {
                      textStyle: {
                          color: '#008acd',//坐标值得具体的颜色
   
                      }
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  boundaryGap: false,
                  data: ['15:15','15:20','15:25','15:30','15:35','15:40']
            },
            yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: '{value}%',
                      textStyle: {
                         color: '#008acd'
                     }
                  },
                  axisPointer: {
                      snap: true
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  splitArea:{  
              　　　　show:true  
              　　 }  
            },
            grid: {
                  top:'13%',
                  left: '3%',
                  right: '3%',
                  bottom: '12%',
                  containLabel: true
            },
            series: [
                  {
                      name:'192.168.112.129:9990',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [0.0100, 0.0300,0.0200, 0.0500, 0.0400, 0.0450 ],
                      itemStyle: {
                          normal:{
                              color:'#299498'
                          }
                      }
  
                  }
            ]
        };

        //Messages in Per Topic
        vm.MessagesInPerCharts = {
            title: {
                text: 'Messages in Per Topic',
                x:'center',
                y:'0',
                textStyle: {
                    fontFamily: "microsoft yahei",
                        fontSize: 14,
                        fontStyle: 'normal',
                        color:'#008acd'
                    },
                },
            tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross'
                  }
              },
            legend: {
                  x: 'left',
                  y:'bottom',
                  data:['192.168.112.129:9990'],
                  textStyle:{    //图例文字的样式
                      color:'#008acd',
                      fontSize:12
                  }
            },
            xAxis:  {
                  type: 'category',
                  axisLabel: {
                      textStyle: {
                          color: '#008acd',//坐标值得具体的颜色
   
                      }
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  boundaryGap: false,
                  data: ['15:50','15:55','16:00','16:05','16:10','16:15']
            },
            yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: '{value}',
                      textStyle: {
                         color: '#008acd'
                     }
                  },
                  axisPointer: {
                      snap: true
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  splitArea:{  
              　　　　show:true  
              　　 }  
            },
            grid: {
                  top:'13%',
                  left: '3%',
                  right: '3%',
                  bottom: '12%',
                  containLabel: true
            },
            series: [
                  {
                      name:'192.168.112.129:9990',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [0.05, 0.015,0.03, 0.02, 0.01, 0 ],
                      itemStyle: {
                          normal:{
                              color:'#299498'
                          }
                      }
  
                  }
            ]
        };

        //Bytes in Per Topic
        vm.BytesInPerCharts = {
            title: {
                text: 'Bytes in Per Topic',
                x:'center',
                y:'0',
                textStyle: {
                    fontFamily: "microsoft yahei",
                        fontSize: 14,
                        fontStyle: 'normal',
                        color:'#008acd'
                    },
                },
            tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross'
                  }
              },
            legend: {
                  x: 'left',
                  y:'bottom',
                  data:['192.168.112.129:9990'],
                  textStyle:{    //图例文字的样式
                      color:'#008acd',
                      fontSize:12
                  }
            },
            xAxis:  {
                  type: 'category',
                  axisLabel: {
                      textStyle: {
                          color: '#008acd',//坐标值得具体的颜色
   
                      }
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  boundaryGap: false,
                  data: ['15:50','15:55','16:00','16:05','16:10','16:15']
            },
            yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: '{value} B/s',
                      textStyle: {
                         color: '#008acd'
                     }
                  },
                  axisPointer: {
                      snap: true
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  splitArea:{  
              　　　　show:true  
              　　 }  
            },
            grid: {
                  top:'13%',
                  left: '3%',
                  right: '3%',
                  bottom: '12%',
                  containLabel: true
            },
            series: [
                  {
                      name:'192.168.112.129:9990',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [0.8, 0.2,0.7, 0.5, 0.2, 0 ],
                      itemStyle: {
                          normal:{
                              color:'#299498'
                          }
                      }
  
                  }
            ]
        };

        //Bytes Out Per Topic
        vm.BytesOutPerCharts = {
            title: {
                text: 'Bytes in Per Topic',
                x:'center',
                y:'0',
                textStyle: {
                    fontFamily: "microsoft yahei",
                        fontSize: 14,
                        fontStyle: 'normal',
                        color:'#008acd'
                    },
                },
            tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross'
                  }
              },
            legend: {
                  x: 'left',
                  y:'bottom',
                  data:['192.168.112.129:9990'],
                  textStyle:{    //图例文字的样式
                      color:'#008acd',
                      fontSize:12
                  }
            },
            xAxis:  {
                  type: 'category',
                  axisLabel: {
                      textStyle: {
                          color: '#008acd',//坐标值得具体的颜色
   
                      }
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  boundaryGap: false,
                  data: ['15:50','15:55','16:00','16:05','16:10','16:15']
            },
            yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: '{value} B/s',
                      textStyle: {
                         color: '#008acd'
                     }
                  },
                  axisPointer: {
                      snap: true
                  },
                  splitLine:{  
              　　　　show:false  
              　　 },
                  splitArea:{  
              　　　　show:true  
              　　 }  
            },
            grid: {
                  top:'13%',
                  left: '3%',
                  right: '3%',
                  bottom: '12%',
                  containLabel: true
            },
            series: [
                  {
                      name:'192.168.112.129:9990',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [0.8, 0.2,0.7, 0.5, 0.2, 0 ],
                      itemStyle: {
                          normal:{
                              color:'#299498'
                          }
                      }
  
                  }
            ]
        };
        


}       
})();
