(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-monitor')
        .controller('AgentMonitorController', AgentMonitorController);

    AgentMonitorController.$inject = ['AgentMonitor','$scope', 'NgTableParams', 'toastr'];

    function AgentMonitorController(AgentMonitor, $scope, NgTableParams, toastr) {
    
        var vm = this;


        vm.deployedCount = 0;
        vm.deployedCount = 0;
        vm.deployedCount = 0;

        vm.categoryShow = false;
        vm.categoryTableShow = false;
        vm.categoryDetailShow = false;

        vm.timeInterval = 5;
        vm.intervalClick = intervalClick; 

        vm.agentSummary = {};
        vm.categoryList = [];
        vm.categoryArray = [];
        vm.categoryTableList = [];

        // 格式化显示时间
        vm.formatShowTime = formatShowTime;
        // 时间选择
        vm.dateRange = {
            "startDate": vm.endTime ||  moment().subtract(1, 'day'),
            "endDate": vm.startTime || moment()
        };  
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
                "applyLabel": "应用",
                "cancelLabel": "取消",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "自定义",
                "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                "firstDay": 1
            },
        }


        getList();
        getCategoryList();
        function getList(){  
            AgentMonitor.query({}, onSuccess, onError);
            function onSuccess(result, headers) {
              console.log('AgentMonitor.query', result); 
              vm.agentSummary = result; 
              vm.optionDeployedPie.series[0].data[0].value = vm.agentSummary.undeployed;              
              vm.optionDeployedPie.series[0].data[1].value = vm.agentSummary.deployed;              

              vm.optionInoperationPie.series[0].data[0].value = vm.agentSummary.stopped;              
              vm.optionInoperationPie.series[0].data[1].value = vm.agentSummary.running; 
            }; 
            function onError(error) {
                toastr.error('error', error); 
            };
        }
        function getCategoryList(){  
            AgentMonitor.getCategoryList({}, onSuccess, onError);
            function onSuccess(result, headers) {
              console.log('AgentMonitor.getCategoryList', result); 
              vm.categoryList = [];
              var keys = _.keys(result);
              _.forEach(keys, function(k){
                 if(result[k] && result[k].categoryName && result[k].categoryName == k){
                    vm.categoryList.push(result[k]);
                 }
              }); 
              dataSlice();  
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        }

        function getCategoryTableList(name){  
            AgentMonitor.getCategoryInfoList({name: name}, onSuccess, onError);
            function onSuccess(result, headers) {
              console.log('AgentMonitor.getCategoryInfoList', result); 
              vm.categoryTableList = result;
              vm.tableParams = new NgTableParams( {}, { dataset: vm.categoryTableList} );
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        } 
        function getEventIncrement(bean){   
            var params = {
                "hostIp": vm.categoryDetail.hostIp, // "10.128.2.171", //
                "categoryName": vm.categoryDetail.categoryName,
                "minGap": vm.timeInterval,
                "startTime": moment(vm.dateRange.startDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z"),
                "endTime": moment(vm.dateRange.endDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z")
            };  
            AgentMonitor.getEventIncrement(params, onSuccess, onError);
            function onSuccess(result, headers) {
                console.log('AgentMonitor.getEventIncrement', result); 
                getEventIncrementLine(result);
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        } 


        vm.categoryShowDiv = categoryShowDiv;
        vm.categoryTableShowDiv = categoryTableShowDiv;
        vm.categoryDetailShowDiv = categoryDetailShowDiv;
        function categoryShowDiv(){  
            vm.categoryShow = true;
            vm.categoryTableShow = false;
            vm.categoryDetailShow = false;
        }
        function categoryTableShowDiv(name,index){ 
            getCategoryTableList(name);

            vm.categoryTableShowIndex = index;
            vm.categoryTableShow = true;
            vm.categoryDetailShow = false;
        }
        vm.eventIncrementParams = {};
        function categoryDetailShowDiv(d){  
            vm.categoryDetail = {
                "hostIp": d.hostIp, 
                "categoryName": d.categoryName, 
            }          
            getEventIncrement();
            vm.categoryDetailShow = true;
        } 
                      
        function dataSlice(){
            vm.categoryArray = [];
            var result = [];
            var data = vm.categoryList;
            var chunk = 4; //每4个分一组

            for(var i = 0; i < data.length / chunk; i++){ 
                vm.categoryArray.push({ 'number':i, 'data':data.slice(i * chunk, (i+1) * chunk)});
            }  
        } 
          
        function intervalClick(v){
            vm.timeInterval = v || 5;
            getEventIncrement();
        }

        $scope.$watch("vm.dateRange", function (newValue, oldValue) {
            console.log(newValue, oldValue); 
            if(newValue){
                getEventIncrement();                
            }
        });


        // 格式化显示时间
        function formatShowTime(data) {
            return moment(data).format("YYYY/MM/DD HH:mm:ss");
        };

        vm.eventIncrementLine = { 
            "config": {  
              "height": 350,
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
            },
            "data": []
        };  
        function getEventIncrementLine(data){
            vm.eventIncrementLine.data = [];             
            vm.eventIncrementLine.data.push({"name": vm.categoryDetail.categoryName, "type":"line", "datapoints": data.aggregations.count});
        }

        vm.optionDeployedPie =  { 
            series : [
                {
                    type : 'pie',
                    center : ['40%', '50%'],
                    radius : [40, 55],
                    x: '0%', // for funnel
                    itemStyle : {
                        normal : {
                            label : {
                                formatter : function (params){
                                    return 100 - params.value + '%'
                                },
                                textStyle: {  baseline : 'top' }
                            }
                        },
                    },
                    data : [
                        {
                            name:'其他', 
                            value: 0, 
                            itemStyle : {
                                normal : {
                                    color: '#ccc',
                                    label : {
                                        show : true,
                                        position : 'center'
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                },
                                emphasis: {
                                    color: 'rgba(0,0,0,0)'
                                }
                            }
                        }, {
                            name:'已部署', 
                            value:0,
                            itemStyle : {
                                normal : {
                                    color: '#6BC9E6',
                                    label : {
                                        show : true,
                                        position : 'center',
                                        formatter : '{b}',
                                        textStyle: {
                                            baseline : 'bottom'
                                        }
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                }
                            }
                        }
                    ]
                } 
            ]
        };
                 
        vm.optionInoperationPie =  { 
            series : [
                {
                    type : 'pie',
                    center : ['40%', '50%'],
                    radius : [40, 55],
                    x: '0%', // for funnel
                    itemStyle : {
                        normal : {
                            label : {
                                formatter : function (params){
                                    return 100 - params.value + '%'
                                },
                                textStyle: {  baseline : 'top' }
                            }
                        },
                    },
                    data : [
                        {
                            name:'其他', 
                            value:0, 
                            itemStyle : {
                                normal : {
                                    color: '#ccc',
                                    label : {
                                        show : true,
                                        position : 'center'
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                },
                                emphasis: {
                                    color: 'rgba(0,0,0,0)'
                                }
                            }
                        }, {
                            name:'运行中', 
                            value:0,
                            itemStyle : {
                                normal : {
                                    color: '#6BC9E6',
                                    label : {
                                        show : true,
                                        position : 'center',
                                        formatter : '{b}',
                                        textStyle: {
                                            baseline : 'bottom'
                                        }
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                }
                            }
                        }
                    ]
                } 
            ]
        }; 
  

    }
})();
