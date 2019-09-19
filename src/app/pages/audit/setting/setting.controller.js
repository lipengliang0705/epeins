(function () {
    'use strict';

    var app = angular.module('LoginsightUiApp.page.audit');
    app.controller("SettingController", SettingController);
    SettingController.$inject = ['$uibModalInstance', 'toastr', '$rootScope', '$state', 'EventRule', 'entry', 'AgentHost','AuditService'];

    function SettingController($uibModalInstance, toastr, $rootScope, $state, EventRule, entry, AgentHost,AuditService) {
        var vm = this;



        vm.serverId ={};
        vm.fortersIp = {};
        if(entry.id){
            vm.serverId =angular.fromJson(entry.serverId);
            vm.fortersIp =angular.fromJson(entry.fortersIp);
        }
        console.log( vm.serverId);
        console.log( vm.fortersIp);
        vm.hosts = [];

        vm.method = {
            submit: submit,
            cancel: cancel,
        }

        loadAll();

        function loadAll() {
            getHost();
        }

        function getHost() {
            AgentHost.query(function (result) {
                if (result) {
                    vm.hosts = result;
                }
            });
        }

        function submit() {


            if(entry.id){
                update();
            }else{
                add();
            }
        }

        function add() {
            var params = {
                serverId: angular.toJson(vm.serverId),
                fortersIp:angular.toJson(vm.fortersIp),
            };
            AuditService.gatewayCreate(params,function (res) {
                $rootScope.$broadcast('audit:setting-success',params);
                // 关闭
                cancel();
                toastr.success('设置成功！','成功提示');

            },function (err) {
                toastr.error('设置失败！','失败提示');
            });
        }

        function update() {
            var params = {
                id:entry.id,
                serverId: angular.toJson(vm.serverId),
                fortersIp:angular.toJson(vm.fortersIp),
            };
            AuditService.gatewayUpdate(params,function (res) {
                $rootScope.$broadcast('audit:setting-success',params);
                // 关闭
                cancel();
                toastr.success('设置成功！','成功提示');

            },function (err) {
                toastr.error('设置失败！','失败提示');
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();