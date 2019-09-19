(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.agent-host')
        .factory('AgentHost', AgentHost);

    AgentHost.$inject = ['$resource'];

    function AgentHost($resource) {
        var resourceUrl = 'api/agent-hosts/:id';
        var testHostUrl = 'api/test-agent';

        return $resource(resourceUrl, {}, {
            'query': {
                method: 'GET',
                isArray: true,
                transformResponse: function(data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.map(function(d) {
                            return d['loginInfo'] = angular.fromJson(d['loginInfo']);
                        })
                    }
                    return data;
                }
            },
            'get': {
                method: 'GET',
                transformResponse: function(data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.loginInfo = angular.fromJson(data.loginInfo);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT'
            },
            'test': {
                method: 'POST',
                url: 'api/deploy-agent-host'
            },
            'save': {
                method: 'POST'
            },
            'batchDeployAgentHost': {
                url: '/api/batch-deploy-agent-host',
                method: 'POST',
                isArray:true
            },
            'testHost': {
                method: 'POST',
                url:testHostUrl
            },
        });
    }
})();
