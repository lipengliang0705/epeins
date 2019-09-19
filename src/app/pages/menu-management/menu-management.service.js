(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.menu-management')
        .factory('MenuManagement', MenuManagement);

    MenuManagement.$inject = ['$resource', 'DateUtils'];

    function MenuManagement ($resource, DateUtils) {
        var resourceUrl =  'api/menu-trees/:id';

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
