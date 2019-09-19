(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.system-monitor')
        .controller('SystemMonitorController', SystemMonitorController);

    SystemMonitorController.$inject = ['SystemMonitor', '$scope', 'NgTableParams', 'toastr', '$filter'];

    function SystemMonitorController(SystemMonitor, $scope, NgTableParams, toastr, $filter) {
    
        var vm = this;
        vm.searchClick = searchClick;
        
        vm.dateRange = {
            "startDate": moment().subtract(7, 'day'),
            "endDate":  moment()
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

        vm.param = {};

        //已部署的目标主机
        vm.hosts = [];
        getHosts();
        function getHosts(){
            SystemMonitor.getHosts(function(result) { 
                if(result){
                    vm.hosts = result; 
                    vm.host = vm.hosts[0];
                }
                console.log('getHosts', vm.hosts, vm.host);
            });
        }
 
        function loadAll(){
            getSystemNavigation();    
            getCpuUsage(); 
            getSystemLoad(); 
            getMemoryUsage();
            getDiskIO();
            getNetworkTrafficPackets();
            getNetworkTrafficBytes();
            getProcessesByMemory();
            getTopProcessesByCPU();
            getInterfacesTraffic();
        }

        function searchClick(){
            console.log('searchClick', vm.host, vm.dateRange);
            if(vm.host && vm.dateRange){
                vm.hostname =  vm.host.name; //vm.host.ip; //"term1.tss.dev.pi"; 
                vm.startTime = vm.dateRange.startDate;
                vm.endTime = vm.dateRange.endDate;
                console.log(vm.hostname, vm.startTime, vm.endTime);
                loadAll();
            }
        }

        // 值变更的时候触发
        $scope.$watch("vm.host", function (newValue, oldValue) {
            if (newValue) {
                console.log(newValue);
                searchClick();
            }
        });

        vm.systemNavigationData = [];
        function getSystemNavigation(){ 
            var param = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-03-05T01:10:21.114Z",
                    "endTime": vm.endTime, //"2019-03-05T01:20:21.114Z",
                    "from":0,
                    "size":200,
                    "filterFields": {
                        "is": { 
                          "beat.hostname": vm.hostname //"term1.tss.dev.pi"
                        } 
                    }
                } 
            SystemMonitor.getEsData(param, onSuccess, onError);
            function onSuccess(result, headers) {
                console.log('getSystemNavigation', result);
                vm.systemNavigationData = result;
                getSystemNavigationCharts();
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        } 

        vm.CPUUsageData = [];
        function getCpuUsage (){
            var param = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":1000,
                    "filterFields": {
                        "is": {
                          "metricset.name": "cpu",
                          "beat.hostname": vm.hostname //"term1.tss.dev.pi"
                        } 
                    }
                }  
            SystemMonitor.getEsDetail(param, onSuccess, onError);
            function onSuccess(result, headers) {
                console.log('getCpuUsage', result); 
                var data = _.orderBy(result.hit, "source['@timestamp']"); 
                _.forEach(data, function(v){ 
                    var time = $filter('date')(v.source['@timestamp'], "yyyy-MM-dd HH:mm:ss");
                    var item = {'time': time, 'system': v.source.system.cpu.system.pct, 'softirq': v.source.system.cpu.softirq.pct,
                            'irq': v.source.system.cpu.irq.pct, 'iowait': v.source.system.cpu.iowait.pct, 'user': v.source.system.cpu.user.pct,
                            'nice': v.source.system.cpu.nice.pct, 'idle': v.source.system.cpu.idle.pct, 'steal': v.source.system.cpu.steal.pct  };

                    vm.CPUUsageData.push(item);                     
                });
                // console.log(vm.CPUUsageData);
                replaceChartData(vm.CPUUsageData, vm.CPUUsage);
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        }

        function replaceChartData(data, chart){ 
            var getVal = function( val){ 
                var copyData = angular.copy(data);
                return copyData.map(function(d) { return d[val] });
            }   
            chart.xAxis.data = getVal('time');
            _.forEach(chart.series, function(v){ 
                v.data = getVal(v.name);  
            }); 
            // console.log(chart);
        }

        vm.systemLoadData = [];
        function getSystemLoad (){
            var param = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":1000,
                    "filterFields": {
                        "is": {
                          "metricset.name": "load",
                          "beat.hostname": vm.hostname //"term1.tss.dev.pi"
                        } 
                    }
                }
            SystemMonitor.getEsDetail(param, onSuccess, onError);
            function onSuccess(result, headers) {
                console.log('getSystemLoad', result);
                var data = _.orderBy(result.hit, "source['@timestamp']"); 
                _.forEach(data, function(v){ 
                    var time = $filter('date')(v.source['@timestamp'], "yyyy-MM-dd HH:mm:ss");
                    var item = {'time': time, '1m': v.source.system.load['1'], '5m': v.source.system.load['5'], '15m': v.source.system.load['15']  };
                    vm.systemLoadData.push(item);                     
                }); 
                replaceChartData(vm.systemLoadData, vm.systemLoad);
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        } 

        vm.memoryUsageData = [];
        function getMemoryUsage (){
            var param = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":1000,
                    "filterFields": {
                        "is": {
                          "metricset.name": "memory",
                          "beat.hostname": vm.hostname // "term1.tss.dev.pi"
                        } 
                    }
                }
            SystemMonitor.getEsDetail(param, onSuccess, onError);
            function onSuccess(result, headers) {
                console.log('getMemoryUsage', result);
                var data = _.orderBy(result.hit, "source['@timestamp']"); 
                _.forEach(data, function(v){ 
                    var time = $filter('date')(v.source['@timestamp'], "yyyy-MM-dd HH:mm:ss");
                    var item = {'time': time, 'Used': v.source.system.memory.used.bytes, 'Cache': v.source.system.memory.total, 'Free': v.source.system.memory.free  };
                    vm.memoryUsageData.push(item);           
                }); 
                replaceChartData(vm.memoryUsageData, vm.memoryUsage);
            };
            function onError(error) {
                toastr.error('error', error); 
            };
        }  
        
        function getDiskIO (){
            var readParam = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":200,
                    "aggType":"sum",
                    "isSingleValue":false,
                    "aggField":"system.diskio.read.bytes",
                    "groupByField":"@timestamp",
                    "filterFields": {
                        "is": {
                          "metricset.name": "diskio",
                          "beat.hostname": vm.hostname //"term1.tss.dev.pi"
                        } 
                    }
                }
            var writeParam = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":200,
                    "aggType":"sum",
                    "isSingleValue":false,
                    "aggField":"system.diskio.write.bytes",
                    "groupByField":"@timestamp",
                    "filterFields": {
                        "is": {
                          "metricset.name": "diskio",
                          "beat.hostname": vm.hostname //"term1.tss.dev.pi"
                        } 
                    }
                } 
            SystemMonitor.getGroupAggStatic(readParam, function(result, headers) {
                console.log('getDiskIO read', result);  
                var data = _.orderBy(result.aggregations.sum, "x");   
                var copyData = angular.copy(data);
                vm.diskIO.xAxis[0].data = copyData.map(function(d) { return $filter('date')( d['x'], "yyyy-MM-dd HH:mm:ss"); }); 
                vm.diskIO.series[0].data = copyData.map(function(d) { return d['y']; });                 
            }, onError); 

            SystemMonitor.getGroupAggStatic(writeParam, function(result, headers){
                console.log('getDiskIO write', result, headers);                
                var data = _.orderBy(result.aggregations.sum, "x");   
                var copyData = angular.copy(data);
                // vm.diskIO.xAxis[0].data = copyData.map(function(d) { return $filter('date')( d['x'], "yyyy-MM-dd HH:mm:ss"); }); 
                vm.diskIO.series[1].data = copyData.map(function(d) { return d['y']; });  
            }, onError);

            function onError(error) {
                toastr.error('error', error); 
            };
        } 

        // Network Traffic (Packets) [Metricbeat System] 
        function getNetworkTrafficPackets(){
            var inParam = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":200,
                    "aggType":"sum",
                    "isSingleValue":false,
                    "aggField":"system.network.in.packets",
                    "groupByField":"@timestamp",
                    "filterFields": {
                        "is": {
                          "metricset.name": "network",
                          "beat.hostname": vm.hostname //"term1.tss.dev.pi"
                        } 
                    }
                };
            var outParam = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":200,
                    "aggType":"sum",
                    "isSingleValue":false,
                    "aggField":"system.network.out.packets",
                    "groupByField":"@timestamp",
                    "filterFields": {
                        "is": {
                          "metricset.name": "network",
                          "beat.hostname": vm.hostname //"term1.tss.dev.pi"
                        } 
                    }
                };
            SystemMonitor.getGroupAggStatic(inParam, function(result, headers) {
                console.log('getNetworkTrafficPackets in ', result);  
                var data = _.orderBy(result.aggregations.sum, "x");   
                var copyData = angular.copy(data);
                vm.networkTraffic.xAxis[0].data = copyData.map(function(d) { return $filter('date')( d['x'], "yyyy-MM-dd HH:mm:ss"); }); 
                vm.networkTraffic.series[0].data = copyData.map(function(d) { return d['y']; });                 
            }, onError); 

            SystemMonitor.getGroupAggStatic(outParam, function(result, headers){
                console.log('getNetworkTrafficPackets out ', result, headers);                
                var data = _.orderBy(result.aggregations.sum, "x");   
                var copyData = angular.copy(data);
                // vm.networkTraffic.xAxis[0].data = copyData.map(function(d) { return $filter('date')( d['x'], "yyyy-MM-dd HH:mm:ss"); }); 
                vm.networkTraffic.series[1].data = copyData.map(function(d) { return d['y']; });  
            }, onError);

            function onError(error) {
                toastr.error('error', error); 
            };
            // var getOut = SystemMonitor.getGroupAggStatic(outParam);
            // var getIn = SystemMonitor.getGroupAggStatic(inParam);
            // Promise.all([getOut, getIn]).then(function(d){
            //     console.log('getNetworkTrafficPackets', d);
            //     console.log('getNetworkTrafficPackets', d[0]);
            //     console.log('getNetworkTrafficPackets', d[1]);                
            // }).catch(function(error) {
            //    console.log('error', error);
            //    toastr.error('error', error); 
            // });

        }  

        //Network Traffic (Bytes) [Metricbeat System]
        function getNetworkTrafficBytes(){
            var inParam = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":200,
                    "aggType":"sum",
                    "isSingleValue":false,
                    "aggField":"system.network.in.bytes",
                    "groupByField":"@timestamp",
                    "filterFields": {
                        "is": {
                          "metricset.name": "network",
                          "beat.hostname": vm.hostname //"term1.tss.dev.pi"
                        } 
                    }
                };
            var outParam = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":200,
                    "aggType":"sum",
                    "isSingleValue":false,
                    "aggField":"system.network.out.bytes",
                    "groupByField":"@timestamp",
                    "filterFields": {
                        "is": {
                          "metricset.name": "network",
                          "beat.hostname": vm.hostname // "term1.tss.dev.pi"
                        } 
                    }
                };  

            SystemMonitor.getGroupAggStatic(inParam, function(result, headers) {
                console.log('getNetworkTrafficPackets in ', result);  
                var data = _.orderBy(result.aggregations.sum, "x");   
                var copyData = angular.copy(data);
                vm.networkTrafficBytes.xAxis[0].data = copyData.map(function(d) { return $filter('date')( d['x'], "yyyy-MM-dd HH:mm:ss"); }); 
                vm.networkTrafficBytes.series[0].data = copyData.map(function(d) { return d['y']; });                 
            }, onError); 

            SystemMonitor.getGroupAggStatic(outParam, function(result, headers){
                console.log('getNetworkTrafficPackets out ', result, headers);                
                var data = _.orderBy(result.aggregations.sum, "x");   
                var copyData = angular.copy(data);
                // vm.networkTrafficBytes.xAxis[0].data = copyData.map(function(d) { return $filter('date')( d['x'], "yyyy-MM-dd HH:mm:ss"); }); 
                vm.networkTrafficBytes.series[1].data = copyData.map(function(d) { return d['y']; });  
            }, onError);

            function onError(error) {
                toastr.error('error', error); 
            };
        }

        //Processes By Memory [Metricbeat System]
        vm.processesByMemoryData = [];
        function getProcessesByMemory(){
            var param = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":200,
                    "aggType":"sum",
                    "isSingleValue":false,
                    "aggField":" system.process.memory.rss.pct",
                    "groupByField":"system.process.name", 
                    "filterFields": {
                        "is": {
                          "metricset.name": "process",
                          "beat.hostname": vm.hostname // "term1.tss.dev.pi"
                        } 
                    }
                };
            SystemMonitor.getGroupAggStatic(param, function(result, headers) {
                console.log('getProcessesByMemory ', result);  
                // var data = _.orderBy(result.aggregations.sum, "x");   
                vm.processesByMemoryData = result.aggregations.sum;          
            }, onError); 
            function onError(error) {
                toastr.error('error', error); 
            };

        }
        //Top Processes By CPU [Metricbeat System]
        vm.topProcessesByCPUData = [];
        function getTopProcessesByCPU(){
            var param = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":200,
                    "aggType":"sum",
                    "isSingleValue":false,
                    "aggField":"system.process.cpu.total.pct",
                    "groupByField":"system.process.name", 
                    "filterFields": {
                        "is": {
                          "metricset.name": "process",
                          "beat.hostname": vm.hostname //"term1.tss.dev.pi"
                        } 
                    }
                };
            SystemMonitor.getGroupAggStatic(param, function(result, headers) {
                console.log('getTopProcessesByCPU ', result);  
                // var data = _.orderBy(result.aggregations.sum, "x");   
                vm.topProcessesByCPUData = result.aggregations.sum;          
            }, onError); 
            function onError(error) {
                toastr.error('error', error); 
            };
        } 

        //Interfaces by Incoming traffic and Interfaces by Outgoing traffic
        vm.interfacesTrafficInData = [];
        vm.interfacesTrafficOutData = [];
        vm.interfacesTrafficData = [];
        function getInterfacesTraffic (){
            var param = {
                    "index": "metricbeat-*",
                    "types": [ "doc" ],
                    "timeFieldName":"@timestamp",
                    "startTime": vm.startTime, //"2019-02-28T02:20:00.354Z",
                    "endTime": vm.endTime, //"2019-02-28T02:30:00.354Z",
                    "from":0,
                    "size":20,
                    "filterFields": {
                        "is": {
                          "metricset.name": "network",
                          "beat.hostname": vm.hostname //"term1.tss.dev.pi"
                        } 
                    }
                } 
            SystemMonitor.getEsDetail(param, onSuccess, onError);
            function onSuccess(result, headers) {
                console.log('getInterfacesTraffic', result);
                var data = _.orderBy(result.hit, "source['@timestamp']"); 
                _.forEach(data, function(v){ 
                    var time = $filter('date')(v.source['@timestamp'], "yyyy-MM-dd HH:mm:ss");
                    var item = {'time': time, 'name': v.source.system.network.name, 'in': v.source.system.network.in.bytes, 'out': v.source.system.network.out.bytes  };
                    vm.interfacesTrafficData.push(item);                     
                });
                console.log(vm.interfacesTrafficData); 
            }; 
            function onError(error) {
                toastr.error('error', error); 
            };
        } 

 
        function getSystemNavigationCharts(){
            // console.log(vm.cpuUsageCharts ,  vm.MemoryUsageCharts  );  
            var cpu_usage = vm.systemNavigationData.cpu_usage;
            var cpu_usage_float = parseFloat( cpu_usage.toFixed(0) );
            vm.cpuUsageCharts.series[0].data = [ {name:'other', value: 100-cpu_usage_float, itemStyle: labelBottom}, {name:'CPU Usage', value:cpu_usage_float, itemStyle: labelTop} ];
            
            var memory_usage = vm.systemNavigationData.mem_usage;
            var memory_usage_float = parseFloat( memory_usage.toFixed(0) );
            vm.MemoryUsageCharts.series[0].data = [ {name:'other', value: 100-memory_usage_float, itemStyle: labelBottom}, {name:'Memory Usage', value:memory_usage_float, itemStyle: labelTop} ];
            
            var load_usage = vm.systemNavigationData.load_5m;
            var load_usage_float = parseFloat( load_usage.toFixed(0) );
            vm.loadUsageCharts.series[0].data = [ {name:'other', value: 100-load_usage_float, itemStyle: labelBottom}, {name:'5m Load', value:load_usage_float, itemStyle: labelTop} ];
            
            var swap_usage = vm.systemNavigationData.swap_usage;
            var swap_usage_float = parseFloat( swap_usage.toFixed(0) );
            vm.swapUsageCharts.series[0].data = [ {name:'other', value: 100-swap_usage_float, itemStyle: labelBottom}, {name:'Swap Usage', value:swap_usage_float, itemStyle: labelTop} ];
            
            var disk_used = vm.systemNavigationData.disk_used;
            var disk_used_float = parseFloat( disk_used.toFixed(0) );            
            vm.diskUsedCharts.series[0].data = [ {name:'other', value: 100-disk_used_float, itemStyle: labelBottom}, {name:'Disk Used', value:disk_used_float, itemStyle: labelTop} ];
        }
        
        vm.greaterThan = function(prop, val){ 
            return function(item){
              return item[prop] > val;
            }
        } 


        var labelTop = {
            normal : {
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
        };
        var labelFromatter = {
            normal : {
                label : {
                    formatter : function (params){
                        return 100 - params.value + '%'
                    },
                    textStyle: {
                        baseline : 'top'
                    }
                }
            },
        }
        var labelFromatter1 = {
            normal : {
                label : {
                    formatter : function (params){
                        return 100 - params.value
                    },
                    textStyle: {
                        baseline : 'top'
                    }
                }
            },
        }
        var labelBottom = {
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
        };
        var radius = [35, 40];
        vm.cpuUsageCharts = {
            // title : {
            //     text: '存储容量统计图',
            //     x: 'center',
            //     y:'0',
            //     textStyle: {
            //         fontFamily: "microsoft yahei",
            //           fontSize: 14,
            //           fontStyle: 'normal',
            //           color:'#fff'
            //         },
            // },
            series : [
                {
                    type : 'pie',
                    center : ['40%', '50%'],
                    radius : radius,
                    x: '0%', // for funnel
                    itemStyle : labelFromatter,
                    data : [
                        // {name:'other', value:85, itemStyle : labelBottom},
                        // {name:'CPU Usage', value:15,itemStyle : labelTop}
                    ]
                }
            ]
        };

        vm.MemoryUsageCharts = {
            series : [
                {
                    type : 'pie',
                    center : ['40%', '50%'],
                    radius : radius,
                    x: '0%', // for funnel
                    itemStyle : labelFromatter,
                    data : [
                        // {name:'other', value:84, itemStyle : labelBottom},
                        // {name:'Memory Usage', value:16,itemStyle : labelTop}
                    ]
                }
            ]
        };
        vm.loadUsageCharts = {
            series : [
                {
                    type : 'pie',
                    center : ['40%', '50%'],
                    radius : radius,
                    x: '0%', // for funnel
                    itemStyle : labelFromatter1,
                    data : [
                        // {name:'other', value:84, itemStyle : labelBottom},
                        // {name:'5m Load', value:16,itemStyle : labelTop}
                    ]
                }
            ]
        };
        vm.swapUsageCharts = {
            series : [
                {
                    type : 'pie',
                    center : ['40%', '50%'],
                    radius : radius,
                    x: '0%', // for funnel
                    itemStyle : labelFromatter,
                    data : [
                        // {name:'other', value:100, itemStyle : labelBottom},
                        // {name:'Swap Usage', value:0,itemStyle : labelTop}
                    ]
                }
            ]
        };
        vm.diskUsedCharts = {
            series : [
                {
                    type : 'pie',
                    center : ['40%', '50%'],
                    radius : radius,
                    x: '0%', // for funnel
                    itemStyle : labelFromatter,
                    data : [
                        // {name:'other', value:71, itemStyle : labelBottom},
                        // {name:'Disk used', value:29,itemStyle : labelTop}
                    ]
                }
            ]
        };

        //CPU Usage [Metricbeat System]
        vm.CPUUsage = {
            title: {
                text: 'per 10 seconds'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                top:'20',
                y : 'bottom',
                data:['user','system','nice','irq','softirq','iowait'],
                textStyle:{    //图例文字的样式
                    color:'rgba(0, 0, 0, 0.4)',
                    fontSize:12
                }
                
            },
            grid: {
                left: '2%',
                right: '15%',
                bottom: '1%',
                containLabel: true
            },
            xAxis : {
                type : 'category',
                boundaryGap : false,
                data : [] //['16:45','16:50','16:55','17:00','17:05','17:10']
            },
            yAxis : {
                type : 'value',
                // axisLabel: {  
                //   show: true,  
                //   interval: 'auto',  
                //   formatter: '{value} %'  
                // }
            },
            series : [
                {
                    name:'user',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#6bba21' //改变区域颜色
                        }
                    },
                    data: [] //[20, 12, 10, 14, 9, 23, 21]
                },
                {
                    name:'system',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#d03221' //改变区域颜色
                        }
                    },
                    data: [] //[20, 82, 91, 34, 90, 33, 31]
                },
                {
                    name:'nice',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#e0731e' //改变区域颜色
                        }
                    },
                    data: [] //[50, 23, 21, 15, 90, 30, 10]
                },
                {
                    name:'irq',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data: [] //[32, 32, 101, 134, 290, 130, 120]
                },
                {
                    name:'softirq',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {normal: {}},
                    data: [] //[60, 40, 30, 70, 120, 13, 13]
                },
                {
                    name:'iowait',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {normal: {}},
                    data: [] //[82, 32, 101, 93, 129, 133, 132]
                }
            ]
        };

        //System Load [Metricbeat System]
        vm.systemLoad= {
            title: {
                text: 'per 10 seconds'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                top:'20',
                y : 'bottom',
                data:['1m','5m','15m']
            },
            grid: {
                left: '2%',
                right: '15%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data : [] // ['16:45','16:50','16:55','17:00','17:05','17:10']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'1m',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    data: [] // [12, 13, 10, 34, 9, 30, 21]
                },
                {
                    name:'5m',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    data: [] // [22, 12, 91, 34, 29, 33, 31]
                },
                {
                    name:'15m',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    data: [] // [15, 32, 20, 54, 19, 30, 10]
                }
            ]
        };

        //Memory Usage [Metricbeat System]
        vm.memoryUsage = {
            title: {
                text: 'per 10 seconds'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                top:'20',
                y : 'bottom',
                data:['Used','Cache','Free']
            },
            grid: {
                left: '2%',
                right: '15%',
                bottom: '1%',
                containLabel: true
            },
            xAxis : {
                type : 'category',
                boundaryGap : false,
                data : [] // ['16:45','16:50','16:55','17:00','17:05','17:10']
            },
            yAxis : {
                type : 'value',
                axisLabel: {  
                  show: true,  
                  interval: 'auto',  
                  formatter: '{value}'//'{value} GB'  
                }
            },
            series : [
                {
                    name:'Used',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#d03221' //改变区域颜色
                        }
                    },
                    data: [] // [12, 12.1, 12.22, 12.45, 12.36, 12.11, 12.3]
                },
                {
                    name:'Cache',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#199ddd' //改变区域颜色
                        }
                    },
                    data: [] // [20, 20.11, 20.22, 20.78, 20.99, 20.889, 20]
                },
                {
                    name:'Free',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#6bba21' //改变区域颜色
                        }
                    },
                    data: [] // [8, 8, 8.77, 8.66, 8.1, 8.4, 8.5]
                }
            ]
        }; 
        //Disk IO (Bytes) [Metricbeat System]
        vm.diskIO = {
            title: {
                text: 'per 10 seconds'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                top:'20',
                y : 'bottom',
                data:['reads','writes']
            },
            grid: {
                left: '2%',
                right: '15%',
                bottom: '1%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : [] //['16:45','16:50','16:55','17:00','17:05','17:10']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel: {  
                      show: true,  
                      interval: 'auto',  
                      formatter: '{value}'//'{value} MB/s'  
                    }
                }
            ],
            series : [
                {
                    name:'reads', 
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#24a5a4' //改变区域颜色
                        }
                    },
                    data: [] //[20, 4, 3, 2, 1, 0, 0]
                },
                {
                    name:'writes',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#f99d27' //改变区域颜色
                        }
                    },
                    data: [] //[-12, -8, -9, -3, -9, -33, -31]
                }
            ]
        }; 
        //Network Traffic (Packets) [Metricbeat System]
        vm.networkTraffic = {
            title: {
                text: 'per 10 seconds'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                top:'20',
                y : 'bottom',
                data:['Inbound','Outbound']
            },
            grid: {
                left: '2%',
                right: '15%',
                bottom: '1%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : [] //['16:45','16:50','16:55','17:00','17:05','17:10']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel: {  
                      show: true,  
                      interval: 'auto',  
                      formatter: '{value}'//'{value} k/s'  
                    }
                }
            ],
            series : [
                {
                    name:'Inbound',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#24a5a4' //改变区域颜色
                        }
                    },
                    data: [] //[2, 4, 3, 6, 4, 2, 5]
                },
                {
                    name:'Outbound',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#f99d27' //改变区域颜色
                        }
                    },
                    data: [] //[-2, -8, -3, -4, -1, -13, -5]
                }
            ]
        }; 
        //Network Traffic (Bytes) [Metricbeat System]
        vm.networkTrafficBytes = {
            title: {
                text: 'per 10 seconds'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                top:'20',
                y : 'bottom',
                data:['Inbound','Outbound']
            },
            grid: {
                left: '2%',
                right: '15%',
                bottom: '1%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : [] // ['16:45','16:50','16:55','17:00','17:05','17:10']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel: {  
                      show: true,  
                      interval: 'auto',  
                      formatter: '{value}'//'{value} MB/s'  
                    }
                }
            ],
            series : [
                {
                    name:'Inbound',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#24a5a4' //改变区域颜色
                        }
                    },
                    data: [] //[12, 9, 3, 6, 4, 2, 5]
                },
                {
                    name:'Outbound',
                    symbol: "none",
                    type:'line',
                    smooth:true,
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#f99d27' //改变区域颜色
                        }
                    },
                    data: [] //[-12, -8, -3, -4, -5, -3, -5]
                }
            ]
        };    
        
    }
})();
