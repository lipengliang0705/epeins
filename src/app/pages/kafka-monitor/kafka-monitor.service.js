(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.system-monitor')
        .factory('KafkaMonitor', KafkaMonitor);

    KafkaMonitor.$inject = ['$resource', 'DateUtils'];

    function KafkaMonitor ($resource, DateUtils) {
        var resourceUrl =  'api/kafkas/:id'; 
        
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
            } 
        });
    }
})();
