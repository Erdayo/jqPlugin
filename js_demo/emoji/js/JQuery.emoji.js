;(function ($) {
    var emojis = function (opt) {
        this.defaults = {
            'editArea': '.edit',
            'btnEmoji': '.btn_emoji',
            'btnSubmit': '.btn_submit',
            'imgPath': 'images/emojis/',
            'width': '420',
            'height': '160',
            'background': '#fff',
            'border': '1px solid #000'
        };
        this.options = $.extend({}, this.defaults, opt);
    };

    $.fn.emojiFunc = function (options) {
        var emoji = new emojis(options);
        var editArea = $(emoji.options.editArea);
        var btn = $(emoji.options.btnEmoji);
        var btnSub = $(emoji.options.btnSubmit);
        var path = emoji.options.imgPath;
        var saL = btn[0].offsetLeft + 'px';
        var saT = btn[0].offsetTop + btn[0].clientHeight + 'px';
        var saName = 'selectArea';
        var imgName = 'faceImg';
        var nowIp = null;
        var count = 0;
        var selectArea = '<div class="' + saName + '" style="position: absolute; left: ' + saL + '; top: ' + saT + '; width: ' + emoji.options.width + 'px; height: ' + emoji.options.height + 'px; border: ' + emoji.options.border + '; background: ' + emoji.options.background + '; padding: 5px; cursor: pointer;z-index: 9999;"></div>';
        var saObj = null;
        editArea.html('');
        initComments();
        btn.click(function () {
            if (saObj != null)
                saObj.remove();
            $(this).parent().append(selectArea);
            saObj = $('.' + saName);
            initFace(saObj);
            var imgObj = $('.' + imgName);
            imgObj.click(function () {
                var copy = $(this).clone();
                copy.removeAttr('class');
                editArea.append(copy);
                saObj.remove();
            });
        });

        var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=' + Math.random();
        $.getJSON(url, function (data) {
            //alert(data.Ip);//弹出本地ip
            nowIp = data.Ip;
        });
        btnSub.click(function(){
            count = localStorage.getItem('count');
            if(editArea.html() == '')
                return true;
            var content = editArea.html();
            var nowDate = new Date();
            var nowTime = nowDate.getFullYear() +'.'+ (parseInt(nowDate.getMonth())+1) +'.'+ nowDate.getDate()+' '+nowDate.getHours() +':'+nowDate.getMinutes() +':' + nowDate.getSeconds();
            var createComment = '<div class="comment"> <div class="comeFrom"> <span class="ipValue">来自IP: '+nowIp+'</span> <span class="nowTime"> 发表于: '+nowTime+'</span> </div> <div class="content">'+content+'</div> </div>';
            $('body').append(createComment);
            editArea.html('');
            count++;
            localStorage.setItem('count',count);
            localStorage.setItem('nowIp'+count,nowIp);
            localStorage.setItem('nowTime'+count,nowTime);
            localStorage.setItem('content'+count,content);
        });

        //初始化表情
        function initFace(obj) {
            for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 15; j++) {
                    var createImg = '<img class="' + imgName + '" src="' + path + (j + 15 * i + 1) + '.gif" style="margin: 2px">';
                    obj.append(createImg);
                }
            }
        }

        //初始化评论
        function initComments(){
            var count = localStorage.getItem('count');
            for( var i =1;i<=count;i++)
            {
                var content = localStorage.getItem('content'+i);
                var nowTime = localStorage.getItem('nowTime'+i);
                var nowIp = localStorage.getItem('nowIp'+i);
                var createComment = '<div class="comment"> <div class="comeFrom"> <span class="ipValue">来自IP: '+nowIp+'</span> <span class="nowTime"> 发表于: '+nowTime+'</span> </div> <div class="content">'+content+'</div> </div>';
                $('body').append(createComment);
            }

        }
    }
})(jQuery);