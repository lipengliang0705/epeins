(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.menu-management')
        .controller('MenuManagementController', MenuManagementController);

    MenuManagementController.$inject = ['Principal', 'MenuManagement', '$state', '$scope', 'toastr', 'NgTableParams'];

    function MenuManagementController(Principal, MenuManagement, $state, $scope, toastr, NgTableParams) {
        var vm = this;
       //  vm.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
       //  vm.currentAccount = null;
       //  vm.languages = null;
       //  vm.loadAll = loadAll;
       //  vm.setActive = setActive;
       //  vm.users = [];
       //  vm.page = 1;
       //  vm.totalItems = null;
       //  vm.clear = clear;
       //  vm.links = null;
       //  vm.loadPage = loadPage;
         vm.tableParams = new NgTableParams();
       //  vm.predicate = pagingParams.predicate;
       //  vm.reverse = pagingParams.ascending;
       // // vm.itemsPerPage = paginationConstants.itemsPerPage;
       //  vm.transition = transition;

       //  vm.loadAll();
       //  Principal.identity().then(function(account) {
       //      vm.currentAccount = account;
       //  });

        // function setActive (user, isActivated) {
        //     user.activated = isActivated;
        //     User.update(user, function () {
        //         vm.loadAll();
        //         vm.clear();
        //     });
        // }
        loadAll ();
        function loadAll () {
           vm.dataload=true;
            MenuManagement.query({}, onSuccess, onError);
        }

        function onSuccess(data, headers) {
           vm.dataload=false;
            vm.menus = data;
            vm.tableParams = new NgTableParams(
                     {
                       filter: {},
                       sorting: {},
                       page: 1,//展示第一页
                       count: 10,//每页有15个数据项
                       url: ''
                    },
                    { dataset: vm.menus}
                ); 
        }

        function onError(error) {
            toastr.error(error.data.message);
        }

        // function clear () {
        //     vm.user = {
        //         id: null, login: null, firstName: null, lastName: null, email: null,
        //         activated: null, langKey: null, createdBy: null, createdDate: null,
        //         lastModifiedBy: null, lastModifiedDate: null, resetDate: null,
        //         resetKey: null, authorities: null
        //     };
        // }

        function sort () {
            var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
            if (vm.predicate !== 'id') {
                result.push('id');
            }
            return result;
        }

        function loadPage (page) {
            vm.page = page;
            vm.transition();
        }

        function transition () {
            $state.transitionTo($state.$current, {
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
                search: vm.currentSearch
            });
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
