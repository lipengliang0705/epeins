(function () {
    'use strict';
    /**
     * 门户首页路由
     * Author：Veiss Date：2019/8/19
     */
    var app = angular.module('LoginsightUiApp.page.business-map');
    app.config(stateConfig);

    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {
        $stateProvider.state('business-map', {
            url: '/business-map',
            templateUrl: 'app/pages/business-map/business-map.html',
            controller: 'BusinessMapController',
            controllerAs: 'vm',
            titile: '业务网点'
        })
    }
})();