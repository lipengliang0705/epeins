(function() {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.file-place');
    app.config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('file-place', {
                url: '/file-place',
                templateUrl: 'app/pages/file-place/file-place.html',
                controller: 'filePlaceController',
                controllerAs: 'vm',
                title: "归档管理"
            })
            // 查看详情
            // .state('new-dashboard-detalis', {
            //     url: '/new-dashboard-detalis?id',
            //     templateUrl: 'app/pages/new-dashboard/details/details.html',
            //     controller: 'newDashboardDetailsController',
            //     controllerAs: 'vm',
            // });
    }
})();