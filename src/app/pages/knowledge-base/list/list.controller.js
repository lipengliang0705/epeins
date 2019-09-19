(function () {
    'use strict';
    /**
     * @ 知识库列表
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.knowledge-base');
    app.controller("knowledgeBaseListController", knowledgeBaseListController);
    knowledgeBaseListController.$inject = ['knowledgeBaseService', 'toastr', '$filter', '$rootScope', '$uibModal', '$scope', 'NgTableParams'];

    function knowledgeBaseListController(knowledgeBaseService, toastr, $filter, $rootScope, $uibModal, $scope, NgTableParams) {
        var vm = this;
        vm.data = {
            kcategoryId:'',
            search: '',
            selectedIndex: -1,   // 选中的索引
            dateRange: {},
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
            },
            pageParams: {
                page: 1, //展示第一页
                count: 10, //每页有15个数据项
            },
            tableParams: null
        }

        vm.resoures = {
            list: [],//知识库信息列表
        };
        vm.filterData = {
            list: [],//知识库信息列表
        };
        vm.kcategory = {
            list: [],//知识库分类信息列表
        };

        vm.method = {
            showAddClassifyModal: showAddClassifyModal,
            categoryUpdateModal: categoryUpdateModal,
            categoryDeleteModal: categoryDeleteModal,
            showDeleteModal: showDeleteModal,
            checkKnowledgeModal: checkKnowledgeModal,
            search: search,
            getkcategoryId: getkcategoryId,
            selectedMenu: selectedMenu,
        }
        // 页面初始化
        function init() {
            //vm.resources.list = _getStorage();
            //knowledgeBaseInfo();
            categoryallInfo();
            checkKnowledgeAll();
            //getDefaulTime();
        }
        /*** 新增知识库分类*/
        function showAddClassifyModal(item) {
            //console.log(item)
            $uibModal.open({
                templateUrl: 'app/pages/knowledge-base/addClassify/addClassify.html',
                controller: 'addClassifyController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    transferData: item
                }
            });
        }

        /*** 修改知识库分类*/
        function categoryUpdateModal(item) {
            //console.log(item)
            $uibModal.open({
                templateUrl: 'app/pages/knowledge-base/category-update/category-update.html',
                controller: 'categoryUpdateController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    transferData: item
                }
            });
        }
        /*** 删除知识库分类*/
        function categoryDeleteModal(item) {
            //console.log('测试',item)
            if (item.count > 0) {
                toastr.warning('该知识库分类有成员，清空成员后才能删除分类！', '消息提示');
            } else {
                $uibModal.open({
                    templateUrl: 'app/pages/knowledge-base/category-delete/category-delete.html',
                    controller: 'categoryDeleteController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        transferData: item
                    }
                });
            }
        }
        /*** 查看知识库*/
        function checkKnowledgeModal(item) {
            //console.log(item)
            $uibModal.open({
                templateUrl: 'app/pages/knowledge-base/check-knowledge/check-knowledge.html',
                controller: 'checkKnowledgeController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'xlg',
                resolve: {
                    transferData: item
                }
            });
        }
        /**
        * 删除图表
        */
        function showDeleteModal(id) {
            $uibModal.open({
                templateUrl: 'app/pages/knowledge-base/delete/delete.html',
                controller: 'knowledgeBaseDeleteController',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: id
                }
                
            });
        }
        

        function search() {
            if (vm.data.title || vm.data.dateRange) {
                var params = { 
                    categoryId: '', 
                    knowledge:'', 
                    // beginTime: moment(vm.data.dateRange.startDate).format("YYYY-MM-DD HH:mm:ss"),
                    // endTime: moment(vm.data.dateRange.endDate).format("YYYY-MM-DD HH:mm:ss")
                    beginTime:'',
                    endTime:'',
                };
                //判断是否为空
                if(vm.data.title){
                    params.knowledge = vm.data.title;
                }
                if(vm.data.dateRange.startDate){
                    params.beginTime = moment(vm.data.dateRange.startDate).format("YYYY-MM-DD HH:mm:ss");
                }if(vm.data.dateRange.endDate){
                    params.endTime = moment(vm.data.dateRange.endDate).format("YYYY-MM-DD HH:mm:ss");
                }

                console.log(66666667777, params);
                vm.resoures.list = [];
                knowledgeBaseService.checkKnowledgeAll(params, function (res) {
                    console.log(8888889999992222, res);
                    //查询列表
                    vm.resoures.list = res;
                    vm.data.tableParams = new NgTableParams(vm.data.pageParams, {
                        dataset: vm.resoures.list
                    })
                })
            }
            //getDefaulTime();
        }
        //开始结束时间
        function getDefaulTime() {
            var begin = function () {
                var now = new Date();
                now.setDate(now.getDate() - 1);
                var time = $filter('date')(now, "yyyy-MM-dd");
                return time + " 00:00:00";
            };
            var end = function () {
                var now = new Date();
                var time = $filter('date')(now, "yyyy-MM-dd");
                return time + " 00:00:00";
            };
            vm.data.dateRange.startDate = new Date(begin());
            vm.data.dateRange.endDate = new Date(end());
        }
        // 查询所有知识库分类列表
        function categoryallInfo() {
            knowledgeBaseService.categoryallInfo({}, function (res) {
                console.log(888888, res);
                vm.kcategory.list = res;
            })
        }

        //查询所有知识分类列表
        function checkKnowledgeAll() {
            knowledgeBaseService.checkKnowledgeAll({ categoryId: '', knowledge: '', beginTime: '', endTime: '' }, function (res) {
                console.log(888888999999, res);
                var len = 30;
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

                vm.data.tableParams = new NgTableParams(vm.data.pageParams, {
                    dataset: vm.resoures.list
                })
            })
        }

        /**
         * 切换选中的列表
         * @param {*} index 
         */
        function selectedMenu(index){
            vm.data.selectedIndex = index;
        }


        //新建列表
        $rootScope.$on('addKnowledgeBaseSuccess', function (event, data) {
            vm.resoures.list.push(data);
            //knowledgeBaseInfo();
        });

        // 新建知识库分类成功
        $rootScope.$on('createKcategorySuccess', function (event, data) {
            categoryallInfo();
        })
        // 修改知识库分类成功
        $rootScope.$on('modifyKcategorySuccess', function (event, data) {
            categoryallInfo();
        })
        // 删除知识库分类成功
        $rootScope.$on('deleteKcategorySuccess', function (event, data) {
            categoryallInfo();
        })
        // 修改列表
        $rootScope.$on('modifyKnowledgeBaseSuccess', function (event, data) {

        })

        $rootScope.$on('deleteKnowledgeBaseSuccess', function (event, data) {
            console.log('没刷新',data);
            //重新获取知识库列表数据
            //knowledgeBaseInfo();
            
            if(vm.data.kcategoryId){
                getkcategoryId(vm.data.kcategoryId);
            }
            else{
                checkKnowledgeAll();
            }
            categoryallInfo();
        })

        // 表格搜索
        // $scope.$watch("vm.data.search", function (newValue, oldValue) {
        //     if (newValue == undefined) {
        //         vm.data.tableParams.filter({});
        //     } else if (newValue != oldValue) {
        //         vm.data.tableParams.filter({ $: vm.data.search });
        //     }
        // });
        //通过知识库字段分类查询列表
        function getkcategoryId(id) {
            //获取分类id值
            vm.data.kcategoryId = id;
            console.log('选择的id', id);
            // 统分类数
            var params = {
                categoryId: '',
                knowledge: '',
                beginTime: '',
                endTime: ''
            };
            //分类展示列表数据
            knowledgeBaseService.checkKnowledgeAll(params, function (res) {
                //console.log(888888999999, res);
                var len = 30;
                vm.resoures.list = [];  //清空之前列表数据数据
                //添加筛选列表
                angular.forEach(res, function (item, index) {
                    if (id == item.knowledgeCategory.id) {
                        console.log('当前分类', item);
                        var ele = $('<div>' + item.content + '</div>');
                        var text = ele.text();
                        if (item.content && text.length > len) {
                            item.subTitle = text.substring(0, len) + '...';
                        } else if (item.content && text.length <= len) {
                            item.subTitle = text;
                        } else {
                            item.subTitle = '';
                        }
                        vm.resoures.list.push(item);
                    }
                });
                vm.data.tableParams = new NgTableParams(vm.data.pageParams, {
                    dataset: vm.resoures.list
                })
            })
        }
        init();
    }
})();