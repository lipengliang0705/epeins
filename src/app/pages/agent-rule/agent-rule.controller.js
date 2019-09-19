(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-rule')
        .controller('AgentRuleController', AgentRuleController);

    AgentRuleController.$inject = ['$state', 'AgentRule', '$scope', 'NgTableParams'];

    function AgentRuleController($state, AgentRule, $scope, NgTableParams) {

        var vm = this;
        vm.changeStatus = changeStatus;
        vm.openEdit = openEdit;
        vm.stop = batchStop;
        vm.deploy = batchDeploy;
        vm.start = batchStart;
        vm.selected = {};
        vm.selectAll = selectAll;
        vm.agentRules = [];
        vm.batchStatus = false;
        // table 的参数
        vm.tableParams = new NgTableParams();
        vm.scan = scan;
        loadAll();

        function loadAll() {
            vm.dataload = true;
            AgentRule.query(function (result) {
                vm.dataload = false;
                _.forEach(result, function (v) {
                    v.deployStatus=false;
                    v.conf = angular.fromJson(v.conf || {});
                });
                vm.agentRules = result;
                vm.searchQuery = null;
                vm.tableParams = new NgTableParams(
                    {
                        filter: {},
                        sorting: {},
                        page: 1,//展示第一页
                        count: 10,//每页有15个数据项
                        url: ''
                    },
                    {dataset: vm.agentRules}
                );

            });
        }

        function changeStatus(agentRule) {
            if (agentRule && agentRule.status == "0") {
                var _agentRule = angular.copy(agentRule);
                _agentRule.status = "1";
                AgentRule.startBatchAgentRules([_agentRule.id]);
            } else if (agentRule && agentRule.status == "1") {
                var _agentRule = angular.copy(agentRule);
                _agentRule.status = "0";
                AgentRule.stopBatchAgentRules([_agentRule.id]);
            }
        }

        // 部署方法
        function batchDeploy() {
            var _result = [];
            // _.forEach(vm.selected, function (ids, index) {
            //     if (ids == true) {
            //         _result.push(_.find(vm.tableParams.data, {id: index}));
            //     } else {
            //         console.log(ids);
            //     }
            // })
            _.forEach(vm.selected, function (ids, index) {
                if (ids == true) {
                    console.log(index);
                    vm.tableParams.data.forEach(function (item) {
                        if (item.id == index) {
                            console.log(item);
                            _result.push(item);
                        }
                    })
                    // _result.push(_.find(vm.tableParams.data, {id: index}));
                }
            })


            $state.go("agent-rule.deploy", {hosts: _result});
            // // confirm();
            // console.log(vm.selected, '--------');
            // console.log(_result, '--------');
        }

        function openEdit(id, type) {
            // switch (type.toUpperCase()) {
            //     case 'FILEBEAT':
            //
            //         break;
            //     case 'METRICBEAT':
            //         $state.go('agent-rule.edit-metricbeat', {id: id});
            //         break;
            //     default:
            //         $state.go('agent-rule.edit-flume', {id: id});
            // }

            $state.go('agent-rule.edit-flume', {id: id});
        }

        // 回车的时候触发ng-submit，跟下面的watch二选一就可以
        function applyGlobalSearch() {
            var term = vm.globalSearchTerm;
            // if (vm.isInvertedSearch){
            //   term = "!" + term;
            // }
            console.log(term);
            vm.tableParams.filter({$: term});
        }

        // 选择全部
        function selectAll(_status) {
            _.forEach(vm.tableParams.data, function (entity) {
                vm.selected[entity.id] = _status;
            })
        }

        // 停止方法
        function batchStop() {
            var _result = [];
            // _.forEach(vm.selected, function (ids, index) {
            //     if(ids == true) {
            //         _result.push(_.find(vm.tableParams.data, {id: index}));
            //     }
            // })
            _.forEach(vm.selected, function (ids, index) {
                if (ids == true) {
                    console.log(index);
                    vm.tableParams.data.forEach(function (item) {
                        if (item.id == index) {
                            console.log(item);
                            item.status = "0";
                        }
                    })
                    // _result.push(_.find(vm.tableParams.data, {id: index}));
                }
            })
            // $state.go("agent-rule.batch", {hosts: _result, type: 'stop'});
        }

        // 启动方法
        function batchStart() {
            var _result = [];
            _.forEach(vm.selected, function (ids, index) {
                if (ids == true) {
                    console.log(index);
                    vm.tableParams.data.forEach(function (item) {
                        if (item.id == index) {
                            console.log(item);
                            item.status = "1";
                        }
                    })
                    // _result.push(_.find(vm.tableParams.data, {id: index}));
                }
            })

            // $state.go("agent-rule.batch", {hosts: _result, type: 'start'});
        }

        // 值变更的时候触发
        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if (newValue != oldValue) {
                vm.tableParams.filter({$: vm.globalSearchTerm});
            }
        });
        $scope.$watch("vm.selected", function (newValue) {
            console.log(newValue);
            Object.keys(newValue).some(function (key) {
                console.log(key);
                if (newValue[key]) {
                    return vm.batchStatus = true;

                } else {
                    vm.batchStatus = false;
                }
            })
        }, true);

        function scan(item) {
            item.scaning = true;
            setTimeout(function () {
                console.log(item);
                $scope.$apply(function(){
                    item.scaning = false;
                });

            }, 3000)
        }

        $scope.$on('deploy-success',function (e,index) {
            console.log(e);
        });
    }

})();
