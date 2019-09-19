(function () {
    'use strict';
    /**
     * @ 新增仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.file-place');
    app.controller("filePlaceSettingController", filePlaceSettingController);
    filePlaceSettingController.$inject = ['$uibModalInstance', 'toastr', '$rootScope', '$state', 'EventRule', 'FilePlaceService', 'transferData'];

    function filePlaceSettingController($uibModalInstance, toastr, $rootScope, $state, EventRule, FilePlaceService, transferData) {
        moment.locale('zh-cn');
        console.log(transferData);
        var vm = this;

        var jobCron;
        if (transferData.jobCron) {
            jobCron = cronChangeDate(transferData.jobCron);
            console.log(jobCron.loopTime.toString());
        }

        vm.data = {
            name: transferData.archiveName ? transferData.archiveName : '',
            indexRange: transferData.indexRange ? transferData.indexRange : '',
            isDelete: transferData.id ? !!transferData.isDelete : true,
            startTime: jobCron ? new Date(jobCron.loopTime.toString()) : '',
            cycle: jobCron ? jobCron.loopType : 'WEEKLY',
            day: (jobCron && jobCron.loopType === 'WEEKLY') ? jobCron.loopValue : '0',
            id: transferData.id || '',
        };


        vm.method = {
            submit: submit,
            cancel: cancel,
            handleChangeIndexName: handleChangeIndexName,
        }
        // 开始时间
        vm.startTimeOpts = {
            date: new Date(),
            isOpen: false,
            openCalendar: function (e) {
                e.preventDefault();
                e.stopPropagation();
                vm.startTimeOpts.isOpen = true;
            }
        }
        // 结束时间
        vm.endTimeOpts = {
            date: new Date(),
            isOpen: false,
            openCalendar: function (e) {
                e.preventDefault();
                e.stopPropagation();
                vm.startTimeOpts.isOpen = true;
            }
        }

        vm.indexNameArr = [];//索引名数组

        loadAll();

        function loadAll() {
            getEventRules();
        }

        function getEventRules() {
            EventRule.query(function (result) {
                console.log('eventRules', result);

                //通过解析规则 获取所有解析规则
                vm.indexNameArr = getIndexNameFromEventRules(result);
            })
        }

        /**
         * 通过解析规则 获取所有解析规则
         * @param data
         * @returns {Array}
         */
        function getIndexNameFromEventRules(data) {
            var _arr = [];
            angular.forEach(data, function (item) {
                if (_arr.indexOf(item.name) == -1) {
                    _arr.push(item.name);
                }
            });

            return _arr;
        }

        function submit() {
            if (transferData.id) {
                update();
            } else {
                add();
            }
        }

        function add() {
            var data = toCronObj(vm.data);

            var params = {
                archiveName: vm.data.name,
                indexRange: vm.data.indexRange,
                isDelete: vm.data.isDelete?1:0,
                jobCron: dateChangeCron(data),
            }
            console.log(params);

            FilePlaceService.add(params, function (res) {
                console.log(res);
                if (res.code === 200) {
                    $rootScope.$broadcast('file-place-add-success', res);
                    toastr.success('归档任务添加成功！');
                    cancel();
                } else {
                    toastr.error(res.msg, '错误提示');
                }
            }, function (err) {
                toastr.error(err.data.message, '错误提示');
            });
        }

        function update() {
            var data = toCronObj(vm.data);

            var params = {
                archiveName: vm.data.name,
                jobCron: dateChangeCron(data),
                id: transferData.id,
                isDelete: vm.data.isDelete?1:0,
                jobId: transferData.xxlJobJson.id
            }
            console.log(params);

            FilePlaceService.update(params, function (res) {
                console.log(res);
                if (res.code === 200) {
                    $rootScope.$broadcast('file-place-update-success', res);
                    toastr.success('修改归档任务成功！');
                    cancel();
                } else {
                    toastr.error(res.msg || '修改归档任务失败！', '错误提示');
                }

            }, function (err) {
                toastr.error(err.data.message || '修改归档任务失败！', '错误提示');
            });
        }

        /**
         * 将表单内容转换成dateChangeCron所需要的参数
         * @param data
         * @returns {{effectTime: number | moment.Moment | *, loopType: string, wloopValue: *[]}}
         */
        function toCronObj(data) {
            var h = new Date(data.startTime).getHours();
            var m = new Date(data.startTime).getMinutes();
            var date;
            if (data.cycle === 'WEEKLY') {
                date = moment().hour(h).minutes(m).weekday(data.day);
                console.log(date);
            } else if (data.cycle === 'DAILY') {
                date = moment().hour(h).minutes(m);
                console.log(date)
            }

            return {
                effectTime: date,
                loopType: vm.data.cycle,
                wloopValue: [vm.data.day]
            };
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        /**
         * 选择好索引后自动拼接索引范围
         */
        function handleChangeIndexName() {
            console.log(vm.data.indexName);
            vm.data.indexRange = vm.data.indexName + '-*';
        }

        /**
         * 转换成cron字符串
         * @param dates
         * @returns {string}
         * 0 22 11 ? * 1
         */
        function dateChangeCron(dates) {
            var m = '';
            var h = '';
            var w = dates.wloopValue || '';
            var mo = dates.mloopValue || '';
            if (dates.effectTime) {
                h = dates.effectTime.get('hour');
                m = dates.effectTime.get('minute');
            }
            var loopType = dates.loopType;// 获取的参数，即循环方式
            var cron = '';
            if (loopType === 'DAILY') { //天循环
                cron = '0' + ' ' + m + ' ' + h + ' * * ?';
            } else if (loopType === 'WEEKLY') { // 星期天为0，星期6为6，周循环
                cron = '0' + ' ' + m + ' ' + h + ' ? * ' + w.join(',');
            } else if (loopType === 'MONTHLY') { // 1-31，月循环
                cron = m + ' ' + h + ' ' + mo.join(',') + ' * *';
            }

            console.log(cron);
            return cron;
        }

        /**
         * 将cron字符串转换成对象
         * @param str
         */
        function cronChangeDate(str) {
            var toDate = {};
            if (!str) {
                toDate.loopType = '单次循环'; //空的为单次，即不循环
            } else {
                var result = str.split(' ').join('');
                var count = 0;// *的个数
                result.replace(/\*/g, function (m, i) { // '*'需要转义
                    if (m === '*') {
                        count++;
                    }
                })
                var nArr = str.split(' ');
                var strLast = str.charAt(str.length - 1);
                if (count > 1) { // *的数量为3则为按天循环
                    toDate.loopType = 'DAILY';
                } else if (strLast === '*' && count === 2) { // 最后一个为*则为按月循环
                    toDate.loopType = 'WEEKLY';
                    var mot = [];
                    var mkeys = nArr[2].split(',');
                    for (var i = 0; i < mkeys.length; i++) {
                        var mo = mkeys[i] + '号';
                        mot.push(mo);
                    }
                    toDate.loopValue = mot.join(',');
                } else {
                    toDate.loopType = 'WEEKLY';
                    var keys = nArr[5];
                    var en2cnMap = { //跟java的星期对应不一样，java的对应为1-7对应周天-周六
                        1: '1',
                        2: '2',
                        3: '3',
                        4: '4',
                        5: '5',
                        6: '6',
                        7: '7'
                    }
                    if (keys) {
                        var cnKeys = keys.split(',').map(function (key, idx) {
                            return en2cnMap[key];
                        })
                        toDate.loopValue = cnKeys.join(',')
                    }
                }
                toDate.loopTime = moment().hour(nArr[2]).minutes(nArr[1]).seconds(0);
            }

            console.log(toDate);
            return toDate //返回一个对象，根据需要解析成想要的样子
        }
    }
})();