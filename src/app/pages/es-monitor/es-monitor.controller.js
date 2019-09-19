(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.es-monitor')
        .controller('EsMonitorController', EsMonitorController);

    EsMonitorController.$inject = ['EsMonitor','$scope', 'NgTableParams'];

    function EsMonitorController(EsMonitor, $scope, NgTableParams) {
    
        var vm = this;

        //饼图
        vm.sinkCharts = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            // legend: {
            //     orient: 'vertical',
            //     left: 'left',
            //     data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            // },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '75%',
                    center: ['50%', '45%'],
                    data:[
                        {value:25, name:'HDFS Sink'},
                        {value:75, name:'ES Sink'},
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


        //GC Count
        vm.GCCountCharts = {
            title: {
                text: 'GC Count',
                x:'0',
                y:'0',
                textStyle: {
                    fontFamily: "microsoft yahei",
                        fontSize: 14,
                        fontStyle: 'normal',
                        color:'#333'
                    },
                },
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross'
                  }
              },
              legend: {
                  x: 'center',
                  y:'20',
                  data:['Old 0','Young 26'],
                  textStyle:{    //图例文字的样式
                      color:'#000',
                      fontSize:12
                  }
              },
              xAxis:  {
                  type: 'category',
                  axisLabel: {
                      textStyle: {
                          color: '#999',//坐标值得具体的颜色
   
                      }
                  },
                  boundaryGap: false,
                  data: ['11:00','11:10','11:20','11:30','11:40','11:50','12:00']
              },
              yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: '{value}',
                      textStyle: {
                         color: '#999'
                     }
                  },
                  axisPointer: {
                      snap: true
                  },
                  splitLine:{  
              　　　　show:false  
              　　 }  
              },
              grid: {
                  left: '3%',
                  right: '3%',
                  bottom: '13%',
                  containLabel: true
              },
              series: [
                  {
                      name:'Old 0',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [300, 250, 270, 300, 550, 500, 600 ],
                      itemStyle: {
                          normal:{
                              color:'#ff8900'
                          }
                      }
  
                  },
                  {
                      name:'Young 26',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [200, 220, 170, 400, 250,234, 500 ],
                      itemStyle: {
                          normal:{
                              color:'#98be3b'
                          }
                      }
                  }
              ]
        };
        //GC Duration(ms)
        vm.GCDurationCharts = {
            title: {
                text: 'GC Duration(ms)',
                x:'0',
                y:'0',
                textStyle: {
                    fontFamily: "microsoft yahei",
                        fontSize: 14,
                        fontStyle: 'normal',
                        color:'#333'
                    },
                },
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross'
                  }
              },
              legend: {
                  x: 'center',
                  y:'20',
                  data:['Old 0 ms','Young 378 ms'],
                  textStyle:{    //图例文字的样式
                      color:'#000',
                      fontSize:12
                  }
              },
              xAxis:  {
                  type: 'category',
                  axisLabel: {
                      textStyle: {
                          color: '#999',//坐标值得具体的颜色
   
                      }
                  },
                  boundaryGap: false,
                  data: ['11:00','11:10','11:20','11:30','11:40','11:50','12:00']
              },
              yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: '{value}ms',
                      textStyle: {
                         color: '#999'
                     }
                  },
                  axisPointer: {
                      snap: true
                  },
                  splitLine:{  
              　　　　show:false  
              　　 }  
              },
              grid: {
                  left: '3%',
                  right: '3%',
                  bottom: '13%',
                  containLabel: true
              },
              series: [
                  {
                      name:'Old 0 ms',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [300, 250, 270, 300, 550, 500, 600 ],
                      itemStyle: {
                          normal:{
                              color:'#ff8900'
                          }
                      }
  
                  },
                  {
                      name:'Young 378 ms',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [200, 220, 170, 400, 250,234, 500 ],
                      itemStyle: {
                          normal:{
                              color:'#98be3b'
                          }
                      }
                  }
              ]
        };
        //JVM Heap(GB)
        vm.JVMHeapCharts = {
            title: {
                text: 'JVM Heap(GB)',
                x:'0',
                y:'0',
                textStyle: {
                    fontFamily: "microsoft yahei",
                        fontSize: 14,
                        fontStyle: 'normal',
                        color:'#333'
                    },
                },
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross'
                  }
              },
              legend: {
                  x: 'center',
                  y:'20',
                  data:['Old 0 GB','Young 26 GB'],
                  textStyle:{    //图例文字的样式
                      color:'#000',
                      fontSize:12
                  }
              },
              xAxis:  {
                  type: 'category',
                  axisLabel: {
                      textStyle: {
                          color: '#999',//坐标值得具体的颜色
   
                      }
                  },
                  boundaryGap: false,
                  data: ['11:00','11:10','11:20','11:30','11:40','11:50','12:00']
              },
              yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: '{value}GB',
                      textStyle: {
                         color: '#999'
                     }
                  },
                  axisPointer: {
                      snap: true
                  },
                  splitLine:{  
              　　　　show:false  
              　　 }  
              },
              grid: {
                  left: '3%',
                  right: '3%',
                  bottom: '13%',
                  containLabel: true
              },
              series: [
                  {
                      name:'Old 0 GB',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [300, 250, 270, 300, 550, 500, 600 ],
                      itemStyle: {
                          normal:{
                              color:'#ff8900'
                          }
                      }
  
                  },
                  {
                      name:'Young 26 GB',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [200, 220, 170, 400, 250,234, 500 ],
                      itemStyle: {
                          normal:{
                              color:'#98be3b'
                          }
                      }
                  }
              ]
        };
        //CPU Utilization
        vm.CPUUtilizationCharts = {
            title: {
                text: 'CPU Utilization(%)',
                x:'0',
                y:'0',
                textStyle: {
                    fontFamily: "microsoft yahei",
                        fontSize: 14,
                        fontStyle: 'normal',
                        color:'#333'
                    },
                },
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross'
                  }
              },
              legend: {
                  x: 'center',
                  y:'20',
                  data:['Old 0 GB','Young 26 GB'],
                  textStyle:{    //图例文字的样式
                      color:'#000',
                      fontSize:12
                  }
              },
              xAxis:  {
                  type: 'category',
                  axisLabel: {
                      textStyle: {
                          color: '#999',//坐标值得具体的颜色
   
                      }
                  },
                  boundaryGap: false,
                  data: ['11:00','11:10','11:20','11:30','11:40','11:50','12:00']
              },
              yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: '{value}GB',
                      textStyle: {
                         color: '#999'
                     }
                  },
                  axisPointer: {
                      snap: true
                  },
                  splitLine:{  
              　　　　show:false  
              　　 }  
              },
              grid: {
                  left: '3%',
                  right: '3%',
                  bottom: '13%',
                  containLabel: true
              },
              series: [
                  {
                      name:'Old 0 GB',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [300, 250, 270, 300, 550, 500, 600 ],
                      itemStyle: {
                          normal:{
                              color:'#ff8900'
                          }
                      }
  
                  },
                  {
                      name:'Young 26 GB',
                      type:'line',
                      smooth: true,
                      symbol:'none',
                      data: [200, 220, 170, 400, 250,234, 500 ],
                      itemStyle: {
                          normal:{
                              color:'#98be3b'
                          }
                      }
                  }
              ]
        };
        //Job erro
        var base = +new Date(1968, 9, 3);
        var oneDay = 24 * 3600 * 1000;
        var date = [];

        var data = [Math.random() * 300];

        for (var i = 1; i < 20000; i++) {
            var now = new Date(base += oneDay);
            date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
            data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
        }

        vm.jobErroCharts = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'left',
                text: 'Job error',
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 10
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [
                {
                    name:'模拟数据',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    },
                    data: data
                }
            ]
        };


        
    }
})();
