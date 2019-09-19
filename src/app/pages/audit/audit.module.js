(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.audit', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('audit', {
            url: '/audit',
            templateUrl: 'app/pages/audit/audit.html',
            controller: 'AuditController',
            controllerAs: 'vm',
            resolve: {
            }
        });
    }

})();
