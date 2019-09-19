(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.role-management')
        .controller('RoleManagementDetailController', RoleManagementDetailController);

    RoleManagementDetailController.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'entity', 'RoleManagement'];

    function RoleManagementDetailController($scope, $rootScope, $uibModalInstance, entity, RoleManagement) {
        var vm = this;

        vm.role = entity; 

        vm.basicConfig = {
          core: {
            multiple: false,
            check_callback: false,
            worker: false
          },
          'types': {
            'folder': {
              'icon': 'ion-ios-folder'
            },
            'default': {
              'icon': 'ion-document-text'
            }
          },
          'plugins': ['types'],
          'version': 1
        };

        vm.treeData = [];
        if(vm.role.menuTree && vm.role.menuTree.info) vm.treeData = angular.fromJson(vm.role.menuTree.info);

        var unsubscribe = $rootScope.$on('LoginsightUiApp.page.role-management:roleManagementUpdate', function(event, result) {
            vm.role = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.clear = clear;
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();
