(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.data-dictionary')
        .controller('AuditController', AuditController);

    AuditController.$inject = ['DataDictionaryService', '$uibModal', '$scope', '$rootScope', 'NgTableParams', '$window', 'DATA_DICTIONARY', 'EsService', 'toastr', 'AuditService', '$filter', 'AgentHost', '$q'];

    function AuditController(DataDictionaryService, $uibModal, $scope, $rootScope, NgTableParams, $window, DATA_DICTIONARY, EsService, toastr, AuditService, $filter, AgentHost, $q) {
        moment.locale('zh-cn');
        var vm = this;

        vm.topData = {
            top1: 0,
            top2: 0,
            top3: 0,
            top4: 0,
        };
        vm.dateRangeOptions = {
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
                "format": "YYYY-MM-DD HH:mm",
                "separator": " ~ ",
                "applyLabel": "确定",
                "cancelLabel": "取消",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "自定义",
                "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                "firstDay": 1
            },
        };
        // 时间选择
        vm.dateRange = {
            "startDate": moment().subtract(1, 'day'), //moment().subtract(15, 'minute'),
            "endDate": moment()
        };
        vm.list = [
            {
                targetHostIp: '11.1.10.128',
                category: '业务一',
                userName: 'admin',
                date: '2019-08-24T10:19:00Z',
                status: '1'
            },
            {
                targetHostIp: '11.1.10.137',
                category: '业务二',
                userName: 'admin',
                date: '2019-08-25T10:18:00Z',
                status: '1'
            },
            {
                targetHostIp: '11.1.10.118',
                category: '业务三',
                userName: 'admin',
                date: '2019-08-26T10:19:00Z',
                status: '1'
            },
        ];
        vm.tableParams = new NgTableParams({
            filter: {},
            sorting: {},
            page: 1,//展示第一页
            count: 10,//每页有15个数据项
            url: ''
        });
        vm.serverTableParams = new NgTableParams({
            filter: {},
            sorting: {},
            page: 1,//展示第一页
            count: 10,//每页有15个数据项
            url: ''
        });
        vm.gatewayTableParams = new NgTableParams({
            filter: {},
            sorting: {},
            page: 1,//展示第一页
            count: 10,//每页有15个数据项
            url: ''
        });
        vm.serverRange = [
            {
                "id": 23,
                "name": "Node4",
                "alias": "2",
                "ip": "123.149.84.138",
                "port": null,
                "osType": "2",
                "loginType": "1",
                "loginInfo": {"userName": "tss", "passWord": "tss"},
                "depolyPath": "/opt/tss/itoa/loginsight/batch_deploy/batch4",
                "filePath": null,
                "loginMode": "1",
                "status": "0",
                "agentRules": null
            }, {
                "id": 142,
                "name": "batch1",
                "alias": "4",
                "ip": "101.88.242.136",
                "port": null,
                "osType": "2",
                "loginType": "1",
                "loginInfo": {"userName": "tss", "passWord": "tss"},
                "depolyPath": "/opt/tss/itoa/loginsight/batch_deploy/batch1",
                "filePath": null,
                "loginMode": "0",
                "status": "1",
                "agentRules": null
            }, {
                "id": 150,
                "name": "term1.tss.dev.pi",
                "alias": "1",
                "ip": "183.192.133.103",
                "port": null,
                "osType": "2",
                "loginType": "1",
                "loginInfo": {"userName": "tss", "passWord": "tss"},
                "depolyPath": "/opt/tss/itoa/loginsight/batch_deploy/tmp",
                "filePath": null,
                "loginMode": "1",
                "status": "0",
                "agentRules": null
            }, {
                "id": 151,
                "name": "tf5",
                "alias": "1",
                "ip": "171.9.132.118",
                "port": null,
                "osType": "2",
                "loginType": "1",
                "loginInfo": {"userName": "tss", "passWord": "tss"},
                "depolyPath": "/opt/tss/itoa/loginsight/batch_deploy/ttt",
                "filePath": null,
                "loginMode": "0",
                "status": "0",
                "agentRules": null
            }, {
                "id": 154,
                "name": "batch2",
                "alias": "0",
                "ip": "218.82.240.253",
                "port": null,
                "osType": "2",
                "loginType": "1",
                "loginInfo": {"userName": "tss", "passWord": "tss"},
                "depolyPath": "/opt/tss/itoa/loginsight/batch_deploy/batch2",
                "filePath": null,
                "loginMode": "0",
                "status": "1",
                "agentRules": null
            }, {
                "id": 155,
                "name": "term1.tss.dev.pi2",
                "alias": "0",
                "ip": "221.176.112.2",
                "port": null,
                "osType": "2",
                "loginType": "1",
                "loginInfo": {"userName": "tss", "passWord": "tss"},
                "depolyPath": "/opt/tss/loginsight",
                "filePath": null,
                "loginMode": "0",
                "status": "0",
                "agentRules": null
            }, {
                "id": 161,
                "name": "test-zhengan-001",
                "alias": "1",
                "ip": "221.176.112.2",
                "port": "22",
                "osType": "1",
                "loginType": "1",
                "loginInfo": {"userName": "tss", "passWord": "20190828150506533_id_rsa(1)"},
                "depolyPath": null,
                "filePath": null,
                "loginMode": "1",
                "status": null,
                "agentRules": null
            }, {
                "id": 20,
                "name": "Node2",
                "alias": "5",
                "ip": "218.82.240.253",
                "port": null,
                "osType": "2",
                "loginType": "1",
                "loginInfo": {"userName": "tss", "passWord": "123"},
                "depolyPath": "/opt/tss/itoa/loginsight/batch_deploy/batch2",
                "filePath": null,
                "loginMode": "0",
                "status": "0",
                "agentRules": null
            }
        ];
        vm.gatewayRange = [];
        vm.fortress = {};
        vm.server = {};
        vm.method = {
            showMidifyModal: showMidifyModal,
            showDeleteModal: showDeleteModal,
            showInfoModal:showInfoModal
        }
        vm.formatShowTime = formatShowTime;
        vm.searchClick = searchClick;
        vm.showSettingModal = showSettingModal;
        vm.handleChangeServer = handleChangeServer;
        vm.handleChangeDate = handleChangeDate;
        vm.searchServer = searchServer;

        loadAll();

        function loadAll() {
            initEvents();
            // loadTopData();
            loadData();
        };

        /**
         * 获取设置好的堡垒机和登录服务器
         */
        function getFortress(callback) {
            AuditService.gatewayAll(function (res) {
                if (res.length > 0) {
                    vm.fortress = res[0];
                    vm.serverRange = angular.fromJson(vm.fortress.serverId);
                    vm.gatewayRange = angular.fromJson(vm.fortress.fortersIp);
                    if (callback) {
                        callback();
                    }
                }

            }, function (err) {

            })
        }

        /**
         * 加载页面中顶部四块数据
         */
        function loadTopData() {
            loadTop1();
            loadTop2();
            loadTop3();
            loadTop4();

            function loadTop1() {
                vm.topData.top1 = 666;
            }

            //今日登录次数
            function loadTop2() {
                var yy = new Date().getFullYear();
                var mm = new Date().getMonth();
                var dd = new Date().getDate();

                mm = mm > 9 ? mm : '0' + mm;
                dd = dd > 9 ? dd : '0' + dd;

                // var startDate=new Date(yy+'-'+mm+'-'+dd+' 00:00:00');
                var startDate = moment().set('year', yy).set('month', mm).set('date', dd).set('hour', 0).set('minute', 0).set('second', 0).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
                var endDate = moment().format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
                var ips = [];
                angular.forEach(vm.serverRange, function (item) {
                    ips.push(item.ip);
                });
                var query = 'select * from wtmp* where' + formatIp(ips) + formatDate(startDate, endDate);

                var params = {
                    sql: query
                };
                console.log(params);
                EsService.logSearchForSql().post(params, function (res) {
                    vm.topData.top2 = res.hits.hits.length;
                }, function (err) {
                    toastr.error("top2查询出错", "错误提示", err);
                });
            }

            function loadTop3() {
                var startDate = moment().subtract(5, 'minute').format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
                var endDate = moment().format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
                var ips = [];
                angular.forEach(vm.serverRange, function (item) {
                    ips.push(item.ip);
                });
                var query = 'select * from wtmp* where' + formatIp(ips) + formatDate(startDate, endDate);

                var params = {
                    sql: query
                };
                console.log(params);
                EsService.logSearchForSql().post(params, function (res) {
                    vm.topData.top3 = res.hits.hits.length;
                }, function (err) {
                    toastr.error("top3查询出错", "错误提示", err);
                });
            }

            function loadTop4() {
                vm.topData.top4 = 4;
            }
        }

        /**
         * 加载所有根据ip查询日志的数据
         */
        function loadData() {
            // getFortress(function () {
            //     //查询日志数据 加载图表
            //     query(function () {
            //         // loadChart();
            //     });
            //
            //
            // });
            queryHostList(function () {
                loadGatewayTable();
                loadServerTable();
            });


        }

        function queryHostList(callback) {
            AgentHost.query(function (res) {
                if (res.length > 0) {
                    vm.serverRange = res;
                    vm.server = res[0];
                    if (callback) {
                        callback();
                    }
                }
            })
        }

        /**
         * 加载echart图表
         */
        function loadChart() {
            chart1();
        }

        function chart1() {
            //处理vm.list数据 date
            var dateArr = [], dateUser = [];
            angular.forEach(vm.list, function (item) {
                var timestamp = $filter('date')(item._source.timestamp, 'yyyy-MM-dd HH:mm');
                if (dateArr.indexOf(timestamp) === -1) {
                    dateArr.push(timestamp);
                }
            });
            //时间排序
            dateArr.sort();
            //根据时间统计用户数量
            angular.forEach(dateArr, function (dateItem) {
                //统一时间内
                var _users = [];
                angular.forEach(vm.list, function (listItem) {
                    var timestamp = $filter('date')(listItem._source.timestamp, 'yyyy-MM-dd HH:mm');
                    if (dateItem === timestamp) {
                        var _name = listItem._source.name;
                        if (_users.indexOf(_name) === -1) {
                            _users.push(_name);
                        }
                    }
                });
                dateUser.push(_users.length);
            })

            console.log(angular.toJson(dateArr));

            var baseOption = {
                title: {
                    text: ''
                },
                backgroundColor: '#fff',
                tooltip: {},
                xAxis: {
                    data: dateArr,
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: '数量',
                    type: 'bar',
                    data: dateUser,
                    itemStyle: {
                        normal: {
                            color: '#399bff'
                        }
                    }
                }],
                dataZoom: [{
                    type: "inside"
                }],
                grid: {
                    left: '4%',
                    right: '0',
                    top: '5%',
                    // bottom: '5%'
                }
            };

            vm.echarts = echarts.init(document.getElementById('simple-bar1')); //div 标签id
            vm.echarts.showLoading();
            // true重新加载
            // console.log('id' + index, option);
            vm.echarts.setOption(baseOption, true);
            vm.echarts.hideLoading();
            vm.echarts.resize();
            window.onresize = function () {
                vm.echarts.resize();
            };
        }

        function initEvents() {
            $rootScope.$on('reloadDataDictionary', function () {
                getList();
            });

            $scope.$on('dateRange-change', function (e, dateRange) {
                console.log('dateRange-change');
                vm.dateRange = dateRange;
                loadData();
            });
            $rootScope.$on('audit:setting-success', function (e, data) {
                vm.serverRange = data.serverIp;
                vm.gateway = data.fortersIp;
                loadData();
            });

            $scope.$watch('vm.dateRange', function (newValue) {
                console.log(newValue);
            }, true);

            /**
             * 堡垒机搜索
             */
            $scope.$watch("vm.gatewaySearch", function (newValue, oldValue) {
                console.log(newValue);
                if (newValue == undefined) {
                    vm.gatewayTableParams.filter({});
                } else if (newValue != oldValue) {
                    vm.gatewayTableParams.filter({$: vm.gatewaySearch});
                }
            });

            /**
             * 登录服务器搜索
             */
            $scope.$watch("vm.serverSearch", function (newValue, oldValue) {
                console.log(newValue);
                if (newValue == undefined) {
                    vm.serverTableParams.filter({});
                } else if (newValue != oldValue) {
                    vm.serverTableParams.filter({$: vm.serverSearch});
                }
            });
        }

        /**
         * 获取日志登录列表
         */
        function getList() {
            vm.tableParams.settings().dataset = vm.list;
            vm.tableParams.reload();
        }


        function showMidifyModal(item) {
            // $uibModal.open({
            //     templateUrl: 'app/pages/data-dictionary/dialog/data-dictionary-dialog.html',
            //     controller: 'DataDictionaryDialogCtrl',
            //     controllerAs: 'vm',
            //     backdrop: 'static',
            //     resolve: {
            //         transferData: item
            //     }
            // });
        }


        function showInfoModal(item) {
            $uibModal.open({
                templateUrl: 'app/pages/audit/info/info.html',
                controller: ['$uibModalInstance', '$rootScope', 'toastr', function ($uibModalInstance, $rootScope, toastr) {
                    console.log(item);
                    var vm = this;
                    vm.enter=item;

                    vm.method = {
                        submit: submit,
                        cancel: cancel
                    }


                    function cancel() {
                        $uibModalInstance.dismiss('cancel');
                    }
                }],
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: item
                }
            });
        }

        function showDeleteModal() {
            $uibModal.open({
                templateUrl: 'app/pages/data-dictionary/delete/delete.html',
                controller: ['$uibModalInstance', '$rootScope', 'toastr', 'DataDictionaryService', function ($uibModalInstance, $rootScope, toastr, DataDictionaryService) {
                    console.log(item);
                    var vm = this;

                    vm.method = {
                        submit: submit,
                        cancel: cancel
                    }

                    function submit() {
                        var params = angular.copy(item);
                        params.status = 1;

                        DataDictionaryService.update(params, function (res) {
                            console.log(res);
                            toastr.success('删除成功！', '成功提示');
                            $uibModalInstance.dismiss('cancel');
                            $rootScope.$broadcast('reloadDataDictionary');
                        }, function (err) {
                            toastr.error(err.data.message, '错误提示');
                        })

                    }

                    function cancel() {
                        $uibModalInstance.dismiss('cancel');
                    }
                }],
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    transferData: item
                }
            });
        }

        /**
         * 回车的时候触发ng-submit，跟下面的watch二选一就可以
         */
        function searchClick() {
            vm.tableParams.filter({$: vm.searchWord});
        }


        /**
         * 格式化显示时间
         * @param data
         * @returns {*}
         */
        function formatShowTime(data) {
            return moment(data).format("YYYY/MM/DD HH:mm:ss");
        };

        function searchClick() {
            vm.startTime = vm.dateRange.startDate;
            vm.endTime = vm.dateRange.endDate;
            console.log(vm.startTime, vm.endTime);
        }

        /**
         * 弹出设置modal
         */
        function showSettingModal() {
            $uibModal.open({
                templateUrl: 'app/pages/audit/setting/setting.html',
                controller: 'SettingController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    entry: vm.fortress
                }
            });
        }

        /**
         * 查询登录服务器登录日志
         */
        function queryServer() {
            var ip = vm.server;
        }

        /**
         * 日志查询
         * @param callback
         */
        function query(callback) {
            var params = {
                sql: queryString()
            };
            console.log(params);
            EsService.logSearchForSql().post(params, function (res) {
                console.log("sql查询结果", res);
                vm.list = res.hits.hits;
                console.log('list length', vm.list.length);
                getList();
                if (callback) {
                    callback();
                }
            }, function (err) {
                toastr.error("查询出错", "错误提示", err);
            });
        }

        /**
         * 拼接sql查询字符串
         * @returns {string}
         */
        function queryString() {
            var ips = [];
            angular.forEach(vm.serverRange, function (item) {
                ips.push(item.ip);
            });
            var query = 'select * from bup_hkzfapp02_wtmp-20190911* where' + formatIp(ips) + formatDate();

            return query;

        }

        /**
         * 将ip数组转为sql查询字符串
         * @returns {string}
         */
        function formatIp(ips) {
            var str = ' (';
            angular.forEach(ips, function (ip, i) {
                str += " comment=\'" + ip + "\'" + (i === ips.length - 1 ? "" : ' OR');
            });

            return str + ')';
        }

        /**
         * 将startDate和endDate转成sql的str
         * @param startDate
         * @param endDate
         * @returns {string}
         */
        function formatDate(startDate, endDate) {
            var startDate = startDate || vm.dateRange.startDate.format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
            var endDate = endDate || vm.dateRange.endDate.format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z");
            return " AND" + " timestamp>\'" + startDate + "\' AND timestamp<\'" + endDate + "\'"
        }

        function loadGatewayTable() {
            var list = {
                "total": 147473,
                "max_score": 1,
                "hits": [
                    {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhfm",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:29:15 sbljserver : OPERATE(service=cmdcheck server=spisadb2(11.1.70.76) account=any identity=zhengzhonghao from=11.1.10.204 cd mapper/)",
                            "timestamp": "2019-08-30T11:29:15.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "spisadb2(11.1.70.76)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98263
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhft",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:31:37 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 date)",
                            "timestamp": "2019-08-30T11:31:37.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98291
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhfu",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:31:48 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 ls)",
                            "timestamp": "2019-08-30T11:31:48.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98295
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhfv",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:31:49 sbljserver : OPERATE(service=cmdcheck server=spisadb1(11.1.70.75) account=any identity=zhengzhonghao from=11.1.10.204 select mount_status, path, os_mb from v$asm_disk order by 2;)",
                            "timestamp": "2019-08-30T11:31:49.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "spisadb1(11.1.70.75)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98299
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhfw",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:33:15 sbljserver : DEVICE(service=tui login server=san-switch-11.1.29.6(11.1.29.6) account=any identity=nieguoqiang from=11.1.10.201 )",
                            "timestamp": "2019-08-30T11:33:15.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "san-switch-11.1.29.6(11.1.29.6)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98303
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhgF",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:45:13 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.6(11.1.29.6) account=any identity=nieguoqiang from=11.1.10.201 switchshow)",
                            "timestamp": "2019-08-30T11:45:13.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.6(11.1.29.6)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98387
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhgG",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:45:43 sbljserver : OPERATE(service=cmdcheck server=yyfwq_bupapp1(11.1.36.210) account=bapbup identity=chenyulu from=11.1.10.22 kl)",
                            "timestamp": "2019-08-30T11:45:43.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "yyfwq_bupapp1(11.1.36.210)",
                            "account": "bapbup",
                            "identity": "chenyulu",
                            "from": "11.1.10.22",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98391
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhgl",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:00:00 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 su -)",
                            "timestamp": "2019-08-30T12:00:00.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98515
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhgq",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:03:22 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 service ntpd stop)",
                            "timestamp": "2019-08-30T12:03:22.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98535
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhgs",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:05:25 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 service ntpd restart)",
                            "timestamp": "2019-08-30T12:05:25.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98543
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhgw",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:06:56 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 service ntpd start)",
                            "timestamp": "2019-08-30T12:06:56.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98559
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhgx",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:07:06 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 ntpdate -d 11.1.199.81)",
                            "timestamp": "2019-08-30T12:07:06.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98563
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhgy",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:07:35 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 date)",
                            "timestamp": "2019-08-30T12:07:35.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98567
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhg6",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:12:09 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 ntpq -p)",
                            "timestamp": "2019-08-30T12:12:09.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98599
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhg-",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:14:57 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 date)",
                            "timestamp": "2019-08-30T12:14:57.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98615
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhB",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:15:26 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.6(11.1.29.6) account=any identity=nieguoqiang from=11.1.10.201 sftpshow 25)",
                            "timestamp": "2019-08-30T12:15:26.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.6(11.1.29.6)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98627
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhF",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:17:20 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.5(11.1.29.5) account=any identity=nieguoqiang from=11.1.10.201 sfpshow 0)",
                            "timestamp": "2019-08-30T12:17:20.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.5(11.1.29.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98643
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhN",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:04:29 sbljserver : OPERATE(service=cmdcheck server=11.1.69.2(11.1.69.2) account=weblogic identity=lijunfeng from=11.1.215.237 cd /reportData/)",
                            "timestamp": "2019-08-30T13:04:29.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.2(11.1.69.2)",
                            "account": "weblogic",
                            "identity": "lijunfeng",
                            "from": "11.1.215.237",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98675
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhS",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:07:34 sbljserver : OPERATE(service=cmdcheck server=11.1.69.2(11.1.69.2) account=weblogic identity=lijunfeng from=11.1.215.237 tail -f AdminServer.out )",
                            "timestamp": "2019-08-30T13:07:34.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.2(11.1.69.2)",
                            "account": "weblogic",
                            "identity": "lijunfeng",
                            "from": "11.1.215.237",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98695
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhU",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:11:05 sbljserver : DEVICE(service=tui login server=tips_qz1(11.1.51.12) account=any identity=hanguohua from=11.1.215.205 )",
                            "timestamp": "2019-08-30T13:11:05.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "tips_qz1(11.1.51.12)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98703
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhW",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:12:54 sbljserver : OPERATE(service=cmdcheck server=11.1.34.10(11.1.34.10) account=fex identity=wangchenqi from=11.1.10.60 sh jcnode.sh )",
                            "timestamp": "2019-08-30T13:12:54.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.34.10(11.1.34.10)",
                            "account": "fex",
                            "identity": "wangchenqi",
                            "from": "11.1.10.60",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98711
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhc",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:19:20 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 wftmgr -j 37366 UN_CBS_AZJCPH 0)",
                            "timestamp": "2019-08-30T13:19:20.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98735
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhd",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:21:06 sbljserver : DEVICE(service=gui login server=szxjgdb1(11.1.71.56) account=any identity=heyikun from=11.1.215.209 )",
                            "timestamp": "2019-08-30T13:21:06.000Z",
                            "type": "DEVICE",
                            "service": "gui login",
                            "server": "szxjgdb1(11.1.71.56)",
                            "account": "any",
                            "identity": "heyikun",
                            "from": "11.1.215.209",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98739
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhf",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:24:52 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 ls)",
                            "timestamp": "2019-08-30T13:24:52.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98747
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhj",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:26:32 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 ssh hnnxdn043 )",
                            "timestamp": "2019-08-30T13:26:32.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98763
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhhw",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:37:11 sbljserver : OPERATE(service=cmdcheck server=AG_ESB_01(11.1.37.77) account=fts identity=xupo from=11.1.215.230 ls)",
                            "timestamp": "2019-08-30T13:37:11.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "AG_ESB_01(11.1.37.77)",
                            "account": "fts",
                            "identity": "xupo",
                            "from": "11.1.215.230",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98815
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhh1",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:38:12 sbljserver : OPERATE(service=cmdcheck server=AG_ESB_01(11.1.37.77) account=fts identity=xupo from=11.1.215.230 ls 20190830113458_60000305_PAYMENT.txt)",
                            "timestamp": "2019-08-30T13:38:12.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "AG_ESB_01(11.1.37.77)",
                            "account": "fts",
                            "identity": "xupo",
                            "from": "11.1.215.230",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98835
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhh9",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:44:00 sbljserver : Login Shterm(web)(service=mix server=None(None) account=None identity=wanghongtao from=11.1.215.249 login authorize success)",
                            "timestamp": "2019-08-30T13:44:00.000Z",
                            "type": "Login Shterm(web)",
                            "service": "mix",
                            "server": "None(None)",
                            "account": "None",
                            "identity": "wanghongtao",
                            "from": "11.1.215.249",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98867
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhiA",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:46:58 sbljserver : OPERATE(service=cmdcheck server=11.1.135.58(11.1.135.58) account=use identity=hedongwei from=11.1.215.233 ls)",
                            "timestamp": "2019-08-30T13:46:58.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.58(11.1.135.58)",
                            "account": "use",
                            "identity": "hedongwei",
                            "from": "11.1.215.233",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98879
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhiB",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:47:23 sbljserver : OPERATE(service=cmdcheck server=11.1.135.58(11.1.135.58) account=use identity=hedongwei from=11.1.215.233 320334,1222%:wq)",
                            "timestamp": "2019-08-30T13:47:23.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.58(11.1.135.58)",
                            "account": "use",
                            "identity": "hedongwei",
                            "from": "11.1.215.233",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98883
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhiF",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:47:55 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 ssh 11.1.34.6)",
                            "timestamp": "2019-08-30T13:47:55.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98899
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhiJ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:49:31 sbljserver : DEVICE(service=gui login server=FEX_ODS_zjd(11.1.34.1) account=any identity=huangyibiao from=11.1.215.231 )",
                            "timestamp": "2019-08-30T13:49:31.000Z",
                            "type": "DEVICE",
                            "service": "gui login",
                            "server": "FEX_ODS_zjd(11.1.34.1)",
                            "account": "any",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98915
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhif",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:55:03 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 grep 1942247337 server.log | grep 璁＄畻鎴愬姛 |wc -l)",
                            "timestamp": "2019-08-30T13:55:03.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99003
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhii",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:59:44 sbljserver : OPERATE(service=cmdcheck server=11.1.71.102(11.1.71.102) account=any identity=lijunfeng from=11.1.215.246 ls)",
                            "timestamp": "2019-08-30T13:59:44.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.71.102(11.1.71.102)",
                            "account": "any",
                            "identity": "lijunfeng",
                            "from": "11.1.215.246",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99015
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhin",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:04:42 sbljserver : OPERATE(service=cmdcheck server=11.1.71.102(11.1.71.102) account=any identity=lijunfeng from=11.1.215.246 vi sql_blacklist.sh)",
                            "timestamp": "2019-08-30T14:04:42.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.71.102(11.1.71.102)",
                            "account": "any",
                            "identity": "lijunfeng",
                            "from": "11.1.215.246",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99035
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhio",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:05:32 sbljserver : OPERATE(service=cmdcheck server=11.1.69.2(11.1.69.2) account=weblogic identity=lijunfeng from=11.1.215.237 ls)",
                            "timestamp": "2019-08-30T14:05:32.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.2(11.1.69.2)",
                            "account": "weblogic",
                            "identity": "lijunfeng",
                            "from": "11.1.215.237",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99039
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhiu",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:15:05 sbljserver : OPERATE(service=cmdcheck server=11.1.69.2(11.1.69.2) account=weblogic identity=lijunfeng from=11.1.215.237 ls)",
                            "timestamp": "2019-08-30T14:15:05.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.2(11.1.69.2)",
                            "account": "weblogic",
                            "identity": "lijunfeng",
                            "from": "11.1.215.237",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99063
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhiw",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:16:04 sbljserver : OPERATE(service=cmdcheck server=11.1.69.2(11.1.69.2) account=weblogic identity=lijunfeng from=11.1.215.237 ls |wc -l)",
                            "timestamp": "2019-08-30T14:16:04.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.2(11.1.69.2)",
                            "account": "weblogic",
                            "identity": "lijunfeng",
                            "from": "11.1.215.237",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99071
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhiz",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:27:27 sbljserver : OPERATE(service=cmdcheck server=11.1.136.9(11.1.136.9) account=any identity=suxiaoguang from=11.1.215.241 cd app/)",
                            "timestamp": "2019-08-30T14:27:27.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.136.9(11.1.136.9)",
                            "account": "any",
                            "identity": "suxiaoguang",
                            "from": "11.1.215.241",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99083
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhi-",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:33:30 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=lihuanhuan from=11.1.215.249 wget 11.1.63.106:9010)",
                            "timestamp": "2019-08-30T14:33:30.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "lihuanhuan",
                            "from": "11.1.215.249",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99127
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhjD",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:34:32 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 ls)",
                            "timestamp": "2019-08-30T14:34:32.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99147
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhjJ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:35:30 sbljserver : OPERATE(service=cmdcheck server=11.1.69.148(11.1.69.148) account=any identity=hanguohua from=11.1.215.205 mkdir upload)",
                            "timestamp": "2019-08-30T14:35:30.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.148(11.1.69.148)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99171
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhjM",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:36:18 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 :q)",
                            "timestamp": "2019-08-30T14:36:18.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99183
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhjT",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:39:00 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 golog)",
                            "timestamp": "2019-08-30T14:39:00.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99211
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhjj",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:58:56 sbljserver : DEVICE(service=tui login server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 )",
                            "timestamp": "2019-08-30T14:58:56.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99275
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhjq",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:10:42 sbljserver : OPERATE(service=cmdcheck server=TEST_UAT1(11.1.196.104) account=any identity=liujianhui from=11.1.10.49 hwclock -u)",
                            "timestamp": "2019-08-30T15:10:42.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "TEST_UAT1(11.1.196.104)",
                            "account": "any",
                            "identity": "liujianhui",
                            "from": "11.1.10.49",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99303
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhj6",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:16:00 sbljserver : OPERATE(service=cmdcheck server=11.1.136.9(11.1.136.9) account=any identity=suxiaoguang from=11.1.215.241 cd /app)",
                            "timestamp": "2019-08-30T15:16:00.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.136.9(11.1.136.9)",
                            "account": "any",
                            "identity": "suxiaoguang",
                            "from": "11.1.215.241",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99367
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhj7",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:16:05 sbljserver : OPERATE(service=cmdcheck server=nbumaster2(11.1.49.2) account=any identity=yueyang from=11.1.10.54 ll)",
                            "timestamp": "2019-08-30T15:16:05.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "nbumaster2(11.1.49.2)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99371
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhj8",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:16:09 sbljserver : OPERATE(service=cmdcheck server=nbumaster2(11.1.49.2) account=any identity=yueyang from=11.1.10.54 ll)",
                            "timestamp": "2019-08-30T15:16:09.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "nbumaster2(11.1.49.2)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99375
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhkT",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:20:47 sbljserver : OPERATE(service=cmdcheck server=11.1.49.5(11.1.49.5) account=any identity=nieguoqiang from=11.1.10.201 date)",
                            "timestamp": "2019-08-30T15:20:47.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.49.5(11.1.49.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99467
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhkW",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:21:08 sbljserver : OPERATE(service=cmdcheck server=11.1.37.5(11.1.37.5) account=any identity=nieguoqiang from=11.1.10.201 date)",
                            "timestamp": "2019-08-30T15:21:08.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.37.5(11.1.37.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99479
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhka",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:21:36 sbljserver : DEVICE(service=tui login server=fxyj_web4(11.1.156.4) account=any identity=fxyj1 from=11.1.216.16 )",
                            "timestamp": "2019-08-30T15:21:36.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "fxyj_web4(11.1.156.4)",
                            "account": "any",
                            "identity": "fxyj1",
                            "from": "11.1.216.16",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99495
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhkp",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:28:22 sbljserver : OPERATE(service=cmdcheck server=scbsdb2(11.1.32.34) account=any identity=zhengzhonghao from=11.1.10.204 ps -ef|grep osw)",
                            "timestamp": "2019-08-30T15:28:22.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "scbsdb2(11.1.32.34)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99555
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhky",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:32:43 sbljserver : OPERATE(service=cmdcheck server=fxyj_web4(11.1.156.4) account=any identity=fxyj1 from=11.1.216.16 cd oarms/)",
                            "timestamp": "2019-08-30T15:32:43.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "fxyj_web4(11.1.156.4)",
                            "account": "any",
                            "identity": "fxyj1",
                            "from": "11.1.216.16",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99591
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhk6",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:35:12 sbljserver : DEVICE(service=tui login server=san-switch-11.1.29.5(11.1.29.5) account=any identity=nieguoqiang from=11.1.10.201 )",
                            "timestamp": "2019-08-30T15:35:12.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "san-switch-11.1.29.5(11.1.29.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99623
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhk-",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:35:41 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 ll)",
                            "timestamp": "2019-08-30T15:35:41.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99639
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhk_",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:35:49 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 ifconfig| grep ad)",
                            "timestamp": "2019-08-30T15:35:49.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99643
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhlD",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:36:33 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 cat tdh_use_flow.sh )",
                            "timestamp": "2019-08-30T15:36:33.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99659
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhlE",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:36:47 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.5(11.1.29.5) account=any identity=nieguoqiang from=11.1.10.201 switchshow)",
                            "timestamp": "2019-08-30T15:36:47.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.5(11.1.29.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99663
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhlF",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:37:00 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.5(11.1.29.5) account=any identity=nieguoqiang from=11.1.10.201 sfpshow 0)",
                            "timestamp": "2019-08-30T15:37:00.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.5(11.1.29.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99667
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhlH",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:37:23 sbljserver : OPERATE(service=cmdcheck server=11.1.47.44(11.1.47.44) account=any identity=zhengzhonghao from=11.1.10.204 select * from dba_directories;)",
                            "timestamp": "2019-08-30T15:37:23.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.47.44(11.1.47.44)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99675
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhlI",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:37:46 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.5(11.1.29.5) account=any identity=nieguoqiang from=11.1.10.201 sfpshow -all|grep -E 'Port|RX|TX')",
                            "timestamp": "2019-08-30T15:37:46.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.5(11.1.29.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99679
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmrxw4ZpBtcFhlW",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:42:50 sbljserver : OPERATE(service=cmdcheck server=gaps_qz1(11.1.51.2) account=gaps identity=hanguohua from=11.1.215.205 more esbibs_20190830.log-152444)",
                            "timestamp": "2019-08-30T15:42:50.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "gaps_qz1(11.1.51.2)",
                            "account": "gaps",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99735
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmsxw4ZpBtcFhlg",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:44:36 sbljserver : OPERATE(service=cmdcheck server=nbumaster2(11.1.49.2) account=any identity=yueyang from=11.1.10.54 ll)",
                            "timestamp": "2019-08-30T15:44:36.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "nbumaster2(11.1.49.2)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99775
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmsxw4ZpBtcFhlx",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:49:17 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.6(11.1.29.6) account=any identity=nieguoqiang from=11.1.10.201 portshow -i 36)",
                            "timestamp": "2019-08-30T15:49:17.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.6(11.1.29.6)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99843
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmsxw4ZpBtcFhl6",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:53:17 sbljserver : OPERATE(service=cmdcheck server=11.1.136.9(11.1.136.9) account=any identity=suxiaoguang from=11.1.215.241 ps -ef | grep TSXT)",
                            "timestamp": "2019-08-30T15:53:17.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.136.9(11.1.136.9)",
                            "account": "any",
                            "identity": "suxiaoguang",
                            "from": "11.1.215.241",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99879
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmsxw4ZpBtcFhmD",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:56:15 sbljserver : OPERATE(service=cmdcheck server=11.1.136.9(11.1.136.9) account=any identity=suxiaoguang from=11.1.215.241 rm -rf csr.auth.web)",
                            "timestamp": "2019-08-30T15:56:15.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.136.9(11.1.136.9)",
                            "account": "any",
                            "identity": "suxiaoguang",
                            "from": "11.1.215.241",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99915
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmsxw4ZpBtcFhmJ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:59:00 sbljserver : OPERATE(service=cmdcheck server=SECIFDB2(11.1.35.34) account=any identity=zhengzhonghao from=11.1.10.204 ll)",
                            "timestamp": "2019-08-30T15:59:00.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "SECIFDB2(11.1.35.34)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99939
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmsxw4ZpBtcFhmK",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:59:34 sbljserver : OPERATE(service=cmdcheck server=11.1.47.44(11.1.47.44) account=any identity=zhengzhonghao from=11.1.10.204 expdp sys\$360/paws\!421 directory=EXP_OGG dumpfile=stysfhc2_%U.dmp logfile=exp_stysfhc2.log parfile=stysfhc2.par FLASHBACK_SCN=380562529 COMPRESSION=all EXCLUDE=STATISTICS cluster=N parallel=3)",
                            "timestamp": "2019-08-30T15:59:34.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.47.44(11.1.47.44)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99943
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmsxw4ZpBtcFhmQ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 16:02:46 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 cd bmjf)",
                            "timestamp": "2019-08-30T16:02:46.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99967
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTmsxw4ZpBtcFhmW",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 16:09:03 sbljserver : OPERATE(service=cmdcheck server=11.1.136.9(11.1.136.9) account=any identity=suxiaoguang from=11.1.215.241 ll)",
                            "timestamp": "2019-08-30T16:09:03.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.136.9(11.1.136.9)",
                            "account": "any",
                            "identity": "suxiaoguang",
                            "from": "11.1.215.241",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99991
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Tg",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:04:01 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 ll)",
                            "timestamp": "2019-08-30T09:04:01.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96016
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Tq",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:05:57 sbljserver : DEVICE(service=gui login server=11.1.128.35(11.1.128.35) account=any identity=limin from=11.1.10.106 )",
                            "timestamp": "2019-08-30T09:05:57.000Z",
                            "type": "DEVICE",
                            "service": "gui login",
                            "server": "11.1.128.35(11.1.128.35)",
                            "account": "any",
                            "identity": "limin",
                            "from": "11.1.10.106",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96056
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Tx",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:07:42 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 rm -rf hive-server2.log.108[root@hnnxdn018 inceptorbak]# rm -rf hive-server2.log.108)",
                            "timestamp": "2019-08-30T09:07:42.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96084
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Ty",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:07:42 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 rm -rf hive-server2.log.112[root@hnnxdn018 inceptorbak]# rm -rf hive-server2.log.112)",
                            "timestamp": "2019-08-30T09:07:42.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96088
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7T1",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:07:43 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 rm -rf hive-server2.log.80[root@hnnxdn018 inceptorbak]# rm -rf hive-server2.log.80)",
                            "timestamp": "2019-08-30T09:07:43.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96100
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7T4",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:07:44 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 rm -rf hive-server2.log.91[root@hnnxdn018 inceptorbak]# rm -rf hive-server2.log.91)",
                            "timestamp": "2019-08-30T09:07:44.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96112
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7T5",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:07:45 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 rm -rf hive-server2.log.95[root@hnnxdn018 inceptorbak]# rm -rf hive-server2.log.95)",
                            "timestamp": "2019-08-30T09:07:45.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96116
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7T-",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:08:21 sbljserver : DEVICE(service=tui login server=11.1.70.75(11.1.70.75) account=fex identity=lianyalun from=11.1.215.203 )",
                            "timestamp": "2019-08-30T09:08:21.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "11.1.70.75(11.1.70.75)",
                            "account": "fex",
                            "identity": "lianyalun",
                            "from": "11.1.215.203",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96136
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7UE",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:10:16 sbljserver : OPERATE(service=cmdcheck server=HCDB(11.1.55.35) account=any identity=lihuanhuan from=11.1.215.249 ll)",
                            "timestamp": "2019-08-30T09:10:16.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB(11.1.55.35)",
                            "account": "any",
                            "identity": "lihuanhuan",
                            "from": "11.1.215.249",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96160
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7UL",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:12:02 sbljserver : DEVICE(service=gui login server=11.1.38.18(11.1.38.18) account=any identity=lihuanhuan from=11.1.215.249 )",
                            "timestamp": "2019-08-30T09:12:02.000Z",
                            "type": "DEVICE",
                            "service": "gui login",
                            "server": "11.1.38.18(11.1.38.18)",
                            "account": "any",
                            "identity": "lihuanhuan",
                            "from": "11.1.215.249",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96188
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7UM",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:12:46 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 USE show)",
                            "timestamp": "2019-08-30T09:12:46.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96192
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7UQ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:14:04 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 ssh 11.1.111.4)",
                            "timestamp": "2019-08-30T09:14:04.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96208
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7UR",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:14:09 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 ll)",
                            "timestamp": "2019-08-30T09:14:09.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96212
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7UU",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:14:34 sbljserver : OPERATE(service=cmdcheck server=HCDB(11.1.55.35) account=any identity=lihuanhuan from=11.1.215.249 ls)",
                            "timestamp": "2019-08-30T09:14:34.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB(11.1.55.35)",
                            "account": "any",
                            "identity": "lihuanhuan",
                            "from": "11.1.215.249",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96224
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7UW",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:15:17 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 cd ..)",
                            "timestamp": "2019-08-30T09:15:17.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96232
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Ub",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:16:39 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 ll)",
                            "timestamp": "2019-08-30T09:16:39.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96252
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Uf",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:17:56 sbljserver : OPERATE(service=cmdcheck server=gaps_qz1(11.1.51.2) account=gaps identity=hanguohua from=11.1.215.205 golog)",
                            "timestamp": "2019-08-30T09:17:56.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "gaps_qz1(11.1.51.2)",
                            "account": "gaps",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96268
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Ui",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:19:19 sbljserver : OPERATE(service=cmdcheck server=11.1.70.75(11.1.70.75) account=fex identity=lianyalun from=11.1.215.203 ll)",
                            "timestamp": "2019-08-30T09:19:19.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.70.75(11.1.70.75)",
                            "account": "fex",
                            "identity": "lianyalun",
                            "from": "11.1.215.203",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96280
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Uj",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:19:28 sbljserver : Login Shterm(web)(service=mix server=None(None) account=None identity=lidengfeng from=11.1.10.103 login authorize success)",
                            "timestamp": "2019-08-30T09:19:28.000Z",
                            "type": "Login Shterm(web)",
                            "service": "mix",
                            "server": "None(None)",
                            "account": "None",
                            "identity": "lidengfeng",
                            "from": "11.1.10.103",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96284
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Ul",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:19:39 sbljserver : OPERATE(service=cmdcheck server=11.1.70.75(11.1.70.75) account=fex identity=lianyalun from=11.1.215.203 cd endflag)",
                            "timestamp": "2019-08-30T09:19:39.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.70.75(11.1.70.75)",
                            "account": "fex",
                            "identity": "lianyalun",
                            "from": "11.1.215.203",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96292
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Un",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:20:06 sbljserver : DEVICE(service=gui login server=FEX_ODS_zjd(11.1.34.1) account=any identity=qinyunhao from=11.1.215.217 )",
                            "timestamp": "2019-08-30T09:20:06.000Z",
                            "type": "DEVICE",
                            "service": "gui login",
                            "server": "FEX_ODS_zjd(11.1.34.1)",
                            "account": "any",
                            "identity": "qinyunhao",
                            "from": "11.1.215.217",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96300
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Uw",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:24:00 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 ps -ef | grep use)",
                            "timestamp": "2019-08-30T09:24:00.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96336
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Uy",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:24:52 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 cd /mnt/ssd1/)",
                            "timestamp": "2019-08-30T09:24:52.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96344
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7U9",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:27:18 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 USE show)",
                            "timestamp": "2019-08-30T09:27:18.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96388
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7U-",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:27:32 sbljserver : DEVICE(service=gui login server=FEX_ODS_ZJD(11.1.34.1) account=any identity=lidengfeng from=11.1.10.103 )",
                            "timestamp": "2019-08-30T09:27:32.000Z",
                            "type": "DEVICE",
                            "service": "gui login",
                            "server": "FEX_ODS_ZJD(11.1.34.1)",
                            "account": "any",
                            "identity": "lidengfeng",
                            "from": "11.1.10.103",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96392
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7U_",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:27:41 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 USE show)",
                            "timestamp": "2019-08-30T09:27:41.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96396
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7VB",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:28:01 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 ho df -Th)",
                            "timestamp": "2019-08-30T09:28:01.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96404
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7VL",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:31:04 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 USE show)",
                            "timestamp": "2019-08-30T09:31:04.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96444
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7VM",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:31:11 sbljserver : OPERATE(service=cmdcheck server=11.1.32.34(11.1.32.34) account=any identity=daijie from=11.1.10.203 exit)",
                            "timestamp": "2019-08-30T09:31:11.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.32.34(11.1.32.34)",
                            "account": "any",
                            "identity": "daijie",
                            "from": "11.1.10.203",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96448
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7VO",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:31:18 sbljserver : OPERATE(service=cmdcheck server=11.1.135.141(11.1.135.141) account=any identity=tanheng from=11.1.215.209 ll)",
                            "timestamp": "2019-08-30T09:31:18.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.141(11.1.135.141)",
                            "account": "any",
                            "identity": "tanheng",
                            "from": "11.1.215.209",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96456
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7VP",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:31:20 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 golog )",
                            "timestamp": "2019-08-30T09:31:20.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96460
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Vg",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:32:52 sbljserver : OPERATE(service=cmdcheck server=11.1.135.140(11.1.135.140) account=any identity=tanheng from=11.1.215.209 ll)",
                            "timestamp": "2019-08-30T09:32:52.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.140(11.1.135.140)",
                            "account": "any",
                            "identity": "tanheng",
                            "from": "11.1.215.209",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96528
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Vk",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:33:57 sbljserver : OPERATE(service=cmdcheck server=sjkfwq_zfsrv1(11.1.36.33) account=any identity=yueyang from=11.1.10.54 lspv)",
                            "timestamp": "2019-08-30T09:33:57.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "sjkfwq_zfsrv1(11.1.36.33)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96544
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Vm",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:34:05 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 from v$log a, v$logfile b)",
                            "timestamp": "2019-08-30T09:34:05.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96552
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Vx",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:37:06 sbljserver : OPERATE(service=cmdcheck server=yyfwq_nxymfe1(11.1.36.66) account=any identity=yueyang from=11.1.10.54 errpt)",
                            "timestamp": "2019-08-30T09:37:06.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "yyfwq_nxymfe1(11.1.36.66)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96596
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7V0",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:37:13 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 COLUMN total_mb FORMAT 999,999,999 HEAD 'Total Size (MB)' )",
                            "timestamp": "2019-08-30T09:37:13.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96608
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7V-",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:39:51 sbljserver : DEVICE(service=gui login server=11.1.136.9(11.1.136.9) account=any identity=suxiaoguang from=11.1.215.228 )",
                            "timestamp": "2019-08-30T09:39:51.000Z",
                            "type": "DEVICE",
                            "service": "gui login",
                            "server": "11.1.136.9(11.1.136.9)",
                            "account": "any",
                            "identity": "suxiaoguang",
                            "from": "11.1.215.228",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96648
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7WS",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:44:54 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 date)",
                            "timestamp": "2019-08-30T09:44:54.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96728
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7WT",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:45:09 sbljserver : DEVICE(service=tui login server=yyfwq_SODSETL3(11.1.34.6) account=use identity=huangyibiao from=11.1.215.210 )",
                            "timestamp": "2019-08-30T09:45:09.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "yyfwq_SODSETL3(11.1.34.6)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96732
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7WZ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:47:25 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 ifconfig )",
                            "timestamp": "2019-08-30T09:47:25.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96756
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Wc",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:47:31 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 ls)",
                            "timestamp": "2019-08-30T09:47:31.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96768
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Wf",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:47:58 sbljserver : OPERATE(service=cmdcheck server=SYXAPP1(11.1.130.1) account=any identity=nieguoqiang from=11.1.10.201 cat netdaemons)",
                            "timestamp": "2019-08-30T09:47:58.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "SYXAPP1(11.1.130.1)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96780
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Wn",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:49:50 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 alter database add logfile thread 1 group 7 ('/oradata/sfhcdb/redo07.log') size 2048M;)",
                            "timestamp": "2019-08-30T09:49:50.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96812
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Wo",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:50:05 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 ifconfig | grep -i inet6 )",
                            "timestamp": "2019-08-30T09:50:05.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96816
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Wu",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:50:45 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=nieguoqiang from=11.1.10.201 exit)",
                            "timestamp": "2019-08-30T09:50:45.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96840
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Ww",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:51:01 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 cd inceptor3)",
                            "timestamp": "2019-08-30T09:51:01.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96848
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7W3",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:52:02 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 rm -rf *)",
                            "timestamp": "2019-08-30T09:52:02.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96876
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7W8",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:53:01 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=nieguoqiang from=11.1.10.201 server 127.127.10.1 prefer # austron 2201A gps receiver#peer 128.4.1.1 # rackety.udel.edu (Sun4c/40 IPC))",
                            "timestamp": "2019-08-30T09:53:01.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96896
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7XA",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:53:27 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 vim /etc/hosts )",
                            "timestamp": "2019-08-30T09:53:27.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96912
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7XB",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:53:51 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 exit)",
                            "timestamp": "2019-08-30T09:53:51.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96916
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7XC",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:54:05 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 cd /oradata/sfhcdb)",
                            "timestamp": "2019-08-30T09:54:05.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96920
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7XD",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:54:15 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=nieguoqiang from=11.1.10.201 ssh root@11.1.198.186)",
                            "timestamp": "2019-08-30T09:54:15.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96924
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7XL",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:55:11 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 b.type,)",
                            "timestamp": "2019-08-30T09:55:11.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96956
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7XM",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:55:12 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 order by a.group#;)",
                            "timestamp": "2019-08-30T09:55:12.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96960
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7XV",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:56:52 sbljserver : OPERATE(service=cmdcheck server=11.1.71.75(11.1.71.75) account=any identity=tanheng from=11.1.215.209 ls)",
                            "timestamp": "2019-08-30T09:56:52.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.71.75(11.1.71.75)",
                            "account": "any",
                            "identity": "tanheng",
                            "from": "11.1.215.209",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 96996
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7XX",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:57:27 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=nieguoqiang from=11.1.10.201 service ntpd restart)",
                            "timestamp": "2019-08-30T09:57:27.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97004
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7XY",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:57:43 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=nieguoqiang from=11.1.10.201 exit)",
                            "timestamp": "2019-08-30T09:57:43.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97008
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7XZ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:58:00 sbljserver : OPERATE(service=cmdcheck server=sjkfwq_zfsrv2(11.1.36.34) account=any identity=yueyang from=11.1.10.54 snap -gc)",
                            "timestamp": "2019-08-30T09:58:00.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "sjkfwq_zfsrv2(11.1.36.34)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97012
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Xc",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 09:59:05 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=nieguoqiang from=11.1.10.201 ntpq -p)",
                            "timestamp": "2019-08-30T09:59:05.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97024
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Xt",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:05:04 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 ssh use@11.1.34.6)",
                            "timestamp": "2019-08-30T10:05:04.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97092
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Xy",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:05:57 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 sz hive-server2.log.20190825-hnnxdn038.zip)",
                            "timestamp": "2019-08-30T10:05:57.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97112
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7X5",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:08:26 sbljserver : OPERATE(service=cmdcheck server=sjkfwq_zfsrv2(11.1.36.34) account=any identity=yueyang from=11.1.10.54 uname -Mu)",
                            "timestamp": "2019-08-30T10:08:26.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "sjkfwq_zfsrv2(11.1.36.34)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97140
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7X7",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:08:53 sbljserver : OPERATE(service=cmdcheck server=11.1.69.148(11.1.69.148) account=any identity=hanguohua from=11.1.215.205 ls)",
                            "timestamp": "2019-08-30T10:08:53.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.148(11.1.69.148)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97148
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7X8",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:09:00 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 ll)",
                            "timestamp": "2019-08-30T10:09:00.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97152
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7X9",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:09:11 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 vim jstack.sh )",
                            "timestamp": "2019-08-30T10:09:11.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97156
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7X-",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:10:00 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 ls)",
                            "timestamp": "2019-08-30T10:10:00.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97160
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7YA",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:10:31 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 cd jstack)",
                            "timestamp": "2019-08-30T10:10:31.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97168
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7YG",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:11:26 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 ls)",
                            "timestamp": "2019-08-30T10:11:26.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97192
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7YK",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:12:38 sbljserver : OPERATE(service=cmdcheck server=11.1.69.148(11.1.69.148) account=any identity=hanguohua from=11.1.215.205 golog)",
                            "timestamp": "2019-08-30T10:12:38.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.148(11.1.69.148)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97208
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7YO",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:13:18 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 ssh 11.1.135.64)",
                            "timestamp": "2019-08-30T10:13:18.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97224
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7YS",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:13:45 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 scp -r jstackexe/ 11.1.110.52:/root)",
                            "timestamp": "2019-08-30T10:13:45.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97240
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7YY",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:14:12 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 b.member)",
                            "timestamp": "2019-08-30T10:14:12.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97264
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Yd",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:14:36 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 b.member)",
                            "timestamp": "2019-08-30T10:14:36.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97284
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Yf",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:14:59 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 alter system switch logfile;)",
                            "timestamp": "2019-08-30T10:14:59.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97292
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Yg",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:15:13 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 set lines 200 pagesize 2000)",
                            "timestamp": "2019-08-30T10:15:13.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97296
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Yj",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:15:20 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=nieguoqiang from=11.1.10.201 clock)",
                            "timestamp": "2019-08-30T10:15:20.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97308
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Yn",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:15:46 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 order by a.group#;)",
                            "timestamp": "2019-08-30T10:15:46.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97324
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Yq",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:16:20 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 ls)",
                            "timestamp": "2019-08-30T10:16:20.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97336
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Yu",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:16:41 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=zhengzhonghao from=11.1.10.204 order by a.group#;)",
                            "timestamp": "2019-08-30T10:16:41.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97352
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Yy",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:18:31 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 sz jstack.log_*)",
                            "timestamp": "2019-08-30T10:18:31.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97368
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTopWNt7AYhj_7Y0",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:19:30 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=nieguoqiang from=11.1.10.201 ntpdate 11.1.199.81)",
                            "timestamp": "2019-08-30T10:19:30.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97376
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7Y7",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:22:49 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=nieguoqiang from=11.1.10.201 ntpdate 11.1.199.81)",
                            "timestamp": "2019-08-30T10:22:49.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97404
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ZL",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:26:27 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 docker ps | grep inceptor-executor1 | grep -v pause | awk -F ' ' '{print $1}')",
                            "timestamp": "2019-08-30T10:26:27.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97468
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ZM",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:26:52 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=nieguoqiang from=11.1.10.201 ntpq -p)",
                            "timestamp": "2019-08-30T10:26:52.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97472
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ZO",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:27:21 sbljserver : OPERATE(service=cmdcheck server=gaps_qz1(11.1.51.2) account=gaps identity=hanguohua from=11.1.215.205 ls)",
                            "timestamp": "2019-08-30T10:27:21.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "gaps_qz1(11.1.51.2)",
                            "account": "gaps",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97480
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7Zf",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:30:42 sbljserver : OPERATE(service=cmdcheck server=gaps_qz1(11.1.51.2) account=gaps identity=hanguohua from=11.1.215.205 grep 4478060 TYQC.20190830.log )",
                            "timestamp": "2019-08-30T10:30:42.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "gaps_qz1(11.1.51.2)",
                            "account": "gaps",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97548
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7Zn",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:33:19 sbljserver : OPERATE(service=cmdcheck server=11.1.135.140(11.1.135.140) account=any identity=tanheng from=11.1.215.209 ls)",
                            "timestamp": "2019-08-30T10:33:19.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.140(11.1.135.140)",
                            "account": "any",
                            "identity": "tanheng",
                            "from": "11.1.215.209",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97580
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7Zt",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:36:15 sbljserver : OPERATE(service=cmdcheck server=11.1.135.140(11.1.135.140) account=any identity=tanheng from=11.1.215.209 cd)",
                            "timestamp": "2019-08-30T10:36:15.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.140(11.1.135.140)",
                            "account": "any",
                            "identity": "tanheng",
                            "from": "11.1.215.209",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97604
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7Zx",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:37:23 sbljserver : OPERATE(service=cmdcheck server=11.1.135.140(11.1.135.140) account=any identity=tanheng from=11.1.215.209 cd /weblogic/Middleware/user_projects/domains/ebpdomain)",
                            "timestamp": "2019-08-30T10:37:23.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.140(11.1.135.140)",
                            "account": "any",
                            "identity": "tanheng",
                            "from": "11.1.215.209",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97620
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7Z3",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:38:41 sbljserver : OPERATE(service=cmdcheck server=11.1.135.140(11.1.135.140) account=any identity=tanheng from=11.1.215.209 tail -200f ebpdomain.log )",
                            "timestamp": "2019-08-30T10:38:41.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.140(11.1.135.140)",
                            "account": "any",
                            "identity": "tanheng",
                            "from": "11.1.215.209",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97644
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7Z-",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:41:39 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 ll)",
                            "timestamp": "2019-08-30T10:41:39.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97672
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7aM",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:45:24 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 ssh hnnxdn015)",
                            "timestamp": "2019-08-30T10:45:24.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97728
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7aT",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:46:57 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 cd /root/jstackexe/log/)",
                            "timestamp": "2019-08-30T10:46:57.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97756
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7aY",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 10:59:22 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 ls /mnt/ssd1 )",
                            "timestamp": "2019-08-30T10:59:22.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97776
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ab",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:02:33 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 gopub )",
                            "timestamp": "2019-08-30T11:02:33.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97788
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7af",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:03:56 sbljserver : OPERATE(service=cmdcheck server=spisadb1(11.1.70.75) account=any identity=zhengzhonghao from=11.1.10.204 su - root)",
                            "timestamp": "2019-08-30T11:03:56.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "spisadb1(11.1.70.75)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97804
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ar",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:05:09 sbljserver : OPERATE(service=cmdcheck server=nbumaster2(11.1.49.2) account=any identity=yueyang from=11.1.10.54 cd zfsrv1)",
                            "timestamp": "2019-08-30T11:05:09.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "nbumaster2(11.1.49.2)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97852
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7as",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:05:27 sbljserver : DEVICE(service=gui login server=11.1.15.20(11.1.15.20) account=root identity=huangyibiao from=11.1.215.231 )",
                            "timestamp": "2019-08-30T11:05:27.000Z",
                            "type": "DEVICE",
                            "service": "gui login",
                            "server": "11.1.15.20(11.1.15.20)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97856
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7au",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:05:50 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 ll)",
                            "timestamp": "2019-08-30T11:05:50.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97864
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ax",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:06:40 sbljserver : OPERATE(service=cmdcheck server=nbumaster2(11.1.49.2) account=any identity=yueyang from=11.1.10.54 ls)",
                            "timestamp": "2019-08-30T11:06:40.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "nbumaster2(11.1.49.2)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97876
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7a8",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:08:50 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 grep 1318070962 server.log )",
                            "timestamp": "2019-08-30T11:08:50.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97920
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7a9",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:09:06 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 mv /tmp/11 /tmp/hnnxdn006)",
                            "timestamp": "2019-08-30T11:09:06.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97924
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7bB",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:09:48 sbljserver : OPERATE(service=cmdcheck server=sjkfwq_zfsrv2(11.1.36.34) account=any identity=yueyang from=11.1.10.54 pwd)",
                            "timestamp": "2019-08-30T11:09:48.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "sjkfwq_zfsrv2(11.1.36.34)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97940
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7bD",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:10:04 sbljserver : OPERATE(service=cmdcheck server=spisadb1(11.1.70.75) account=any identity=zhengzhonghao from=11.1.10.204 exit)",
                            "timestamp": "2019-08-30T11:10:04.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "spisadb1(11.1.70.75)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97948
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7bK",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:11:10 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 grep FRS_IDX_CK02 server.log )",
                            "timestamp": "2019-08-30T11:11:10.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97976
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7bO",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:12:02 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.207 zip hnnxdn015.zip /tmp/hnnxdn015)",
                            "timestamp": "2019-08-30T11:12:02.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.207",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 97992
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7bQ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:12:31 sbljserver : OPERATE(service=cmdcheck server=sjkfwq_zfsrv2(11.1.36.34) account=any identity=yueyang from=11.1.10.54 F10=Exit Enter=Do no )",
                            "timestamp": "2019-08-30T11:12:31.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "sjkfwq_zfsrv2(11.1.36.34)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98000
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7bT",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:13:55 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.5(11.1.29.5) account=any identity=nieguoqiang from=11.1.10.201 switchshow)",
                            "timestamp": "2019-08-30T11:13:55.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.5(11.1.29.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98012
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7bd",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:16:18 sbljserver : DEVICE(service=tui login server=11.1.199.81(11.1.199.81) account=any identity=liujianhui from=11.1.10.49 )",
                            "timestamp": "2019-08-30T11:16:18.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "liujianhui",
                            "from": "11.1.10.49",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98052
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7bf",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:16:52 sbljserver : OPERATE(service=cmdcheck server=TEST_UAT1(11.1.196.104) account=any identity=liujianhui from=11.1.10.49 date)",
                            "timestamp": "2019-08-30T11:16:52.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "TEST_UAT1(11.1.196.104)",
                            "account": "any",
                            "identity": "liujianhui",
                            "from": "11.1.10.49",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98060
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7bg",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:17:22 sbljserver : OPERATE(service=cmdcheck server=TEST_UAT1(11.1.196.104) account=any identity=liujianhui from=11.1.10.49 ntpdate 11.1.199.81)",
                            "timestamp": "2019-08-30T11:17:22.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "TEST_UAT1(11.1.196.104)",
                            "account": "any",
                            "identity": "liujianhui",
                            "from": "11.1.10.49",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98064
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7b2",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:21:38 sbljserver : OPERATE(service=cmdcheck server=11.1.69.2(11.1.69.2) account=weblogic identity=lijunfeng from=11.1.215.237 cd /weblogic/user_projects/domains/base_domain/)",
                            "timestamp": "2019-08-30T11:21:38.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.2(11.1.69.2)",
                            "account": "weblogic",
                            "identity": "lijunfeng",
                            "from": "11.1.215.237",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98152
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7b5",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:21:51 sbljserver : OPERATE(service=cmdcheck server=gaps_qz1(11.1.51.2) account=gaps identity=hanguohua from=11.1.215.205 ls -ltr)",
                            "timestamp": "2019-08-30T11:21:51.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "gaps_qz1(11.1.51.2)",
                            "account": "gaps",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98164
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7cI",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:25:12 sbljserver : OPERATE(service=cmdcheck server=gaps_qz1(11.1.51.2) account=gaps identity=hanguohua from=11.1.215.205 golog)",
                            "timestamp": "2019-08-30T11:25:12.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "gaps_qz1(11.1.51.2)",
                            "account": "gaps",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98224
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7cJ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:25:16 sbljserver : OPERATE(service=cmdcheck server=spisadb1(11.1.70.75) account=any identity=zhengzhonghao from=11.1.10.204 select mount_status, path, os_mb from v$asm_disk order by 2;)",
                            "timestamp": "2019-08-30T11:25:16.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "spisadb1(11.1.70.75)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98228
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7cQ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:29:01 sbljserver : OPERATE(service=cmdcheck server=HCAPP2(11.1.55.2) account=any identity=lihuanhuan from=11.1.215.249 cd log)",
                            "timestamp": "2019-08-30T11:29:01.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCAPP2(11.1.55.2)",
                            "account": "any",
                            "identity": "lihuanhuan",
                            "from": "11.1.215.249",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98256
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7cX",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:31:22 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 cd ..)",
                            "timestamp": "2019-08-30T11:31:22.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98284
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ca",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:31:48 sbljserver : OPERATE(service=cmdcheck server=spisadb1(11.1.70.75) account=any identity=zhengzhonghao from=11.1.10.204 set linesize 200 pages 999)",
                            "timestamp": "2019-08-30T11:31:48.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "spisadb1(11.1.70.75)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98296
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7cd",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:34:35 sbljserver : OPERATE(service=cmdcheck server=spisadb1(11.1.70.75) account=any identity=zhengzhonghao from=11.1.10.204 alter diskgroup DATA add disk '/dev/mapper/data_25', '/dev/mapper/data_26', '/dev/mapper/data_27', '/dev/mapper/data_28', '/dev/mapper/data_29';)",
                            "timestamp": "2019-08-30T11:34:35.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "spisadb1(11.1.70.75)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98308
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ci",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:36:29 sbljserver : OPERATE(service=cmdcheck server=spisadb2(11.1.70.76) account=any identity=zhengzhonghao from=11.1.10.204 sqlplus / as sysdba)",
                            "timestamp": "2019-08-30T11:36:29.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "spisadb2(11.1.70.76)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98328
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7cj",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:36:43 sbljserver : OPERATE(service=cmdcheck server=spisadb2(11.1.70.76) account=any identity=zhengzhonghao from=11.1.10.204 COLUMN group_name FORMAT a20 HEAD 'Disk Group|Name' )",
                            "timestamp": "2019-08-30T11:36:43.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "spisadb2(11.1.70.76)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98332
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ck",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:36:43 sbljserver : OPERATE(service=cmdcheck server=spisadb2(11.1.70.76) account=any identity=zhengzhonghao from=11.1.10.204 COLUMN state FORMAT a11 HEAD 'State' )",
                            "timestamp": "2019-08-30T11:36:43.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "spisadb2(11.1.70.76)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98336
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7co",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:38:51 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=lihuanhuan from=11.1.215.249 wget 11.1.63.106:9010)",
                            "timestamp": "2019-08-30T11:38:51.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "lihuanhuan",
                            "from": "11.1.215.249",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98352
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ct",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:41:24 sbljserver : DEVICE(service=tui login server=11.1.69.148(11.1.69.148) account=any identity=hanguohua from=11.1.215.205 )",
                            "timestamp": "2019-08-30T11:41:24.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "11.1.69.148(11.1.69.148)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98372
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7cv",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:41:54 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 ls)",
                            "timestamp": "2019-08-30T11:41:54.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98380
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7c4",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:47:11 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 ls)",
                            "timestamp": "2019-08-30T11:47:11.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98416
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7c-",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:50:33 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 ls -al bi-index-engine-SNAPSHOT.jar )",
                            "timestamp": "2019-08-30T11:50:33.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98440
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7dA",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:53:41 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.6(11.1.29.6) account=any identity=nieguoqiang from=11.1.10.201 sfpshow 42 )",
                            "timestamp": "2019-08-30T11:53:41.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.6(11.1.29.6)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98448
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7dI",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:55:17 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.5(11.1.29.5) account=any identity=nieguoqiang from=11.1.10.201 sfpshow 450)",
                            "timestamp": "2019-08-30T11:55:17.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.5(11.1.29.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98480
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7dJ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:55:26 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.5(11.1.29.5) account=any identity=nieguoqiang from=11.1.10.201 sfpshow 53)",
                            "timestamp": "2019-08-30T11:55:26.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.5(11.1.29.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98484
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7dL",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:56:19 sbljserver : OPERATE(service=cmdcheck server=san-switch-11.1.29.5(11.1.29.5) account=any identity=nieguoqiang from=11.1.10.201 sfpshow 52)",
                            "timestamp": "2019-08-30T11:56:19.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "san-switch-11.1.29.5(11.1.29.5)",
                            "account": "any",
                            "identity": "nieguoqiang",
                            "from": "11.1.10.201",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98492
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7dO",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:58:00 sbljserver : OPERATE(service=cmdcheck server=nbumaster2(11.1.49.2) account=any identity=yueyang from=11.1.10.54 ll)",
                            "timestamp": "2019-08-30T11:58:00.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "nbumaster2(11.1.49.2)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98504
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7dQ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 11:58:47 sbljserver : DEVICE(service=tui login server=11.1.199.102(11.1.199.102) account=any identity=zhengzhonghao from=11.1.10.204 )",
                            "timestamp": "2019-08-30T11:58:47.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "11.1.199.102(11.1.199.102)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98512
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7dS",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:01:02 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 ls)",
                            "timestamp": "2019-08-30T12:01:02.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98520
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7dd",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:07:08 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 ntpdate -d 11.1.199.81)",
                            "timestamp": "2019-08-30T12:07:08.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98564
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7dg",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:08:55 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 yum clean all)",
                            "timestamp": "2019-08-30T12:08:55.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98576
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7dl",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:11:59 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 service ntpd restart)",
                            "timestamp": "2019-08-30T12:11:59.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98596
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7do",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:13:38 sbljserver : OPERATE(service=cmdcheck server=11.1.199.81(11.1.199.81) account=any identity=zhengzhonghao from=11.1.10.204 vi /etc/profile)",
                            "timestamp": "2019-08-30T12:13:38.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.199.81(11.1.199.81)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98608
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7d3",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 12:44:05 sbljserver : OPERATE(service=cmdcheck server=32.1(11.1.32.1) account=cbsrun identity=wangwenzheng from=11.1.10.30 cd 20190830)",
                            "timestamp": "2019-08-30T12:44:05.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "32.1(11.1.32.1)",
                            "account": "cbsrun",
                            "identity": "wangwenzheng",
                            "from": "11.1.10.30",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98668
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7d4",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:04:13 sbljserver : DEVICE(service=tui login server=gaps_qz1(11.1.51.2) account=gaps identity=hanguohua from=11.1.215.205 )",
                            "timestamp": "2019-08-30T13:04:13.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "gaps_qz1(11.1.51.2)",
                            "account": "gaps",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98672
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7d6",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:04:45 sbljserver : OPERATE(service=cmdcheck server=11.1.69.2(11.1.69.2) account=weblogic identity=lijunfeng from=11.1.215.237 cd C3234641000015/)",
                            "timestamp": "2019-08-30T13:04:45.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.2(11.1.69.2)",
                            "account": "weblogic",
                            "identity": "lijunfeng",
                            "from": "11.1.215.237",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98680
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7d-",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:07:44 sbljserver : OPERATE(service=cmdcheck server=gaps_qz1(11.1.51.2) account=gaps identity=hanguohua from=11.1.215.205 ls)",
                            "timestamp": "2019-08-30T13:07:44.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "gaps_qz1(11.1.51.2)",
                            "account": "gaps",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98696
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7eC",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:12:56 sbljserver : OPERATE(service=cmdcheck server=tips_qz2(11.1.51.13) account=any identity=hanguohua from=11.1.215.205 runmqsc)",
                            "timestamp": "2019-08-30T13:12:56.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "tips_qz2(11.1.51.13)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98712
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7eE",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:14:10 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 wftmgr -?)",
                            "timestamp": "2019-08-30T13:14:10.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98720
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7eG",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:16:38 sbljserver : OPERATE(service=cmdcheck server=tips_qz2(11.1.51.13) account=any identity=hanguohua from=11.1.215.205 dis LISTENER(*))",
                            "timestamp": "2019-08-30T13:16:38.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "tips_qz2(11.1.51.13)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98728
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7eH",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:19:10 sbljserver : OPERATE(service=cmdcheck server=32.1(11.1.32.1) account=cbsrun identity=wangwenzheng from=11.1.10.30 cd)",
                            "timestamp": "2019-08-30T13:19:10.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "32.1(11.1.32.1)",
                            "account": "cbsrun",
                            "identity": "wangwenzheng",
                            "from": "11.1.10.30",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98732
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7eJ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:22:23 sbljserver : DEVICE(service=tui login server=11.1.69.148(11.1.69.148) account=any identity=hanguohua from=11.1.215.205 )",
                            "timestamp": "2019-08-30T13:22:23.000Z",
                            "type": "DEVICE",
                            "service": "tui login",
                            "server": "11.1.69.148(11.1.69.148)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98740
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7eR",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:29:32 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 ld)",
                            "timestamp": "2019-08-30T13:29:32.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98772
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7eU",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:33:15 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 grep FRS_ALL server.log )",
                            "timestamp": "2019-08-30T13:33:15.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98784
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7eY",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:35:05 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 grep 994016946 server.log )",
                            "timestamp": "2019-08-30T13:35:05.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98800
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7eg",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:38:04 sbljserver : OPERATE(service=cmdcheck server=11.1.71.102(11.1.71.102) account=any identity=lijunfeng from=11.1.215.246 ll)",
                            "timestamp": "2019-08-30T13:38:04.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.71.102(11.1.71.102)",
                            "account": "any",
                            "identity": "lijunfeng",
                            "from": "11.1.215.246",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98832
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7eh",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:38:15 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 watch -d -n 3 'grep 994016946 server.log | grep 计算成功 | wc - l' )",
                            "timestamp": "2019-08-30T13:38:15.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98836
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7ey",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:48:15 sbljserver : OPERATE(service=cmdcheck server=11.1.135.58(11.1.135.58) account=use identity=hedongwei from=11.1.215.233 vi check_file_gdm.sh)",
                            "timestamp": "2019-08-30T13:48:15.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.58(11.1.135.58)",
                            "account": "use",
                            "identity": "hedongwei",
                            "from": "11.1.215.233",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98904
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7e2",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:49:46 sbljserver : OPERATE(service=cmdcheck server=11.1.71.102(11.1.71.102) account=any identity=lijunfeng from=11.1.215.246 ll)",
                            "timestamp": "2019-08-30T13:49:46.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.71.102(11.1.71.102)",
                            "account": "any",
                            "identity": "lijunfeng",
                            "from": "11.1.215.246",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98920
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7e5",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:50:35 sbljserver : OPERATE(service=cmdcheck server=11.1.71.102(11.1.71.102) account=any identity=lijunfeng from=11.1.215.246 vi sql_blacklist.sh)",
                            "timestamp": "2019-08-30T13:50:35.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.71.102(11.1.71.102)",
                            "account": "any",
                            "identity": "lijunfeng",
                            "from": "11.1.215.246",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98932
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7e8",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:52:51 sbljserver : OPERATE(service=cmdcheck server=11.1.135.62(11.1.135.62) account=engine identity=huangyibiao from=11.1.215.210 grep FRS_IDX_CK02 server.log c -l)",
                            "timestamp": "2019-08-30T13:52:51.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.62(11.1.135.62)",
                            "account": "engine",
                            "identity": "huangyibiao",
                            "from": "11.1.215.210",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98944
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7e_",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:53:27 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 goetc)",
                            "timestamp": "2019-08-30T13:53:27.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98956
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7fA",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:53:39 sbljserver : OPERATE(service=cmdcheck server=11.1.135.72(11.1.135.72) account=use identity=huangyibiao from=11.1.215.231 cd cfg/)",
                            "timestamp": "2019-08-30T13:53:39.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.135.72(11.1.135.72)",
                            "account": "use",
                            "identity": "huangyibiao",
                            "from": "11.1.215.231",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98960
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7fH",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:54:29 sbljserver : OPERATE(service=cmdcheck server=qd_Pduanyyfwq2(11.1.47.2) account=bap identity=wanghongtao from=11.1.215.249 cd 20190830)",
                            "timestamp": "2019-08-30T13:54:29.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "qd_Pduanyyfwq2(11.1.47.2)",
                            "account": "bap",
                            "identity": "wanghongtao",
                            "from": "11.1.215.249",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 98988
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7fK",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:54:50 sbljserver : OPERATE(service=cmdcheck server=dsj(11.1.110.1) account=root identity=huangyibiao from=11.1.215.206 dockerid=`echo $i` )",
                            "timestamp": "2019-08-30T13:54:50.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "dsj(11.1.110.1)",
                            "account": "root",
                            "identity": "huangyibiao",
                            "from": "11.1.215.206",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99000
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7fM",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:55:29 sbljserver : OPERATE(service=cmdcheck server=11.1.71.102(11.1.71.102) account=any identity=lijunfeng from=11.1.215.246 ls)",
                            "timestamp": "2019-08-30T13:55:29.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.71.102(11.1.71.102)",
                            "account": "any",
                            "identity": "lijunfeng",
                            "from": "11.1.215.246",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99008
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7fO",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 13:59:50 sbljserver : OPERATE(service=cmdcheck server=11.1.71.102(11.1.71.102) account=any identity=lijunfeng from=11.1.215.246 cd BLACKLIST)",
                            "timestamp": "2019-08-30T13:59:50.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.71.102(11.1.71.102)",
                            "account": "any",
                            "identity": "lijunfeng",
                            "from": "11.1.215.246",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99016
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7fP",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:00:16 sbljserver : OPERATE(service=cmdcheck server=11.1.71.102(11.1.71.102) account=any identity=lijunfeng from=11.1.215.246 chmod 777 BLACKLIST)",
                            "timestamp": "2019-08-30T14:00:16.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.71.102(11.1.71.102)",
                            "account": "any",
                            "identity": "lijunfeng",
                            "from": "11.1.215.246",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99020
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7fb",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:15:18 sbljserver : OPERATE(service=cmdcheck server=11.1.69.2(11.1.69.2) account=weblogic identity=lijunfeng from=11.1.215.237 cd 2019-08-30/)",
                            "timestamp": "2019-08-30T14:15:18.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.2(11.1.69.2)",
                            "account": "weblogic",
                            "identity": "lijunfeng",
                            "from": "11.1.215.237",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99068
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7fk",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:30:57 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 ls)",
                            "timestamp": "2019-08-30T14:30:57.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99104
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7fp",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:32:34 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 ls)",
                            "timestamp": "2019-08-30T14:32:34.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99124
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7fq",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:33:39 sbljserver : OPERATE(service=cmdcheck server=HCDB1(11.1.55.33) account=any identity=lihuanhuan from=11.1.215.249 ls)",
                            "timestamp": "2019-08-30T14:33:39.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "HCDB1(11.1.55.33)",
                            "account": "any",
                            "identity": "lihuanhuan",
                            "from": "11.1.215.249",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99128
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7f0",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:35:22 sbljserver : OPERATE(service=cmdcheck server=11.1.136.9(11.1.136.9) account=any identity=suxiaoguang from=11.1.215.241 rm -rf csr.auth.web.war )",
                            "timestamp": "2019-08-30T14:35:22.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.136.9(11.1.136.9)",
                            "account": "any",
                            "identity": "suxiaoguang",
                            "from": "11.1.215.241",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99168
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7f3",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:36:05 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 golog)",
                            "timestamp": "2019-08-30T14:36:05.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99180
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7f6",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:37:43 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 cd /BMJF)",
                            "timestamp": "2019-08-30T14:37:43.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99192
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7f7",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:37:47 sbljserver : OPERATE(service=cmdcheck server=11.1.69.149(11.1.69.149) account=any identity=hanguohua from=11.1.215.205 cd sndsplace/)",
                            "timestamp": "2019-08-30T14:37:47.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "11.1.69.149(11.1.69.149)",
                            "account": "any",
                            "identity": "hanguohua",
                            "from": "11.1.215.205",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99196
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7gN",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:57:47 sbljserver : OPERATE(service=cmdcheck server=AG_ESB_01(11.1.37.77) account=fts identity=xupo from=11.1.215.230 ls)",
                            "timestamp": "2019-08-30T14:57:47.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "AG_ESB_01(11.1.37.77)",
                            "account": "fts",
                            "identity": "xupo",
                            "from": "11.1.215.230",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99268
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7gO",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:58:23 sbljserver : OPERATE(service=cmdcheck server=AG_ESB_01(11.1.37.77) account=fts identity=xupo from=11.1.215.230 pw)",
                            "timestamp": "2019-08-30T14:58:23.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "AG_ESB_01(11.1.37.77)",
                            "account": "fts",
                            "identity": "xupo",
                            "from": "11.1.215.230",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99272
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpToqWNt7AYhj_7gQ",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 14:59:45 sbljserver : OPERATE(service=cmdcheck server=AG_ESB_01(11.1.37.77) account=fts identity=xupo from=11.1.215.230 ls)",
                            "timestamp": "2019-08-30T14:59:45.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "AG_ESB_01(11.1.37.77)",
                            "account": "fts",
                            "identity": "xupo",
                            "from": "11.1.215.230",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99280
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTorWNt7AYhj_7gY",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:11:49 sbljserver : Login Shterm(web)(id=8895 service=mix server=None(None) account=None identity=fxyj1 from=11.1.216.16 login authorize fail)",
                            "timestamp": "2019-08-30T15:11:49.000Z",
                            "type": "",
                            "service": "mix",
                            "server": "None(None)",
                            "account": "None",
                            "identity": "fxyj1",
                            "from": "11.1.216.16",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99312
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTorWNt7AYhj_7ga",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:12:42 sbljserver : Login Shterm(web)(service=mix server=None(None) account=None identity=fxyj1 from=11.1.216.16 login authorize success)",
                            "timestamp": "2019-08-30T15:12:42.000Z",
                            "type": "Login Shterm(web)",
                            "service": "mix",
                            "server": "None(None)",
                            "account": "None",
                            "identity": "fxyj1",
                            "from": "11.1.216.16",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99320
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTorWNt7AYhj_7gb",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:12:52 sbljserver : OPERATE(service=cmdcheck server=zfsrv2(11.1.36.34) account=any identity=zhengzhonghao from=11.1.10.204 ls -lrt)",
                            "timestamp": "2019-08-30T15:12:52.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "zfsrv2(11.1.36.34)",
                            "account": "any",
                            "identity": "zhengzhonghao",
                            "from": "11.1.10.204",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99324
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTorWNt7AYhj_7gf",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:13:23 sbljserver : OPERATE(service=cmdcheck server=nbumaster2(11.1.49.2) account=any identity=yueyang from=11.1.10.54 ll)",
                            "timestamp": "2019-08-30T15:13:23.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "nbumaster2(11.1.49.2)",
                            "account": "any",
                            "identity": "yueyang",
                            "from": "11.1.10.54",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99340
                        }
                    }, {
                        "_shard": "[blj_default_syslog-20190912][0]",
                        "_node": "cfqosayeQF6j1wjJaSpS4w",
                        "_index": "blj_default_syslog-20190912",
                        "_type": "blj_default_syslog",
                        "_id": "AW0jpTorWNt7AYhj_7gg",
                        "_score": 1,
                        "_source": {
                            "@hostname": "elk01",
                            "@filename": "blj_syslog.log",
                            "@filepath": "/home/elk/test/lis/data/bljsyslog/blj_syslog.log",
                            "@transBeginTime": null,
                            "@message": "Aug 30 15:13:30 sbljserver : OPERATE(service=cmdcheck server=TEST_UAT1(11.1.196.104) account=any identity=liujianhui from=11.1.10.49 date)",
                            "timestamp": "2019-08-30T15:13:30.000Z",
                            "type": "OPERATE",
                            "service": "cmdcheck",
                            "server": "TEST_UAT1(11.1.196.104)",
                            "account": "any",
                            "identity": "liujianhui",
                            "from": "11.1.10.49",
                            "@rule_alias": "blj_default_syslog",
                            "@store_name": "blj_default_syslog",
                            "@rule_name": "blj_default_syslog",
                            "@linenum": 99344
                        }
                    }
                    ]
            };
            // vm.gatewayTableParams = new NgTableParams({
            //     filter: {},
            //     sorting: {},
            //     page: 1,//展示第一页
            //     count: 15,//每页有15个数据项
            //     url: ''
            // },{
            //     dataset:list.hits
            // });

            vm.gatewayTableParams.settings().dataset = list.hits;
            vm.gatewayTableParams.reload();
        }

        function loadServerTable() {
            console.log(vm.dateRange);

            vm.serverTableParams = new NgTableParams({
                filter: {},
                sorting: {},
                page: 1,//展示第一页
                count: 10,//每页有15个数据项
                url: '',
            }, {
                getData: function (data) {
                    console.log(data);

                    var params = {
                        "types": [],
                        "startTime": moment(vm.dateRange.startDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z"),
                        "endTime": moment(vm.dateRange.endDate).format("YYYY-MM-DD\\THH:mm:ss.SSS\\Z"),
                        "fields": [],
                        "from": data.count(),
                        "size": data.page(),
                        "sortFields": {},
                        "filterFields": {},
                        "index": "bup_hkzfapp02_wtmp*",
                        "queryString": ""

                    };
                    console.log(params);

                    return httpServerTable(params).then(function (list) {
                        console.log(list);
                        var items = list.filter(function (item) {
                            return item.ip == vm.server.ip;
                        });
                        data.total(items.length);
                        return items;
                    });


                }
            });

            function httpServerTable(params) {
                var defer = $q.defer();
                vm.serverDataload = true;
                EsService.getLogInfo.post(params, function (res) {
                    vm.serverDataload = false;
                    console.log("sql查询结果", res);
                    // var list = res.hit;
                    var list = [
                        {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (10.128.0.205)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "10.128.0.205"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (10.128.0.205)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "10.128.0.205"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (10.128.0.205)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "10.128.0.205"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (10.128.2.171)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "10.128.2.171"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (10.128.0.205)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "10.128.0.205"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (10.128.0.205)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "10.128.0.205"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (10.128.2.171)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "10.128.2.171"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (10.128.2.171)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "10.128.2.171"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (202.231.33.87)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "202.231.33.87"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (123.149.84.138)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "123.149.84.138"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (11.1.216.51)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "11.1.216.51"
                    }, {
                        "@message": "bapmps pts/9 2019-09-11 10:00 (11.1.70.75)",
                        "timestamp": "2019-09-11T10:00:00.000Z",
                        "@timestamp": "2019-09-11T10:00:00.000Z",
                        "username": "bapmps",
                        "line": "pts/9",
                        "ip": "11.1.70.75"
                    }];


                    defer.resolve(list);
                }, function (err) {
                    vm.serverDataload = false;
                    toastr.error("查询出错", "错误提示", err);
                });

                return defer.promise;

            }


        }

        /**
         * 登录服务器change
         */
        function handleChangeServer() {
            console.log(vm.server);
            loadServerTable();
        }

        function handleChangeDate() {
            console.log(vm.dateRange);
            loadServerTable();
            loadGatewayTable();
        }

        function searchServer(item) {
            var server = item._source.server;
            var ip = server.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)[0];

            vm.server=vm.serverRange.filter(function (item) {
                return item.ip===ip;
            })[0];

            if(vm.server) vm.handleChangeServer();
        }

        vm.addEs = function () {
            // return;
            var es = [
                {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "huangfei",
                    "line": " vpns4",
                    "comment": "123.149.84.138",
                    "@timestamp": "2019-09-03T11:39:37.345Z",
                    "timestamp": "2019-09-03T11:39:37.345Z",
                    "@message": "huangfei vpns4        Aug  1 00:24 (123.149.84.138)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shhanxx",
                    "line": " vpns3",
                    "comment": "123.149.84.138",
                    "@timestamp": "2019-09-02T10:39:37.345Z",
                    "@message": "shhanxx  vpns3       2019-09-02T10:39:37.345Z (123.149.84.138)",
                    "timestamp": "2019-09-02T10:39:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shhanxx",
                    "line": " vpns4",
                    "comment": "123.149.84.138",
                    "@timestamp": "2019-09-03T16:39:37.345Z",
                    "@message": "shhanxx  vpns4       2019-09-03T16:39:37.345Z (123.149.84.138)",
                    "timestamp": "2019-09-03T16:39:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shhanxx",
                    "line": " vpns3",
                    "comment": "123.149.84.138",
                    "@timestamp": "2019-09-4T10:43:37.345Z",
                    "@message": "shhanxx  vpns3       2019-09-4T10:43:37.345Z (123.149.84.138)",
                    "timestamp": "2019-09-4T10:43:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "jihai",
                    "line": " vpns4",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-09-04T15:39:37.345Z",
                    "@message": "jihai    vpns4       2019-09-04T15:39:37.345Z (101.88.242.136)",
                    "timestamp": "2019-09-04T15:39:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "hrcu312",
                    "line": " vpns3",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-28T11:53:37.345Z 02:50",
                    "@message": "hrcu312  vpns3       2019-08-28T11:53:37.345Z 02:50 (101.88.242.136)",
                    "timestamp": "2019-08-28T11:53:37.345Z 02:50"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "hrcu312",
                    "line": " vpns4",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-09-03T03:35:37.345Z",
                    "@message": "hrcu312  vpns4       2019-09-03T03:35:37.345Z (183.192.133.103)",
                    "timestamp": "2019-09-03T03:35:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns3",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-28T11:53:37.345Z 03:37",
                    "@message": "shjihai  vpns3       2019-08-28T11:53:37.345Z 03:37 (101.88.242.136)",
                    "timestamp": "2019-08-28T11:53:37.345Z 03:37"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "hrcu312",
                    "line": " vpns4",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-08-28T11:53:37.345Z 03:41",
                    "@message": "hrcu312  vpns4       2019-08-28T11:53:37.345Z 03:41 (183.192.133.103)",
                    "timestamp": "2019-08-28T11:53:37.345Z 03:41"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns3",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-28T11:53:37.345Z 07:08",
                    "@message": "shjihai  vpns3       2019-08-28T11:53:37.345Z 07:08 (101.88.242.136)",
                    "timestamp": "2019-08-28T11:53:37.345Z 07:08"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shhanxx",
                    "line": " vpns5",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-08-28T11:53:37.345Z 08:28",
                    "@message": "shhanxx  vpns5       2019-08-28T11:53:37.345Z 08:28 (183.192.133.103)",
                    "timestamp": "2019-08-28T11:53:37.345Z 08:28"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "wujing",
                    "line": " vpns6",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-08-28T11:53:37.345Z 08:32",
                    "@message": "wujing   vpns6       2019-08-28T11:53:37.345Z 08:32 (183.192.133.103)",
                    "timestamp": "2019-08-28T11:53:37.345Z 08:32"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "wujing",
                    "line": " vpns6",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-08-28T11:53:37.345Z 08:56",
                    "@message": "wujing   vpns6       2019-08-28T11:53:37.345Z 08:56 (183.192.133.103)",
                    "timestamp": "2019-08-28T11:53:37.345Z 08:56"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "wujing",
                    "line": " vpns3",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-08-28T11:53:37.345Z 09:29",
                    "@message": "wujing   vpns3       2019-08-28T11:53:37.345Z 09:29 (183.192.133.103)",
                    "timestamp": "2019-08-28T11:53:37.345Z 09:29"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "huangfei",
                    "line": " vpns3",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-08-28T11:53:37.345Z 09:45",
                    "@message": "huangfei vpns3       2019-08-28T11:53:37.345Z 09:45 (183.192.133.103)",
                    "timestamp": "2019-08-28T11:53:37.345Z 09:45"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "zhengan",
                    "line": " vpns6",
                    "comment": "171.9.132.118",
                    "@timestamp": "2019-09-03T11:53:37.345Z",
                    "@message": "zhengan  vpns6       2019-09-03T11:53:37.345Z (171.9.132.118)",
                    "timestamp": "2019-09-03T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "zhengan",
                    "line": " vpns6",
                    "comment": "171.9.132.118",
                    "@timestamp": "2019-08-28T11:53:37.345Z",
                    "@message": "zhengan  vpns6       2019-08-28T11:53:37.345Z 12:12 (171.9.132.118)",
                    "timestamp": "2019-08-28T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns3",
                    "comment": "171.9.132.118",
                    "@timestamp": "2019-08-28T11:53:37.345Z",
                    "@message": "shjihai  vpns3       2019-08-28T11:53:37.345Z 15:18 (171.9.132.118)",
                    "timestamp": "2019-08-28T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns7",
                    "comment": "171.9.132.118",
                    "@timestamp": "2019-08-28T11:53:37.345Z",
                    "@message": "shjihai  vpns7       2019-08-28T11:53:37.345Z 15:38 (171.9.132.118)",
                    "timestamp": "2019-08-28T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns3",
                    "comment": "171.9.132.118",
                    "@timestamp": "2019-08-28T11:53:37.345Z",
                    "@message": "shjihai  vpns3       2019-08-28T11:53:37.345Z 15:47 (171.9.132.118)",
                    "timestamp": "2019-08-28T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns7",
                    "comment": "171.9.132.118",
                    "@timestamp": "2019-08-28T11:53:37.345Z",
                    "@message": "shjihai  vpns7       2019-08-28T11:53:37.345Z 15:49 (171.9.132.118)",
                    "timestamp": "2019-08-28T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "huangfei",
                    "line": " vpns3",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-08-28T11:53:37.345Z",
                    "@message": "huangfei vpns3       2019-08-28T11:53:37.345Z 16:11 (183.192.133.103)",
                    "timestamp": "2019-08-28T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "zhengan",
                    "line": " vpns3",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-08-28T11:53:37.345Z",
                    "@message": "zhengan  vpns3       2019-08-28T11:53:37.345Z 21:47 (183.192.133.103)",
                    "timestamp": "2019-08-28T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns5",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-29T11:53:37.345Z",
                    "@message": "shjihai  vpns5       2019-08-29T11:53:37.345Z (101.88.242.136)",
                    "timestamp": "2019-08-29T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns0",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-29T11:53:37.345Z",
                    "@message": "shjihai  vpns0       2019-08-29T11:53:37.345Z (101.88.242.136)",
                    "timestamp": "2019-08-29T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shhanxx",
                    "line": " vpns5",
                    "comment": "171.9.132.118",
                    "@timestamp": "2019-08-30T11:53:37.345Z",
                    "@message": "shhanxx  vpns5       2019-08-30T11:53:37.345Z (171.9.132.118)",
                    "timestamp": "2019-08-30T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "hrcu312",
                    "line": " vpns4",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-08-31T11:53:37.345Z",
                    "@message": "hrcu312  vpns4       2019-08-31T11:53:37.345Z (183.192.133.103)",
                    "timestamp": "2019-08-31T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "huangfei",
                    "line": " vpns5",
                    "comment": "218.82.240.253",
                    "@timestamp": "2019-09-01T11:53:37.345Z",
                    "@message": "huangfei vpns5       2019-09-01T11:53:37.345Z (218.82.240.253)",
                    "timestamp": "2019-09-01T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns0",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-28T11:53:37.345Z",
                    "@message": "shjihai  vpns0       2019-08-28T11:53:37.345Z (101.88.242.136)",
                    "timestamp": "2019-08-28T11:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns5",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-28T00:53:37.345Z",
                    "@message": "shjihai  vpns5       2019-08-28T00:53:37.345Z (101.88.242.136)",
                    "timestamp": "2019-08-28T00:53:37.345Z"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns0",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-29T01:53:37.345Z",
                    "timestamp": "2019-08-29T01:53:37.345Z",
                    "@message": "shjihai  vpns0       2019-08-29T01:53:37.345Z (101.88.242.136)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns5",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-29T01:03:37.345Z",
                    "timestamp": "2019-08-29T01:03:37.345Z",
                    "@message": "shjihai  vpns5       2019-08-29T01:03:37.345Z (101.88.242.136)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns0",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-28T01:49:37.345Z",
                    "timestamp": "2019-08-28T01:49:37.345Z",
                    "@message": "shjihai  vpns0       2019-08-28T01:49:37.345Z (101.88.242.136)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns5",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-28T01:51:37.345Z",
                    "timestamp": "2019-08-28T01:51:37.345Z",
                    "@message": "shjihai  vpns5       2019-08-28T01:51:37.345Z (101.88.242.136)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns0",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-28T12:19:37.345Z",
                    "timestamp": "2019-08-28T12:19:37.345Z",
                    "@message": "shjihai  vpns0       2019-08-28T12:19:37.345Z (101.88.242.136)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "hrcu312",
                    "line": " vpns0",
                    "comment": "183.192.133.103",
                    "@timestamp": "2019-08-28T17:50:37.345Z",
                    "timestamp": "2019-08-28T17:50:37.345Z",
                    "@message": "hrcu312  vpns0       2019-08-28T17:50:37.345Z (183.192.133.103)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shjihai",
                    "line": " vpns4",
                    "comment": "101.88.242.136",
                    "@timestamp": "2019-08-28T21:23:37.345Z",
                    "timestamp": "2019-08-28T21:23:37.345Z",
                    "@message": "shjihai  vpns4       2019-08-28T21:23:37.345Z (101.88.242.136)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "wujing",
                    "line": " vpns3",
                    "comment": "221.176.112.2",
                    "@timestamp": "2019-08-29T08:36:37.345Z",
                    "timestamp": "2019-08-29T08:36:37.345Z",
                    "@message": "wujing   vpns3       2019-08-29T08:36:37.345Z (183.192.133.103)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shhanxx",
                    "line": " vpns3",
                    "comment": "221.176.112.2",
                    "@timestamp": "2019-08-29T09:13:37.345Z",
                    "timestamp": "2019-08-29T09:13:37.345Z",
                    "@message": "shhanxx  vpns3       2019-08-29T09:13:37.345Z (183.192.133.103)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "mayafeng",
                    "line": " vpns5",
                    "comment": "221.176.112.2",
                    "@timestamp": "2019-08-27T09:23:37.345Z",
                    "timestamp": "2019-08-27T09:23:37.345Z",
                    "@message": "mayafeng vpns5       2019-08-27T09:23:37.345Z (183.192.133.103)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "zhengan",
                    "line": " vpns6",
                    "comment": "171.9.132.118",
                    "@timestamp": "2019-08-27T10:23:37.345Z",
                    "timestamp": "2019-08-27T10:23:37.345Z",
                    "@message": "zhengan  vpns6       2019-08-27T10:23:37.345Z (171.9.132.118)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "mayafeng",
                    "line": " vpns4",
                    "comment": "218.82.240.253",
                    "@timestamp": "2019-08-27T10:43:37.345Z",
                    "timestamp": "2019-08-27T10:43:37.345Z",
                    "@message": "mayafeng vpns4       2019-08-27T10:43:37.345Z (183.192.133.103)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "shhanxx",
                    "line": " vpns0",
                    "comment": "218.82.240.253",
                    "@timestamp": "2019-08-27T10:43:37.345Z",
                    "timestamp": "2019-08-27T10:43:37.345Z",
                    "@message": "shhanxx  vpns0       2019-08-27T10:43:37.345Z (183.192.133.103)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "hrcu312",
                    "line": " vpns3",
                    "comment": "218.82.240.253",
                    "@timestamp": "2019-08-26T10:43:37.345Z",
                    "timestamp": "2019-08-26T10:43:37.345Z",
                    "@message": "hrcu312  vpns3       2019-08-26T10:43:37.345Z (183.192.133.103)"
                }, {
                    "@hostname": "linux-node01",
                    "@ip": "202.231.33.87",
                    "name": "mayafeng",
                    "line": " vpns5",
                    "comment": "218.82.240.253",
                    "@timestamp": "2019-08-25T10:43:37.345Z",
                    "timestamp": "2019-08-25T10:43:37.345Z",
                    "@message": "mayafeng vpns5       2019-08-25T10:43:37.345Z (183.192.133.103)"
                }];

            es = [
                {
                    "@filename": "wtmp",
                    "@filepath": "/var/log/wtmp",
                    "@message": "bapmps pts/9 2019-09-11 10:00 (11.1.216.51)",
                    "timestamp": "2019-09-11T10:00:00.000Z",
                    "@rule_alias": "bup_hkzfapp02_wtmp",
                    "@store_name": "bup_hkzfapp02_wtmp",
                    "@rule_name": "bup_hkzfapp02_wtmp"
                }, {
                    "@filename": "wtmp",
                    "@filepath": "/var/log/wtmp",
                    "@message": "bapmps pts/9 2019-09-11 10:00 (11.1.216.51)",
                    "timestamp": "2019-09-11T10:00:00.000Z",
                    "@rule_alias": "bup_hkzfapp02_wtmp",
                    "@store_name": "bup_hkzfapp02_wtmp",
                    "@rule_name": "bup_hkzfapp02_wtmp"
                }, {
                    "@filename": "wtmp",
                    "@filepath": "/var/log/wtmp",
                    "@message": "bapmps pts/9 2019-09-11 10:00 (11.1.216.51)",
                    "timestamp": "2019-09-11T10:00:00.000Z",
                    "@rule_alias": "bup_hkzfapp02_wtmp",
                    "@store_name": "bup_hkzfapp02_wtmp",
                    "@rule_name": "bup_hkzfapp02_wtmp"
                }, {
                    "@filename": "wtmp",
                    "@filepath": "/var/log/wtmp",
                    "@message": "bapmps pts/9 2019-09-11 10:00 (11.1.216.51)",
                    "timestamp": "2019-09-11T10:00:00.000Z",
                    "@rule_alias": "bup_hkzfapp02_wtmp",
                    "@store_name": "bup_hkzfapp02_wtmp",
                    "@rule_name": "bup_hkzfapp02_wtmp"
                }, {
                    "@filename": "wtmp",
                    "@filepath": "/var/log/wtmp",
                    "@message": "bapmps pts/9 2019-09-11 10:00 (11.1.216.51)",
                    "timestamp": "2019-09-11T10:00:00.000Z",
                    "@rule_alias": "bup_hkzfapp02_wtmp",
                    "@store_name": "bup_hkzfapp02_wtmp",
                    "@rule_name": "bup_hkzfapp02_wtmp"
                }
            ];

            angular.forEach(es, function (item) {
                AuditService.addEs(item, function () {

                })
            })
        }

    }


})();
