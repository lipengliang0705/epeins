(function () {
    'use strict';


    // var directives = angular.module('mu-directives');
    // directives.directive('muTable', muTable);
    // directives.controller('TableCtrl', TableCtrl);

    angular.module('mu-directives').directive('muTable', muTable).controller('TableCtrl', TableCtrl);

    muTable.$inject = ['$window'];
    TableCtrl.$inject = ['$scope', '$element', '$attrs', '$window'];

    // mu-echarts directive
    function muTable($window) {
        return {
            restrict: 'EA',
            //template: '<div></div>',
            template:
                '<table class="table" style="height:100%; width:100%">' +
                  ' <tr ng-repeat="row in tableData">' +
                  ' <td ng-repeat="col in cols" noWrap="noWrap" >{{row[col.field]}}</td>' +
                  '</tr></table>' ,
            scope: {
                //theme: '=',
                //type: '=',
                config: '=',
                options: '=',
                data: '='
            },
            controller: 'TableCtrl',
            link: buildLinkFunc($window)
        };
    }

    function TableCtrl($scope, $element, $attrs, $window) {

    }


    function buildLinkFunc($window) {
        return function (scope, ele, attrs) {

            var table = ele.find("table");
            table.tablecloth({
              theme: "dark",
              striped: true,
              sortable: false,
              condensed: false,
              bordered: false,
            });

            scope.$watch(function () {
                return scope.config;
            }, function (value, oldValue) {

                //console.log(value);
                var xField = _.get(scope.config, 'fieldMap.x');
                var yFields = _.get(scope.config, 'fieldMap.y');
                var cols = [];
                if (xField != null) {
                    cols.push({field: xField.field, name: xField.name});
                }
                _.forEach(yFields, function(y){
                    cols.push({field: y.field, name: y.name});
                })
                scope.cols = cols;

            }, true);

            scope.$watch(function () {
                return scope.data;
            }, function (value, oldValue) {

                scope.tableData = value.items;

            }, true);

            scope.$on('theme-changed', function(d,data) {

            });

        };
    }

})();
