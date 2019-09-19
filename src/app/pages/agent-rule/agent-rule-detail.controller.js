(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-rule')
        .controller('AgentRuleDetailController', AgentRuleDetailController);

    AgentRuleDetailController.$inject = ['$scope', '$rootScope', '$stateParams', '$uibModalInstance', 'entity', 'AgentRule', 'DataSource', 'AgentHost', 'Category'];

    function AgentRuleDetailController($scope, $rootScope, $stateParams, $uibModalInstance, entity, AgentRule, DataSource, AgentHost, Category) {
        var vm = this;

        vm.agentRule = entity;
        // vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('LoginsightUiApp.page.agent-rule:agentRuleUpdate', function(event, result) {
            vm.agentRule = result;
           
        });
        $scope.$on('$destroy', unsubscribe);

        vm.clear = clear;
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
        
    }
})();
