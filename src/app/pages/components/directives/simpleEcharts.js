

(function () {
    'use strict';

    angular.module('LoginsightUiApp').directive('simpleEcharts', ['$window', function ($window) {
        return {
            restrict: 'EA',
            template: '<div></div>',
            scope: {
                options: '=options'
            },
            link: buildLinkFunc($window)
        };
    }]);

 function buildLinkFunc($window) {
        return function (scope, ele, attrs) {
            var chart, options;
            var ndWrapper = ele.find('div')[0];
            var parent = ele.parent()[0];  
            
            // ndWrapper.style.width = parent.clientWidth + 'px';
            // ndWrapper.style.height = parent.clientHeight + 'px';
            ndWrapper.style.width = (parent.clientWidth==0 ? 910 : parent.clientWidth) + 'px';
            ndWrapper.style.height = (parent.clientHeight==0 ? 500 : parent.clientHeight) + 'px';
            chart = echarts.init(ndWrapper, 'macarons'); 
            if (scope.options && scope.options.isConnect) {
                chart.group = 'tss-ui-group';
                echarts.connect('tss-ui-group');               
            }

            createChart(scope.options);
            
            function createChart(options) {
                if (!options) return;
                if(options.onclick){
                    chart.on('click', options.onclick);
                }
                chart.setOption(options); 
                // console.log(options, chart);
                // scope.$emit('create', chart)  
            }

            scope.$watch('options', function (newVal, oldVal) {
                if (angular.equals(newVal, oldVal)) return;
                createChart(newVal);
            },true)

            angular.element($window).bind('resize', function(){
               // console.log('parent111----',parent); 
                ndWrapper.style.width = (parent.clientWidth==0 ? 910 : parent.clientWidth) + 'px';
                ndWrapper.style.height = (parent.clientHeight==0 ? 500 : parent.clientHeight) + 'px';
           
                chart.resize();
                //chart.setOption(options); 
            });

            scope.$on('ui-view-width-changed', function(d,data) {  
                ndWrapper.style.width = (parent.clientWidth==0 ? 910 : parent.clientWidth) + 'px';
                ndWrapper.style.height = (parent.clientHeight==0 ? 500 : parent.clientHeight) + 'px';
                chart.resize();
            });
            
        };
    }

})();
