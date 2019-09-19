(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-rule')
        .controller('AgentRuleDeleteController',AgentRuleDeleteController);

    AgentRuleDeleteController.$inject = ['$uibModalInstance', 'entity', 'AgentRule'];

    function AgentRuleDeleteController($uibModalInstance, entity, AgentRule) {
        var vm = this;

        vm.agentRule = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            AgentRule.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
