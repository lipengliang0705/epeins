(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.data-dictionary', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('data-dictionary', {
            url: '/data-dictionary',
            templateUrl: 'app/pages/data-dictionary/data-dictionary.html',
            controller: 'DataDictionaryController',
            controllerAs: 'vm',
            resolve: {
            }
        });
    }

})();
