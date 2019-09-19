(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-level')
        .factory('AlarmLevelSearch', AlarmLevelSearch);

    AlarmLevelSearch.$inject = ['$resource'];

    function AlarmLevelSearch($resource) {
        var resourceUrl =  'api/_search/alarm-levels/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
