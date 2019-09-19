(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-rule')
        .controller('AgentRuleBatchController',AgentRuleBatchController);

    AgentRuleBatchController.$inject = ['$uibModalInstance', 'AgentRule', 'entity'];

    function AgentRuleBatchController($uibModalInstance, AgentRule, entity) {
        var vm = this;
        vm.hosts = entity.hosts;
        vm.clear = clear;
        vm.retryHost = [];
        vm.batchStatus = entity.type;
        vm.method = {
            start: batchStart,
            stop: batchStop
        };
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
        function batchStart (id) {
            _.forEach(vm.retryHost.length ? vm.retryHost : vm.hosts, function (entity, index) {
            vm.retryHost = [];
            vm.hosts[index].returnMsg = "启动中...";
            AgentRule.startBatchAgentRules([ entity.id], function (status){
                vm.hosts[index].successful = status[0].successful;
                vm.hosts[index].returnMsg = status[0].returnMsg;
                if(!status[0].successful) {
                    // 记录失败的主机
                    vm.retryHost.push(entity);
                }
                console.log(vm.hosts, 'vm.hosts');
                    // $uibModalInstance.close(true);
                });
            })
        }
        function batchStop (id) {
            _.forEach(vm.retryHost.length ? vm.retryHost : vm.hosts, function (entity, index) {
            vm.retryHost = [];
            vm.hosts[index].returnMsg = "启动中...";
            AgentRule.stopBatchAgentRules([ entity.id], function (status){
                vm.hosts[index].successful = status[0].successful;
                vm.hosts[index].returnMsg = status[0].returnMsg;
                if(!status[0].successful) {
                    // 记录失败的主机
                    vm.retryHost.push(entity);
                }
                console.log(vm.hosts, 'vm.hosts');
                    // $uibModalInstance.close(true);
                });
            })
        }
    }
})();
