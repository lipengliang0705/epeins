(function () {
    'use strict';
    /**
     * @ 自定义报表管理
     * Author:Veiss Date:2019/8/23
     *  */
    var app = angular.module('LoginsightUiApp.page.report-management');
    app.factory('reportManagementService',reportManagementService);

    reportManagementService.$inject = ['$resource'];

    function reportManagementService($resource){
        return $resource('', {}, {
            // 获取全部的report
            'getAllData': {
                url: 'api/getAllData',
                method: 'GET',
                isArray: true
            },

            // 获取uid
            'getPublicUid': {
                url: 'api/getPublicUid/:id',
                method: 'GET'
            }
        })
    }
})();
