(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent')
        .controller('AgentDialogController', AgentDialogController);

    AgentDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Agent', 'AgentHost'];

    function AgentDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Agent, AgentHost) {
        var vm = this;

        vm.agent = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.agenthosts = AgentHost.query();

        vm.agent.status ? vm.agent.status=1 : vm.agent.status=0;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.agent.id !== null) {
                Agent.update(vm.agent, onSaveSuccess, onSaveError);
            } else {
                Agent.save(vm.agent, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('LoginsightUiApp.page.agent:agentUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.modifiedTime = false;
        vm.datePickerOpenStatus.createdTime = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
