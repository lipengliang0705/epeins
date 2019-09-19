(function () {
    "use strict"
    angular
        .module('LoginsightUiApp.page.spl-sql-search')
        .factory("EsService", EsService);

    EsService.$inject = ['$q', '$http', '$resource'];

    function EsService($q, $http, $resource) {
        // var ELASTICSEARCHHOST = 'http://es5n.stage.dev.pi:9200';
        var logSearchForSplUrl = '/api/spl-2-sql/spl-to-sql';
        // var ds = null;
        // 通过业务id获取typelist
        var eventRuleTypeUrl = 'api/event-rules-json-filter/:category_id';
        // 日志查询接口,关键字查询
        var logSearchInfoUrl = '/api/search/es-info-search';
        // 上下文接口
        var logUpDownContextUrl = '/api/search/up-down-context';

        // var logSearchForSqlUrl = [ELASTICSEARCHHOST, "_sql"].join("/");
        // sql 查询接口
        var logSearchForSqlUrl = '/api/sql/http-sql';
        // var logSearchForSqlUrl = '/api/sql/http-sql-get';


        var getTypeList = $resource(eventRuleTypeUrl, {}, {
            get: { method: 'GET', isArray: true }
        })
        var getLogInfo = $resource(logSearchInfoUrl, {}, {
            post: {
                method: 'POST',
            }
        })
        var getUpDownContext = $resource(logUpDownContextUrl, {}, {
            post: {
                method: 'POST'
            }
        })

        // 视图接口
        // 事件计数
        var getEventCount = $resource('/api/statistic/event-count', {}, {
            post: {
                method: 'POST'
            }
        });
        //字段值统计
        var getFieldStatistics = $resource('/api/statistic/field-statistic', {}, {
            post: {
                method: 'POST'
            }
        });
        // 累计百分比
        var getTotalPercent = $resource('/api/statistic/total-percent', {}, {
            post: {
                method: 'POST'
            }
        });
        //字段值分类
        var getFieldType = $resource('/api/statistic/field-type', {}, {
            post: {
                method: 'POST'
            }
        });

        //数值分段统计
        var getSegmentStatistic = $resource('/api/statistic/number-segment-statistic', {}, {
            post: {
                method: 'POST'
            }
        });

        //时间分段统计
        var getTimeSegmentStatistic = $resource('/api/statistic/time-segment-statistic', {}, {
            post: {
                method: 'POST'
            }
        });
        // SQL
        var logSearchForSql = function () {
            return $resource(logSearchForSqlUrl, {}, {
                post: {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }
            })
        };
        var logSearchForSpl = function () {
            return $resource(logSearchForSplUrl, {}, {
                post: {
                    method: 'post',
                    isArray: false
                }
            })
        };

        // 查询es所有index
        var getAllIndex = $resource('api/search/get-all-index', {}, {
            get: {
                method: 'get',
                isArray: false
            }
        })

        // 根据业务名称获取业务下面的所有index
        var getIndexByName = $resource('api/search/get-index-by-name', {}, {
            post: {
                method: 'POST',
                isArray: false
            }
        })

        // 根据解析规则获取业务下面的所有index
        var getIndexByCategory = $resource('api/search/get-index-by-category', {}, {
            post: {
                method: 'POST',
                isArray: false
            }
        })

        return {
            getTypeList: getTypeList,
            getLogInfo: getLogInfo,
            getUpDownContext: getUpDownContext,
            getEventCount: getEventCount,
            getTotalPercent: getTotalPercent,
            getFieldStatistics: getFieldStatistics,
            getFieldType: getFieldType,
            getSegmentStatistic: getSegmentStatistic,
            getTimeSegmentStatistic: getTimeSegmentStatistic,
            logSearchForSql: logSearchForSql,
            logSearchForSpl: logSearchForSpl,
            getAllIndex: getAllIndex,
            getIndexByName: getIndexByName,
            getIndexByCategory: getIndexByCategory
        };
    }
})();