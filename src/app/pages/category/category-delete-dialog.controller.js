(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.category')
        .controller('CategoryDeleteController',CategoryDeleteController);

    CategoryDeleteController.$inject = ['$uibModalInstance', 'entity', 'Category', 'toastr'];

    function CategoryDeleteController($uibModalInstance, entity, Category, toastr) {
        var vm = this;

        vm.category = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Category.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                }, 
                function (e) {
                    console.log(e);         
                    if(e.status==500 && e.data.detail.toUpperCase().indexOf("CONSTRAINT")>-1){ 
                        toastr.error('', vm.category.name+ ' 业务正在使用中，无法删除！');
                        $uibModalInstance.close(true);
                    }  
                }
            );
        }
    }
})();
