/**
 * @author v.lugovksy
 * created on 15.12.2015
 */
(function() {
    'use strict';

    var app = angular.module('LoginsightUiApp.theme.components');
    app.config(toastrLibConfig);

    /** @ngInject */
    function toastrLibConfig(toastrConfig) {
        angular.extend(toastrConfig, {
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            timeOut: 5000,
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body',
            toastClass: 'toast toast-custom',
            templates: {
                toast: 'app/theme/components/toast/toast.html'
            }
        });
    }
})();