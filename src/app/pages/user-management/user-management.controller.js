(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.pages.user-management')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['Principal', 'User', 'ParseLinks', '$state', 'pagingParams', '$scope','toastr', 'NgTableParams'];

    function UserManagementController(Principal, User, ParseLinks, $state, pagingParams, $scope, toastr, NgTableParams) {
        var vm = this;

        vm.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        vm.currentAccount = null;
        vm.languages = null;
        vm.loadAll = loadAll;
        vm.setActive = setActive;
        vm.users = [];
        vm.page = 1;
        vm.totalItems = null;
        vm.clear = clear;
        vm.links = null;
        vm.loadPage = loadPage;
         vm.tableParams = new NgTableParams();
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
       // vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.transition = transition;
        vm.applyGlobalSearch = applyGlobalSearch;

        vm.loadAll();
        Principal.identity().then(function(account) {
          //  console.log('vm.currentAccount---登录名1',account);
            vm.currentAccount = account;
        });

        function setActive (user, isActivated) {
            user.activated = isActivated;
            User.update(user, function () {
                vm.loadAll();
                vm.clear();
            });
        }

        function loadAll () {
            vm.dataload=true;
            User.query({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);
        }

        function onSuccess(data, headers) {
            vm.dataload=false;
            vm.links = ParseLinks.parse(headers('link'));
            vm.totalItems = headers('X-Total-Count');
            vm.queryCount = vm.totalItems;
            vm.page = pagingParams.page;
            vm.users = data;

            //console.log(data, '---------------');
            vm.tableParams = new NgTableParams(
                     {
                       filter: {},
                       sorting: {},
                       page: 1,//展示第一页
                       count: 10,//每页有15个数据项
                       url: ''
                    },
                    { dataset: vm.users}
                );
        }
       // 回车的时候触发ng-submit，跟下面的watch二选一就可以
        function applyGlobalSearch(){
            var term = vm.globalSearchTerm;
            // if (vm.isInvertedSearch){
            //   term = "!" + term;
            // }
           // console.log(term);
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
       
        function onError(error) {
            toastr.error(error.data.message);
           // AlertService.error(error.data.message);
        }

        function clear () {
            vm.user = {
                id: null, login: null, firstName: null, lastName: null, email: null,
                activated: null, langKey: null, createdBy: null, createdDate: null,
                lastModifiedBy: null, lastModifiedDate: null, resetDate: null,
                resetKey: null, authorities: null
            };
        }

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
