(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.logSearch', ['ui.select', 'ngSanitize', 'LoginsightUiApp.page.event-rule', 'daterangepicker', 'LoginsightUiApp', 'ngTable', 'tm.pagination', 'angular-echarts'])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('log-search', {
                url: '/log-search',
                templateUrl: 'app/pages/log-search/log-search-main.html',
                controller: 'logSearchCtrl',
                controllerAs: 'vm',
                title: "日志查询",
                sidebarMeta: {
                    order: 800,
                }
            })
            .state('log-search-new', {
                url: '/log-search-new?type',
                templateUrl: 'app/pages/log-search/log-search-main-new.html',
                controller: 'logSearchNewCtrl',
                controllerAs: 'vm',
                title: "日志查询",
                sidebarMeta: {
                    order: 800,
                }
            })
            .state('log-search-dsl', {
                url: '/log-search-dsl?type',
                templateUrl: 'app/pages/log-search/log-search-main-dsl.html',
                controller: 'logSearchDslCtrl',
                controllerAs: 'vm',
                title: "日志查询",
                sidebarMeta: {
                    order: 800,
                }
            })
            .state('log-context', {
                parent: 'log-search-dsl',
                url: '/log-context',
                params: {
                    'filename': '',
                    'filepath': '',
                    'linenum': '',
                    'hostname': '',
                    'timestamp': '',
                    'event': '',
                    'event_name': '',
                    'index': '',
                    'type': []
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'LogSearchContext'
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/pages/log-search/log-search-main-context.html',
                        controller: 'logSearchMainContextCtrl',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            urlParams: $stateParams
                        }
                    }).result.then(function () {
                        $state.go('log-search', null, { reload: 'log-search' });
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('log-download', {
                parent: 'log-search-dsl',
                url: '/log-download',
                params: {
                    "queryParams": '',
                    "appInfo": ''
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'LogSearchContext'
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/pages/log-search/log-search-main-download.html',
                        controller: 'logSearchMainDownloadContextCtrl',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            data: $stateParams
                        }
                    }).result.then(function () {
                        $state.go('log-search', null, { reload: 'log-search' });
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('log-saveAs', {
                parent: 'log-search-dsl',
                url: '/log-saveAs',
                params: {
                    data: {}
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/pages/log-search/log-search-main-saveAs.html',
                        controller: 'logSearchMainSaveAsCtrl',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            data: $stateParams
                        }
                    }).result.then(function () {
                        $state.go('^', null, { reload: false });
                    }, function () {
                        $state.go('^');
                    })
                }]
            })
            .state('log-data-dashboard', {
                parent: 'log-search-dsl',
                url: '/log-data-dashboard',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    console.log('$stateParams', $stateParams);
                    $uibModal.open({
                        templateUrl: 'app/pages/data-dashboard/data-dashboard.html',
                        controller: 'DataDashboardCtrl',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            // data: [
                            //     { 'name': 'sql_spl' },
                            //     { 'name': 'FORM_LUCENE' }
                            // { 'type': 'sql_spl' }
                            // ]
                            data: function () {
                                return [
                                    { 'type': 'sql_spl' },
                                    { 'type': 'FORM_LUCENE' }
                                ]
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', null, { reload: true });
                    }, function () {
                        $state.go('^');
                    })
                }]
            })

            .state('log-main', {
                url: '/log-main',
                templateUrl: 'app/pages/log-search/log-main/log-main.html',
                controller: 'logSearchMainCtrl',
                controllerAs: 'vm',
                title: "选择业务系统",
                sidebarMeta: {
                    order: 800,
                }
            });
    }

})();