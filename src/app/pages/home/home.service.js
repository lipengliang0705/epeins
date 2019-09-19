(function () {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.home');
    app.factory('HomeService', HomeService);
    HomeService.$inject = ['$resource'];

    function HomeService($resource) {
        return $resource('', {}, {
            // 查询所有仪表盘
            'dashboardsInfo': {
                method: 'GET',
                url: '/api/new-dashboards/all',
                isArray: true
            },

            // 查询所有知识库
            'knowledgeBaseInfo': {
                method: 'POST',
                url: '/api/knowledge/knowledge-all',
                isArray: true
            },

            // 获取已存的搜索条件
            'getDataDashboardByType': {
                method: 'GET',
                url: 'api/user-define-data/type/:type',
                isArray: true
            },

            // 删除记录
            'deleteDataDashboard': {
                url: 'api/data-dashboards/:id',
                method: 'DELETE'
            },

            // 告警通知
            'alarmInfosNotification': {
                url: 'api/alarm/alarm-infos-notification',
                method: 'GET',
                isArray: true
            },

            // 标记为已读
            'alarmInfos': {
                url: 'api/alarm/alarm-infos',
                method: 'PUT',
            },

            // 全部已读
            'markAllAsRead': {
                url: 'api/alarm/mark-all-as-read',
                method: 'PUT',
                isArray: true
            },

            // 获取详情
            'getAlarmDetails': {
                url: 'api/alarm/alarm-infos/:id',
                method: 'GET'
            },

            // 获取全部的report
            'getAllData': {
                url: 'api/getAllData',
                method: 'GET',
                isArray: true
            },

            // 获取uid
            'getPublicUid': {
                url: 'api/getPublicUid/:id',
                method: 'GET'
            }
        })
    }
})();