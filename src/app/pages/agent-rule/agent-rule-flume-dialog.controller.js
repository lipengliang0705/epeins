(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-rule')
        .controller('AgentRuleFlumeDialogController', AgentRuleFlumeDialogController);

    AgentRuleFlumeDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'AgentRule', 'DataSource', 'AgentHost', 'Category', 'DATA_DICTIONARY'];

    function AgentRuleFlumeDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, AgentRule, DataSource, AgentHost, Category, DATA_DICTIONARY) {
        console.log(DATA_DICTIONARY);


        var vm = this;

        vm.agentRule = entity;
        //获取数据字典中的部署路径
        if (DATA_DICTIONARY.list && DATA_DICTIONARY.list.length > 0) {
            vm.agentRule.deployPath = DATA_DICTIONARY.list.filter(function (item) {
                return item.dictKey === "agentInstallPath";
            })[0].dictValue;
        }

        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.datasources = DataSource.query();
        vm.agenthosts = AgentHost.query();
        vm.categories = Category.query();
        vm.getAgentRuleByTemplet = getAgentRuleByTemplet;
        vm.handleChangeFile = handleChangeFile;
        vm.handleChangeScriptFile = handleChangeScriptFile;
        vm.handleChangeAgentHost = handleChangeAgentHost;

        // vm.agentRule.status == 1 ? vm.agentRule.status = 1 : vm.agentRule.status = 0;

        // 默认类型为flume
        // if (vm.agentRule.ruleType == undefined) vm.agentRule.ruleType = "FLUME";
        // // 默认字符集 utf-8
        // if (vm.agentRule.conf == null) {
        //     vm.agentRule.conf = {};
        //     vm.agentRule.conf.charSet = "utf-8";
        // }

        // vm.agentRule.conf = angular.fromJson(vm.agentRule.conf || {});
        //
        // vm.agentRule.conf.deserializer = vm.agentRule.conf.deserializer || 'line';
        // vm.agentRule.conf.isSkipToEnd = vm.agentRule.conf.isSkipToEnd || true;
        // $timeout(function () {
        //     angular.element('.form-group:eq(1)>input').focus();
        // });

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            console.log(vm.agentRule);

            vm.isSaving = true;
            // var _agentRule = angular.copy(vm.agentRule);
            var _agentRule = {
                "agentHost": vm.agentRule.agentHost,
                "name": vm.agentRule.name,
                "deployPath": vm.agentRule.deployPath,
                "description": vm.agentRule.description,
                status: vm.agentRule.status || '1'
            };

            if (vm.agentRule.id) _agentRule.id = vm.agentRule.id;

            _agentRule.agentHost.loginInfo = angular.toJson(_agentRule.agentHost.loginInfo);
            // if (_agentRule.sourceType == 'spool') {
            //     if (_agentRule.conf.tailFile) delete _agentRule.conf['tailFile'];
            //     if (_agentRule.conf.isSkipToEnd) delete _agentRule.conf['isSkipToEnd'];
            // } else if (_agentRule.sourceType == 'tail') {
            //     if (_agentRule.conf.spoolDir) delete _agentRule.conf['spoolDir'];
            // }
            // _agentRule.conf = angular.toJson(_agentRule.conf);
            // // agentRule.agentHost.loginInfo = angular.toJson(agentRule.agentHost.loginInfo);
            // if (typeof _agentRule.agentHost.loginInfo != "string") {
            //     _agentRule.agentHost.loginInfo = angular.toJson(_agentRule.agentHost.loginInfo);
            // }
            if (_agentRule.id) {
                AgentRule.update(_agentRule, onSaveSuccess, onSaveError);
            } else {
                AgentRule.save(_agentRule, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            $scope.$emit('LoginsightUiApp.page.alarm-rule:agentRuleUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError() {
            vm.isSaving = false;
        }


        vm.selecttemplate = vm.agentRule.id != null ? true : false;
        vm.selecttemplateName = vm.agentRule.id != null ? "Flume" : "";

        function getAgentRuleByTemplet(name) {
            if (name) {
                vm.selecttemplate = true;
                vm.selecttemplateName = name;
            }

        }


        vm.datePickerOpenStatus.createdTime = false;
        vm.datePickerOpenStatus.modifiedTime = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        function handleChangeFile(e) {
            var file = e.target.files[0];

            var reader = new FileReader();
            reader.readAsText(file);

            reader.onload = function (d) {
                console.log(d);
                $scope.$apply(function () {
                    vm.agentRule.configText = d.target.result;
                })
            }
        }

        function handleChangeScriptFile(e) {
            var file = e.target.files[0];

            var reader = new FileReader();
            reader.readAsText(file);

            reader.onload = function (d) {
                console.log(d);
                $scope.$apply(function () {
                    vm.agentRule.scriptFileText = d.target.result;
                })
            }
        }

        function handleChangeAgentHost() {
            console.log(vm.agentRule.agentHost);
            vm.agentRule.name = vm.agentRule.agentHost.name;
            vm.agentRule.deployPath += '/' + vm.agentRule.agentHost.name.deployPath;
        }
    }
})();
