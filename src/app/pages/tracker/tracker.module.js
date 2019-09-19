(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.tracker',['LoginsightUiApp.page.alarm-result'])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('tracker', {
           
            url: '/tracker',
            templateUrl: 'app/pages/tracker/tracker.html',
            controller: 'JhiTrackerController',
            controllerAs: 'vm',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'Real-time user activities'
            },
            resolve: {
            },
            // onEnter: ['JhiTrackerService', function(JhiTrackerService) {
            //     JhiTrackerService.subscribe();
            // }],
            // onExit: ['JhiTrackerService', function(JhiTrackerService) {
            //     JhiTrackerService.unsubscribe();
            // }]
        })
        .state('tracker-statistics-view', {
            parent: 'tracker',
            url: '/tracker-statistics-view/{id}',
            data: {
                authorities: ['ROLE_USER']
                
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                 
                $uibModal.open({
                    templateUrl: 'app/pages/tracker/tracker-statistics-view-dialog.html',
                    controller: 'TrackerStatisticController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        // entity: [ 'AlarmResult', function( AlarmResult) {
                            
                        //     // console.log('1---', AlarmResult);

                        //     return AlarmResult.get({id : $stateParams.id}).$promise;
                        // }],
                        // previousState: ["$state", function ($state) {
                        //     var currentStateData = {
                        //         name: $state.current.name || 'tracker',
                        //         params: $state.params,
                        //         url: $state.href($state.current.name, $state.params)
                        //     };
                            
                        //     //console.log('currentStateData',currentStateData);
                        //      return currentStateData;
                        // }]
                    }
                }).result.then(function() {
                    $state.go('tracker', null, { reload: 'tracker' });
                }, function() {
                    $state.go('tracker');
                })
            }]
        })
        .state('tracker-detail', {
            parent: 'tracker',
            url: '/tracker-detail/{id}',
            data: {
                authorities: ['ROLE_USER']
                
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                 
                $uibModal.open({
                    templateUrl: 'app/pages/tracker/tracker-detail.html',
                    controller: 'TrackerDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        // entity: [ 'AlarmResult', function( AlarmResult) {
                            
                        //     // console.log('1---', AlarmResult);

                        //     return AlarmResult.get({id : $stateParams.id}).$promise;
                        // }],
                        // previousState: ["$state", function ($state) {
                        //     var currentStateData = {
                        //         name: $state.current.name || 'tracker',
                        //         params: $state.params,
                        //         url: $state.href($state.current.name, $state.params)
                        //     };
                            
                        //     //console.log('currentStateData',currentStateData);
                        //      return currentStateData;
                        // }]
                    }
                }).result.then(function() {
                    $state.go('tracker', null, { reload: 'tracker' });
                }, function() {
                    $state.go('tracker');
                })
            }]
        })
        .state('tracker.delete', {
            parent: 'tracker',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/tracker/tracker-delete-dialog.html',
                    controller: 'TrackerDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['AlarmResult', function(AlarmResult) {
                            return AlarmResult.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('tracker', null, { reload: 'alarm-result' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
       
    }
})();
