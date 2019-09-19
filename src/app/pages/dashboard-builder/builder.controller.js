

(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.dashboard-builder')
        .controller('BuilderCtrl', BuilderCtrl);

    BuilderCtrl.$inject = ['$scope', '$timeout', '$aside', '$filter', '$window', '$stateParams', '$state', 'toastr', 'NgTableParams', 'OptionsUtil', 'DataUtil', 'WIDGET_PARMS', 'DataDashboard', 'Principal'];


    function BuilderCtrl ($scope, $timeout, $aside, $filter, $window, $stateParams, $state, toastr, NgTableParams, OptionsUtil, DataUtil, WIDGET_PARMS, DataDashboard, Principal) {
      
      var vm = this; 
      // console.log('BuilderCtrl Start...');
      $("#builder-space").height($(window).height()-$("#builder-space").position().top+300); 
      // $("#dashboard-space").height($(window).height()-$("#builder-space").position().top+20);
      //$("#builder-space").width($(window).width()-$("#builder-space").position().left);
      // vm.dashboardSpaceHeight = $(window).height()-$("#builder-space").position().top+200; 

      vm.account = null;

      getAccount();     
      function getAccount() {
          Principal.identity().then(function (account) {
              vm.account = account;
          });
      }

      vm.options = {
        theme: 'macarons',//'dark',//
        showGrid: true,
        highlightNextPosition: false,
        editable: true
      };

      vm.gridOptions = {
        gridType: 'scrollVertical',
        minCols: 24, // minimum amount of columns in the grid
        maxCols: 24, // maximum amount of columns in the grid
        minRows: 18, // minimum amount of rows in the grid
        maxRows: 1000, // maximum amount of rows in the grid
        defaultItemCols: 8, // default width of an item in columns
        defaultItemRows: 8, // default height of an item in rows
        margin: 10,  // margin between grid items
        outerMargin: true,  // if margins will apply to the sides of the container
        draggable: {
          delayStart: 0, // milliseconds to delay the start of resize, useful for touch interaction
          enabled: true, // enable/disable draggable items
          ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
          ignoreContent: true, // if true drag will start only from elements from `dragHandleClass`
          dragHandleClass: 'panel-heading', // drag event only from this class. If `ignoreContent` is true.
          // Arguments: item, gridsterItem, event
        },
        resizable: {
          delayStart: 0, // milliseconds to delay the start of resize, useful for touch interaction
          enabled: true, // enable/disable resizable items
          handles: {
            s: true,
            e: true,
            n: true,
            w: true,
            se: true,
            ne: true,
            sw: true,
            nw: true
          }, // resizable edges of an item
          stop: undefined, // callback when resizing an item stops. Accepts Promise return to cancel/approve resize.
          start: undefined // callback when resizing an item starts.
          // Arguments: item, gridsterItem, event
        },
        swap: true, // allow items to switch position if drop on top of another
        pushItems: false, // push items when resizing and dragging
        disablePushOnDrag: false, // disable push on drag
        disablePushOnResize: false, // disable push on resize
        pushDirections: {north: true, east: true, south: true, west: true}, // control the directions items are pushed
        pushResizeItems: false, // on resize of item will shrink adjacent items
        displayGrid: 'onDrag&Resize', // display background grid of rows and columns
        disableWindowResize: false // disable the window on resize listener. This will stop grid to recalcu
      };


      $scope.$on('ui-view-width-changed', function(d,data) {  
        vm.gridOptions.api.resize();
      });

      vm.resize = function(){
        vm.gridOptionsSub.api.optionsChanged();
        vm.gridOptionsSub.api.resize();
      }

      vm.myWidgets = [];

      vm.curWidget = null;
      vm.curChart = null;
      vm.cloneWidget = cloneWidget;
      vm.addWidget = addWidget;
      vm.removeWidget = removeWidget;
      vm.addChart = addChart;
      vm.removeChart = removeChart;
      vm.addTable = addTable;
      vm.removeTable = removeTable;
      vm.clickWidget = clickWidget;
      vm.clickChart = clickChart;
      vm.toggleEditable = toggleEditable;
      vm.config = config;
      vm.saveAs = saveAs;
      //vm.clone = clone;

      vm.dataDashboard = null;
      vm.dataDashboardId = null;
      vm.dataDashboardName = "";


      $scope.$on('theme-changed', function(d,data) {  
        vm.options.theme = data;
      });
 
      vm.dashboardReadLoad = dashboardReadLoad;
      vm.newbtn = true;
      vm.historySpace = true;
      vm.toolbarSpace = false;
      vm.configBtn = false;
      vm.newDashboardName = '';

      getDashboard();
      function getDashboard(){
        if($stateParams.id){
          toastr.info('','读取配置中，请稍后片刻。。。'); 
          DataDashboard.get({id: $stateParams.id}, onSuccess, onError);
        } 
        function onSuccess (result) {   
          vm.dashboard = result;            
          dashboardReadLoad(result);
        }
        function onError (error) {              
          toastr.error('error','加载失败：'+error);
        }  
      }

      function dashboardReadLoad(dashboard){ 
        vm.myWidgets = [];
        if (dashboard != null && dashboard.options != null) {    
          var myWidgets = JSON.parse(dashboard.options).dash;  
          switchDash([]);

          //switchDash(myWidgets);
          setTimeout(function(){
            switchDash(myWidgets);
          }, 30);

          function switchDash(widgets) {
            vm.myWidgets = _.cloneDeep(widgets);
            vm.dataDashboard = dashboard;
            vm.dataDashboardId = dashboard.id;
            vm.newDashboardName = dashboard.name; 
            vm.dataDashboardName = dashboard.name;      

            vm.newbtn = false;  
            vm.configBtn = true;   
            vm.showList = true;           
          } 
        } else {
          toastr.error('','请选择合适的配置名称！');
        }
      }

      vm.openToolbar = openToolbar;
      function openToolbar(dashboard){  
        vm.configBtn = false
        vm.newbtn = false;;
        vm.historySpace = false;
        vm.toolbarSpace = true;
        vm.showList = false;  

        // if (dashboard != null && dashboard.options != null) { 
        //   toastr.info('','读取配置中，请稍后片刻。。。'); 
        //   var myWidgets = JSON.parse(dashboard.options).dash;  
        //   switchDash([]);

        //   setTimeout(function(){
        //     switchDash(myWidgets);
        //   }, 30);

        //   function switchDash(widgets) {
        //     vm.myWidgets = _.cloneDeep(widgets);
        //     vm.dataDashboard = dashboard;
        //     vm.dataDashboardId = dashboard.id;  
        //     vm.newDashboardName = dashboard.name; 
        //     vm.dataDashboardName = dashboard.name; 

        //     vm.newbtn = false;
        //     vm.historySpace = false;
        //     vm.toolbarSpace = true;           
        //   }               
        //   // vm.myWidgets = JSON.parse(dashboard.options).dash;                
        //   // vm.dataDashboard = dashboard;
        //   // vm.dataDashboardId = dashboard.id;  
        //   // vm.newDashboardName = dashboard.name;
        //   // vm.newbtn = false;
        //   // vm.historySpace = false;
        //   // vm.toolbarSpace = true;
        // } else {
        //   toastr.error('','请选择合适的配置名称！');
        // }

      }

      vm.save = save;
      function save(){
        if (!vm.newDashboardName) { 
          toastr.warning('','请输入合适的配置名称！');
        }else{  
          vm.options.editable = true; toggleEditable();          
          toastr.info('','正在保存中，请稍等。。。'); 
          html2Image();  
        } 
      }

      function saveDB(){
        // if (vm.newDashboardName != null && vm.newDashboardName != '') { 
            var dataDashboard = {};
            var options = { name: vm.newDashboardName, dash: _.cloneDeep(vm.myWidgets) };
            if(vm.dataDashboardId && vm.dataDashboard){ //编辑
                dataDashboard =  _.cloneDeep(vm.dataDashboard);
                dataDashboard.name = vm.newDashboardName;
                dataDashboard.options = JSON.stringify(options);
                dataDashboard.description = vm.canvasImg;
                // dataDashboard.modifiedTime = $filter('date')(new Date(), "yyyy-MM-ddTHH:mm:ss.sss'Z'");
                // dataDashboard.modifiedBy = vm.account.login;  
                DataDashboard.update(dataDashboard, onSaveSuccess, onSaveError);
            }else{ //新增              
                dataDashboard.name = vm.newDashboardName;
                dataDashboard.options = JSON.stringify(options);
                dataDashboard.type = "big_screen";//{"name":"大屏", "value":"big_screen"}
                dataDashboard.description = vm.canvasImg;
                // dataDashboard.createdTime = $filter('date')(new Date(), "yyyy-MM-ddTHH:mm:ss.sss'Z'");
                // dataDashboard.createdBy = vm.account.login;  
                DataDashboard.save(dataDashboard, onSaveSuccess, onSaveError);
            }             
            function onSaveSuccess (result) {  
              console.log(result);
              vm.options.editable = false; toggleEditable(); 
              if(result && result.id){
                vm.dataDashboard = result;
                vm.dataDashboardId = result.id;
                vm.newDashboardName = result.name; 
                vm.dataDashboardName = result.name;     
              }           
              toastr.success('','成功另存了当前配置'); 
            }
            function onSaveError () {              
              toastr.error('','保存失败');
            }  
          // } else {
          //   toastr.warning('','请输入合适的配置名称！');
          // } 
      }


      vm.canvasImg = null;
      function html2Image(id) {
        id = id || 'builer-space-div';
        html2canvas(document.getElementById(id), {
          allowTaint: true, //允许污染
          taintTest: true, //在渲染前测试图片(没整明白有啥用)
          useCORS: true, //使用跨域(当allowTaint为true时这段代码没什么用,下面解释)
          background: "#fff",
          onrendered: function (canvas) {
            // 修改生成的宽度
            canvas.style.width = "100px";
            // console.log(canvas, "生成的画布文件");
            vm.canvasImg = canvas.toDataURL("image/png");
            // console.log(vm.canvasImg);
            saveDB();
            // imgBlob = canvas.toDataURL('image/jpeg', 1.0); //将图片转为base64
            // imgBlob = imgBlob.toString().substring(imgBlob.indexOf(",") + 1);//截取base64以便上传
          }
        });
        // html2canvas(document.getElementById(id)).then(function(canvas) {
        //     // 修改生成的宽度
        //     canvas.style.width = "100px";
        //     console.log(canvas, "生成的画布文件");
        //     vm.canvasImg = canvas.toDataURL("image/png");
        // });
        // html2canvas(document.getElementById(id)).then(function (canvas) {
        //     console.log(canvas);
        //     var dataUrl = canvas.toDataURL();
        //     document.getElementById("html2Image").src = dataUrl;
        // });
    }
      

      function cloneWidget() {
          var widget = _.cloneDeep(vm.curWidget);
          delete widget.x;
          delete widget.y;
          if (vm.myWidgets == null) vm.myWidgets = [];
          vm.myWidgets.push(widget);
          //console.log(vm.myWidgets);
      }

      function addWidget() {
        // var chart = {
        //   category: 'mu-echarts',
        //   attrs: {config:{theme: vm.options.theme}, data:{}}
        // };
        var widget = {charts:[]};//{charts:[chart]};
        if (vm.myWidgets == null) vm.myWidgets = [];
        vm.myWidgets.push(widget);
        vm.curWidget = widget;
        vm.historySpace = false;
        vm.newbtn = false; 
        vm.toolbarSpace = true; 
      }

      function addChart() {
        if (vm.myWidgets == null) {
          addWidget();
          return;
        }
        var chart = {
          category: 'mu-echarts',
          attrs: {config:{theme: vm.options.theme}, data:{}}
        };
        vm.curWidget.charts.push(chart);
        vm.curChart = chart;
      }

      function addTable() {
        if (vm.myWidgets == null) {
          addWidget();
          return;
        } 
        var table = {
          category: 'ng-table-factory',
          attrs: {config:{theme: vm.options.theme, backgroundColor: '#222'}, data:{}}
        }; 
        vm.curWidget.charts.push(table);
        vm.curChart = table;
      }

      
      function removeWidget() {
        var idx = vm.myWidgets.indexOf(vm.curWidget);
        if (idx > -1) {
          vm.myWidgets.splice(idx, 1);
        }
      }
     
      function removeChart() {
        var idx = vm.curWidget.charts.indexOf(vm.curChart);
        if (idx > -1) {
          vm.curWidget.charts.splice(idx, 1);
          vm.curChart = null;
        }
      }

      function removeTable() {
        var idx = vm.curWidget.charts.indexOf(vm.curChart);
        if (idx > -1) {
          vm.curWidget.charts.splice(idx, 1);
          vm.curChart = null;
        }
      }

      function clickChart(widget, chart) {
        console.log('clickChart', widget, chart);
        vm.curChart = chart;
        vm.curWidget = widget;
      }

      function clickWidget(widget) {
        vm.curWidget = widget;
      }
       
      function saveAs(backdrop) { 
        vm.asideState = {
          open: true,
          //position: position
        };

        function postClose() {
          vm.asideState.open = false;
        }

        $aside.open({
          templateUrl: 'app/pages/dashboard-builder/saveAs.html',
          placement: 'right',
          size: 'sm',
          backdrop: backdrop,
          //controller: function($http, $rootScope, $scope, $uibModalInstance, toastr, NgTableParams) {
          controller: ['$http', '$rootScope', '$scope', 'toastr', '$filter', 'DataDashboard',
           function($http, $rootScope, $scope, toastr, $filter, DataDashboard) {

            if(!vm.account) return;
            loadTemplates();
            function loadTemplates(){//获取所有已保存配置模板
                DataDashboard.query({ page: 0, size: 1000 }, onSuccess, onError);
                function onSuccess(res, headers) {
                    vm.dataDashboards = _.filter(res, function(item){
                      return (item.type == 'big_screen' && item.createdBy == vm.account.login);
                    });
                    // console.log(vm.dataDashboards);
                    $scope.dataDashboards = vm.dataDashboards;//_.map(vm.templates, 'name');
                    $scope.dataDashboard = vm.dataDashboard;
                    $scope.dataDashboardId = vm.dataDashboardId;
                    $scope.dashboardName = vm.dataDashboardName; 
                    // console.log($scope.dataDashboard);
                    // $scope.configs = _.map(vm.templates, 'name');
                    // $scope.curConfig = vm.curConfig; 
                };
                function onError(error) {
                    toastr.error('error', error); 
                };
            } 

            $scope.saveAs = function(e) { 
 
              if ($scope.newDataDashboard != null && $scope.newDataDashboard != '') { 
                var dataDashboard = {};
                var options = { name: $scope.newDataDashboard, dash: _.cloneDeep(vm.myWidgets) };
                dataDashboard.name = $scope.newDataDashboard;
                dataDashboard.options = JSON.stringify(options);
                dataDashboard.type = "big_screen";//{"name":"大屏", "value":"big_screen"}
                dataDashboard.createdTime = $filter('date')(new Date(), "yyyy-MM-ddTHH:mm:ss.sss'Z'");
                dataDashboard.createdBy = vm.account.login; //'admin';
                // console.log(dataDashboard);
                DataDashboard.save(dataDashboard, onSaveSuccess, onSaveError);
                function onSaveSuccess (result) {              
                  toastr.success('','成功另存了当前配置');
                }
                function onSaveError () {              
                  toastr.error('','保存失败');
                } 
                //$uibModalInstance.close();
                e.stopPropagation();
              } else {
                toastr.error('','请输入合适的配置名称！');
              }

            };

            $scope.saveDb = function(e){ 
              // db.get('dashs').find({name: vm.curConfig}).set('dash', _.cloneDeep(vm.myWidgets)).write();
              // db.get('dashs').find({name: vm.curConfig}).set('backgroundColor', vm.backgroundColor).write();
              // db.get('dashs').find({name: vm.curConfig}).set('titleBgColor', vm.titleBgColor).write();
              
              if($scope.dataDashboard){ 
                var dataDashboard = _.cloneDeep($scope.dataDashboard);                 
                var options = {name: dataDashboard.name, dash: _.cloneDeep(vm.myWidgets)};
                dataDashboard.options = JSON.stringify(options); 
                dataDashboard.modifiedTime = $filter('date')(new Date(), "yyyy-MM-ddTHH:mm:ss.sss'Z'");
                dataDashboard.modifiedBy = vm.account.login; //'admin';
                console.log(dataDashboard);
                DataDashboard.update(dataDashboard, onSaveSuccess, onSaveError);
                function onSaveSuccess (result) {              
                  toastr.success('','成功保存了当前配置');
                }
                function onSaveError () {              
                  toastr.error('','保存失败');
                }
              }else{
                toastr.warning('','当前状态无法执行保存操作');
              }          
              //toastr.pop('success','','成功保存了当前配置');
              //$uibModalInstance.close();
              e.stopPropagation();
            };

            $scope.clone = function(e) {
              console.log('clone');
              $http.get('app/pages/dashboard-builder/demo.json').success(function (data) {
                console.log(data);
                vm.myWidgets = null;
                vm.myWidgets = data.dashs[0].dash;
                //vm.backgroundColor = data.dashs[0].backgroundColor;
                toastr.success('','成功克隆了例子配置');
                console.log(data,vm.myWidgets,'成功克隆了例子配置');
              });
            }

            $scope.load = function(e) {
              // vm.gridOptions = _.cloneDeep(vm._gridOptions);
              // console.log(vm.gridOptions);
              // vm.myWidgets = []; vm.curWidget = null;vm.curChart = null; 
              vm.myWidgets = [];
              // console.log(vm.myWidgets,vm.curWidget,vm.curChart);
              // vm.myWidgets.indexOf(vm.curWidget);
              if ($scope.dataDashboardId != null && $scope.dataDashboardId != '') {
                
                $scope.dataDashboard = _.find($scope.dataDashboards, {id: $scope.dataDashboardId});
                vm.myWidgets = JSON.parse($scope.dataDashboard.options).dash;   
                // vm.myWidgets = _.cloneDeep(myWidgets);
                console.log('myWidgets', vm.myWidgets);             
                vm.dataDashboard = $scope.dataDashboard;
                vm.dataDashboardId = $scope.dataDashboardId;
                vm.dataDashboardName = $scope.dashboardName;  
                toastr.success('','成功读取了选定配置');
                //$uibModalInstance.close();
                //window.location.reload();
                e.stopPropagation();
              } else {
                toastr.error('','请选择合适的配置名称！');
              }

              // if ($scope.curConfig != null && $scope.curConfig != '') {
              //   var myWidgets = _.find(dashs, {name: $scope.curConfig}).dash;
              //   console.log('aaa',myWidgets);
              //   vm.myWidgets = _.cloneDeep(myWidgets);
              //   vm.backgroundColor = _.find(dashs, {name: $scope.curConfig}).backgroundColor;
              //   vm.titleBgColor = _.find(dashs, {name: $scope.curConfig}).titleBgColor;
              //   vm.curConfig = $scope.curConfig;

              //   //var d2 = dashs.get('dashs')
              //   toastr.pop('success','','成功读取了选定配置');

              //   //$uibModalInstance.close();
              //   //window.location.reload();
              //   e.stopPropagation();
              // } else {
              //   toastr.pop('error','','请选择合适的配置名称！');
              // }
            };

            $scope.share = function(e){
              if ($scope.dataDashboardId != null && $scope.dataDashboardId != '') { 
                var openurlnw = $state.href("dashboard-list", {'id': $scope.dataDashboardId });
                $window.open(openurlnw, '_blank');
                e.stopPropagation();
              } else {
                toastr.error('','请选择合适的配置名称！');
              }
            }

          }]
        });

      }

      function config(backdrop) {   
         
        vm.asideState = {
          open: true,
          //position: position
        };

        function postClose() {
          vm.asideState.open = false;
        }
        

        var direction = (vm.curWidget.x + (vm.curWidget.cols || 8) / 2) > vm.gridOptions.maxCols / 2 ? 'left' : 'right' ;
        //var direction = 'right';
        WIDGET_PARMS.backgroundColor = vm.backgroundColor;
        WIDGET_PARMS.titleBgColor = vm.titleBgColor;
        WIDGET_PARMS.widget = vm.curChart;
        WIDGET_PARMS.group = vm.curWidget;
        WIDGET_PARMS.theme = vm.options.theme;
 
        $aside.open({
          templateUrl: 'app/pages/dashboard-builder/config.html',
          placement: direction,
          size: 'md',
          backdrop: backdrop,
          controller: 'WidgetConfigCtrl'

        }).result.then(postClose, postClose);
      }

      function toggleEditable() {
        vm.options.editable = !vm.options.editable; 
        vm.options.showGrid = vm.options.editable;
        vm.gridOptions.resizable.enabled = vm.options.editable;
        vm.gridOptions.draggable.enabled = vm.options.editable;
        vm.gridOptions.api.optionsChanged();
      }
     
      vm.returnBtn = function(){
        vm.historySpace = true;
        vm.toolbarSpace = false;
        vm.configBtn = true;
      }

      vm.deleteDashboardBtn = function(dashboard){
        toastr.success('', "您确认要删除此" + rowTitle + "吗？");
         // var dlg = dialogs.confirm("删除确认", "您确认要删除此" + rowTitle + "吗？", { 'size': 'sm', 'backdrop': 'static' });
         //        dlg.result.then(function (btn) {
         //            if (row.id !== null) {
         //                rowService.delete(row, onSaveSuccess, onSaveError);
         //            }
         //        })

         //        function onSaveSuccess(result) {
         //            vm.listAll();
         //            toastr.pop("success", '', "该" + rowTitle + "已经被删除！");
         //        }

         //        function onSaveError() {
         //            toastr.pop("error", "删除" + rowTitle + "时发生系统错误，请联系系统管理员核查！")
         //        }
      }

    }


})();
