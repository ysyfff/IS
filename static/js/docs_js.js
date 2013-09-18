var IS = {
   imgMiddle: function(){
        var width = new Array($('#main-img').width(), 'px');
        $('#is-img-inner').css('width', width.join(''));
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

