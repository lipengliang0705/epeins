(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-rule')
        .controller('AgentRuleMetricBeatDialogController', AgentRuleMetricBeatDialogController);

    AgentRuleMetricBeatDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'AgentRule', 'DataSource', 'AgentHost', 'Category'];

    function AgentRuleMetricBeatDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, AgentRule, DataSource, AgentHost, Category) {
        var vm = this;

        vm.agentRule = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.datasources = DataSource.query();
        vm.agenthosts = AgentHost.query();
        vm.categories = Category.query(); 

        vm.type = {};
        vm.types = {'system':['cpu','load','filesystem','memory','process','core','diskio','fsstat','network','socket'],
                    'apache':['cpu','load'],
                    'docker':['memory','process','core'],
                    'kafka':['core','diskio','fsstat','network','socket'],
                    'mysql':['status'],//['filesystem','memory','process','core','diskio'],
                    'ngnix':['stubstatus'],//['process','core','diskio','fsstat','network','socket'],  
                    'redis':['info','keyspace'],//['load','memory','process','core','fsstat','network','socket'], 
                    'zookeeper':['mntr'],//['memory','core','diskio','fsstat','network','socket'], 
                    'postgresql':['cpu','load','filesystem','memory','core','diskio','fsstat','network','socket'],                    
                    'mogodb':['socket']
                    };


        vm.agentRule.ruleType = vm.agentRule.ruleType || 'METRICBEAT';
        vm.agentRule.sourceType = vm.agentRule.sourceType || 'SYSTEM';  
        vm.agentRule.status==1 ? vm.agentRule.status=1 : vm.agentRule.status=0;

        vm.agentRule.conf = angular.fromJson(vm.agentRule.conf || {});
        vm.agentRule.conf.interval = vm.agentRule.conf.interval || "10";
        // vm.agentRule.conf.type = {"cpu":true,"load":false,"filesystem":false,"memory":false,"process":false,"core":false,"diskio":true,"fsstat":false,"network":false,"socket":false};
        if(vm.agentRule.conf.type){  
            vm.type = vm.agentRule.conf.type;     
        }else{     
            vm.type = {}; 
            _.forEach(vm.types[vm.agentRule.sourceType.toLowerCase()], function(v){  
                _.set(vm.type, v, false);
            });             
        } 

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            var agentRule = vm.agentRule;    
            // var types = _.filter(_.map(vm.type, function(k,v){ console.log(k,v); if(k)return v })); 
            agentRule.conf.type = vm.type; //types;
            agentRule.conf = angular.toJson(agentRule.conf); 
            if(agentRule.agentHost && typeof agentRule.agentHost.loginInfo != "string") {
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
            $scope.$emit('LoginsightUiApp.page.alarm-rule:agentRule', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
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
        vm.setActions =
          {
            setCurrent: function (param, type) {
                vm.setList.current = param;
                vm.agentRule.sourceType = type.toUpperCase();
                vm.type = {};
                _.forEach(vm.types[type.toLowerCase()], function(v){
                    _.set(vm.type, v, false);
                }); 
            }
          }


    }
})();
