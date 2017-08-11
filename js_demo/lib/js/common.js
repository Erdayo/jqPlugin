//banner-滑动效果调用
$('.banner').swipeBanner({
    'control': '.control',      //控制类
    'btn_prev': '.btn_prev',    //上一页
    'btn_next': '.btn_next',    //下一页
    'interval': 3000,           //间隔时间
    'seamless': true            //无缝滚动
});
$('.banner2').swipeBanner({
    'control': '.control',      //控制类
    'btn_prev': '.btn_prev',    //上一页
    'btn_next': '.btn_next',    //下一页
    'interval': 3000,           //间隔时间
    'seamless': false            //有缝滚动
});

$('.banner3').fadeBanner();

$('.bkTop').backTop({
    'ratio': 0.4,        //距顶部与屏幕的比例
    'animate': false      //是否使用动画
});

$('.bkTop2').backTop({
    'ratio': 0.4,        //距顶部与屏幕的比例
    'animate': true      //是否使用动画
});

$('.nav').navSelect({
    'grade':2     //具体判断栏目的子级
});

$('.addFavorite').addFavorite(window.location.href,$(document).attr('title'));

function check(){
    var me = $('.matchEmail');
    var meFlag = me.matchEmail(me.val());       //邮箱匹配
    me.parent().find('.tip').text(meFlag);

    var mp = $('.matchPhone');
    var mpFlag = mp.matchPhone(mp.val());       //电话号码匹配
    mp.parent().find('.tip').text(mpFlag);

    var mq = $('.matchQQ');
    var mqFlag = mq.matchQQ(mq.val());          //QQ号匹配
    mq.parent().find('.tip').text(mqFlag);

    var mI = $('.matchIDCard');
    var mIFlag = mI.matchIdCard(mI.val());      //身份证匹配
    mI.parent().find('.tip').text(mIFlag);
}
hTb();
function hTb(){
    var str = $('body').htmlToUbb($('.banner').html().split(' ').join(''));
    for (var i = 0; i < str.split('\n\n').length; i++){
        str = str.split('\n\n').join('\n');
    }
    $('.hTb').val(str);
}

$('.hTb').focus(function(){
   $(this).select();
});

var successFunc = function(){
    alert('success');
};
var failureFunc = function(){
  alert('failure');
};
$('#parentId').clipboardFunc({
    'successFunc':successFunc,
    'failureFunc':failureFunc
});

var txt = $('body').judgeSystem();
$('.system').text('系统:'+txt);

var txt2 = $('body').judgeBrowser();
$('.browser').text('浏览器:'+txt2);

$('.drag').dragEle();

$('.drag2').dragEle({
    'parent':'.bigParent',
    'isOverflow':false
});
