
(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.dashboard-builder')
        .controller('DashboardDetailController', DashboardDetailController);

    DashboardDetailController.$inject = ['$scope', '$timeout', '$filter', '$stateParams', 'toastr', 'NgTableParams', 'DataDashboard', 'EsService', 'DataUtil'];

    function DashboardDetailController ($scope, $timeout, $filter, $stateParams, toastr, NgTableParams, DataDashboard, EsService, DataUtil) {
 
      var vm = this;  

      // console.log('Dashboard  Start...');
      $("#dashboard-space").height($(window).height()-$("#dashboard-space").position().top+50);
      //$("#dashboard-space").width($(window).width()-$("#dashboard-space").position().left);
    
      vm.options = {
        theme: 'dark',//'macarons',
        showGrid: false,
        highlightNextPosition: false,
        editable: false
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
          enabled: false, // enable/disable draggable items
          ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
          ignoreContent: true, // if true drag will start only from elements from `dragHandleClass`
          dragHandleClass: 'panel-heading', // drag event only from this class. If `ignoreContent` is true.
          // Arguments: item, gridsterItem, event
        },
        resizable: {
          delayStart: 0, // milliseconds to delay the start of resize, useful for touch interaction
          enabled: false, // enable/disable resizable items
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

      vm.myWidgets = [];  
        
      load();
      function load(){ 
        if($stateParams.id){
          toastr.info('','读取配置中，请稍后片刻。。。'); 
          DataDashboard.get({id: $stateParams.id}, onSuccess, onError);
        }else{
          toastr.error('','请选择合适的配置名称！'); 
        } 
        function onSuccess(res, headers) {
           // console.log(res);
           vm.dataDashboard = res;
           if(vm.dataDashboard && vm.dataDashboard.options){              
              loadData();  
           }
           
        };
        function onError(error) {
          if(error.status && error.status==404){
            toastr.error('error', "404错误"); 
          }else{
            toastr.error('error', error); 
          }            
        };
      }
       
      function loadData(){  
        vm.myWidgets = [];
        var template = JSON.parse(vm.dataDashboard.options); 
        // console.log(template);
        vm.myWidgets = _.cloneDeep(template.dash);
        // console.log(vm.myWidgets);  
        angular.forEach(vm.myWidgets, function(widget) {
          angular.forEach(widget.charts, function(chart) { 
            var datasource = chart.attrs.config.datasource;
            if(datasource.type=='es'){                
                delete chart.attrs.data.items; 
                fetchEsData(chart);  
            } 
          });                        
        });
      } 

      function fetchEsData(chart) {
        DataUtil.runEsServiceApi(chart.attrs.config.datasource, function(res){
          // console.log('es fetchEsData',res);
          // data = res;
          // setData(data);
        },function(error){
            console.log("error");
        });    

      } 
        

    }
 


})();
