(function() {
    'use strict';
    angular
        .module('LoginsightUiApp')
        .factory('UserView', UserView);

    UserView.$inject = ['$resource', 'DateUtils'];

    function UserView ($resource, DateUtils) {


        return $resource('api/data-dashboards/:id', {}, {
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
            'define': { url: 'api/user-define-data/type/:type', method: 'GET', isArray: true}
        });
    }
})();
