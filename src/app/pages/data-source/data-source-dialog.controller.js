(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.data-source')
        .controller('DataSourceDialogController', DataSourceDialogController);

    DataSourceDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'DataSource', 'EventRule', 'AgentRule'];

    function DataSourceDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, DataSource, EventRule, AgentRule) {
        var vm = this;

        vm.dataSource = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.eventrules = EventRule.query();
        vm.agentrules = AgentRule.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.dataSource.id !== null) {
                DataSource.update(vm.dataSource, onSaveSuccess, onSaveError);
            } else {
                DataSource.save(vm.dataSource, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('LoginsightUiApp.page.data-source:dataSourceUpdate', result);
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
    }
})();
