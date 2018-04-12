/**
 * @author Erda
 * @created 2017/8/23 15:11
 */

function Player() {
    this.audio = document.createElement('audio');
    this.curSongId = 102425546;
    this.isCreate = false;
    this.isDrag = true;
    this.init();
}

Player.prototype = {
    /**
     * 初始化
     */
    init: function () {
        this.getSongList();
        this.startSong();
        this.endSong();
        this.demand();
    },

    /**
     * 创建音频
     */
    createAudio: function () {
        var li = $('.player-list li'),
            li0 = li.eq(Math.random() * li.length),
            self = this;
        this.curSongId = li0.attr('data-mid');
        this.getAudio(function () {
            $('.player-body .song-name span').text(li0.text());
            li0.addClass('on');
            self.scrollView(li0, li0.index());
            self.audio.setAttribute('src', self.audioUrl);
            self.audio.setAttribute('controls', 'true');
            self.audio.style.display = 'none';
            $('.player-body').append(this.audio);
            self.audioControl();
        });
    },

    /**
     * 音频控制
     */
    audioControl: function () {
        var btnPrev = $('.prev'),
            btnPlay = $('.play'),
            btnNext = $('.next'),
            btnMode = $('.mode'),
            self = this;
        btnPlay.click(function () {
            var use = $(this).find('use');
            if (use.attr('xlink:href') == '#icon-pause') {
                self.audio.pause();
                use.attr('xlink:href', '#icon-play');
            } else {
                self.audio.play();
                use.attr('xlink:href', '#icon-pause');
            }
        });

        btnMode.click(function () {
            var use = $(this).find('use');
            if (use.attr('xlink:href') == '#icon-xunhuan') {
                use.attr('xlink:href', '#icon-danquxunhuan');
                $(this).attr('data-id', '1');
            } else if (use.attr('xlink:href') == '#icon-danquxunhuan') {
                use.attr('xlink:href', '#icon-suijibofang');
                $(this).attr('data-id', '2');
            } else {
                use.attr('xlink:href', '#icon-xunhuan');
                $(this).attr('data-id', '0');
            }
        });

        btnPrev.click(function () {
            self.prevSong();
        });

        btnNext.click(function () {
            self.nextSong();
        });
    },

    /**
     * 获取排行榜
     */
    getRank: function () {
        var self = this;
        $.ajax({
            url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_opt.fcg?page=index&format=html&tpl=macv4&v8debug=1&jsonCallback=jsonCallback',
            dataType: 'jsonp',
            jsonpCallback: 'jsonCallback',
            cache: true,
            success: function (res) {
                self.getList(res[0].List[9].topID, res[0].List[9].update_key);
            }
        });
    },

    /**
     * 根据排行榜获取具体排行
     */
    getList: function (id, date) {
        var self = this;
        $.ajax({
            url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?tpl=3&page=detail&date=' + date + '&topid=' + id + '&type=top&song_begin=0&song_num=100&g_tk=5381&jsonpCallback=MusicJsonCallbacktoplist&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0',
            dataType: 'jsonp',
            jsonpCallback: 'MusicJsonCallbacktoplist',
            cache: true,
            success: function (res) {
                self.writeList(res);
            }
        });
    },

    /**
     * 写入排行榜歌单列表
     */
    writeList: function (list) {
        var str = '';
        for (var i = 0; i < list.songlist.length; i++) {
            var song = list.songlist[i],
                song_id = song.data.songid,
                song_name = song.data.songname,
                singer = song.data.singer,
                singers = [];
            for (var j = 0; j < singer.length; j++) {
                singers.push(singer[j].name);
            }
            singers = singers.join('/');
            str += '<li data-id="' + song_id + '"><p class="song-name">' + song_name + ' - ' + singers + '</p></li>';
        }
        $('.player-list ul').append(str);
    },

    /**
     * 获取歌单列表
     */
    getSongList: function () {
        var self = this,
            rnd = Math.random().toString().split('.')[1];
        $.ajax({
            url: './qqmusic.php?date=' + new Date().getTime() + '&rand=' + rnd + '&type=favorite',
            dataType: 'jsonp',
            jsonpCallback: 'MusicJsonCallback' + rnd,
            success: function (res) {
                self.writeSongList(res.songlist);
            }
        });
    },

    /**
     * 获取音频文件
     */
    getAudio: function (func) {
        var self = this,
            rnd = Math.random().toString().split('.')[1];
        $.ajax({
            url: './qqmusic.php?songid=' + self.curSongId + '&rand=' + rnd + '&type=audio',
            dataType: 'jsonp',
            jsonpCallback: 'MusicJsonCallback' + rnd,
            success: function (res) {
                var arr = res.data.items;
                self.audioUrl = 'http://dl.stream.qqmusic.qq.com/' + arr[0].filename + '?vkey=' + arr[0].vkey + '&guid=2159035735&uin=0&fromtag=66';
                func();
            }
        });
    },

    /**
     * 写入歌单列表
     */
    writeSongList: function (list) {
        var str = '';
        for (var i = 0; i < list.length; i++) {
            var singers = [];
            for (var j = 0; j < list[i].singer.length; j++) {
                singers.push(list[i].singer[j].name);
            }
            singers = singers.join(' / ');
            if(list[i].msgid == 0){
                str += '<li data-id="' + list[i].songid + '" data-mid="' + list[i].songmid + '"><p class="song-name">' + list[i].songname + ' - ' + singers + '</p></li>';
            }
        }
        $('.player-list ul').append(str);
        if (!this.isCreate) {
            this.createAudio();
            this.isCreate = !this.isCreate;
        }
    },

    /**
     * 歌单
     */
    demand: function () {
        var player_list = $('.player-list li'),
            self = this;
        player_list.live('click', function () {
            var songId = $(this).attr('data-mid');
            self.changeSong(songId, $(this).text(), $(this));
        });
    },

    /**
     * 上一首
     */
    prevSong: function () {
        var prevSong,
            btnMode = $('.mode'),
            song = $('.player-list li'),
            curSong = song.parent().find('.on');
        if (btnMode.attr('data-id') == 0) {
            prevSong = curSong.prev();
            if (prevSong.length == 0) {
                prevSong = song.eq(song.length - 1);
            }
        } else if (btnMode.attr('data-id') == 1) {
            prevSong = curSong;
        } else if (btnMode.attr('data-id') == 2) {
            var len = song.length,
                curNum = parseInt(Math.random() * len);
            while (curSong.index() == curNum) {
                curNum = ~~Math.random() * len;
            }
            prevSong = song.eq(curNum);
        }
        var songId = prevSong.attr('data-mid');
        this.changeSong(songId, prevSong.text(), prevSong);
    },

    /**
     * 下一首
     */
    nextSong: function () {
        var nextSong,
            btnMode = $('.mode'),
            song = $('.player-list li'),
            curSong = song.parent().find('.on');
        if (btnMode.attr('data-id') == 0) {
            nextSong = curSong.next();
            if (nextSong.length == 0) {
                nextSong = song.eq(0);
            }
        } else if (btnMode.attr('data-id') == 1) {
            nextSong = curSong;
        } else if (btnMode.attr('data-id') == 2) {
            var len = song.length,
                curNum = parseInt(Math.random() * len);
            while (curSong.index() == curNum) {
                curNum = ~~Math.random() * len;
            }
            nextSong = song.eq(curNum);
        }
        var songId = nextSong.attr('data-mid');
        this.changeSong(songId, nextSong.text(), nextSong);
    },

    /**
     * 改变音频
     */
    changeSong: function (id, txt, liObj) {
        this.curSongId = id;
        var self = this;
        this.getAudio(function () {
            self.audio.setAttribute('src', self.audioUrl);
            self.audio.setAttribute('autoplay', 'true');
            $('.play use').attr('xlink:href', '#icon-pause');
            $('.player-body .song-name span').text(txt);
            liObj.addClass('on').siblings().removeClass('on');
            self.scrollView(liObj, liObj.index());
            self.isDrag = true;
        });
    },

    /**
     * 开始播放音频
     */
    startSong: function () {
        var self = this;
        this.audio.addEventListener('canplaythrough', function () {
            self.audio.play();
            $('.play use').attr('xlink:href', '#icon-pause');
            if (self.isDrag) {
                self.getLyric(self.curSongId);
            }
            self.controlProgress();
        });
    },

    /**
     * 音频播放结束
     */
    endSong: function () {
        var self = this;
        this.audio.addEventListener('ended', function () {
            self.audio.pause();
            $('.play use').attr('xlink:href', '#icon-play');
            self.nextSong();
        });
    },

    /**
     * 获取歌词
     */
    getLyric: function (id) {
        var self = this;
        $.ajax({
            url: './qqmusic.php?id=' + id+'&type=lyric',
            dataType: 'jsonp',
            jsonpCallback: 'MusicJsonCallback_lrc',
            cache: true,
            success: function (res) {
                if (res.code == 0) {
                    self.writeLyric(utf8to16(base64decode(res.lyric)));
                } else {
                    self.writeLyric('暂未找到歌词');
                }
            }
        });
    },

    /**
     * 写入歌词
     */
    writeLyric: function (lyric) {
        var create = document.createElement('div');
        create.innerHTML = lyric;
        var arr = create.innerText.split('\n'),
            str = '';
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == '' || isNaN(parseInt(arr[i].split('[')[1].split(':')))) {
                continue;
            }
            var con = arr[i].split(']')[1],
                timer = arr[i].split('[')[1].split(']')[0];
            if (con != '') {
                str += '<p data-time="' + timer + '">' + con + '</p>';
            }
        }
        $('.player-lyric').html(str);
        $('.player-lyric')[0].scrollTop = 0;
    },

    /**
     * 进度控制
     */
    controlProgress: function () {
        var minute = parseInt(this.audio.duration / 60),
            second = parseInt(this.audio.duration % 60),
            progress = $('#progress'),
            progress_ctrl = progress.find('i'),
            progress_tip = progress.prev('p'),
            self = this,
            is_drag = false,
            count = 0;
        $('.player-lyric p').removeClass('on');
        progress_tip.find('label').text((minute >= 10 ? minute : '0' + minute) + ':' + (second >= 10 ? second : '0' + second));
        this.audio.ontimeupdate = function () {
            var curProgress = self.audio.currentTime / self.audio.duration,
                curMin = parseInt(self.audio.currentTime / 60),
                curSecond = parseInt(self.audio.currentTime % 60),
                curLyric = $('.player-lyric p').eq(count);
            progress_ctrl.css({
                left: curProgress * 100 + '%'
            });
            progress_tip.find('span').text((curMin >= 10 ? curMin : '0' + curMin) + ':' + (curSecond >= 10 ? curSecond : '0' + curSecond));

            if (curLyric.length == 0) {
                return;
            }
            curLyric.addClass('on').siblings().removeClass('on');
            if (curLyric.next().length == 0) {
                return;
            }

            var lyric_time = curLyric.next().attr('data-time');
            if (lyric_time.indexOf(':') == -1) {
                return;
            }
            // while (lyric_time.split(':')[0] != curMin && lyric_time.split(':')[1].split('.')[0].trim() != curSecond){
            //     count++;
            // }
            if (lyric_time.split(':')[0] == curMin && lyric_time.split(':')[1].split('.')[0].trim() == curSecond) {
                count++;
                curLyric.next().addClass('on').siblings().removeClass('on');
                if (curLyric.next() != undefined) {
                    self.scrollView(curLyric.next(), count);
                }
            }
        };

        progress_ctrl.on('mousedown', function (e) {
            is_drag = true;
        });

        progress.on('mousemove', function (e) {
            if (is_drag) {
                var move = e.offsetX / $('#progress').width(),
                    curTime = move * self.audio.duration;
                progress_ctrl.css({
                    left: move * 100 + '%'
                });
            }
        });

        progress.on('mouseup', function (e) {
            is_drag = false;
            var move = e.offsetX / $('#progress').width(),
                curTime = move * self.audio.duration;
            self.audio.currentTime = curTime;
            self.isDrag = false;
        });
    },

    /**
     * 滚动显示
     */
    scrollView: function (obj, sub) {
        obj.parent()[0].scrollTop = obj[0].scrollHeight * sub;
    }
};

var player = new Player();
