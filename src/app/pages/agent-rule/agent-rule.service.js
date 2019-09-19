(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.agent-rule')
        .factory('AgentRule', AgentRule);

    AgentRule.$inject = ['$resource', 'DateUtils'];

    function AgentRule ($resource, DateUtils) {
        var resourceUrl =  'api/agent-rules/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.createdTime = DateUtils.convertDateTimeFromServer(data.createdTime);
                        data.modifiedTime = DateUtils.convertDateTimeFromServer(data.modifiedTime);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' },
            'stopBatchAgentRules': {
                url: 'api/stop-batch-agent-rules',
                method: 'POST',
                isArray:true
            },
            'startBatchAgentRules': {
                url: 'api/start-batch-agent-rules',
                method: 'POST',
                isArray:true
            }
        });
    }
})();
