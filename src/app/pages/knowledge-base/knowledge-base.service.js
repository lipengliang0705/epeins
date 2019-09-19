(function () {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.factory("knowledgeBaseService", knowledgeBaseService);
    knowledgeBaseService.$inject = ['$resource'];

    function knowledgeBaseService($resource) {
        var resourceUrl = 'api/data-dashboards/:id';
        // var resourceUrl = '';
        return $resource(resourceUrl, {}, {
            //查询所有知识库
            'knowledgeBaseInfo': {
                method: 'GET',
                url: '/api/knowledge/knowledge-infos',
                isArray: true
            },
            //根据ID查询知识库
            'checkKnowledgeBase': {
                method: 'GET',
                url: '/api/knowledge/knowledge-infos/:id',
                // isArray: true
            },
            //新增知识库
            'createKnowledgeBase': {
                method: 'POST',
                url: '/api/knowledge/knowledge-create',
                //isArray: true
            },
            //根据ID删除知识库(逻辑删除)
            'deleteKnowledgeBase': {
                method: 'GET',
                url: '/api/knowledge/knowledge-delete/:id',
                //isArray: true
            },
            //修改知识库
            'modifyKnowledgeBase': {
                method: 'PUT',
                url: '/api/knowledge/knowledge-infos',
                //isArray: true
            },
            //点击累积view人数
            'viewKnowledgeBase': {
                method: 'GET',
                url: '/api/knowledge/knowledge-view/:id',
                //isArray: true
            },
            'query': {
                method: 'GET'
            },
            //查询所有知识库
            'checkKnowledgeAll': {
                method: 'POST',
                url: '/api/knowledge/knowledge-all',
                isArray: true
            },
            //根据ID查询知识库分类
            // 'checkkcategory': {
            //     method: 'GET',
            //     url: '/api/kcategory/category-info/:id',
            //     // isArray: true
            // },
            //查询所有知识库分类
            'categoryallInfo': {
                method: 'GET',
                url: '/api/kcategory/category-all',
                isArray: true
            },
            //新增知识库分类
            'createKcategory': {
                method: 'POST',
                url: '/api/kcategory/category-create',
                //isArray: true
            },
            //修改知识库分类
            'modifyCategory': {
                method: 'PUT',
                url: '/api/kcategory/category-update',
                //isArray: true
            },
            //根据ID删除知识库分类(逻辑删除)
            'deleteCategory': {
                method: 'GET',
                url: '/api/kcategory/category-delete/:id',
                //isArray: true
            },
            // 当前用户登录信息
            'account': {
                method: 'GET',
                url: '/api/account'
            }
        });
    }
})();
