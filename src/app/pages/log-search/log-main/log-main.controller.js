(function () {
    'use strict';
    /**
     * @ 选择业务系统
     * Author:Veiss Date:2019/6/23
     *  */
    var app = angular.module('LoginsightUiApp.page.logSearch');
    app.controller("logSearchMainCtrl", logSearchMainCtrl);

    logSearchMainCtrl.$inject = ['$uibModalInstance', '$state', '$scope', 'toastr', 'EsService', 'EventRule', 'Category', '$q', 'NgTableParams', 'DATA_DICTIONARY', '$rootScope'];

    function logSearchMainCtrl($uibModalInstance, $state, $scope, toastr, EsService, EventRule, Category, $q, NgTableParams, DATA_DICTIONARY, $rootScope) {
        var vm = this;

        vm.data = {
            categoryList: [],       // 业务列表
            categoryCoreList: [],   // 核心业务
            pageParams: {
                page: 1,            // 展示第一页
                count: 5,           // 每页有15个数据项
            },
            tableParams: null,
            tab: [
                { name: '核心业务' },
                { name: '一般业务' }
            ],
            selectedIndex: 0,         // 选中的tab
            search: '',
            historyList: [],          // 历史数据
            localHistoryName: '__CATEGORYHISTORY__',     // 储存到本地的名称
        }


        vm.method = {
            selectedTab: selectedTab,           // 切换业务 
            logQuery: logQuery,                 // 日志查询
            cancel: cancel,                     // 关闭弹框
        };

        function init() {
            getLocalStorge();                   // 获取本地数据
            getCategories();
            getCategoryList();
            getCategoryCoreList();
        }

        // 获取全部的业务列表
        function getCategories() {
            // 所有的业务
            Category.query({}, function (res) {
                // console.log('所有的业务', res);
                var result = [];
                $q.all(getIndexByCategory(res)).then(function (response) {
                    // console.log('获取到的索引列表', response);
                    // 组装数据,
                    angular.forEach(res, function (item, index) {
                        for (var i in response) {
                            if (item.alias == response[i].name) {
                                item.indexes = response[i].indexes;
                            }
                        }
                    })

                    // 拆解数据，成二级业务
                    angular.forEach(res, function (item, index) {
                        // 根据索引解析二级节点，在根据二级节点解析日志类型
                        var sub = sliceCategory(item);
                        // console.log('返回的数据', sub);
                        if (_.isArray(sub)) {
                            result = result.concat(sub);
                        } else {
                            result.push(sub);
                        }
                    })

                    // 提取子业务下面的索引
                    angular.forEach(result, function (item, index) {
                        item.indexNameList = getIndexName(item);
                    })

                    // console.log('组装好的数据', result);

                    // 区分核心业务和一般业务
                    vm.data.tableParams = new NgTableParams(vm.data.pageParams, {
                        counts: [5, 10, 15, 20],
                        dataset: filterData(result, vm.data.selectedIndex, vm.data.categoryCoreList)
                    })
                })
            });
        }

        // 根据解析规则获取业务下面的所有index
        function getIndexByCategory(res) {
            var result = [];
            angular.forEach(res, function (item, index) {
                result.push(function () {
                    var deferred = $q.defer();
                    EsService.getIndexByName.post({ 'indexName': item.alias + '_*' }, function (res) {
                        var formatData = res.result;
                        var objectResult = {
                            indexes: []
                        };
                        if (formatData.length) {
                            angular.forEach(formatData, function (item, index) {
                                objectResult.indexes.push(item.index);
                            })
                        }
                        objectResult.name = item.alias;
                        // objectResult.indexes = objectResult.indexes.length ? stringToArray(objectResult.indexes) : [];
                        deferred.resolve(objectResult);
                    }, function (err) {
                        deferred.resolve({ name: item.alias, indexes: [] });
                    })
                    return deferred.promise;
                }())
            })
            return result;
        }

        // 解析索引 把主业务分解成很多个子业务
        function sliceCategory(data) {
            // console.log(data);
            var indexes = data.indexes;
            var obj = {};
            var subType = [];
            var result = [];
            if (indexes.length == 0) {
                obj = data;
            } else {
                // 如果有时间，去掉时间，如果没有时间直接返回
                angular.forEach(indexes, function (item, index) {
                    // 切掉时间
                    var nameArr = item.split('-')[0].split('_');
                    if (subType.indexOf(nameArr[1]) == -1) {
                        // 子业务
                        subType.push(nameArr[1]);
                    }
                });

                // data.key = key;
                // console.log('二级业务', subType);

                // 一级业务拆解成二级业务
                angular.forEach(subType, function (item, index) {
                    var dataCopy = angular.copy(data);
                    dataCopy.sub = {
                        zh: getSubCategoryName(dataCopy, vm.data.categoryList, item),
                        en: item
                    };
                    result.push(dataCopy);
                })
                // console.log(result);
                obj = result;
            }
            return obj;
        }

        // 获取静态数据分类
        function getCategoryList() {
            var name = 'categoryList';
            angular.forEach(DATA_DICTIONARY.list, function (item, index) {
                if (item.dictKey == name) {
                    vm.data.categoryList = JSON.parse(item.dictValue);
                    // console.log('获取静态数据字典', vm.data.categoryList);
                }
            })
        }

        // 获取核心系统
        function getCategoryCoreList() {
            var name = 'categoryCore';
            angular.forEach(DATA_DICTIONARY.list, function (item, index) {
                if (item.dictKey == name) {
                    vm.data.categoryCoreList = JSON.parse(item.dictValue);
                    // console.log('核心业务', vm.data.categoryCoreList);
                }
            })
        }

        // 获取当前二级系统的名称
        function getSubCategoryName(list, dict, name) {
            // console.log('获取当前二级系统的名称', list, dict, name);
            var result = '';
            angular.forEach(dict, function (item, index) {
                if (item.name == list.alias) {
                    // console.log(item);
                    // 找二级业务
                    for(var i in item.children){
                        if(item.children[i].name == name){
                            result = item.children[i].value;
                        }
                    }
                }
            })
            return result || '子系统';
        }

        // 提取业务下面的索引
        function getIndexName(data) {
            // console.log('提取子业务下面的索引', data);
            var result = [];
            if (data.sub && data.sub['en']) {
                name = data.sub['en'];
                angular.forEach(data.indexes, function (item, index) {
                    var formatData = item.split('-')[0].split('_');
                    // console.log(formatData);
                    if (formatData[1] == data.sub['en']) {
                        // 子业务下面的索引
                        result.push({ name: formatData[2], status: false });
                    }
                })
            }
            return result;
        }

        // 选择tabs
        function selectedTab(index) {
            vm.data.selectedIndex = index;
            getCategories();
        }

        // 区分核心业务和一般业务
        function filterData(data, selectedIndex, coreList) {
            var result = [];
            // 双循环提取数据
            angular.forEach(data, function (item, index) {
                if (selectedIndex == 0 && coreList.indexOf(item.alias) > -1) {
                    result.push(item);
                }

                if (selectedIndex == 1 && coreList.indexOf(item.alias) == -1) {
                    result.push(item);
                }
            })
            return result;
        }

        // 日志查询
        function logQuery(data) {
            console.log(data);
            var params = {
                id: data.id,
                name: data.name,
                alias: data.alias,
                title: data.title,
                sub: data.sub,
                indexesList: []
            }

            // 提取索引
            angular.forEach(data.indexNameList, function (item, index) {
                if (item.status) {
                    params.indexesList.push(item.name);
                }
            })

            $rootScope.$broadcast('chooseCategorySuccess', params);

            // 储存到本地
            saveToLocalStorge(params);
            // 关闭
            cancel();
        }

        // 关闭
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        // 最新使用
        function saveToLocalStorge(data) {
            // console.log(data);
            // 没有新建，有则追加,  相同者删除原来的，  大于10条删除原来的
            var localData = localStorage.getItem(vm.data.localHistoryName);
            // console.log('本地数据', localData);
            if (localData) {
                localData = JSON.parse(localData);
                // 相同的删除原来的
                angular.forEach(localData, function (item, index) {
                    if (JSON.stringify(item) == JSON.stringify(data)) {
                        localData.splice(index, 1);
                    }
                })
                localData.unshift(data);

                // 大于10条删除原来的
                if (localData.length > 10) {
                    localData.length = 10;
                }
            } else {
                localData = [data];
            }

            localStorage.setItem(vm.data.localHistoryName, JSON.stringify(localData));
        }

        // 获取本地数据
        function getLocalStorge() {
            var localData = localStorage.getItem(vm.data.localHistoryName);
            vm.data.historyList = localData ? JSON.parse(localData) : [];
        }

        // 表格搜索
        $scope.$watch("vm.data.search", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.data.tableParams.filter({});
            } else if (newValue != oldValue) {
                vm.data.tableParams.filter({ $: vm.data.search });
            }
        });

        init();
    }
})();