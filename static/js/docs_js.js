
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
    // t: current time, b: begInnIng value, c: change In value, d: duration

    easeInQuad: function (t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (t, b, c, d) {
        return -c *(t/=d)*t + b;
    },
    easeInOutQuad: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInCubic: function (t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },
    easeOutCubic: function (t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },
    easeInOutCubic: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },
    easeInQuart: function (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    easeOutQuart: function (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutQuart: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    easeInQuint: function (t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function (t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    easeInSine: function (t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function (t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function (t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
    easeInExpo: function (t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function (t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function (t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    easeOutCirc: function (t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeInOutCirc: function (t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },
    easeInElastic: function (t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic: function (t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    easeInOutElastic: function (t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    easeInBack: function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    easeInBounce: function (t, b, c, d) {
        return c - jQuery.easing.easeOutBounce (d-t, 0, c, d) + b;
    },
    easeOutBounce: function (t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },
    easeInOutBounce: function (t, b, c, d) {
        if (t < d/2) return jQuery.easing.easeInBounce (t*2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
});

var IS = {
    imgMiddle: function(){
        var width = new Array($('#main-img').width(), 'px');
        $('#is-img-inner').css('width', width.join(''));
    },
    //resize防抖
    debounce: function(func, wait, immediate){
        var timeout;
        return function(){
            var context = this, args = arguments;
            var later = function(){
                timeout = null;
                if(!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if(callNow) func.apply(context, args);
        };
    },
    //ensure imgWidth <= leftWidth
    smallerImg: function(){
        var left = $('#left-content'),
            img = $('#main-img'),
            leftWidth = left.width(),
            imgWidth = img.width();
        if(imgWidth >= leftWidth){
            var IW = new Array(leftWidth, 'px');
            img.css('width', IW.join(''));
        }else{
            img.css('width', '100%');
        }
    },
    runDown: function(t, b, c, d, el){
        var topDis = new Array($.easing.easeOutBounce(t,b,c,d), 'px');
        el.css('top', topDis.join(''));
        if(t < d){
            t++;
            setTimeout(function(){IS.runDown(t,b,c,d,el)}, 10);
        }
    },
    runUp: function(t, b, c, d, el){
        var topDis = new Array($.easing.easeInBounce(t,b,c,d), 'px');
        el.css('top', topDis.join(''));
        if(t < d){
            t++;
            setTimeout(function(){IS.runUp(t,b,c,d,el)}, 10);
        }
    }
};

//nav的事件委托
(function($){
    $('#is-nav').delegate('li', 'click', function(){
        $.each($('#is-nav').find('li'), function(i, obj){
            var obj = $(obj);
            if(obj.hasClass('active')) obj.removeClass('active');
        });
        $(this).addClass('active');
    });
})(jQuery);

//hand的颜色改变
(function($){
    $.each([$('#left-hand'), $('#right-hand')], function(i, obj){
        var obj = $(obj);
        obj.mouseenter(function(){
            obj.find('span').addClass('active-hand');
        }).mouseleave(function(){
            obj.find('span').removeClass('active-hand');
        })
    });
})(jQuery);

//注册resize事件
(function($){
    if(document.addEventListener){ //for firefox and chrome
        window.addEventListener('resize', IS.debounce(function(event){
            IS.smallerImg();
        }, 300), false);
    }else if(window.attachEvent){ //for ie
        window.attachEvent('onresize', IS.debounce(function(event){
            IS.smallerImg();
        }, 300));
    }
})(jQuery);

//rmHover的事件委托
(function($){
    var iHeight = 104,
        area = $('#roll-area'),
        tmp = $('#roll-tmp'),
        ul = $('#roll-ul'),
        hover = $('#curr-img-hover'),
        height = area.height(),
        nSee = parseInt(height/iHeight),
        nImg = ul.find('li').length,
        nPart = parseInt(nImg/nSee),
        curPart = 0, t, b, c, d, begin=0;
    ul.delegate('li', 'click', function(){
        var the = $(this),
            nCurr = the.data('seq'),
            inPart = parseInt(nCurr/nSee);

        if(inPart == curPart){//just rm hover
            /*return c*(t/=d)*t + b;*/
            /*t: current time（当前时间）；
              b: beginning value（初始值）；
              c: change in value（变化量）；
              d: duration（持续时间）。*/
            t = 0;
            b = begin*iHeight; //0
            c = (nCurr-begin)*iHeight;//104
            d = iHeight;//1
            
            if(begin < nCurr) IS.runDown(t, b, c, d, hover);
            else if(begin > nCurr) IS.runUp(t, b, c, d, hover);
            begin = nCurr;
        }else if(inPart > curPart){//rm down ul
            curPart = inPart;
            console.log(curPart, 'down');
        }else if(inPart < curPart){//rm up ul
            curPart = inPart;
            console.log(curPart, 'up');
        }
    });
})(jQuery);

