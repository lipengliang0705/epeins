(function () {
    'use strict';
    /**
     * @ 查看知识库
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.controller("knowledgeBaseController", knowledgeBaseController);
    knowledgeBaseController.$inject = ['$scope', 'knowledgeBaseService', '$stateParams', '$state'];

    function knowledgeBaseController($scope, knowledgeBaseService, $stateParams, $state) {
        var vm = this;

        vm.data = {
            index: 1,
            search: '',
            date: '',
            dateRangeOptions: {
                "opens": "left",
                "timePicker": true,
                "timePicker24Hour": true,
                "ranges": {
                    '15分钟前': [moment().subtract(15, 'minute'), moment()],
                    '1个小时前': [moment().subtract(1, 'hour'), moment()],
                    '一天前': [moment().subtract(1, 'day'), moment()],
                    '三天前': [moment().subtract(3, 'day'), moment()],
                    '一周前': [moment().subtract(1, 'week'), moment()],
                    '当天': [moment().startOf('days'), moment()],
                    '当月': [moment().startOf('month'), moment().endOf('month')]
                },
                "locale": {
                    "format": "YYYY-MM-DD HH:mm:ss",
                    "separator": " ~ ",
                    "applyLabel": "应用",
                    "cancelLabel": "取消",
                    "fromLabel": "From",
                    "toLabel": "To",
                    "customRangeLabel": "自定义",
                    "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                    "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    "firstDay": 1
                }
            }
        }
        vm.labelArr = [];
        vm.resoures = {
            list: [], //知识库信息列表
            details: [],  // 知识详情
        }

        vm.method = {
            getId: getId
        }

        // 页面初始化
        function init() {
            knowledgeBaseInfo();
        }

        // 知识库信息列表
        function knowledgeBaseInfo() {
            knowledgeBaseService.knowledgeBaseInfo({}, function (res) {

                //找到集合中的每一条数据，如果状态为0储存起来，1不处理
                // vm.resoures.list = [];//清空之前列表数据数据
                // res.forEach(function (each) {
                //     if (each.status === 0) {
                //         vm.resoures.list.push(each);
                //     }
                // });
                var len = 50;

                // 截取描述
                angular.forEach(res, function (item, index) {
                    var ele = $('<div>' + item.content + '</div>');
                    var text = ele.text();
                    if (item.content && text.length > len) {
                        item.subTitle = text.substring(0, len) + '...';
                    } else if (item.content && text.length <= len) {
                        item.subTitle = text;
                    } else {
                        item.subTitle = '';
                    }
                });

                vm.resoures.list = res;

                var knowledgeId = localStorage.getItem('knowledgeId');

                if (knowledgeId) {
                    checkKnowledgeBase(knowledgeId);
                    localStorage.removeItem('knowledgeId');
                } else {
                    checkKnowledgeBase(vm.resoures.list[0].id);
                }
            })
        }

        // 根据ID查询知识库
        function checkKnowledgeBase(id) {
            knowledgeBaseService.checkKnowledgeBase({ id: id }, function (res) {
                // 结果，
                // 结果赋值给一给变量
                vm.resoures.details = res;
                //字符串转换为数组
                if (vm.resoures.details.labels !== null) {
                    vm.labelArr = vm.resoures.details.labels.split(',');
                }
                //console.log(vm.labelArr);
                // 展示变量里面的数据字段(通过{{vm.resoures.details.变量名}}展示字段)

            })
        }

        // 点击累积view人数
        function viewKnowledgeBase(id) {
            knowledgeBaseService.viewKnowledgeBase({ id: id }, function (res) {
                // 结果，
                vm.resoures.list.viewCount = res.viewCount;
                console.log(res);
            })
        }

        function getId(id) {
            // 统计阅读次数
            viewKnowledgeBase(id);

            checkKnowledgeBase(id);
            // $state.go('knowledge-base', { id: id });

            // knowledgeBaseInfo();
        }

        init();
    }
})();