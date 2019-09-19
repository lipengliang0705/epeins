(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.trouble-shooter')
        .controller('TroubleShooterController', TroubleShooterController);

    TroubleShooterController.$inject = ['TroubleShooter','$scope', '$http', 'NgTableParams', 'toastr'];

    function TroubleShooterController(TroubleShooter, $scope, $http, NgTableParams, toastr) {    
        var vm = this;
        
        vm.dateRange = {
            "startDate": moment().subtract(1, 'day'),
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
        var today = (moment().format("YYYY-MM-DD"));
        var yesterday = (moment().subtract(1, "days").format("YYYY-MM-DD"));
        // vm.dateStart = yesterday;
        // vm.dateEnd = today;
        vm.checks = {KPI: true, TRAN: true, JDBC: true, DB: true};

        vm.setWidget = setWidget;
        vm.initData = initData;

        var start = moment(yesterday).subtract(5, "minute");

        var all_one = _.fill(Array(288),1);
        var xAxis = [];
        var cpuRatio = [];
        var ramRatio = [];
        var transition = [];
        var jdbcPool = [];
        var dbConn = [];

        var initialParams = {
            count: 5 // initial page size
        };
        var initialSettings = {
            counts: [5,10,15,20],
            dataset: []
        };
        vm.logList = new NgTableParams(initialParams, initialSettings );

        function setWidget(widget) {
            var dlg = dialogs.create('pages/trouble-shooter/trouble-shooter.config.html', 'TroubleShooterConfigCtrl' ,{"widget": widget},{size:'md','backdrop':'static'}, 'vm');
            dlg.result.then(function(editWidget){

            },function(){
                console.log("Cancelled");
            });
        }



        initData();
        getLogSample();

        function initData() { 
          console.log('=============initData');
            xAxis = [];
            cpuRatio = [];
            ramRatio = [];
            transition = [];
            jdbcPool = [];
            dbConn = [];
            for (var i=0; i<12*24; i++) {
                var d = start.add(5, 'minute');
                xAxis.push(d.format("HH:mm"));
                cpuRatio.push({x:d.format("HH:mm"), y:Math.round(Math.random() * 60) + 30});
                ramRatio.push({x:d.format("HH:mm"), y:Math.round(Math.random() * 40) + 40});
                transition.push({x:d.format("HH:mm"), y:Math.round(Math.random() * 1000) + 800});
                jdbcPool.push({x:d.format("HH:mm"), y:Math.round(Math.random() * 60) + 100});
                dbConn.push({x:d.format("HH:mm"), y:Math.round(Math.random() * 40) + 100});
            }
            // _.set(vm.config1,'refresh', Math.random());
            // _.set(vm.config2,'refresh', Math.random());
            // _.set(vm.config3,'refresh', Math.random());
            // _.set(vm.config4,'refresh', Math.random());
            // _.set(vm.config5,'refresh', Math.random());

            vm.config1 = {isConnect: true, scale: false, color: ['#FFA500','#9370DB']};
            vm.data1 = [{name:'CPU使用率', datapoints:cpuRatio},{name:'RAM使用率', datapoints:ramRatio}];
            vm.config2 = {isConnect: true, scale: false, color: ['#87CEFA']};
            vm.data2 = [{name:'访问量', datapoints:transition}];
            vm.config3 = {isConnect: true, scale: false, color: ['#FFA500']};
            vm.data3 = [{name:'JDBC连接池', datapoints:jdbcPool}];
            vm.config4 = {isConnect: true, scale: false, color: ['#9370DB']};
            vm.data4 = [{name:'数据库连接数', datapoints:dbConn}];
            
            return xAxis;
        }

        function getLogSample(){
            $http.get('app/pages/trouble-shooter/log-sample.json').then(function (logs) {
                vm.logList.settings({dataset: logs.data.hits.hits});
                //console.log(logs);
            });
        }

        vm.optionTime = {
            isConnect: true,
            color: ['#008acd'],
            tooltip : {
                //show: false,
                trigger: 'axis',
                axisPointer : { 
                    type : 'line',
                    lineStyle : {
                        color: 'red'
                    }, 
                },
                position : [-10,0],
                formatter: '{b}'
            },
            grid: {
                left: '30',
                right: '40',
                top: '10',
                bottom: '40',
                containLabel: false,
                show: false

            },
            xAxis : [
                {
                    type : 'category',
                    data : xAxis,
                    boundaryGap: false,
                    axisTick: {
                        alignWithLabel: true,
                        inside: true
                    },
                    axisLabel: {
                        inside: true,
                        //margin: -20
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                {
                    type : 'value'
                }
            ],
            dataZoom: [{
                type: 'slider',
                left: '30',
                right: '40',
                top: '42',
                bottom: '10',
                showDataShadow: false,
                //borderColor: 'red',
                //fillerColor: '#e6e6fa',
                //backgroundColor: '#E9F4F9',
                backgroundColor: '#F7F8F8',
                textStyle: {
                    color: 'red'
                },
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    //color: '#333',
                    //shadowBlur: 3,
                    //shadowColor: 'rgba(0, 0, 0, 0.6)',
                    //shadowOffsetX: 2,
                    //shadowOffsetY: 2
                }
            }],
            series : [
                {
                    //name:'CPU使用率',
                    type:'line',
                    data: all_one,
                    lineStyle: {
                        normal: {
                            width: 1,
                            shadowBlur: 0,
                            shadowOffsetY: 0
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'red',
                            opacity: 0.1
                        }
                    }
                }
            ]
        };
        
    }
})();
