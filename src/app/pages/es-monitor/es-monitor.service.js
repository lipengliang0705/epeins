(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.es-monitor')
        .factory('EsMonitor', EsMonitor);

    EsMonitor.$inject = ['$resource', 'DateUtils'];

    function EsMonitor ($resource, DateUtils) {
        var resourceUrl =  'api/es/:id';

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
