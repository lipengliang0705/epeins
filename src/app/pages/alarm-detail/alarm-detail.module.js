(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-detail',[])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider
        .state('alarm-detail', { 
            
            url: '/alarm-detail/{type}&{detailId}',
            templateUrl: 'app/pages/alarm-detail/alarm-detail.html',
            controller: 'AlarmDetailController',
            controllerAs: 'vm',
            data: {
                authorities: ['ROLE_ADMIN', 'ROLE_USER'],
                pageTitle: 'AlarmDetail'
            },
            
            resolve: {
                // entity: ['$stateParams', 'AlarmRule', function($stateParams, AlarmRule) {
                //     return AlarmRule.get({id : $stateParams.id}).$promise;
                // }],
                // previousState: ["$state", function ($state) {
                //     var currentStateData = {
                //         name: $state.current.name || 'alarm-detail',
                //         params: $state.params,
                //         url: $state.href($state.current.name, $state.params)
                //     };
                //     return currentStateData;
                // }]
            }
        })
        .state('alarm-detail.delete', {
            
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-detail/alarm-detail-delete-dialog.html',
                    controller: 'AlarmDetailDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['AlarmResult', function(AlarmResult) {
                            return AlarmResult.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('alarm-detail', null, { reload: 'alarm-detail' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('alarm-info', { 
            
            url: '/alarm-info',
            templateUrl: 'app/pages/alarm-detail/alarm-info.html',
            controller: 'AlarmInfoController',
            controllerAs: 'vm',
            data: {
                authorities: ['ROLE_ADMIN', 'ROLE_USER'],
                pageTitle: 'AlarmInfo'
            },
           
            resolve: { 
            }
        });
    }

})();
