(function() {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.medium-manage', []);
    app.controller("MediumManageController", MediumManageController);
    MediumManageController.$inject = ['$uibModal', 'toastr', '$scope', '$rootScope', '$window'];

    function MediumManageController($uibModal, toastr, $scope, $rootScope, $window) {
        var vm = this;

        vm.data = {
            localStorageName: ''
        }

        vm.resources = {
            list: [
                {
                    id: 1,
                    name: 'gdpoc',
                    describe: 'gdpoc',
                    createTime: '2019-4-6 12:23:00',
                    file: 'http://es5n-node0.stage.dev.pi',
                    status: 'success',
                    author: 'Admin'
                },{
                    id: 2,
                    name: 'Elasticsearch',
                    describe: 'es地址',
                    createTime: '2019-4-6 12:23:00',
                    file: 'http://es5n-node0.stage.dev.pi',
                    status: 'fail',
                    author: 'Admin'
                }
            ]
        }

        vm.method = {
            showAddModal: showAddModal,
        }

        // 页面初始化
        function init() {
            
        }
        // 新建介质
        function showAddModal() {
            $uibModal.open({
                templateUrl: 'app/pages/medium-manage/add/add.html',
                controller: 'mediumManageAddController',
                controllerAs: 'vm',
                backdrop: 'static'
            });
        }
        // 获取
        //新建列表
        // $rootScope.$on('mediumManageSuccess', function (event, data) {
        //     var localStorageList = _getStorage();
        //     //console.log(data);

        //     // 写入数据
        //     vm.resources.list.push(data);

        //     // 储存到本地，刷新不会丢失数据
        //     _setStorage(vm.data.localStorageName, JSON.stringify(vm.resources.list));
        // });
        // $rootScope.$on('deleteMediumManageSuccess', function (event, data) {
        //     angular.forEach(vm.resources.list, function (item, index) {
        //         if (item.id == data.id) {
        //             vm.resources.list.splice(index, 1);
        //         }
        //     })
        //     // 储存到本地，刷新不会丢失数据
        //     _setStorage(vm.data.localStorageName, JSON.stringify(vm.resources.list));
        // })

        init();

    }
})();