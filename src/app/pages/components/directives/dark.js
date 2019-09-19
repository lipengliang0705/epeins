(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    var contrastColor = '#eee';
    var axisColor = '#666';
    var axisCommon = function () {
        return {
            axisLine: {
                lineStyle: {
                    color: axisColor
                }
            },
            axisTick: {
                lineStyle: {
                    color: axisColor
                }
            },
            axisLabel: {
                textStyle: {
                    color: contrastColor
                }
            },
            splitLine: {
                lineStyle: {
                    //type: 'dashed',
                    type: 'solid',
                    color: '#000'
                }
            },
            splitArea: {
                areaStyle: {
                    color: axisColor
                }
            }
        };
    };

/*    var colorPalette = [
        '#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53',
        '#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42'];*/

    var colorPalette = [
        '#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53',
        '#eedd78','#73a373','#73b9bc','#7289ab','#91ca8c',
        '#f49f42',"#fc97af","#87f7cf","#f7f494","#72ccff",
        "#f7c5a0","#d4a4eb","#d2f5a6","#76f2f2","#9b8bba",
        "#e098c7","#8fd3e8","#71669e","#cc70af","#7cb4cc" 
    ]; 
                
    var theme = {
        color: colorPalette,
        //backgroundColor: '#1c2b36',
        backgroundColor: '#222222',
        tooltip: {
            axisPointer: {
                lineStyle: {
                    type: 'dashed',
                    color: axisColor
                },
                crossStyle: {
                    type: 'dotted',
                    color: axisColor
                }
            }
        },
        legend: {
            textStyle: {
                color: contrastColor
            }
        },
        textStyle: {
            color: contrastColor,
            //fontFamily: "Microsoft YaHei",
        },
        title: {
            textStyle: {
                color: contrastColor,
                //fontSize: 16,
                fontWeight: 'normal'
            }
        },
        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: contrastColor
                }
            }
        },
        dataZoom: {
            textStyle: {
                color: contrastColor
            }
        },
        timeline: {
            lineStyle: {
                color: contrastColor
            },
            itemStyle: {
                normal: {
                    color: colorPalette[1]
                }
            },
            label: {
                normal: {
                    textStyle: {
                        color: contrastColor
                    }
                }
            },
            controlStyle: {
                normal: {
                    color: contrastColor,
                    borderColor: contrastColor
                }
            }
        },
        timeAxis: axisCommon(),
        logAxis: axisCommon(),
        valueAxis: axisCommon(),
        categoryAxis: axisCommon(),

        line: {
            smooth : true,
            symbol: 'circle',
        },
        graph: {
            color: colorPalette
        },
        gauge: {
            title: {
                textStyle: {
                    color: contrastColor
                }
            }
        },
        candlestick: {
            itemStyle: {
                normal: {
                    color: '#FD1050',
                    color0: '#0CF49B',
                    borderColor: '#FD1050',
                    borderColor0: '#0CF49B'
                }
            }
        }
    };
    theme.categoryAxis.splitLine.show = false;
    echarts.registerTheme('dark', theme);
}));