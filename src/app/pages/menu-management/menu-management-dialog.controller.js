(function () {
  'use strict';

  angular
    .module('LoginsightUiApp.page.menu-management')
    .controller('MenuManagementDialogController', MenuManagementDialogController);

  MenuManagementDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'toastr', 'entity', 'mainTreeData', 'MenuManagement'];

  function MenuManagementDialogController($timeout, $scope, $stateParams, $uibModalInstance, toastr, entity, mainTreeData, MenuManagement) {
    var vm = this;

    vm.menu = entity;
    vm.save = save;
    vm.clear = clear;

    vm.treeData = angular.fromJson(vm.menu.info) || [];
    vm.mainTreeData = getMainTreeData();

    function clear() {
      $uibModalInstance.dismiss('cancel');
    }

    function save() {
      console.log('save--------');
      if (vm.treeData == null || vm.treeData.length == 0) {
        vm.isSaving = false;
        toastr.error('', '右侧菜单选择为空，左侧菜单点击Checkbox选择。请检查操作是否正确！');
        return null;
      }
      vm.isSaving = true;
      var obj = $('#basicTree').jstree(true).get_json();
      var new_tree = [];
      _.forEach(obj, function (o) {
        // console.log(o);
        var p = _.find(vm.treeData, { 'id': o.id });
        if (p && o.children.length > 0) {
          if (p.state.selected) delete p.state.selected;
          new_tree.push(p);
        }
        _.forEach(o.children, function (children) {
          var n = _.find(vm.treeData, { 'id': children.id });
          if (n) {
            n.parent = o.id;
            if (n.state.selected) delete n.state.selected;
            new_tree.push(n);
          };
        })
      });
      // console.log(new_tree);
      // console.log(_.map(new_tree,function(o){ return o.text+" "+o.id}));
      // console.log(_.map(vm.treeData,function(o){ return o.text+" "+o.id}));
      vm.menu.info = angular.toJson(new_tree);//angular.toJson(vm.treeData); 
      console.log(new_tree);
      console.log('menu', vm.menu, vm.menu.info);
      if (vm.menu.id !== null) {
        MenuManagement.update(vm.menu, onSaveSuccess, onSaveError);
      } else {
        MenuManagement.save(vm.menu, onSaveSuccess, onSaveError);
      }
    }
    function onSaveSuccess(result) {
      $scope.$emit('LoginsightUiApp.page.menu-management:menuManagementSave', result);
      $uibModalInstance.close(result);
      vm.isSaving = false;
    }
    function onSaveError() {
      vm.isSaving = false;
    }


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


    vm.ignoreChanges = false;

    vm.updateNode = {};
    vm.deleteNode = {};
    vm.dblclickNode = function (i) {//鼠标双击事件
      // console.log('dblclickNode',i);
      vm.ignoreChanges = true;
      var selected = $('#basicTree').jstree(true).get_selected()[0];
      if (selected) {
        var item = _.find(vm.treeData, { 'id': selected });
        // console.log(item, $(this).text());
        vm.updateNode = angular.copy(item);
        vm.deleteNode = angular.copy(item);
        // console.log(vm.updateNode,vm.deleteNode );
      }
      //vm.treeConfig.version++;
    }

    vm.newNode = {};
    vm.addNewNode = function () {
      vm.ignoreChanges = true;
      // console.log(vm.newNode.parent, vm.newNode.text, vm.newNode.stateRef, vm.newNode.icon);
      if (!vm.newNode.text) {
        vm.newNode.error = "名称必填";
        return null;
      }
      if (vm.newNode.parent && !vm.newNode.stateRef) {
        vm.newNode.error = "访问Ref必填";
        return null;
      }
      if (vm.newNode.parent) { //子节点            
        var item = _.max(_.sortBy(_.map(vm.treeData, function (i) { if (i.parent != '#') return parseInt(i.id.substring(1)) })));
        var newId = item + 1;//item!=null?parseInt(item.id.substring(1)) + 1: parseInt(vm.newNode.parent.substring(1))+'1';   
        console.log(item, newId);
        vm.treeData.push({
          id: 'n' + newId, parent: vm.newNode.parent, stateRef: vm.newNode.stateRef,
          text: vm.newNode.text, title: vm.newNode.text, state: { 'opened': true }, level: 1
        });
      } else { //父节点
        var item = _.max(_.sortBy(_.map(vm.treeData, function (i) { if (i.parent == '#') return parseInt(i.id) })));
        var newId = item + 1;
        console.log(item, newId);
        vm.treeData.push({
          id: '' + newId, parent: '#', icon: vm.newNode.icon,
          text: vm.newNode.text, title: vm.newNode.text, state: { 'opened': true }, level: 0
        });
      }
      // vm.basicConfig.version++;
      // console.log(vm.treeData);
      vm.newNode = {};
    };
    vm.clearNewNode = function () {
      vm.newNode = {};
    };

    vm.updateNewNode = function () {
      vm.ignoreChanges = true;
      // console.log(vm.updateNode, vm.updateNode.parent);
      if (!vm.deleteNode.id) {
        vm.deleteNode.error = "双击选择需要修改的菜单节点";
        return null;
      }
      if (!vm.updateNode.text) {
        vm.updateNode.error = "名称必填";
        return null;
      }
      if (vm.updateNode.parent != '#' && !vm.updateNode.stateRef) {
        vm.updateNode.error = "访问Ref必填";
        return null;
      }

      var node = _.find(vm.treeData, { 'id': vm.updateNode.id });
      if (node) {
        if (vm.updateNode.text) {
          node.text = vm.updateNode.text;
          node.title = vm.updateNode.text;
        }
        if (vm.updateNode.parent) node.parent = vm.updateNode.parent;
        if (vm.updateNode.icon) node.icon = vm.updateNode.icon;
        if (vm.updateNode.stateRef) node.stateRef = vm.updateNode.stateRef;
        // console.log(node);
      }
      // vm.basicConfig.version++;
      // console.log(vm.treeData);
      vm.updateNode = {};
      vm.deleteNode = {};
    };

    vm.clearUpdateNode = function () {
      vm.updateNode = {};
    };
    vm.deleteNewNode = function () {
      vm.ignoreChanges = true;
      if (!vm.deleteNode.id) {
        vm.deleteNode.error = "双击选择需要删除的菜单节点";
        return null;
      }
      // console.log(vm.deleteNode);
      var node = _.find(vm.treeData, { 'id': vm.deleteNode.id });
      if (node) {
        if (node.parent != '#') { //子节点  直接删除           
          _.remove(vm.treeData, node);
        } else { //父节点 先查看有没有子节点
          var item = _.find(vm.treeData, { 'parent': vm.deleteNode.id });
          if (item) {
            vm.deleteNode.error = "此菜单节点下还有子菜单，请先移除";
            return null;
          } else {
            _.remove(vm.treeData, node);
          }
        }

      }
      vm.basicConfig.version++;
      vm.deleteNode = {};
      vm.updateNode = {};
    };
    vm.clearDeleteNode = function () {
      vm.deleteNode = {};
    };
    vm.readyCB = function () {
      // $timeout(function() {
      //     vm.ignoreChanges = false;
      //     console.log('success', 'JS Tree Ready', 'Js Tree issued the ready event')
      // });
    };
    vm.renameCB = function (e, item) {
      console.log(e, item);
      var $item = _.find(vm.treeData, { id: item.node.id });
      // console.log($item);
      $item.text = item.node.text;
      // $timeout(function() { console.log('success', 'Node Added', 'Added new node with the text ' + item.node.text)});
    };

    vm.selectnodeCB = function (nodes, selected, event) {
      // console.log('selectnodeCB', nodes,selected,event);  
      var menuData = angular.copy(vm.mainTreeData);
      if (selected.node.parent == '#') {//选中的为父节点
        //先添加父节点，再根据父节点获取子节点添加
        var parentflag = _.find(vm.treeData, { 'id': selected.node.id });
        if (!parentflag) {
          vm.treeData.push(selected.node.original);
        };
        var items = _.filter(menuData, { 'parent': selected.node.id });
        _.forEach(items, function (item) {
          var node = _.find(vm.treeData, { 'id': item.id });
          if (!node) {
            vm.treeData.push(item);
          }
        });
        console.log(selected);
      } else { //选中的为子节点
        //先查看是否已添加此子节点的父节点，先添加父节点再添加子节点
        var parentflag = _.find(vm.treeData, { 'id': selected.node.parent });
        if (!parentflag) {
          var parent = _.find(menuData, { 'id': selected.node.parent });
          if (parent) {
            vm.treeData.push(parent);
          };
        }
        vm.treeData.push(selected.node.original);
      }
    }
    vm.deselectnodeCB = function (nodes, selected, event) {
      // console.log('deselectnodeCB', nodes,selected,event); 
      if (selected.node.parent == '#') {
        _.remove(vm.treeData, { 'id': selected.node.id });
        _.remove(vm.treeData, { 'parent': selected.node.id });
      } else {
        _.remove(vm.treeData, { 'id': selected.node.id });
        var items = _.filter(vm.treeData, { 'parent': selected.node.parent });
        if (items.length == 0) {
          _.remove(vm.treeData, { 'id': selected.node.parent });
        }
      }
    }

    vm.movenodeCB = function (e, d) {
      console.log('movenodeCB--', e, d);
    }


    function getMainTreeData() {
      var mainTree = angular.fromJson(mainTreeData.info);
      _.forEach(vm.treeData, function (d) {
        if (d.parent != '#') {
          var find = _.find(mainTree, { 'id': d.id });
          if (find) find.state.selected = true;
        }
      });
      return mainTree;
    }

    function getDefaultData() {
      return [];
    }
    // console.log(vm.mainTreeData);


  }
})();
