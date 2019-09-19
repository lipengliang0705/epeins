(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.alarm-result')
        .factory('AlarmResult', AlarmResult);

    AlarmResult.$inject = ['$resource', 'DateUtils'];

    function AlarmResult ($resource, DateUtils) {
        var resourceUrl =  'api/alarm/alarm-infos/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.conf = angular.fromJson(data.conf);
                        data.createTime = DateUtils.convertDateTimeFromServer(data.createTime);
                        data.modifiedTime = DateUtils.convertDateTimeFromServer(data.modifiedTime);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' },
            'alarmInfosNotification': {
                url: 'api/alarm/alarm-infos-notification', 
                method: 'GET', 
                isArray: true
            },
            'markAllAsRead': {
                url: 'api/alarm/mark-all-as-read', 
                method:'PUT', 
                isArray: true
            }
        });
    }
})();
