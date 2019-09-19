(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.file-place-recovery')
        .factory('FilePlaceRecoveryService', FilePlaceRecoveryService);

    FilePlaceRecoveryService.$inject = ['$resource', 'DateUtils'];

    function FilePlaceRecoveryService ($resource, DateUtils) {
        var resourceUrl =  '/api/archive';
        //
        // 移除快照:
        //     GET:   /api/archive/removeSnapshot/{snapshotName}
        // 恢复快照:
        //     GET:   /api/archive/restoreSnapshot/{snapshotName}
        // 移除索引范围:
        //     GET:   /api/archive/deleteIndice/{indexRange}
        return $resource(resourceUrl, {}, {
            'query': { method: 'GET',url:resourceUrl+'/getAllSnapshot/:snapshotName'},
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
            remove:{
                method:"GET",
                url:resourceUrl+'/removeSnapshot/:snapshotName'
            },
            restore:{
                method:"GET",
                url:resourceUrl+'/restoreSnapshot/:snapshotName'
            },
            deleteIndice:{
                method:"GET",
                url:resourceUrl+'/deleteIndice/:indiceName'
            }
        });
    }
})();
