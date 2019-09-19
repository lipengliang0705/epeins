(function () {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.resoures-groups');
    app.config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('resoures-groups', {
                url: '/resoures-groups',
                templateUrl: 'app/pages/resoures-groups/resoures-groups.html',
                controller: 'resouresGroupsController',
                controllerAs: 'vm',
                title: "资源分组"
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