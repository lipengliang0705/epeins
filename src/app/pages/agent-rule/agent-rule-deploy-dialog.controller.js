(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-rule')
        .controller('AgentRuleDeployController',AgentRuleDeployController);

        AgentRuleDeployController.$inject = ['$uibModalInstance', 'AgentRule', 'entity','$scope'];

    function AgentRuleDeployController($uibModalInstance, AgentRule, entity,$scope) {
        var vm = this;
        vm.hosts = entity.hosts;
        vm.clear = clear;
        vm.confirmDeploy = confirmDeploy;
        vm.retryHost = [];
        vm.method = {
            cancel: cancel,
        }
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        function confirmDeploy (id) {
            _.forEach(vm.retryHost.length ? vm.retryHost : vm.hosts, function (entity, index) {
                vm.retryHost = [];
                vm.hosts[index].returnMsg = "部署中...";
                setTimeout(function(e){
                    console.log(index);
                    $scope.$broadcast('deploy-success',index);
                    $scope.$apply(function(){
                        vm.hosts[index].returnMsg='部署成功';
                    });



                },2000);
                // AgentHost.batchDeployAgentHost([ entity.id], function (status){
                //     vm.hosts[index].successful = status[0].successful;
                //     vm.hosts[index].returnMsg = status[0].returnMsg;
                //     if (!status[0].successful) {
                //         // 记录失败的主机
                //         vm.retryHost.push(entity);
                //     }
                //     console.log(vm.hosts, 'vm.hosts');
                //     // $uibModalInstance.close(true);
                // });
            })
        }
    }
})();
