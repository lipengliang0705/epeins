(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-host')
        .controller('AgentHostMultipleController', AgentHostMultipleController);

    AgentHostMultipleController.$inject = ['$scope', '$uibModalInstance', 'entity', 'AgentHost', 'FileUploader', 'NgTableParams', 'Agent', 'toastr'];

    function AgentHostMultipleController($scope, $uibModalInstance, entity, AgentHost, FileUploader, NgTableParams, Agent, toastr) {
        var vm = this;

        vm.agentHost = entity;
        vm.clear = clear;
        vm.hostList = [];
        vm.status = 0;
        vm.confirm = confirm;
        vm.tableParams = new NgTableParams();
        vm.agents = Agent.query();

        vm.cancel = cancel;
        vm.del = del;
        vm.save = save;

        // 表格编辑 - 取消
        function cancel(row, rowForm) {
            var originalRow = resetRow(row, rowForm);
            angular.extend(row, originalRow);
        }
        // 表格编辑 - 删除
        function del(row) {
            _.remove(vm.tableParams.settings().dataset, function(item) {
                return row === item;
            });
            vm.tableParams.reload().then(function(data) {
                if (data.length === 0 && vm.tableParams.total() > 0) {
                    vm.tableParams.page(vm.tableParams.page() - 1);
                    vm.tableParams.reload();
                }
            });
        }
        // 表格编辑 - 重置
        function resetRow(row, rowForm) {
            row.isEditing = false;
            rowForm.$setPristine();
            // vm.tableTracker.untrack(row);
            return _.findWhere(originalData, function(r) {
                return r.id === row.id;
            });
        }
        // 表格编辑 - 保存
        function save(row, rowForm) {
            var originalRow = resetRow(row, rowForm);
            angular.extend(originalRow, row);
        }
        vm.uploader = new FileUploader({
            url: "api/batch-agent-hosts",
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem("authenticationToken")
            },
            autoUpload: true
        });

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirm() {
            var list = [];
            var _agentHost = angular.copy(vm.tableParams.data);
            _.forEach(_agentHost, function(agentHost) {
                if (agentHost.selectAgent) {
                    agentHost.agents[0] = angular.fromJson(agentHost.selectAgent);
                    delete agentHost.selectAgent;
                    list.push(AgentHost.save(agentHost).$promise);
                }
            });
            Promise.all(list).then(function(d){
                console.log("d", d);
                toastr.success('',d.length + '台主机，导入成功！');
                $uibModalInstance.close(true);
            })

        }
        vm.uploader.onSuccessItem = function(item, response, status, headers) {
            if (status == 200) {
                vm.status = 1;
                vm.hostList = response;
                vm.originalData = angular.copy(response);
                vm.tableParams = new NgTableParams({}, {
                    dataset: angular.copy(response)
                });
            } else {
                alert("读取数据失败！");
            }
        }

        $scope.$watch("vm.defaultSelected", function(now) {
            console.log("now", now);
            console.log("vm.tableParams.data", vm.tableParams);
            if (now) {
                (vm.tableParams.data || []).map(function (d) {
                    d.selectAgent = now
                });
            }
        }, true);
    }
})();
