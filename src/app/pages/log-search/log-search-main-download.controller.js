(function() {
    'use strict'
    angular
        .module('LoginsightUiApp.page.logSearch')
        .controller('logSearchMainDownloadContextCtrl', logSearchMainDownloadContextCtrl);

    logSearchMainDownloadContextCtrl.$inject = ['$scope', '$state', '$filter', '$timeout', 'EsService', 'data', '$uibModalInstance'];

    function logSearchMainDownloadContextCtrl($scope, $state, $filter, $timeout, EsService, data, $uibModalInstance) {
        var vm = this;
        console.log(data, " 999")
        vm.cancel = cancel;
        // vm.getList = getList;

        // getHostsList();
        // function getHostsList() {
        //     var app = data.appInfo;
        //     EsService.getDataSource({name: app.name}).then(function(ds){
        //         ds.search(queryHostsParams(), onSuccess);
        //     });
        //     function onSuccess(error, d) {
        //         var result = ResultHandler.create(d, false, false, false, false);
        //         vm.hosts = result.getBody();
        //     }
        // }

        // function getList() {

        //     var downloadParams = vm.download;
        //     // 选择多少主机， 就循环多少次下载
        //     _.forEach(downloadParams.hosts,function(_d) {
        //         console.log("_d", _d.hostname);
        //         var hostName = _d.hostname;
        //         var filePath = _d.filepath;
        //         var number = downloadParams.number;
        //         var type = downloadParams.type;

        //         getLink(hostName, filePath, number, type);
        //     })

        //     // 主机名称， 文件路径，需要下载的数量， 类型
        //     function getLink(hostName, filePath, number, type) {
        //         // 先生成es的下载参数
        //         var params = queryListParams(hostName, filePath, number);
        //         EsService.getDataSource({name: 'DB2DIAG'}).then(function(ds){
        //             ds.search(params, onSuccess);
        //         });
        //         function onSuccess(error, d) {
        //             var resultHandler = ResultHandler.create(d, false, false, false, false);
        //             var result = resultHandler.getBody();
        //             var rows = resultHandler.getHead();
        //             // 下载类型为log 只下载@message字段
        //             if(type == "log") {
        //                 var t_result = result.map(function(_d) {
        //                     return _d["@message"] + '\r\n';
        //                 })
        //                 download(t_result, hostName, "text/plain");
        //             } else if(type == "csv") {
        //                 // var r_result = angular.copy(result);
        //                 // var ignore = ["@filename", "@filepath", "@hostname", "@linenum", "@message"];
        //                 // var r = _.remove(rows, function(row) {
        //                 //     return ignore.indexOf(row) > 0;
        //                 // })
        //                 // r_result.map(function(_d) {
        //                 //     for(var row in r) {
        //                 //         return _d[row];
        //                 //     }
        //                 // })
        //                 // download(r_result, hostName, "text/plain");
        //                 // console.log(r_result);
        //             }

        //             console.log("type", type);
        //         }
        //     }
        // }




        // function queryHostsParams() {
        //     var bodyParams  = {};
        //     // 查询一共有多少主机的参数
        //     var params = {
        //         "query":{},
        //     	"from": 0,
        //     	"size": 0,
        //     	"_source": {
        //     		"includes": [
        //     			"hostname",
        //     			"count"
        //     		],
        //     		"excludes": []
        //     	},
        //     	"aggregations": {
        //     		"hostname": {
        //     			"terms": {
        //     				"field": "@hostname",
        //     				"size": 200
        //     			},
        //     			"aggregations": {
        //     				"filepath": {
        //     					"terms": {
        //     						"field": "@filepath",
        //     						"size": 100
        //     					},
        //     					"aggregations": {
        //     						"count": {
        //     							"value_count": {
        //     								"field": "_index"
        //     							}
        //     						}
        //     					}
        //     				}
        //     			}
        //     		}
        //     	}
        //     };
        //     params.query = data.queryParams.body.query;
        //     bodyParams.body = params;
        //     bodyParams.index = data.queryParams['index'];

        //     return bodyParams;
        // }


        // //主机名， 文件路径， 下载行数
        // function queryListParams(hostName, filePath, number) {
        //     var bodyParams  = {};
        //     // 查询一共有多少主机的参数
        //     var params = {};
        //     // 查询时带上用户在搜索框的条件
        //     params.query = angular.copy(data.queryParams.body.query);
        //     // 查询数量
        //     params.size = number;
        //     if(!params.query.bool)
        //         params.query.bool = {};
        //     if(!params.query.bool.must)
        //         params.query.bool.must = [];

        //     // 把查询的主机名和文件路径名加入查询条件
        //     if(hostName)
        //         params.query.bool.must.push({"term": {"@hostname": hostName}});
        //     if(filePath)
        //         params.query.bool.must.push({"term": {"@filepath": filePath}});

        //     bodyParams.body = params;
        //     bodyParams.index = data['index'];

        //     return bodyParams;
        // }

        // 关闭当前页面
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();