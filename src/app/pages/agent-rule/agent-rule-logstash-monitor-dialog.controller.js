(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-rule')
        .controller('AgentRuleLogStashMonitorDialogController', AgentRuleLogStashMonitorDialogController);

    AgentRuleLogStashMonitorDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'AgentRule', 'DataSource', 'AgentHost', 'Category'];

    function AgentRuleLogStashMonitorDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, AgentRule, DataSource, AgentHost, Category) {
        var vm = this;

        vm.agentRule = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.datasources = DataSource.query();
        vm.agenthosts = AgentHost.query();
        vm.categories = Category.query();
        vm.getAgentRuleByTemplet = getAgentRuleByTemplet;

        vm.agentRule.status==1 ? vm.agentRule.status=1 : vm.agentRule.status=0;

        // 默认类型为flume
        if(vm.agentRule.ruleType == undefined) vm.agentRule.ruleType="LogStash";
        // 默认字符集 utf-8
        if(vm.agentRule.conf == null) {
            vm.agentRule.conf = {};
             vm.agentRule.conf.charSet = "utf-8";
        }

        vm.agentRule.conf = angular.fromJson(vm.agentRule.conf || {});

        vm.agentRule.conf.deserializer = vm.agentRule.conf.deserializer || 'line';
        vm.agentRule.conf.isSkipToEnd = vm.agentRule.conf.isSkipToEnd || '1';
        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            var _agentRule = angular.copy(vm.agentRule);            
            if(_agentRule.sourceType=='spool'){
                if(_agentRule.conf.tailFile) _agentRule.conf.tailFile = '';
                if(_agentRule.conf.isSkipToEnd) delete _agentRule.conf['isSkipToEnd'];
            }else if(_agentRule.sourceType=='tail' && _agentRule.conf.spoolDir){
                _agentRule.conf.spoolDir = '';
            }
            _agentRule.conf = angular.toJson(_agentRule.conf);
            // agentRule.agentHost.loginInfo = angular.toJson(agentRule.agentHost.loginInfo);
            if(typeof _agentRule.agentHost.loginInfo != "string") {
                _agentRule.agentHost.loginInfo = angular.toJson(_agentRule.agentHost.loginInfo);
            }
            if (_agentRule.id !== null) {
                AgentRule.update(_agentRule, onSaveSuccess, onSaveError);
            } else {
                AgentRule.save(_agentRule, onSaveSuccess, onSaveError);
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


        vm.selecttemplate = vm.agentRule.id!=null?true:false;
        vm.selecttemplateName = vm.agentRule.id!=null?"LogStash":"";
        function getAgentRuleByTemplet(name){
            if(name){
                vm.selecttemplate = true;
                vm.selecttemplateName = name;
            }

        }


        vm.datePickerOpenStatus.createdTime = false;
        vm.datePickerOpenStatus.modifiedTime = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }

       // tab
        vm.setList = {
            current: "1" 
        };
        vm.setList2 = {
            current: "1" 
        };
       
        vm.setActions =
          {
            setCurrent: function (param) {
             vm.setList.current = param;
            }
          }
        vm.setActions2 =
          {
            setCurrent: function (param) {
             vm.setList2.current = param;
            }
          }
       


    }
})();
