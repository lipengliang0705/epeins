
(function () {
    'use strict';

    var utils = angular.module('mu-utils', []);
    utils.factory('DataUtil', DataUtil);

    DataUtil.$inject = ['$http', '$q', 'ResultHandler', 'DataStore', 'EsService', 'AlarmInfoService', '$filter'];
    //data util
    function DataUtil($http, $q, ResultHandler, DataStore, EsService, AlarmInfoService, $filter) {

        function getRandomNum(floor, range) {
            return Math.round(Math.random() * range) + floor; 
        }

        var sampleData = [
            {month:'一月', income: 13890, outcome:9090},
            {month:'二月', income: 15640, outcome:12430},
            {month:'三月', income: 17330, outcome:13870},
            {month:'四月', income: 14980, outcome:9700},
            {month:'五月', income: 13200, outcome:8900},
            {month:'六月', income: 17140, outcome:12980},
            {month:'七月', income: 18900, outcome:12340},
            {month:'八月', income: 20670, outcome:13950},
            {month:'九月', income: 16870, outcome:10600},
            {month:'十月', income: 17780, outcome:11300},
            {month:'十一月', income: 19800, outcome:15010},
            {month:'十二月', income: 16820, outcome:12090}
        ];

        var sampleData2 = 
            [
            {"代码":"sz161217","名称":"国投资源","最新价":"0.717","涨跌额":"0.01","涨跌幅":"1.41%","买入":"0.717","卖出":"0.72","昨收":"0.707","今开":"0.711","最高":"0.722","最低":"0.711","成交量/手":"3,595","成交额/万":"25.81"},
            {"代码":"sz161210","名称":"国投新兴","最新价":"0.989","涨跌额":"0.004","涨跌幅":"0.41%","买入":"0.989","卖出":"0.99","昨收":"0.985","今开":"0.987","最高":"0.989","最低":"0.987","成交量/手":"279","成交额/万":"2.76"},
            {"代码":"sz161129","名称":"原油基金","最新价":"0.84","涨跌额":"-0.002","涨跌幅":"-0.24%","买入":"0.84","卖出":"0.842","昨收":"0.842","今开":"0.843","最高":"0.843","最低":"0.84","成交量/手":"959","成交额/万":"8.08"},
            {"代码":"sz161128","名称":"标普科技","最新价":"1.11","涨跌额":"0.026","涨跌幅":"2.40%","买入":"1.1","卖出":"1.11","昨收":"1.084","今开":"1.095","最高":"1.11","最低":"1.094","成交量/手":"1,296","成交额/万":"14.24"},
            {"代码":"sz161127","名称":"标普生物","最新价":"1.185","涨跌额":"0.008","涨跌幅":"0.68%","买入":"1.181","卖出":"1.185","昨收":"1.177","今开":"1.18","最高":"1.188","最低":"1.178","成交量/手":"1,480","成交额/万":"17.52"},
            {"代码":"sz161126","名称":"标普医药","最新价":"1.132","涨跌额":"0.007","涨跌幅":"0.62%","买入":"1.124","卖出":"1.132","昨收":"1.125","今开":"1.145","最高":"1.145","最低":"1.13","成交量/手":"238","成交额/万":"2.7"},
            {"代码":"sz161125","名称":"标普500","最新价":"1.04","涨跌额":"0.007","涨跌幅":"0.68%","买入":"1.038","卖出":"1.04","昨收":"1.033","今开":"1.035","最高":"1.041","最低":"1.035","成交量/手":"13,860","成交额/万":"143.98"},
            {"代码":"sz161124","名称":"香港小盘","最新价":"1.05","涨跌额":"0.007","涨跌幅":"0.67%","买入":"1.048","卖出":"1.052","昨收":"1.043","今开":"1.043","最高":"1.052","最低":"1.043","成交量/手":"2,630","成交额/万":"27.6"},
            {"代码":"sz161116","名称":"易基黄金","最新价":"0.717","涨跌额":"0","涨跌幅":"0.00%","买入":"0.716","卖出":"0.717","昨收":"0.717","今开":"0.717","最高":"0.718","最低":"0.716","成交量/手":"7,849","成交额/万":"56.25"},
            {"代码":"sz161037","名称":"高端制造","最新价":"1.042","涨跌额":"0.004","涨跌幅":"0.39%","买入":"1.043","卖出":"1.047","昨收":"1.038","今开":"1.038","最高":"1.043","最低":"1.037","成交量/手":"960","成交额/万":"9.97"},
            {"代码":"sz161036","名称":"娱乐增强","最新价":"0.941","涨跌额":"0.009","涨跌幅":"0.97%","买入":"0.934","卖出":"0.941","昨收":"0.932","今开":"0.941","最高":"0.941","最低":"0.941","成交量/手":"114","成交额/万":"1.07"},
            {"代码":"sz161033","名称":"智能汽车","最新价":"1.019","涨跌额":"0.017","涨跌幅":"1.70%","买入":"1.012","卖出":"1.019","昨收":"1.002","今开":"1.006","最高":"1.022","最低":"1.006","成交量/手":"285","成交额/万":"2.87"},
            {"代码":"sz161017","名称":"富国500","最新价":"2.135","涨跌额":"-0.034","涨跌幅":"-1.57%","买入":"2.135","卖出":"2.138","昨收":"2.169","今开":"2.162","最高":"2.162","最低":"2.114","成交量/手":"741","成交额/万":"15.84"},
            {"代码":"sz161005","名称":"富国天惠","最新价":"1.866","涨跌额":"0.009","涨跌幅":"0.49%","买入":"1.854","卖出":"1.866","昨收":"1.857","今开":"1.857","最高":"1.87","最低":"1.852","成交量/手":"1,159","成交额/万":"21.57"},
            {"代码":"sz160922","名称":"恒生中小","最新价":"1.053","涨跌额":"0.01","涨跌幅":"0.96%","买入":"1.048","卖出":"1.054","昨收":"1.043","今开":"1.048","最高":"1.054","最低":"1.048","成交量/手":"1,124","成交额/万":"11.82"},
            {"代码":"sz160919","名称":"大成产业","最新价":"1.181","涨跌额":"0.002","涨跌幅":"0.17%","买入":"1.179","卖出":"1.183","昨收":"1.179","今开":"1.172","最高":"1.181","最低":"1.172","成交量/手":"898","成交额/万":"10.57"},
            {"代码":"sz160918","名称":"大成小盘","最新价":"1.817","涨跌额":"0.012","涨跌幅":"0.67%","买入":"1.815","卖出":"1.817","昨收":"1.805","今开":"1.818","最高":"1.825","最低":"1.816","成交量/手":"975","成交额/万":"17.74"},
            {"代码":"sz160916","名称":"优选LOF","最新价":"2.46","涨跌额":"0.009","涨跌幅":"0.37%","买入":"2.456","卖出":"2.46","昨收":"2.451","今开":"2.46","最高":"2.465","最低":"2.451","成交量/手":"2,125","成交额/万":"52.26"},
            {"代码":"sz160910","名称":"大成创新","最新价":"1.055","涨跌额":"0.001","涨跌幅":"0.10%","买入":"1.055","卖出":"1.074","昨收":"1.054","今开":"1.054","最高":"1.076","最低":"1.054","成交量/手":"215","成交额/万":"2.27"},
            {"代码":"sz160813","名称":"长盛同盛","最新价":"0.794","涨跌额":"0.006","涨跌幅":"0.76%","买入":"0.794","卖出":"0.797","昨收":"0.788","今开":"0.791","最高":"0.795","最低":"0.791","成交量/手":"1,423","成交额/万":"11.3"},
            {"代码":"sz160812","名称":"长盛同益","最新价":"1.446","涨跌额":"0.006","涨跌幅":"0.42%","买入":"1.441","卖出":"1.446","昨收":"1.44","今开":"1.449","最高":"1.454","最低":"1.442","成交量/手":"1,093","成交额/万":"15.83"},
            {"代码":"sz160810","名称":"长盛同丰","最新价":"1.193","涨跌额":"0.002","涨跌幅":"0.17%","买入":"1.192","卖出":"1.194","昨收":"1.191","今开":"1.193","最高":"1.193","最低":"1.193","成交量/手":"1","成交额/万":"0.01"},
            {"代码":"sz160807","名称":"长盛300","最新价":"1.214","涨跌额":"0.003","涨跌幅":"0.25%","买入":"1.213","卖出":"1.219","昨收":"1.211","今开":"1.214","最高":"1.214","最低":"1.214","成交量/手":"1","成交额/万":"0.01"},
            {"代码":"sz160805","名称":"长盛同智","最新价":"0.814","涨跌额":"-0.007","涨跌幅":"-0.85%","买入":"0.814","卖出":"0.827","昨收":"0.821","今开":"0.833","最高":"0.833","最低":"0.81","成交量/手":"54","成交额/万":"0.44"},
            {"代码":"sz160723","名称":"嘉实原油","最新价":"0.901","涨跌额":"-0.009","涨跌幅":"-0.99%","买入":"0.901","卖出":"0.904","昨收":"0.91","今开":"0.902","最高":"0.905","最低":"0.901","成交量/手":"328","成交额/万":"2.96"},
            {"代码":"sz160720","名称":"中期企债","最新价":"1.122","涨跌额":"0.006","涨跌幅":"0.54%","买入":"0","卖出":"1.123","昨收":"1.116","今开":"1.122","最高":"1.122","最低":"1.122","成交量/手":"1","成交额/万":"0.01"},
            {"代码":"sz160719","名称":"嘉实黄金","最新价":"0.705","涨跌额":"0","涨跌幅":"0.00%","买入":"0.705","卖出":"0.706","昨收":"0.705","今开":"0.706","最高":"0.706","最低":"0.684","成交量/手":"5,764","成交额/万":"40.62"},
            {"代码":"sz160717","名称":"恒生H股","最新价":"0.799","涨跌额":"0.009","涨跌幅":"1.14%","买入":"0.798","卖出":"0.799","昨收":"0.79","今开":"0.799","最高":"0.801","最低":"0.795","成交量/手":"29,162","成交额/万":"232.92"},
            {"代码":"sz160716","名称":"嘉实50","最新价":"1.425","涨跌额":"0.012","涨跌幅":"0.85%","买入":"1.424","卖出":"1.425","昨收":"1.413","今开":"1.406","最高":"1.425","最低":"1.406","成交量/手":"3,083","成交额/万":"43.79"},
            {"代码":"sz160706","名称":"嘉实 300","最新价":"1.052","涨跌额":"0.009","涨跌幅":"0.86%","买入":"1.052","卖出":"1.053","昨收":"1.043","今开":"1.043","最高":"1.053","最低":"1.043","成交量/手":"17,438","成交额/万":"183.06"},
            {"代码":"sz160643","名称":"空天一体","最新价":"1","涨跌额":"0.011","涨跌幅":"1.11%","买入":"1","卖出":"1.012","昨收":"0.989","今开":"0.992","最高":"1.088","最低":"0.992","成交量/手":"5,033","成交额/万":"50.33"},
            {"代码":"sz160635","名称":"医药基金","最新价":"1.01","涨跌额":"0","涨跌幅":"0.00%","买入":"1.01","卖出":"1.011","昨收":"1.01","今开":"0.999","最高":"1.01","最低":"0.999","成交量/手":"534","成交额/万":"5.4"},
            {"代码":"sz160616","名称":"鹏华500","最新价":"1.295","涨跌额":"0.003","涨跌幅":"0.23%","买入":"1.286","卖出":"1.294","昨收":"1.292","今开":"1.285","最高":"1.295","最低":"1.278","成交量/手":"48","成交额/万":"0.62"},
            {"代码":"sz160615","名称":"鹏华300","最新价":"1.465","涨跌额":"0.003","涨跌幅":"0.21%","买入":"1.465","卖出":"1.468","昨收":"1.462","今开":"1.462","最高":"1.467","最低":"1.462","成交量/手":"205","成交额/万":"3"},
            {"代码":"sz160613","名称":"鹏华创新","最新价":"1.367","涨跌额":"-0.013","涨跌幅":"-0.94%","买入":"1.369","卖出":"1.379","昨收":"1.38","今开":"1.369","最高":"1.369","最低":"1.367","成交量/手":"24","成交额/万":"0.33"},
            {"代码":"sz160611","名称":"鹏华治理","最新价":"0.83","涨跌额":"0.005","涨跌幅":"0.61%","买入":"0.827","卖出":"0.83","昨收":"0.825","今开":"0.824","最高":"0.83","最低":"0.824","成交量/手":"57","成交额/万":"0.47"},
            {"代码":"sz160610","名称":"鹏华动力","最新价":"1.043","涨跌额":"-0.006","涨跌幅":"-0.57%","买入":"1.043","卖出":"1.048","昨收":"1.049","今开":"1.033","最高":"1.049","最低":"1.033","成交量/手":"215","成交额/万":"2.24"}
            ];

        var geoCoordMap = {
            "海门":[121.15,31.89],
            "鄂尔多斯":[109.781327,39.608266],
            "招远":[120.38,37.35],
            "舟山":[122.207216,29.985295],
            "齐齐哈尔":[123.97,47.33],
            "盐城":[120.13,33.38],
            "赤峰":[118.87,42.28],
            "青岛":[120.33,36.07],
            "乳山":[121.52,36.89],
            "金昌":[102.188043,38.520089],
            "泉州":[118.58,24.93],
            "莱西":[120.53,36.86],
            "日照":[119.46,35.42],
            "胶南":[119.97,35.88],
            "南通":[121.05,32.08],
            "拉萨":[91.11,29.97],
            "云浮":[112.02,22.93],
            "梅州":[116.1,24.55],
            "文登":[122.05,37.2],
            "上海":[121.48,31.22],
            "攀枝花":[101.718637,26.582347],
            "威海":[122.1,37.5],
            "承德":[117.93,40.97],
            "厦门":[118.1,24.46],
            "汕尾":[115.375279,22.786211],
            "潮州":[116.63,23.68],
            "丹东":[124.37,40.13],
            "太仓":[121.1,31.45],
            "曲靖":[103.79,25.51],
            "烟台":[121.39,37.52],
            "福州":[119.3,26.08],
            "瓦房店":[121.979603,39.627114],
            "即墨":[120.45,36.38],
            "抚顺":[123.97,41.97],
            "玉溪":[102.52,24.35],
            "张家口":[114.87,40.82],
            "阳泉":[113.57,37.85],
            "莱州":[119.942327,37.177017],
            "湖州":[120.1,30.86],
            "汕头":[116.69,23.39],
            "昆山":[120.95,31.39],
            "宁波":[121.56,29.86],
            "湛江":[110.359377,21.270708],
            "揭阳":[116.35,23.55],
            "荣成":[122.41,37.16],
            "连云港":[119.16,34.59],
            "葫芦岛":[120.836932,40.711052],
            "常熟":[120.74,31.64],
            "东莞":[113.75,23.04],
            "河源":[114.68,23.73],
            "淮安":[119.15,33.5],
            "泰州":[119.9,32.49],
            "南宁":[108.33,22.84],
            "营口":[122.18,40.65],
            "惠州":[114.4,23.09],
            "江阴":[120.26,31.91],
            "蓬莱":[120.75,37.8],
            "韶关":[113.62,24.84],
            "嘉峪关":[98.289152,39.77313],
            "广州":[113.23,23.16],
            "延安":[109.47,36.6],
            "太原":[112.53,37.87],
            "清远":[113.01,23.7],
            "中山":[113.38,22.52],
            "昆明":[102.73,25.04],
            "寿光":[118.73,36.86],
            "盘锦":[122.070714,41.119997],
            "长治":[113.08,36.18],
            "深圳":[114.07,22.62],
            "珠海":[113.52,22.3],
            "宿迁":[118.3,33.96],
            "咸阳":[108.72,34.36],
            "铜川":[109.11,35.09],
            "平度":[119.97,36.77],
            "佛山":[113.11,23.05],
            "海口":[110.35,20.02],
            "江门":[113.06,22.61],
            "章丘":[117.53,36.72],
            "肇庆":[112.44,23.05],
            "大连":[121.62,38.92],
            "临汾":[111.5,36.08],
            "吴江":[120.63,31.16],
            "石嘴山":[106.39,39.04],
            "沈阳":[123.38,41.8],
            "苏州":[120.62,31.32],
            "茂名":[110.88,21.68],
            "嘉兴":[120.76,30.77],
            "长春":[125.35,43.88],
            "胶州":[120.03336,36.264622],
            "银川":[106.27,38.47],
            "张家港":[120.555821,31.875428],
            "三门峡":[111.19,34.76],
            "锦州":[121.15,41.13],
            "南昌":[115.89,28.68],
            "柳州":[109.4,24.33],
            "三亚":[109.511909,18.252847],
            "自贡":[104.778442,29.33903],
            "吉林":[126.57,43.87],
            "阳江":[111.95,21.85],
            "泸州":[105.39,28.91],
            "西宁":[101.74,36.56],
            "宜宾":[104.56,29.77],
            "呼和浩特":[111.65,40.82],
            "成都":[104.06,30.67],
            "大同":[113.3,40.12],
            "镇江":[119.44,32.2],
            "桂林":[110.28,25.29],
            "张家界":[110.479191,29.117096],
            "宜兴":[119.82,31.36],
            "北海":[109.12,21.49],
            "西安":[108.95,34.27],
            "金坛":[119.56,31.74],
            "东营":[118.49,37.46],
            "牡丹江":[129.58,44.6],
            "遵义":[106.9,27.7],
            "绍兴":[120.58,30.01],
            "扬州":[119.42,32.39],
            "常州":[119.95,31.79],
            "潍坊":[119.1,36.62],
            "重庆":[106.54,29.59],
            "台州":[121.420757,28.656386],
            "南京":[118.78,32.04],
            "滨州":[118.03,37.36],
            "贵阳":[106.71,26.57],
            "无锡":[120.29,31.59],
            "本溪":[123.73,41.3],
            "克拉玛依":[84.77,45.59],
            "渭南":[109.5,34.52],
            "马鞍山":[118.48,31.56],
            "宝鸡":[107.15,34.38],
            "焦作":[113.21,35.24],
            "句容":[119.16,31.95],
            "北京":[116.46,39.92],
            "徐州":[117.2,34.26],
            "衡水":[115.72,37.72],
            "包头":[110,40.58],
            "绵阳":[104.73,31.48],
            "乌鲁木齐":[87.68,43.77],
            "枣庄":[117.57,34.86],
            "杭州":[120.19,30.26],
            "淄博":[118.05,36.78],
            "鞍山":[122.85,41.12],
            "溧阳":[119.48,31.43],
            "库尔勒":[86.06,41.68],
            "安阳":[114.35,36.1],
            "开封":[114.35,34.79],
            "济南":[117,36.65],
            "德阳":[104.37,31.13],
            "温州":[120.65,28.01],
            "九江":[115.97,29.71],
            "邯郸":[114.47,36.6],
            "临安":[119.72,30.23],
            "兰州":[103.73,36.03],
            "沧州":[116.83,38.33],
            "临沂":[118.35,35.05],
            "南充":[106.110698,30.837793],
            "天津":[117.2,39.13],
            "富阳":[119.95,30.07],
            "泰安":[117.13,36.18],
            "诸暨":[120.23,29.71],
            "郑州":[113.65,34.76],
            "哈尔滨":[126.63,45.75],
            "聊城":[115.97,36.45],
            "芜湖":[118.38,31.33],
            "唐山":[118.02,39.63],
            "平顶山":[113.29,33.75],
            "邢台":[114.48,37.05],
            "德州":[116.29,37.45],
            "济宁":[116.59,35.38],
            "荆州":[112.239741,30.335165],
            "宜昌":[111.3,30.7],
            "义乌":[120.06,29.32],
            "丽水":[119.92,28.45],
            "洛阳":[112.44,34.7],
            "秦皇岛":[119.57,39.95],
            "株洲":[113.16,27.83],
            "石家庄":[114.48,38.03],
            "莱芜":[117.67,36.19],
            "常德":[111.69,29.05],
            "保定":[115.48,38.85],
            "湘潭":[112.91,27.87],
            "金华":[119.64,29.12],
            "岳阳":[113.09,29.37],
            "长沙":[113,28.21],
            "衢州":[118.88,28.97],
            "廊坊":[116.7,39.53],
            "菏泽":[115.480656,35.23375],
            "合肥":[117.27,31.86],
            "武汉":[114.31,30.52],
            "大庆":[125.03,46.58]
        };

        var geoData = [
             {name: '海门', value: 9},
             {name: '鄂尔多斯', value: 12},
             {name: '招远', value: 12},
             {name: '舟山', value: 12},
             {name: '齐齐哈尔', value: 14},
             {name: '盐城', value: 15},
             {name: '拉萨', value: 24},
             {name: '云浮', value: 24},
             {name: '梅州', value: 25},
             {name: '文登', value: 25},
             {name: '上海', value: 25},
             {name: '攀枝花', value: 25},
             {name: '威海', value: 25},
             {name: '承德', value: 25},
             {name: '汕头', value: 32},
             {name: '昆山', value: 33},
             {name: '宁波', value: 33},
             {name: '湛江', value: 33},
             {name: '揭阳', value: 34},
             {name: '荣成', value: 34},
             {name: '连云港', value: 35},
             {name: '葫芦岛', value: 35},
             {name: '常熟', value: 36},
             {name: '东莞', value: 36},
             {name: '河源', value: 36},
             {name: '淮安', value: 36},
             {name: '泰州', value: 36},
             {name: '南宁', value: 37},
             {name: '宿迁', value: 43},
             {name: '咸阳', value: 43},
             {name: '铜川', value: 44},
             {name: '平度', value: 44},
             {name: '佛山', value: 44},
             {name: '海口', value: 44},
             {name: '江门', value: 45},
             {name: '章丘', value: 45},
             {name: '肇庆', value: 46},
             {name: '大连', value: 47},
             {name: '临汾', value: 47},
             {name: '张家港', value: 52},
             {name: '三门峡', value: 53},
             {name: '锦州', value: 54},
             {name: '南昌', value: 54},
             {name: '柳州', value: 54},
             {name: '三亚', value: 54},
             {name: '自贡', value: 56},
             {name: '重庆', value: 66},
             {name: '台州', value: 67},
             {name: '南京', value: 67},
             {name: '滨州', value: 70},
             {name: '贵阳', value: 71},
             {name: '无锡', value: 71},
             {name: '本溪', value: 71},
             {name: '克拉玛依', value: 72},
             {name: '渭南', value: 72},
             {name: '马鞍山', value: 72},
             {name: '宝鸡', value: 72},
             {name: '焦作', value: 75},
             {name: '句容', value: 75},
             {name: '北京', value: 79},
             {name: '徐州', value: 79},
             {name: '衡水', value: 80},
             {name: '包头', value: 80},
             {name: '九江', value: 96},
             {name: '邯郸', value: 98},
             {name: '临安', value: 99},
             {name: '兰州', value: 99},
             {name: '沧州', value: 100},
             {name: '临沂', value: 103},
             {name: '南充', value: 104},
             {name: '天津', value: 105},
             {name: '富阳', value: 106},
             {name: '泰安', value: 112},
             {name: '诸暨', value: 112},
             {name: '郑州', value: 113},
             {name: '哈尔滨', value: 114},
             {name: '聊城', value: 116},
             {name: '芜湖', value: 117},
             {name: '唐山', value: 119},
             {name: '平顶山', value: 119},
             {name: '邢台', value: 119},
             {name: '保定', value: 153},
             {name: '湘潭', value: 154},
             {name: '金华', value: 157},
             {name: '岳阳', value: 169},
             {name: '长沙', value: 175},
             {name: '衢州', value: 177},
             {name: '廊坊', value: 193},
             {name: '菏泽', value: 194},
             {name: '合肥', value: 229},
             {name: '武汉', value: 273},
             {name: '大庆', value: 279}
        ];

        var gaugeData = [{'收益率':12.8, '抗风险指数':68.6, '资产总额': 27854.6}];
        var donutGaugeData = [{'CPU':0.42, 'RAM':0.62, 'DISK': 0.23, 'ABC': 0.23}];

        function convertData (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                //var geoCoord = geoCoordMap[data[i].name];
                var geoCoord = geoCoordMap[data[i][0]];
                if (geoCoord) {
                    // res.push({
                    //     name: data[i].name,
                    //     value: geoCoord.concat(data[i].value)
                    // });
                    res.push([
                        data[i][0],
                        geoCoord.concat(data[i][1])
                    ]);
                }
            }
            return res;
        };    

        var dataStores = null;
        function getUrl(ds){
            // console.log('getUrl',ds);
            var deferred = $q.defer();
            if (ds.host == null) {
                deferred.resolve('');
            }

            function mapUrl(ds){ 
                if (ds.host) {
                    var curDs = _.find(dataStores, function(d){
                        return d.name == ds.host.name;
                    });
                    return curDs ? curDs.url : '';
                }
            }
            
            if (dataStores == null) {
                DataStore.query({
                    page: 0,
                    size: 1000,
                    sort: 'id'
                }, onSuccess, onError);
                function onSuccess(data, headers) {
                    dataStores = data;
                    var url = mapUrl(ds);
                    deferred.resolve(url);
                };
                function onError(error) {
                    console.log(error);
                    deferred.reject("time out while getting dataStores");
                };                 
            } else {
                var url = mapUrl(ds);
                deferred.resolve(url);
            }

            return deferred.promise;     
        }

        function runRestApi(datasource, cb) {

            getUrl(datasource).then(function(url){
                var path = datasource.retPath;
                if (path == null || path == '') path = 'data'; 
                $http.get(url).then(function(res){
                    if (angular.isFunction(cb)) {
                        cb(_.get(res, path));
                    }
                }, function(err){
                    console.log(err);
                }); 
            });
        }

        function parseParms(datasource) {
            var compiled = _.template(datasource.postbody);
            //datasource.params = {timeStart:'2017-09-09', timeEnd:'none'};
            //var params = _.assign(datasource.params, datasource.newParams);
            var params = datasource.params;
            if (angular.isObject(params)) {
                var compiled = compiled(params);
                return compiled;
                //return compiled.substring(1, compiled.length-1);
            } else {
                return datasource.postbody;
            }
            // if (angular.isObject(datasource.params)) {
            //     var compiled = compiled(datasource.params);
            //     return compiled;
            //     //return compiled.substring(1, compiled.length-1);
            // } else {
            //     return datasource.postbody;
            // }            
        }

        function runRestPostApi(datasource, cb) {
            getUrl(datasource).then(function(url){
                exeRestPostApi(datasource, url, cb)
            });
        }

        function runRestPostUrlApi(datasource, cb){
            //console.log('runRestPostUrlApi', datasource , cb);
            var body = parseParms(datasource);
            if(datasource.url){
                console.log(datasource.url);
                $http.post(datasource.url, body).then(function(res){
                    if (angular.isFunction(cb)) {
                        if(datasource.postType && datasource.postType.value=='es'){ //
                            var esBody = ResultHandler.create(res.data, false, false, false, false).getBody();              
                            cb(esBody);
                        }else{
                            cb(res.data);
                        }
                    }
                    
                }, function(err){
                    console.log("post rest error: " + err);
                });
            }
              
        }

        function exeRestPostApi(datasource, url, cb) {
            //var url = (datasource.host==null ? '' : datasource.host.url) + (datasource.url || ''); 
            var indicators = _.get(datasource, 'params.indicator')

            var body = angular.fromJson(datasource.postbody);

            // 多个SQL的非常规情况对应，主要适用于统计类的单行结果SQL
            if (angular.isArray(body) && body.length >= 2) {
                runMultipleSQLApi(datasource);

            // 单个SQL语句的常规情况
            } else {
               // 多个指标的特殊处理
                if (angular.isArray(indicators)) {
                    
                    var funArray = [];
                    angular.forEach(indicators, function(indicator, idx){
                        var subDS = _.cloneDeep(datasource);
                        subDS.params.indicator = indicator;
                        var subFun = runApi(subDS);
                        funArray.push(subFun);
                    });

                    $q.all(funArray)
                    .then(function(res){
                        var path = datasource.retPath;
                        if (path == null || path == '') {path = 'data'};
                        //console.log(res);
                        var data = []; 
                        angular.forEach(indicators, function(indicator, idx){
                            var sub = _.get(res[idx], path);
                            _.map(sub, function(d){
                                d['_indicator_'] = indicator;
                            });
                            data = _.concat(data, sub);
                        })
                        if (angular.isFunction(cb)) {
                            cb(data);
                        }
                    });
                
                } else {
                    $q.when(runApi(datasource))
                    .then(function(res){
                        var path = datasource.retPath;
                        if (path == null || path == '') {path = 'data'}; 
                        if (angular.isFunction(cb)) {
                            cb(_.get(res, path));
                        }
                    });           
                }

            }


            function runApi(ds) {
                var body = parseParms(ds);
                var bodyObj = angular.fromJson(body);
                return $http.post(url, bodyObj);
            }

            function runMultipleSQLApi(ds) {
                var body = parseParms(ds);
                var sqls = angular.fromJson(body);

                var apis = [];
                angular.forEach(sqls, function(sql) {
                    apis.push($http.post(url, sql));
                });

                $q.all(apis)
                .then(function(res){
                    var path = ds.retPath;
                    if (path == null || path == '') {path = 'data'};
                    //console.log(res);
                    //var data = []; 
                    var data = {};
                    angular.forEach(res, function(item, idx){
                        var subD = _.get(item, path);
                        if (subD != null && subD.length >= 1){
                            data = _.assign(data, subD[0]);
                        }               
                    })
                    if (angular.isFunction(cb)) {
                        cb([data]);
                    }
                });
                
            }
        
        }

        function runEsApi(datasource, cb) {
            getUrl(datasource).then(function(url){   
                var body = parseParms(datasource);
     
                $http.post(url, body).then(function(res){
                    if (angular.isFunction(cb)) {
                        var esBody = ResultHandler.create(res.data, false, false, false, false).getBody();              
                        cb(esBody);
                    }
                }, function(err){
                    console.log("post rest error: " + err);
                });  
            });

        }

        function runEsServiceApi(datasource, cb) { 
              // console.log('datasource ', datasource);
              if(!datasource.es_range) return ;
              if(!datasource.es_index) return ;
              // if(!datasource.es_interval) return ;
              if(!datasource.es_type) return ;
              if(!datasource.es_field) return  
              //时间处理      
              var getDateHour = function(hour){
                  var now = new Date();
                  now.setHours(now.getHours() - hour); 
                  var time = $filter('date')(now, "yyyy-MM-dd HH:mm");
                  return time+":00";
              };
              var startTime = datasource.es_range!=null?getDateHour(datasource.es_range.value):getDateHour(24); 
              var endTime = getDateHour(0); 
              var explorer = window.navigator.userAgent.toLowerCase(); 
              if (explorer.indexOf("firefox") >= 0 && startTime && endTime) {
                  startTime = startTime.replace(" ","T");
                  endTime = endTime.replace(" ","T");
              } 
              //console.log(startTime, new Date(startTime), endTime, new Date(endTime) );
              var query = {
                  "index": datasource.es_index.alias+"*",
                  "format": "yyyy-MM-dd HH:mm:ss",
                  "startTime": new Date(startTime),               
                  "endTime": new Date(endTime),
                  // "startTime": "2011-10-25T17:53:26.000Z",               
                  // "endTime": "2018-10-25T18:08:26.000Z",
                  "types": [datasource.es_type.name], 
                  "filterFields": {},
                  "fields": [datasource.es_field.name],
                  "queryString": datasource.queryString 
              }  
              var url = datasource.es_view.value;
              if(url=='EsService.getEventCount'){
                if(!datasource.es_interval) return ;
                query.minutesInterval = datasource.es_interval.value;
                EsService.getEventCount.post(query, onSuccess, onError); 
              }else if(url=='EsService.getFieldType'){ //字段值分类 
                if(!datasource.es_top) return ;
                query.top = datasource.es_top.value;
                EsService.getFieldType.post(query, onSuccess, onError); 
              }else if(url=='EsService.getFieldStatistics'){ //字段值统计
                if(!datasource.es_interval) return ;
                query.aggType = datasource.es_function.value;
                query.minutesInterval = datasource.es_interval.value;
                EsService.getFieldStatistics.post(query, onSuccess, onError);
              } 
              function onSuccess(res) {
                  // console.log(res);
                  var data = null;
                  if(url=='EsService.getEventCount'){
                    data = res.aggregations;
                  }else if(url=='EsService.getFieldType'){ //字段值分类 
                    data = res.aggregations.data; 
                  }else if(url=='EsService.getFieldStatistics'){ //字段值统计
                    query.aggType = datasource.es_function.value;
                    data = res.aggregations[query.aggType];
                  }  
                  cb(data);
                  // var datas = [];
                  // var getDate = function(date, d){
                  //   var now = new Date(date);
                  //   now.setDate(now.getDate() + d); 
                  //   var time = $filter('date')(now, "yyyy-MM-dd HH:mm");
                  //   return time+":00";
                  // };
                  // if(data.length>0){
                  //   for (var i = 0; i < 20; i++) {
                  //       _.forEach(data,function(v,k){
                  //           var bean = _.cloneDeep(v);   
                  //           bean.x = getDate(v.x,i);
                  //           datas.push(bean);

                  //       });
                  //       i++;
                  //   };
                  // }
                  // console.log(datas);
                  // cb(datas);
              }
              function onError(err) {
                  console.log(err);
              }
        }


        function runEsAlarmApi(datasource, cb) { 
              console.log('runEsAlarmApi datasource ', datasource);
              if(!datasource.es_range) return ;
              if(!datasource.es_index) return ;
              if(!datasource.es_interval) return ;
              if(!datasource.es_alarmrule) return ; 

              //时间处理      
              var getDateHour = function(hour){
                  var now = new Date();
                  now.setHours(now.getHours() - hour); 
                  var time = $filter('date')(now, "yyyy-MM-dd HH:mm");
                  return time+":00";
              };
              var startTime = datasource.es_range!=null?getDateHour(datasource.es_range.value):getDateHour(24); 
              var endTime = getDateHour(0); 
              var explorer = window.navigator.userAgent.toLowerCase(); 
              if (explorer.indexOf("firefox") >= 0 && startTime && endTime) {
                  startTime = startTime.replace(" ","T");
                  endTime = endTime.replace(" ","T");
              }  
              var query = {
                  "id": datasource.es_alarmrule.id, 
                  "startTime": new Date(startTime),               
                  "endTime": new Date(endTime)
              }  

              AlarmInfoService.getAlarmByAlarmRuleId(datasource.es_alarmrule.id).then(function (promise) {
                console.log('true', promise); 
                var data = promise.data;
                cb(data);
              }, function (promise) { 
                console.log('false', promise);
              });
 
        }


        function getSampleData() {
            return _.cloneDeep(sampleData);
        }

        function getSampleData2() {
            //return _.cloneDeep(sampleData);
            return sampleData2;
        } 

        function getGeoData() {
            //return _.cloneDeep(sampleData);
            return geoData;
        } 

        function getGaugeData() {
            //return _.cloneDeep(sampleData);
            return gaugeData;
        }

        function getDonutGaugeData() {
            //return _.cloneDeep(sampleData);
            return donutGaugeData;
        }

        function getSampleField() {
            return _.cloneDeep(sampleField);
        }

        function standardize(data, config) {

        }

        function exeGroup(data, config) {
            if (data == null || data.length == 0) return data;
            var groupField = _.get(config, 'fieldMap.group') || _.get(config, 'fieldMap.groupLast');
            var xField = _.get(config, 'fieldMap.x');
            var yFields = _.get(config, 'fieldMap.rawY') || _.get(config, 'fieldMap.y');

            if (groupField == null || groupField == '') return data;
            if (xField == null || xField == '') return data;
            if (yFields == null || yFields.length == 0) return data;
            if (data[0][groupField] == null) return data;

            var groups = _.groupBy(data, function(item) {
                return item[groupField];
            })

            _.set(config, 'fieldMap.groupLast', groupField);
            if (_.get(config, 'fieldMap.rawY') == null) {
                _.set(config, 'fieldMap.rawY', _.cloneDeep(yFields));
            }
           
            var xItems = _.uniq(_.map(data, xField));

            var newData = [];
            _.map(xItems, function(x) {
                var newItem = {};
                newItem[xField] = x;
                _.forEach(groups, function(gItems, group){
                    var item = _.find(gItems, function(gi) {
                        return gi[xField] == x
                    });
                    _.forEach(yFields, function(y) {
                        newItem[group + '-' + y.field] = item[y.field];
                    })
                })
                newData.push(newItem);
            })
            return newData;
            //console.log(newData);

        }

        function processData(dataIn, config) {
            //TODO. process data transformation based on config
            var data = _.cloneDeep(dataIn);
            var maxCount = _.get(config,'datasource.maxCount');
            if (maxCount != null) {
                data = _.take(data, maxCount);
            }

            // var group = _.get(config, 'fieldMap.group') == null ? 0 : 1;
            // var groupLast = _.get(config, 'fieldMap.groupLast') == null ? 0 : 1;
            // if (group + groupLast == 1) {
            //     data = exeGroup(data, config);
            // } 
            
            data = exeGroup(data, config);
            return data;
        }

        // provide service interface
        return {
            getSampleData: getSampleData,
            getSampleData2: getSampleData2,
            getGeoData: getGeoData,
            getGaugeData: getGaugeData,
            getDonutGaugeData: getDonutGaugeData,
            getSampleField: getSampleField,
            runRestApi: runRestApi,
            runRestPostApi: runRestPostApi,
            runRestPostUrlApi: runRestPostUrlApi,
            runEsApi: runEsApi,
            runEsServiceApi: runEsServiceApi,
            convertGeoData: convertData,
            exeGroup: exeGroup,
            processData: processData,
            runEsAlarmApi: runEsAlarmApi
        }
    }


})(); 

