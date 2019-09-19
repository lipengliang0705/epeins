(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.role-management')
        .factory('Authorities', Authorities);

    Authorities.$inject = ['$resource', 'DateUtils'];

    function Authorities ($resource, DateUtils) {
        var resourceUrl =  'api/authorities/:name';

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
            }
        });
    }
})();
