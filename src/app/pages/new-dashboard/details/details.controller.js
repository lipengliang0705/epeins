(function() {
    'use strict';
    /**
     * @ 查看仪表盘详情
     * Author:Veiss Date:2019/6/21
     * 变量都在vm.data中管理
     * view需要的方法都在vm.method中管理
     * 资源都在vm.resources中管理
     * --
     * 支持功能
     * 1 单个图表刷新，全部刷新 ok
     * 2 整个图表全屏, 单个图表全屏 ok
     * 3 添加图表 删除图表 ok
     * 4 图表拖拽，重置大小 ok
     * 5 全局搜索，单个搜索 ok
     * 6 钻取
     *  */
    var app = angular.module('LoginsightUiApp.page.new-dashboard');
    app.controller("newDashboardDetailsController", newDashboardDetailsController);
    newDashboardDetailsController.$inject = ['$scope', 'newDashboardService', '$state', '$stateParams', '$timeout', '$uibModal', 'toastr', '$q', 'EsService', 'NgTableParams'];

    function newDashboardDetailsController($scope, newDashboardService, $state, $stateParams, $timeout, $uibModal, toastr, $q, EsService, NgTableParams) {
        var vm = this;

        vm.data = {
            echartsIndex: null, // 图表的索引，用于resize
            isFullScreen: false, // 是否全屏
            isAllFullScreen: false, // 是否全部全屏
            deleteIndex: null, // 删除图表的index
            isDisable: true, // 图表是否可以编辑
            isShowFilter: false, // 全局筛选
            selectedDateTime: {}, // 选中的图表，用于时间筛选
            // 图表布局结构
            standardItems: {
                // { sizeX: 2, sizeY: 2, row: 0, col: 0, charId: 1 },
            },
            gridsterOpts: {
                // 拖拽
                draggable: {
                    enabled: true, // 是否可拖拽
                    stop: function(event, $element, widget) {
                        // 储存布局
                        modify();
                        // 重置图表
                        resizeEcharts(widget);
                    }
                },
                // 改变大小
                resizable: {
                    enabled: true, // 是否可改变大小
                    stop: function(event, $element, widget) {
                        // 储存布局
                        modify();
                        // 重置图表
                        resizeEcharts(widget);
                    }
                }
            },

            // 时间选择器配置
            dateRangeOptions: {
                opens: "left",
                timePicker: true,
                timePicker24Hour: true,
                ranges: {
                    '15分钟前': [moment().subtract(15, 'minute'), moment()],
                    '1个小时前': [moment().subtract(1, 'hour'), moment()],
                    '一天前': [moment().subtract(1, 'day'), moment()],
                    '三天前': [moment().subtract(3, 'day'), moment()],
                    '一周前': [moment().subtract(1, 'week'), moment()],
                    '当天': [moment().startOf('days'), moment()],
                    '当月': [moment().startOf('month'), moment().endOf('month')]
                },
                locale: {
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
                },
                eventHandlers: {
                    // 单个图表刷新
                    'apply.daterangepicker': function(event, picker) {
                        console.log('单个图表刷新');
                        console.log(vm.data.selectedDateTime);
                        // 获取当前选中的布局索引，获取到里面的时间，根据时间调用接口查询最新的数据，刷新图表呈现。

                        // query
                        chartInfoById(vm.data.selectedDateTime.chartId).then(function(res) {
                            console.log(res);
                            var _query = res.parameters;
                            //获取时间，回写用于展示
                            vm.data.selectedDateTime.tempDate.startDate = _query.params.startTime = moment(vm.data.selectedDateTime.tempDate.startDate).format();
                            vm.data.selectedDateTime.tempDate.endDate = _query.params.endTime = moment(vm.data.selectedDateTime.tempDate.endDate).format();

                            console.log(_query);

                            chartInfoById(vm.data.selectedDateTime.chartId, _query).then(function(response) {
                                console.log(response);
                                // 获取id，刷洗图表
                                var _index = 0;
                                vm.data.standardItems.map(function(item, index) {
                                    if (vm.data.selectedDateTime == item) {
                                        _index = index;
                                    }
                                })
                                var option = ecartsOptions(response.parameters);
                                vm['eChart' + _index].setOption(option, true);
                            })
                        })

                    }
                }
            },

            // datetimepicker配置
            dateTimepicker: {
                // 开始时间
                startTimeOpts: {
                    date: new Date(),
                    isOpen: false,
                    openCalendar: function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        vm.data.dateTimepicker.startTimeOpts.isOpen = true;
                    }
                },

                // 结束时间
                endTimeOpts: {
                    date: new Date(),
                    isOpen: false,
                    openCalendar: function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        vm.data.dateTimepicker.endTimeOpts.isOpen = true;
                    }
                }
            }
        }

        // 资源
        vm.resources = {
            list: []
        }

        // 方法
        vm.method = {
            echartsDownload: echartsDownload,
            echatsRefresh: echatsRefresh,
            exitFullscreen: exitFullscreen, // 退出全屏
            fullScreen: fullScreen, // 全屏
            showDeleteModal: showDeleteModal, // 删除echarts
            settingSwitch: settingSwitch,
            showAddEchartsModal: showAddEchartsModal,
            showSettingEchartsModal: showSettingEchartsModal, // 图表设置弹框
            selectedDate: selectedDate, // 临时选择时间
            formatTime: formatTime, // 时间格式化
            globalSearch: globalSearch, //全局搜索
            switchShape: switchShape, // 切换图表形态
        }

        // 初始化
        function init() {
            // 检测id，没有id则跳转到列表页面
            if ($stateParams.id) {
                vm.data.id = $stateParams.id;
                details(vm.data.id);
            } else {
                $state.go('new-dashboard');
            }
        }

        // 全局搜索
        function globalSearch() {
            if (!vm.data.dateTimepicker.startTimeOpts.date || !vm.data.dateTimepicker.endTimeOpts.date) {
                toastr.error('时间不能为空');
                return;
            }
            // 获取到时间，循环调用接口
            var startDate = moment(vm.data.dateTimepicker.startTimeOpts.date).format();
            var endTime = moment(vm.data.dateTimepicker.endTimeOpts.date).format();

            console.log(startDate, endTime);

            // 找到所有的query，循环刷新
            angular.forEach(vm.data.standardItems, function(item, index) {
                chartInfoById(item.chartId).then(function(res) {
                    console.log(res);
                    var _query = res.parameters;
                    //获取时间，回写用于展示
                    item.tempDate.startDate = _query.params.startTime = moment(startDate).format();
                    item.tempDate.endDate = _query.params.endTime = moment(endTime).format();

                    console.log(_query);

                    chartInfoById(item.chartId, _query).then(function(response) {
                        console.log(response);
                        var option = ecartsOptions(response.parameters);
                        vm['eChart' + index].setOption(option, true);
                    })
                })
            })

        }

        // 单个图表选择时间的时候，存储选中的布局
        function selectedDate(item) {
            console.log(item);
            vm.data.selectedDateTime = item;
        }

        /**
         * 改变图表大小
         * @param {*} widget 
         */
        function resizeEcharts(widget) {
            // 获取到当前改变大小的索引，重置里面的图表
            angular.forEach(vm.data.standardItems, function(item, index) {
                $timeout(function() {
                    if (widget && item == widget) {
                        vm['eChart' + index].resize();
                        return;
                    } else {
                        vm['eChart' + index].resize();
                    }
                }, 500);
            })
        }

        /**
         * echarts下载
         */
        function echartsDownload(index) {
            console.log(index);
            $timeout(function() {
                var chartImgUrl = vm['eChart' + index].getDataURL({
                    pixelRatio: 2,
                    backgroundColor: '#fff'
                });
                console.log(chartImgUrl);
                downloadFile('图表.png', chartImgUrl)
            }, 100);
        }

        /**
         * 刷新
         * @param {*} fileName 
         * @param {*} content 
         */
        function echatsRefresh(index) {
            console.log(vm['eChart' + index]);
            console.log(index);
            var layouts = vm.data.standardItems[index];
            // 重新获取数据，加载图表
            if (index != undefined) {
                $q.all(chartInfoByIds([layouts.chartId])).then(function(response) {
                    var res = response[0];
                    console.log(res);
                    // 开始时间和结束时间
                    vm.data.standardItems[index].tempDate = {
                        startDate: res.parameters.params.startTime,
                        endDate: res.parameters.params.endTime
                    }

                    // 更改title
                    vm.data.standardItems[index].chartTitle = res.title;

                    var option = ecartsOptions(res.parameters);
                    vm['eChart' + index].setOption(option, true);

                    // 储存结构
                    modify();
                })
            } else {
                // 刷新全部的图表,重新请求数据
                details(vm.data.id);
            }

            toastr.info('图表刷新成功');
        }

        /**
         * 下载
         * @param {*} fileName 
         * @param {*} content 
         */
        function downloadFile(fileName, content) {
            var aLink = document.createElement('a');
            var blob = base64ToBlob(content); //new Blob([content]);
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = fileName;
            aLink.href = URL.createObjectURL(blob);
            // aLink.dispatchEvent(evt);
            //aLink.click()
            aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); //兼容火狐
        }

        /**
         * base64转图片
         * @param {*} code 
         */
        function base64ToBlob(code) {
            var parts = code.split(';base64,');
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;
            var uInt8Array = new Uint8Array(rawLength);
            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], { type: contentType });
        }

        //全屏
        function fullScreen(index) {
            var element = null;
            if (index != undefined) {
                element = document.getElementById('li' + index);
            } else {
                vm.data.echartsIndex = index;
                element = document.getElementById('gridContainer');
            }
            // var element = document.documentElement;

            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
            if (index != undefined) {
                vm.data.isFullScreen = true;
            } else {
                vm.data.isAllFullScreen = true;
            }
            console.log(vm['eChart' + index]);
        }

        //退出全屏 
        function exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            vm.data.isFullScreen = false;
        }

        /**
         * 打开删除弹出框
         */
        function showDeleteModal(index) {
            console.log(index);
            vm.data.deleteIndex = index;
            $uibModal.open({
                templateUrl: 'app/pages/new-dashboard/details/delete/delete.html',
                controller: 'newDashboardDetailsDeleteController',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    transferData: { index: index }
                },
                backdrop: 'static'
            });
        }

        /**
         * 打开添加图表弹出框
         */
        function showAddEchartsModal() {
            $uibModal.open({
                templateUrl: 'app/pages/new-dashboard/details/add/add.html',
                controller: 'newDashboardDetailsAddController',
                controllerAs: 'vm',
                // size: 'lg',
                backdrop: 'static'
            });
        }

        // 打开图表设置
        function showSettingEchartsModal(chartId) {
            console.log(chartId);
            $uibModal.open({
                templateUrl: 'app/pages/new-dashboard/details/setting/setting.html',
                controller: 'newDashboardDetailsSettingController',
                controllerAs: 'vm',
                // size: 'lg',
                resolve: {
                    transferData: { id: chartId }
                },
                backdrop: 'static'
            })
        }

        /**
         * 删除图表
         */
        function echartsDelete(deleteIndex) {
            console.log(deleteIndex);
            angular.forEach(vm.data.standardItems, function(item, index) {
                if (deleteIndex == index) {
                    console.log(item);
                    vm.data.standardItems.splice(deleteIndex, 1);
                    toastr.info('图表删除成功!');
                }
            });
            // 储存结构
            modify();
        }

        function settingSwitch(newValue, oldValue) {
            vm.data.gridsterOpts.draggable.enabled = newValue;
            vm.data.gridsterOpts.resizable.enabled = newValue;
            vm.data.isDisable = newValue;
            // 储存图表是否可编辑功能
            openOrClose();
        }

        /**
         * 查看布局详情，加载图表
         * @param {*} id 
         */
        function details(id) {
            newDashboardService.details({ id: id }, function(res) {
                var data = [];
                if (res.id) {
                    // layouts字段转换成数组
                    res.layouts = JSON.parse(res.layouts);
                    // 储存图表详情
                    vm.resources.list = res;
                    // 储存布局结构
                    vm.data.standardItems = res.layouts;
                    // 是否可编辑,初始化
                    vm.data.isDisable = res.enabled || false;
                    vm.data.gridsterOpts.draggable.enabled = vm.data.isDisable;
                    vm.data.gridsterOpts.resizable.enabled = vm.data.isDisable;

                    console.log(vm.resources.list);

                    if (!vm.data.standardItems.length) {
                        return;
                    }

                    // 获取到id
                    vm.data.standardItems.forEach(function(item, index) {
                        data.push(item.chartId);
                    })

                    // 循环获取图表信息
                    $q.all(chartInfoByIds(data)).then(function(response) {
                        console.log('初始化获取到的数据', response);
                        // 获取新加数据索引，渲染eCharts图表
                        angular.forEach(vm.data.standardItems, function(item, index) {

                            // 开始时间和结束时间
                            item.tempDate = {
                                startDate: response[index].parameters.params.startTime,
                                endDate: response[index].parameters.params.endTime
                            };

                            // 表格原始数据
                            item.tableParams = new NgTableParams({
                                page: 1, //展示第一页
                                count: 8, //每页有9个数据项
                            }, {
                                counts: [5, 8, 10, 15, 20],
                                dataset: response[index].parameters.data
                            });

                            // 渲染图表
                            var option = ecartsOptions(response[index].parameters);

                            $timeout(function() {
                                vm['eChart' + index] = echarts.init(document.getElementById('id' + index)); //div 标签id
                                vm['eChart' + index].showLoading();
                                // true重新加载
                                console.log('id' + index, option);
                                vm['eChart' + index].setOption(option, true);
                                vm['eChart' + index].hideLoading();
                                vm['eChart' + index].resize();
                                window.onresize = function() {
                                    vm['eChart' + index].resize();
                                };
                            }, 1500)
                        })
                    })
                }
            })
        }

        // 组装echarts数据
        function ecartsOptions(res) {
            console.log('组装echarts数据', res);
            var option = {};
            var _series = [{
                name: '数量',
                type: res.charType,
                data: [],
                itemStyle: {
                    normal: {
                        color: '#399bff'
                    }
                }
            }];

            var _xAxis = {
                data: [],
                splitLine: {
                    show: false
                }
            };

            // 分为bar，line
            var baseOption = {
                title: {
                    text: ''
                },
                backgroundColor: '#fff',
                tooltip: {},
                // legend: res.config.legend,
                xAxis: _xAxis,
                yAxis: {
                    splitLine: {
                        show: false
                    }
                },
                series: _series,
                dataZoom: [{　　　　
                    type: "inside"
                }],
                grid: {
                    left: '4%',
                    right: '0',
                    top: '0'
                }
            };
            var pieOption = {
                title: {},
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    top: 0, //注意
                    bottom: 30,
                    type: 'scroll',
                    pagemode: true,
                    data: [],
                },
                series: [{
                    // name: '访问来源',
                    type: res.charType,
                    data: [],
                    radius: '55%',
                    center: ['50%', '40%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b} ({d}%)'
                            },
                            labelLine: {
                                show: true
                            },
                            // normal: {
                            //     color: function(params) {
                            //         var colorList = ['#00FFFF', '#00FF00', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463'];
                            //         return colorList[params.dataIndex];
                            //     }
                            // }
                        }
                    }
                }],
                color: ['#399bff', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#07a2a4', '#9a7fd1']
            }

            if (res.charType == 'bar' || res.charType == 'line') {
                option = baseOption;
            } else if (res.charType == 'pie') {
                option = pieOption;
            }

            //数据处理
            angular.forEach(res.data, function(item, index) {
                var _obj = {};
                if (res.charType == 'bar' || res.charType == 'line') {
                    _series[0].data.push(item.y);
                    _xAxis.data.push(item.x);
                } else if (res.charType == 'pie') {
                    _obj.name = item.x;
                    _obj.value = item.y;
                    option.series[0].data.push(_obj);
                    option.legend.data.push(item.x);
                }
            });

            return option;
        }

        // 修改图表,保存
        function modify() {
            // 储存的时候去掉tempDate
            var params = {
                id: vm.resources.list.id,
                name: vm.resources.list.name,
                description: vm.resources.list.description,
                layouts: JSON.stringify(deleteTempDate(vm.data.standardItems)),
                createdBy: vm.resources.list.createdBy,
                createdTime: vm.resources.list.createdTime
            }

            // 检测不能为空，才储存
            if (params.id && params.name) {
                newDashboardService.modify(params, function(res) {
                    console.log('修改成功');
                })
            }

            // 不储存临时时间,切换和表格数据信息
            function deleteTempDate(data) {
                var result = angular.copy(data);
                angular.forEach(result, function(item, index) {
                    delete item.tempDate;
                    delete item.tableParams;
                    delete item.shape;
                })
                return result;
            }
        }

        // 格式化显示时间
        function formatTime(data) {
            if (data) {
                return moment(data).format("YYYY/MM/DD HH:mm:ss");
            }
        };

        // 仪表盘是否可编辑
        function openOrClose() {
            // "id":43,
            // "enabled":false
            var params = {
                id: vm.data.id,
                enabled: vm.data.isDisable
            }
            newDashboardService.openOrClose(params, function(res) {
                console.log('图表编辑成功');
            })
        }

        // 请求图表字段
        function echartsCount(parameters) {
            var index = parameters.index;
            var params = parameters.params;
            var deferred = $q.defer();
            var apiType = '';
            // 选择不同的统计类型
            if (index == 0) {
                apiType = 'getEventCount';
            } else if (index == 1) {
                apiType = 'getFieldStatistics';
            } else if (index == 2) {
                apiType = 'getFieldType';
            } else if (index == 3) {
                apiType = 'getTotalPercent';
            } else if (index == 4) {
                apiType = 'getSegmentStatistic';
            } else if (index == 5) {
                apiType = 'getTimeSegmentStatistic';
            }
            console.log(params);

            EsService[apiType].post(params, function(res) {
                var _temp3 = [];
                // 又包装了一层,从写，保持数据一致
                if (apiType == 'getFieldType') {
                    res.aggregations = res.aggregations.data;
                }
                // 字段值统计
                if (apiType == 'getFieldStatistics') {
                    if (res.aggregations['avg']) {
                        res.aggregations = res.aggregations['avg'];
                    } else if (res.aggregations['max']) {
                        res.aggregations = res.aggregations['max'];
                    } else if (res.aggregations['min']) {
                        res.aggregations = res.aggregations['min'];
                    }
                }
                // 累计百分比
                if (apiType == 'getTotalPercent') {
                    // 解析成数组，在排序，在组装
                    angular.forEach(res.aggregations[0], function(key, value) {
                        var _obj = {};
                        _obj.x = +value;
                        _obj.y = key;
                        _temp3.push(_obj);

                    })
                    var _temp3 = _.orderBy(_temp3, ['x', 'asc']);
                    res.aggregations = _temp3;
                }
                // 数值分段统计
                if (apiType == 'getSegmentStatistic') {
                    var temp4_count = [10, 20, 22, 24, 12, 12, 59, 10, 20, 22, 24, 12, 12, 59];
                    var temp4_arr = [];
                    angular.forEach(res.aggregations, function(item, index) {
                        var _obj = {};
                        _obj.x = item.key;
                        _obj.y = temp4_count[index];
                        // option.series[0].data.push(item.count);
                        // option.series[0].data.push(temp4_count[index]);
                        // option.xAxis.data.push(item.key);
                        temp4_arr.push(_obj);
                    })
                    res.aggregations = temp4_arr;
                }
                // 事件分段统计
                if (apiType == 'getTimeSegmentStatistic') {
                    var temp5_arr = [];
                    angular.forEach(res.aggregations, function(item, index) {
                        // option.series[0].data.push(item.count);
                        // option.xAxis.data.push(item.key);
                        var _obj = {};
                        _obj.x = item.key;
                        _obj.y = item.count;
                        temp5_arr.push(_obj);
                    })
                    res.aggregations = temp5_arr;
                }

                res.parameters = parameters;
                console.log('图表信息', res);
                deferred.resolve(res);
            }, function(err) {
                deferred.reject();
            });

            return deferred.promise;

            // var deferred = $q.defer();
            // // 请求数据获取图表
            // newDashboardService.echartsSearch(query, function(res) {
            //     console.log(res);
            //     deferred.resolve(res);
            // });
            // return deferred.promise;
        }

        // 根据id获取echarts的图表信息
        function chartInfoByIds(ids) {
            var result = [];
            angular.forEach(ids, function(item, index) {
                result.push(function() {
                    var deferred = $q.defer();
                    // 调用接口
                    newDashboardService.chartInfoById({ id: item }, function(res) {
                        console.log("获取到的接口数据", res);
                        if (res.id) {
                            // 成功,字符串转换成json对象
                            res.parameters = JSON.parse(res.parameters);
                            // 请求字段
                            echartsCount(res.parameters).then(function(response) {
                                res.parameters.data = response.aggregations;
                                deferred.resolve(res);
                            });
                        } else {
                            // 失败
                            deferred.reject();
                        }
                    })
                    return deferred.promise;
                }())
            })
            return result;
        }

        // 单个图表
        function chartInfoById(id, query) {
            console.log('传进来的params', query)
            var deferred = $q.defer();
            newDashboardService.chartInfoById({ id: id }, function(res) {
                if (res.id) {
                    // 成功,字符串转换成json对象
                    res.parameters = JSON.parse(res.parameters);
                    if (query) {
                        // 请求字段
                        echartsCount(query).then(function(response) {
                            res.parameters.data = response.aggregations;
                            deferred.resolve(res);
                        });
                    } else {
                        deferred.resolve(res);
                    }

                } else {
                    // 失败
                    deferred.reject();
                }
            });
            return deferred.promise;
        }

        // 图表和表格切换展示
        function switchShape(shape, currentIndex) {
            // 给选中的图上标示符
            angular.forEach(vm.data.standardItems, function(item, index) {
                if (currentIndex == index) {
                    item.shape = shape;
                }
            })
        }

        // 删除图表
        $scope.$on('echartsDeleteSuccess', function() {
            console.log(vm.data.deleteIndex);
            echartsDelete(vm.data.deleteIndex);
        })

        // 添加图表
        $scope.$on('echartsAddSuccess', function(event, data) {
            console.log(data);
            // 获取数据，添加图表
            // 循环获取到用户添加了几张表，就生成几个echarts
            // 获取到当前布局，循环添加进去
            // { sizeX: 6, sizeY: 1, row: 3, col: 0 }

            var maxRows = 0;
            var count = data.length;
            var tempIndex = [];

            angular.forEach(vm.data.standardItems, function(item, index) {
                // 找到最大的rows
                if (item.row > maxRows) {
                    maxRows = item.row;
                }
            });

            // 跳过1，直接到2，防止新加的图表展示在最前面
            if (maxRows == 0) {
                maxRows = 1;
            }

            // 循环写数据,需要把chartId加入进去做关联
            for (var i = 0; i < count; i++) {
                var obj = { sizeX: 6, sizeY: 1, row: maxRows + i + 1, col: 0, chartId: data[i] };
                vm.data.standardItems.push(obj);
                // tempRows.push(obj);
                console.log(vm.data.standardItems.length)

                // 获取到新加图表索引，用于后续渲染图表
                tempIndex.push(vm.data.standardItems.length - 1);
            }

            console.log(vm.data.standardItems);

            // 添加图表后，储存一次结构
            // modify();

            // 循环获取图表信息
            $q.all(chartInfoByIds(data)).then(function(response) {
                console.log('添加成功', response);
                console.log(tempIndex);

                // 获取新加数据索引，渲染eCharts图表
                angular.forEach(tempIndex, function(item, index) {
                    // 写title进去
                    vm.data.standardItems[item].chartTitle = response[index].title;

                    // 开始时间和结束时间
                    vm.data.standardItems[item].tempDate = {
                        startDate: response[index].parameters.params.startTime,
                        endDate: response[index].parameters.params.endTime
                    };

                    // 渲染图表
                    var option = ecartsOptions(response[index].parameters);

                    // 延迟加载图表
                    $timeout(function() {
                        console.log(vm['eChart' + item]);
                        vm['eChart' + item] = echarts.init(document.getElementById('id' + item)); //div 标签id
                        vm['eChart' + item].showLoading();
                        // true重新加载
                        console.log('id' + item, option);
                        vm['eChart' + item].setOption(option, true);
                        vm['eChart' + item].hideLoading();
                        vm['eChart' + item].resize();
                        window.onresize = function() {
                            vm['eChart' + item].resize();
                        };
                    }, 1500)
                })

                // 添加图表后，储存一次结构
                modify();
            })
        })

        // 配置图表
        $scope.$on('echartSettingSuccess', function(event, data) {
            console.log(data);
            angular.forEach(vm.data.standardItems, function(item, index) {
                if (item.chartId == data.id) {
                    // 刷新图表
                    echatsRefresh(index);
                }
            })
        })


        // 用于全部图表全屏检测
        document.addEventListener("fullscreenchange", function(event) {
            // alleChartRefresh();
            // 重置全部图表
            resizeEcharts();
            if (document.fullscreenElement) {
                console.log('进入全屏');
            } else {
                vm.data.isAllFullScreen = false;
                vm.data.isFullScreen = false;
            }
        });


        init();
    }
})();