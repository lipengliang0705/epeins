(function () {
    'use strict';
    angular
        .module('LoginsightUiApp.page.audit')
        .factory('AuditService', AuditService);

    AuditService.$inject = ['$resource', 'DateUtils'];

    function AuditService($resource, DateUtils) {
        var resourceUrl = 'api/dictionary-info';
        var gatewayUrl = '/api/fortress';//堡垒机和登录服务器


        return $resource(resourceUrl, {}, {
            'query': {method: 'GET', url: resourceUrl + '/all', isArray: true},
            'save': {
                method: 'POST',
                url: resourceUrl + '/add',
            },
            'update': {
                method: 'PUT',
                url: resourceUrl + '/update',
            },
            'addEs': {
                method: "POST",
                url: 'http://es5x-node01.stage.dev.pi:9255/bup_hkzfapp02_wtmp*/bup_hkzfapp02_wtmp'
            },
            'gatewayAll':{
                url:gatewayUrl+'/fortress-all',
                method:'GET',
                isArray: true
            },
            'gatewayCreate':{
                url:gatewayUrl+'/fortress-create',
                method:'POST',
            },
            'gatewayInfo':{
                url:gatewayUrl+'/fortress-infos/:id',
                method:'GET',
            },
            'gatewayDelete':{
                url:gatewayUrl+'/fortress-delete/:id',
                method:'GET',
            },
            'gatewayUpdate':{
                url:gatewayUrl+'/fortress-infos',
                method:'PUT',
            },
        });
    }
})();
