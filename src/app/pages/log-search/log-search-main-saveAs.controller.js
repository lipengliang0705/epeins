(function() {
    'use strict';
    angular
        .module("LoginsightUiApp.page.logSearch")
        .controller("logSearchMainSaveAsCtrl", logSearchMainSaveAsCtrl);

    logSearchMainSaveAsCtrl.$inject = ['$scope', '$filter', 'DataDashboard', 'Principal', 'data', '$uibModalInstance', 'toastr'];

    function logSearchMainSaveAsCtrl($scope, $filter, DataDashboard, Principal, data, $uibModalInstance, toastr) {
        console.log("传过来的数据", data);
        data = data.data;
        var vm = this;

        // app: vm.data.app,
        // config: {
        //     query: vm.data.query,
        //     baseQuery: vm.data.baseQuery
        // },
        // timeParams: {
        //     startTime: vm.dateRange.startDate,
        //     endTime: vm.dateRange.endDate
        // }

        // console.log(data.data.timeParams.startTime);
        // console.log(data.data.timeParams.endTime);

        vm.data = {
            name: '',
            options: {
                app: data.app,
                timeParams: {
                    startDate: data.timeParams.startTime,
                    endDate: data.timeParams.endTime
                },
                config: data.config,
                type: data.type
            },
            type: '',
        }

        vm.method = {
            formatShowTime: formatShowTime,
            cancel: cancel,
            save: save
        }

        function init(){
            // 储存类型
            if(vm.data.options.type == 'KEYWORD'){
                vm.data.type = 'FORM_LUCENE';
            }else{
                vm.data.type = 'sql_spl';
            }
        }

        // vm._ = _;
        // vm.cancel = cancel;
        // vm.save = save;
        // vm.queryParams = data.queryParams;
        // vm.timeParam = data.timeParam;
        // console.log("vm.queryParams111-------", vm.queryParams);
        // vm.filter = (angular.fromJson(data.appInfo) || {});
        // getAccount();


        // 储存类型判断
        // vm.type = getType(data);
        //'FORM_LUCENE'; // sql_spl ，FORM_LUCENE
        // vm.filter.dateRange = {};
        // vm.rmFilter = rmFilter;

        // 时间查询条件
        // convertToFilter();

        // function convertToFilter() {
        //     if (vm.queryParams) {
        //         vm.filter.dateRange.startDate = moment(vm.timeParam.startTime);
        //         vm.filter.dateRange.endDate = moment(vm.timeParam.endTime);
        //     }
        // };


        // 删除filter方法
        // function rmFilter(t, type) {
        //     var _type = type || 'is';
        //     console.log(vm.queryParams.filterFields[_type], 'ppp')
        //     delete vm.queryParams.filterFields[_type][t.name];
        // };

        // function bulidQuery() {
        //     vm.queryParams.startTime = moment(vm.filter.dateRange.startDate);
        //     vm.queryParams.endTime = moment(vm.filter.dateRange.endDate);
        //     console.log(vm.filter, vm.queryParams);
        //     return { appInfo: vm.filter, queryParams: vm.queryParams };
        // };

        // 储存查询语句
        function save() {
            var params = {
                name: vm.data.name || '未命名',
                type: vm.data.type,
                options: JSON.stringify(vm.data.options || {})
            };

            console.log('传入的参数', params);

            if (vm.data.name) {
                DataDashboard.save(params, function() {
                    toastr.success('储存成功','成功提示');
                    $uibModalInstance.close({});
                }, function(_e) {
                    console.error(_e);
                })
            }
        };

        // vm.nameValidateMsgFlag = false;
        // vm.nameValidateMsg = '';
        // vm.nameValidateBlur = function(){
        //     AddonsUserView.getByname.query({name:vm.userView.name}, onSuccess, onError);
        //     function onSuccess(data) {
        //         var idx = _.find(data, {'type':vm.type,'name':vm.userView.name});
        //         if(idx){
        //             vm.nameValidateMsgFlag = true;
        //             vm.nameValidateMsg = ' '+vm.userView.name+'已存在，确定保存则替提已存在的记录';
        //         }else{
        //             vm.nameValidateMsgFlag = false;
        //             vm.nameValidateMsg = '';
        //         }
        //     }
        //     function onError(error) {
        //         toaster.pop("error", "保存发生系错误："+_e);
        //     }
        // };

        // 登陆信息
        // function getAccount() {
        //     Principal.identity().then(function(account) {
        //         vm.account = account;
        //         vm.isAuthenticated = Principal.isAuthenticated;
        //     });
        // };

        // function getDate() {
        //     return $filter('date')(new Date(), "yyyy-MM-ddTHH:mm:ss.sss'Z'");
        // };

        // 获取类型
        // function getType(res) {
        //     if (JSON.stringify(res.data) == "{}") return;
        //     // sql_spl ，FORM_LUCENE
        //     var _type = 'FORM_LUCENE';
        //     // 判断类型
        //     var queryType = res.data.queryParams.queryString;

        //     // sql
        //     if (queryType.indexOf('select') > -1) {
        //         _type = 'sql_spl';
        //     } else if (queryType.indexOf('|') > -1) {
        //         // spl
        //         _type = 'sql_spl';
        //     } else {
        //         _type = 'FORM_LUCENE';
        //     }
        //     return _type;
        // }

        // 格式化显示时间
        function formatShowTime(data) {
            return moment(data).format("YYYY/MM/DD HH:mm:ss");
        };

        // 关闭当前页面
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        };

        init();
    }
})();