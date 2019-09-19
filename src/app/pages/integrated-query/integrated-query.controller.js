(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.integrated-query')
        .controller('IntegratedQueryController', IntegratedQueryController);

    IntegratedQueryController.$inject = ['IntegratedQuery','$scope', 'NgTableParams', 'toastr'];

    function IntegratedQueryController(IntegratedQuery, $scope, NgTableParams, toastr) {
    
        var vm = this;
       

        vm.dateRange = {
            "startDate": moment().subtract(7, 'day'),
            "endDate":  moment()
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
        }

        
        
    }
})();
