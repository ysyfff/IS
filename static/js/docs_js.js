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
        curPart = 0;
        tmp.css('top', '-124px');
    ul.delegate('li', 'click', function(){
        var the = $(this),
            nCurr = the.data('seq'),
            inPart = parseInt(nCurr/nSee);

        if(inPart == curPart){//just rm hover
            console.log(curPart, 'hover');
            var topDis = new Array(nCurr*104, 'px');
            hover.css('top', topDis.join(''));
        }else if(inPart > curPart){//rm down ul
            curPart = inPart;
            console.log(curPart, 'down');
        }else if(inPart < curPart){//rm up ul
            curPart = inPart;
            console.log(curPart, 'up');
        }
    });
})(jQuery);
