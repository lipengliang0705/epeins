(function () {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.resoures-groups');
    app.controller("resouresGroupsAddController", resouresGroupsAddController);
    resouresGroupsAddController.$inject = ['$uibModalInstance', 'newDashboardService', 'toastr', '$rootScope', 'EventRule', 'mainTreeData','ResouresGroupsService'];

    function resouresGroupsAddController($uibModalInstance, newDashboardService, toastr, $rootScope, EventRule, mainTreeData,ResouresGroupsService) {
        var vm = this;

        vm.data = {
            name: '',
            desc:'',
            info:[]
        }

        vm.appList = [];
        vm.method = {
            submit: submit,
            cancel: cancel
        }
        
        vm.mainTreeData = [];

        vm.mainTreeBasicConfig = {
            core: {
                multiple: true,
                check_callback: true,
                worker: true
            },
            'types': {
                'folder': {
                    'icon': 'ion-ios-folder'
                },
                'default': {
                    'icon': 'ion-document-text'
                }
            },
            'plugins': ['checkbox', 'types'],
            'version': 1
        };

        vm.basicConfig = {
            core: {
                multiple: false,
                check_callback: function (chk, obj, par, pos, more) {
                    if (chk == 'move_node') {
                        // console.log(obj, par);
                        // //移动节点只能平级移动 一级只能移动到一级，二级只能移动到二级，没有三级
                        if ((obj.original.parent == '#' && par.parent == null) || (obj.original.parent != '#' && par.parent == '#')) {
                            return true;
                        }
                        return false;
                    } else {
                        return true;
                    }
                },
                worker: true
            },
            'types': {
                'folder': {
                    'icon': 'ion-ios-folder'
                },
                'default': {
                    'icon': 'ion-document-text'
                }
            },
            'plugins': ['types', 'contextmenu', 'dnd'], //'sort'
            // 'sort': function(a,b){
            //   console.log(a,b, this.get_node(a).original, this.get_node(b).original);
            //   if (this.get_node(b).original.position < this.get_node(a).original.position) {
            //     return 1;
            //   }
            //   return -1;
            // },
            'version': 1
        };

        loadAll();

        function loadAll() {
            getCategoryList(mainTreeData);
        }

        vm.selectnodeCB = function (nodes, selected, event) {
            selected.event.preventDefault();
            var menuData = angular.copy(vm.mainTreeData);
            if (selected.node.parent == '#') {//选中的为父节点
                //先添加父节点，再根据父节点获取子节点添加
                var parentflag = _.find(vm.data.info, {'id': selected.node.id});
                if (!parentflag) {
                    vm.data.info.push(selected.node.original);
                }
                ;
                var items = _.filter(menuData, {'parent': selected.node.id});
                _.forEach(items, function (item) {
                    var node = _.find(vm.data.info, {'id': item.id});
                    if (!node) {
                        vm.data.info.push(item);
                    }
                });
            } else { //选中的为子节点
                //先查看是否已添加此子节点的父节点，先添加父节点再添加子节点
                var parentflag = _.find(vm.data.info, {'id': selected.node.parent});
                if (!parentflag) {
                    var parent = _.find(menuData, {'id': selected.node.parent});
                    if (parent) {
                        vm.data.info.push(parent);
                    }
                    ;
                }
                vm.data.info.push(selected.node.original);
            }
        }

        vm.deselectnodeCB = function (nodes, selected, event) {
            if (selected.node.parent == '#') {
                _.remove(vm.data.info, {'id': selected.node.id});
                _.remove(vm.data.info, {'parent': selected.node.id});
            } else {
                _.remove(vm.data.info, {'id': selected.node.id});
                var items = _.filter(vm.data.info, {'parent': selected.node.parent});
                if (items.length == 0) {
                    _.remove(vm.data.info, {'id': selected.node.parent});
                }
            }
        }

        //获取业务列表
        function getCategoryList(mainTreeData) {
            var appList = mainTreeData.map(function (d, index) {
                var item = d;
                return {
                    id: index+'',
                    text: item.title,
                    title: item.description,
                    "state": {"opened": true},
                    "level": 0,
                    "parent": "#",
                    "icon": "",
                    "__uiNodeId": 1,
                    name: item.name
                }
            })
            vm.mainTreeData = _.uniqBy(appList, 'name');

        };

        function submit() {

            var params = {
                name: vm.data.name,
                description: vm.data.desc,
                treeData: vm.data.info,
            }

            vm.data.info=JSON.stringify(vm.data.info);
            console.log(vm.data);

            ResouresGroupsService.save(vm.data,function (data) {
                console.log(data);
                toastr.success('用户分组新建成功！','成功提示');
                $rootScope.$broadcast('resouresGroupsAddSuccess', vm.data);

                // 关闭
                cancel();
            },function (err) {
                toastr.error(err.data.message,'错误提示');
            });



        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();