(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.data-dashboard')
        .factory('DataDashboard', DataDashboard);

    DataDashboard.$inject = ['$resource', 'DateUtils'];

    function DataDashboard ($resource, DateUtils) {
        //var resourceUrl =  'http://127.0.0.1:9081/api/data-dashboards/:id';
        var resourceUrl = 'api/data-dashboards/:id';
        
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
            'update': { method:'PUT' },
            'getDataDashboardByType': { method: 'GET', 'url': 'api/user-define-data/type/:type', isArray: true}
        });
    }
})();
