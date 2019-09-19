(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.file-place')
        .controller('filePlaceController', filePlaceController);

    filePlaceController.$inject = ['FilePlaceService', '$uibModal', '$scope', '$rootScope', 'NgTableParams', '$window', 'toastr'];

    function filePlaceController(FilePlaceService, $uibModal, $scope, $rootScope, NgTableParams, $window, toastr) {

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
            showMidifyModal: showMidifyModal,
            showDeleteModal: showDeleteModal,
            start: start,
            stop: stop,
            tigger: tigger,
        }
        vm.data = {
            localStorageName: ''
        }
        vm.cronChangeDate = cronChangeDate;
        vm.fromNumToDay = fromNumToDay;
        vm.returnDate = returnDate;

        // 页面初始化
        function init() {
            loadAll();
        }

        // table 的参数
        vm.tableParams = new NgTableParams();

        function loadAll() {
            getList();
        };

        function getList() {
            FilePlaceService.query(function (res) {
                console.log(res);
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
                    {dataset: res}
                );
            }, function (err) {
                toastr.error(err.data.message, '错误提示');
            })
        }

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
                    transferData: {}
                }
            });
        }

        //查询
        function showSearchModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/file-place/search/search.html',
                controller: 'filePlaceSearchController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    transferData: item
                }
            });
        }

        //修改列表弹窗
        function showMidifyModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/file-place/setting/setting.html',
                controller: 'filePlaceSettingController',
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
                templateUrl: 'app/pages/file-place/delete/delete.html',
                controller: 'filePlaceDeleteController',
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

        // 储存
        function _setStorage(key, value) {
            $window.localStorage[key] = value;
        }

        //新建归档成功
        $rootScope.$on('file-place-add-success', function (event, data) {
            loadAll();
        });
        // 修改归档
        $rootScope.$on('file-place-update-success', function (event, data) {
            loadAll();
        });
        // 删除归档
        $rootScope.$on('deleteFilePlaceSuccess', function (event, data) {
            loadAll();
        });
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

        function cronChangeDate(str) {
            var toDate = {};
            if (!str) {
                toDate.loopType = '单次循环'; //空的为单次，即不循环
            } else {
                var result = str.split(' ').join('');
                var count = 0;// *的个数
                result.replace(/\*/g, function (m, i) { // '*'需要转义
                    if (m === '*') {
                        count++;
                    }
                })
                var nArr = str.split(' ');
                var strLast = str.charAt(str.length - 1);
                if (count > 1) { // *的数量为3则为按天循环
                    toDate.loopType = 'DAILY';
                } else if (strLast === '*' && count === 2) { // 最后一个为*则为按月循环
                    toDate.loopType = 'WEEKLY';
                    var mot = [];
                    var mkeys = nArr[2].split(',');
                    for (var i = 0; i < mkeys.length; i++) {
                        var mo = mkeys[i] + '号';
                        mot.push(mo);
                    }
                    toDate.loopValue = mot.join(',');
                } else {
                    toDate.loopType = 'WEEKLY';
                    var keys = nArr[5];
                    var en2cnMap = { //跟java的星期对应不一样，java的对应为1-7对应周天-周六
                        1: '1',
                        2: '2',
                        3: '3',
                        4: '4',
                        5: '5',
                        6: '6',
                        7: '7'
                    }
                    if (keys) {
                        var cnKeys = keys.split(',').map(function (key, idx) {
                            return en2cnMap[key];
                        })
                        toDate.loopValue = cnKeys.join(',')
                    }
                }
                toDate.loopTime = moment().hour(nArr[2]).minutes(nArr[1]).seconds(0);
            }

            return toDate //返回一个对象，根据需要解析成想要的样子
        }

        function fromNumToDay(num) {
            switch (num) {
                case '1':
                    return '日';
                    break;
                case '2':
                    return '一';
                    break;
                case '3':
                    return '二';
                    break;
                case '4':
                    return '三';
                    break;
                case '5':
                    return '四';
                    break;
                case '6':
                    return '五';
                    break;
                case '7':
                    return '六';
                    break;
            }

        }

        function returnDate(str) {
            return new Date(str);
        }

        function start(item) {
            var params = {
                jobId: item.xxlJobJson.id
            }
            FilePlaceService.start(params, function (res) {
                console.log(res);
                if (res.code === 200) {
                    toastr.success('启动成功！', '成功提示');
                    getList();
                } else {
                    toastr.error(res.msg || '启动失败！', '错误提示');
                }
            }, function (err) {
                toastr.error('启动失败！', '错误提示');
            });
        }

        function tigger(item) {
            var params = {
                jobId: item.xxlJobJson.id
            }
            FilePlaceService.start(params, function (res) {
                console.log(res);
                if (res.code === 200) {
                    toastr.success('执行成功！', '成功提示');
                    getList();
                } else {
                    toastr.error(res.msg || '执行失败！', '错误提示');
                }
            }, function (err) {
                toastr.error('执行失败！', '错误提示');
            });
        }

        function stop(item) {
            var params = {
                jobId: item.xxlJobJson.id
            }
            FilePlaceService.stop(params, function (res) {
                console.log(res);
                if (res.code === 200) {
                    toastr.success('暂停成功！', '成功提示');
                    getList();
                } else {
                    toastr.error(res.msg || '暂停失败！', '错误提示');
                }
            }, function (err) {
                toastr.error('暂停失败！', '错误提示');
            });
        }

    }


})();
