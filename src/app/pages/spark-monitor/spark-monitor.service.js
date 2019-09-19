(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.spark-monitor')
        .factory('SparkMonitor', SparkMonitor);

    SparkMonitor.$inject = ['$resource', 'DateUtils'];

    function SparkMonitor ($resource, DateUtils) {
        var resourceUrl =  'api/spark-monitor/:id';
        var appsUrl = "api/spark-monitor/apps";
        var summaryUrl = "api/spark-monitor/summary";
        var getAppUrl = "api/spark-monitor/app/:appid";
        var eventCount = "api/statistic/event-count";

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.modifiedTime = DateUtils.convertDateTimeFromServer(data.modifiedTime);
                        data.createdTime = DateUtils.convertDateTimeFromServer(data.createdTime);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' },            
            'getApps': { method: 'GET', 'url': appsUrl, isArray: true},
            'getSummary': { method: 'GET', 'url': summaryUrl, isArray: true},
            'getAppById': { method: 'GET', 'url': getAppUrl, isArray: false},
            'getEventCount': { method: 'POST', 'url': eventCount}, 
        });
    }
})();
