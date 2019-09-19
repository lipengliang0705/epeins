(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-result')
        .controller('AlarmResultController', AlarmResultController);

    AlarmResultController.$inject = ['$scope','$rootScope', 'AlarmResult','NgTableParams'];

    function AlarmResultController($scope,$rootScope, AlarmResult, NgTableParams) {

        var vm = this;

        vm.AlarmResult = [];
       
        vm.setChecked = setChecked;
        // table 的参数
        vm.tableParams = new NgTableParams();
        loadAll();

        function loadAll() {
            vm.dataload=true;
            AlarmResult.query(function(result) {
                vm.dataload=false;
                vm.AlarmResult = result;
                // console.log('告警信息列表：',result);
                vm.searchQuery = null;
                vm.tableParams = new NgTableParams(
                   {
                       filter: {},
                       sorting: {},
                       page: 1,//展示第一页
                       count: 10,//每页有15个数据项
                       url: ''
                    },
                    { dataset: result}
                ); 
            });
        }

         // 回车的时候触发ng-submit，跟下面的watch二选一就可以
        function applyGlobalSearch(){
            var term = vm.globalSearchTerm;
            // if (vm.isInvertedSearch){
            //   term = "!" + term;
            // }
          //  console.log(term);
            vm.tableParams.filter({ $: term });
        }

        // 值变更的时候触发
        $scope.$watch("vm.globalSearchTerm", function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.tableParams.filter({});
            } else if(newValue != oldValue){
                vm.tableParams.filter({ $: vm.globalSearchTerm });
            }
        });

        //已读、未读
         function setChecked(alarm, flag) { 
            function onSaveSuccess (result) {
               
                $scope.$emit('tssLoginsightUiApp:alarmResultUpdate', result);
                vm.isSaving = true;
            }

            function onSaveError () {
                vm.isSaving = false;
            }
            alarm.checked = flag;
            AlarmResult.update(alarm,onSaveSuccess,onSaveError);
          
        }
       
        // var unCheckedCount = $rootScope.$on('tssLoginsightUiApp:alarmResultUpdate', function(event, result) {
        //     if(result){
        //        loadAll();
        //      }
         
        // });
        // $scope.$on('$destroy', unCheckedCount);
     

    }
})();
