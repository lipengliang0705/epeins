(function () {
    'use strict';
    /**
     * @ 首页
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.file-place');

    // 元素可拖动
    app.directive('myDraggable', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (attr["modal"] !== undefined) {
                    scope.$watch(attr["modal"], function (newValue) {
                        if (newValue) {
                            setTimeout(function () {
                                $(".modal").draggable({ handle: ".modal-header" });
                            }, 100);
                        } else {
                            $(".modal").attr("style", "");
                        }
                    }, true);
                    $(window).resize(function () {
                        $(".modal").attr("style", "");
                    });
                } else {
                    element.draggable($parse(attr["hrDraggable"])(scope));
                }
            }
        }
    }])

    app.directive('myResizable', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (attr["modal"] !== undefined) {
                    scope.$watch(attr["modal"], function (newValue) {
                        if (newValue) {
                            setTimeout(function () {
                                $(".modal").resizable({ handles: "e, w" });
                            }, 100);
                        }
                    }, true);
                } else {
                    element.resizable($parse(attr["hrResizable"])(scope));
                }
            }
        }
    }])


        ;


})();