(function() {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.resoures-groups');
    app.factory("ResouresGroupsService", ResouresGroupsService);
    ResouresGroupsService.$inject = ['$resource'];

    function ResouresGroupsService($resource) {
        var resourceUrl = '/api/business-group/:id';
        return $resource(resourceUrl, {}, {
            //查询所有仪表盘
            'query': {
                method: 'GET',
                isArray: true
            },
            'save': {
                method: 'POST',
            },
            'update': {
                method: 'PUT',
            },
            'delete': {
                method: 'DELETE',
            },
            'info': {
                method: 'GET',
            },

        });
    }
})();