(function () {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.file-place');
    app.factory("FilePlaceService", FilePlaceService);
    FilePlaceService.$inject = ['$resource','DateUtils'];

    function FilePlaceService($resource,DateUtils) {
        var resourceUrl = '/api/archive';
        return $resource(resourceUrl, {}, {
            'add': {
                method: 'POST',
                url: resourceUrl+'/addArchive'
            },
            'update': {
                method: 'POST',
                url:  resourceUrl+'/updateArchive'
            },
            'delete': {
                method: 'POST',
                url:  resourceUrl+'/deleteArchive'
            },
            'query': {
                method: 'GET',
                url: resourceUrl+'/getAllArchive',
                isArray:true,
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.createdTime = DateUtils.convertDateTimeFromServer(data.createdTime);
                        data.modifiedTime = DateUtils.convertDateTimeFromServer(data.modifiedTime);
                    }
                    return data;
                }
            },
            'start': {
                method: 'POST',
                url:  resourceUrl+'/startArchive'
            },
            'stop': {
                method: 'POST',
                url:  resourceUrl+'/stopArchive'
            },
            'tigger': {
                method: 'POST',
                url:  resourceUrl+'/tiggerArchive'
            },
        });
    }
})();