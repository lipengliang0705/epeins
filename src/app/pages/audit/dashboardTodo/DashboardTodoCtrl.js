/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('LoginsightUiApp.page.audit')
        .controller('DashboardTodoCtrl', DashboardTodoCtrl);

    /** @ngInject */
    function DashboardTodoCtrl($scope, baConfig) {
        $scope.dateRangeOptions = {
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
        $scope.dateRange = {
            "startDate": moment().subtract(1, 'day'), //moment().subtract(15, 'minute'),
            "endDate": moment()
        };
        $scope.selected = 0;
        $scope.transparent = baConfig.theme.blur;
        var dashboardColors = baConfig.colors.dashboard;
        var colors = [];
        for (var key in dashboardColors) {
            colors.push(dashboardColors[key]);
        }

        function getRandomColor() {
            var i = Math.floor(Math.random() * (colors.length - 1));
            return colors[i];
        }

        $scope.todoList = [
            {text: '1天前'},
            {text: '2天前'},
            {text: '3天前'},
            {text: '4天前'},
            {text: '5天前'},
            {text: '6天前'},
            {text: '7天前'},
            {text: '8天前'},
            {text: '9天前'},
            {text: '10天前'},
        ];
        $scope.todoList=[];
        for(var i=0;i<10;i++){
            var obj={
                text:formatShowTime(moment().subtract(i+1, 'day'))
            }
            $scope.todoList.push(obj);
        }

        $scope.todoList.forEach(function (item) {
            item.color = getRandomColor();
        });

        $scope.newTodoText = '';

        $scope.addToDoItem = function (event, clickPlus) {
            if (clickPlus || event.which === 13) {
                $scope.todoList.unshift({
                    text: $scope.newTodoText,
                    color: getRandomColor(),
                });
                $scope.newTodoText = '';
            }
        };

        $scope.handleChangeDate = function () {
            console.log(dateRange);
        }

        $scope.handleSelectItem = function (index) {
            $scope.selected = index;
            var _num = index + 1;
            $scope.dateRange = {
                startDate: moment().subtract(_num, 'day'),
                endDate: moment()
            };

            $scope.$broadcast('dateRange-change',$scope.dateRange);
        }

        function formatShowTime(data) {
            return moment(data).format("YYYY/MM/DD HH:mm");
        };
    }
})();