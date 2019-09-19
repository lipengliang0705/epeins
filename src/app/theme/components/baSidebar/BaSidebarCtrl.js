/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('LoginsightUiApp.theme.components')
        .controller('BaSidebarCtrl', BaSidebarCtrl);

    /** @ngInject */
    function BaSidebarCtrl($scope, baSidebarService, $rootScope) {

        // baSidebarService.getMenuItems().then(function(item) {
        //     $scope.menuItems = item;
        //     // console.log('菜单',$scope.menuItems);
        //     $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

        //     var subMenu=[];

        //     angular.forEach($scope.menuItems,function (item) {
        //         console.log('菜单打印',item);
        //         angular.forEach(item.subMenu,function (subItem) {
        //             subMenu.push(subItem.stateRef);
        //         });
        //     });



        //     // console.log(subMenu)

        // });

        var item = [{
            "id": "1",
            "parent": "#",
            "icon": "ion-android-home",
            "text": "仪表板",
            "title": "仪表板",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 1,
            "subMenu": [{
                "id": "n26",
                "parent": "1",
                "stateRef": "new-dashboard",
                "text": "自定义仪表盘",
                "title": "自定义仪表盘",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 1
            }]
        }, {
            "id": "2",
            "parent": "#",
            "icon": "fa fa-gears",
            "text": "生产管理",
            "title": "生产管理",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 2,
            "subMenu": [{
                "id": "n6",
                "parent": "2",
                "text": "生产计划维护",
                "title": "生产计划维护",
                "stateRef": "category",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 13
            }]
        }, {
            "id": "3",
            "parent": "#",
            "icon": "fa fa-gift",
            "text": "包装管理",
            "title": "包装管理",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 3,
            "subMenu": [{
                "id": "n43",
                "parent": "3",
                "stateRef": "log-main",
                "text": "选择业务系统",
                "title": "选择业务系统",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 1
            }, {
                "id": "n8",
                "parent": "3",
                "text": "日志查询",
                "title": "日志查询",
                "stateRef": "log-search-dsl",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 15
            }]
        }, {
            "id": "4",
            "parent": "#",
            "icon": "fa fa-eye",
            "text": "巡检管理",
            "title": "巡检管理",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 4,
            "subMenu": [{
                "id": "n28",
                "parent": "4",
                "stateRef": "alarm-rule",
                "text": "告警规则",
                "title": "告警规则",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 1
            }, {
                "id": "n10",
                "parent": "4",
                "text": "告警信息",
                "title": "告警信息",
                "stateRef": "alarm-result",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 17
            }]
        }, {
            "id": "5",
            "parent": "#",
            "icon": "fa fa-industry",
            "text": "仓库管理",
            "title": "仓库管理",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 5,
            "subMenu": [{
                "id": "n30",
                "parent": "5",
                "stateRef": "user-groups",
                "text": "用户分组",
                "title": "用户分组",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 3
            }, {
                "id": "n29",
                "parent": "5",
                "stateRef": "resoures-groups",
                "text": "业务分组",
                "title": "业务分组",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 2
            }, {
                "id": "n13",
                "parent": "5",
                "text": "用户管理",
                "title": "用户管理",
                "stateRef": "user-management",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 20
            }, {
                "id": "n14",
                "parent": "5",
                "text": "角色管理",
                "title": "角色管理",
                "stateRef": "role-management",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 21
            }, {
                "id": "n15",
                "parent": "5",
                "text": "菜单管理",
                "title": "菜单管理",
                "stateRef": "menu-management",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 22
            }]
        }, {
            "id": "7",
            "parent": "#",
            "icon": "fa fa-desktop",
            "text": "大屏显示",
            "title": "大屏显示",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 7,
            "subMenu": [{
                "id": "n2",
                "parent": "7",
                "text": "目标主机",
                "title": "目标主机",
                "stateRef": "agent-host",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 9
            }, {
                "id": "n4",
                "parent": "7",
                "text": "探针管理",
                "title": "探针管理",
                "stateRef": "agent-rule",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 11
            }]
        }, {
            "id": "9",
            "parent": "#",
            "icon": "fa fa-bar-chart",
            "text": "报表管理",
            "title": "报表管理",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 1,
            "subMenu": [{
                "id": "n31",
                "parent": "9",
                "stateRef": "report-management",
                "text": "自定义报表",
                "title": "自定义报表",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 2
            }]
        }, {
            "id": "10",
            "parent": "#",
            "text": "基础数据维护",
            "title": "基础数据维护",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 1,
            "icon": "fa fa-database",
            "subMenu": [{
                "id": "n38",
                "parent": "10",
                "stateRef": "data-source",
                "text": "数据源",
                "title": "数据源",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 1
            }, {
                "id": "n34",
                "parent": "10",
                "stateRef": "data-dictionary",
                "text": "数据字典",
                "title": "数据字典",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 1
            }, {
                "id": "n33",
                "parent": "10",
                "stateRef": "agent",
                "text": "介质管理配置",
                "title": "介质管理配置",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 3
            }, {
                "id": "n32",
                "parent": "10",
                "stateRef": "alarm-type",
                "text": "告警方式配置",
                "title": "告警方式配置",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 2
            }]
        }, {
            "id": "11",
            "parent": "#",
            "text": "知识库",
            "title": "知识库",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 1,
            "icon": "fa fa-book",
            "subMenu": [{
                "id": "n37",
                "parent": "11",
                "stateRef": "knowledge-base-list",
                "text": "知识库管理",
                "title": "知识库管理",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 3
            }]
        }, {
            "id": "12",
            "parent": "#",
            "text": "审计日志",
            "title": "审计日志",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 1,
            "icon": "fa fa-server",
            "subMenu": [{
                "id": "n39",
                "parent": "12",
                "stateRef": "audit",
                "text": "审计日志数据",
                "title": "审计日志数据",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 2
            }]
        }, {
            "id": "13",
            "parent": "#",
            "icon": "fa fa-archive",
            "text": "归档管理",
            "title": "归档管理",
            "state": {
                "opened": true
            },
            "level": 0,
            "__uiNodeId": 1,
            "subMenu": [{
                "id": "n42",
                "parent": "13",
                "stateRef": "file-place",
                "text": "归档任务",
                "title": "归档任务",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 1
            }, {
                "id": "n41",
                "parent": "13",
                "stateRef": "file-place-recovery",
                "text": "归档日志",
                "title": "归档日志",
                "state": {
                    "opened": true
                },
                "level": 1,
                "__uiNodeId": 3
            }]
        }];

        $scope.menuItems = item;
        // console.log('菜单',$scope.menuItems);
        $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

        var subMenu = [];

        angular.forEach($scope.menuItems, function (item) {
            console.log('菜单打印', item);
            angular.forEach(item.subMenu, function (subItem) {
                subMenu.push(subItem.stateRef);
            });
        });
        // $scope.menuItems = baSidebarService.getMenuItems();
        // console.log($scope.menuItems); 
        // $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

        $scope.hoverItem = function ($event) {
            $scope.showHoverElem = true;
            $scope.hoverElemHeight = $event.currentTarget.clientHeight;
            var menuTopValue = 51;
            $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
        };

        $scope.$on('$stateChangeSuccess', function () {
            if (baSidebarService.canSidebarBeHidden()) {
                baSidebarService.setMenuCollapsed(true);
            }
        });
    }
})();