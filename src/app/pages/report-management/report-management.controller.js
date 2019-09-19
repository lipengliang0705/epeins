(function () {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.report-management');
    app.controller("reportManagementController", reportManagementController);
    reportManagementController.$inject = ['$scope', 'reportManagementService', '$q', 'NgTableParams', 'toastr'];

    function reportManagementController($scope, reportManagementService, $q, NgTableParams, toastr) {
        var vm = this;

        vm.data = {
            baseUrl: 'http://10.128.2.165:3000',
            addUrl: 'http://10.128.2.165:3000/question/new',
            search: '',
            pageParams: {
                page: 1,    // 展示第一页
                count: 10,  // 每页有15个数据项
            },
            tableParams: null,
        }

        vm.method = {

        }

        // 页面初始化
        function init() {
            getAllData();
        }

        // 获取全部的report
        function getAllData() {
            reportManagementService.getAllData({}, function (res) {
                $q.all(getPublicUid(res)).then(function (response) {
                    // 提取有public_uuid的字段
                    var reportList = response.filter(function (item, index) {
                        return item.public_uuid;
                    })

                    vm.data.tableParams = new NgTableParams(vm.data.pageParams, {
                        dataset: reportList
                    })
                })
            }, function (error) {
                toastr.error(error, '错误提示');
            })
        }

        // 获取uid
        function getPublicUid(res) {
            var result = [];
            angular.forEach(res, function (item, index) {
                result.push(function () {
                    var deferred = $q.defer();
                    reportManagementService.getPublicUid({ id: item.id }, function (response) {
                        if (response.uuid) {
                            item.public_uuid = response.uuid;
                            item.url = vm.data.baseUrl + '/public/question/' + item.public_uuid;
                            item.edit_url = vm.data.baseUrl + '/question/' + item.id;
                            item.delete_url = vm.data.baseUrl + '/collection/root?type=card';
                        }
                        deferred.resolve(item);
                    }, function (err) {
                        deferred.resolve(item);
                    });
                    return deferred.promise;
                }())
            })
            return result;
        }


        // 筛选
        $scope.$watch("vm.data.search", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.data.tableParams.filter({});
            } else if (newValue != oldValue) {
                vm.data.tableParams.filter({ $: vm.data.search });
            }
        });

        init();
    }
})();