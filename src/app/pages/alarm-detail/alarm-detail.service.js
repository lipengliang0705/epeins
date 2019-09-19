(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.alarm-detail')
        .factory('AlarmDetail', AlarmDetail);

    AlarmDetail.$inject = ['$resource', 'DateUtils'];

    function AlarmDetail ($resource, DateUtils) {
        var resourceUrl =  'api/alarm/alarm-rules/:id';

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
            'switch': { method: 'PUT', 'url': 'api/alarm/alarm-switch'}
        });
    }
})();
