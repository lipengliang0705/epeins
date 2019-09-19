(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.service-tracking')
        .controller('ServiceTrackingController', ServiceTrackingController);

    ServiceTrackingController.$inject = ['$scope', '$http', '$state', '$stateParams', '$filter'];

    function ServiceTrackingController($scope, $http, $state, $stateParams, $filter) {
        var vm = this;


        var jsondata ={
            "took": 3874,
            "timed_out": false,
            "_shards": {
                "total": 20,
                "successful": 20,
                "skipped": 0,
                "failed": 0
            },
            "hits": {
                "total": 4,
                "max_score": null,
                "hits": [{
                    "_index": "esb-2018-06-28",
                    "_type": "esb_mb_log",
                    "_id": "AWRF-aqHbQcYM-4n9PuG",
                    "_score": null,
                    "_source": {
                        "@hostname": "P750G2",
                        "@filename": "ServiceID00010000803800.log",
                        "@filepath": "/home/esb/esblog/mqsi/ESB_BK12/EG03/ServiceID00010000803800.log",
                        "@transBeginTime": "",
                        "@message": "[2018-06-28 18:38:01,179]: 3011174 Thread-13 [DEBUG] Broker Trace Message;Service Id:00010000803800;Service Sn:1800239789929180628\n Message:<Service>\n\t<Service_Header>\n\t\t<reply_qmgr>ESB_AFAIN04</reply_qmgr>\n\t\t<service_response>\n\t\t\t<code>S000A000</code>\n\t\t\t<desc>交易成功</desc>\n\t\t\t<requester_code></requester_code>\n\t\t\t<requester_desc></requester_desc>\n\t\t\t<status>COMPLETE</status>\n\t\t</service_response>\n\t\t<msglog>1</msglog>\n\t\t<timeout>150</timeout>\n\t\t<name>现金收付</name>\n\t\t<start_time>1530182281122</start_time>\n\t\t<start_timestamp>2018-06-28 18:38:01.122</start_timestamp>\n\t\t<service_id>00010000803800</service_id>\n\t\t<requester_id>0309</requester_id>\n\t\t<version_id>01</version_id>\n\t\t<service_sn>1800239789929180628</service_sn>\n\t\t<branch_id>320099900</branch_id>\n\t\t<service_time>20180628183801</service_time>\n\t\t<channel_id>96</channel_id>\n\t\t<requester>AFA</requester>\n\t\t<trace_msg>Reply to responseQ - IBM.SERVICE.RESPONSE.OUT.AFA: ESB_AFAIN04</trace_msg>\n\t\t<end_timestamp>2018-06-28 18:38:01.177</end_timestamp>\n\t</Service_Header>\n\t<Service_Body>\n\t\t<ext_attributes>\n\t\t\t<INM-TERM-TYP>A</INM-TERM-TYP>\n\t\t\t<INM-TERM-SRL>004</INM-TERM-SRL>\n\t\t\t<TELLER-IDENTIFY>1</TELLER-IDENTIFY>\n\t\t\t<INM-TELLER-ID>320099900N04</INM-TELLER-ID>\n\t\t\t<KEY_LABEL>0201</KEY_LABEL>\n\t\t\t<INM-TX-TYP>0</INM-TX-TYP>\n\t\t\t<INM-BUSINESS-CTL>14</INM-BUSINESS-CTL>\n\t\t\t<INM-SUB-TX-CODE>00</INM-SUB-TX-CODE>\n\t\t\t<INM-APP-TX-CODE>8038</INM-APP-TX-CODE>\n\t\t\t<INM-BUS-OP-CODE>8038</INM-BUS-OP-CODE>\n\t\t\t<INM-BUS-CODE>SA0</INM-BUS-CODE>\n\t\t\t<INM-1LVL-FE-ID>2</INM-1LVL-FE-ID>\n\t\t\t<INM-LAN-ID>01</INM-LAN-ID>\n\t\t\t<TransactionID>TC01</TransactionID>\n\t\t\t<INM-SYS-TX-CODE>TCCB</INM-SYS-TX-CODE>\n\t\t\t<INM-MSG-STATUS>8000</INM-MSG-STATUS>\n\t\t\t<INM-CHANEL-FLG>96</INM-CHANEL-FLG>\n\t\t\t<INM-OFFLINE-TX-LOG-NO>1800239789929180628</INM-OFFLINE-TX-LOG-NO>\n\t\t\t<INM-TX-MODE>8</INM-TX-MODE>\n\t\t\t<INM-JOB-ID>2018</INM-JOB-ID>\n\t\t\t<INM-BATCH-NO>0628</INM-BATCH-NO>\n\t\t\t<INM-BRANCH-ID>320099900</INM-BRANCH-ID>\n\t\t\t<OPMFMH>404040\n\t\t\t\t<process>1</process>\n\t\t\t</OPMFMH>\n\t\t\t<OPM-FILLER>\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-FILLER>\n\t\t\t<OPM-LL>09de\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-LL>\n\t\t\t<OPM-RESP-CODE>8\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-RESP-CODE>\n\t\t\t<OPM-TX-STATUS>0\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-TX-STATUS>\n\t\t\t<OPM-MSG-STATUS>00000000\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-MSG-STATUS>\n\t\t\t<OPM-DATA-COMPRESS>0\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-DATA-COMPRESS>\n\t\t\t<OPM-HOST-BUS-DT>20180628\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-HOST-BUS-DT>\n\t\t\t<OPM-HOST-CPU-DT>20180628\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-HOST-CPU-DT>\n\t\t\t<OPM-HOST-PROC-TIME>183802505\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-HOST-PROC-TIME>\n\t\t\t<OPM-MAC-OFFSET>0000\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-MAC-OFFSET>\n\t\t\t<OPM-MAC-LL>0000\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-MAC-LL>\n\t\t\t<OPM-MAC-VALUE>0\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-MAC-VALUE>\n\t\t\t<OPM-KEY-SYC-VALUE>0\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-KEY-SYC-VALUE>\n\t\t\t<OPM-OPMION-FIELD-MAP>0000000080040000\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-OPMION-FIELD-MAP>\n\t\t\t<OPM-TX-LOG-NO>320099900N040007256\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-TX-LOG-NO>\n\t\t\t<OPM-SEC-CTL>f0f0f0f0\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-SEC-CTL>\n\t\t</ext_attributes>\n\t\t<request>\n\t\t\t<FUNC>1</FUNC>\n\t\t\t<EC-TYP>0</EC-TYP>\n\t\t\t<CURR-COD>01</CURR-COD>\n\t\t\t<CONNTR-NO>400584020008</CONNTR-NO>\n\t\t\t<PAYEE-NAME>财付通</PAYEE-NAME>\n\t\t\t<RVL-ACCT-NO>0158401100000011</RVL-ACCT-NO>\n\t\t\t<MAFE-FLG>0</MAFE-FLG>\n\t\t\t<COLA-NETN-FLG>0</COLA-NETN-FLG>\n\t\t\t<DSCRP-COD>2015</DSCRP-COD>\n\t\t\t<BUSN-TYP>0</BUSN-TYP>\n\t\t\t<USG-RE>0002</USG-RE>\n\t\t\t<RMTR-PRVN>00000330</RMTR-PRVN>\n\t\t\t<DATE>20180628</DATE>\n\t\t\t<AGREEMENT-NO>0023978992</AGREEMENT-NO>\n\t\t\t<SETL-DT>20180629</SETL-DT>\n\t\t\t<NOTE-NO-1>1</NOTE-NO-1>\n\t\t\t<NOTE-NO-2>06</NOTE-NO-2>\n\t\t\t<SIGN-FLG>1</SIGN-FLG>\n\t\t\t<AMT>2100</AMT>\n\t\t\t<ACCT-NO-T-1>10132009990010111005000001</ACCT-NO-T-1>\n\t\t\t<AMT-T-1>2100</AMT-T-1>\n\t\t\t<DR-CR-COD-T-1>C</DR-CR-COD-T-1>\n\t\t\t<ACCT-NO-T-2>3200999001019120181505320522</ACCT-NO-T-2>\n\t\t\t<AMT-T-2>2100</AMT-T-2>\n\t\t\t<DR-CR-COD-T-2>D</DR-CR-COD-T-2>\n\t\t</request>\n\t\t<response>\n\t\t\t<FORM>320099900N04000725620180628                   20180628\n\t\t\t\t<ID>SSA80380</ID>\n\t\t\t</FORM>\n\t\t\t<O-HOST-LOGNO>320099900N040007256</O-HOST-LOGNO>\n\t\t\t<O-BUSN-DT>20180628</O-BUSN-DT>\n\t\t\t<O-EC-HODST-LOGNO></O-EC-HODST-LOGNO>\n\t\t\t<O-EC-BUSN-DT>20180628</O-EC-BUSN-DT>\n\t\t\t<O-RECON-NO-T-1></O-RECON-NO-T-1>\n\t\t\t<O-RECON-NO-T-2></O-RECON-NO-T-2>\n\t\t\t<O-RECON-NO-T-3></O-RECON-NO-T-3>\n\t\t\t<O-RECON-NO-T-4></O-RECON-NO-T-4>\n\t\t\t<FORM>20180628                    0210132009990010111005000001  C10110111005存放第三方清算机构活期款项00000000000210{000000000010132009990020181505320522  D10120181505县级存放活期款项          00000000000210{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000320099900N040007256\n\t\t\t\t<ID>FCMAEA01</ID>\n\t\t\t</FORM>\n\t\t\t<FORM>\n\t\t\t\t<ID>FFFFFFFF</ID>\n\t\t\t</FORM>\n\t\t</response>\n\t</Service_Body>\n</Service>",
                        "timestamp": "2018-06-28T18:38:01.179Z",
                        "rqt_starttime": null,
                        "rqt_starttimestamp": "",
                        "rqt_servicesn": "",
                        "rqt_serviceid": "",
                        "rqt_requesterid": "",
                        "rqt_branchid": "",
                        "rqt_requester": "",
                        "rqt_channelid": "",
                        "rqt_servicetime": null,
                        "rqt_versionid": "",
                        "rqt_tracemsg": "",
                        "rqt_trace_time": "",
                        "rqt_trace_subservicesn": "",
                        "rqt_trace_status": "",
                        "rqt_trace_serviceid": "",
                        "rsp_time": "",
                        "rsp_protimestamp": "",
                        "rsp_subservicesn": "",
                        "rsp_subserviceid": "",
                        "rsp_code": "",
                        "rsp_desc": "",
                        "rsp_trace_time": "2018-06-28 18:38:01,179",
                        "rsp_trace_status": "COMPLETE",
                        "rsp_trace_servicesn": "1800239789929180628",
                        "rsp_trace_serviceid": "00010000803800",
                        "rqt_time": "",
                        "alarmlevel": "DEBUG",
                        "rqt_receiver_id": "",
                        "rqt_trade_id": "",
                        "rsp_trace_receiver_id": "0001",
                        "rsp_trace_trade_id": "803800",
                        "rsp_receiver_id": "",
                        "rsp_trade_id": "",
                        "rqt_trace_receiver_id": "",
                        "rqt_trace_trade_id": "",
                        "rsp_trace_requester_id": "0309",
                        "rsp_requester_id": "",
                        "rqt_trace_requester_id": "",
                        "service_id": "00010000803800",
                        "service_sn": "1800239789929180628",
                        "@rule_alias": "ESB",
                        "@store_name": "esb",
                        "@rule_name": "esb_mb_log",
                        "@linenum": 20443396
                    },
                    
                    "sort": [1530211081179]
                }, {
                    "_index": "esb-2018-06-28",
                    "_type": "esb_mb_log",
                    "_id": "AWRF-agJ6W8cOdp010I0",
                    "_score": null,
                    "_source": {
                        "@hostname": "P750G2",
                        "@filename": "ServiceID00010000803800.log",
                        "@filepath": "/home/esb/esblog/mqsi/ESB_BK12/EG03/ServiceID00010000803800.log",
                        "@transBeginTime": "",
                        "@message": "[2018-06-28 18:38:01,174]: 3011169 Thread-13 [DEBUG] Broker Accept response [Broker Name:ESB_BK12;Service Id:00010000803800\nResponse Message:<Service>\n\t<Service_Header>\n\t\t<reply_qmgr>ESB_AFAIN04</reply_qmgr>\n\t\t<processes>\n\t\t\t<currentprocess>1</currentprocess>\n\t\t\t<nextprocess>1</nextprocess>\n\t\t\t<total>1</total>\n\t\t\t<process>\n\t\t\t\t<id>1</id>\n\t\t\t\t<end_timestamp></end_timestamp>\n\t\t\t\t<process_timestamp>2018-06-28 18:38:01.124</process_timestamp>\n\t\t\t\t<resp_target_q>IBM.SERVICE.RESPONSE.OUT.CBOD</resp_target_q>\n\t\t\t\t<req_target_q>IBM.SERVICE.REQUEST.OUT.CBOD</req_target_q>\n\t\t\t\t<sub_target_id></sub_target_id>\n\t\t\t\t<target_id>0001</target_id>\n\t\t\t\t<sub_service_sn>1800239789929180628</sub_service_sn>\n\t\t\t\t<sub_reversal_service_id></sub_reversal_service_id>\n\t\t\t\t<async_reversal_service_id></async_reversal_service_id>\n\t\t\t\t<is_end>0</is_end>\n\t\t\t\t<skip_to_process>0</skip_to_process>\n\t\t\t\t<after_logic_class></after_logic_class>\n\t\t\t\t<timeout>150</timeout>\n\t\t\t\t<reversal_seq>0</reversal_seq>\n\t\t\t\t<key_service>0</key_service>\n\t\t\t\t<status>COMPLETE</status>\n\t\t\t\t<service_id>00010000803800</service_id>\n\t\t\t\t<code>S000A000</code>\n\t\t\t\t<desc>交易成功</desc>\n\t\t\t\t<requester_code></requester_code>\n\t\t\t\t<requester_desc></requester_desc>\n\t\t\t</process>\n\t\t</processes>\n\t\t<service_response></service_response>\n\t\t<msglog>1</msglog>\n\t\t<timeout>150</timeout>\n\t\t<name>现金收付</name>\n\t\t<resp_target_q>IBM.SERVICE.RESPONSE.OUT.AFA</resp_target_q>\n\t\t<req_target_q>IBM.SERVICE.REQUEST.OUT.TYZF</req_target_q>\n\t\t<msg_expiry>360000</msg_expiry>\n\t\t<start_time>1530182281122</start_time>\n\t\t<start_timestamp>2018-06-28 18:38:01.122</start_timestamp>\n\t\t<service_id>00010000803800</service_id>\n\t\t<requester_id>0309</requester_id>\n\t\t<version_id>01</version_id>\n\t\t<service_sn>1800239789929180628</service_sn>\n\t\t<branch_id>320099900</branch_id>\n\t\t<service_time>20180628183801</service_time>\n\t\t<channel_id>96</channel_id>\n\t\t<requester>AFA</requester>\n\t\t<trace_msg>Receive Reponse from Provider</trace_msg>\n\t</Service_Header>\n\t<Service_Body>\n\t\t<ext_attributes>\n\t\t\t<INM-TERM-TYP>A</INM-TERM-TYP>\n\t\t\t<INM-TERM-SRL>004</INM-TERM-SRL>\n\t\t\t<TELLER-IDENTIFY>1</TELLER-IDENTIFY>\n\t\t\t<INM-TELLER-ID>320099900N04</INM-TELLER-ID>\n\t\t\t<KEY_LABEL>0201</KEY_LABEL>\n\t\t\t<INM-TX-TYP>0</INM-TX-TYP>\n\t\t\t<INM-BUSINESS-CTL>14</INM-BUSINESS-CTL>\n\t\t\t<INM-SUB-TX-CODE>00</INM-SUB-TX-CODE>\n\t\t\t<INM-APP-TX-CODE>8038</INM-APP-TX-CODE>\n\t\t\t<INM-BUS-OP-CODE>8038</INM-BUS-OP-CODE>\n\t\t\t<INM-BUS-CODE>SA0</INM-BUS-CODE>\n\t\t\t<INM-1LVL-FE-ID>2</INM-1LVL-FE-ID>\n\t\t\t<INM-LAN-ID>01</INM-LAN-ID>\n\t\t\t<TransactionID>TC01</TransactionID>\n\t\t\t<INM-SYS-TX-CODE>TCCB</INM-SYS-TX-CODE>\n\t\t\t<INM-MSG-STATUS>8000</INM-MSG-STATUS>\n\t\t\t<INM-CHANEL-FLG>96</INM-CHANEL-FLG>\n\t\t\t<INM-OFFLINE-TX-LOG-NO>1800239789929180628</INM-OFFLINE-TX-LOG-NO>\n\t\t\t<INM-TX-MODE>8</INM-TX-MODE>\n\t\t\t<INM-JOB-ID>2018</INM-JOB-ID>\n\t\t\t<INM-BATCH-NO>0628</INM-BATCH-NO>\n\t\t\t<INM-BRANCH-ID>320099900</INM-BRANCH-ID>\n\t\t\t<OPMFMH>404040\n\t\t\t\t<process>1</process>\n\t\t\t</OPMFMH>\n\t\t\t<OPM-FILLER>\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-FILLER>\n\t\t\t<OPM-LL>09de\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-LL>\n\t\t\t<OPM-RESP-CODE>8\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-RESP-CODE>\n\t\t\t<OPM-TX-STATUS>0\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-TX-STATUS>\n\t\t\t<OPM-MSG-STATUS>00000000\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-MSG-STATUS>\n\t\t\t<OPM-DATA-COMPRESS>0\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-DATA-COMPRESS>\n\t\t\t<OPM-HOST-BUS-DT>20180628\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-HOST-BUS-DT>\n\t\t\t<OPM-HOST-CPU-DT>20180628\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-HOST-CPU-DT>\n\t\t\t<OPM-HOST-PROC-TIME>183802505\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-HOST-PROC-TIME>\n\t\t\t<OPM-MAC-OFFSET>0000\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-MAC-OFFSET>\n\t\t\t<OPM-MAC-LL>0000\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-MAC-LL>\n\t\t\t<OPM-MAC-VALUE>0\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-MAC-VALUE>\n\t\t\t<OPM-KEY-SYC-VALUE>0\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-KEY-SYC-VALUE>\n\t\t\t<OPM-OPMION-FIELD-MAP>0000000080040000\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-OPMION-FIELD-MAP>\n\t\t\t<OPM-TX-LOG-NO>320099900N040007256\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-TX-LOG-NO>\n\t\t\t<OPM-SEC-CTL>f0f0f0f0\n\t\t\t\t<process>1</process>\n\t\t\t</OPM-SEC-CTL>\n\t\t</ext_attributes>\n\t\t<request>\n\t\t\t<FUNC>1</FUNC>\n\t\t\t<EC-TYP>0</EC-TYP>\n\t\t\t<CURR-COD>01</CURR-COD>\n\t\t\t<CONNTR-NO>400584020008</CONNTR-NO>\n\t\t\t<PAYEE-NAME>财付通</PAYEE-NAME>\n\t\t\t<RVL-ACCT-NO>0158401100000011</RVL-ACCT-NO>\n\t\t\t<MAFE-FLG>0</MAFE-FLG>\n\t\t\t<COLA-NETN-FLG>0</COLA-NETN-FLG>\n\t\t\t<DSCRP-COD>2015</DSCRP-COD>\n\t\t\t<BUSN-TYP>0</BUSN-TYP>\n\t\t\t<USG-RE>0002</USG-RE>\n\t\t\t<RMTR-PRVN>00000330</RMTR-PRVN>\n\t\t\t<DATE>20180628</DATE>\n\t\t\t<AGREEMENT-NO>0023978992</AGREEMENT-NO>\n\t\t\t<SETL-DT>20180629</SETL-DT>\n\t\t\t<NOTE-NO-1>1</NOTE-NO-1>\n\t\t\t<NOTE-NO-2>06</NOTE-NO-2>\n\t\t\t<SIGN-FLG>1</SIGN-FLG>\n\t\t\t<AMT>2100</AMT>\n\t\t\t<ACCT-NO-T-1>10132009990010111005000001</ACCT-NO-T-1>\n\t\t\t<AMT-T-1>2100</AMT-T-1>\n\t\t\t<DR-CR-COD-T-1>C</DR-CR-COD-T-1>\n\t\t\t<ACCT-NO-T-2>3200999001019120181505320522</ACCT-NO-T-2>\n\t\t\t<AMT-T-2>2100</AMT-T-2>\n\t\t\t<DR-CR-COD-T-2>D</DR-CR-COD-T-2>\n\t\t</request>\n\t\t<response>\n\t\t\t<FORM>320099900N04000725620180628                   20180628\n\t\t\t\t<ID>SSA80380</ID>\n\t\t\t</FORM>\n\t\t\t<O-HOST-LOGNO>320099900N040007256</O-HOST-LOGNO>\n\t\t\t<O-BUSN-DT>20180628</O-BUSN-DT>\n\t\t\t<O-EC-HODST-LOGNO></O-EC-HODST-LOGNO>\n\t\t\t<O-EC-BUSN-DT>20180628</O-EC-BUSN-DT>\n\t\t\t<O-RECON-NO-T-1></O-RECON-NO-T-1>\n\t\t\t<O-RECON-NO-T-2></O-RECON-NO-T-2>\n\t\t\t<O-RECON-NO-T-3></O-RECON-NO-T-3>\n\t\t\t<O-RECON-NO-T-4></O-RECON-NO-T-4>\n\t\t\t<FORM>20180628                    0210132009990010111005000001  C10110111005存放第三方清算机构活期款项00000000000210{000000000010132009990020181505320522  D10120181505县级存放活期款项          00000000000210{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000320099900N040007256\n\t\t\t\t<ID>FCMAEA01</ID>\n\t\t\t</FORM>\n\t\t\t<FORM>\n\t\t\t\t<ID>FFFFFFFF</ID>\n\t\t\t</FORM>\n\t\t</response>\n\t</Service_Body>\n</Service>",
                        "timestamp": "2018-06-28T18:38:01.174Z",
                        "rqt_starttime": null,
                        "rqt_starttimestamp": "",
                        "rqt_servicesn": "",
                        "rqt_serviceid": "",
                        "rqt_requesterid": "",
                        "rqt_branchid": "",
                        "rqt_requester": "",
                        "rqt_channelid": "",
                        "rqt_servicetime": null,
                        "rqt_versionid": "",
                        "rqt_tracemsg": "",
                        "rqt_trace_time": "",
                        "rqt_trace_subservicesn": "",
                        "rqt_trace_status": "",
                        "rqt_trace_serviceid": "",
                        "rsp_time": "2018-06-28 18:38:01,174",
                        "rsp_protimestamp": "2018-06-28 18:38:01.124",
                        "rsp_subservicesn": "1800239789929180628",
                        "rsp_subserviceid": "00010000803800",
                        "rsp_code": "S000A000",
                        "rsp_desc": "交易成功",
                        "rsp_trace_time": "",
                        "rsp_trace_status": "",
                        "rsp_trace_servicesn": "",
                        "rsp_trace_serviceid": "",
                        "rqt_time": "",
                        "alarmlevel": "DEBUG",
                        "rqt_receiver_id": "",
                        "rqt_trade_id": "",
                        "rsp_trace_receiver_id": "",
                        "rsp_trace_trade_id": "",
                        "rsp_receiver_id": "0001",
                        "rsp_trade_id": "803800",
                        "rqt_trace_receiver_id": "",
                        "rqt_trace_trade_id": "",
                        "rsp_trace_requester_id": "",
                        "rsp_requester_id": "0309",
                        "rqt_trace_requester_id": "",
                        "service_id": "00010000803800",
                        "service_sn": "1800239789929180628",
                        "@rule_alias": "ESB",
                        "@store_name": "esb",
                        "@rule_name": "esb_mb_log",
                        "@linenum": 20443244
                    },
                    
                    "sort": [1530211081174]
                }, {
                    "_index": "esb-2018-06-28",
                    "_type": "esb_mb_log",
                    "_id": "AWRF-SsS1CRkARHj4GH9",
                    "_score": null,
                    "_source": {
                        "@hostname": "P750MV03",
                        "@filename": "ServiceID00010000803800.log",
                        "@filepath": "/home/esb/esblog/mqsi/ESB_BK51/EG02/ServiceID00010000803800.log",
                        "@transBeginTime": "",
                        "@message": "[2018-06-28 18:38:01,125]: 3078650 Thread-12 [DEBUG] Broker Trace Message;Service Id:00010000803800;Service Sn:1800239789929180628\n Message:<Service>\n\t<Service_Header>\n\t\t<reply_qmgr>ESB_AFAIN04</reply_qmgr>\n\t\t<processes>\n\t\t\t<nextprocess>1</nextprocess>\n\t\t\t<total>1</total>\n\t\t\t<currentprocess>1</currentprocess>\n\t\t\t<process>\n\t\t\t\t<end_timestamp></end_timestamp>\n\t\t\t\t<process_timestamp>2018-06-28 18:38:01.124</process_timestamp>\n\t\t\t\t<resp_target_q>IBM.SERVICE.RESPONSE.OUT.CBOD</resp_target_q>\n\t\t\t\t<req_target_q>IBM.SERVICE.REQUEST.OUT.CBOD</req_target_q>\n\t\t\t\t<sub_target_id></sub_target_id>\n\t\t\t\t<target_id>0001</target_id>\n\t\t\t\t<sub_service_sn>1800239789929180628</sub_service_sn>\n\t\t\t\t<sub_reversal_service_id></sub_reversal_service_id>\n\t\t\t\t<async_reversal_service_id></async_reversal_service_id>\n\t\t\t\t<is_end>0</is_end>\n\t\t\t\t<skip_to_process>0</skip_to_process>\n\t\t\t\t<after_logic_class></after_logic_class>\n\t\t\t\t<timeout>150</timeout>\n\t\t\t\t<reversal_seq>0</reversal_seq>\n\t\t\t\t<key_service>0</key_service>\n\t\t\t\t<status>INPROCESS</status>\n\t\t\t\t<service_id>00010000803800</service_id>\n\t\t\t\t<id>1</id>\n\t\t\t</process>\n\t\t</processes>\n\t\t<service_response></service_response>\n\t\t<msglog>1</msglog>\n\t\t<timeout>150</timeout>\n\t\t<name>现金收付</name>\n\t\t<resp_target_q>IBM.SERVICE.RESPONSE.OUT.AFA</resp_target_q>\n\t\t<req_target_q>IBM.SERVICE.REQUEST.OUT.TYZF</req_target_q>\n\t\t<msg_expiry>360000</msg_expiry>\n\t\t<start_time>1530182281122</start_time>\n\t\t<start_timestamp>2018-06-28 18:38:01.122</start_timestamp>\n\t\t<service_id>00010000803800</service_id>\n\t\t<requester_id>0309</requester_id>\n\t\t<version_id>01</version_id>\n\t\t<service_sn>1800239789929180628</service_sn>\n\t\t<branch_id>320099900</branch_id>\n\t\t<service_time>20180628183801</service_time>\n\t\t<channel_id>96</channel_id>\n\t\t<requester>AFA</requester>\n\t\t<trace_msg>SERVICE.SINGLE.ROUTE - Sent single request to provider</trace_msg>\n\t</Service_Header>\n\t<Service_Body>\n\t\t<ext_attributes>\n\t\t\t<INM-TERM-TYP>A</INM-TERM-TYP>\n\t\t\t<INM-TERM-SRL>004</INM-TERM-SRL>\n\t\t\t<INM-LAN-ID>01</INM-LAN-ID>\n\t\t\t<TELLER-IDENTIFY>1</TELLER-IDENTIFY>\n\t\t\t<INM-TELLER-ID>320099900N04</INM-TELLER-ID>\n\t\t</ext_attributes>\n\t\t<request>\n\t\t\t<FUNC>1</FUNC>\n\t\t\t<EC-TYP>0</EC-TYP>\n\t\t\t<CURR-COD>01</CURR-COD>\n\t\t\t<CONNTR-NO>400584020008</CONNTR-NO>\n\t\t\t<PAYEE-NAME>财付通</PAYEE-NAME>\n\t\t\t<RVL-ACCT-NO>0158401100000011</RVL-ACCT-NO>\n\t\t\t<MAFE-FLG>0</MAFE-FLG>\n\t\t\t<COLA-NETN-FLG>0</COLA-NETN-FLG>\n\t\t\t<DSCRP-COD>2015</DSCRP-COD>\n\t\t\t<BUSN-TYP>0</BUSN-TYP>\n\t\t\t<USG-RE>0002</USG-RE>\n\t\t\t<RMTR-PRVN>00000330</RMTR-PRVN>\n\t\t\t<DATE>20180628</DATE>\n\t\t\t<AGREEMENT-NO>0023978992</AGREEMENT-NO>\n\t\t\t<SETL-DT>20180629</SETL-DT>\n\t\t\t<NOTE-NO-1>1</NOTE-NO-1>\n\t\t\t<NOTE-NO-2>06</NOTE-NO-2>\n\t\t\t<SIGN-FLG>1</SIGN-FLG>\n\t\t\t<AMT>2100</AMT>\n\t\t\t<ACCT-NO-T-1>10132009990010111005000001</ACCT-NO-T-1>\n\t\t\t<AMT-T-1>2100</AMT-T-1>\n\t\t\t<DR-CR-COD-T-1>C</DR-CR-COD-T-1>\n\t\t\t<ACCT-NO-T-2>3200999001019120181505320522</ACCT-NO-T-2>\n\t\t\t<AMT-T-2>2100</AMT-T-2>\n\t\t\t<DR-CR-COD-T-2>D</DR-CR-COD-T-2>\n\t\t</request>\n\t</Service_Body>\n</Service>",
                        "timestamp": "2018-06-28T18:38:01.125Z",
                        "rqt_starttime": null,
                        "rqt_starttimestamp": "",
                        "rqt_servicesn": "",
                        "rqt_serviceid": "",
                        "rqt_requesterid": "",
                        "rqt_branchid": "",
                        "rqt_requester": "",
                        "rqt_channelid": "",
                        "rqt_servicetime": null,
                        "rqt_versionid": "",
                        "rqt_tracemsg": "",
                        "rqt_trace_time": "2018-06-28 18:38:01,125",
                        "rqt_trace_subservicesn": "1800239789929180628",
                        "rqt_trace_status": "INPROCESS",
                        "rqt_trace_serviceid": "00010000803800",
                        "rsp_time": "",
                        "rsp_protimestamp": "",
                        "rsp_subservicesn": "",
                        "rsp_subserviceid": "",
                        "rsp_code": "",
                        "rsp_desc": "",
                        "rsp_trace_time": "",
                        "rsp_trace_status": "",
                        "rsp_trace_servicesn": "",
                        "rsp_trace_serviceid": "",
                        "rqt_time": "",
                        "alarmlevel": "DEBUG",
                        "rqt_receiver_id": "",
                        "rqt_trade_id": "",
                        "rsp_trace_receiver_id": "",
                        "rsp_trace_trade_id": "",
                        "rsp_receiver_id": "",
                        "rsp_trade_id": "",
                        "rqt_trace_receiver_id": "0001",
                        "rqt_trace_trade_id": "803800",
                        "rsp_trace_requester_id": "",
                        "rsp_requester_id": "",
                        "rqt_trace_requester_id": "0309",
                        "service_id": "00010000803800",
                        "service_sn": "1800239789929180628",
                        "@rule_alias": "ESB",
                        "@store_name": "esb",
                        "@rule_name": "esb_mb_log",
                        "@linenum": 20671490
                    },
                    
                    "sort": [1530211081125]
                }, {
                    "_index": "esb-2018-06-28",
                    "_type": "esb_mb_log",
                    "_id": "AWRF-Sa3uTy4bj0BOj8T",
                    "_score": null,
                    "_source": {
                        "@hostname": "P750MV03",
                        "@filename": "ServiceID00010000803800.log",
                        "@filepath": "/home/esb/esblog/mqsi/ESB_BK51/EG02/ServiceID00010000803800.log",
                        "@transBeginTime": "",
                        //"@message": "[2018-06-28 18:38:01,123]: 3078648 Thread-12 [DEBUG] Broker Accept request,Service Id:00010000803800\nRequest Message:<Service>\n\t<Service_Header>\n\t\t<start_time>1530182281122</start_time>\n\t\t<start_timestamp>2018-06-28 18:38:01.122</start_timestamp>\n\t\t<service_id>00010000803800</service_id>\n\t\t<requester_id>0309</requester_id>\n\t\t<version_id>01</version_id>\n\t\t<service_sn>1800239789929180628</service_sn>\n\t\t<branch_id>320099900</branch_id>\n\t\t<service_time>20180628183801</service_time>\n\t\t<channel_id>96</channel_id>\n\t\t<requester>AFA</requester>\n\t\t<trace_msg>ChannelFilterNode</trace_msg>\n\t</Service_Header>\n\t<Service_Body>\n\t\t<ext_attributes>\n\t\t\t<INM-TERM-TYP>A</INM-TERM-TYP>\n\t\t\t<INM-TERM-SRL>004</INM-TERM-SRL>\n\t\t\t<INM-LAN-ID>01</INM-LAN-ID>\n\t\t\t<TELLER-IDENTIFY>1</TELLER-IDENTIFY>\n\t\t\t<INM-TELLER-ID>320099900N04</INM-TELLER-ID>\n\t\t</ext_attributes>\n\t\t<request>\n\t\t\t<FUNC>1</FUNC>\n\t\t\t<EC-TYP>0</EC-TYP>\n\t\t\t<CURR-COD>01</CURR-COD>\n\t\t\t<CONNTR-NO>400584020008</CONNTR-NO>\n\t\t\t<PAYEE-NAME>财付通</PAYEE-NAME>\n\t\t\t<RVL-ACCT-NO>0158401100000011</RVL-ACCT-NO>\n\t\t\t<MAFE-FLG>0</MAFE-FLG>\n\t\t\t<COLA-NETN-FLG>0</COLA-NETN-FLG>\n\t\t\t<DSCRP-COD>2015</DSCRP-COD>\n\t\t\t<BUSN-TYP>0</BUSN-TYP>\n\t\t\t<USG-RE>0002</USG-RE>\n\t\t\t<RMTR-PRVN>00000330</RMTR-PRVN>\n\t\t\t<DATE>20180628</DATE>\n\t\t\t<AGREEMENT-NO>0023978992</AGREEMENT-NO>\n\t\t\t<SETL-DT>20180629</SETL-DT>\n\t\t\t<NOTE-NO-1>1</NOTE-NO-1>\n\t\t\t<NOTE-NO-2>06</NOTE-NO-2>\n\t\t\t<SIGN-FLG>1</SIGN-FLG>\n\t\t\t<AMT>2100</AMT>\n\t\t\t<ACCT-NO-T-1>10132009990010111005000001</ACCT-NO-T-1>\n\t\t\t<AMT-T-1>2100</AMT-T-1>\n\t\t\t<DR-CR-COD-T-1>C</DR-CR-COD-T-1>\n\t\t\t<ACCT-NO-T-2>3200999001019120181505320522</ACCT-NO-T-2>\n\t\t\t<AMT-T-2>2100</AMT-T-2>\n\t\t\t<DR-CR-COD-T-2>D</DR-CR-COD-T-2>\n\t\t</request>\n\t</Service_Body>\n</Service>",
                        "@message": "[2018-06-28 18:38:01,123]: 3078650 Thread-12 [DEBUG] Broker Trace Message;Service Id:00010000803800;Service Sn:1800239789929180628\n Message:<Service>\n\t<Service_Header>\n\t\t<reply_qmgr>ESB_AFAIN04</reply_qmgr>\n\t\t<processes>\n\t\t\t<nextprocess>1</nextprocess>\n\t\t\t<total>1</total>\n\t\t\t<currentprocess>1</currentprocess>\n\t\t\t<process>\n\t\t\t\t<end_timestamp></end_timestamp>\n\t\t\t\t<process_timestamp>2018-06-28 18:38:01.124</process_timestamp>\n\t\t\t\t<resp_target_q>IBM.SERVICE.RESPONSE.OUT.CBOD</resp_target_q>\n\t\t\t\t<req_target_q>IBM.SERVICE.REQUEST.OUT.CBOD</req_target_q>\n\t\t\t\t<sub_target_id></sub_target_id>\n\t\t\t\t<target_id>0001</target_id>\n\t\t\t\t<sub_service_sn>1800239789929180628</sub_service_sn>\n\t\t\t\t<sub_reversal_service_id></sub_reversal_service_id>\n\t\t\t\t<async_reversal_service_id></async_reversal_service_id>\n\t\t\t\t<is_end>0</is_end>\n\t\t\t\t<skip_to_process>0</skip_to_process>\n\t\t\t\t<after_logic_class></after_logic_class>\n\t\t\t\t<timeout>150</timeout>\n\t\t\t\t<reversal_seq>0</reversal_seq>\n\t\t\t\t<key_service>0</key_service>\n\t\t\t\t<status>INPROCESS</status>\n\t\t\t\t<service_id>00010000803800</service_id>\n\t\t\t\t<id>1</id>\n\t\t\t</process>\n\t\t</processes>\n\t\t<service_response></service_response>\n\t\t<msglog>1</msglog>\n\t\t<timeout>150</timeout>\n\t\t<name>现金收付</name>\n\t\t<resp_target_q>IBM.SERVICE.RESPONSE.OUT.AFA</resp_target_q>\n\t\t<req_target_q>IBM.SERVICE.REQUEST.OUT.TYZF</req_target_q>\n\t\t<msg_expiry>360000</msg_expiry>\n\t\t<start_time>1530182281122</start_time>\n\t\t<start_timestamp>2018-06-28 18:38:01.122</start_timestamp>\n\t\t<service_id>00010000803800</service_id>\n\t\t<requester_id>0309</requester_id>\n\t\t<version_id>01</version_id>\n\t\t<service_sn>1800239789929180628</service_sn>\n\t\t<branch_id>320099900</branch_id>\n\t\t<service_time>20180628183801</service_time>\n\t\t<channel_id>96</channel_id>\n\t\t<requester>AFA</requester>\n\t\t<trace_msg>SERVICE.SINGLE.ROUTE - Sent single request to provider</trace_msg>\n\t</Service_Header>\n\t<Service_Body>\n\t\t<ext_attributes>\n\t\t\t<INM-TERM-TYP>A</INM-TERM-TYP>\n\t\t\t<INM-TERM-SRL>004</INM-TERM-SRL>\n\t\t\t<INM-LAN-ID>01</INM-LAN-ID>\n\t\t\t<TELLER-IDENTIFY>1</TELLER-IDENTIFY>\n\t\t\t<INM-TELLER-ID>320099900N04</INM-TELLER-ID>\n\t\t</ext_attributes>\n\t\t<request>\n\t\t\t<FUNC>1</FUNC>\n\t\t\t<EC-TYP>0</EC-TYP>\n\t\t\t<CURR-COD>01</CURR-COD>\n\t\t\t<CONNTR-NO>400584020008</CONNTR-NO>\n\t\t\t<PAYEE-NAME>财付通</PAYEE-NAME>\n\t\t\t<RVL-ACCT-NO>0158401100000011</RVL-ACCT-NO>\n\t\t\t<MAFE-FLG>0</MAFE-FLG>\n\t\t\t<COLA-NETN-FLG>0</COLA-NETN-FLG>\n\t\t\t<DSCRP-COD>2015</DSCRP-COD>\n\t\t\t<BUSN-TYP>0</BUSN-TYP>\n\t\t\t<USG-RE>0002</USG-RE>\n\t\t\t<RMTR-PRVN>00000330</RMTR-PRVN>\n\t\t\t<DATE>20180628</DATE>\n\t\t\t<AGREEMENT-NO>0023978992</AGREEMENT-NO>\n\t\t\t<SETL-DT>20180629</SETL-DT>\n\t\t\t<NOTE-NO-1>1</NOTE-NO-1>\n\t\t\t<NOTE-NO-2>06</NOTE-NO-2>\n\t\t\t<SIGN-FLG>1</SIGN-FLG>\n\t\t\t<AMT>2100</AMT>\n\t\t\t<ACCT-NO-T-1>10132009990010111005000001</ACCT-NO-T-1>\n\t\t\t<AMT-T-1>2100</AMT-T-1>\n\t\t\t<DR-CR-COD-T-1>C</DR-CR-COD-T-1>\n\t\t\t<ACCT-NO-T-2>3200999001019120181505320522</ACCT-NO-T-2>\n\t\t\t<AMT-T-2>2100</AMT-T-2>\n\t\t\t<DR-CR-COD-T-2>D</DR-CR-COD-T-2>\n\t\t</request>\n\t</Service_Body>\n</Service>",
                        "timestamp": "2018-06-28T18:38:01.123Z",
                        "rqt_starttime": 2147483647,
                        "rqt_starttimestamp": "2018-06-28 18:38:01.122",
                        "rqt_servicesn": "1800239789929180628",
                        "rqt_serviceid": "00010000803800",
                        "rqt_requesterid": "0309",
                        "rqt_branchid": "320099900",
                        "rqt_requester": "AFA",
                        "rqt_channelid": "96",
                        "rqt_servicetime": 2147483647,
                        "rqt_versionid": "01",
                        "rqt_tracemsg": "ChannelFilterNode",
                        "rqt_trace_time": "",
                        "rqt_trace_subservicesn": "",
                        "rqt_trace_status": "",
                        "rqt_trace_serviceid": "",
                        "rsp_time": "",
                        "rsp_protimestamp": "",
                        "rsp_subservicesn": "",
                        "rsp_subserviceid": "",
                        "rsp_code": "",
                        "rsp_desc": "",
                        "rsp_trace_time": "",
                        "rsp_trace_status": "",
                        "rsp_trace_servicesn": "",
                        "rsp_trace_serviceid": "",
                        "rqt_time": "2018-06-28 18:38:01,123",
                        "alarmlevel": "DEBUG",
                        "rqt_receiver_id": "0001",
                        "rqt_trade_id": "803800",
                        "rsp_trace_receiver_id": "",
                        "rsp_trace_trade_id": "",
                        "rsp_receiver_id": "",
                        "rsp_trade_id": "",
                        "rqt_trace_receiver_id": "",
                        "rqt_trace_trade_id": "",
                        "rsp_trace_requester_id": "",
                        "rsp_requester_id": "",
                        "rqt_trace_requester_id": "",
                        "service_id": "00010000803800",
                        "service_sn": "1800239789929180628",
                        "@rule_alias": "ESB",
                        "@store_name": "esb",
                        "@rule_name": "esb_mb_log",
                        "@linenum": 20671401
                    },
                
                    "sort": [1530211081123]
                },{
				"_index": "afa-2018-06-28",
				"_type": "afa_log",
				"_id": "AWRF-1XzFjis6mOcLQC3",
				"_score": null,
				"_source": {
					"@hostname": "P750ADV02",
					"@filename": "/home/afa/log/20180628/000003/103003/P103003_D0628_C2_Q0_N13@32.1.34.4.log",
					"@filepath": "/home/afa/log/20180628/000003/103003/P103003_D0628_C2_Q0_N13@32.1.34.4.log",
					"@transBeginTime": "1530182326955299257d0-5cdc-4a68-a837-7191377c412d",
					"@message": "[2018/06/28 18:37:59.880][3670018] -- [D][开始交易 700000:700000]\n[2018/06/28 18:37:59.880][3670018] -- [D][调用业务流程步骤 T700000_STEP1_IMPL]\n[2018/06/28 18:37:59.880][3670018] -- [D][步骤 1 功能 加验mac]\n[2018/06/28 18:37:59.880][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE1]\n[2018/06/28 18:37:59.880][3670018] -- [D][节点功能 开始]\n[2018/06/28 18:37:59.880][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE2]\n[2018/06/28 18:37:59.880][3670018] -- [D][节点功能 默认逻辑错误委托]\n[2018/06/28 18:37:59.880][3670018] -- [T][将默认异常委托到 T700000_STEP1_NODE23 节点]\n[2018/06/28 18:37:59.880][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE3]\n[2018/06/28 18:37:59.880][3670018] -- [D][节点功能 补足报文编号]\n[2018/06/28 18:37:59.880][3670018] -- [T][入参0='NPS.142.001.01']\n[2018/06/28 18:37:59.880][3670018] -- [T][入参1=16]\n[2018/06/28 18:37:59.880][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.880][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.880][3670018] -- [T][出参0='00NPS.142.001.01']\n[2018/06/28 18:37:59.880][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.880][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE4]\n[2018/06/28 18:37:59.880][3670018] -- [D][节点功能 补足系统通道代码]\n[2018/06/28 18:37:59.880][3670018] -- [T][入参0='003']\n[2018/06/28 18:37:59.880][3670018] -- [T][入参1=3]\n[2018/06/28 18:37:59.880][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.880][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.880][3670018] -- [T][出参0='003']\n[2018/06/28 18:37:59.880][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.880][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE5]\n[2018/06/28 18:37:59.880][3670018] -- [D][节点功能 补足交易日期]\n[2018/06/28 18:37:59.880][3670018] -- [T][入参0='20180628']\n[2018/06/28 18:37:59.880][3670018] -- [T][入参1=8]\n[2018/06/28 18:37:59.880][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.880][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.880][3670018] -- [T][出参0='20180628']\n[2018/06/28 18:37:59.880][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE6]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断是否需要加密]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE25]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 补足行网点号]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0='320099900N04']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=12]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.881][3670018] -- [T][出参0='320099900N04']\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE8]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 补足发起清算行号]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0='100000000000']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=14]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.881][3670018] -- [T][出参0='00100000000000']\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE9]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断是否需要加密]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE26]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 补足接收清算行号]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0='314305106650']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=14]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.881][3670018] -- [T][出参0='00314305106650']\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE11]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 补足交易流水号]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0='0069999061']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=12]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.881][3670018] -- [T][出参0='000069999061']\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE12]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断付款人帐号是否为空]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE27]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断是否需要加密]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE28]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 补足付款人账号]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0='6230756801001054869']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=32]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.881][3670018] -- [T][出参0='00000000000006230756801001054869']\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE14]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断收款人帐号是否为空]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE29]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断是否需要加密]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE30]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 补足收款人账号]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0='0158401100000011']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=32]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.881][3670018] -- [T][出参0='00000000000000000158401100000011']\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE16]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断业务金额是否为空]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE31]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 补足业务金额]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0='2100']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=18]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.881][3670018] -- [T][出参0='000000000000002100']\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE35]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断手续费金额是否为空]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE36]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断是否需要加密]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE34]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 补足手续费金额]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0='0']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=18]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.881][3670018] -- [T][出参0='000000000000000000']\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE39]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断委托日期是否为空]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE37]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 补足委托日期]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0='20180629']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=8]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参2='left']\n[2018/06/28 18:37:59.881][3670018] -- [T][入参3='0']\n[2018/06/28 18:37:59.881][3670018] -- [T][出参0='20180629']\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE18]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断响应码是否为空]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=True]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=True]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE19]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 容器变量赋值]\n[2018/06/28 18:37:59.881][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=[['rspcode_mac','00000']]]\n[2018/06/28 18:37:59.881][3670018] -- [T][__RST__ = D]\n[2018/06/28 18:37:59.881][3670018] -- [T][__ECD__ = ]\n[2018/06/28 18:37:59.881][3670018] -- [T][__MSG__ = ]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE40]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 判断是否是补正]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参0=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.881][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:37:59.881][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE48]\n[2018/06/28 18:37:59.881][3670018] -- [D][节点功能 容器变量赋值]\n[2018/06/28 18:37:59.881][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:37:59.881][3670018] -- [T][入参1=[['ortrcco_mac',''],['ortrcdat_mac',''],['ortrcno_mac',''],['orsndbnk_mac','']]]\n[2018/06/28 18:37:59.881][3670018] -- [T][__RST__ = D]\n[2018/06/28 18:37:59.881][3670018] -- [T][__ECD__ = ]\n[2018/06/28 18:37:59.881][3670018] -- [T][__MSG__ = ]\n[2018/06/28 18:37:59.881][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.882][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE20]\n[2018/06/28 18:37:59.882][3670018] -- [D][节点功能 容器变量赋值]\n[2018/06/28 18:37:59.882][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:37:59.882][3670018] -- [T][入参1=[['rspcode','00000']]]\n[2018/06/28 18:37:59.882][3670018] -- [T][__RST__ = D]\n[2018/06/28 18:37:59.882][3670018] -- [T][__ECD__ = ]\n[2018/06/28 18:37:59.882][3670018] -- [T][__MSG__ = ]\n[2018/06/28 18:37:59.882][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.882][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE21]\n[2018/06/28 18:37:59.882][3670018] -- [D][节点功能 生成macdata]\n[2018/06/28 18:37:59.882][3670018] -- [T][入参0=['00NPS.142.001.01','003','20180628','320099900N04','00100000000000','00314305106650','000069999061','00000000000006230756801001054869','00000000000000000158401100000011','000000000000002100','000000000000000000','20180629','00000','','','','']]\n[2018/06/28 18:37:59.882][3670018] -- [T][入参1=None]\n[2018/06/28 18:37:59.882][3670018] -- [T][出参0='00NPS.142.001.0100320180628320099900N04001000000000000031430510665000006999906100000000000006230756801001054869000000000000000001584011000000110000000000000021000000000000000000002018062900000']\n[2018/06/28 18:37:59.882][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.882][3670018] -- [D][调用具体实现节点 T700000_STEP1_NODE22]\n[2018/06/28 18:37:59.882][3670018] -- [D][节点功能 正常结束]\n[2018/06/28 18:37:59.882][3670018] -- [D][调用内建函数 ACMP_Builtin_CheckResponse]\n[2018/06/28 18:37:59.882][3670018] -- [D][结束交易 700000]\n[2018/06/28 18:37:59.882][3670018] -- [T][ret:True]\n[2018/06/28 18:37:59.882][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.882][3670018] -- [D][调用具体实现节点 T713003_STEP4_NODE10]\n[2018/06/28 18:37:59.882][3670018] -- [D][节点功能 获取配置文件内容]\n[2018/06/28 18:37:59.882][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:37:59.882][3670018] -- [T][入参1='/home/afa/workspace/cfg/GMT/keyvalues.conf']\n[2018/06/28 18:37:59.882][3670018] -- [T][入参2=[['314305106650','zpk','zpk',None],['314305106650','zak','zak',None]]]\n[2018/06/28 18:37:59.883][3670018] -- [T][zpk:bcm.taican.zpk]\n[2018/06/28 18:37:59.883][3670018] -- [T][zak:bcm.taican.zak]\n[2018/06/28 18:37:59.883][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.883][3670018] -- [D][调用具体实现节点 T713003_STEP4_NODE11]\n[2018/06/28 18:37:59.883][3670018] -- [D][节点功能 生成mac]\n[2018/06/28 18:37:59.883][3670018] -- [T][入参0='bcm.taican.zak']\n[2018/06/28 18:37:59.883][3670018] -- [T][入参1='00NPS.142.001.0100320180628320099900N04001000000000000031430510665000006999906100000000000006230756801001054869000000000000000001584011000000110000000000000021000000000000000000002018062900000']\n[2018/06/28 18:37:59.884][3670018] -- [T][出参0='025C1D623708F3DF']\n[2018/06/28 18:37:59.884][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.884][3670018] -- [D][调用具体实现节点 T713003_STEP4_NODE38]\n[2018/06/28 18:37:59.884][3670018] -- [D][节点功能 是否协议付款]\n[2018/06/28 18:37:59.884][3670018] -- [T][入参0=True]\n[2018/06/28 18:37:59.884][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:37:59.884][3670018] -- [D][argBOOL=True]\n[2018/06/28 18:37:59.884][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.884][3670018] -- [D][调用具体实现节点 T713003_STEP4_NODE32]\n[2018/06/28 18:37:59.884][3670018] -- [D][节点功能 苏南接口映射]\n[2018/06/28 18:37:59.884][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:37:59.884][3670018] -- [D][调用具体实现节点 T713003_STEP4_NODE12]\n[2018/06/28 18:37:59.884][3670018] -- [D][节点功能 NATP通讯（交换）]\n[2018/06/28 18:37:59.884][3670018] -- [T][入参1='710142']\n[2018/06/28 18:37:59.884][3670018] -- [D][入参2=__REQ__]\n[2018/06/28 18:37:59.884][3670018] -- [T][afacfg get ip]\n[2018/06/28 18:37:59.885][3670018] -- [T][===数据查询SQL执行耗时:[0.001]秒]\n[2018/06/28 18:37:59.885][3670018] -- [T][查找第三方IP配置表SQL:select toafeip,toafeport,outtime from afa_afatoafe where sysid = '000003_1',返回值：1]\n[2018/06/28 18:37:59.885][3670018] -- [T][argHost:32.3.193.200]\n[2018/06/28 18:37:59.885][3670018] -- [T][argPort:20029]\n[2018/06/28 18:37:59.885][3670018] -- [T][argTimeout:60]\n[2018/06/28 18:38:01.090][3670018] -- [T][===NATP交换耗时:[1.204]秒]\n[2018/06/28 18:38:01.090][3670018] -- [T][交换通讯状态为：[0, '']]\n[2018/06/28 18:38:01.090][3670018] -- [T][出参0={'agendate': '20180628','__RCV__': ']\n[2018/06/28 18:38:01.090][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用具体实现节点 T713003_STEP4_NODE13]\n[2018/06/28 18:38:01.090][3670018] -- [D][节点功能 判断苏南是否成功]\n[2018/06/28 18:38:01.090][3670018] -- [T][入参0=True]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:38:01.090][3670018] -- [D][argBOOL=True]\n[2018/06/28 18:38:01.090][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用具体实现节点 T713003_STEP4_NODE35]\n[2018/06/28 18:38:01.090][3670018] -- [D][节点功能 获取苏南的数据域]\n[2018/06/28 18:38:01.090][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:38:01.090][3670018] -- [T][入参1=[['resicdata','']]]\n[2018/06/28 18:38:01.090][3670018] -- [T][__RST__ = D]\n[2018/06/28 18:38:01.090][3670018] -- [T][__ECD__ = ]\n[2018/06/28 18:38:01.090][3670018] -- [T][__MSG__ = ]\n[2018/06/28 18:38:01.090][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用具体实现节点 T713003_STEP4_NODE14]\n[2018/06/28 18:38:01.090][3670018] -- [D][节点功能 正常结束]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用业务流程步骤 T713003_STEP5_IMPL]\n[2018/06/28 18:38:01.090][3670018] -- [D][步骤 5 功能 请求核心处理]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE1]\n[2018/06/28 18:38:01.090][3670018] -- [D][节点功能 开始]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE2]\n[2018/06/28 18:38:01.090][3670018] -- [D][节点功能 默认逻辑错误委托]\n[2018/06/28 18:38:01.090][3670018] -- [T][将默认异常委托到 T713003_STEP5_NODE11 节点]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE3]\n[2018/06/28 18:38:01.090][3670018] -- [D][节点功能 还原sysid]\n[2018/06/28 18:38:01.090][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:38:01.090][3670018] -- [T][入参1=[['sysid','000003']]]\n[2018/06/28 18:38:01.090][3670018] -- [T][__RST__ = D]\n[2018/06/28 18:38:01.090][3670018] -- [T][__ECD__ = ]\n[2018/06/28 18:38:01.090][3670018] -- [T][__MSG__ = ]\n[2018/06/28 18:38:01.090][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE22]\n[2018/06/28 18:38:01.090][3670018] -- [D][节点功能 容器变量删除]\n[2018/06/28 18:38:01.090][3670018] -- [D][入参0=__RSP__]\n[2018/06/28 18:38:01.090][3670018] -- [T][入参1=['desc','code','status']]\n[2018/06/28 18:38:01.090][3670018] -- [T][__RST__ = D]\n[2018/06/28 18:38:01.090][3670018] -- [T][__ECD__ = ]\n[2018/06/28 18:38:01.090][3670018] -- [T][__MSG__ = ]\n[2018/06/28 18:38:01.090][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE4]\n[2018/06/28 18:38:01.090][3670018] -- [D][节点功能 上主机变量赋值]\n[2018/06/28 18:38:01.090][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:38:01.090][3670018] -- [T][入参1=[['SETCHRG-RSN_1','6230756801001054869'],['SETCHRG-RSN_2','0158401100000011'],['channel_id','96'],['WRIINFO-DETAIL_1','1'],['WRIINFO-DETAIL_2','06']]]\n[2018/06/28 18:38:01.090][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.090][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE23]\n[2018/06/28 18:38:01.090][3670018] -- [D][节点功能 查询清算账记账标识]\n[2018/06/28 18:38:01.090][3670018] -- [T][入参0='select status from bcm_agentadm where sysid='000003' and bankno='qings' and agentflag='D200'']\n[2018/06/28 18:38:01.090][3670018] -- [T][入参1=0]\n[2018/06/28 18:38:01.091][3670018] -- [T][===数据查询SQL执行耗时:[0.001]秒]\n[2018/06/28 18:38:01.091][3670018] -- [T][出参0=1]\n[2018/06/28 18:38:01.091][3670018] -- [T][出参1=[['10']]]\n[2018/06/28 18:38:01.091][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.091][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE24]\n[2018/06/28 18:38:01.091][3670018] -- [D][节点功能 判断是否跳过清算账]\n[2018/06/28 18:38:01.091][3670018] -- [T][入参0=False]\n[2018/06/28 18:38:01.091][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:38:01.091][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:38:01.091][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:38:01.091][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE27]\n[2018/06/28 18:38:01.091][3670018] -- [D][节点功能 设置上主机变量]\n[2018/06/28 18:38:01.091][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:38:01.091][3670018] -- [T][入参1=[['DATA-PGM-ID','00000330'],['USG-RE','0002'],['NOTE-NO-1','1'],['NOTE-NO-2','06'],['CERT-TYP',''],['CERT-ID',''],['AMT','2100'],['DATE','20180628'],['AGREEMENT-NO','0023978992'],['COLA-NETN-FLG','0'],['DSCRP-COD','2015'],['CONNTR-NO','400584020008'],['PAYEE-NAME','财付通'],['RVL-ACCT-NO','0158401100000011'],['DR-CR-COD-T-1','C'],['ACCT-NO-T-1','10132009990010111005000001'],['AMT-T-1','2100'],['ACCT-NO-T-2','3200999001019120181505320522'],['AMT-T-2','2100'],['DR-CR-COD-T-2','D']]]\n[2018/06/28 18:38:01.091][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.092][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE28]\n[2018/06/28 18:38:01.092][3670018] -- [D][节点功能 发送主机主控程序(单个指示)]\n[2018/06/28 18:38:01.092][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:38:01.092][3670018] -- [D][入参1=__RSP__]\n[2018/06/28 18:38:01.092][3670018] -- [T][入参2='000003']\n[2018/06/28 18:38:01.092][3670018] -- [T][入参3='00010000803800']\n[2018/06/28 18:38:01.092][3670018] -- [T][========发送主机主控程序(单个指示)开始==========]\n[2018/06/28 18:38:01.093][3670018] -- [T][===数据查询SQL执行耗时:[0.001]秒]\n[2018/06/28 18:38:01.093][3670018] -- [T][查找平台参数表SQL：select hostaccdate,workdate from afa_platrunctl,返回值为:1]\n[2018/06/28 18:38:01.093][3670018] -- [T][===平台工作日期为:20180628]\n[2018/06/28 18:38:01.093][3670018] -- [T][===核心工作日期为:20180628]\n[2018/06/28 18:38:01.094][3670018] -- [T][===数据查询SQL执行耗时:[0.001]秒]\n[2018/06/28 18:38:01.094][3670018] -- [T][=========根据sysid区分所属系统及控制状态SQL: select systype ,sysstatus,lianjstatus,taojstatus,rspcode,rspmsg,note1,note2 from afa_syscfgadm where sysid='000003',返回值为:1]\n[2018/06/28 18:38:01.094][3670018] -- [T][主机状态查询通过]\n[2018/06/28 18:38:01.094][3670018] -- [T][===系统标识号为:000003]\n[2018/06/28 18:38:01.095][3670018] -- [T][===数据查询SQL执行耗时:[0.001]秒]\n[2018/06/28 18:38:01.095][3670018] -- [T][从运行环境配置表选取记录SQL:select envid,disp from afa_envcfg where sysid = '000003'，返回值：1]\n[2018/06/28 18:38:01.095][3670018] -- [T][===环境标识:G00C00.CNR.UFD]\n[2018/06/28 18:38:01.095][3670018] -- [T][===农信银支付系统上主机记账开始]\n[2018/06/28 18:38:01.095][3670018] -- [T][===该交易为联机交易]\n[2018/06/28 18:38:01.095][3670018] -- [T][===========bookname=afa_udfhosttransdtl]\n[2018/06/28 18:38:01.095][3670018] -- [T][========组上主机组单个指示开始==========]\n[2018/06/28 18:38:01.095][3670018] -- [T][========上核心账号二三类规则区分开始==========]\n[2018/06/28 18:38:01.096][3670018] -- [T][===数据查询SQL执行耗时:[0.001]秒]\n[2018/06/28 18:38:01.096][3670018] -- [T][查询CBOD与互联网核心映射关系:select cbodpkgtypeno,intepkgtypeno,transtype,maintype,ctitype,msgmaptype,cbodfunkey,cbodmsgdesc,intemsgdesc,qrycnt,qrytype,chkflag from afa_cbodtointecfgmap where cbodpkgtypeno ='00010000803800',返回值:1]\n[2018/06/28 18:38:01.096][3670018] -- [T][查询主机报文配置表记录数为:1]\n[2018/06/28 18:38:01.096][3670018] -- [T][========CBOD映射到互联网核心接口为:00010000803800]\n[2018/06/28 18:38:01.096][3670018] -- [T][========接口类型:00 联机交易接口 01 套交易接口:00]\n[2018/06/28 18:38:01.096][3670018] -- [T][========接口账务标识: 00 账务类接口;01 非账务类接口:00]\n[2018/06/28 18:38:01.096][3670018] -- [T][========跨核心标识:00  跨核心;01 CBOD处理;02  互联网核心处理;00]\n[2018/06/28 18:38:01.096][3670018] -- [T][========接口映射方式:01]\n[2018/06/28 18:38:01.096][3670018] -- [T][========CBOD功能码字段:]\n[2018/06/28 18:38:01.096][3670018] -- [T][========cbod接口说明:现金收付]\n[2018/06/28 18:38:01.096][3670018] -- [T][========互联网接口说明:现金收付]\n[2018/06/28 18:38:01.096][3670018] -- [T][========互联网接口分页查询标识:0]\n[2018/06/28 18:38:01.096][3670018] -- [T][========互联网接口分页查询条数:0]\n[2018/06/28 18:38:01.096][3670018] -- [T][========互联网接口参与对账标识:0]\n[2018/06/28 18:38:01.096][3670018] -- [T][====临时cis_maintype=00]\n[2018/06/28 18:38:01.096][3670018] -- [T][========上核心账号二三类规则区分结束==========]\n[2018/06/28 18:38:01.096][3670018] -- [T][===账户规则区分耗时:[0.001]秒]\n[2018/06/28 18:38:01.096][3670018] -- [T][inte_dcflag=00]\n[2018/06/28 18:38:01.096][3670018] -- [T][cbod_dcflag=00]\n[2018/06/28 18:38:01.096][3670018] -- [T][========跨核心业务时记账模式区分开始==========]\n[2018/06/28 18:38:01.097][3670018] -- [T][['00010000803800', '']]\n[2018/06/28 18:38:01.097][3670018] -- [T][PUB_TransDcSwith-联机>inte_dcflag=00;cbod_dcflag=00]\n[2018/06/28 18:38:01.097][3670018] -- [T][========记账模式为:00]\n[2018/06/28 18:38:01.097][3670018] -- [T][========跨核心业务时记账模式区分结束==========]\n[2018/06/28 18:38:01.097][3670018] -- [T][===借贷规则判断耗时:[0.000]秒]\n[2018/06/28 18:38:01.097][3670018] -- [T][========组上主机报文头XML开始==========]\n[2018/06/28 18:38:01.097][3670018] -- [T][############context[tranmode]=00]\n[2018/06/28 18:38:01.097][3670018] -- [T][========id_path2]\n[2018/06/28 18:38:01.097][3670018] -- [T][[]]\n[2018/06/28 18:38:01.097][3670018] -- [T][容器变量[requester_id]值非法，取默认值[0309]!]\n[2018/06/28 18:38:01.098][3670018] -- [T][===数据查询SQL执行耗时:[0.001]秒]\n[2018/06/28 18:38:01.098][3670018] -- [T][查询流水重置配置表SQL:select DATAFLAG from  AFA_CBODTOINTEDATAMAP where DATATYPE='renomap' and CBODDATA='00010000803800',返回值：2]\n[2018/06/28 18:38:01.098][3670018] -- [T][========组上主机报文头XML结束==========]\n[2018/06/28 18:38:01.098][3670018] -- [T][准备组CBOD扩展体]\n[2018/06/28 18:38:01.098][3670018] -- [T][========组上主机服务扩展XML开始==========]\n[2018/06/28 18:38:01.098][3670018] -- [T][========tranmode2;msg_path:0;msg_path2:0;msg_path3=0]\n[2018/06/28 18:38:01.098][3670018] -- [T][容器变量[INM-TERM-TYP]值非法，取默认值[A]!]\n[2018/06/28 18:38:01.098][3670018] -- [T][容器变量[INM-LAN-ID]值非法，取默认值[01]!]\n[2018/06/28 18:38:01.098][3670018] -- [T][容器变量[TELLER-IDENTIFY]值非法，取默认值[1]!]\n[2018/06/28 18:38:01.098][3670018] -- [T][容器变量[INT-TCCR-SPV-A]值非法,不组该节点!]\n[2018/06/28 18:38:01.098][3670018] -- [T][容器变量[INT-TCCR-SPV-B]值非法,不组该节点!]\n[2018/06/28 18:38:01.098][3670018] -- [T][容器变量[INM-BUS-OP-CODE]值非法,不组该节点!]\n[2018/06/28 18:38:01.098][3670018] -- [T][容器变量[FILLER1]值非法,不组该节点!]\n[2018/06/28 18:38:01.098][3670018] -- [T][========组上主机服务扩展XML结束==========]\n[2018/06/28 18:38:01.098][3670018] -- [T][========组上主机单个指示XML开始==========]\n[2018/06/28 18:38:01.098][3670018] -- [T][主机交易码为:00010000803800]\n[2018/06/28 18:38:01.098][3670018] -- [T][交易码顺序号[]]\n[2018/06/28 18:38:01.102][3670018] -- [T][===数据查询SQL执行耗时:[0.003]秒]\n[2018/06/28 18:38:01.102][3670018] -- [T][查询主机报文配置表SQL:select hostelement,elementlen,wthinput,defaultdata,elementdisp,idno,afaelement,acctflag from afa_hostcfg where pkgtypeno = '00010000803800' order by pkgtypeseq,返回值：1]\n[2018/06/28 18:38:01.102][3670018] -- [T][查询主机报文配置表记录数为：83]\n[2018/06/28 18:38:01.103][3670018] -- [T][========组上主机单个指示XML结束==========]\n[2018/06/28 18:38:01.103][3670018] -- [T][===组CBOD核心报文体耗时:[0.005]秒]\n[2018/06/28 18:38:01.103][3670018] -- [T][========组上主机组单个指示结束==========]\n[2018/06/28 18:38:01.103][3670018] -- [T][========组上主机组单个指示结束==========]\n[2018/06/28 18:38:01.103][3670018] -- [T][===========]\n[2018/06/28 18:38:01.103][3670018] -- [T][========CBOD请求核心报文：\n<?xml version='1.0' encoding='utf-8'?>\n<Service>\n  <Service_Header>\n    <service_id>00010000803800</service_id>\n    <requester_id>0309</requester_id>\n    <version_id>01</version_id>\n    <service_sn>1800239789929180628</service_sn>\n    <branch_id>320099900</branch_id>\n    <service_time>20180628183801</service_time>\n    <channel_id>96</channel_id>\n    <requester>AFA</requester>\n  </Service_Header>\n  <Service_Body>\n    <ext_attributes>\n      <INM-TERM-TYP>A</INM-TERM-TYP>\n      <INM-TERM-SRL>004</INM-TERM-SRL>\n      <INM-LAN-ID>01</INM-LAN-ID>\n      <TELLER-IDENTIFY>1</TELLER-IDENTIFY>\n      <INM-TELLER-ID>320099900N04</INM-TELLER-ID>\n    </ext_attributes>\n    <request>\n      <FUNC>1</FUNC>\n      <EC-TYP>0</EC-TYP>\n      <CURR-COD>01</CURR-COD>\n      <CONNTR-NO>400584020008</CONNTR-NO>\n      <PAYEE-NAME>璐粯閫�/PAYEE-NAME>\n      <RVL-ACCT-NO>0158401100000011</RVL-ACCT-NO>\n      <MAFE-FLG>0</MAFE-FLG>\n      <COLA-NETN-FLG>0</COLA-NETN-FLG>\n      <DSCRP-COD>2015</DSCRP-COD>\n      <BUSN-TYP>0</BUSN-TYP>\n      <USG-RE>0002</USG-RE>\n      <RMTR-PRVN>00000330</RMTR-PRVN>\n      <DATE>20180628</DATE>\n      <AGREEMENT-NO>0023978992</AGREEMENT-NO>\n      <SETL-DT>20180629</SETL-DT>\n      <NOTE-NO-1>1</NOTE-NO-1>\n      <NOTE-NO-2>06</NOTE-NO-2>\n      <SIGN-FLG>1</SIGN-FLG>\n      <AMT>2100</AMT>\n      <ACCT-NO-T-1>10132009990010111005000001</ACCT-NO-T-1>\n      <AMT-T-1>2100</AMT-T-1>\n      <DR-CR-COD-T-1>C</DR-CR-COD-T-1>\n      <ACCT-NO-T-2>3200999001019120181505320522</ACCT-NO-T-2>\n      <AMT-T-2>2100</AMT-T-2>\n      <DR-CR-COD-T-2>D</DR-CR-COD-T-2>\n    </request>\n  </Service_Body>\n</Service>\n]\n[2018/06/28 18:38:01.103][3670018] -- [T][========互联网请求核心报文：\n]\n[2018/06/28 18:38:01.103][3670018] -- [T][===========退出报文拼接]\n[2018/06/28 18:38:01.103][3670018] -- [T][context.get(cti_sysstatus) =20]\n[2018/06/28 18:38:01.103][3670018] -- [T][context.get(cit_pretrans_no) =]\n[2018/06/28 18:38:01.103][3670018] -- [T][========跨核心业务流水登记开始==========]\n[2018/06/28 18:38:01.103][3670018] -- [T][====临时cti_serviceid_tmp：00010000803800]\n[2018/06/28 18:38:01.103][3670018] -- [T][intepkgtypeno=]\n[2018/06/28 18:38:01.103][3670018] -- [T][subcbodpkgtypeno=]\n[2018/06/28 18:38:01.103][3670018] -- [T][====获取原上核心业务流水：select tranmode ,sysid,cbodpkgtypeno,HOSTTRADESTATUS from afa_udfhosttransdtl where workdate='20180628' and agentserialno='0023978992' and sysid='000003' with ur]\n[2018/06/28 18:38:01.106][3670018] -- [T][===数据查询SQL执行耗时:[0.003]秒]\n[2018/06/28 18:38:01.113][3670018] -- [T][插入语句为：insert into AFA_UDFHOSTTRANSDTL (AGENTSERIALNO,BRNO,CBODAMOUNT,CBODFLAG,CBODHOSTDATE,CBODPKGTYPENO,CBODSERIALNO,CBODSTATUS,CHANNELFLG,CHKDATE,CHKFLAG,HOSTTRADESTATUS,INTEAMOUNT,INTEFLAG,INTEHOSTDATE,INTEPKGTYPENO,INTESERIALNO,INTESTATUS,SUBCBODPKGTYPENO,SYSID,TELLERNO,TRANMODE,TRANSTYPE,WORKDATE) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]\n[2018/06/28 18:38:01.113][3670018] -- [T][插入的值为：['0023978992', '320099900', '', '1', '20180628', '00010000803800', '0023978992', '3', '', '20180628', '0', 'U', '', '0', '', '', '', '3', '', '000003', '320099900N04', '00', '00', '20180628']]\n[2018/06/28 18:38:01.119][3670018] -- [T][===单笔数据匹配插入SQL执行耗时:[0.006]秒]\n[2018/06/28 18:38:01.119][3670018] -- [T][===流水登记耗时:[0.016]秒]\n[2018/06/28 18:38:01.119][3670018] -- [T][交易模式为：tranmode=00]\n[2018/06/28 18:38:01.119][3670018] -- [T][========双方均无二三类账号,采用CBOD模式处理========]\n[2018/06/28 18:38:01.227][3670018] -- [T][===CBOD耗时:[0.108]秒]\n[2018/06/28 18:38:01.227][3670018] -- [T][========接收核心应答拆包(单个指示)开始==========]\n[2018/06/28 18:38:01.227][3670018] -- [T][交易模式为:tranmode=00]\n[2018/06/28 18:38:01.227][3670018] -- [T][1核心的返回报文为[\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Service>\n  <Service_Header>\n    <reply_qmgr>ESB_AFAIN04</reply_qmgr>\n    \n    <service_response><code>S000A000</code><desc>浜ゆ槗鎴愬姛</desc><requester_code/><requester_desc/><status>COMPLETE</status></service_response>\n    <msglog>1</msglog>\n    <timeout>150</timeout>\n    <name>鐜伴噾鏀朵粯</name>\n    \n    \n    \n    <start_time>1530182281122</start_time>\n    <start_timestamp>2018-06-28 18:38:01.122</start_timestamp>\n    <service_id>00010000803800</service_id>\n    <requester_id>0309</requester_id>\n    <version_id>01</version_id>\n    <service_sn>1800239789929180628</service_sn>\n    <branch_id>320099900</branch_id>\n    <service_time>20180628183801</service_time>\n    <channel_id>96</channel_id>\n    <requester>AFA</requester>\n    <trace_msg>Reply to responseQ - IBM.SERVICE.RESPONSE.OUT.AFA: ESB_AFAIN04</trace_msg>\n  <end_timestamp>2018-06-28 18:38:01.177</end_timestamp></Service_Header>\n  <Service_Body>\n    <ext_attributes>\n      <INM-TERM-TYP>A</INM-TERM-TYP>\n      <INM-TERM-SRL>004</INM-TERM-SRL>\n      <TELLER-IDENTIFY>1</TELLER-IDENTIFY>\n      <INM-TELLER-ID>320099900N04</INM-TELLER-ID>\n      <KEY_LABEL>0201</KEY_LABEL>\n      <INM-TX-TYP>0</INM-TX-TYP>\n      <INM-BUSINESS-CTL>14</INM-BUSINESS-CTL>\n      <INM-SUB-TX-CODE>00</INM-SUB-TX-CODE>\n      <INM-APP-TX-CODE>8038</INM-APP-TX-CODE>\n      <INM-BUS-OP-CODE>8038</INM-BUS-OP-CODE>\n      <INM-BUS-CODE>SA0</INM-BUS-CODE>\n      <INM-1LVL-FE-ID>2</INM-1LVL-FE-ID>\n      <INM-LAN-ID>01</INM-LAN-ID>\n      <TransactionID>TC01</TransactionID>\n      <INM-SYS-TX-CODE>TCCB</INM-SYS-TX-CODE>\n      <INM-MSG-STATUS>8000</INM-MSG-STATUS>\n      <INM-CHANEL-FLG>96</INM-CHANEL-FLG>\n      <INM-OFFLINE-TX-LOG-NO>1800239789929180628</INM-OFFLINE-TX-LOG-NO>\n      <INM-TX-MODE>8</INM-TX-MODE>\n      <INM-JOB-ID>2018</INM-JOB-ID>\n      <INM-BATCH-NO>0628</INM-BATCH-NO>\n      <INM-BRANCH-ID>320099900</INM-BRANCH-ID>\n      <OPMFMH process=\"1\">404040</OPMFMH>\n      <OPM-FILLER process=\"1\"/>\n      <OPM-LL process=\"1\">09de</OPM-LL>\n      <OPM-RESP-CODE process=\"1\">8</OPM-RESP-CODE>\n      <OPM-TX-STATUS process=\"1\">0</OPM-TX-STATUS>\n      <OPM-MSG-STATUS process=\"1\">00000000</OPM-MSG-STATUS>\n      <OPM-DATA-COMPRESS process=\"1\">0</OPM-DATA-COMPRESS>\n      <OPM-HOST-BUS-DT process=\"1\">20180628</OPM-HOST-BUS-DT>\n      <OPM-HOST-CPU-DT process=\"1\">20180628</OPM-HOST-CPU-DT>\n      <OPM-HOST-PROC-TIME process=\"1\">183802505</OPM-HOST-PROC-TIME>\n      <OPM-MAC-OFFSET process=\"1\">0000</OPM-MAC-OFFSET>\n      <OPM-MAC-LL process=\"1\">0000</OPM-MAC-LL>\n      <OPM-MAC-VALUE process=\"1\">0   </OPM-MAC-VALUE>\n      <OPM-KEY-SYC-VALUE process=\"1\">0   </OPM-KEY-SYC-VALUE>\n      <OPM-OPMION-FIELD-MAP process=\"1\">0000000080040000</OPM-OPMION-FIELD-MAP>\n      <OPM-TX-LOG-NO process=\"1\">320099900N040007256</OPM-TX-LOG-NO>\n      <OPM-SEC-CTL process=\"1\">f0f0f0f0</OPM-SEC-CTL>\n    </ext_attributes>\n    <request>\n      <FUNC>1</FUNC>\n      <EC-TYP>0</EC-TYP>\n      <CURR-COD>01</CURR-COD>\n      <CONNTR-NO>400584020008</CONNTR-NO>\n      <PAYEE-NAME>璐粯閫�/PAYEE-NAME>\n      <RVL-ACCT-NO>0158401100000011</RVL-ACCT-NO>\n      <MAFE-FLG>0</MAFE-FLG>\n      <COLA-NETN-FLG>0</COLA-NETN-FLG>\n      <DSCRP-COD>2015</DSCRP-COD>\n      <BUSN-TYP>0</BUSN-TYP>\n      <USG-RE>0002</USG-RE>\n      <RMTR-PRVN>00000330</RMTR-PRVN>\n      <DATE>20180628</DATE>\n      <AGREEMENT-NO>0023978992</AGREEMENT-NO>\n      <SETL-DT>20180629</SETL-DT>\n      <NOTE-NO-1>1</NOTE-NO-1>\n      <NOTE-NO-2>06</NOTE-NO-2>\n      <SIGN-FLG>1</SIGN-FLG>\n      <AMT>2100</AMT>\n      <ACCT-NO-T-1>10132009990010111005000001</ACCT-NO-T-1>\n      <AMT-T-1>2100</AMT-T-1>\n      <DR-CR-COD-T-1>C</DR-CR-COD-T-1>\n      <ACCT-NO-T-2>3200999001019120181505320522</ACCT-NO-T-2>\n      <AMT-T-2>2100</AMT-T-2>\n      <DR-CR-COD-T-2>D</DR-CR-COD-T-2>\n    </request>\n    <response>\n      <FORM ID=\"SSA80380\">320099900N04000725620180628                   20180628                                                                      </FORM>\n      <O-HOST-LOGNO>320099900N040007256</O-HOST-LOGNO>\n      <O-BUSN-DT>20180628</O-BUSN-DT>\n      <O-EC-HODST-LOGNO/>\n      <O-EC-BUSN-DT>20180628</O-EC-BUSN-DT>\n      <O-RECON-NO-T-1/>\n      <O-RECON-NO-T-2/>\n      <O-RECON-NO-T-3/>\n      <O-RECON-NO-T-4/>\n      <FORM ID=\"FCMAEA01\">20180628                    0210132009990010111005000001  C10110111005瀛樻斁绗笁鏂规竻绠楁満鏋勬椿鏈熸椤�000000000210{000000000010132009990020181505320522  D10120181505鍘跨骇瀛樻斁娲绘湡娆鹃」          00000000000210{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000                                                                    00000000000000{0000000000320099900N040007256</FORM>\n      <FORM ID=\"FFFFFFFF\"/>\n    </response>\n  </Service_Body>\n</Service>\n]]\n[2018/06/28 18:38:01.233][3670018] -- [T][===ESB返回状态[COMPLETE]]\n[2018/06/28 18:38:01.233][3670018] -- [T][===ESB返回码[S000A000]]\n[2018/06/28 18:38:01.233][3670018] -- [T][===ESB返回信息[交易成功]]\n[2018/06/28 18:38:01.233][3670018] -- [T][========接收核心应答拆包(单个指示)结束==========]\n[2018/06/28 18:38:01.233][3670018] -- [T][主机交易成功，业务成功!]\n[2018/06/28 18:38:01.233][3670018] -- [T][========跨核心业务更新流水开始==========]\n[2018/06/28 18:38:01.233][3670018] -- [T][desc_len1:=======8]\n[2018/06/28 18:38:01.233][3670018] -- [T][交易成功]\n[2018/06/28 18:38:01.233][3670018] -- [T][desc_len2:=======8]\n[2018/06/28 18:38:01.233][3670018] -- [T][交易成功]\n[2018/06/28 18:38:01.233][3670018] -- [T][进入P_db_execsql,输入参数信息:\n]\n[2018/06/28 18:38:01.233][3670018] -- [T][sql语句为:update afa_udfhosttransdtl set cbodstatus='1',hosttradestatus='S',cbodsyscode='S000A000' , cbodsysmsg='交易成功',cbodsysseqno=''  where workdate='20180628' and agentserialno='0023978992'\n]\n[2018/06/28 18:38:01.233][3670018] -- [T][事务提交标识:True\n]\n[2018/06/28 18:38:01.238][3670018] -- [T][===数据库sql执行耗时:[0.005]秒]\n[2018/06/28 18:38:01.238][3670018] -- [T][影响到的笔数为:1]\n[2018/06/28 18:38:01.238][3670018] -- [T][========核心返回结果追加到输出容器开始==========]\n[2018/06/28 18:38:01.238][3670018] -- [T][========核心返回结果追加到输出容器结束==========]\n[2018/06/28 18:38:01.238][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.238][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE29]\n[2018/06/28 18:38:01.238][3670018] -- [D][节点功能 核心返回信息赋值REQ]\n[2018/06/28 18:38:01.238][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:38:01.238][3670018] -- [T][入参1=[['banksysstatus','0'],['banksyserrcode','S000A000'],['banksyserrmsg','交易成功'],['banksyserrmsg','主机记账成功！'],['banksysseq','320099900N040007256'],['banksysdate','20180628'],['banksystime','183802']]]\n[2018/06/28 18:38:01.238][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.238][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE30]\n[2018/06/28 18:38:01.238][3670018] -- [D][节点功能 核心返回信息赋值RSP]\n[2018/06/28 18:38:01.238][3670018] -- [D][入参0=__RSP__]\n[2018/06/28 18:38:01.238][3670018] -- [T][入参1=[['banksysstatus','0'],['banksyserrcode','S000A000'],['banksyserrmsg','交易成功'],['banksyserrmsg','主机记账成功！'],['banksysseq','320099900N040007256'],['banksysdate','20180628'],['banksystime','183802']]]\n[2018/06/28 18:38:01.238][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.238][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE6]\n[2018/06/28 18:38:01.238][3670018] -- [D][节点功能 更新统一业务流水表交易状态为成功]\n[2018/06/28 18:38:01.238][3670018] -- [T][入参0=[['tradestatus','1'],['status','S']]]\n[2018/06/28 18:38:01.238][3670018] -- [T][入参1='20180628']\n[2018/06/28 18:38:01.238][3670018] -- [T][入参2='0023978992']\n[2018/06/28 18:38:01.238][3670018] -- [T][入参3=None]\n[2018/06/28 18:38:01.238][3670018] -- [T][入参4='1']\n[2018/06/28 18:38:01.238][3670018] -- [T][入参5=False]\n[2018/06/28 18:38:01.238][3670018] -- [T][数据库操作语句 : update rcc_maintransdtl set tradestatus='1',status='S' where workdate='20180628' and agentserialno='0023978992']\n[2018/06/28 18:38:01.238][3670018] -- [T][进入B_JSNX_execsql,输入参数信息:\n]\n[2018/06/28 18:38:01.238][3670018] -- [T][sql语句为:update rcc_maintransdtl set tradestatus='1',status='S' where workdate='20180628' and agentserialno='0023978992'\n]\n[2018/06/28 18:38:01.238][3670018] -- [T][事务提交标识:False\n]\n[2018/06/28 18:38:01.241][3670018] -- [T][影响到的笔数为:1]\n[2018/06/28 18:38:01.241][3670018] -- [T][出参0=1]\n[2018/06/28 18:38:01.241][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.241][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE7]\n[2018/06/28 18:38:01.241][3670018] -- [D][节点功能 更新操作流水表交易状态为成功]\n[2018/06/28 18:38:01.241][3670018] -- [T][入参0=[['tradestatus','1'],['banksystype','1'],['banksysdate','20180628'],['banksystime','183802'],['banksysseq','320099900N040007256'],['banksysstatus','0'],['banksyserrcode','S000A000'],['banksyserrmsg','交易成功']]]\n[2018/06/28 18:38:01.241][3670018] -- [T][入参1='20180628']\n[2018/06/28 18:38:01.241][3670018] -- [T][入参2='0023978992']\n[2018/06/28 18:38:01.241][3670018] -- [T][入参3=[['sysid','000003'],['tradebusistep','U']]]\n[2018/06/28 18:38:01.241][3670018] -- [T][入参4='0']\n[2018/06/28 18:38:01.241][3670018] -- [T][入参5=False]\n[2018/06/28 18:38:01.241][3670018] -- [T][数据库操作语句 : update rcc_mainaction set tradestatus='1',banksystype='1',banksysdate='20180628',banksystime='183802',banksysseq='320099900N040007256',banksysstatus='0',banksyserrcode='S000A000',banksyserrmsg='交易成功' where workdate='20180628' and agentserialno='0023978992' and sysid='000003'  and tradebusistep='U']\n[2018/06/28 18:38:01.241][3670018] -- [T][进入B_JSNX_execsql,输入参数信息:\n]\n[2018/06/28 18:38:01.241][3670018] -- [T][sql语句为:update rcc_mainaction set tradestatus='1',banksystype='1',banksysdate='20180628',banksystime='183802',banksysseq='320099900N040007256',banksysstatus='0',banksyserrcode='S000A000',banksyserrmsg='交易成功' where workdate='20180628' and agentserialno='0023978992' and sysid='000003'  and tradebusistep='U'\n]\n[2018/06/28 18:38:01.241][3670018] -- [T][事务提交标识:False\n]\n[2018/06/28 18:38:01.243][3670018] -- [T][影响到的笔数为:1]\n[2018/06/28 18:38:01.243][3670018] -- [T][出参0=1]\n[2018/06/28 18:38:01.243][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.243][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE8]\n[2018/06/28 18:38:01.243][3670018] -- [D][节点功能 设置成功信息]\n[2018/06/28 18:38:01.243][3670018] -- [D][入参0=__REQ__]\n[2018/06/28 18:38:01.243][3670018] -- [T][入参1=[['returnstatus','PR05'],['otxrejctcode',''],['otxrejctmsg','交易成功']]]\n[2018/06/28 18:38:01.243][3670018] -- [T][__RST__ = D]\n[2018/06/28 18:38:01.243][3670018] -- [T][__ECD__ = ]\n[2018/06/28 18:38:01.243][3670018] -- [T][__MSG__ = ]\n[2018/06/28 18:38:01.243][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.243][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE9]\n[2018/06/28 18:38:01.243][3670018] -- [D][节点功能 数据库提交]\n[2018/06/28 18:38:01.246][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.246][3670018] -- [D][调用具体实现节点 T713003_STEP5_NODE10]\n[2018/06/28 18:38:01.246][3670018] -- [D][节点功能 正常结束]\n[2018/06/28 18:38:01.246][3670018] -- [D][调用业务流程步骤 T713003_STEP6_IMPL]\n[2018/06/28 18:38:01.246][3670018] -- [D][步骤 6 功能 响应第三方]\n[2018/06/28 18:38:01.246][3670018] -- [D][调用具体实现节点 T713003_STEP6_NODE1]\n[2018/06/28 18:38:01.246][3670018] -- [D][节点功能 开始]\n[2018/06/28 18:38:01.246][3670018] -- [D][调用具体实现节点 T713003_STEP6_NODE2]\n[2018/06/28 18:38:01.246][3670018] -- [D][节点功能 默认逻辑错误委托]\n[2018/06/28 18:38:01.246][3670018] -- [T][将默认异常委托到 T713003_STEP6_NODE6 节点]\n[2018/06/28 18:38:01.246][3670018] -- [D][调用具体实现节点 T713003_STEP6_NODE3]\n[2018/06/28 18:38:01.246][3670018] -- [D][节点功能 组基础信息]\n[2018/06/28 18:38:01.247][3670018] -- [T][入参0={'TranChannelType': '07','Id2': '314305106644','MmbId2': '402301099998','MmbId1': '400584020008','Id1': '400584020008','BusinessKind': '09001','rcvMbrCd': '400584020008','refMsgCd': 'NPS.142.001.01','refCallTyp': 'ASYN','rcvAppCd': 'NPS','structType': 'XML','seqNb': '0034599116','BkTrxId': '','Postscript': '','callTyp': '','CreDtTm': '20180628183759','IntrBkSttlmAmt': '21.00','sndTm': '183759','refSndAppCd': 'NPS','BizSts': '','sndAppCd': 'MPS','OrgnlTxId': '201806290069999061','CardSeqId': '','StsId': 'PR01','MsgId': '201806290034599116','Remark': '31180628754515626217','Prtry2': 'D200','refSeqNb': '71445239','Prtry1': 'RJ90','MmbId3': '400584020008','OrgnlMsgNmId': 'NPS.142.001.01','Id3': '400584020008','OrgnlMsgId': '201806290069999061','sndMbrCd': '402301099998','SgnNo': '','mesgDirection': 'U','sndDt': '20180628','SttlmDt': '20180629','ICCData': '','refSndMbrCd': '400584020008','refSndDt': '20180628','AddtlInf': '业务其他错','msgCd': 'NPS.143.001.01','mesgPriority': '3','reserve': ''}]\n[2018/06/28 18:38:01.247][3670018] -- [T][入参1=[['StsId','PR05'],['Prtry1',''],['AddtlInf','交易成功'],['CardSeqId',''],['ICCData',''],['BkTrxId','201806290069999061'],['SgnNo','6230756801001054869']]]\n[2018/06/28 18:38:01.247][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.247][3670018] -- [D][调用具体实现节点 T713003_STEP6_NODE4]\n[2018/06/28 18:38:01.247][3670018] -- [D][节点功能 NATP通讯（交换）]\n[2018/06/28 18:38:01.247][3670018] -- [T][入参0={'TranChannelType': '07','Id2': '314305106644','MmbId2': '402301099998','MmbId1': '400584020008','Id1': '400584020008','BusinessKind': '09001','rcvMbrCd': '400584020008','refMsgCd': 'NPS.142.001.01','refCallTyp': 'ASYN','rcvAppCd': 'NPS','structType': 'XML','seqNb': '0034599116','BkTrxId': '201806290069999061','Postscript': '','callTyp': '','CreDtTm': '20180628183759','IntrBkSttlmAmt': '21.00','sndTm': '183759','refSndAppCd': 'NPS','BizSts': '','sndAppCd': 'MPS','OrgnlTxId': '201806290069999061','CardSeqId': '','StsId': 'PR05','MsgId': '201806290034599116','Remark': '31180628754515626217','Prtry2': 'D200','refSeqNb': '71445239','Prtry1': '','MmbId3': '400584020008','OrgnlMsgNmId': 'NPS.142.001.01','Id3': '400584020008','OrgnlMsgId': '201806290069999061','sndMbrCd': '402301099998','SgnNo': '6230756801001054869','mesgDirection': 'U','sndDt': '20180628','SttlmDt': '20180629','ICCData': '','refSndMbrCd': '400584020008','refSndDt': '20180628','AddtlInf': '交易成功','msgCd': 'NPS.143.001.01','mesgPriority': '3','reserve': ''}]\n[2018/06/28 18:38:01.247][3670018] -- [T][入参1='NPS.143.001.01']\n[2018/06/28 18:38:01.247][3670018] -- [D][入参2=__REQ__]\n[2018/06/28 18:38:01.247][3670018] -- [T][afacfg get ip]\n[2018/06/28 18:38:01.248][3670018] -- [T][===数据查询SQL执行耗时:[0.001]秒]\n[2018/06/28 18:38:01.248][3670018] -- [T][农信银MFE编号为: B]\n[2018/06/28 18:38:01.249][3670018] -- [T][===数据查询SQL执行耗时:[0.001]秒]\n[2018/06/28 18:38:01.249][3670018] -- [T][查找第三方IP配置表SQL:select toafeip,toafeport,outtime from afa_afatoafe where sysid = '000003',返回值：1]\n[2018/06/28 18:38:01.249][3670018] -- [T][argHost:32.3.193.225]\n[2018/06/28 18:38:01.249][3670018] -- [T][argPort:20026]\n[2018/06/28 18:38:01.249][3670018] -- [T][argTimeout:60]\n[2018/06/28 18:38:01.265][3670018] -- [T][===NATP交换耗时:[0.015]秒]\n[2018/06/28 18:38:01.265][3670018] -- [T][交换通讯状态为：[0, '']]\n[2018/06/28 18:38:01.265][3670018] -- [T][出参0={'__RCV__': ']\n[2018/06/28 18:38:01.265][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用具体实现节点 T713003_STEP6_NODE5]\n[2018/06/28 18:38:01.265][3670018] -- [D][节点功能 正常结束]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用内建函数 ACMP_Builtin_CheckResponse]\n[2018/06/28 18:38:01.265][3670018] -- [D][结束交易 713003]\n[2018/06/28 18:38:01.265][3670018] -- [T][ret:True]\n[2018/06/28 18:38:01.265][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用具体实现节点 T103003_STEP1_NODE39]\n[2018/06/28 18:38:01.265][3670018] -- [D][节点功能 异常结束]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用业务流程步骤 T103003_STEP5_IMPL]\n[2018/06/28 18:38:01.265][3670018] -- [D][步骤 5 功能 组织第三方响应信息]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用具体实现节点 T103003_STEP5_NODE1]\n[2018/06/28 18:38:01.265][3670018] -- [D][节点功能 开始]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用具体实现节点 T103003_STEP5_NODE2]\n[2018/06/28 18:38:01.265][3670018] -- [D][节点功能 默认逻辑错误委托]\n[2018/06/28 18:38:01.265][3670018] -- [T][将默认异常委托到 T103003_STEP5_NODE6 节点]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用具体实现节点 T103003_STEP5_NODE11]\n[2018/06/28 18:38:01.265][3670018] -- [D][节点功能 判断是否贷记卡]\n[2018/06/28 18:38:01.265][3670018] -- [T][入参0=False]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:38:01.265][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:38:01.265][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用具体实现节点 T103003_STEP5_NODE8]\n[2018/06/28 18:38:01.265][3670018] -- [D][节点功能 苏南标志判断]\n[2018/06/28 18:38:01.265][3670018] -- [T][入参0=True]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:38:01.265][3670018] -- [D][argBOOL=True]\n[2018/06/28 18:38:01.265][3670018] -- [D][逻辑返回值=1]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用具体实现节点 T103003_STEP5_NODE10]\n[2018/06/28 18:38:01.265][3670018] -- [D][节点功能 判断苏南业务是否关闭]\n[2018/06/28 18:38:01.265][3670018] -- [T][入参0=False]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用虚拟组件 ACMP_Builtin_BoolFrame]\n[2018/06/28 18:38:01.265][3670018] -- [D][argBOOL=False]\n[2018/06/28 18:38:01.265][3670018] -- [D][逻辑返回值=0]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用具体实现节点 T103003_STEP5_NODE9]\n[2018/06/28 18:38:01.265][3670018] -- [D][节点功能 正常结束]\n[2018/06/28 18:38:01.265][3670018] -- [D][调用内建函数 ACMP_Builtin_CheckResponse]\n[2018/06/28 18:38:01.265][3670018] -- [D][结束交易 103003]\n[2018/06/28 18:38:01.265][3670018] -- [T][CalculateTime:本次交易耗时[1]秒[467]毫秒]\n[2018/06/28 18:38:01.266][3670018] -- [T][=============监控数据抽取开始==============]\n[2018/06/28 18:38:01.267][3670018] -- [T][===数据查询SQL执行耗时:[0.001]秒]\n[2018/06/28 18:38:01.267][3670018] -- [T][日期：20180628]\n[2018/06/28 18:38:01.267][3670018] -- [T][流水：0023978992]\n[2018/06/28 18:38:01.271][3670018] -- [T][===数据查询SQL执行耗时:[0.003]秒]\n[2018/06/28 18:38:01.271][3670018] -- [T][{\"code\": \"S000A000\", \"STAND2\": \"\", \"STAND1\": \"\", \"payeraccbank\": \"\", \"channelcode\": \"07\", \"sysid\": \"000003\", \"agentserialno\": \"0023978992\", \"TRANSCODE\": \"103003\", \"BEGINTIME\": \"18:37:59\", \"querybank\": \"\", \"thirdsyserrmsg\": \"\", \"sendbank\": \"400584020008\", \"banksyserrmsg\": \"涓绘満璁拌处鎴愬姛锛�\", \"WORKTIME\": \"1467ms\", \"amount\": \"21.00\", \"msgflag\": \"\", \"errorcode\": \"\", \"batstat\": \"\", \"replybank\": \"\", \"recvbank\": \"314305106644\", \"ENDTIME\": \"18:38:01\", \"mbflag\": \"1\", \"status\": \"COMPLETE\", \"payeeacc1\": \"\", \"workdate\": \"20180628\", \"g_code\": \"\", \"payeeaccbank\": \"\", \"terminalno\": \"\", \"payeracc1\": \"\", \"tellerno\": \"320099900N04\", \"payeeacc\": \"0158401100000011\", \"payeracc\": \"6230756801001054869\", \"tradestatus\": \"2\", \"brno\": \"320099900\", \"desc\": \"浜ゆ槗鎴愬姛\", \"banksysstatus\": \"0\", \"WORKGROUP\": \"000003\", \"errormsg\": \"\", \"errcode\": \"000000\", \"pkgno\": \"30\", \"cardtype\": \"\", \"g_desc\": \"\", \"LOGNAME\": \"P103003_D0628_C2_Q0_N13@32.1.34.4.log\", \"thirdsyserrcode\": \"\", \"IPADDRESS\": \"32.1.34.4.G06.C0.I002\", \"agentmsgno\": \"\"}]",
					"timestamp": "2018-06-28T18:37:59.880Z",
					"process_id": 3670018,
					"status": "D",
					"service_id": "00010000803800",
					"service_sn": "1800239789929180628",
					"service_time": "20180628183801",
					"inm_teller_id": "320099900N04",
					"acct_no": "",
					"reply_qmgr": "ESB_AFAIN04",
					"svc_resp_code": "S000A000",
					"svc_resp_status": "COMPLETE",
					"channel_code": "0001",
					"transcode": "803800",
					"org_code": 320099900,
					"channel_type": "N",
					"teller_no": "04",
					"@rule_alias": "AFA",
					"@store_name": "afa",
					"@rule_name": "afa_log",
					"@linenum": 61822
				},}]
            }
        }
        test();
        function test(){

            var items = [];
            var data = jsondata.hits;
            if(data){
                var preRqt = null;
                var preEsbRqt = null;
                var preEsbRsp = null;
                var preRsp = null;
                var afa = null;
                data.hits.sort(function (a, b) {
                    var ta = moment(a._source['timestamp'])._d.getTime();
                    var tb = moment(b._source['timestamp'])._d.getTime();
                    return ta > tb;
                }).map(function(h){
                    var data = h._source;
                    var item = {};
                    item['timestamp'] = data['timestamp'];
                    var raw = data['@message'];
                    var rawName = raw.match(new RegExp("\<name\>(.*)\<\/name\>"));
                    var afaId = raw.match(new RegExp("\<requester_id\>(.*)\<\/requester_id\>"));
                    var rawType = data['@store_name'];
                    console.log(rawName,rawType);
                    if(rawType == 'esb'){
                        // var rawName = raw.match(new RegExp("\<name\>(.*)\<\/name\>"));
                        var rqt_servicesn = data['rqt_servicesn'];
                    var rsp_trace_servicesn = data['rsp_trace_servicesn'];
                    var rsp_subservicesn = data['rsp_subservicesn'];
                    var rqt_trace_subservicesn = data['rqt_trace_subservicesn'];

                    var rqt_trace_status = data['rqt_trace_status'];
                    var rsp_trace_status = data['rsp_trace_status'];
                    if(rqt_servicesn){
                        item['title'] = data['rqt_requesterid'] + '请求ESB'
                        item['code'] = data['rqt_trade_id'];
                        preRqt = item;
                    }else if(rqt_trace_subservicesn) {
                        item['title'] = 'ESB请求' +  data['rqt_trace_receiver_id'] 
                        item['ngclass'] = 'track-warning';
                        item['status'] = rqt_trace_status;
                        preEsbRqt = item;
                    }else if(rsp_subservicesn) {
                        item['title'] =  data['rsp_receiver_id']  + '返回ESB'    
                        item['ngclass'] = 'track-warning';
                        item['code'] = data['rsp_code'];
                        item['status'] = data['rsp_desc'] ;
                        var rawTime = null;
                        if (null == rawTime) {
                            var t1 = moment(preEsbRqt['timestamp'])._d.getTime();
                            var t2 = moment(item['timestamp'])._d.getTime();
                            rawTime = t2 - t1;
                        }
                        preEsbRsp = item;
                        
                    }else if(rsp_trace_servicesn) {
                        item['title'] =   'ESB返回' + data['rsp_trace_requester_id'] 
                        item['status'] = rsp_trace_status;
                        item['code'] = data['rsp_trace_trade_id']
                        var rawTime = null;
                        if (null == rawTime) {
                            var t1 = moment(preRqt['timestamp'])._d.getTime();
                            var t2 = moment(item['timestamp'])._d.getTime();
                            rawTime = t2 - t1;
                        }
                        preRsp = item;   
                    }
                    item['category'] = rawName ? rawName[1] : '';

                    }


                    if(rawType == 'afa'){
                        // var afaId = raw.match(new RegExp("\<requester_id\>(.*)\<\/requester_id\>"));
                         var svc_resp_status = data['svc_resp_status'];
                         var svc_resp_code = data['svc_resp_code'];
                        item['title'] = '请求ID:'+ afaId[1]; 
                        item['ngclass'] = 'track-success';
                        item['status'] = svc_resp_status;
                        item['code'] = svc_resp_code;
                        // var rawTime = null;
                        // if (null == rawTime) {
                        //     var t1 = moment(preRqt['timestamp'])._d.getTime();
                        //     var t2 = moment(item['timestamp'])._d.getTime();
                        //     rawTime = t2 - t1;
                        // }
                        afa = item;
                    }
                   
                    

                    // item['category'] = rawName ? rawName[1] : '';
                    item['used_time'] = rawTime ? (rawTime + 'ms') : item['timestamp']; 
                    item['xml'] = raw;
                    return item;
                }).map(function (item) {
                    items.push(item);
                })


                vm.items = items;
            }
        }

        vm.sns = { 'service_sn': '1800239789929180628', 'service_id': '00010000803800' }
        vm.refresh = refresh;
        vm.loadAll = loadAll;
        if (vm.sns.service_sn && vm.sns.service_id) {
            //    vm.loadAll();
        }
        function loadAll() {
            test();
            // var items = [];
            // ApplicationService.getSns2('getSns2', vm.sns).then(function (d) {
            //     var data = d.data.hits;
            //     // console.log(data)
            //     if (data.hits) {
            //         var preRqt = null;
            //         var preEsbRqt = null;
            //         var preEsbRsp = null;
            //         var preRsp = null;
            //         var afa = null;
            //         data.hits.sort(function (a, b) {
            //             var ta = moment(a._source['timestamp'])._d.getTime();
            //             var tb = moment(b._source['timestamp'])._d.getTime();
            //             return ta > tb;
            //         }).map(function(h){
            //             var data = h._source;
            //             var item = {};
            //             item['timestamp'] = data['timestamp'];
            //             var raw = data['@message'];
            //             var rawName = raw.match(new RegExp("\<name\>(.*)\<\/name\>"));
            //             var afaId = raw.match(new RegExp("\<requester_id\>(.*)\<\/requester_id\>"));
            //             var rawType = data['@store_name'];
    
            //             if(rawType == 'esb'){
            //                 var rqt_servicesn = data['rqt_servicesn'];
            //             var rsp_trace_servicesn = data['rsp_trace_servicesn'];
            //             var rsp_subservicesn = data['rsp_subservicesn'];
            //             var rqt_trace_subservicesn = data['rqt_trace_subservicesn'];
    
            //             var rqt_trace_status = data['rqt_trace_status'];
            //             var rsp_trace_status = data['rsp_trace_status'];
            //             if(rqt_servicesn){
            //                 item['title'] = data['rqt_requesterid'] + '请求ESB'
            //                 preRqt = item;
            //             }else if(rqt_trace_subservicesn) {
            //                 item['title'] = 'ESB请求' +  data['rqt_trace_receiver_id'] 
            //                 item['ngclass'] = 'track-warning';
            //                 item['status'] = rqt_trace_status;
            //                 preEsbRqt = item;
            //             }else if(rsp_subservicesn) {
            //                 item['title'] =  data['rsp_receiver_id']  + '返回ESB'    
            //                 item['ngclass'] = 'track-warning';
            //                 item['code'] = data['rsp_code'];
            //                 var rawTime = null;
            //                 if (null == rawTime) {
            //                     var t1 = moment(preEsbRqt['timestamp'])._d.getTime();
            //                     var t2 = moment(item['timestamp'])._d.getTime();
            //                     rawTime = t2 - t1;
            //                 }
            //                 preEsbRsp = item;
                            
            //             }else if(rsp_trace_servicesn) {
            //                 item['title'] =   'ESB返回' + data['rsp_trace_requester_id'] 
            //                 item['status'] = rsp_trace_status;
            //                 item['code'] = data['rsp_trace_trade_id']
            //                 var rawTime = null;
            //                 if (null == rawTime) {
            //                     var t1 = moment(preRqt['timestamp'])._d.getTime();
            //                     var t2 = moment(item['timestamp'])._d.getTime();
            //                     rawTime = t2 - t1;
            //                 }
            //                 preRsp = item;   
            //             }
            //             item['category'] = rawName ? rawName[1] : '';
            //             }
    
    
            //             if(rawType == 'afa'){
            //                  var svc_resp_status = data['svc_resp_status'];
            //                  var svc_resp_code = data['svc_resp_code'];
            //                 item['title'] = '请求ID:'+ afaId[1]; 
            //                 item['ngclass'] = 'track-success';
            //                 item['status'] = svc_resp_status;
            //                 item['code'] = svc_resp_code;
            //                 afa = item;
            //             }
                       
                        
    
            //             // item['category'] = rawName ? rawName[1] : '未识别';
            //             item['used_time'] = rawTime ? (rawTime + 'ms') : ''; 
            //             item['xml'] = raw;
            //             return item;
            //         }).map(function (item) {
            //             items.push(item);
            //         })
    
    
            //         vm.items = items;
            //     }
            // });

            /*
            vm.items = [
                {'category':'核心银行','used_time':'285ms','title':'小标题'
                    ,'ngclass':'track-danger','xml':[]},
                {'category':'ESB','used_time':'162ms','title':'小标题'
                    ,'ngclass':'track-warning','xml':[]},
                {'category':'网上银行','used_time':'101ms','title':'小标题'
                    ,'ngclass':'','xml':[]}
            ];
            */

            // vm.items = items;

        }

        function refresh() {

        }

        vm.ptdata = [];
        vm.popoverTemplate = function (item) {
            vm.ptdata = item;
        }
    }
})();
