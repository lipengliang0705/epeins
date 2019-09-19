(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.data-backup-recovery')
        .factory('DataBackupRecovery', DataBackupRecovery);

    DataBackupRecovery.$inject = ['$resource', 'DateUtils'];

    function DataBackupRecovery ($resource, DateUtils) {
        var resourceUrl =  'api/data-backup-recovery/:id'; 

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
            'update': { method:'PUT' }
        });
    }
})();
