(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.trouble-shooter')
        .factory('TroubleShooter', TroubleShooter);

    TroubleShooter.$inject = ['$resource', 'DateUtils'];

    function TroubleShooter ($resource, DateUtils) {
        var resourceUrl =  'api/trouble-shooter/:id'; 

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
            'update': { method:'PUT' },            
            // 'getApps': { method: 'GET', 'url': resourceUrl, isArray: true}
        });
    }
})();
