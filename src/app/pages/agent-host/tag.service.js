(function() {
    'use strict';
    angular
        .module('LoginsightUiApp.page.agent-host')
        .factory('Tag', Tag);

    Tag.$inject = ['$resource'];

    function Tag($resource) {
        var resourceUrl = 'api/tags/:id';
        var getTagsAliasUrl = "api/tags-alias/:name"

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data); 
                    }
                    return data;
                }
            },
            'update': { method:'PUT' },
            'getTagsAlias': {method: 'GET', 'url': getTagsAliasUrl, isArray: true}
        });
    }
})();
