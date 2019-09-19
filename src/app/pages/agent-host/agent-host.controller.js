(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-host')
        // .config(['$uibTooltipProvider', function (uibTooltipProvider) {
        //         uibTooltipProvider.options({
        //             animation: false,
        //             appendToBody: false,
        //             placement: 'bottom-auto',
        //             popupCloseDelay: 0,
        //             popupDelay: 0,
        //         });
        // 　　　　   uibTooltipProvider.setTriggers({ 'mouseenter': 'click' });
        // }])
        .controller('AgentHostController', AgentHostController);

    AgentHostController.$inject = ['$state', 'AgentHost','$scope', '$sce', 'NgTableParams','toastr'];

    function AgentHostController($state, AgentHost,$scope, $sce,NgTableParams,toastr) {

        var vm = this;
        vm.agentHosts = [];
        vm.tooltipShow=false;
        vm.globalSearchTerm = '';
        // table 的参数
        vm.tableParams = new NgTableParams();
        vm.applyGlobalSearch = applyGlobalSearch;
        vm.batchDeploy = batchDeploy;
        vm.selected = [];
        vm.selectAll = selectAll;
        vm.testHost = testHost;
        loadAll();
        function loadAll() {

            vm.dataload=true;

            AgentHost.query(function(result) {
                vm.dataload=false;
                vm.agentHosts = result;
                vm.searchQuery = null;

                vm.tableParams = new NgTableParams(
                    {
                       filter: {},
                       sorting: {},
                       page: 1,//展示第一页
                       count: 10,//每页有15个数据项
                       url: ''
                    },
                    { dataset: vm.agentHosts}
                );


            });

        }

        // 回车的时候触发ng-submit，跟下面的watch二选一就可以
        function applyGlobalSearch(){
            var term = vm.globalSearchTerm;
            // if (vm.isInvertedSearch){
            //   term = "!" + term;
            // }
            console.log(term);
            vm.tableParams.filter({ $: term });
        }

        // 选择全部
        function selectAll(_status) {
            _.forEach(vm.tableParams.data, function(entity) {
                vm.selected[entity.id] = _status;
            })
        }
        // 部署方法
        function batchDeploy() {
            var _result = [];
            _.forEach(vm.selected, function (ids, index) {
                if(ids == true) {
                    _result.push(_.find(vm.tableParams.data, {id: index}));
                } else {
                    console.log(ids);
                }
            })

            $state.go("agent-host.deploy", {hosts: _result});
            // confirm();
            console.log(vm.selected, '--------');
            console.log(_result, '--------');
        }

        // 值变更的时候触发
        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if(newValue != oldValue){
                vm.tableParams.filter({ $: vm.globalSearchTerm });
            }
        });

        $scope.data = {
            current: "0" // 1代表张三，2代表李四，3代表王五
        };
        $scope.tooltipShow=function (param) {
            vm.tooltipShow = true;
            $scope.data.current = param;

        }

        $scope.tooltipClose = function(param){
            vm.tooltipShow = false;
            $scope.data.current = param;

        }

        function testHost(host){
            console.log(host);
            var params={
                ip: host.ip,
                loginMode: host.loginMode,
                passWord: host.loginInfo.passWord,
                port: host.port,
                userName: host.loginInfo.userName
            }

            AgentHost.testHost(params, function (res) {
                vm.isTesting = false;
                if (res.code === 200) {
                    toastr.success('主机测试成功！', '成功提示');
                } else {
                    toastr.error(res.result, '错误提示');
                }
            }, function (err) {
                vm.isTesting = false;
                toastr.error(err.data.message, '错误提示');
            })
        }


    }
})();
