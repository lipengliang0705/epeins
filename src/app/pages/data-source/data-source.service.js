(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.data-source')
        .factory('DataSource', DataSource);

    DataSource.$inject = ['$resource', 'DateUtils'];

    function DataSource ($resource, DateUtils) {
        var resourceUrl =  'api/data-sources/:id';

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
            'update': { method:'PUT' }
        });
    }
})();
