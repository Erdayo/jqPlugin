function chart2(usdeur, idName) {
    var data = eval("([" + usdeur + "])");
    var mm = Datachart(data, 6);
    data = ChartDataproce(data, mm);
    popchart(data, idName, 0, mm, 20, 12);
}

// 横坐标
function Datachart(ddd, ij) {
    var dat1;
    var data = [];
    var dat2;
    var m = new Date().getTime() - 120 * 24 * 60 * 60 * 1000;
    var i = 0, mind, maxd, v, mm = [], vDate, date;
    mind = ddd[0][0] > m ? m : ddd[0][0];
    maxd = new Date().getTime();
    v = (maxd - mind) / ij;
    for (var n = 0; n < ij; n++) {
        vDate = new Date(v * n + mind);
        date = (vDate.getMonth() + 1) + "-" + vDate.getDate();
        mm.push([v * n + mind, date]);
    }
    vDate = new Date(maxd);
    date = (vDate.getMonth() + 1) + "-" + vDate.getDate();
    mm[0][1] = "";
    mm.push([v * n + mind, date]);
    return mm;
}

// 价格时间戳
function ChartDataproce(ddd, mm) {
    var data = [], dat = [];
    var price = ddd[0][1];
    var i = 0;
    var m = new Date().getTime();
    var day = 1000 * 3600 * 24;
    if (ddd[0][0] > mm[0][0]) {
        data.push([mm[0][0], null]);
        i++;
    }
    for (var n = 0; n < ddd.length; n++) {
        if (m >= ddd[n][0]) {
            if (price != ddd[n][1]) {
                dat = [];
                if (ddd[n - 1][0] != ddd[n][0])
                    dat[0] = ddd[n][0] - day;
                else
                    dat[0] = ddd[n][0];
                dat[1] = price;
                data[i] = dat;
                i++;
            }
            dat = [];
            dat[0] = ddd[n][0];
            dat[1] = ddd[n][1];
            data[i] = dat;
            price = ddd[n][1]
            i++;
        }
    }
    i = data.length - 1;
    if (i > 0 && data[i][0] < m) {
        dat = [];
        dat[0] = m;
        dat[1] = data[i][1];
        data.push(dat);
    }
    return data;
}

//placeholder,x调整，y调整
function popchart(data, idtxt, jg, mm, fx, fy) {
    var dom, mid, i = data.length - 1, xx, yy, x11, dd, dd1, vjgy;
    var ctx1, ctx;
    if (typeof mm === "undefined" && mm == null)
        mm = {mode: "time", timezone: "browser", timeformat: "%m-%d", tickLength: 0};
    else
        mm = {ticks: mm, labelWidth: 90};
    if (typeof fx === "undefined")
        fx = 0;
    if (typeof fy === "undefined")
        fy = 0;
    plot = $.plot("#" + idtxt, [{data: data}],
        {
            series: {
                lines: {show: true, lineWidth: 2}
            },
            crosshair: {
                mode: "x"
            },
            colors: ['#ff0700'],
            grid: {
                hoverable: true,
                autoHighlight: true,
                borderWidth: 0,
                clickable: true,
                margin: 15,
                labelMargin: 2
            },
            yaxis: {
                minTickSize: 0.01,
                tickFormatter: function (val, axis) {
                    if (axis.tickSize < 1)
                        return val.toFixed(2);
                    return val;
                },
            },
            xaxis: mm,
            legend: {
                margin: 0
            }
        });
    mid = idtxt + "-tooltip";
    var legends = $("#" + idtxt + " .legendLabel");
    $("#" + idtxt + " .legend table").css("top", -12);
    $("#" + idtxt + " .legend div").css("top", -13);
    legends.each(function () {
        $(this).css('width', 90);
    });

    $("#" + idtxt).bind("plothover", function (event, pos, item) {
        var i, j, dataset, x, y, w, h, w1, h1;
        var x1, y1;
        var series
        if (item) {
            dataset = plot.getData();
            series = item.series;
            var vDate = new Date(item.datapoint[0]);
            var date = vDate.getFullYear() + "-" + (vDate.getMonth() + 1) + "-" + vDate.getDate();
            var hw = plot.pointOffset({
                x: item.series.data[item.dataIndex][0],
                y: item.series.data[item.dataIndex][1]
            });
            w = plot.width() + 50;
            h = plot.height() + 10;
            $("#" + mid).html("日期：" + date + "<br>价格：" + parseFloat(item.datapoint[1].toFixed(2)));
            w1 = $("#" + mid).width();
            h1 = $("#" + mid).height();
            y1 = hw.top + 3;
            x1 = hw.left + 3;
            if (x1 + w1 > w)
                x1 -= w1 + 6;
            if (y1 + h1 > h)
                y1 -= h1 + 6;
            $("#" + mid).css({top: y1, left: x1, 'font-size': '12px'}).fadeIn(200);
        } else {
            $("#" + mid).hide();
        }
    });

    $("<div id='" + mid + "'></div>").css({
        "width": "100px",
        position: "absolute",
        display: "none",
        border: "1px solid #FFCC66",
        padding: "2px",
        "background-color": " #FFEBBF",
        opacity: 0.8,
        "z-index": "999999"
    }).appendTo($("#" + idtxt).parent());

    dd = plot.pointOffset({x: data[data.length - 1][0], y: data[data.length - 1][1]});

    ctx1 = plot.getCanvas();
    ctx = ctx1.getContext('2d');
    ctx.fillStyle = "#333";
    ctx.font = "12px";
    ctx.fillText(data[i][1], dd.left + 5, dd.top + 4);
    vjgy = dd.top;

    var minprice = 9999999999;
    var maxprice = 0;
    var px = 0, pxd = 0;
    var bl = false;
    yy = 0;
    x11 = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i][1] < minprice && data[i][1] != null)
            minprice = data[i][1];
        if (data[i][1] > maxprice)
            maxprice = data[i][1];
    }
    if (maxprice != minprice && maxprice != 0 && minprice != 9999999999) {
        pxd = data[data.length - 1][0];
    }
    if (data[0][1] == null && data.length > 1) {
        x11 = data[1][0];
        yy = data[1][1];
    }
    px = mm.ticks[0][0];
    if (pxd != 0 || yy != 0) {
        ctx.save();
        ctx.translate(0.5, 0.5);
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (pxd != 0) { //最小价格
            dd = plot.pointOffset({x: px, y: minprice});
            dd1 = plot.pointOffset({x: pxd, y: minprice});
            ctx.strokeStyle = '#ccc';
            drawDashLine(ctx, dd.left, dd.top, dd1.left, dd1.top, 3);
            if (minprice != data[data.length - 1][1]) {//写价格
                ctx.fillStyle = "#999";
                ctx.font = "12px";
                if (dd1.top - vjgy < 11)//防止重叠
                    dd1.top = vjgy + 11;
                ctx.fillText(minprice, dd1.left + 5, dd1.top + 4);
            }
        }
        if (pxd != 0) { //最小价格
            dd = plot.pointOffset({x: px, y: maxprice});
            dd1 = plot.pointOffset({x: pxd, y: maxprice});
            ctx.strokeStyle = '#ccc';
            drawDashLine(ctx, dd.left, dd.top, dd1.left, dd1.top, 3);
            if (maxprice != data[data.length - 1][1]) {//写价格
                ctx.fillStyle = "#999";
                ctx.font = "12px";
                ctx.fillText(maxprice, dd1.left + 5, dd1.top + 4);
            }
        }

        if (yy != 0) {
            dd = plot.pointOffset({x: px, y: yy});
            dd1 = plot.pointOffset({x: x11, y: yy});
            ctx.beginPath();
            ctx.strokeStyle = "#ff0700";
            drawDashLine(ctx, dd.left, dd.top, dd1.left, dd1.top, 3);
        }
        ctx.stroke();
        ctx.restore();
    }
}
function drawDashLine(ctx, x1, y1, x2, y2, dashLength) {
    var dashLen = dashLength === undefined ? 5 : dashLength,
        xpos = x2 - x1, //得到横向的宽度;
        ypos = y2 - y1, //得到纵向的高度;
        numDashes = xpos / dashLen;
    //利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
    for (var i = 0; i < numDashes; i++) {
        if (i % 2 === 0) {
            ctx.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
            //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
        } else {
            ctx.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
        }
    }
    ctx.stroke();
}