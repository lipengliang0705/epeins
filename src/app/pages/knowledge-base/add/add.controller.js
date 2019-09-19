(function () {
    'use strict';
    /**
     * @ 新增知识库
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.controller("knowledgeBaseAddController", knowledgeBaseAddController);
    knowledgeBaseAddController.$inject = ['knowledgeBaseService', 'toastr', '$rootScope', '$state', '$stateParams'];

    function knowledgeBaseAddController(knowledgeBaseService, toastr, $rootScope, $state, $stateParams) {
        var vm = this;
        vm.data = {
            title: '',
            content: 'dsdsdsd',
            labels: '',
            createdTime: new Date(),
            modifiedTime: new Date(),
            createdBy: '',
            editor: null,
            kcategory: [],
        }

        vm.data.editor = new window.wangEditor('#ueditor');
        //如果需要使用 base64 编码直接将图片插入到内容中，可参考一下示例配置
        vm.data.editor.customConfig.uploadImgShowBase64 = true;
        vm.data.editor.create();

        // 方法
        vm.method = {
            submit: submit,
            cancel: cancel,
        }

        function init() {
            getAccount();
            kcategorySelect();
        }
        //筛选分类
        function kcategorySelect() {
            knowledgeBaseService.categoryallInfo({}, function (res) {
                vm.data.kcategory = res;
                console.log(888888999991, res);
            })

        }
        //保存
        function submit() {
            getContent();
            // 获取到你输入的数据
            var item = {
                title: vm.data.title,
                labels: vm.data.labels,
                content: vm.data.content,
                // createdTime: vm.data.createdTime,
                // modifiedTime: vm.data.modifiedTime,
                // createdBy: vm.data.createdBy,
                knowledgeCategory: vm.data.knowledgeCategory,
            }

            console.log(item);

            // 调接口，储存
            knowledgeBaseService.createKnowledgeBase(item, function (res) {
                console.log(res);
                if (res.status == 0) {
                    // 储存成功后，跳转到列表页，并且刷新页面
                    toastr.success('添加成功！', '成功提示');
                    $state.go('knowledge-base-list');
                }

            })
        }

        // 获取富文本内容
        function getContent() {
            vm.data.content = vm.data.editor.txt.html()
        }

        // 获取当前登录用的信息
        function getAccount() {
            knowledgeBaseService.account({}, function (res) {
                if (res.id) {
                    vm.data.createdBy = res.login;
                }
            })
        }

        // 返回
        function cancel() {
            history.back()
        }

        init();
    }
})();