(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.tracker')
        .controller('JhiTrackerController', JhiTrackerController);

    JhiTrackerController.$inject = [ '$window', '$state', '$http', 'JhiTrackerService', 'AlarmInfoService', 'toastr', '$scope','$rootScope', 'AlarmResult','NgTableParams'];

    function JhiTrackerController ( $window, $state, $http, JhiTrackerService, AlarmInfoService, toastr, $scope,$rootScope, AlarmResult, NgTableParams) {
        // This controller uses a Websocket connection to receive user activities in real-time.
        var vm = this; 
        // AlertService.error("sdf", {});
        vm.activities = [];

        vm.AlarmResult = [];
       
         // table 的参数
        vm.tableParams = new NgTableParams(); 
        
        // JhiTrackerService.connect();
        // JhiTrackerService.receive().then(null, null, function(activity) { 
        //     showActivity(activity);
        // });
        
        vm.unCheckedCount = 0;  
        JhiTrackerService.receive().then(null, null, function(activity) { 
            if (activity.page !== 'logout') {
                vm.unCheckedCount = vm.unCheckedCount + 1;
            }
        });
          
        function showActivity(activity) {
            var existingActivity = false;
            // for (var index = 0; index < vm.activities.length; index++) {
            //     if(vm.activities[index].sessionId === activity.sessionId) {
            //         existingActivity = true;
            //         if (activity.page === 'logout') {
            //             vm.activities.splice(index, 1);
            //         } else {
            //             vm.activities[index] = activity;
            //         }
            //     }
            // }
            if (!existingActivity && (activity.page !== 'logout')) {
                vm.activities.push(activity);
                
                // AlertService.add({'type': 'danger', 'msg': '<pre>'+JSON.stringify(activity.command)+'</pre>', 'id': 1, 'timeout': 0, toast: true});
                loadNewAlarm(activity);
            }
            
        }
        
        function loadNewAlarm(activity){
            //activity =  {"command":"MESSAGE","headers":{"content-length":"305","message-id":"xznricjh-19","subscription":"sub-0","content-type":"application/json;charset=UTF-8","destination":"/topic/tracker"},"body":"{\r\n  \"_type\" : \"type1\",\r\n  \"_id\" : \"AWXw1IukGm1yCqhJkPux\",\r\n  \"_index\" : \"yewu1\",\r\n  \"timestamp\" : \"2018-09-19T08:46:00Z\",\r\n  \"field\" : \"value\",\r\n  \"num_hits\" : \"4\",\r\n  \"num_matches\" : \"1\",\r\n  \"trans\" : \"99999\",\r\n  \"rule_name\" : \"rule2\",\r\n  \"categoryId\" : 4,\r\n  \"eventRuleId\" : 4,\r\n  \"alarmLevelId\" : 3\r\n}"};
            vm.newAlarms =  JSON.parse(activity.body);//angular.fromJson(activity.body);//JSON.stringify(activity);
             

            // var msg = '新告警：' + vm.newAlarms.categoryName + '业务，在'+ vm.newAlarms.timestamp + '时间发生'+ vm.newAlarms.alarmLevelName + '等级告警';
            
            // toastr.error({'type': 'danger', 'msg': msg, 'timeout': 0 });
            //      console.log('新告警：',vm.newAlarms);
            vm.unCheckedCount = vm.unCheckedCount + 1; 
            var eventRuleData = angular.copy(vm.optionEventRule.series[0].data);
            vm.optionEventRule.series[0].data = _.forEach(eventRuleData,function(d){
                if( d.id == vm.newAlarms.eventRuleId) return d.value = d.value+1 ;
            });

            var categoryData = angular.copy(vm.optionAlarmCategory.series[0].data);
            vm.optionAlarmCategory.series[0].data = _.forEach(categoryData,function(d){ 
                if( d.id == vm.newAlarms.categoryId) return d.value = d.value+1 ;
            });

            var alarmLevelData = angular.copy(vm.optionAlarmLevel.series[0].data);
            vm.optionAlarmLevel.series[0].data = _.forEach(alarmLevelData,function(d){ 
                if( d.id == vm.newAlarms.alarmLevelId) return d.value = d.value+1 ;
            });  

           

        } 
        getAlarmCheckedCount();
        function getAlarmCheckedCount(){
            vm.unCheckedCount = 0;
            AlarmInfoService.getAlarmCheckedCount().then(function (result) {               
                vm.unCheckedCount = result.unCheckedCount; 
            }, function (error) {
                console.log(error);              
            });
        }


        vm.optionCharts = {
            "config": {
                "height": 210,
                "width": "100%", 
                "type": "bar", 
                "color": [ "#299498"],
                "toolbox": {
                  show : false
                }  
            },
            "data": []
        }
 
        function loadAll(){   
            getAlarmEventCount();         
            getAlarmAggregation(); 
        }
        loadAll();

        function getAlarmEventCount(){
            vm.optionCharts.data = [];
            AlarmInfoService.getAlarmEventCount().then(function (result) {
               console.log('getAlarmEventCount', result);  console.log(result);
               // vm.optionCharts.data.push({"name": "告警数", "type":"bar", "datapoints": result}); 
               if (result) {
                   var data = [];
                   _.forEach(_.keys(result), function(k){
                        data.push({'x': k, 'y': result[k]});
                   });
                   vm.optionCharts.data.push({"name": "告警数", "type":"bar", "datapoints": data});  
               }; 
            }, function (error) { 
               // toastr.error('error', error);              
            });
        }
        function getAlarmAggregation(){ 
            vm.dataload=true;
            AlarmInfoService.getAlarmAggregation().then(function (result) { 
                vm.dataload=false; 
                vm.AlarmResult = result; 
                vm.searchQuery = null;
                vm.tableParams = new NgTableParams(
                   {
                       filter: {},
                       sorting: {},
                       page: 1,//展示第一页
                       count: 10,//每页有15个数据项
                       url: ''
                    },
                    { dataset: result}
                ); 
            }, function (error) { 
               // toastr.error('error', error);              
            }); 

        }  

        function applyGlobalSearch(){
            var term = vm.globalSearchTerm; 
            vm.tableParams.filter({ $: term });
        }

        // 值变更的时候触发
        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if(newValue != oldValue){
                vm.tableParams.filter({ $: vm.globalSearchTerm });
            }
        });


         
        vm.goAlarmDetail = goAlarmDetail;
        function goAlarmDetail(params,type){
            console.log(params);
            var param = { 'detailId': params.data.id, 'type': type};
            var openurlnw = $state.href("alarm-detail",param);
            $window.open(openurlnw, '_blank');
           
        }

        vm.goAlarmInfo = goAlarmInfo;
        function goAlarmInfo(){  
            var openurlnw = $state.href("alarm-info",null);
            $window.open(openurlnw, '_blank');

        }


             

    }
})();
