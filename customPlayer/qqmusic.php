<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/8/25
 * Time: 9:54
 */

$type = $_GET['type'];


switch ($type) {
    case 'favorite':
        $date = $_GET['date'];
        $rand = $_GET['rand'];
        $url = "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=1&nosign=1&song_begin=0&song_num=100&ctx=1&disstid=1259022166&_=${date}&g_tk=827536686&jsonpCallback=MusicJsonCallback${rand}&loginUin=949266892&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0";
        break;

    case 'lyric':
        $songId = $_GET['id'];
        $url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=MusicJsonCallback_lrc&pcachetime=1523497970697&songmid=${songId}&g_tk=5381&jsonpCallback=MusicJsonCallback_lrc&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0";
        break;

    case 'audio':
        $rand = $_GET['rand'];
        $songId = $_GET['songid'];
        $url = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&jsonpCallback=MusicJsonCallback${rand}&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205361747&callback=MusicJsonCallback${rand}&uin=0&songmid=${songId}&filename=C400${songId}.m4a&guid=2159035735";
        break;

    default:
        break;
}


$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_REFERER, 'https://y.qq.com/portal/profile.html');

$result = curl_exec($ch);
curl_close($ch);


print_r(substr($result, 0, -1));