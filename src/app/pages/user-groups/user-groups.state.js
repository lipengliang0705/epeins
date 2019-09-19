(function () {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.user-groups');
    app.config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('user-groups', {
                url: '/user-groups',
                templateUrl: 'app/pages/user-groups/user-groups.html',
                controller: 'userGroupsController',
                controllerAs: 'vm',
                title: "用户分组"
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