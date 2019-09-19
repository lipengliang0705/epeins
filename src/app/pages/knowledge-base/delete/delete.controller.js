(function () {
    'use strict';
    /**
     * @ 删除知识库
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.controller("knowledgeBaseDeleteController", knowledgeBaseDeleteController);
    knowledgeBaseDeleteController.$inject = ['$uibModalInstance', 'knowledgeBaseService', 'transferData', '$rootScope', 'toastr'];

    function knowledgeBaseDeleteController($uibModalInstance, knowledgeBaseService, transferData, $rootScope, toastr) {
        var vm = this;
        console.log(transferData);
        vm.id = transferData;

        vm.method = {
            submit: submit,
            cancel: cancel
        }
        // function knowledgeBaseInfo() {
        //     knowledgeBaseService.deleteKnowledgeBase({}, function (res) {
        //         console.log(11111);
        //     })
        // }
        // knowledgeBaseInfo();
        function submit(id) {
            // newDashboardService.add({}, function (res) {
            //     console.log(res);
            //     if (res.httpCode === 200) { }
            // })
            knowledgeBaseService.deleteKnowledgeBase({ id: id }, function (res) {
                //alert(111111);
                //console.log(res.id);
                if (res.status == 1) {
                    //res.id = transferData;
                    //res.splice(res.id,1);
                    //请求删除数据
                    $rootScope.$broadcast('deleteKnowledgeBaseSuccess',transferData);
                    toastr.success('删除成功！', '成功提示');
                    // 关闭
                    cancel();
                }

            });
            //$rootScope.$broadcast('deleteKnowledgeBaseSuccess', transferData);

            //console.log(transferData)


        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();