(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.tracker')
        .controller('TrackerStatisticController', TrackerStatisticController);

    TrackerStatisticController.$inject = [ '$window', '$state', '$stateParams', 'AlarmInfoService', 'toastr', '$uibModalInstance', 'NgTableParams'];

    function TrackerStatisticController ( $window, $state, $stateParams, AlarmInfoService, toastr, $uibModalInstance, NgTableParams) {
         var vm = this;  
        vm.categoryName = $stateParams.id;
        vm.clear = clear;
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        vm.optionBarCharts = {
            "config": {
                "height": 220,
                "width": "100%", 
                "type": "bar", 
                "color": [ "#299498"],
                "toolbox": {
                  show : false
                }  
            },
            "data": []
        } 

        vm.mapAlarmLevelCharts = {
            "config" : {
                "width": "60%",
                "height": 200,
                "color": [
                    "#91C7AE",
                    "#D48265",
                    "#EEDD82",
                    "#DFE6E9"
                ],
                "legend": {show: false},
                "radius": ['30%','70%'],
                "center": ['50%','50%']
            },
            "data" : []
        };
        vm.mapAlarmRuleCharts = {
            "config" : {
                "width": "60%",
                "height": 200,
                "color": [
                    "#D48265",
                    "#91C7AE",
                    "#EEDD82",
                    "#DFE6E9"
                ], 
                "legend": {show: false},
                "radius": ['30%','70%'],
                "center": ['50%','50%']
            },
            "data" : []
        };
        vm.mapEventRuleCharts = {
            "config" : {
                "width": "60%",
                "height": 200,
                "color": [
                    "#91C7AE",
                    "#D48265",
                    "#EEDD82",
                    "#DFE6E9"
                ], 
                "legend": {show: false},
                "radius": ['30%','70%'],
                "center": ['50%','50%']
            },
            "data" : []
        };
        vm.mapReadCountCharts = {
            "config" : {
                "width": "60%",
                "height": 200,
                "color": [
                    "#91C7AE",
                    "#D48265",
                    "#EEDD82",
                    "#DFE6E9"
                ], 
                "legend": {show: false},
                "radius": ['30%','70%'],
                "center": ['50%','50%']
            },
            "data" : []
        };

        getAlarmCategory();
        function getAlarmCategory(){
            vm.mapAlarmLevelCharts.data = [];
            vm.mapAlarmRuleCharts.data = [];
            vm.mapEventRuleCharts.data = [];
            vm.mapReadCountCharts.data = [];
            AlarmInfoService.getAlarmCategory($stateParams.id).then(function (result) {
               console.log('getAlarmCategory', result);   
               if (result.mapAlarmLevel) {
                   var data = [];
                   _.forEach(_.keys(result.mapAlarmLevel), function(k){
                        data.push({'x': k, 'y': result.mapAlarmLevel[k]});
                   });
                   vm.mapAlarmLevelCharts.data.push({ "name": "告警等级", "type":"pie", "datapoints": data });
               };
               if (result.mapAlarmRule) {
                   var data = [];
                   _.forEach(_.keys(result.mapAlarmRule), function(k){
                        data.push({'x': k, 'y': result.mapAlarmRule[k]});
                   });
                   vm.mapAlarmRuleCharts.data.push({ "name": "告警规则", "type":"pie", "datapoints": data });
               };
               if (result.mapEventRule) {
                   var data = [];
                   _.forEach(_.keys(result.mapEventRule), function(k){
                        data.push({'x': k, 'y': result.mapEventRule[k]});
                   });
                   vm.mapEventRuleCharts.data.push({ "name": "解析规则", "type":"pie", "datapoints": data });
               };
               if (result.mapReadCount) {
                   var data = [];
                   // _.forEach(_.keys(result.mapReadCount), function(k){
                   //      data.push({'x': k, 'y': result.mapReadCount[k]});
                   // }); {total: 0, unread: 0}
                   if(result.mapReadCount&&result.mapReadCount.total>0&&result.mapReadCount.unread){
                      data.push({'x': 'unread', 'y': result.mapReadCount.unread});
                      data.push({'x': 'read', 'y': result.mapReadCount.total-result.mapReadCount.unread});
                   }
                    
                   vm.mapReadCountCharts.data.push({ "name": "未读/已读数", "type":"pie", "datapoints": data });
               }; 

            }, function (error) { 
               toastr.error('error', error);              
            });
        }
        getAlarmEventCountCategory();
        function getAlarmEventCountCategory(){
            vm.optionBarCharts.data = [];
            AlarmInfoService.getAlarmEventCountCategory($stateParams.id).then(function (result) {
               console.log('getAlarmEventCountCategory', result);   
               if (result) {
                   var data = [];
                   _.forEach(_.keys(result), function(k){
                        data.push({'x': k, 'y': result[k]});
                   });
                   vm.optionBarCharts.data.push({"name": "", "type":"bar", "datapoints": data});  
               };

            }, function (error) { 
               // toastr.error('error', error);              
            });
        }
        // {
        //     tooltip : {
        //         trigger: 'item',
        //         formatter: "{a} <br/>{b} : {c} ({d}%)"
        //     },   
        //     series : [
        //         {
        //             name: '',
        //             type: 'pie',
        //             radius : '75%',
        //             center: ['50%', '50%'],
        //             data:[                        
        //             ],                    
        //             itemStyle: {
        //                 normal: {
        //                   label:{  
        //                     show:true,  
        //                     formatter:'{b} : {c} '  
        //                   },  
        //                   labelLine:{show:true}
        //                 },  
        //                 emphasis: {
        //                     shadowBlur: 10,
        //                     shadowOffsetX: 0,
        //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
        //                 }
        //             }
        //         }
        //     ]
        // }   


    }
})();
