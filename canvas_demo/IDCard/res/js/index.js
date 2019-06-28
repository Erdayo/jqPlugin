/**
 * @created 2019/6/10 15:49
 */
function IDCard() {
    this.baseProp = {
        width: 1240,
        height: 1754,
        cardW: 540,
        cardH: 350,
        frontW: 1240,
        frontH: 150,
        backW: 1240,
        backH: 150,
        frontSrc: '',
        backSrc: '',
        format: 'jpeg'
    };
    this.clipData = {
        front: [{x: 75, y: 136}, {x: 89, y: 783}, {x: 1115, y: 135}, {x: 1118, y: 740}],
        back: [{x: 70, y: 142}, {x: 70, y: 753}, {x: 1058, y: 154}, {x: 1058, y: 730}],
        frontCircle: 80,
        backCircle: 80,
        size: {
            frontW: 1118 - 75,
            frontH: 783 - 135,
            backW: 1058 - 70,
            backH: 753 - 142
        }
    };

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.globalCompositeOperation = 'destination-over';

    this.frontCanvas = document.getElementById('frontCanvas');
    this.frontCtx = this.frontCanvas.getContext('2d');

    this.backCanvas = document.getElementById('backCanvas');
    this.backCtx = this.backCanvas.getContext('2d');

    this.initCom = this.frontCtx.globalCompositeOperation;

    this.init();
}

IDCard.prototype = {
    init: function () {
        var self = this;
        this.initSetting();
        $('input').on('change', function () {
            var name = $(this).attr('name');
            switch (name) {
                case 'front':
                case 'back':
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        self.baseProp[name + 'Src'] = e.target.result;
                        self.drawImg(name);
                    };
                    reader.readAsDataURL($(this)[0].files[0]);
                    break;
                case 'size1':
                    self.clipData.frontCircle = $(this).val();
                    $('.front span').css({
                        width: $(this).val(),
                        height: $(this).val()
                    });
                    break;
                case 'size2':
                    self.clipData.backCircle = $(this).val();
                    $('.back span').css({
                        width: $(this).val(),
                        height: $(this).val()
                    });
                    break;
                case 'format':
                    self.baseProp.format = $(this).val();
                    break;
                default:
                    var tmpNum = name.match(/[0-9]/),
                        pos = name[name.length - 1].toLowerCase();
                    tmpNum -= 0;
                    if (tmpNum < 5) {
                        tmpNum -= 1;
                        self.clipData.front[tmpNum][pos] = $(this).val() - 0;
                        $('.front span[data-sub=' + tmpNum + ']').css({
                            left: self.clipData.front[tmpNum].x,
                            top: self.clipData.front[tmpNum].y
                        });
                    } else {
                        tmpNum -= 5;
                        self.clipData.back[tmpNum][pos] = $(this).val() - 0;
                        $('.back span[data-sub=' + tmpNum + ']').css({
                            left: self.clipData.back[tmpNum].x,
                            top: self.clipData.back[tmpNum].y
                        });
                    }
                    break;
            }
        });

        $('#complete1').click(function () {
            if (!self.baseProp.frontSrc) {
                alert('请先选择身份证国徽面图片');
                return;
            }
            self.drawImg('front', function () {
                self.drawWhite('front');
            });
        });
        $('#complete2').click(function () {
            if (!self.baseProp.backSrc) {
                alert('请先选择身份证人像面图片');
                return;
            }
            self.drawWhite('back', function () {
                self.drawWhite('back');
            });
        });

        $('#save').click(function () {
            self.saveImg();
        });
    },

    initSetting: function () {
        var frontSetting = this.clipData.front,
            backSetting = this.clipData.back,
            self = this;
        $('.left li.pos input').each(function () {
            var name = $(this).attr('name');
            var tmpNum = name.match(/[0-9]/),
                pos = name[name.length - 1].toLowerCase();
            tmpNum -= 0;

            if (tmpNum < 5) {
                tmpNum -= 1;
                if (pos == 'y') {
                    $('.front span[data-sub=' + tmpNum + ']').css({
                        left: frontSetting[tmpNum].x,
                        top: frontSetting[tmpNum].y
                    });
                }
                $(this).val(frontSetting[tmpNum][pos]);
            } else {
                tmpNum -= 5;
                if (pos == 'y') {
                    $('.back span[data-sub=' + tmpNum + ']').css({
                        left: backSetting[tmpNum].x,
                        top: backSetting[tmpNum].y
                    });
                }
                $(this).val(backSetting[tmpNum][pos]);
            }
        });
    },

    drawImg: function (type, callback) {
        var img = new Image(),
            self = this;
        img.src = this.baseProp[type + 'Src'];
        img.onload = function () {
            self.baseProp[type + 'H'] = Math.round(img.naturalHeight * self.baseProp[type + 'W'] / img.naturalWidth);
            self[type + 'Canvas'].height = self.baseProp[type + 'H'];
            self[type + 'Ctx'].clearRect(0, 0, self.baseProp[type + 'W'], self.baseProp[type + 'H']);
            self[type + 'Ctx'].drawImage(img, 0, 0, self.baseProp[type + 'W'], self.baseProp[type + 'H']);
            self.dragPoint(type);
            $('.' + type + ' span').show();
            if (typeof callback == 'function') {
                callback();
            }
        }
    },

    /**
     * 保存图片到本地
     */
    saveImg: function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        this.ctx.rect(0, 0, this.baseProp.width * 2, this.baseProp.height * 2);
        this.ctx.fill();
        var newFileName = new Date().getTime() + '.' + this.baseProp.format,
            img = document.getElementById('canvas').toDataURL('image/' + this.baseProp.format).replace("image/" + this.baseProp.format, "image/octet-stream;");
        var savaFile = function (data, filename) {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
        };
        savaFile(img, newFileName);
    },

    dragPoint: function (type) {
        var isMove = false,
            pos = {},
            wrap = $('.right'),
            curObj = $('.' + type),
            self = this;

        pos.left = wrap[0].offsetLeft + curObj[0].offsetLeft;
        pos.top = wrap[0].offsetTop + curObj[0].offsetTop;

        Array.prototype.forEach.call(document.querySelectorAll('.' + type + ' span'), function (sub) {
            sub.addEventListener('mousedown', function (e) {
                pos.startX = e.layerX;
                pos.startY = e.layerY;
                pos.obj = sub;
                pos.sub = sub.getAttribute('data-sub') - 0;
                isMove = true;
            });
            sub.addEventListener('mouseup', function (e) {
                isMove = false;
            });
        });

        Array.prototype.forEach.call(document.getElementsByClassName(type), function (sub) {
            var wrapW = sub.offsetWidth,
                wrapH = sub.offsetHeight;
            sub.addEventListener('mousemove', function (e) {
                if (!isMove) return;
                var curX = e.pageX - pos.left - pos.startX,
                    curY = e.pageY - pos.top - pos.startY,
                    tmpW = wrapW - self.clipData[type + 'Circle'],
                    tmpH = wrapH - self.clipData[type + 'Circle'];

                curX = Math.max(0, curX);
                curX = Math.min(curX, tmpW);
                curY = Math.max(0, curY);
                curY = Math.min(curY, tmpH);

                pos.obj.style.left = curX + 'px';
                pos.obj.style.top = curY + 'px';
                self.clipData[type][pos.sub] = {
                    x: curX,
                    y: curY
                };
                var tmpSub = (type == 'front' ? pos.sub + 1 : pos.sub + 5);
                $('input[name=pos' + tmpSub + 'X]').val(curX);
                $('input[name=pos' + tmpSub + 'Y]').val(curY);
            });
            sub.addEventListener('mouseleave', function (e) {
                isMove = false;
            });
        });
    },

    drawWhite: function (type) {
        var tmp = this.clipData[type],
            circle = this.clipData[type + 'Circle'],
            ctx = this[type + 'Ctx'];

        ctx.globalCompositeOperation = 'destination-in';

        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.moveTo(tmp[0].x + circle / 2, tmp[0].y);
        ctx.lineTo(tmp[2].x + circle / 2, tmp[2].y);
        ctx.lineTo(tmp[2].x + circle / 2, tmp[2].y + circle / 2);
        ctx.lineTo(tmp[2].x + circle, tmp[2].y + circle / 2);
        ctx.lineTo(tmp[3].x + circle, tmp[3].y + circle / 2);
        ctx.lineTo(tmp[3].x + circle / 2, tmp[3].y + circle / 2);
        ctx.lineTo(tmp[3].x + circle / 2, tmp[3].y + circle);
        ctx.lineTo(tmp[1].x + circle / 2, tmp[1].y + circle);
        ctx.lineTo(tmp[1].x + circle / 2, tmp[1].y + circle / 2);
        ctx.lineTo(tmp[1].x, tmp[1].y + circle / 2);
        ctx.lineTo(tmp[0].x, tmp[0].y + circle / 2);
        ctx.lineTo(tmp[0].x + circle / 2, tmp[0].y + circle / 2);

        for (var i in tmp) {
            ctx.moveTo(tmp[i].x, tmp[i].y);
            ctx.arc(tmp[i].x + circle / 2, tmp[i].y + circle / 2, circle / 2, 0, Math.PI * 2, false);
        }
        ctx.fill();
        ctx.closePath();

        ctx.globalCompositeOperation = 'destination-over';
        ctx.beginPath();
        ctx.rect(0, 0, this.baseProp[type + 'W'], this.baseProp[type + 'H']);
        ctx.fill();

        ctx.globalCompositeOperation = this.initCom;
        this.scaleCanvas(type);
    },

    scaleCanvas: function (type) {
        var img = document.getElementById(type + 'Canvas').toDataURL('image/' + this.baseProp.format).replace("image/" + this.baseProp.format, "image/octet-stream;"),
            tmp = this.baseProp.cardW / this.clipData.size[type + 'W'],
            imgObj = new Image(),
            self = this,
            curW = this.clipData.size[type + 'W'] * tmp,
            curH = this.clipData.size[type + 'H'] * tmp,
            pos = [(this.baseProp.width - curW) * .5 + curW * .4, (this.baseProp.height * .5 - curH) * .5 + curH * .4];

        this.ctx.setTransform(tmp, 0, 0, tmp, 0, 0);

        imgObj.src = img;
        imgObj.onload = function () {
            if (type == 'front') {
                self.ctx.drawImage(imgObj, pos[0], pos[1], self.baseProp[type + 'W'], self.baseProp[type + 'H']);
            } else {
                self.ctx.drawImage(imgObj, pos[0], pos[1] + self.baseProp.height * .8, self.baseProp[type + 'W'], self.baseProp[type + 'H']);
            }
        };
    }

};

var ic = new IDCard();
