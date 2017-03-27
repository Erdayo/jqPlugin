/**
 * Created by Administrator on 2016/11/7.
 */

;(function ($) {
    var barrageProps = function (opt) {
        this.defaults = {
            content: '#content',
            comment: '.comment'
        };
        this.options = $.extend({},this.defaults,opt);
    };

    $.fn.barrage = function (opt) {
        var barrageProp = new barrageProps(opt),
            comObj = $(barrageProp.options.comment),
            comH = comObj.height(),
            comW = comObj.width(),
            btnObj = $(this),
            startPos = [],
            content,
            iCount = 0,
            barObj,
            nickname = prompt('请输入昵称:','');
        while ( nickname.trim().length == 0)
        {
            nickname = prompt('请输入昵称:','');
        }

        btnObj.click(function(){
            iCount++;
            content = $(barrageProp.options.content).val();
            startPos = [comW, parseInt(Math.random() * (comH-30))];
            var color = 'hsl('+parseFloat(Math.random()*360)+',100%,50%)',
                createBar = '<div class="bar" style="position: absolute; left: '+startPos[0]+'px; top: '+startPos[1]+'px; font-size: 18px; color:'+color+'; white-space:nowrap;">'+content+'</div>';
            comObj.append(createBar);
            barObj = $('.bar');
            barObj.animate({'left':-barObj.width()},comW*10,function(){
                $(this).remove();
            });
        });
    }
})(jQuery);


















