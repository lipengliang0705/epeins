(function() {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('new-dashboard', {
                url: '/new-dashboard',
                templateUrl: 'app/pages/new-dashboard/new-dashboard.html',
                controller: 'NewDashboardController',
                controllerAs: 'vm',
                title: "仪表盘"
            })
            // 查看详情
            .state('new-dashboard-detalis', {
                url: '/new-dashboard-detalis?id',
                templateUrl: 'app/pages/new-dashboard/details/details.html',
                controller: 'newDashboardDetailsController',
                controllerAs: 'vm',
            });
    }
})();