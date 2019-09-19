(function () {
    'use strict';
    /**
     * 门户首页路由
     * Author：Veiss Date：2019/8/19
     */
    var app = angular.module('LoginsightUiApp.page.home');
    app.controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'HomeService', 'NgTableParams', '$state', 'toastr', '$rootScope', '$uibModal', '$q'];

    function HomeController($scope, HomeService, NgTableParams, $state, toastr, $rootScope, $uibModal, $q) {
        var vm = this;

        vm.data = {
            baseUrl: 'http://10.128.2.165:3000',
            dashboardsInfo: [],
            knowledgeBaseInfo: [],
            navigation: [],
            alarmInfosNotification: [],
            reportList: [],
            tableParamsType: null,
            tableParamsKnowledgeBase: null,
            tabs: [
                { name: '最近查询', status: true },
                { name: '新增知识库', status: false }
            ],
            currentTabIndex: 0,
            searchType: '',
        }

        vm.method = {
            selectedTab: selectedTab,
            reLoadQuery: reLoadQuery,
            markAllAsRead: markAllAsRead,
            alarmInfos: alarmInfos,
            deleteDataDashboard: deleteDataDashboard,
            showDeleteModal: showDeleteModal,
            toKnowledgeBase: toKnowledgeBase
        }

        function init() {
            dashboardsInfo();
            knowledgeBaseInfo();
            navigation();
            getDataDashboardByType();
            alarmInfosNotification();
            getAllData();
        }

        // 仪表盘
        function dashboardsInfo() {
            HomeService.dashboardsInfo({}, function (res) {
                vm.data.dashboardsInfo = res;
            })
        }

        // 知识库
        function knowledgeBaseInfo() {
            var params = {
                categoryId: '',
                knowledge: '',
                beginTime: '',
                endTime: ''
            };
            HomeService.knowledgeBaseInfo(params, function (res) {
                vm.data.knowledgeBaseInfo = res;

                // 截取描述
                angular.forEach(res, function (item, index) {
                    var ele = $('<div>' + item.content + '</div>');
                    var text = ele.text();
                    if (item.content && text.length > 30) {
                        item.subTitle = text.substring(0, 30) + '...';
                    } else if (item.content && text.length <= 30) {
                        item.subTitle = text;
                    } else {
                        item.subTitle = '';
                    }
                })

                var pageConfig = {
                    page: 1, //展示第一页
                    count: 5, //每页有15个数据项
                };

                vm.data.tableParamsKnowledgeBase = new NgTableParams(pageConfig, {
                    dataset: res
                })

                console.log(res)
            })
        }

        // 快捷查询
        function navigation() {
            var result = [
                { name: '业务管理', url: 'category' },
                { name: '日志查询', url: 'log-search-new' },
                { name: '介质管理', url: 'agent' },
                { name: '归档管理', url: 'file-place' },
                { name: '用户管理', url: 'user-management' },
                { name: '菜单管理', url: 'menu-management' },
                { name: '角色管理', url: 'role-management' },
                { name: '探针管理', url: 'agent-rule' },
                { name: '主机管理', url: 'agent-host' },
                { name: '报表管理', url: 'report-management' },
                { name: '数据源管理', url: 'data-source' },
                { name: '知识库管理', url: 'knowledge-base-list' },
            ]

            vm.data.navigation = result;
        }

        // 切换
        function selectedTab(resources, index) {
            angular.forEach(vm.data[resources], function (item, index) {
                item.status = false;
            })
            vm.data.currentTabIndex = index;
            vm.data[resources][index].status = true;
        }

        // 最近查询
        function getDataDashboardByType() {
            HomeService.getDataDashboardByType({ type: 'sql_spl' }, function (res) {
                var pageConfig = {
                    page: 1, //展示第一页
                    count: 5, //每页有15个数据项
                }

                angular.forEach(res, function (item, index) {
                    item.options = JSON.parse(item.options);
                })

                vm.data.tableParamsType = new NgTableParams(pageConfig, {
                    dataset: res
                })
            })
        }

        // 告警通知
        function alarmInfosNotification() {
            HomeService.alarmInfosNotification({}, function (res) {
                vm.data.alarmInfosNotification = res;
            })
        }

        // 加载查询
        function reLoadQuery(item) {
            console.log(item);
            var _data = JSON.stringify(item);
            localStorage.setItem('homelogSearchReload', _data);
            $state.go('log-search-new', { type: 1 });
        }

        // 标记为已读
        function alarmInfos(id) {
            HomeService.getAlarmDetails({ id: id }, function (res) {
                res.checked = true;
                HomeService.alarmInfos(res, function (resp) {
                    console.log(resp);
                    toastr.success('操作成功!', '成功提示');
                    alarmInfosNotification();
                    $scope.$emit('alarmInfosCheckedSuccess');
                })
            })
        }

        // 全部已读
        function markAllAsRead() {
            HomeService.markAllAsRead({}, function (res) {
                console.log(res);
                toastr.success('操作成功!', '成功提示');
                alarmInfosNotification();
                $scope.$emit('alarmInfosCheckedSuccess');
            })
        }

        // 删除搜索
        function deleteDataDashboard(id) {
            $uibModal.open({
                templateUrl: 'app/pages/home/delete-dataDashboard/delete-dataDashboard.html',
                controller: 'deleteDataDashboardController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: id
                }
            });
        }

        // 删除一条知识库
        function showDeleteModal(id) {
            $uibModal.open({
                templateUrl: 'app/pages/knowledge-base/delete/delete.html',
                controller: 'knowledgeBaseDeleteController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: id
                }
            });
        }

        // 获取全部的report
        function getAllData() {
            HomeService.getAllData({}, function (res) {
                $q.all(getPublicUid(res)).then(function (response) {
                    // 提取有public_uuid的字段
                    var reportList = response.filter(function (item, index) {
                        return item.public_uuid;
                    })

                    vm.data.reportList = reportList;
                })
            }, function (err) {
                toastr.error(err, '错误提示');
            })
        }

        // 获取uid
        function getPublicUid(res) {
            var result = [];
            angular.forEach(res, function (item, index) {
                result.push(function () {
                    var deferred = $q.defer();
                    HomeService.getPublicUid({ id: item.id }, function (response) {
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

        // 查看知识库
        function toKnowledgeBase(item) {
            $uibModal.open({
                templateUrl: 'app/pages/knowledge-base/check-knowledge/check-knowledge.html',
                controller: 'checkKnowledgeController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'xlg',
                resolve: {
                    transferData: item
                }
            });
        }

        // 最近查询
        $scope.$watch("vm.data.searchType", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.data.tableParamsType.filter({});
            } else if (newValue != oldValue) {
                vm.data.tableParamsType.filter({ $: vm.data.searchType });
            }
        });

        // 新增知识库
        $scope.$watch("vm.data.search", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.data.tableParamsKnowledgeBase && vm.data.tableParamsKnowledgeBase.filter({});
            } else if (newValue != oldValue) {
                vm.data.tableParamsKnowledgeBase && vm.data.tableParamsKnowledgeBase.filter({ $: vm.data.search });
            }
        });

        $rootScope.$on('deleteKnowledgeBaseSuccess', function (event, data) {
            // 重新获取知识库列表数据
            knowledgeBaseInfo();
        })

        $rootScope.$on('deleteDataDashboardSuccess', function (event, data) {
            // 重新获取查询语句
            getDataDashboardByType();
        })


        init();
    }
})();