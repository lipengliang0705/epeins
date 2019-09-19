(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-host')
        .controller('AgentHostDeleteController',AgentHostDeleteController);

    AgentHostDeleteController.$inject = ['$uibModalInstance', 'entity', 'AgentHost', 'toastr'];

    function AgentHostDeleteController($uibModalInstance, entity, AgentHost, toastr) {
        var vm = this;

        vm.agentHost = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            AgentHost.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                }, 
                function (e) {
                    console.log(e);         
                    if(e.status==500 && e.data.detail.indexOf("CONSTRAINT")>-1){ 
                        toastr.error('', vm.agentHost.name+ ' 目标主机正在使用中，无法删除！');
                       
                        $uibModalInstance.close(true);
                    }  
                }
            );
        }
    }
})();
