(function () {
    'use strict';
    /**
     * @ 知识库路由控制
     * Author:Veiss Date:2019/6/24
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.config(knowledgeBaseState);

    knowledgeBaseState.$inject = ['$stateProvider'];

    function knowledgeBaseState($stateProvider) {
        $stateProvider
            // 查看页面
            .state('knowledge-base', {
                url: '/knowledge-base',     // 路由地址
                templateUrl: 'app/pages/knowledge-base/knowledge-base.html',    //需要加载的html文件地址
                controller: 'knowledgeBaseController',      // 控制器名称
                controllerAs: 'vm',         // 控制器别名，这是一个语法糖
                title: "查看知识库文章"              // title
            })

            // 列表页面
            .state('knowledge-base-list', {
                url: '/knowledge-base-list',
                templateUrl: 'app/pages/knowledge-base/list/list.html',
                controller: 'knowledgeBaseListController',
                controllerAs: 'vm',
                title: "管理"
            })

            // 新建页面
            .state('knowledge-base-add', {
                url: '/knowledge-base-add',
                templateUrl: 'app/pages/knowledge-base/add/add.html',
                controller: 'knowledgeBaseAddController',
                controllerAs: 'vm',
                title: "新建"
            })

            // 编辑页面
            .state('knowledge-base-modify', {
                url: '/knowledge-base-modify?id',
                templateUrl: 'app/pages/knowledge-base/modify/modify.html',
                controller: 'knowledgeBaseModifyController',
                controllerAs: 'vm',
                title: "修改"
            })

            // .state('new-dashboard-detalis', {
            //     url: '/new-dashboard-detalis',
            //     templateUrl: 'app/pages/new-dashboard/details/details.html',
            //     controller: 'newDashboardDetailsController',
            //     controllerAs: 'vm',
            // })

            ;
    }
})();