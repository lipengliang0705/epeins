(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-result')
        .controller('AlarmResultDialogController', AlarmResultDialogController);

    AlarmResultDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'AlarmRule', 'EventRule'];

    function AlarmResultDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, AlarmRule, EventRule) {
        var vm = this;

        vm.alarmRule = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.eventrules = EventRule.query();

        vm.alarmRule.extend = angular.fromJson(conf2Extend(vm.alarmRule.alarmType , vm.alarmRule.conf));

        vm.timeList = ['second', 'minutes', 'hour'];

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            vm.alarmRule.conf = angular.toJson(extend2Conf(vm.alarmRule.alarmType, vm.alarmRule.extend));
            if (vm.alarmRule.id !== null) {
                AlarmRule.update(vm.alarmRule, onSaveSuccess, onSaveError);
            } else {
                AlarmRule.save(vm.alarmRule, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('tssLoginsightUiApp:alarmRuleUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.createTime = false;
        vm.datePickerOpenStatus.modifiedTime = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }

        /**
         * 把extend字段转换成conf字段
         */
        function extend2Conf (type, extend) {
            var units = extend.units;
            var numerical = extend.numerical;
            var compare = extend.compare;
            var number = extend.number;
            var filter = extend.query ? [
                {
                    'query': {
                        'query_string': {
                            'query': extend.query
                        }
                    }
                }
            ] : undefined;

            var result = {};
            result['timeframe'] = {};
            result['timeframe'][units] = numerical;

            result[compare] = {};
            result[compare] = number;

            result['filter'] = filter;
            return result;
        }

        /**
         * 把conf字段转换成extend字段
         */
        function conf2Extend (type, conf) {
            switch (type) {
                case 'KEYWORDS':

                    break;
                case 'BEYOND_EVENT_COUNT':

                    return BEYOND_EVENT_COUNT(conf);
                    break;

                default:
                    return false;
            }

            /**
             * 事件计数告警
             */
            function BEYOND_EVENT_COUNT(conf) {

                var timeframe = conf.timeframe || {};
                var units = Object.keys(timeframe)[0] || '';
                var numerical = timeframe && timeframe[units];
                var compare = 'num_events';
                var number = conf[compare];
                var filter = conf.filter ? conf.filter[0]['query']['query_string']['query'] : undefined;

                var result = {};
                result['units'] = units;
                result['numerical'] = numerical;
                result['compare'] = compare;
                result['number'] = number;
                result['query'] = filter;
                return result;
            }
        }
    }
})();
