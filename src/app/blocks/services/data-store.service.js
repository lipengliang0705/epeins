(function() {
    'use strict';

    angular
        .module('LoginsightUiApp')
        .factory('DataStore', DataStore);

    DataStore.$inject = ['$resource', 'DateUtils'];

    function DataStore ($resource, DateUtils) {
        var resourceUrl =  'api/data-stores/:id';

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
            'save': { method:'POST' },
            'update': { method:'PUT' }
        });
    }
})();
