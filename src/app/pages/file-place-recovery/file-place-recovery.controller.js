(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.file-place-recovery')
        .controller('FilePlaceRecoveryController', FilePlaceRecoveryController);

    FilePlaceRecoveryController.$inject = ['FilePlaceService', '$uibModal', '$scope', '$rootScope', 'NgTableParams', '$window', 'FilePlaceRecoveryService','$state'];

    function FilePlaceRecoveryController(FilePlaceService, $uibModal, $scope, $rootScope, NgTableParams, $window, FilePlaceRecoveryService,$state) {
        var vm = this;
        vm.selected = {};
        vm.selectAll = selectAll;
        vm.test = test;
        vm.batchStop = batchStop;
        vm.agents = [];
        vm.batchStatus = false;
        vm.resources = {
            list: []
        };
        vm.method = {
            showAddModal: showAddModal,
            showSettingModal: showSettingModal,
            showSearchModal: showSearchModal,
            showRestoreModal: showRestoreModal,
            showMidifyModal: showMidifyModal,
            showDeleteModal: showDeleteModal
        }
        vm.data = {
            localStorageName: ''
        }

        // 页面初始化
        function init() {
            vm.resources.list = _getStorage();

            $rootScope.$on('delete-snapshot-success',function () {
                loadAll();
            });
            loadAll();
        }

        // table 的参数
        vm.tableParams = new NgTableParams();

        function loadAll() {
            vm.dataload = true;

            var params = {
                snapshotName: '_all'
            };
            FilePlaceRecoveryService.query(params, function (res) {
                console.log(res);

                console.log(res.snapshots[0].indices.length);
                vm.dataload = false;
                vm.searchQuery = null;
                vm.tableParams = new NgTableParams(
                    {
                        filter: {},
                        sorting: {},
                        page: 1,//展示第一页
                        count: 10,//每页有15个数据项
                        url: ''
                    },
                    {dataset: res.snapshots}
                );
            });
        };

        // 选择全部
        function selectAll(_status) {
            _.forEach(vm.tableParams.data, function (entity) {
                vm.selected[entity.id] = _status;
            });

        }

        // 新建归档
        function showAddModal() {
            $uibModal.open({
                templateUrl: 'app/pages/file-place/add/add.html',
                controller: 'filePlaceAddController',
                controllerAs: 'vm',
                backdrop: 'static'
            });
        }

        // 设置
        function showSettingModal() {
            $uibModal.open({
                templateUrl: 'app/pages/file-place/setting/setting.html',
                controller: 'filePlaceSettingController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    count: vm.resources.list.length
                }
            });
        }

        //查询
        function showSearchModal(item) {
            console.log(item);
            var queryParams={
                startTime:item.start_time,
                endTime:item.end_time,
                index:item.indices.join(',')
            }
            $window.localStorage.setItem('queryStringParams',angular.toJson(queryParams));

            $state.go('log-search-dsl');
        }

        //修改列表弹窗
        function showMidifyModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/file-place/modify/modify.html',
                controller: 'filePlaceModifyController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    transferData: item
                }
            });
        }

        //删除归档
        function showDeleteModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/file-place-recovery/delete/delete.html',
                controller: 'DeleteController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: item
                }
            });
        }

        //删除归档
        function showRestoreModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/file-place-recovery/restore/restore.html',
                controller: 'RestoreController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: item
                }
            });
        }

        // 回车的时候触发ng-submit，跟下面的watch二选一就可以
        function applyGlobalSearch() {
            var term = vm.globalSearchTerm;
            console.log(term);
            vm.tableParams.filter({$: term});
        }

        // 值变更的时候触发
        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if (newValue != oldValue) {
                vm.tableParams.filter({$: vm.globalSearchTerm});
            }
        })

        $scope.$watch('vm.selected', function (newValue) {
            Object.keys(newValue).some(function (key) {
                console.log(key);
                if (newValue[key]) {
                    return vm.batchStatus = true;

                } else {
                    vm.batchStatus = false;
                }
            })
        }, true);

        $scope.data = {
            current: "0" // 1代表张三，2代表李四，3代表王五
        };
        $scope.tooltipShow = function (param) {
            vm.tooltipShow = true;
            $scope.data.current = param;

        }

        $scope.tooltipClose = function (param) {
            vm.tooltipShow = false;
            $scope.data.current = param;

        }

        // 获取
        function _getStorage() {
            return [
                {
                    "id": 0,
                    name: "WIN-JLDTHUDDHDF",
                    cycle: '周',
                    startTime: 1562479200000,
                    indexName: 'abc-*',
                    status: "正在归档"
                },
                {
                    id: 1,
                    name: "WIN-JLDTHUDDHDF",
                    cycle: '周',
                    startTime: 1562479200000,
                    indexName: 'abc-*',
                    status: "等待归档"
                }, {
                    "id": 2,
                    name: "WIN-JLDTHUDDHDF",
                    cycle: '周',
                    startTime: 1562479200000,
                    indexName: 'abc-*',
                    status: "正在归档"

                }, {
                    "id": 6,
                    name: "WIN-JLDTHUDDHDF",
                    cycle: '周',
                    startTime: 1562479200000,
                    indexName: 'abc-*',
                    status: "正在归档"
                },
            ]
            // var res = $window.localStorage[vm.data.localStorageName];
            // if (res) {
            //     return JSON.parse(res);
            // } else {
            //     _setStorage(vm.data.localStorageName, JSON.stringify(defaultList));
            //     return defaultList
            // }
        }

        // 储存
        function _setStorage(key, value) {
            $window.localStorage[key] = value;
        }

        //新建归档成功
        $rootScope.$on('file-place-success', function (event, data) {
            //
            // var localStorageList = _getStorage();
            // console.log(data);
            // // 写入数据
            vm.resources.list.unshift(data);
            loadAll();

            // // 储存到本地，刷新不会丢失数据
            // _setStorage(vm.data.localStorageName, JSON.stringify(vm.resources.list));
        });
        // 修改列表
        $rootScope.$on('modifyFilePlaceSuccess', function (event, data) {
            console.log(data);
            angular.forEach(vm.resources.list, function (item, index) {
                if (item.id == data.id) {
                    item.id = data.id;
                    item.name = data.name;
                    item.status = data.status;
                    item.fileSize = data.fileSize;
                }
            })
            console.log(vm.resources.list)
            // 储存到本地，刷新不会丢失数据
            _setStorage(vm.data.localStorageName, JSON.stringify(vm.resources.list));
        })
        $rootScope.$on('deleteFilePlaceSuccess', function (event, data) {
            loadAll()
            console.log(data);
            //vm.resoures.list =[];//清空之前列表数据数据
            angular.forEach(vm.resources.list, function (item, index) {
                if (item.name == data.name) {
                    vm.resources.list.splice(index, 1);
                }
            })
            // 储存到本地，刷新不会丢失数据
            _setStorage(vm.data.localStorageName, JSON.stringify(vm.resources.list));
        })
        init();


        function test() {
            _.forEach(vm.selected, function (item, index) {
                if (item) {
                    vm.resources.list.forEach(function (item2) {
                        if (item2.id == index) {
                            // item.
                            console.log(item);
                            item2.status = "正在归档";
                        }
                    })
                }
            })
        }

        function batchStop() {
            _.forEach(vm.selected, function (item, index) {
                if (item) {
                    vm.resources.list.forEach(function (item2) {
                        if (item2.id == index) {
                            // item.
                            console.log(item);
                            item2.status = "停止归档";
                        }
                    })
                }
            })
        }
    }


})();
