(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.role-management')
        .factory('RoleManagement', RoleManagement);

    RoleManagement.$inject = ['$resource', 'DateUtils'];

    function RoleManagement ($resource, DateUtils) {
        var resourceUrl =  'api/authority-controls/:id';

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
            'getRoleInfoByName': { method: 'GET', 'url': 'api/authority-control?name=:name', isArray: false},
            'getAuthorityMenus': { method: 'GET', 'url': 'api/authority-control/menu', isArray: false}

        });
    }
})(); 