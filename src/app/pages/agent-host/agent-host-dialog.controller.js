(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-host')
        .controller('AgentHostDialogController', AgentHostDialogController);

    AgentHostDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'tagList', 'Tag', 'AgentHost', 'AgentRule', 'Agent', 'toastr', 'FileUploader'];

    function AgentHostDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, tagList, Tag, AgentHost, AgentRule, Agent, toastr, FileUploader) {
        var vm = this;

        vm.agentHost = entity;
        vm.clear = clear;
        vm.save = save;
        vm.testHost = testHost;
        vm.isTesting = false;
        vm.agentrules = AgentRule.query();
        vm.agents = Agent.query();
        vm.loginInfo = {};
        vm.agentHost.port = '22';
        vm.loginInfo.userName = vm.agentHost.loginInfo ? vm.agentHost.loginInfo.userName : '';
        vm.loginInfo.passWord = vm.agentHost.loginInfo ? vm.agentHost.loginInfo.passWord : '';
        vm.uploader = new FileUploader({
            url: "api/agent-upload",
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem("authenticationToken")
            },
            autoUpload: true
        });

        vm.addTagBtn = addTagBtn;
        vm.rmTagBtn = rmTagBtn;
        vm.handleChangeFile = handleChangeFile;
        vm.handleChangeLoginMode = handleChangeLoginMode;

        vm.tagsList = tagList;
        vm.tagInit = vm.agentHost.id != null ? true : false;

        vm.uploader.onCompleteItem = function (fileItem, response, status) {
            console.log(fileItem);
            console.log(response);
            console.log(status);
            if (status == 200) {
                if (response.code == 200) {
                    vm.loginInfo.passWord = response.result;
                }
            }
        };
        getTagList();

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            vm.isSaving = true;
            // vm.agentHost.tags = [];
            // _.forEach(vm.tagNames, function(k){
            //     var flag = _.find(vm.tagsList, {'name': k});
            //     if(flag)vm.agentHost.tags.push(flag);
            // });
            vm.agentHost.loginInfo = {
                userName: vm.loginInfo.userName,
                passWord: vm.loginInfo.passWord,
                cert: vm.loginInfo.cert
            };
            vm.agentHost.loginInfo = angular.toJson(vm.agentHost.loginInfo);
            console.log(vm.agentHost);
            if (vm.agentHost.id) {
                AgentHost.update(vm.agentHost, onSaveSuccess, onSaveError);
                console.log('更新----');
            } else {
                AgentHost.save(vm.agentHost, onSaveSuccess, onSaveError);
                console.log('保存----');
            }

        }

        function onSaveSuccess(result) {
            $scope.$emit('LoginsightUiApp.page.agent-host:agentHostSave', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
            console.log('发送----');

            var msg = vm.agentHost.id ? '修改成功！' : '添加成功！';
            toastr.success(msg, '成功提示');

        }

        function onSaveError() {
            vm.isSaving = false;
            var msg = vm.agentHost.id ? '修改失败！' : '添加失败！';
            toastr.error(msg, '错误提示');
        }

        function addTagBtn(d) {
            console.log('vm.addTagBtn', d);
            $("#tagsinput").tagsinput('add', d.name);
        }

        function rmTagBtn(d) {
            console.log('vm.rmTagBtn', d);
            var flag = _.indexOf(vm.tagNames, d.name);
            // console.log(flag, d.name, vm.tagNames);
            if (flag > -1) {
                toastr.error('', '已关联该标签，删除标签失败！');
            } else {
                deleteTags(d.id);
            }
        }

        function getTagList() {
            Tag.getTagsAlias({name: 'host'}, function (d) {
                vm.tagsList = d;
            }, function (e) {
                console.log('error', e);
            });
        }

        function saveTags() {
            var items = $("#tagsinput").tagsinput('items');
            _.forEach(items, function (name) {
                var bean = {'name': name, 'alias': 'host'};
                var flag = _.find(vm.tagsList, {'name': name});
                // console.log(bean, flag, vm.tagsList);
                if (!flag) {
                    Tag.save(bean, onSuccess, onError);
                }
            });

            function onSuccess(result) {
                getTagList();
            }

            function onError(e) {
                console.log(e);
            }
        }

        function deleteTags(id) {
            if (id) {
                Tag.delete({id: id}, onSuccess, onError);
            }

            function onSuccess(result) {
                console.log('deleteTags', result);
                getTagList();
            }

            function onError(e) {
                console.log(e);
                toastr.error('', '已关联该标签，删除标签失败！');
            }
        }

        function loadTag() {
            _.forEach(vm.agentHost.tags, function (d) {
                console.log(d, d.name);
                $("#tagsinput").tagsinput('add', d.name);
            });
        }

        // $scope.$watch("vm.tagsinput", function (newValue, oldValue) {
        //     console.log(newValue, oldValue);
        //     vm.tagNames = $("#tagsinput").tagsinput('items');
        //     console.log(vm.tagInit , vm.tagNames);
        //     if(vm.tagInit && vm.agentHost.tags){
        //         vm.tagInit = false;
        //         loadTag();
        //     }else if(!vm.tagInit && vm.tagNames.length>0){
        //         saveTags();
        //     }
        // });


        function testHost() {
            vm.isTesting = true;
            var params = {
                loginMode: vm.agentHost.loginMode,
                ip: vm.agentHost.ip,
                port: vm.agentHost.port,
                userName: vm.loginInfo.userName,
                passWord: vm.loginInfo.passWord,
            }
            console.log(params);
            AgentHost.testHost(params, function (res) {
                vm.isTesting = false;
                console.log(res);
                if (res.code === 200) {
                    toastr.success('主机测试成功！', '成功提示');
                } else {
                    toastr.error(res.result, '错误提示');
                }
            }, function (err) {
                vm.isTesting = false;
                console.log(err);
                toastr.error(err.data.message, '错误提示');
            })
        }

        function handleChangeFile(e) {
            console.log(e);
        }

        function handleChangeLoginMode(){
            vm.loginInfo.passWord='';
        }

    }
})();
