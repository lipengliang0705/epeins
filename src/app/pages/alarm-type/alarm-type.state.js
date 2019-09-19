(function() {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.alarm-type');
    app.config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('alarm-type', {
                url: '/alarm-type',
                templateUrl: 'app/pages/alarm-type/alarm-type.html',
                controller: 'AlarmTypeController',
                controllerAs: 'vm',
                title: "告警方式配置"
            });
    }
})();