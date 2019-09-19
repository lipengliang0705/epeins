(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.system-monitor')
        .factory('SystemMonitor', SystemMonitor);

    SystemMonitor.$inject = ['$resource', 'DateUtils'];

    function SystemMonitor ($resource, DateUtils) {
        var resourceUrl =  'api/systems/:id';

        var esDataSearchUrl = "api/search/es-data-search";
        var esDetailSearchUrl = "api/search/es-detail-search";
        var groupAggStaticUrl= "api/statistic/host/group-agg-static";
        var hostUrl = "api/agent-flow-monitor/monitor-host";
        
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
            'getEsData': { method: 'POST', 'url': esDataSearchUrl}, 
            'getEsDetail': { method: 'POST', 'url': esDetailSearchUrl}, 
            'getGroupAggStatic': { method: 'POST', 'url': groupAggStaticUrl}, 
            'getHosts': { method: 'GET', 'url': hostUrl, isArray: true}, 
        });
    }
})();
