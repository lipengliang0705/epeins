(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-rule')
        .controller('AlarmRuleDeleteController',AlarmRuleDeleteController);

    AlarmRuleDeleteController.$inject = ['$uibModalInstance', 'entity', 'AlarmRule', 'toastr'];

    function AlarmRuleDeleteController($uibModalInstance, entity, AlarmRule, toastr) {
        var vm = this;

        vm.alarmRule = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            AlarmRule.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                }, 
                function (e) {
                    console.log(e);         
                    if(e.status==500 && e.data.detail.toUpperCase().indexOf("CONSTRAINT")>-1){ 
                        toastr.error('', vm.alarmRule.name+ ' 告警规则正在使用中，无法删除！');
                        $uibModalInstance.close(true);
                    }  
                }
            );
        }
    }
})();
