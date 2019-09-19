(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.integrated-query')
        .factory('IntegratedQuery', IntegratedQuery);

    IntegratedQuery.$inject = ['$resource', 'DateUtils'];

    function IntegratedQuery ($resource, DateUtils) {
        var resourceUrl =  'api/integrated-query/:id'; 

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
