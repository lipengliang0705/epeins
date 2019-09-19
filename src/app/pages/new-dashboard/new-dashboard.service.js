(function() {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.factory("newDashboardService", newDashboardService);
    newDashboardService.$inject = ['$resource'];

    function newDashboardService($resource) {
        var resourceUrl = '';
        return $resource(resourceUrl, {}, {
            //查询所有仪表盘
            'checkNewDashboardsInfo': {
                method: 'GET',
                url: '/api/new-dashboards/all',
                isArray: true
            },
            // 新建仪表盘
            'add': {
                method: 'POST',
                url: '/api/new-dashboards/add'
            },

            // 修改仪表盘
            'modify': {
                method: 'PUT',
                url: '/api/new-dashboards/update'
            },

            // 删除仪表盘
            'delete': {
                method: 'GET',
                url: '/api/new-dashboards/delete/:id'
            },

            // 查看详情
            'details': {
                method: 'GET',
                url: ' /api/new-dashboards/:id'
            },

            // 查看是否可编辑
            "openOrClose": {
                method: 'PUT',
                url: ' /api/new-dashboards/openOrClose'
            },

            'query': {
                method: 'GET'
            },

            // 保存生成的图表
            'chartInfoAdd': {
                method: 'POST',
                url: '/api/chart-info/add'
            },

            // 修改图表
            'chartInfoModify': {
                method: 'PUT',
                url: ' /api/chart-info/update'
            },

            // 查询所有图表信息
            'chartInfoAll': {
                method: 'GET',
                url: '/api/chart-info/all',
                isArray: true
            },

            // 根据ID查询图表
            'chartInfoById': {
                method: 'GET',
                url: '/api/chart-info/:id'
            },

            // 根据ID删除图表(物理删除)
            'chartInfoDelete': {
                method: 'DELETE',
                url: '/api/chart-info/delete/:id'
            },

            // 查询仪表后台接口
            'echartsSearch': {
                method: 'POST',
                url: 'api/statistic/event-count'
            }

        });
    }
})();