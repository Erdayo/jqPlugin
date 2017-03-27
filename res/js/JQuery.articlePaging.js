;(function ($) {
    var apProps = function (opt) {
        this.defaults = {
            wordCount: '800',        //单页字数
            pageBreak: '<hr>',         //分页符
            btnPrev: '.prev',        //上一页
            btnNext: '.next',        //下一页
            target: '.target',       //跳至某页
            totalPage: '.ro'         //总页数
        };
        this.options = $.extend(this.defaults, opt);
    };

    $.fn.apFunc = function (opt) {
        var apProp = new apProps(opt),
            pageArr = [],
            pageCon = '',
            len = 0,    //累计计算字数
            iCount = 0, //页面下标
            article = $(this),
            btnPrev = $(apProp.options.btnPrev),    //上一页
            btnNext = $(apProp.options.btnNext),    //下一页
            target = $(apProp.options.target),      //当前页数
            winHref = location.hash;                //获取链接锚点

        if (winHref.split('p')[1] != undefined)     //若有锚点则获取当前锚点指向的页数
            iCount = parseInt(winHref.split('p')[1]) - 1;

        //划分页面,将页面数据存入数组
        article.children().each(function () {
            len += $(this).text().length;
            if (len >= apProp.options.wordCount || $(this)[0].outerHTML.toLowerCase().indexOf(apProp.options.pageBreak) != -1) {
                pageArr.push(pageCon);
                pageCon = '';
                len = 0;
            }
            else {
                pageCon += $(this)[0].outerHTML;
            }
        });
        pageArr.push(pageCon);  //存入最后一组数据

        for (var i = 0; i < pageArr.length; i++) {   //处理分页数据,若为空移除
            if (pageArr[i].length == 0) {
                pageArr.splice(i, 1);
            }
        }

        $(apProp.options.totalPage).val('/' + pageArr.length);  //显示总共划分页数

        //初始化页面
        showPage(iCount);

        //键入页数跳转页面
        target.on('blur keydown',function (e) {
            if ((e.type =='keydown' && event.keyCode == 13 )|| e.type == 'blur')
            {
                iCount = $(this).val() - 1;
                if (iCount < 0 || iCount > pageArr.length - 1)
                    return true;
                window.location.href = window.location.href.split('#')[0] + '#p' + (iCount + 1);
                showPage(iCount);
            }
        });

        //上一页/下一页点击事件
        btnPrev.click(function () {
            showPage(iCount);
        });
        btnNext.click(function () {
            showPage(iCount);
        });

        //显示页面并修改上一页及下一页链接,修改当前页数
        function showPage(sub) {
            if (sub <= 0)
                iCount = sub = 0;
            if (sub >= pageArr.length - 1)
                iCount = sub = pageArr.length - 1;

            article.html('<div id="p' + (sub + 1) + '">' + pageArr[sub] + '</div>');
            target.val(sub + 1);
            if (sub != 0)
                btnPrev[0].href = window.location.href.split('#')[0] + '#p' + (sub);
            else
                btnPrev[0].href = window.location.href.split('#')[0] + '#p' + (sub + 1);
            if (sub != pageArr.length - 1)
                btnNext[0].href = window.location.href.split('#')[0] + '#p' + (sub + 2);
            else
                btnNext[0].href = window.location.href.split('#')[0] + '#p' + (sub + 1);
        }

        //监听地址栏锚点链接变化
        $(window).on('hashchange', function () {
            winHref = location.hash;
            if (winHref.split('p')[1] != undefined)
                iCount = parseInt(winHref.split('p')[1]) - 1;
            else
                iCount = 0;
            showPage(iCount);
        });

        //IE7定时器检测地址栏变化
        if( window.navigator.userAgent.indexOf(' MSIE 7.0') != -1)
        {
            setInterval(function(){
                winHref = location.hash;
                if (winHref.split('p')[1] != undefined)
                    iCount = parseInt(winHref.split('p')[1]) - 1;
                else
                    iCount = 0;
                showPage(iCount);
            },100);
        }
    };
})(jQuery);