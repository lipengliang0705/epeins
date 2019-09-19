/**
 * @author jiang zihan
 * created on 21.12.2018
 */
(function() {
    'use strict'

    angular.module('LoginsightUiApp.theme.components')
        .controller('pageTopCtrl', pageTopCtrl);
      pageTopCtrl.$inject = ['baConfig', '$element', 'layoutPaths', 'Principal','$state', 'Auth', 'ProfileService', '$rootScope', '$scope','$location'];
    /** @ngInject */
    function pageTopCtrl(baConfig, $element, layoutPaths, Principal, $state, Auth, ProfileService, $rootScope, $scope, $location) {

        $scope.isNavbarCollapsed = true;
        $scope.isAuthenticated = Principal.isAuthenticated;


        ProfileService.getProfileInfo().then(function(response) {
            $scope.inProduction = response.inProduction;
            $scope.swaggerEnabled = response.swaggerEnabled;
        });

        // $scope.login = login;
        $scope.logout = logout;
        $scope.toggleNavbar = toggleNavbar;
        $scope.collapseNavbar = collapseNavbar;
        $scope.whiteTheme = true;
        $scope.$state = $state;
        $scope.pathUrl = $location.path();
        //var absurl = $location.absUrl();
        //$scope.auisref =  pathUrl.split('/')[1];
        // $scope.isMenuShow = false;
        if($scope.pathUrl=='/'){
            $scope.isNavBarViable = false;

        }else{
            $scope.isNavBarViable = true;
        }
        // function login() {
        //     collapseNavbar();
        //     LoginService.open();
        // }

        function logout() {
            collapseNavbar();
            Auth.logout();
           // console.log('退出');
            // window.localStorage.clear();
            //window.localStorage.removeItem('authenticationToken');
            // window.localStorage.setItem("authenticationToken", JSON.stringify({
            //   "username": '',
            //   "password": '',
            //   "rememberMe": true
            // }));
            //  location.href="/auth.html";
            // }
            window.location.href="/auth.html";
        }

        function toggleNavbar() {
            $scope.isNavbarCollapsed = !$scope.isNavbarCollapsed;
        }

        function collapseNavbar() {
            $scope.isNavbarCollapsed = true;
            $scope.isNavBarViable = false;
            // $scope.isViable = false;
           // $scope.$emit('tssLoginsightUiApp:isMenuVisable', false);
           // $scope.$broadcast('tssLoginsightUiApp:isMenuVisable', false);
            // var unsubscribe = $rootScope.$on('tssLoginsightUiApp:isMenuVisable', function(event, result) {
            //    $scope.isViable = result;
            // });
        }


        var navbarhide = $rootScope.$on('tssLoginsightUiApp:isNavBarVisable', function(event, result) {
            $scope.isNavBarViable = result;
        });
        $scope.$on('$destroy', navbarhide);
        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                $scope.account = account;
                $scope.isAuthenticated = Principal.isAuthenticated;
            });
        }

    }
})();
