(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.category')
        .controller('CategoryDetailController', CategoryDetailController);

    CategoryDetailController.$inject = ['$scope', '$rootScope', '$stateParams', '$uibModalInstance', 'entity', 'Category', 'EventRule', 'AgentRule'];

    function CategoryDetailController($scope, $rootScope, $stateParams, $uibModalInstance, entity, Category, EventRule, AgentRule) {
        console.log(entity);
        var vm = this;

        vm.category = entity;
        // vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('LoginsightUiApp.page.category:categoryUpdate', function(event, result) {
            vm.category = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.clear = clear;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();