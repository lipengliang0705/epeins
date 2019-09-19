(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.alarm-level')
        .factory('AlarmLevel', AlarmLevel);

    AlarmLevel.$inject = ['$resource'];

    function AlarmLevel ($resource) {
        var resourceUrl =  'api/alarm-levels/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
