/**
 * lib.js v1.0.0
 * Created on 2016/9/7 , completed on 2016/9/14
 */
;(function ($) {

    //声明变量
    //------------------------------------------ banner ---------------------------------------------//
    var bannerProps = function (opt) {
        this.defaults = {
            'control': '.control',      //控制类
            'btn_prev': '.btn_prev',    //上一页
            'btn_next': '.btn_next',    //下一页
            'interval': 3000,           //间隔时间
            'seamless': true            //是否无缝滚动
        };
        this.options = $.extend({}, this.defaults, opt);
    };

    //------------------------------------------ back to top ---------------------------------------------//
    var bkProps = function (opt) {
        this.defaults = {
            'ratio': 0.4,        //距顶部与屏幕的比例
            'animate': true,      //是否使用动画
            'speed': 300             //滚动到顶部的速度
        };
        this.options = $.extend({}, this.defaults, opt);
    };

    //------------------------------------------ navigation select ---------------------------------------------//
    var navProps = function (opt) {
        this.defaults = {
            'grade': 1     //具体判断栏目的子级
        };
        this.options = $.extend({}, this.defaults, opt);
    };

    //------------------------------------------ copy to clipBord ---------------------------------------------//
    var copyProps = function (opt) {
        this.defaults = {
            'path': './js/ZeroClipboard.swf',   //swf路径
            'btnId': 'btnId',                   //按钮Id
            'linkId': 'linkId',                 //文本Id
            'parentId': 'parentId',             //包含按钮及文本的父层对象Id
            'setHandCursor': true,              //是否设置鼠标为手型
            'successFunc': function () {
                console.info('Copied successfully!');
            },         //成功执行的函数
            'failureFunc': function () {
                console.info('Replication Fails, not installed flash player , please install and restart the browser.');
            }          //失败执行的函数
        };
        this.options = $.extend({}, this.defaults, opt);
    };

    //------------------------------------------ drag ---------------------------------------------//
    var dragProps = function (opt) {
        this.defaults = {
            'parent': 'body',       //父层
            'isOverflow': false    //是否可溢出
        };
        this.options = $.extend({}, this.defaults, opt);
    };


    //执行函数
    $.fn.extend({
        //------------------------------------------ banner ---------------------------------------------//
        //banner滑动
        swipeBanner: function (opt) {
            var bannerProp = new bannerProps(opt);              //实例bannerProps
            var controlObj = $(this).find(bannerProp.options.control);     //控制对象
            var btn_prevObj = $(this).find(bannerProp.options.btn_prev);   //上一页对象
            var btn_nextObj = $(this).find(bannerProp.options.btn_next);   //下一页对象
            var olObj = $(this).find('ol');     //ol对象
            var liObj = $(this).find('li');     //li对象
            var liW = liObj.width();       //li宽度
            var liLen = liObj.length;      //li个数
            var timer;          //定时器
            var iCount = 0;     //记录下标
            timer = setInterval(movePic, bannerProp.options.interval);   //设置定时器
            if (bannerProp.options.seamless) {       //若为无缝滚动,则克隆复制第一个到最后
                var cloneObj = liObj.eq(0).clone().removeClass('on');
                olObj.append(cloneObj);
            }
            //显示图片
            function showPic(sub) {
                //有缝滚动,下标重新赋值
                if (sub > liLen - 1 && !bannerProp.options.seamless)
                    iCount = sub = 0;
                if (sub < 0 && !bannerProp.options.seamless)
                    iCount = sub = liLen - 1;
                //无缝滚动,下标重新赋值及ol样式修改
                if (sub > liLen && bannerProp.options.seamless) {
                    iCount = sub = 1;
                    olObj.css('margin-left', 0);
                }
                if (sub < 0 && bannerProp.options.seamless) {
                    iCount = sub = liLen - 1;
                    olObj.css('margin-left', -(liLen) * liW);
                }
                //无缝滚动,控制按钮重新定位
                if (sub > liLen - 1 && bannerProp.options.seamless) {
                    controlObj.find('a').eq(0).addClass('on').siblings().removeClass('on');
                }
                olObj.stop().animate({'margin-left': -sub * liW}, 500);            //ol滚动
                liObj.eq(sub).addClass('on').siblings().removeClass('on');  //li为当前位置添加类'on'及其同胞删除类'on'
                controlObj.find('a').eq(sub).addClass('on').siblings().removeClass('on');   //为控制区内对应元素添加类'on'及其同胞删除类'on'
            }
            //定时移动图片
            function movePic() {
                iCount++;
                showPic(iCount);
            }
            //清除定时器以及启用定时器
            $(this).hover(function () {
                clearInterval(timer);   //清除定时器
            }, function () {
                timer = setInterval(movePic, bannerProp.options.interval);   //设置定时器
            });
            //上一页按钮
            btn_prevObj.click(function () {
                iCount--;
                showPic(iCount);
            });
            //下一页按钮
            btn_nextObj.click(function () {
                iCount++;
                showPic(iCount);
            });
            //控制按钮,获取当前用户点击按钮的下标,并显示对应的图片
            controlObj.find('a').click(function () {
                var nowIndex = $(this).index();
                if (nowIndex == 0 && bannerProp.options.seamless) {
                    iCount = liLen;
                }
                else
                    iCount = nowIndex;
                showPic(iCount);
            });
        },

        //banner淡入淡出
        fadeBanner: function (opt) {
            var bannerProp = new bannerProps(opt);              //实例bannerProps
            var controlObj = $(this).find(bannerProp.options.control);     //控制对象
            var btn_prevObj = $(this).find(bannerProp.options.btn_prev);   //上一页对象
            var btn_nextObj = $(this).find(bannerProp.options.btn_next);   //下一页对象
            var liObj = $(this).find('li');                     //li对象
            var liLen = liObj.length;                           //li个数
            var iCount = 0;                                     //记录下标
            var timer;                                          //定时器
            timer = setInterval(movePic, bannerProp.options.interval);   //启动定时器
            //显示图片
            function showPic(sub) {
                if (sub > liLen - 1)
                    iCount = sub = 0;
                if (sub < 0)
                    iCount = sub = liLen - 1;
                liObj.eq(sub).stop().fadeIn().addClass('on').css({
                    'opacity': 1,
                    'filter': 'alpha(opacity=100)'
                }).siblings().removeClass('on');  //当前下标位置淡入并添加类'on',其同胞删除类'on'
                liObj.eq(sub).prevAll().stop().fadeOut();   //在当前下标位置前的所有同胞淡出
                liObj.eq(sub).nextAll().stop().fadeIn();    //在当前下标位置后的所有同胞淡入
                controlObj.find('a').eq(sub).addClass('on').siblings().removeClass('on');   //控制按钮在当前下表添加类'on',其同胞删除类'on'
            }
            //定时移动显示
            function movePic() {
                iCount++;
                showPic(iCount);
            }
            //清除及启动定时器
            $(this).hover(function () {
                clearInterval(timer);       //清除定时器
            }, function () {
                timer = setInterval(movePic, bannerProp.options.interval);       //启动定时器
            });
            //上一页按钮
            btn_prevObj.click(function () {
                iCount--;
                showPic(iCount);
            });
            //下一页按钮
            btn_nextObj.click(function () {
                iCount++;
                showPic(iCount);
            });
            //控制按钮
            controlObj.find('a').click(function () {
                iCount = $(this).index();     //获取当前点击的控制按钮的下标值并显示对应的图片
                showPic(iCount);
            });
        },

        //------------------------------------------ add favorite ---------------------------------------------//
        addFavorite: function (url, txt) {
            return this.click(function () {
                var obj = $(this);
                if ($.browser.msie) {
                    window.external.addFavorite(url, txt);
                }
                else {
                    alert("请使用Ctrl+D将本页加入收藏夹！");
                }
            })
        },

        //------------------------------------------ back to top ---------------------------------------------//
        backTop: function (opt) {
            var bkProp = new bkProps(opt);
            var obj = $(this);
            $(window).scroll(function () {        //监听滚动条
                if ($(window).scrollTop() >= $(window).height() * bkProp.options.ratio)      //大于设定的屏高则显示返回顶部,反之隐藏
                    obj.show();
                else
                    obj.hide();
            });
            obj.click(function () {
                if (bkProp.options.animate) {    //有滚动效果到顶部
                    $('body,html').animate({'scrollTop': 0}, bkProp.options.speed);
                }
                if (!bkProp.options.animate) {   //无滚动效果到顶部
                    $('body,html').scrollTop(0, 0);
                }
            });
        },

        //------------------------------------------ navigation select ---------------------------------------------//
        navSelect: function (opt) {
            var navProp = new navProps(opt);        //实例navProps
            var lHref = window.location.href;       //获取地址栏链接
            var url = lHref.split('/')[navProp.options.grade + 2];    //截取所需字符串
            var obj = $(this);
            var arr = [];   //声明一个数组,用来保存页面内需要判断的链接
            obj.find('a').each(function () {
                var tmp = $(this)[0].href;  //获取导航栏中的链接
                tmp = tmp.split('/')[navProp.options.grade + 2];  //截取所需字符串
                arr.push(tmp);      //将字符串存入数组
            });
            //比较,相同的根据下标去添加删除类'on'
            for (var i = 0; i < arr.length; i++) {
                if (url == arr[i])
                    obj.find('a').eq(i).addClass('on').siblings().removeClass('on');
            }
        },

        //------------------------------------------ regex ---------------------------------------------//
        //正则表达式匹配
        //邮箱匹配
        matchEmail: function (txt) {
            var reg = /\w+[@]{1}\w+[.]\w+/;
            return reg.test(txt);
        },
        //电话号码匹配
        matchPhone: function (txt) {
            var reg = /(^1\d{10}$)|(^0\d{2,3}-?\d{7,8}$)/;
            return reg.test(txt);
        },
        //QQ号匹配
        matchQQ: function (txt) {
            var reg = /^\d{5,10}$/;
            return reg.test(txt);
        },
        //身份证
        matchIdCard: function (txt) {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return reg.test(txt);
        },

        //------------------------------------------ html to ubb ---------------------------------------------//
        htmlToUbb: function (str) {
            //换行转换
            //str = str.replace(/(\r\n|\n|\r)/ig, '');
            str = str.replace(/<br[^>]*>/ig, '\n');
            str = str.replace(/<p[^>\/]*\/>/ig, '\n');
            //str = str.replace(/\[code\](.+?)\[\/code\]/ig, function($1, $2) {return phpcode($2);});
            str = str.replace(/\son[\w]{3,16}\s?=\s*([\'\"]).+?\1/ig, '');
            //html标签转换
            str = str.replace(/<hr[^>]*>/ig, '[hr]');
            str = str.replace(/<(sub|sup|u|strike|b|i|pre)>/ig, '[$1]');
            str = str.replace(/<\/(sub|sup|u|strike|b|i|pre)>/ig, '[/$1]');
            str = str.replace(/<(\/)?strong>/ig, '[$1b]');
            str = str.replace(/<(\/)?em>/ig, '[$1i]');
            str = str.replace(/<(\/)?blockquote([^>]*)>/ig, '[$1blockquote]');
            str = str.replace(/<img[^>]*smile=\"(\d+)\"[^>]*>/ig, '[s:$1]');
            str = str.replace(/<img[^>]*src=[\'\"\s]*([^\s\'\"]+)[^>]*>/ig, '[img]' + '$1' + '[/img]');
            str = str.replace(/<a[^>]*href=[\'\"\s]*([^\s\'\"]*)[^>]*>(.+?)<\/a>/ig, '[url=$1]' + '$2' + '[/url]');
            //str = str.replace(/<h([1-6]+)([^>]*)>(.*?)<\/h\1>/ig,function($1,$2,$3,$4){return h($3,$4,$2);});
            //符号转换
            str = str.replace(/<[^>]*?>/ig, '');
            str = str.replace(/&amp;/ig, '&');
            str = str.replace(/&lt;/ig, '<');
            str = str.replace(/&gt;/ig, '>');
            return str;
        },

        //------------------------------------------ copy to clipBord ---------------------------------------------//
        clipboardFunc: function (opt) {       //基于插件ZeroClipboard
            var copyProp = new copyProps(opt);
            var isSuccess = false;
            $('#' + copyProp.options.btnId).attr('data-isSuccess', isSuccess);
            if (!navigator.plugins.length <= 0 && !navigator.plugins['Shockwave Flash']) {     //判断是否安装flash player
                copyProp.options.failureFunc();
                return true;
            }
            var clip = new ZeroClipboard(document.getElementById(copyProp.options.btnId), {
                moviePath: copyProp.options.path
            });
            clip.setHandCursor(copyProp.options.setHandCursor);     //设置手势
            // 复制内容到剪贴板成功后的操作
            clip.on('complete', function (client, val) {
                isSuccess = true;
                $('#' + copyProp.options.btnId).attr('data-isSuccess', isSuccess);
                copyProp.options.successFunc();
            });
            var copytext = document.getElementById(copyProp.options.linkId).value;      //获取需要复制内容的对象id取值
            if (copytext == undefined)
                copytext = document.getElementById(copyProp.options.linkId).innerHTML;
            if (window.clipboardData) {        //for ie
                var copyBtn = document.getElementById(copyProp.options.btnId);
                copyBtn.onclick = function () {
                    window.clipboardData.setData('text', copytext);     //传递复制文本
                    isSuccess = true;
                    $('#' + copyProp.options.btnId).attr('data-isSuccess', isSuccess);
                    copyProp.options.successFunc();
                }
            }
        },

        //------------------------------------------ judge system ---------------------------------------------//
        judgeSystem: function () {
            var os = 'others';
            var nu = navigator.userAgent.toLowerCase(); //获取用户代理
            var isWin = (navigator.platform == 'Win32') || (navigator.platform == 'Windows');   //判断是否系统为windows
            var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");      //判断是否系统为Mac
            var isUnix = (navigator.platform == "X11") && !isWin && !isMac;     //判断是否系统为Unix
            var isLinux = (String(navigator.platform).indexOf("Linux") > -1);   //判断是否系统为Linux
            if (isWin) {
                if (nu.indexOf('windows nt 5.0') != -1)     //win2000
                    os = 'windows 2000';
                if (nu.indexOf('windows nt 5.1') != -1)     //winXP
                    os = 'windows XP';
                if (nu.indexOf('windows nt 6.0') != -1)     //winVista
                    os = 'windows Vista';
                if (nu.indexOf('windows nt 6.1') != -1)     //win7
                    os = 'windows 7';
                if (nu.indexOf('windows nt 6.2') != -1)     //win8
                    os = 'windows 8';
                if (nu.indexOf('windows nt 6.3') != -1)     //win8.1
                    os = 'windows 8.1';
                if (nu.indexOf('windows nt 6.4') != -1 || nu.indexOf('windows nt 10.0') != -1)  //win10
                    os = 'windows 10';
            }
            if (isMac)
                os = 'Mac';
            if (isUnix)
                os = 'Unix';
            if (isLinux)
                os = 'Linux';
            return os;
        },

        //------------------------------------------ judge browser ---------------------------------------------//
        judgeBrowser: function () {
            var nu = navigator.userAgent.toLowerCase();     //获取用户代理
            var browserV = 'others';
            if (nu.indexOf('chrome') != -1)     //chrome浏览器
                browserV = 'Chrome';
            if (nu.indexOf('firefox') != -1)    //Firefox浏览器
                browserV = 'Firefox';
            if (nu.indexOf('opr') != -1 || nu.indexOf('opera') != -1)        //Opera浏览器
                browserV = 'Opera';
            if (nu.indexOf('safari') != -1 && nu.indexOf('chrome') == -1)   //Safari浏览器
                browserV = 'Safari';
            if (nu.indexOf('rv:11.0') != -1)    //IE 11
                browserV = 'IE 11';
            if (nu.indexOf('msie 10.0') != -1)  //IE 10
                browserV = 'IE 10';
            if (nu.indexOf('msie 9.0') != -1)   //IE 9
                browserV = 'IE 9';
            if (nu.indexOf('msie 8.0') != -1)   //IE 8
                browserV = 'IE 8';
            if (nu.indexOf('msie 7.0') != -1)   //IE 7
                browserV = 'IE 7';
            if (nu.indexOf('msie 6.0') != -1)   //IE 6
                browserV = 'IE 6';
            return browserV;
        },

        //------------------------------------------ drag ---------------------------------------------//
        dragEle: function (opt) {
            var dragProp = new dragProps(opt);              //实例dragProps对象
            var parentObj = $(dragProp.options.parent);     //相对父层对象
            var thisObj = $(this);                          //当前元素对象
            var pW = parentObj[0].clientWidth;              //父层对象宽
            var pH = parentObj[0].clientHeight;             //父层对象高
            var tW = thisObj[0].clientWidth;                //当前元素宽
            var tH = thisObj[0].clientHeight;               //当前元素高
            var tL = thisObj[0].offsetLeft;                 //当前元素距左
            var tT = thisObj[0].offsetTop;                  //当前元素距顶
            var startX, startY;                             //当前元素被点击触发时的坐标
            var isDrag = false;                             //是否开始拖动
            thisObj.on('mousedown', function (e) {          //当前元素被点击触发后,即开始拖动动作
                isDrag = true;
                startX = e.clientX;
                startY = e.clientY;
                tL = thisObj[0].offsetLeft;                 //每次被点击后重新获取距左/距顶
                tT = thisObj[0].offsetTop;
                //以下内容为禁止页面在被拖动时选择文字内容
                document.onselectstart = function () {
                    return false;
                };   //ie
                $('html').css({
                    '-moz-user-select': 'none',
                    '-o-user-select': 'none',
                    '-khtml-user-select': 'none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none'
                });
            });
            parentObj.on('mousemove', function (e) {        //鼠标在父层对象内移动
                if (!isDrag)
                    return true;
                var x = e.clientX - startX + tL;        //计算当前元素应该所处的坐标
                var y = e.clientY - startY + tT;
                if (!dragProp.options.isOverflow) {     //当属性isOverflow为false时,计算坐标最大最小值
                    if (x >= pW - tW)
                        x = pW - tW;
                    if (x <= 0)
                        x = 0;
                    if (y >= pH - tH)
                        y = pH - tH;
                    if (y <= 0)
                        y = 0;
                }
                thisObj.css({'left': x, 'top': y});     //移动当前元素
            });
            parentObj.on('mouseup', function () {      //鼠标弹起时,拖动标志置为false,页面内容重新可选中
                isDrag = false;
                document.onselectstart = function () {
                    return true;
                };    //ie
                $('html').css({
                    '-moz-user-select': 'inherit',
                    '-o-user-select': 'inherit',
                    '-khtml-user-select': 'inherit',
                    '-webkit-user-select': 'inherit',
                    '-ms-user-select': 'inherit',
                    'user-select': 'inherit'
                });
            });
        }
    })
})(jQuery);