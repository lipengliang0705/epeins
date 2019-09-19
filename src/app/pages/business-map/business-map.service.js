(function () {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.business-map');
    app.factory('BusinessMapService', BusinessMapService);
    BusinessMapService.$inject = ['$resource'];

    function BusinessMapService($resource) {
        return $resource('', {}, {
           
        })
    }
})();