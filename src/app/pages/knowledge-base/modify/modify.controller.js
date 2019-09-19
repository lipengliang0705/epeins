(function () {
    'use strict';
    /**
     * @ 修改知识库
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.controller("knowledgeBaseModifyController", knowledgeBaseModifyController);
    knowledgeBaseModifyController.$inject = ['knowledgeBaseService', 'toastr', '$state', '$stateParams'];

    function knowledgeBaseModifyController(knowledgeBaseService, toastr, $state, $stateParams) {
        var vm = this;
        console.log(9999999222,$stateParams);
        vm.data = {
            id: $stateParams.id,
            editor: null,
            createdBy: '',
            details: [],
            kcategory: [],
        }

        vm.data.editor = new window.wangEditor('#ueditor');
        //如果需要使用 base64 编码直接将图片插入到内容中，可参考一下示例配置
        vm.data.editor.customConfig.uploadImgShowBase64 = true;
        vm.data.editor.create();

        vm.method = {
            submit: submit,
            cancel: cancel,
        }

        function init() {
            getItemById(vm.data.id);
            kcategorySelect();
        }

        //保存修改信息
        function submit() {
            getContent();
            var item = {
                id: vm.data.id,
                title: vm.data.details.title,
                labels: vm.data.details.labels,
                content: vm.data.details.content,
                // createdTime: vm.data.details.createdTime,
                // modifiedTime: new Date(),
                // createdBy: vm.data.details.createdBy,
                knowledgeCategory:vm.data.details.knowledgeCategory,
            }

            // 调接口，储存
            knowledgeBaseService.modifyKnowledgeBase(item, function (res) {
                console.log(res);
                if (res.status == 0) {
                    // 储存成功后，跳转到列表页，并且刷新页面
                    toastr.success('修改成功', '成功提示');
                    $state.go('knowledge-base-list');
                }
            })
        }
        //筛选分类
        function kcategorySelect(){
            knowledgeBaseService.categoryallInfo({}, function (res) {
                vm.data.kcategory = res;
            })

        }
        // 根据id获取详情
        function getItemById(id) {
            knowledgeBaseService.checkKnowledgeBase({ id: id }, function (res) {
                console.log(888888999991, res);
                vm.data.details = res;
                // 赋值
                setContent(vm.data.details.content);
            })
        }

        // 获取富文本内容
        function getContent() {
            vm.data.details.content = vm.data.editor.txt.html();
        }

        // 设置富文本内容
        function setContent(str) {
            vm.data.editor.txt.html(str);
        }

        // 返回上一页
        function cancel(){
            history.back();
        }

        init();
    }
})();