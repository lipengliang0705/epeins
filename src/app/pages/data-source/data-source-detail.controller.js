(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.data-source')
        .controller('DataSourceDetailController', DataSourceDetailController);

    DataSourceDetailController.$inject = ['$scope', '$rootScope', '$stateParams', '$uibModalInstance', 'entity', 'DataSource', 'EventRule', 'AgentRule'];

    function DataSourceDetailController($scope, $rootScope, $stateParams, $uibModalInstance, entity, DataSource, EventRule, AgentRule) {
        var vm = this;

        vm.dataSource = entity;
        // vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('LoginsightUiApp.page.data-source:dataSourceUpdate', function(event, result) {
            vm.dataSource = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.clear = clear;
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
        
    }
})();
