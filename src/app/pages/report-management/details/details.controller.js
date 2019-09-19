(function () {
    'use strict';
    /**
     * @ 查看仪表盘详情
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.report-management');
    app.controller("reportManagementDetailsController", reportManagementDetailsController);
    reportManagementDetailsController.$inject = ['$scope', '$timeout', '$uibModal', 'toastr', '$window', '$stateParams', '$sce'];

    function reportManagementDetailsController($scope, $timeout, $uibModal, toastr, $window, $stateParams, $sce) {
        var vm = this;

        console.log($stateParams);

        vm.data = {

        }

        vm.resources = {
            list: []
        }

        function init() {
            vm.resources.list.url = $stateParams.url;
            vm.resources.list.urlFormat = urlFormat(vm.resources.list.url);
        }

        /**
         * url安全过滤
         */
        function urlFormat(url) {
            return $sce.trustAsResourceUrl(url);
        }

        init();
    }
})();