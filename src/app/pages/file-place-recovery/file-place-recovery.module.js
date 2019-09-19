(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.file-place-recovery', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('file-place-recovery', {
            url: '/file-place-recovery',
            templateUrl: 'app/pages/file-place-recovery/file-place-recovery.html',
            controller: 'FilePlaceRecoveryController',
            controllerAs: 'vm',
            resolve: {
            }
        });
    }

})();
