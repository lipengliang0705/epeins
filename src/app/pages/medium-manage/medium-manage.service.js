(function() {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.medium-manage');
    app.factory("mediumManageService", mediumManageService);
    mediumManageService.$inject = ['$resource'];

    function mediumManageService($resource) {
        var resourceUrl = '';
        return $resource(resourceUrl, {}, {
            //查询所有仪表盘
            'checkNewDashboardsInfo': {
                method: 'GET',
                //url: '/api/new-dashboards/all',
                isArray: true
            },

            // 查询仪表后台接口
            'echartsSearch': {
                method: 'POST',
                //url: 'api/statistic/event-count'
            },
            'query':{
                method: 'GET'
            }

        });
    }
})();