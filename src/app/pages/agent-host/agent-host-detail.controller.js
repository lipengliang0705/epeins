(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-host')
        .controller('AgentHostDetailController', AgentHostDetailController);

    AgentHostDetailController.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'entity', 'AgentHost', 'AgentRule', 'Agent'];

    function AgentHostDetailController($scope, $rootScope, $uibModalInstance, entity, AgentHost, AgentRule, Agent) {
        var vm = this;

        vm.agentHost = entity;
        // vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('LoginsightUiApp.page.agent-host:agentHostUpdate', function(event, result) {
            vm.agentHost = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.clear = clear;
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();
