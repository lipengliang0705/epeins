(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.category')
        .factory('Category', Category);

    Category.$inject = ['$resource', 'DateUtils'];

    function Category ($resource, DateUtils) {
        var resourceUrl =  'api/categories/:id';

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
