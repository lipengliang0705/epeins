(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent')
        .controller('AgentDetailController', AgentDetailController);

    AgentDetailController.$inject = ['$scope', '$rootScope', '$stateParams', '$uibModalInstance', 'entity', 'Agent', 'AgentHost'];

    function AgentDetailController($scope, $rootScope, $stateParams, $uibModalInstance, entity, Agent, AgentHost) {
        var vm = this;

        vm.agent = entity;
        // vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('LoginsightUiApp.page.agent:agentUpdate', function(event, result) {
            vm.agent = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.clear = clear;
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();
