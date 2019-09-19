(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.agent-monitor')
        .factory('AgentMonitor', AgentMonitor);

    AgentMonitor.$inject = ['$resource', 'DateUtils'];

    function AgentMonitor ($resource, DateUtils) {
        var resourceUrl =  'api/agent-flow-monitor/flume-aggregation';
        var categoryUrl =  'api/agent-flow-monitor/flume-category-aggregation';
        var categoryInfoUrl = "api/agent-flow-monitor/flume-category-info/:name";
        var eventIncrementUrl = "api/agent-flow-monitor/event-increment";

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: false}, 
            'getCategoryList': { method: 'GET', url: categoryUrl, isArray: false},
            'getCategoryInfoList': { method: 'GET', url: categoryInfoUrl, isArray: true},
            'getEventIncrement' : {method: 'POST', url: eventIncrementUrl} 
        });
    }
})();
