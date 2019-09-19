(function() {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.medium-manage');
    app.config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('medium-manage', {
                url: '/medium-manage',
                templateUrl: 'app/pages/medium-manage/medium-manage.html',
                controller: 'MediumManageController',
                controllerAs: 'vm',
                title: "介质管理配置"
            });
    }
})();