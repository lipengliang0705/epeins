(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-level')
        .controller('AlarmLevelDialogController', AlarmLevelDialogController);

    AlarmLevelDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'AlarmLevel', 'AlarmRule'];

    function AlarmLevelDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, AlarmLevel, AlarmRule) {
        var vm = this;

        vm.alarmLevel = entity;
        vm.clear = clear;
        vm.save = save;
        vm.alarmrules = AlarmRule.query();

        var palette;
        if (vm.alarmLevel.color) {
          var colors = vm.alarmLevel.color;
          palette = _.chunk(colors, 5);
        }
        $scope.colorPicker1 = {
                      showInput: true,
                      showAlpha: false,
                      allowEmpty: true,
                      showPalette: false,
                      preferredFormat: 'hex3',
                      chooseText: "确定",
                      cancelText: "取消",
                      palette: palette };

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.alarmLevel.id !== null) {
                AlarmLevel.update(vm.alarmLevel, onSaveSuccess, onSaveError);
            } else {
                AlarmLevel.save(vm.alarmLevel, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('LoginsightUiApp.page.alarm-level:alarmLevelUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
