(function () {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.resoures-groups');
    app.factory("UserGroupsService", UserGroupsService);
    UserGroupsService.$inject = ['$resource'];

    function UserGroupsService($resource) {
        var resourceUrl = '/api/users-group/:id';

        var userStatusUrl = 'api/users/upstatus';
        return $resource(resourceUrl, {}, {
            //查询所有仪表盘
            'query': {
                method: 'GET',
                isArray: true
            },
            'save': {
                method: 'POST',
            },
            'update': {
                method: 'PUT',
            },
            'delete': {
                method: 'DELETE',
            },
            'info': {
                method: 'GET',
            },

            'updateUserStatus': {
                method: 'PUT',
                url: userStatusUrl,
                transformResponse: function(data, headers){

                   console.log(data);
                    return data;
                }
            }

        });
    }
})();