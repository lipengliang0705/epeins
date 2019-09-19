(function () {
    'use strict';
    /**
     * @ 修改仪表盘
     * Author:Veiss Date:2019/6/21
     *  */
    var app = angular.module('LoginsightUiApp.page.file-place');
    app.controller("filePlaceSearchController", filePlaceSearchController);
    filePlaceSearchController.$inject = ['$uibModalInstance', 'transferData', '$rootScope', 'toastr','DateUtils','$filter'];

    function filePlaceSearchController($uibModalInstance, transferData, $rootScope, toastr,DateUtils,$filter) {
        var vm = this;
        console.log(transferData);
        vm.data = {
            name: transferData.name,
            status: transferData.status,
            fileSize: transferData.fileSize,
        };
        vm.searchData = {
            params1: {},
            params2: {},
            params3: {},
            params4: {},
        };
        vm.method = {
            submit: submit,
            cancel: cancel,
            search: search
        }
        var orightList = [
            {
                "id": "4688",
                "name": "192.168.218.134",
                "alias": null,
                "version": "v1.7.0",
                "sourcePath": "/opt/tss/karl/agent/flume/apache-flume-1.7.0-bin.tar",
                "scriptPath": "/opt/tss/karl/agent/flume/shell/unzip.sh",
                "description": "A new process has been created. Subject: Security ID: S-1-0-0 Account Name: - Account Domain: - Logon ID: 0x0 Logon Type: 2 Impersonation Level: Delegation New Logon: Security ID: S-1-5-18 Account Name: prabhu-4062 Account Domain: Logon ID: 0x110404 Process Information: New Process ID: 0x2bf8\tNew Process Name: C:\\Windows\\System32\\WannaCry.exe\tToken Ekevatuib Type: %%1937\tMandatory Label: S-1-16-12288\tCreator Process ID: 0x3774\tCreator Process Name: D:\\ManageEngine\\Log360UEBA_4010_internal_validation\\Log360UEBA\\pgsql\\bin\\postgres.exe\tProcess Command Line: Token Elevation Type etc",
                "startTime": "2019-02-20T07:44:05Z",
                "modifiedBy": "admin",
                "type": "Security",
                "fileSize": "1KB",
                "source": "Microsoft-Windows-Security-Auditing",
                "createdBy": "admin",
                "status": "Success"
            }, {
                "id": "32",
                "name": "192.168.218.134",
                "alias": null,
                "version": "v1.7.0",
                "sourcePath": "/opt/tss/karl/agent/flume/apache-flume-1.7.0-bin.tar",
                "scriptPath": "/opt/tss/karl/agent/flume/shell/unzip.sh",
                "description": "id=\"0104\" severity=\"info\" sys=\"SecureWeb\" sub=\"ftp\" name=\"file blocked, virus detected\" srcip=\"192.168.12.34\" dstip=\"10.8.16.108\" url=\"ftp://10.8.16.108/pub/xyz.exe\" user=\"anonymous\" virus=\"W32/xyz\"",
                "startTime": "2019-02-20T07:44:05Z",
                "modifiedBy": "admin",
                "type": "Application",
                "fileSize": "1KB",
                "source": "Sophos Anti-Virus",
                "createdBy": "admin",
                "status": "Success"
            }
        ]
        vm.resoures = {
            list: []
        }
        orightList.forEach(function (item) {
            vm.resoures.list.push(item);
        })


        function init() {
            // 初始化
            tableloadAll()
        }

        function tableloadAll() {
            vm.resoures.list;
        }

        vm.dateRangeOptions = {
            "opens": "left",
            "timePicker": true,
            "timePicker24Hour": true,
            "ranges": {
                '15分钟前': [moment().subtract(15, 'minute'), moment()],
                '1个小时前': [moment().subtract(1, 'hour'), moment()],
                '一天前': [moment().subtract(1, 'day'), moment()],
                '三天前': [moment().subtract(3, 'day'), moment()],
                '一周前': [moment().subtract(1, 'week'), moment()],
                '当天': [moment().startOf('days'), moment()],
                '当月': [moment().startOf('month'), moment().endOf('month')]
            },
            "locale": {
                "format": "YYYY-MM-DD HH:mm:ss",
                "separator": " ~ ",
                "applyLabel": "确定",
                "cancelLabel": "取消",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "自定义",
                "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                "firstDay": 1
            },
        }

        // 格式化显示时间
        vm.formatShowTime = formatShowTime;
        // 时间选择
        vm.dateRange = {
            "startDate": vm.endTime || moment().subtract(2, 'year'), //moment().subtract(15, 'minute'),
            "endDate": vm.startTime || moment()
        }; //
        // 格式化显示时间
        function formatShowTime(data) {
            return moment(data).format("YYYY/MM/DD HH:mm:ss");
        };

        function submit() {
            //修改后的参数
            var item = {
                name: vm.data.name,
                status: vm.data.status,
                fileSize: vm.data.fileSize,
            }

            // 调接口，储存
            // 储存成功后，跳转到列表页，并且刷新页面
            $rootScope.$broadcast('modifyFilePlaceSuccess', item);
            toastr.success('归档修改成功！');

            // 关闭
            cancel();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function search() {
            console.log(vm.searchData);
            console.log(vm.dateRange);

            console.log();
            var searchDate=$filter('date')(DateUtils.convertDateTimeFromServer(vm.dateRange.startDate),'yyyy-MM-dd HH:mm');

            var _list = orightList.filter(function (item) {
                return (item[vm.searchData.params1.name] == vm.searchData.params1.value);
            })
            vm.resoures.list = _list;
        }

        init();
    }
})();