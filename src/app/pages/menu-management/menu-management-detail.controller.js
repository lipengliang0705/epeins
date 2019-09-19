(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.menu-management')
        .controller('MenuManagementDetailController', MenuManagementDetailController);

    MenuManagementDetailController.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'entity', 'MenuManagement'];

    function MenuManagementDetailController($scope, $rootScope, $uibModalInstance, entity, MenuManagement) {
        var vm = this;

        vm.menu = entity; 

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

        vm.treeData = angular.fromJson(vm.menu.info);

        var unsubscribe = $rootScope.$on('LoginsightUiApp.page.menu-management:menuManagementUpdate', function(event, result) {
            vm.menu = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.clear = clear;
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();
