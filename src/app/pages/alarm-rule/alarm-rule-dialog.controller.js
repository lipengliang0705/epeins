(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-rule')
        .controller('AlarmRuleDialogController', AlarmRuleDialogController);

    AlarmRuleDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'AlarmRule', 'EventRule', 'AlarmLevel', '$rootScope', 'DataDashboard','AlarmTypeService'];

    function AlarmRuleDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, AlarmRule, EventRule, AlarmLevel, $rootScope, DataDashboard,AlarmTypeService) {

        var vm = this;
        vm.alarmRule = entity;
        if (vm.alarmRule.conf) {
            vm.alarmRule.conf = angular.fromJson(vm.alarmRule.conf);
            // vm.alarmRule.notifyRole = angular.fromJson(vm.alarmRule.notifyRole);
            console.log( vm.alarmRule);
        }
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.eventrules = EventRule.query();
        vm.alarmLevels = AlarmLevel.query();

        vm.timeList = ['seconds','minutes', 'hours', 'days'];
        vm.dashboardData = [];
        vm.sampleHeard = [];//解析规则的数据头
        var alarmTypeListOrigin=[];//告警类型原始数据列表
        vm.alarmTypeList = [];//告警类型列表
        vm.levelArr=[
            {value:1,name:'1'},
            {value:2,name:'2'},
            {value:3,name:'3'},
            {value:4,name:'4'},
            {value:5,name:'5'},
            {value:6,name:'6'},
        ];
        vm.options = options;
        vm.handleChangeEventRule = handleChangeEventRule;
        vm.handleChangeAlarmType = handleChangeAlarmType;
        vm.handleChangeNotifyType = handleChangeNotifyType;
        vm.handleChangeAlarmTypeConfig = handleChangeAlarmTypeConfig;

        $timeout(function () {
            angular.element('.form-group:eq(1)>input').focus();
        });

        loadAll();

        function loadAll() {
            getDataDashboardByType();
            getSampleHeard();
            getAlarmTypeList();
        }

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            // vm.isSaving = true;
            // vm.alarmRule.status = "on";
            // vm.alarmRule.conf = angular.toJson(extend2Conf(vm.alarmRule.alarmType));
            // console.log(vm.alarmRule);
            // console.log($scope.fchat.replies);
            // var obj = vm.alarmRule;
            // obj.replies = $scope.fchat.replies;
            // // obj.id=new Date().getTime();
            // delete vm.alarmRule.replies;
            // delete vm.alarmRule.extend;
            // console.log(vm.alarmRule);
            // vm.alarmRule.alarmLevel = {
            //     "id": 1,
            //     "name": "WARNING",
            //     "color": "YELLOW",
            //     "description": "黄色告警",
            //     "alarmRules": null
            // };

            var params=angular.copy(vm.alarmRule);
            params.conf=angular.toJson(params.conf);

           params.notifyRole=vm.alarmType.id;
            // params.notifyRole='413351763@qq.com';
            // params.notifyMember='事件告警';

            console.log(params);
            if (vm.alarmRule.id !== null) {
                AlarmRule.update(params, onSaveSuccess, onSaveError);
                // 更新
                // $rootScope.$broadcast('alarmRuleUpdateSuccess',obj)

            } else {
                AlarmRule.save(params, onSaveSuccess, onSaveError);
                // 新增
                // $rootScope.$broadcast('alarmRuleAddSuccess',obj)
            }
        }

        function onSaveSuccess(result) {
            // $scope.$emit('LoginsightUiApp.page.alarm-rule:alarmRuleUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.createTime = false;
        vm.datePickerOpenStatus.modifiedTime = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }


        $scope.fchat = new Object();
        $scope.fchat.replies = [{key: 0, value: ""}];
        // 初始化时由于只有1条回复，所以不允许删除
        $scope.fchat.canDescReply = false;

        //添加触发告警级别
        $scope.fchat.incrReply = function ($index) {
            if ($scope.fchat.replies.length > 2) {
                return;
            }
            $scope.fchat.replies.splice($index + 1, 0,
                {key: new Date().getTime(), value: ""});   // 用时间戳作为每个item的key
            // 增加新的回复后允许删除
            $scope.fchat.canDescReply = true;
        }
        // 减少触发告警级别
        $scope.fchat.decrReply = function ($index) {
            // 如果告警级别大于1，删除被点击回复
            if ($scope.fchat.replies.length > 1) {
                $scope.fchat.replies.splice($index, 1);
            }
            // 如果告警级别为1，不允许删除
            if ($scope.fchat.replies.length == 1) {
                $scope.fchat.canDescReply = false;
            }
        }

        function getDataDashboardByType() {
            DataDashboard.getDataDashboardByType({type: 'sql_spl'}, function (res) {
                vm.dashboardData = res;
            }, function (err) {

            })
        }

        function options() {
            if (!vm.alarmRule.conf) return '';
            var json = angular.fromJson(vm.alarmRule.conf.queryBy);
            json.options = angular.fromJson(json.options);
            console.log(json);
            if (json.type == 'FORM_LUCENE') {
                vm.alarmRule.conf.query = json.options.queryParams.queryString;
            } else if (json.type == 'sql_spl') {
                vm.alarmRule.conf.query = json.options.config.query;
            }
        }

        /**
         * 获取解析规则的数据头
         */
        function getSampleHeard() {
            var result = [];
            var eventRule=angular.copy(vm.alarmRule.eventRule);
            if(eventRule&&eventRule.eventRule){
                eventRule.eventRule=angular.fromJson(eventRule.eventRule);
                console.log(eventRule);
                eventRule.eventRule.fields.forEach(function(_d) {
                    result.push(_d.name);
                })

                console.log(result);
                vm.sampleHeard=result;
            }
        }
        
        function handleChangeEventRule() {
            getSampleHeard();
        }

        function handleChangeAlarmType() {
            vm.alarmRule.conf={};
        }

        function getAlarmTypeList() {
            AlarmTypeService.query(function (res) {
                if(res.length>0){
                    alarmTypeListOrigin=res;
                    if(vm.alarmRule.notifyType&&vm.alarmRule.notifyType!='NULL'){
                        handleChangeNotifyType();
                    }
                    if(vm.alarmRule.id){
                        vm.alarmType=alarmTypeListOrigin.filter(function (item) {
                            return item.id==vm.alarmRule.notifyRole
                        })[0];

                        console.log(vm.alarmType);
                    }
                }
            })
        }

        function handleChangeNotifyType() {
            console.log(vm.alarmRule.notifyType)
            if(vm.alarmRule.notifyType==='EMAIL'){
                vm.alarmTypeList=alarmTypeListOrigin.filter(function (item) {
                    return item.type==0;
                })
            }else if(vm.alarmRule.notifyType==='SMS'){
                vm.alarmTypeList=alarmTypeListOrigin.filter(function (item) {
                    return item.type==1;
                })
            }

        }

        function handleChangeAlarmTypeConfig() {
            console.log(vm.alarmType);

            // params.notifyRole=vm.alarmType.contactWay;
            // params.notifyMember=vm.alarmType.title;
        }


    }
})();
