(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.alarm-rule')
        .factory('AlarmRule', AlarmRule);

    AlarmRule.$inject = ['$resource', 'DateUtils'];

    function AlarmRule ($resource, DateUtils) {
        var resourceUrl =  'api/alarm/alarm-rules/:id';
        var resourceUrl2 = 'api/get-alarm-rules-by-event-rule/:eventrule_id';
        

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
            'switch': { method: 'PUT', 'url': 'api/alarm/alarm-switch'},
            'getAlarmRulesByEventRuleId': {  'url': resourceUrl2, method: 'GET',  isArray: true} 
        });
    }
})();
