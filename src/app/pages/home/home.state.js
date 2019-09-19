(function () {
    'use strict';
    /**
     * 门户首页路由
     * Author：Veiss Date：2019/8/19
     */
    var app = angular.module('LoginsightUiApp.page.home');
    app.config(stateConfig);

    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'app/pages/home/home.html',
            controller: 'HomeController',
            controllerAs: 'vm',
            titile: '首页'
        })
    }
})();