var IS = {
   imgMiddle: function(){
        var width = new Array($('#main-img').width(), 'px');
        $('#is-img-inner').css('width', width.join(''));
    },
};

(function($){
    $('#is-nav').delegate('li', 'click', function(){
        $.each($('#is-nav').find('li'), function(i, obj){
            var obj = $(obj);
            if(obj.hasClass('active')) obj.removeClass('active');
        });
        $(this).addClass('active');
    });
})(jQuery);

