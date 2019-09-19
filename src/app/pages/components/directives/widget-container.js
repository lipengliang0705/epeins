(function() {

'use strict';

var module = angular.module('mu-widgets', []);


// module.directive('htmlBind', ['$compile', function ($compile) {
//     return {
//         restrict: 'EA',
//         link: function (scope, element, attrs) {
//             scope.$watch(function () {
//                 return scope.$eval(attrs.htmlContent);
//             }, function (value) {
//                 element.html(value && value.toString());
//                 var compileScope = scope;
//                 if (attrs.bindHtmlScope) {
//                     compileScope = scope.$eval(attrs.bindHtmlScope);
//                 }
//                 $compile(element.contents())(compileScope);
//             });
//         }
//     };
// }]);

module.directive('htmlBind', ['$compile', '$window', '$location', '$interval', 'DataUtil', function ($compile, $window, $location, $interval, DataUtil) {
    return {
        restrict: 'EA',
        scope: {
                config: '=',
                data: '='
            },
        link: function (scope, element, attrs) {

            // scope.$watch(function () {
            //     return scope.config;
            // }, function (value, oldValue) {
            //     compileHtml(scope.config, scope.data);
            // }, true);

            var $timer = null;

            scope.$watch(function () {
                return scope.config.datasource;
            }, function (value, oldValue) {

                if (value && (value.type=='rest' || value.type=='rest_post' || value.type=='es')) {
                    var interval = parseInt(value.interval);
                    //var $timer = null;
                    if (interval >= 1) {
                        $timer = $interval(fetchData, interval*1000);
                    } else {
                        $interval.cancel($timer);
                        fetchData();
                    }                    
                } else {
                    compileHtml(scope.config, scope.data);
                }

                function fetchData() {
                    if ((value.host == null || value.host == '') && (value.url == null || value.url == '')) return;
                    if (value.type=='rest') {
                        DataUtil.runRestApi(value, function(res){
                        //console.log(res);
                            scope.data.items = res;
                            scope.data.refresh = Math.random(); //to trigger refresh
                        },function(error){
                          console.log("error");
                        });                         
                    } else if (value.type=='rest_post') {
                        DataUtil.runRestPostApi(value, function(res){
                        //console.log(res);
                            scope.data.items = res;
                            scope.data.refresh = Math.random(); //to trigger refresh
                        },function(error){
                          console.log("error");
                        });
                    } else if (value.type=='es') {
                        DataUtil.runEsApi(value, function(res){
                        //console.log(res);
                            scope.data.items = res;
                            scope.data.refresh = Math.random(); //to trigger refresh
                        },function(error){
                          console.log("error");
                        });
                    }           
                }

            }, true);

            scope.$watch(function () {
                return scope.data;
            }, function (value, oldValue) {
                compileHtml(scope.config, scope.data);
            }, true);

            function compileHtml(config, data) {

                var contents = parseParms(config, data);

                element.html(contents && contents.toString());
                var compileScope = scope;
                if (attrs.bindHtmlScope) {
                    compileScope = scope.$eval(attrs.bindHtmlScope);
                }
                $compile(element.contents())(compileScope);

                var linkElem = element.find('[link]');
                if (linkElem != null && linkElem.length > 0) {
                    //var url = linkElem[0].attributes['link'].value;
                    linkElem.bind('click', function(event) {
                        var url = event.target.attributes['link'].value;
                        $window.open(url, '_blank');
                    });                    
                }
            }

            function parseParms(config, data) {
                var dataParam;
                if (data == null || data.items == null || data.items.length == 0) {
                    dataParam = {};
                } else {
                    dataParam = data.items[0]
                }

                var compiled = _.template(config.htmlContents);
                var params = _.assign(_.get(config,'datasource.params'), dataParam);
                //var params = data.items[0];
                if (angular.isObject(params)) {
                    var compiled = compiled(params);
                    return compiled;
                } else {
                    return config.htmlContents;
                }         
            }


        }
    };
}]);

module.directive('randomBgColor', function () {
  return {
    link: function (scope, element) {
      var r = Math.floor(Math.random() * 60) + 130,
          g = Math.floor(Math.random() * 60) + 130,
          b = Math.floor(Math.random() * 60) + 130;
      var bgColor = 'rgb(' + r + ',' + g + ',' + b + ')'; 
      element.css('background-color', bgColor);
    }
  };
});

module.directive('fullSize', function () {
  return {
    restrict: 'AE',
    template: '<a class="pull-right widget-maximize"><i class="icon-size-fullscreen"></i></a>',
    link: function (scope, elem, attrs) {
        elem.bind('click', function(event) {
            event.preventDefault();
            elem.parents(".widget:first").removeAttr("style").toggleClass("maximized");
            $("i",elem).toggleClass("icon-size-fullscreen").toggleClass("icon-size-actual");
            //$(".widget").trigger("resize");
            elem.parents(".widget:first").trigger("resize");
            return false;
        });
    }
  };
});

module.directive('fullSizeDash', function () {
  return {
    restrict: 'AE',
    template: '<a class="pull-right widget-maximize"><i class="icon-size-fullscreen"></i></a>',
    link: function (scope, elem, attrs) {
        elem.bind('click', function(event) {
            event.preventDefault();
            elem.parents(".ts-widget:first").removeAttr("style").toggleClass("maximized");
            $("i",elem).toggleClass("icon-size-fullscreen").toggleClass("icon-size-actual");
            //$(".ts-widget").trigger("resize");
            elem.parents(".ts-widget:first").trigger("resize");
            return false;
        });
    }
  };
});

module.controller('WidgetContainerCtrl', WidgetContainerCtrl);
module.directive('widgetContainer', WidgetContainer);
module.directive('groupContainer', GroupContainer);
module.directive('gridContainer', GridContainer);

WidgetContainer.$inject = ['$compile', '$window'];
WidgetContainerCtrl.$inject = ['$scope', '$element', '$attrs', '$window'];

function WidgetContainerCtrl($scope, $element, $attrs, $window) {

}


function GroupContainer() {    
    return {
        restrict: 'EA',
        template: '<div><ng-transclude></ng-transclude></div>',
        scope: {
            resize: '='
        },
        transclude: true,
        //replace: true;
        require: {
          gridsterItem: '^?gridsterItem',
          gridster: '^?gridster',
        },

        link: function (scope, elem, attrs, ctrl) {
 
            //resize();

            function resize() {
                var container = elem[0];
                var grid = angular.element(elem).find(".wg-grid")[0];


                if (grid && ctrl.gridsterItem) {  
                    container.style.height = ctrl.gridsterItem.itemHeight -42 + 'px';
                    container.style.width = ctrl.gridsterItem.itemWidth -1 + 'px';     
                    grid.style.height =   ctrl.gridsterItem.itemHeight -42 + 'px';
                    grid.style.width =   ctrl.gridsterItem.itemWidth -2 + 'px';         
                }
            } 

            scope.$watch(function () {
                return ctrl.gridsterItem.itemHeight;
            }, function (value, oldValue) {
                if (value) {
                    resize();
                }
            }, true);

            scope.$watch(function () {
                return ctrl.gridsterItem.itemWidth;
            }, function (value, oldValue) {
                if (value) {
                    resize();
                }
            }, true);

        },
        
    };
}

function GridContainer() {    
    return {
        restrict: 'EA',
        template: '<div class="grid-container"><ng-transclude></ng-transclude></div>',
        scope: {
            resize: '='
        },
        transclude: true,
        //replace: true;
        require: {
          gridsterItem: '^?gridsterItem',
          gridster: '^?gridster',
        },

        link: function (scope, elem, attrs, ctrl) {
 
            //resize();

            function resize() {
                var container = elem[0];
                var gridContainer = elem.find(".grid-container")[0];
                // var subGrid = elem.find(".gridster-grid")[0];
                // var subColomn = subGrid.find(".columns")[0];
                // var subRows = subGrid.find(".rows")[0];
              
                if (ctrl.gridsterItem) {  
                    //container.style.height = ctrl.gridsterItem.itemHeight -42 + 'px';
                    //container.style.width = ctrl.gridsterItem.itemWidth -1 + 'px'; 
                    gridContainer.style.height = ctrl.gridsterItem.itemHeight -40 +0 + 'px';
                    gridContainer.style.width = ctrl.gridsterItem.itemWidth + 0 + 'px';
                    //subColomn.style.h
                }
            } 

            scope.$watch(function () {
                return ctrl.gridsterItem.itemHeight;
            }, function (value, oldValue) {
                if (value) {
                    resize();
                }
            }, true);

            scope.$watch(function () {
                return ctrl.gridsterItem.itemWidth;
            }, function (value, oldValue) {
                if (value) {
                    resize();
                }
            }, true);

        },
        
    };
}

function WidgetContainer($compile, $window) {    
    return {
        restrict: 'A',
        template: '',
        scope: {
            widget: '=widgetContainer',
        },
        controller: 'WidgetContainerCtrl', 
        require: {
          gridster: '^?gridster',
          gridsterItem: '^?gridsterItem',
          wgGrid: '^?wgGrid',
          wgWidget: '^?wgWidget'
        },

        link: function (scope, elem, attrs, ctrl) {

 
            var container = elem[0];
            var parent = container.parentElement

           function compileTemplate() {

                var templateString = makeTemplateString();
                //console.log(templateString);
                elem.html(templateString);
                $compile(elem.contents())(scope);
            };

            function makeTemplateString() {
                
                var widget = scope.widget;
                var widgetTemplate = '';

                //widgetTemplate += '<div>hello</div>';
                widgetTemplate += '<' + widget.category;
                
                angular.forEach(widget.attrs, function(value, key) {
                    if (!angular.isObject(value)) {
                        widgetTemplate += (' ' + key + '="\'' + value + '\'"');
                    } else {
                        widgetTemplate += (' ' + key + '="' + key + '"');
                        scope[key] = value;
                    }
                });  

                widgetTemplate += ' ><div style="font-size:24px; text-align:center; vertical-align:middle;">container</div></' + widget.category + '>';

                return  widgetTemplate;
            };

            //compileTemplate();

            scope.$watch(function () {
                return scope.widget.category;
            }, function (value, oldValue) {
                if (value) {
                    compileTemplate(); 
                    resize(); 
                }
            }, true);

            scope.$watch(function () {
                return scope.widget;
            }, function (widget, oldValue) {
                if (widget) {

                    angular.forEach(widget.attrs, function(value, key) {
                        if (angular.isObject(value)) {
                            scope[key] = value;
                        }
                    }); 
                }
            }, true);
 
            function resize() {
                if (ctrl.gridsterItem) {  
                    container.style.height = ctrl.gridsterItem.itemHeight + 'px';
                    container.style.width = ctrl.gridsterItem.itemWidth + 'px';                 
                } 
                if (ctrl.wgWidget) {
                    container.style.height = Math.floor(parent.clientHeight) + 'px';
                    container.style.width = Math.floor(parent.clientWidth) + 'px';
                }
            } 

            scope.$watch(function () {
                return ctrl.gridsterItem.itemHeight;
            }, function (value, oldValue) {
                if (value) {
                    resize();
                }
            }, true);

            scope.$watch(function () {
                return ctrl.gridsterItem.itemWidth;
            }, function (value, oldValue) {
                if (value) {
                    resize();
                }
            }, true);

            scope.$watch(function () {
                return parent.clientHeight;
            }, function (value, oldValue) {
                if (value) {
                    resize();
                }
            }, true);

            scope.$watch(function () {
                return parent.clientWidth;
            }, function (value, oldValue) {
                if (value) {
                    resize();
                }
            }, true);

        },
        
    };
}

})();