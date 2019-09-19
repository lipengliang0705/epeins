(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-host')
        .controller('AgentHostDeployController',AgentHostDeployController);

    AgentHostDeployController.$inject = ['$uibModalInstance', 'AgentHost', 'entity'];

    function AgentHostDeployController($uibModalInstance, AgentHost, entity) {
        var vm = this;
        vm.hosts = entity.hosts;
        vm.clear = clear;
        vm.confirmDeploy = confirmDeploy;
        vm.retryHost = [];

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDeploy (id) {
            _.forEach(vm.retryHost.length ? vm.retryHost : vm.hosts, function (entity, index) {
            vm.retryHost = [];
            vm.hosts[index].returnMsg = "部署中...";
            AgentHost.batchDeployAgentHost([ entity.id], function (status){
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
