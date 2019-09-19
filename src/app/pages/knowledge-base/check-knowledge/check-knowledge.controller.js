(function() {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.controller("checkKnowledgeController", checkKnowledgeController);
    checkKnowledgeController.$inject = ['$uibModalInstance', 'knowledgeBaseService', 'transferData', 'toastr', '$rootScope', '$state'];

    function checkKnowledgeController($uibModalInstance, knowledgeBaseService, transferData, toastr, $rootScope, $state) {
        var vm = this;
        vm.data = {
            id: transferData.id,
            title:transferData.title,
            content:transferData.content,
            createdTime:transferData.createdTime,
            modifiedTime:transferData.modifiedTime,
            editor: null,
            details: [],
        }
        //截取描述
        // var len =1500;
        // vm.check = transferData;
        // var ele = $('<div>' + vm.check.content + '</div>');
        // var text = ele.text();
        // if (vm.check.content && text.length > len) {
        //     vm.check.subContent = text.substring(0, len) + '...';
        // } else if (vm.check.content && text.length <= len) {
        //     vm.check.subContent = text;
        // } else {
        //     vm.check.subContent = '';
        // }
       
        vm.method = {
            //submit: submit,
            cancel: cancel
        }
        function init() {
            //setContent(vm.data.content);
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        // 设置富文本内容
        // function setContent(str) {
        //     vm.data.editor.txt.html(str);
        // }
        init();
    }
})();