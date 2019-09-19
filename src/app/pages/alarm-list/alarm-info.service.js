(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm')
        .factory('AlarmInfoService', AlarmInfoService);

    AlarmInfoService.$inject = ['$rootScope', '$http'];

    function AlarmInfoService ($rootScope, $http) {
        var service = {
            getAlarmCheckedCount: getAlarmCheckedCount,
            getAlarmByAlarmLevels: getAlarmByAlarmLevels,
            getAlarmByCategories: getAlarmByCategories,
            getAlarmByEventRules: getAlarmByEventRules,
            getAlarmByAlarmLevelId: getAlarmByAlarmLevelId,
            getAlarmByEventRuleId: getAlarmByEventRuleId,
            getAlarmByCategoryId: getAlarmByCategoryId,
            getAlarmByAlarmRuleId: getAlarmByAlarmRuleId,

            getAlarmAggregation: getAlarmAggregation,
            getAlarmEventCount: getAlarmEventCount,
            getAlarmCategory: getAlarmCategory,
            getAlarmEventCountCategory: getAlarmEventCountCategory,
            getAlarmInfoCategory: getAlarmInfoCategory
        }; 
        return service; 

        function getAlarmEventCount () {
            return $http.get('api/alarm/alarm-event-count').then(function (response) {
                return response.data;
            });
        } 
        function getAlarmAggregation () {
            return $http.get('api/alarm/alarm-aggregation').then(function (response) {
                return response.data;
            });
        }
        function getAlarmCategory (name) {
            return $http.get('api/alarm/alarm-aggregation-category/'+name).then(function (response) {
                return response.data;
            });
        }  
        function getAlarmEventCountCategory (name) {
            return $http.get('api/alarm/alarm-event-count-category/'+name).then(function (response) {
                return response.data;
            });
        }
        function getAlarmInfoCategory (name) {
            return $http.get('api/alarm/alarm-infos-category/'+name).then(function (response) {
                return response.data;
            });
        }  


        function getAlarmCheckedCount () {
            return $http.get('api/alarm/alarm-checked-count').then(function (response) {
                return response.data;
            });
        }

        function getAlarmByAlarmLevels () {
            return $http.get('api/alarm/alarm-infos-by-alarm-levels').then(function (response) {
               // console.log('getAlarmByAlarmLevels', response.data );
                return response.data;
            });
        }
        function getAlarmByAlarmLevelId(id) {
            return $http.get('api/alarm/alarm-infos-by-alarm-levels/'+id).then(function (response) {
               // console.log('getAlarmByAlarmLevelId', response.data );
                return response.data;
            });
        }

        function getAlarmByCategories () {
            return $http.get('api/alarm/alarm-infos-by-categories').then(function (response) {
               // console.log('getAlarmByCategories', response.data );
                return response.data;
            });
        }
        function getAlarmByCategoryId(id) {
            return $http.get('api/alarm/alarm-infos-by-categories/'+id).then(function (response) {
               // console.log('getAlarmByCategoryId', response.data );
                return response.data;
            });
        }

        function getAlarmByEventRules () {
            return $http.get('api/alarm/alarm-infos-by-event-rules').then(function (response) {
               // console.log('getAlarmByEventRules', response.data );
                return response.data;
            });
        }        
        function getAlarmByEventRuleId(id) {
            return $http.get('api/alarm/alarm-infos-by-event-rules/'+id).then(function (response) {
               // console.log('getAlarmByEventRuleId', response.data );
                return response.data;
            });
        }
        function getAlarmByAlarmRuleId(id) {
            return $http.get('api/alarm/alarm-infos-by-alarm-rules/'+id).then(function (response) {
               // console.log('getAlarmByAlarmRuleId', response.data );
                return response.data;
            });
        }

    }
})();
