(function () {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.report-management');
    app.config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('report-management', {
                url: '/report-management',
                templateUrl: 'app/pages/report-management/report-management.html',
                controller: 'reportManagementController',
                controllerAs: 'vm',
                title: "自定义报表管理"
            })

            .state('report-management-detalis', {
                url: '/report-management-detalis?url',
                templateUrl: 'app/pages/report-management/details/details.html',
                controller: 'reportManagementDetailsController',
                controllerAs: 'vm',
            })
            ;
    }
})();