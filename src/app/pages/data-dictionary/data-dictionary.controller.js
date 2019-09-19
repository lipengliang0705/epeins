(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.data-dictionary')
        .controller('DataDictionaryController', DataDictionaryController);

    DataDictionaryController.$inject = ['DataDictionaryService', '$uibModal', '$scope', '$rootScope', 'NgTableParams', '$window', 'DATA_DICTIONARY'];

    function DataDictionaryController(DataDictionaryService, $uibModal, $scope, $rootScope, NgTableParams, $window, DATA_DICTIONARY) {
        var vm = this;

        vm.tableParams = new NgTableParams({
            filter: {},
            sorting: {},
            page: 1,//展示第一页
            count: 10,//每页有15个数据项
            url: ''
        });
        vm.method = {
            showAddModal: showAddModal,
            showMidifyModal: showMidifyModal,
            showDeleteModal: showDeleteModal
        }

        loadAll();

        function loadAll() {
            initEvents();
            getList();
        };

        function initEvents() {
            $rootScope.$on('reloadDataDictionary', function () {
                getList();
            });
        }

        function getList() {
            DataDictionaryService.query(function (result) {
                var _res = result.filter(function (item) {
                    return item.status == 0;
                });
                vm.tableParams.settings().dataset = _res;
                vm.tableParams.reload();
                DATA_DICTIONARY.list = _res;
            })
        }

        // 新建归档
        function showAddModal() {
            $uibModal.open({
                templateUrl: 'app/pages/data-dictionary/dialog/data-dictionary-dialog.html',
                controller: 'DataDictionaryDialogCtrl',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    transferData: null
                }
            });
        }

        //修改列表弹窗
        function showMidifyModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/data-dictionary/dialog/data-dictionary-dialog.html',
                controller: 'DataDictionaryDialogCtrl',
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
                templateUrl: 'app/pages/data-dictionary/delete/delete.html',
                controller: ['$uibModalInstance', '$rootScope', 'toastr', 'DataDictionaryService', function ($uibModalInstance, $rootScope, toastr, DataDictionaryService) {
                    console.log(item);
                    var vm = this;

                    vm.method = {
                        submit: submit,
                        cancel: cancel
                    }

                    function submit() {
                        var params = {
                            id:item.id
                        };

                        DataDictionaryService.delete(params, function (res) {
                            console.log(res);
                            toastr.success('删除成功！', '成功提示');
                            $uibModalInstance.dismiss('cancel');
                            $rootScope.$broadcast('reloadDataDictionary');
                        }, function (err) {
                            toastr.error(err.data.message, '错误提示');
                        })

                    }

                    function cancel() {
                        $uibModalInstance.dismiss('cancel');
                    }
                }],
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

    }


})();
