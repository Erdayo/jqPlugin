(function ($) {
    var lazyProps = function (opt) {
        this.default = {
            name: '.lazyImg'
        },
            this.options = $.extend(this.default, opt);
    };

    $.fn.lazy = function (opt) {
        var prop = new lazyProps(opt),
            name = $(prop.options.name),
            tops = [];

        name.each(function () {
            var top = $(this).offset().top;
            tops.push(top);
        });

        check();

        $(window).scroll(function () {
            check();
        });

        function check() {
            var scrollTop = $(window).scrollTop();
            for (var i = 0; i < tops.length; i++) {
                if (scrollTop+$(window).height() >= tops[i]) {
                    var src = name.eq(i).attr('data-src');
                    name.eq(i).attr('src', src);
                }
            }
        }
    }

})(jQuery);
















