

(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.dashboard-builder')
        .controller('DashboardsController', DashboardsController);

    DashboardsController.$inject = ['$scope', '$state', 'toastr', 'DataDashboard'];


    function DashboardsController ($scope, $state, toastr, DataDashboard) {
      
      var vm = this;  
      vm.loadimg = true;
      loadTemplates();
      function loadTemplates(){//获取所有已保存配置模板          
          toastr.info('','读取配置中，请稍后片刻。。。'); 
          DataDashboard.getDataDashboardByType({'type':'big_screen'}, onSuccess, onError);
          function onSuccess(res, headers) {
            console.log(res);
            vm.dataDashWidgets = {};
            vm.dashboards = res; 
            vm.loadimg = false;
          };
          function onError(error) {
            toastr.error('error', error); 
            vm.loadimg = false;
          };
      }
 

    }


})();
