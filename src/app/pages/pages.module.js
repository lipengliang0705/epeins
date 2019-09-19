/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    var app = angular.module('LoginsightUiApp.pages', [
        'ui.router',
        'LoginsightUiApp.pages.components',
        'LoginsightUiApp.pages.profile',
        'LoginsightUiApp.page.logSearch',
        // 'LoginsightUiApp.page.event-rule',
        'LoginsightUiApp.page.category',
        'LoginsightUiApp.page.agent',
        'LoginsightUiApp.page.category',
        'LoginsightUiApp.page.agent-rule',
        'LoginsightUiApp.page.dashboard-builder',
        'LoginsightUiApp.page.data-dashboard',
        'LoginsightUiApp.page.alarm',
        'LoginsightUiApp.page.tracker',
        'LoginsightUiApp.page.alarm-result',
        'LoginsightUiApp.page.alarm-detail',
        'LoginsightUiApp.page.agent-monitor',
        'LoginsightUiApp.page.spark-monitor',
        'LoginsightUiApp.page.es-monitor',
        'LoginsightUiApp.page.system-monitor',
        'LoginsightUiApp.page.kafka-monitor',
        'LoginsightUiApp.page.spl-sql-search',
        'LoginsightUiApp.page.data-backup-recovery',
        'LoginsightUiApp.page.trouble-shooter',
        'LoginsightUiApp.page.integrated-query',
        'LoginsightUiApp.page.service-tracking',
        'LoginsightUiApp.page.menu-management',
        'LoginsightUiApp.page.role-management',
        'LoginsightUiApp.pages.user-management',

        // 新仪表盘模块， Author:Veiss, Date:2019/6/21
        'LoginsightUiApp.page.new-dashboard',

        'LoginsightUiApp.page.knowledge-base',

        'LoginsightUiApp.page.user-groups',

        'LoginsightUiApp.page.resoures-groups',

        'LoginsightUiApp.page.report-management',
        'LoginsightUiApp.page.file-place',
        'LoginsightUiApp.page.alarm-type',

        'LoginsightUiApp.page.medium-manage',

        'LoginsightUiApp.page.host-monitor',
        'LoginsightUiApp.page.file-place-recovery',
        'LoginsightUiApp.page.data-dictionary',
        'LoginsightUiApp.page.audit',

        // 首页模块， Author:Veiss, Date:2019/8/19
        'LoginsightUiApp.page.home',

        // 业务网点模块， Author:Veiss, Date:2019/8/26
        'LoginsightUiApp.page.business-map'
    ]);

    // 运行公共配置
    app.config(routeConfig);

    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
        $urlRouterProvider.otherwise('/new-dashboard');

        // baSidebarServiceProvider.addStaticItem({
        //   title: 'dashboard',
        //   icon: 'ion-android-home',
        //   subMenu: [{
        //     title: 'dashboard',
        //     stateRef: 'dashboard'
        //   }, {
        //     title: '自定义展现',
        //     stateRef: 'dashboard-builder'
        //   }, {
        //     title: '平台拓扑图',
        //     stateRef: 'dashboard-builder'
        //   }]
        // });

        // baSidebarServiceProvider.addStaticItem({
        //   title: '日志采集',
        //   icon: 'ion-compose',
        //   subMenu: [{
        //     title: '目标主机',
        //     stateRef: 'agent-host'
        //   }, {
        //     title: 'agent管理',
        //     stateRef: 'agent'
        //   }, {
        //     title: '采集规则',
        //     stateRef: 'agent-rule'
        //   }, {
        //     title: '数据源',
        //     stateRef: 'data-source'
        //   }, {
        //     title: '业务管理',
        //     stateRef: 'category'
        //   }, {
        //     title: '解析规则',
        //     stateRef: 'event-rule'
        //   }]
        // });

        // baSidebarServiceProvider.addStaticItem({
        //   title: '日志分析',
        //   icon: 'ion-edit',
        //   subMenu: [{
        //     title: '日志查询',
        //     stateRef: 'log-search'
        //   }]
        // });

        // baSidebarServiceProvider.addStaticItem({
        //   title: '日志告警',
        //   icon: 'fa fa-bell-o',
        //   subMenu: [{
        //     title: '告警汇总',
        //     stateRef: 'tracker'
        //   }, {
        //     title: '告警信息',
        //     stateRef: 'alarm-result'
        //   }, {
        //     title: '告警规则',
        //     stateRef: 'alarm-rule'
        //   }]
        // });

        // baSidebarServiceProvider.addStaticItem({
        //   title: '系统管理',
        //   icon: 'ion-gear-a',
        //   subMenu: [{
        //     title: '用户管理',
        //     stateRef: 'user-management'
        //   }, {
        //     title: '角色管理',
        //     stateRef: 'role-management'
        //   }, {
        //     title: '菜单管理',
        //     stateRef: 'menu-management'
        //   }]
        // });

        // baSidebarServiceProvider.addStaticItem({
        //   title: '日志告警',
        //   icon: 'fa fa-bell',
        //   subMenu: [{
        //     title: '告警汇总',
        //     stateRef: 'tracker'
        //   }, {
        //     title: '告警信息',
        //     stateRef: 'alarm-result'
        //   }, {
        //     title: '告警规则',
        //     stateRef: 'alarm-rule'
        //   }, {
        //     title: '告警等级',
        //     stateRef: 'alarm-level'
        //   }]
        // });

        // baSidebarServiceProvider.addStaticItem({
        //   title: '平台运维',
        //   icon: 'ion-settings',
        //   subMenu: [{
        //     title: 'agent监控',
        //     stateRef: 'agent-monitor'
        //   }, {
        //     title: 'spark监控',
        //     stateRef: 'user-management'
        //   }]
        // });

        // baSidebarServiceProvider.addStaticItem({
        //   title: '性能监控',
        //   icon: 'ion-android-laptop',
        //   subMenu: [{
        //     title: '性能数据查询',
        //     stateRef: 'user-management'
        //   }]
        // });

        // baSidebarServiceProvider.addStaticItem({
        //   title: '平台运维',
        //   icon: 'ion-settings',
        //   subMenu: [{
        //     title: 'agent监控',
        //     stateRef: 'agent-monitor'
        //   }, {
        //     title: 'spark监控',
        //     stateRef: 'spark-monitor'
        //   }, {
        //     title: 'es监控',
        //     stateRef: 'es-monitor'
        //   }]
        // });

        //
        // baSidebarServiceProvider.addStaticItem({
        //   title: '日志告警',
        //   icon: 'ion-gear-a',
        //   subMenu: [{
        //     title: '告警汇总',
        //     fixedHref: '404.html'
        //   }, {
        //     title: '告警信息',
        //     fixedHref: '404.html',
        //     blank: true
        //   }, {
        //     title: '告警规则',
        //     fixedHref: '404.html'
        //   }]
        // });
        //
        // baSidebarServiceProvider.addStaticItem({
        //   title: '系统管理',
        //   icon: 'ion-gear-a',
        //   subMenu: [{
        //     title: '用户管理',
        //     fixedHref: '404.html'
        //   }, {
        //     title: '菜单管理',
        //     fixedHref: '404.html',
        //     blank: true
        //   }, {
        //     title: '角色管理',
        //     fixedHref: '404.html'
        //   }]
        // });
        //
        // baSidebarServiceProvider.addStaticItem({
        //   title: '自定义展现',
        //   icon: 'ion-gear-a',
        //   subMenu: [{
        //     title: '历史dashboard',
        //     fixedHref: '404.html'
        //   }, {
        //     title: '编辑dashboard',
        //     fixedHref: '404.html',
        //     blank: true
        //   }]
        // });
    }

})();