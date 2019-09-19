/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('LoginsightUiApp.theme.components')
    .controller('MsgCenterCtrl', MsgCenterCtrl);

  MsgCenterCtrl.$inject = ['$scope', '$rootScope', '$state', 'JhiTrackerService', 'toastr', 'AlarmResult', 'AlarmInfoService', 'ngToast'];
  /** @ngInject */
  function MsgCenterCtrl($scope, $rootScope, $state, JhiTrackerService, toastr, AlarmResult, AlarmInfoService, ngToast) {
    var vm = this;
    vm.unCheckedCount = 0;
    vm.activities = [];
    vm.alarmNoticeResult = [];
    vm.formatTime = formatTime;
    vm.markAllAsRead = markAllAsRead;


    JhiTrackerService.subscribe();
    JhiTrackerService.connect();
    JhiTrackerService.receive().then(null, null, function (activity) {
      showActivity(activity);
    });
    function showActivity(activity) {


      var existingActivity = false;

      if (!existingActivity && (activity.page !== 'logout')) {
        vm.activities.push(activity);
        //console.log(vm.activities);
        // AlertService.add({'type': 'danger', 'msg': '<pre>'+JSON.stringify(activity.command)+'</pre>', 'id': 1, 'timeout': 0, toast: true});
        loadNewAlarm(activity);
      }

    }
    function loadNewAlarm(activity) {
      //activity =  {"command":"MESSAGE","headers":{"content-length":"305","message-id":"xznricjh-19","subscription":"sub-0","content-type":"application/json;charset=UTF-8","destination":"/topic/tracker"},"body":"{\r\n  \"_type\" : \"type1\",\r\n  \"_id\" : \"AWXw1IukGm1yCqhJkPux\",\r\n  \"_index\" : \"yewu1\",\r\n  \"timestamp\" : \"2018-09-19T08:46:00Z\",\r\n  \"field\" : \"value\",\r\n  \"num_hits\" : \"4\",\r\n  \"num_matches\" : \"1\",\r\n  \"trans\" : \"99999\",\r\n  \"rule_name\" : \"rule2\",\r\n  \"categoryId\" : 4,\r\n  \"eventRuleId\" : 4,\r\n  \"alarmLevelId\" : 3\r\n}"};
      vm.newAlarms = JSON.parse(activity.body);//angular.fromJson(activity.body);//JSON.stringify(activity);

      if (vm.newAlarms && vm.newAlarms.alarmInfo) {
        vm.alarmNoticeResult.push(vm.newAlarms);
        vm.bgColor = null;
        // console.log('新+旧-----',vm.alarmNoticeResult);
        // vm.msg = '<span>告警名称：' + vm.newAlarms.alarmInfo.name +'</span><span>告警业务：'+ vm.newAlarms.categoryName +'</span><span>告警规则：'+ vm.newAlarms.eventRuleName +'</span><span>发生时间：'+ vm.newAlarms.timestamp +'</span><span>告警等级：' + vm.newAlarms.alarmLevelName + '</span>';
        vm.msg = '<h5>' + vm.newAlarms.alarmLevelName + '</h5><span>告警名称：' + vm.newAlarms.alarmInfo.name + '</span><span>告警业务：' + vm.newAlarms.categoryName + '</span><span>告警规则：' + vm.newAlarms.eventRuleName + '</span><span>发生时间：' + vm.newAlarms.timestamp + '</span>';

        // vm.toastrOption = {
        //     allowHtml: true, // 这种写法是允许你插入html元素
        //     timeOut: "60000",
        //     onTap: function(data) {
        //       // 这里是点击事件
        //       $state.go("alarm-result-detail",{id:vm.newAlarms.alarmInfo.id});

        //     }
        //   }
        //  console.log('告警弹窗------',vm.newAlarms);

        if (vm.newAlarms.alarmLevelName != '') {
          if (vm.newAlarms.alarmLevelName == 'ERROR') {
            vm.bgColor = '#e85656';

          } else if (vm.newAlarms.alarmLevelName == 'WARNING') {
            vm.bgColor = '#dfb81c';

          } else if (vm.newAlarms.alarmLevelName == 'INFO') {
            vm.bgColor = '#2dacd1';

          } else if (vm.newAlarms.alarmLevelName == 'DEARLOAD') {
            vm.bgColor = '#8b3333';

          } else {
            return false;
          }
          ngToast.create({
            timeout: '6000000',
            dismissButton: 'true',
            animation: 'fade',
            className: vm.newAlarms.alarmLevelName,
            backgroundColor: vm.bgColor,
            // backgroundColor:vm.newAlarms.alarmInfo.alarmRule.alarmLevel.color,
            content: '<div class="toast-txt">' + vm.msg + '</div>',
            onDismiss: function (data) {
              // 这里是点击事件
              $state.go("alarm-result-detail", { id: vm.newAlarms.alarmInfo.id });

            }
          });
        } else {
          return false;
        }


        // ngToastProvider.configure({
        //   additionalClasses: 'my-animation',
        //   animation: 'slide' // or 'fade'
        // });

        // if(vm.newAlarms.alarmLevelName=='ERROR'){
        //   ngToast.create({
        //     timeout:'600000',
        //     className: 'error',
        //     backgroundColor:'#e85656',
        //     content: '<div class="toast-txt">' + vm.msg + '</div>'
        //   });
        // }else if(vm.newAlarms.alarmLevelName=='WARNING'){
        //   ngToast.create({
        //     timeout:'600000',
        //     className: 'warning',
        //     backgroundColor:'#dfb81c',
        //     content: '<div class="toast-txt">' + vm.msg + '</div>'
        //   });
        // }else if(vm.newAlarms.alarmLevelName=='INFO'){
        //   ngToast.create({
        //     timeout:'600000',
        //     className: 'info',
        //     backgroundColor:'#2dacd1',
        //     content: '<div class="toast-txt">' + vm.msg + '</div>'
        //   });
        // }else if(vm.newAlarms.alarmLevelName=='DEARLOAD'){
        //   ngToast.create({
        //     timeout:'600000',
        //     className: 'dearload',
        //     backgroundColor:'#8b3333',
        //     content: '<div class="toast-txt">' + vm.msg + '</div>'
        //   });
        // }else{
        //   return false;
        // }


        // if(vm.newAlarms.alarmLevelName=='ERROR'){
        //   toastr.error(vm.msg, '', vm.toastrOption);
        // }else if(vm.newAlarms.alarmLevelName=='WARNING'){
        //   toastr.warning(vm.msg, '',vm.toastrOption);
        // }else if(vm.newAlarms.alarmLevelName=='INFO'){
        //   toastr.info(vm.msg, '', vm.toastrOption);
        // }else{
        //   return false;
        // }
        vm.unCheckedCount = vm.unCheckedCount + 1;
      } else {
        console.log('这里有问题', vm.newAlarms);
      }




    }

    function loadAll() {
      //getAlarmLevels();

      getAlarmInfo();
      getAlarmNotification();

    }
    loadAll();
    // function getAlarmLevels(){ 
    //     AlarmInfoService.getAlarmByAlarmLevels().then(function (promise) {
    //       //  console.log('AlarmLevels true', promise);
    //         var _d = angular.copy(promise);  
    //         vm.alarmLevelData = _d.map(function(x) {
    //             return { "name":x['detail'].name, "value":x['alarmInfoReturns'].length, "id": x['detail'].id }; 
    //         }); 
    //        // console.log('AlarmLevels true------', vm.alarmLevelData); 
    //     }, function (promise) { 
    //       //  console.log('AlarmLevels false', promise);
    //        vm.alarmLevelData = [];         
    //     });
    // }

    function markAllAsRead() {
      AlarmResult.markAllAsRead(function (promise) {


        if (promise) {
          vm.unCheckedCount = 0;
          vm.alarmNoticeResult = [];

        }



      });
    }

    function getAlarmInfo() {
      AlarmInfoService.getAlarmCheckedCount().then(function (promise) {

        vm.unCheckedCount = promise.unCheckedCount;

        vm.checkedCount = promise.checkedCount;
        // console.log('vm.unCheckedCount---初始化：',vm.unCheckedCount); 
        vm.apiCount = (vm.unCheckedCount == 0 && vm.unCheckedCount == 0) ? true : false;
      }, function (promise) {
        vm.apiCount = true;

      });
    }

    function getAlarmNotification() {
      AlarmResult.alarmInfosNotification(function (promise) {
        // vm.unCheckedCount = promise.unCheckedCount;
        vm.alarmNoticeResult = [];
        _.forEach(promise, function (value, key) {
          if (vm.unCheckedCount == 0) {
            vm.alarmNoticeResult = [];
          }
          vm.alarmNoticeResult.push(value);

        });

        // console.log('vm.alarmNoticeResult---初始化：',vm.alarmNoticeResult); 
      });
    }

    // 格式化显示时间
    function formatTime(data) {

      return moment(data).startOf('hour').fromNow();
    };


    var unCheckedCount = $rootScope.$on('tssLoginsightUiApp:alarmResultUpdate', function (event, result) {
      if (result) {
        getAlarmInfo();
        getAlarmNotification();
      }
    });

    $rootScope.$on('alarmInfosCheckedSuccess', function (event, data) {
      getAlarmInfo();
      getAlarmNotification();
    })

    $scope.$on('$destroy', unCheckedCount);
  }
})();