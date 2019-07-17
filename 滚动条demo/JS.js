var lid = 'ZT';
$(function () {
    getWeatherNew();//天气预报
    get_Circle_Data();//借还从册次
    getKeLiuData_Z();//客流统计
    get_seven_Data();//近来7天的借阅情况
	getNotice();
    window.setInterval(function () {
        //10分钟刷新一次
        get_Circle_Data();
        get_seven_Data();
    }, 600000);
    window.setInterval(function () {
        //2小时刷新一次
        getWeatherNew();
		getNotice();
    }, 7204000);
    window.setInterval(function () {
        //10s刷新一次
        getKeLiuData_Z();
    }, 10000);
    var change1 = $(".changeModal1").find("iframe").attr("src");
   // var change2 = $(".changeModal2").find("iframe").attr("src");  
    setInterval(function () {
        //$(".changeModal1").find("iframe").attr("src", change1);
        //$(".changeModal2").find("iframe").attr("src", change2);
    }, 3600000);//1小时切换一次（3600000）
});
//客流今日到馆昨日到馆上月到馆总到馆等
function getKeLiuData_Z() {
    $.ajax({
        url: "WebAppCommon.axd",
        type: "POST",
        dataType: "json",
        data: {
         action: 'GetHNKLPeopleCountingDetail',
        },
        success: function (data) {
            if (data.code == '1001') {
                var datalist = data.DataList[0];
                var DayIn = datalist.toDayCount;//当日到馆
                var TotalIn = datalist.totalCount;//历史到馆
                if (DayIn === null) { DayIn = 0 };
                if (TotalIn === null) { TotalIn = 0 };
                show_num("#historyCome", TotalIn, 30);//历史到馆
                show_num("#todayCome", DayIn, 30); //当日到馆
            } else {
                $("#historyCome").html(0);
                $("#todayCome").html(0);
            }
        },
        complete: function () {
            
        }
    });
}
//天气接口
function getWeatherNew() {
    $.ajax({
        type: "get",
        url: "http://api.map.baidu.com/telematics/v3/weather?location='衡南'&output=json&ak=RXbut5qWvyf8wFW6I8GNjsxw",
        dataType: "jsonp",
        success: function (data) {
            if(data.error===0){
                var weatherArr={
                    "00": "晴",
                    "01": "多云",
                    "02": "阴",
                    "03": "阵雨",
                    "04": "雷阵雨",
                    "05": "雷阵雨伴有冰雹",
                    "06": "雨夹雪",
                    "07": "小雨",
                    "08": "中雨",
                    "09": "大雨",
                    "10": "暴雨",
                    "11": "大暴雨",
                    "12": "特大暴雨",
                    "13": "阵雪",
                    "14": "小雪",
                    "15": "中雪",
                    "16": "大雪",
                    "17": "暴雪",
                    "18": "雾",
                    "19": "冻雨",
                    "20": "沙尘暴",
                    "21": "小雨转中雨",
                    "22": "中雨转大雨",
                    "23": "大雨转暴雨",
                    "24": "暴雨转大暴雨",
                    "25": "大暴雨转特大暴雨",
                    "26": "小雪转中雪",
                    "27": "中雪转大雪",
                    "28": "大雪转暴雪",
                    "29": "浮尘",
                    "30": "扬沙",
                    "31":"强沙尘暴",
                    "32": "霾",
                    "33":"多云转晴",
                    "99": "无"
                };
                var rs=data.results[0].weather_data[0];
                var weatherIcon="99";
                for(var key in weatherArr){
                    if(rs.weather===weatherArr[key]){
                        weatherIcon=key;
                    }
                }
                //周五 12月7日
                //6℃～3℃ 小雨
                console.log(data.results[0].weather_data[0])
                //var dtSplit=rs.date.split(" ");
                //var weatherhtml='<div class="img_icon" style="width:100px;height:100px;margin:0 auto 7%;"><img style="width:100%;" src="WebUI/image/new_iconame/'+weatherIcon+'.png" alt=""></div><span>'+dtSplit[1]+'</span><span>'+rs.weather+'</span><span>'+rs.temperature+'</span><span>'+dtSplit[2]+'</span>'
                //$("#weather").html(weatherhtml);



                $(".pngtqico").attr("src", "WebUI/images/new_iconame/" + weatherIcon + ".png");
                $(".wtpath").html(rs.temperature + " " + rs.weather);
                $(".date").html((rs.date).slice(0, 9));

            }
        }
    });
}
//图书流通借还总册次
function chart_seven_days(time, huan, jie) {
    var myChart = echarts.init(document.getElementById('cicle_chart'));
    var colors = ['#1c479c', '#21bdad'];
    var data1 = time;
    option = {
        title: {
            text: '近七日图书借还数',
            textStyle: {
                fontSize: 14,
                fontWeight: 'bolder',
                color: '#ddd'
            }
        },
        color: colors,
        legend: {
            right: '8%',
            data: ['借阅', '还入'],
            textStyle: {
                color: '#ddd', fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            top: '18%',
            left: '16%',
            bottom: '14%',
            right: '6%'
        },
        xAxis: [{
            type: 'category',
            data: data1,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0,//横轴信息全部显示
                rotate: -30,//-30度角倾斜显示
                show: true,
                textStyle: {
                    color: '#ddd', fontSize: 14
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#ddd',//网格线颜色
                }
            },
        }],
        yAxis: [{
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#333',//网格线颜色
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#ddd', fontSize: 14
                }
            }
        }],
        series: [{
            name: '借阅',
            type: 'bar',
            stack: '总量',
            barWidth: '26',
            data: jie,
            itemStyle: {
                normal: {
                    label: {
                        show: true, position: 'insideBottom',
                        textStyle: {
                            color: '#efe8e8', fontSize: 10
                        }
                    }
                }
            },
        }, {
            name: '还入',
            type: 'bar',
            stack: '总量',
            barWidth: '26',
            data: huan,
            itemStyle: {
                normal: {
                    label: {
                        show: true, position: 'insideBottom',
                        textStyle: {
                            color: '#efe8e8', fontSize: 10
                        }

                    }
                }
            },
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}	
function get_seven_Data() {
    var timeArr = [], todayArr = [], yestodayArr=[];
    $.ajax({
        url: "http://124.228.174.250:8090/BOOK_API/book/GetBook",
        type: "post",
        dataType: "json",
        //data: {
            //action: 'GetTableD',
           //rdlib: lid,
           //day: day
        //},
        success: function (data) {
console.log("----------1-------")
console.log(data)
console.log("----------1-------")
            var _data = data
            if (data !== "") {
                timeArr=_data.TIME;
                huanArr =_data.huan;
                jieArr = _data.jie;
            }
        },
        complete: function () {
            //loadChartData(countTd, countYd)
            chart_seven_days(timeArr, huanArr, jieArr)
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest.status); 
            console.log(XMLHttpRequest.readyState); 
　　        console.log(textStatus); 
        }
    });

}
function get_Circle_Data() {
    $.ajax({
        url: "http://124.228.174.250:8090/BOOK_API/book/GetHistory",
        type: "post",
        dataType: "json",
        //data: {
        //    action: 'GetTableD',
        //    rdlib: lid,
        //    day: day
        //},
        success: function (data) {
            if (data !== "") {
                $("#todayBorrowBook").html(data.history[0].jie || 0);//今日册次借阅数
                $("#todayBackBook").html(data.history[0].huan || 0);//今日册次还入数
            } else {
                $("#todayBorrowBook").html(0);//今日册次借阅数
                $("#todayBackBook").html(0);//今日册次还入数
            }
        },
        complete: function () {
        }
    });
    
}
//数字滚动增长
function show_num(container, n, height) {
	
    var it = $(container).find("i");
    var len = String(n).length;
    for (var j = 0; j < len; j++) {
        if (it.length <= j) {
            $(container).append("<i></i>");
        }
        var num = String(n).charAt(j);
        var y = -parseInt(num) * height;
        var obj = $(container).find("i").eq(j);
        obj.animate({
            backgroundPosition: '(0 ' + String(y) + 'px)'
        }, 'slow', 'swing', function () { }
        );
    }
    //$("#cur_num").val(n);
}

function getNotice() {
    var m_html="";
    $.ajax({
        url: "Content.axd",
        type: "post",
        dataType: "json",
        async: false,
        data: {
            action: 'WebGetNotice',
            LibId: lid
        },
        success: function (data) {
            var datalist = data.DataList[0];
            if (data.code == "1001") {
                $(".notice_title").text(datalist.D_Title);
                m_html += '<marquee id="marquee_notice" scrolldelay=200 height=100% width=100% direction="up" scrollamount="2" behavior=scroll><div class="content">' + datalist.D_Content + '</div></marquee> '
                $(".notic_content").html(m_html);
            } else {
                $(".notic_content").html('<p style="text-align:center">暂无公告</p>')
            }
           
        },
        complete: function () {
            var marHeight = $("#marquee_notice").height();
            var cHeight = $("#marquee_notice .content").height();
            if (marHeight > cHeight) {
                $("#marquee_notice").attr("scrollamount",0)
            } else {
                $("#marquee_notice").attr("scrollamount", 2)
            }
        }

    });
}

