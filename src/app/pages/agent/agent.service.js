(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.agent')
        .factory('Agent', Agent);

    Agent.$inject = ['$resource', 'DateUtils'];

    function Agent ($resource, DateUtils) {
        var resourceUrl =  'api/agents/:id';

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
            'update': { method:'PUT' }
        });
    }
})();
