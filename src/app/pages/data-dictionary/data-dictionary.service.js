(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.data-dictionary')
        .factory('DataDictionaryService', DataDictionaryService);

    DataDictionaryService.$inject = ['$resource', 'DateUtils'];

    function DataDictionaryService ($resource, DateUtils) {
        var resourceUrl =  'api/dictionary-info';


        return $resource(resourceUrl, {}, {
            'query': { method: 'GET',url: resourceUrl+'/all', isArray: true},
            'save': {
                method: 'POST',
                url: resourceUrl+'/add',
            },
            'update': {
                method: 'PUT',
                url: resourceUrl+'/update',
            },
            'delete': {
                method: 'DELETE',
                url: resourceUrl+'/delete/:id',
            },
        });
    }
})();
