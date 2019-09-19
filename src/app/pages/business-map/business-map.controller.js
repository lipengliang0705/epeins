(function () {
    'use strict';
    /**
     * 门户首页路由
     * Author：Veiss Date：2019/8/19
     */
    var app = angular.module('LoginsightUiApp.page.business-map');
    app.controller('BusinessMapController', BusinessMapController);

    BusinessMapController.$inject = ['$scope', 'HomeService', 'NgTableParams', '$state', 'toastr', '$rootScope', '$uibModal', '$q'];

    function BusinessMapController($scope, HomeService, NgTableParams, $state, toastr, $rootScope, $uibModal, $q) {
        var vm = this;
        vm.data = {
            tableParams:'',
            selectedIndex: -1,   // 选中的索引
            timeRange:["今天","昨天","最近7天","最近30天"],
        }
        vm.method = {
          selectedMenu: selectedMenu,
      }

        vm.isShow = true;
        function showorhide () {
            vm.isShow = !vm.isShow;
        }
        vm.resources = {
            list: [
              {
                id: 1,
                name: '河南中牟农村商业银行股份有限公司',
                alias: '中牟农商雁月湾分理处',
                institutionCode: '1600100',
                type: 4,
                adress: '中牟县雁鸣湖镇雁鸣大道与环乡路交叉口',
                tradCapacity: '14',
                abnormal: '0',
                tradTrend: '',
                author: 'Admin'
              },{
                id: 2,
                name: '河南中牟农村商业银行股份有限公司',
                alias: '中牟农商雁月湾分理处',
                institutionCode: '1600100',
                type: 4,
                adress: '中牟县雁鸣湖镇雁鸣大道与环乡路交叉口',
                tradCapacity: '14',
                abnormal: '0',
                tradTrend: '',
                author: 'Admin'
              },{
                id: 3,
                name: '河南中牟农村商业银行股份有限公司',
                alias: '中牟农商雁月湾分理处',
                institutionCode: '1600100',
                type: 4,
                adress: '中牟县雁鸣湖镇雁鸣大道与环乡路交叉口',
                tradCapacity: '14',
                abnormal: '0',
                tradTrend: '',
                author: 'Admin'
              },{
                id: 4,
                name: '河南中牟农村商业银行股份有限公司',
                alias: '中牟农商雁月湾分理处',
                institutionCode: '1600100',
                type: 4,
                adress: '中牟县雁鸣湖镇雁鸣大道与环乡路交叉口',
                tradCapacity: '14',
                abnormal: '0',
                tradTrend: '',
                author: 'Admin'
              },{
                id: 5,
                name: '河南中牟农村商业银行股份有限公司',
                alias: '中牟农商雁月湾分理处',
                institutionCode: '1600100',
                type: 4,
                adress: '中牟县雁鸣湖镇雁鸣大道与环乡路交叉口',
                tradCapacity: '14',
                abnormal: '0',
                tradTrend: '',
                author: 'Admin'
              },{
                id: 6,
                name: '河南中牟农村商业银行股份有限公司',
                alias: '中牟农商雁月湾分理处',
                institutionCode: '1600100',
                type: 4,
                adress: '中牟县雁鸣湖镇雁鸣大道与环乡路交叉口',
                tradCapacity: '14',
                abnormal: '0',
                tradTrend: '',
                author: 'Admin'
              } 
            ]
        };
        function init() {
            getList();
        }
        // table 的参数
        vm.data.tableParams = new NgTableParams();
        //加载列表
        function getList() {
            vm.defaultValue = vm.resources.list;
            console.log(9999988888,vm.defaultValue);
            vm.dataload = false;
            vm.searchQuery = null;
            vm.data.tableParams = new NgTableParams(
                {
                    filter: {},
                    sorting: {},
                    page: 1,//展示第一页
                    count: 10,//每页有15个数据项
                    url: ''
                },
                {dataset: vm.defaultValue}
            );
        }
        /**
         * 切换选中的列表
         * @param {*} index 
         */
        function selectedMenu(index){
            vm.data.selectedIndex = index;
        }
        // function bMap() {
        //     // 百度地图API功能
        //     var map = new BMap.Map("allmap");
        //     var point = new BMap.Point(113.75938, 34.771713);

        //     var opts = {
        //         width: 250,     // 信息窗口宽度
        //         height: 80,     // 信息窗口高度
        //         title: "中牟农商雁月湾分理处", // 信息窗口标题
        //         enableMessage: true //设置允许信息窗发送短息
        //     };
        //     map.centerAndZoom(point, 15);

        //     map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        //     map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用


        //     // 编写自定义函数,创建标注
        //     function addMarker(point) {
        //         var marker = new BMap.Marker(point);
        //         // var content = '地址：河南省焦作市塔南路1736号嘉隆国际中心<hr>电话：(010)64861646';
        //         var content = "<div>"//自定义的展示内容
		// 		+ "<span style='color:#000; display: block'>地址：中牟县雁鸣湖镇雁鸣大道与环乡路交叉口</span>"
		// 		+ "<span style='color:#000; display: block; margin-top: 5px;'>位置：电话：(010)64861646</span>"
		// 		+ "</div>";
        //         map.addOverlay(marker);
        //         addClickHandler(content, marker);
        //     }

        //     function openInfo(content, e) {
        //         var p = e.target;
        //         var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        //         var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象 
        //         map.openInfoWindow(infoWindow, point); //开启信息窗口
        //     }

        //     function addClickHandler(content, marker) {
        //         marker.addEventListener("click", function (e) {
        //             openInfo(content, e)
        //         });
        //     }

        //     // 随机向地图添加25个标注
        //     var bounds = map.getBounds();
        //     var sw = bounds.getSouthWest();
        //     var ne = bounds.getNorthEast();
        //     var lngSpan = Math.abs(sw.lng - ne.lng);
        //     var latSpan = Math.abs(ne.lat - sw.lat);
        //     for (var i = 0; i < 25; i++) {
        //         var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
        //         addMarker(point);
        //     }
        // }

        init();
    }
})();