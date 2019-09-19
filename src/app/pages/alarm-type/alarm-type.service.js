(function(){
    angular.module('LoginsightUiApp.page.alarm-type')
        .factory('AlarmTypeService',AlarmTypeService);

    AlarmTypeService.$inject = ['$resource'];

    function AlarmTypeService ($resource) {
        var resourceUrl =  '/api/contact';


        return $resource(resourceUrl, {}, {
            'query': {
                method: 'GET',
                url:resourceUrl+'/contact-all',
                isArray: true,
                transformResponse: function (data) {
                    console.log(data);
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'create':{method:'POST',url:resourceUrl+'/contact-create'},
            'info':{method:'GET',url:resourceUrl+'/contact-info/:id'},
            'delete':{method:'GET',url:resourceUrl+'/contact-delete/:id'},
            'update':{method:'PUT',url:resourceUrl+'/contact-update'},
        });

        // get: all
        // /api/contact/contact-all
        //
        // post: create
        // /api/contact/contact-create
        //
        // get: byID
        // /api/contact/contact-info/{id}
        //
        // get  Delete:
        //     /api/contact/contact-delete/{id}
        //
        // put: update
        // api/contact/contact-update
    }
})()