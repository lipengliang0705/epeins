'use strict';

angular.module('LoginsightUiApp', [
    'ngAnimate',
    'ui.bootstrap',
    'ui.sortable',
    'ui.router',
    'ngTouch',
    'toastr',
    'smart-table',
    "xeditable",
    'ui.slimscroll',
    'ngJsTree',
    'angular-progress-button-styles',
    'ngCacheBuster',
    'ngStorage',
    'ngResource',
    'ngAside',
    'angularSpectrumColorpicker',
    'mu-widgets',
    'mu-directives',
    'widgetGrid',
    'angular-gridster2',
    'tabs',
    'bootstrap-tagsinput',
    'ngSanitize',
    'ngToast',
    'gridster',
    // 表单验证
    'angularValidator',
    'ui.bootstrap.datetimepicker',
    // 'datetimepicker',

    'LoginsightUiApp.theme',
    'LoginsightUiApp.pages',
    'ui.select'
])
    .value('WIDGET_PARMS', {})
    .value('DATA_DICTIONARY', {list:[]})
    .config(['uiSelectConfig', function (uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
        uiSelectConfig.resetSearchInput = true;
        uiSelectConfig.appendToBody = true;
    }])
    .run(['$rootScope', '$log', 'baSidebarService', '$location', '$uibModal', 'DataDictionaryService', 'DATA_DICTIONARY', function ($rootScope, $log, baSidebarService, $location, $uibModal, DataDictionaryService, DATA_DICTIONARY) {

        init();

        function init() {
            getDataDictionaryList();
        }

        function getDataDictionaryList() {
            DataDictionaryService.query(function (res) {
                var _res = res.filter(function (item) {
                    return item.status == 0;
                })
                DATA_DICTIONARY.list = _res;
            })
        }


        // $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //     // $rootScope.title = toState.title;//在相关的路由中添加title
        //
        //
        //     baSidebarService.getMenuItems().then(function (item) {
        //         var menuItems = item;
        //         // console.log('可访问菜单', menuItems);
        //
        //         var subMenu = ['log-data-dashboard','password'];
        //
        //         angular.forEach(menuItems, function (item) {
        //             angular.forEach(item.subMenu, function (subItem) {
        //                 subMenu.push(subItem.stateRef);
        //             });
        //         });
        //
        //         console.log('可访问菜单',subMenu);
        //         console.log(toState);
        //
        //         var flag = false;
        //
        //         angular.forEach(subMenu, function (item) {
        //             if (toState.name.indexOf(item) > -1 ) {
        //                 flag = true;
        //                 return;
        //             }
        //         })
        //
        //         if (!flag) {
        //             showModal();
        //         }
        //
        //         function showModal() {
        //             $uibModal.open({
        //                 template: '<form>\n' +
        //                     '    <div class="modal-header">\n' +
        //                     '        <button class="close" ng-click="cancel()">×</button>\n' +
        //                     '        <h4 class="modal-title">提示</h4>\n' +
        //                     '    </div>\n' +
        //                     '    <div class="modal-body">\n' +
        //                     '        <div action="">\n' +
        //                     '            <p>您没有权限访问该页面！</p>\n' +
        //                     '        </div>\n' +
        //                     '    </div>\n' +
        //                     '    <div class="modal-footer">\n' +
        //                     '\n' +
        //                     '        <button class="btn btn-primary" ng-click="submit()">\n' +
        //                     '            <span>确认</span>\n' +
        //                     '        </button>\n' +
        //                     '    </div>\n' +
        //                     '</form>',
        //                 controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        //                     $scope.submit = function () {
        //                         $uibModalInstance.dismiss('cancel');
        //                         console.log('ok');
        //                         console.log('无权限');
        //                         $location.path('');
        //                     }
        //
        //                     $scope.cancel = function () {
        //                         $uibModalInstance.dismiss('cancel');
        //                         $location.path('');
        //                     }
        //                 }],
        //                 size: 'sm',
        //                 backdrop: 'static',
        //             })
        //         }
        //
        //     });
        // });
    }]);
