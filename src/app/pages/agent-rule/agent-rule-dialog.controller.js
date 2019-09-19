(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-rule')
        .controller('AgentRuleDialogController', AgentRuleDialogController);

    AgentRuleDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'AgentRule', 'DataSource', 'AgentHost', 'Category'];

    function AgentRuleDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, AgentRule, DataSource, AgentHost, Category) {
        var vm = this;

        vm.agentRule = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.datasources = DataSource.query();
        vm.agenthosts = AgentHost.query();
        vm.categories = Category.query();
        // vm.getAgentRuleByTemplet = getAgentRuleByTemplet;

        vm.agentRule.status==1 ? vm.agentRule.status=1 : vm.agentRule.status=0;

        vm.agentRule.conf = angular.fromJson(vm.agentRule.conf || {});

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            var agentRule = vm.agentRule;
            agentRule.conf = angular.toJson(agentRule.conf);
            // agentRule.agentHost.loginInfo = angular.toJson(agentRule.agentHost.loginInfo);
            if(typeof agentRule.agentHost.loginInfo != "string") {
                agentRule.agentHost.loginInfo = angular.toJson(agentRule.agentHost.loginInfo);
            }
            console.log("vm.agentRule--------------", agentRule);
            if (agentRule.id !== null) {
                AgentRule.update(agentRule, onSaveSuccess, onSaveError);
            } else {
                AgentRule.save(agentRule, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('LoginsightUiApp.page.alarm-rule:agentRuleUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.uibModalInstanceClose = uibModalInstanceClose;
        function uibModalInstanceClose(){
            $uibModalInstance.close(true);
        }


        // vm.selecttemplate = vm.agentRule.id!=null?true:false;
        // vm.selecttemplateName = vm.agentRule.id!=null?"Flume":"";
        // function getAgentRuleByTemplet(name){ 
        //     if(name){ 
        //         vm.selecttemplate = true; 
        //         vm.selecttemplateName = name;
        //     }

        // }


        vm.datePickerOpenStatus.createdTime = false;
        vm.datePickerOpenStatus.modifiedTime = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }




    }
})();
