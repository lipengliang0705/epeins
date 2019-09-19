(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.category')
        .controller('CategoryController', CategoryController);

    CategoryController.$inject = ['Category','$scope', 'NgTableParams'];

    function CategoryController(Category,$scope,NgTableParams) {

        var vm = this;

        vm.categories = [];
        // table 的参数
        vm.tableParams = new NgTableParams();
        loadAll();

        function loadAll() {
            vm.dataload=true;
            Category.query(function(result) {
                vm.dataload=false;
                vm.categories = result;
                vm.searchQuery = null;
                vm.tableParams = new NgTableParams(
                    {
                       filter: {},
                       sorting: {},
                       page: 1,//展示第一页
                       count: 10,//每页有15个数据项
                       url: ''
                    },
                    { dataset: vm.categories}
                );
               
            });
        }

          // 回车的时候触发ng-submit，跟下面的watch二选一就可以
        function applyGlobalSearch(){
            var term = vm.globalSearchTerm;
            // if (vm.isInvertedSearch){
            //   term = "!" + term;
            // }
            console.log(term);
            vm.tableParams.filter({ $: term });
        }

        // 值变更的时候触发
        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if(newValue != oldValue){
                vm.tableParams.filter({ $: vm.globalSearchTerm });
            }
        });
        $scope.data = {
        current: "0" // 1代表张三，2代表李四，3代表王五
        };
        $scope.tooltipShow=function (param) {
            vm.tooltipShow = true;
            $scope.data.current = param;
            
        }
    
        $scope.tooltipClose = function(param){
            vm.tooltipShow = false;
            $scope.data.current = param;

        }
    }
})();
