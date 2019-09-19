(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-detail')
        .controller('AlarmInfoController', AlarmInfoController);

    AlarmInfoController.$inject = ['$scope', 'AlarmDetail', 'AlarmInfoService'];

    function AlarmInfoController($scope, AlarmDetail, AlarmInfoService) {
         
        var vm = this;
        
        vm.AlarmResult = []; 

        loadAll();
        function loadAll() { 
            getAlarmInfo();
            getEventRules();  
            getCategories(); 
            getAlarmLevels();
        }

        function getAlarmInfo(){
            AlarmInfoService.getAlarmCheckedCount().then(function (promise) {
                console.log('true', promise); 
                vm.unCheckedCount = promise.unCheckedCount;
                vm.checkedCount = promise.checkedCount;
            }, function (promise) {
                vm.unCheckedCount = 0;
                console.log('false', promise);
            });
        }

        function getEventRules(){ 
            AlarmInfoService.getAlarmByEventRules().then(function (promise) {
                console.log('EventRules true', promise);
                var _d = angular.copy(promise);  
                vm.eventRuleData = _d.map(function(x) {
                    return { "name":x['detail'].name, "value":x['alarmInfoReturnVMS'].length, "id": x['detail'].id }; 
                });  
            }, function (promise) { 
                console.log('EventRules false', promise);
                vm.eventRuleData = [];          
            });
        }

        function getCategories(){
             AlarmInfoService.getAlarmByCategories().then(function (promise) {
                console.log('Categories true', promise);
                var _d = angular.copy(promise);  
                vm.categoryData = _d.map(function(x) {
                    return { "name":x['detail'].name, "value":x['alarmInfoReturnVMS'].length, "id": x['detail'].id }; 
                });  
                console.log(vm.categoryData);
            }, function (promise) { 
                console.log('Categories false', promise);
                vm.categoryData = [];  
            });
        }
 
        
        function getAlarmLevels(){ 
            AlarmInfoService.getAlarmByAlarmLevels().then(function (promise) {
                console.log('AlarmLevels true', promise);
                var _d = angular.copy(promise);  
                vm.alarmLevelData = _d.map(function(x) {
                    return { "name":x['detail'].name, "value":x['alarmInfoReturnVMS'].length, "id": x['detail'].id }; 
                });  
            }, function (promise) { 
                console.log('AlarmLevels false', promise);
                vm.alarmLevelData = [];         
            });
        }
 
 
    }
})();
