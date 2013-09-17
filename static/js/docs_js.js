var oj = {};
oj._status_str = {
        0: '<span class="label label-success">Orz. Accepted</span>',
        1: '<span class="label label-info">Presentation Error</span>',
        2: '<span class="label label-warning">Time Limit Exceeded</span>',
        3: '<span class="label label-warning">Memory Limit Exceeded</span>',
        4: '<span class="label label-important">Wrong Answer</span>',
        5: '<span class="label label-important">Runtime Error</span>',
        6: '<span class="label label-inverse">Output Limit Exceeded</span>',
        7: '<span class="label label-important">Compile Error</span>',
        8: '<span class="label label-info">System Error</span>',
        '-1': '<span class="label">Oops. Waiting</span>'
    };
/*===================================================================================================================*/
/*===================================================================================================================*/
/*==========================================tool tool tool===========================================================*/
/*===================================================================================================================*/

var tool = (function($){
    return {
        getCookie: function(name) {
          var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = $.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },
        escapeStr: function(str){
            str = str.replace(/\</ig, '&#60;');
            str = str.replace(/\>/ig, '&#62;');
            return str;
        },
        delBBB: function(str){
            str = str.replace(/(^\s*)|(\s*$)/ig, '');
            str = str.replace(/(\s+)/ig, ' ');
            return str;
        },
        imgIndent: function(){
            $.each($('p'), function(i, pobj){
                if($(pobj).children().is('img')){
                    $(pobj).css('text-indent', '0');
                }
            });
        },
    }
})(jQuery);

/*===================================================================================================================*/
/*===================================================================================================================*/
/*==========================================contest contest==========================================================*/
/*===================================================================================================================*/
/*===================================================================================================================*/
var contest = (function($){
    var gRanklistFooter = true;
    var gRanklistReturn;
    var dateID = '#date';
    var weekID = '#week';
    var clockID = '#clock';
    var date, hh, mm, ss, localInterval, remoteInterval;
    var startSecond = parseFloat($('#start-second').val());
    var endSecond = parseFloat($('#end-second').val());
    var timeDiff = endSecond-startSecond;
    var timerIn = document.getElementById("timerIn");
    var remainDiv = document.getElementById("remain-div");
    var newCome = true;
    var localReturn, remoteReturn;
    var con_id = $('#contest-id').val();
    var pro_num = $('#problem-num').val();
    var jsearch_content = {};

    return {
        getConURL: function(pid){
            var url = new Array('/contest/', pid, '/problem/');
            return url.join("");
        },
        conDisplay: function(data){
            var h = tag('tbody');
            $.each(data.contests, function(i, cotst){
                if(cotst.is_contest) type = 'Contest';
                else type = 'Experiment';

                if(cotst.is_private) t_purview = tag('td', 'Private').attr('class', 'private');
                else t_purview = tag('td', 'Public').attr('class', 'public');

                if(cotst.status == 0) {
                    t_status = tag('td', 'Running').attr('class', 'running');
                    t_link_id = tag('td',
                        tag('a', cotst.id).attr('href', contest.getConURL(cotst.id)));
                    t_link_title = tag('td',
                        tag('a', cotst.title).attr('href', contest.getConURL(cotst.id))).attr('width', '450px');
                }
                else if(cotst.status == 1) {
                    t_status = tag('td', 'Pending').attr('class', 'pending');
                    t_link_id = tag('td',
                        tag('a', cotst.id).attr('href', contest.getConURL(cotst.id)));
                    t_link_title = tag('td',
                        tag('a', cotst.title).attr('href', contest.getConURL(cotst.id))).attr('width', '450px');
                }
                else if(cotst.status == 2) {
                    t_status = tag('td', 'Ended').attr('class', 'ended');
                    t_link_id = tag('td',
                        tag('a', cotst.id).attr('href', contest.getConURL(cotst.id)));
                    t_link_title = tag('td',
                        tag('a', cotst.title).attr('href', contest.getConURL(cotst.id))).attr('width', '450px');
                }
                h.push(tag('tr',
                    t_link_id,
                    t_link_title,
                    tag('td', type),
                    tag('td', cotst.start_time),
                    tag('td', cotst.end_time),
                    t_status,
                    t_purview,
                    tag('td', cotst.holder)
                    )
                );
            });
            $("#tableID tbody").html(h.html());
        },
        getConList: function(page){
            var search_content = {};
            if(!isNaN(page)) search_content.page = page;
            search_content.csrfmiddlewaretoken = tool.getCookie('csrftoken');
            search_content.operation = 'ALL';
            $.post('/contest/jlist/', search_content, function(data){
                contest.conDisplay(data);
                $('#page_area').pagination({
                    'max': data.max,
                    'page': data.page,
                    'callback': contest.getConList
                });
                position.footer($(document).height());
            });
        },
        theadDisplay: function(){
            var th = tag('thead');
            var th_num = []
            for (var i = 1; i <= pro_num; i++) {
                seq = String.fromCharCode(i+64);
                th_num[i] = tag('th',
                    tag('a', seq).attr('href', '/contest/'+con_id+'/problem/'+i+'/').attr('class', 'pro_seq'));
            }
            th.push(tag('tr',
                tag('th', 'Rank'),
                tag('th', 'User ID'),
                tag('th', 'Nick Name'),
                tag('th', 'Accepted'),
                tag('th', 'Time Used'),
                th_num
                )
            )
            $('#tableID thead').html(th.html());
        },
        getRanklist: function(page){
            if(!isNaN(page)) jsearch_content.page=page;
            jsearch_content.csrfmiddlewaretoken =  tool.getCookie('csrftoken');

            var h = tag('tbody');
            $.post('/contest/'+con_id+'/jranklist/', jsearch_content, function(data){
                $.each(data.userRank, function(i, ur){
                    var td_style=[];
                    for(var k=0; k<pro_num; k++){
                        td_style[k] = tag('td', '').attr('id', 'nosubmit');
                    }
                    $.each(data.proRank[i], function(j, pr){
                        if(pr.is_aced==true){
                            if(pr.submit_count>0){
                                if(pr.time_used.length>8){
                                    ac_id="ac_wr_long";
                                }else{
                                    ac_id="ac_wr";
                                }
                                td_style[j] = tag('td', pr.time_used+'(-'+pr.submit_count+')').attr('id', ac_id);
                            }else{
                                if(pr.time_used.length>8){
                                    ac_id="ac_long";
                                }else{
                                    ac_id="accept";
                                }
                                td_style[j] = tag('td', pr.time_used).attr('id', ac_id);
                            }
                        }else{
                            if(pr.submit_count>0){
                                td_style[j] = tag('td', '(-'+pr.submit_count+')').attr('id', 'wrong');
                            }else{
                                td_style[j] = tag('td', '').attr('id', 'nosubmit');
                            }
                        }
                    });
                    h.push(tag('tr',
                        tag('td', ur.rank),
                        tag('td', ur.user_id),
                        tag('td', ur.user_nick),
                        tag('td', ur.total_aced),
                        tag('td', ur.total_time),
                        td_style
                        )
                    )
                });
                $('#tableID tbody').html(h.html());
                $('#page_area').pagination({
                    'max': data.max,
                    'page': data.page,
                    'callback': contest.getRanklist
                });
                if (gRanklistFooter) position.footer($(document).height());
            });
            if(gRanklistReturn){
                clearTimeout(gRanklistReturn);
                gRanklistFooter = false;
            }
            gRanklistReturn = setTimeout(contest.getRanklist, 3000);
        },
        searchContest: function(page){
            var _type_entry = $("#type").val();
            var _status_entry = $("#status").val();
            var _purview_entry = $("#purview").val();
            var _input_entry = $("#id_title").val();
            var _holder_entry = $("#holder").val();

            var search_content = {};
            if(!isNaN(page)) search_content.page = page;
            search_content.csrtmiddlewaretoken = search_content.csrfmiddlewaretoken =  tool.getCookie('csrftoken');
            search_content.type_ = _type_entry;
            search_content.status_ = _status_entry;
            search_content.purview = _purview_entry;
            search_content.id_title = _input_entry;
            search_content.holder = _holder_entry;
            search_content.operation = "Search";
            $.post('/contest/jlist/', search_content, function(data){
                contest.conDisplay(data);
                $('#page_area').pagination({
                    'max': data.max,
                    'page': data.page,
                    'callback': contest.searchContest
                });
                position.footer($(document).height(), true);
            });
        },
        fixSubnav: function(){
            var obj=document.getElementById("scd-nav");

            var dif_dis = obj.offsetTop-40;

            window.onscroll = function(){
                rol_dis = document.body.scrollTop || document.documentElement.scrollTop;
                if(rol_dis > dif_dis){
                    $("#progress-flag").addClass("contest-fixed");
                    $("#scd-nav").addClass("subnav-fixed");
                    obj.style.marginTop = "0px";
                }else{
                    $("#scd-nav").removeClass("subnav-fixed");
                    $("#progress-flag").removeClass("contest-fixed");
                    obj.style.marginTop = "20px";
                }
            }
        },

        /*=====================================================displayDatetime.js====================================================*/
        add0: function(i){
            if(i<10) i="0"+i;
            return i;
        },
        gotDate: function(){
            var year = date.getFullYear();/*this.date*/
            if(year < 1900) year += 1900;
            var mon = contest.add0(date.getMonth()+1);
            var day = contest.add0(date.getDate());
            var ymd_arr = new Array(year, mon, day);
            var ymd = ymd_arr.join("-");
            $(dateID).html(ymd);
        },
        gotWeek: function() {
            var week = new Array("日", "一", "二", "三",
                                 "四", "五", "六");
            var weekday = week[date.getDay()];/*this.date*/
            $(weekID).html(weekday);
        },
        gotClock: function() {
            if(hh!=undefined && mm!=undefined && ss!=undefined){
                ss = ss+1;
                if(ss==60){
                    ss = 0;
                    mm = mm+1;
                    if(mm==60){
                        mm = 0;
                        hh = hh+1;
                        if(hh==24){
                            hh = 0;
                            remoteSync();
                        }
                    }
                }
                var clock_arr = new Array(contest.add0(hh), contest.add0(mm), contest.add0(ss));
                var clock = clock_arr.join(":");
                $(clockID).html(clock);
                if(localInterval) clearTimeout(localInterval);
                localInterval = setTimeout(function() { contest.gotClock("#clock");}, 1000);
            }
        },
        remoteSync: function(){
            $.ajax({url:"/"}).success(function(data, textStatus, jqXHR){
                var serverDate = new Date(jqXHR.getResponseHeader("Date"));
                hh = serverDate.getHours();
                mm = serverDate.getMinutes();
                ss = serverDate.getSeconds();
                date = serverDate;
                contest.gotDate();
                contest.gotWeek();
                contest.gotClock();
            });
            /*每隔5分钟与服务器同步一下时间*/
            if(remoteInterval!=undefined) clearTimeout(remoteInterval);
            remoteInterval = setTimeout(function(){contest.remoteSync();}, 5*60*1000);
        },

        /*=========================================================Timer.js==================================================*/
        localTimer: function(){
            var width;
            //当比赛不符合规则或者已经结束的时间width＝1
            if(timeDiff<=0 || nowSecond >= endSecond) width = 1;
            else width = (nowSecond-startSecond)/timeDiff;

            timerIn.style.width = width*100+"%";
            remainDiv.style.left = parseInt(width*1170+6)+"px";

            contest.calRemain();

            nowSecond = nowSecond + 5;

            if(localReturn) clearTimeout(localReturn);
            localReturn = setTimeout(function(){contest.localTimer();}, 5000);
        },
        calRemain: function(){
            var remainSec;
            var calResult=new Array();
            var h, m;

            remainSec = nowSecond>=endSecond?0:endSecond-nowSecond;

            if(remainSec>2678400){
                calResult[0]=">1mth";
            }else{
                h = parseInt(remainSec/3600);
                m = Math.ceil(remainSec/60%60);
                if(m==60) m=59;
                h = h<10?"0"+h:h;
                m = m<10?"0"+m:m;
                calResult[0] = h; 
                calResult[1] = m;
            }
            calResult = calResult.join(":");
            $("#remain-time").html(calResult);
        },
        tRemoteSync: function(){
            $.ajax({url:"/"}).success(function(data, textStatus, jqXHR){
                var serverSecond = new Date(jqXHR.getResponseHeader("Date"));
                nowSecond = serverSecond.getTime() / 1000;

                contest.localTimer();
            });

            if(remoteReturn) clearTimeout(remoteReturn);
            remoteReturn = setTimeout(function(){contest.tRemoteSync();}, 5*60*1000);
        },
    }
})(jQuery);
/*===================================================================================================================*/
/*==================================================================================================================*/
/*=====================================forum forum forum  ===========================================================*/
/*==================================================================================================================*/
/*===================================================================================================================*/
var forum = (function($){
    var quoteObj;
    var postsID = $('#posts-id').val();
    var postsPath = new Array('/forum/jposts/', postsID, '/');
    postsPath = postsPath.join("");
    var downQuote = 10;
    return {
        getQuoteObj: function(_self){
            quoteObj = _self;
        },
        postsCancel: function(){
            $('#new-posts-title').val('');
            $('#new-posts-text').val('');
        },
        morePaginate: function(page){
            var path = new Array('/forum/jmore/type/' ,$('#moreType').val(), "/");
            var get_content = {};
            get_content.page = page;
            $.get(path.join(''), get_content, function(data){
                forum.moreDisplay(data);
                $('#page-area').pagination({
                    'max': data.max,
                    'page': data.page,
                    'callback': forum.morePaginate
                });
                position.footer($(document).height());
            });
        },
        moreDisplay: function(data){
            var ul, li, title, href, time, user, link;

            ul = tag('ul');
            $.each(data.obj, function(i, o){
                link = new Array("/forum/posts/", o.id, "/");
                li = tag('li');
                title = tag('div');
                href = tag('a', o.title).attr('href', link.join(""));
                time = tag('span', o.post_time).attr('class', 'posts-time');
                user = tag('span', o.username);
                ul.push(li.push(title.push(href)).push(time).push(user));
            });
            $('#posts-list').html(ul.toString());
        },
        createFloor: function(postsData){
            var posts, table, tbody, tr1, tr2, td1, text;
            var dl, dt, img, dd1, dd2, td2, data, floor;
            var time, quote, href, td3, postsText, len;
            var num = new Array('Replied: ', postsData[0].replied);
            var grade;
            var floorNum = new Array('#');
            var qtextID = new Array('qtext');
            var fieldset = new Array();
            var blockquote = new Array();
            var quoteDiv, fieldsetDiv, quoteMsg;

            len = postsData.length;

            qtextID[1] = postsData[len-1].floor;
            
            if(len>1){
                for(var i=0; i<len-1; i++){// len -1 之前的就是fieldset中的内容
                    fieldset[i] = tag('fieldset');
                }
                for(var i=len-2, j=0; i>=0; i--, j++){// 我们要倒着才能和fieldset相匹配
                    blockquote[j] = tag('blockquote');
                    blockquote[j].push(tool.escapeStr(postsData[i].blockquote));
                }
                for(var i=0; i<len-1; i++){// 将fieldset嵌套起来
                    fieldset[i].push(blockquote[i]);
                }
                var normalD=undefined;
                var specail=undefined;
                var normalU=undefined;
                if((len-1)>2*downQuote){
                    normalD = fieldset[downQuote-1];
                    for(var i=downQuote-2; i>=0; i--){
                        fieldset[i].unshift(normalD);
                        normalD = fieldset[i];
                    }
                    specail = fieldset[downQuote-1];
                    for(var i=downQuote; i<len-1-downQuote; i++){
                        specail.unshift(fieldset[i]);
                    }
                    normalU = fieldset[len-2];
                    for(var i=len-3; i>len-2-downQuote; i--){
                        fieldset[i].unshift(normalU);
                        normalU = fieldset[i];
                    }
                    specail.unshift(normalU);
                    
                    //normalD 就是我们想要的结果
                }else{
                    for(var i=len-2; i>=0; i--){
                        fieldset[i].unshift(normalD);
                        normalD = fieldset[i];
                    }
                    //normalD 就是我们想要的结果
                }
                if(postsData[len-1].qFloor=='0') quoteMsg = new Array('Quote "', 'Top', " ", postsData[len-1].qUsername, '": ');
                else quoteMsg = new Array('Quote "#', postsData[len-1].qFloor, " ", postsData[len-1].qUsername, '": ');
                quoteDiv = tag('div', quoteMsg.join("")).attr('class', 'quoteDiv');
                fieldsetDiv = tag('div').attr('class', 'fieldsetDiv');
                fieldsetDiv.unshift(normalD);
                postsText = tag('div').attr('class', 'posts-text').attr('id', qtextID.join(""));
                text = tag('div', tool.escapeStr(postsData[len-1].text)).attr('class' ,'quote-answer');
                postsText.unshift(text).unshift(fieldsetDiv).unshift(quoteDiv);
            }else{
                 postsText = tag('div', postsData[len-1].text).attr('class', 'posts-text').attr('id', qtextID.join(""));
            }
            
            posts = tag('div').attr('class', 'posts');
            table = tag('table').attr('class', 'table no-box-shadow');
            tbody = tag('tbody');
            tr1 = tag('tr');
            tr2 = tag('tr');
            td1 =tag('td').attr('rowspan', "2").attr('valign', 'top').attr('class', 'posts-user');
            dl = tag('dl');
            dt = tag('dt');
            img = tag('img').attr('class', 'posts-avatar').attr('src', postsData[len-1].asrc);

            dd1 = tag('dd', postsData[len-1].username).attr('class', 'posts-username ojcolor');

            grade = new Array('Grade: ', postsData[len-1].grade)
            dd2 = tag('dd', grade.join(""));
            td2 = tag('td');
            data = tag('div').attr('class', 'posts-data');
            if(postsData[len-1].floor == '0'){
                floor = tag('span', 'Top').attr('class', 'ojcolor');
                replied = tag('span', num.join("")).attr('class', 'ojcolor text-right'); 
            } else {
                floorNum[1] = postsData[len-1].floor;
                floor = tag('span', floorNum.join('')).attr('class', 'ojcolor');
                replied = tag('span', '&nbsp;').attr('class', 'ojcolor text-right');  
            }
            time = tag('span', postsData[len-1].postTime).attr('class', 'ojcolor');
            quote = tag('span').attr('class', 'ojcolor text-right');
            href = tag('a', 'Quote').attr('href', '#myModal_quote').attr('data-toggle', 'modal'
                ).attr('onclick', 'forum.getQuoteObj($(this)); return false;').attr('data-user',
                postsData[len-1].userID).attr('data-floor', postsData[len-1].floor);
            td3 = tag('td');

            td1.push(dl.push(dt.push(img)).push(dd1).push(dd2));
            td2.push(data.push(floor).push(time).push(replied).push(quote.push(href)));
            td3.push(postsText);
            table.push(tr1.push(td1).push(td2)).push(tr2.push(td3));
            posts.push(table);
            return posts;
            
        },
        showFloor: function(page){
            var get_content = {};
            get_content.page = page;
            $.get(postsPath, get_content, function(data){
                var tmp = tag('div');
                $.each(data.posts, function(i, posts){
                    tmp.push(forum.createFloor(posts));
                });
                $('#posts').html(tmp.html());
                $('#page-area').pagination({
                    'max': data.max,
                    'page': data.page,
                    'callback': forum.showFloor
                });
                position.footer($(document).height());
            });
        },
        dealReply: function(method, stored){
            var post_content = {};
            post_content.csrfmiddlewaretoken =  tool.getCookie('csrftoken');

            if(method=='make'){
                var text=$('#forum-text').val();
                $('#forum-text').val('');
                post_content.text = text;
            }else{
                $('#quote-text').val('');
                stored = JSON.stringify(stored);
                post_content.stored = stored;
            }
            post_content.operation = method;

            $.post(postsPath, post_content, function(data){
                forum.showFloor(1);
                $('#myModal_forum').modal('hide');
                $('#myModal_quote').modal('hide');
            });
        },
        dealFieldset: function(level, qqObj, stored){
            if(level<=2*downQuote){//no special
                for(var i=0; i<level; i++){
                    stored.unshift($(qqObj[i]).children('blockquote').text());
                }    
            }else{
                for(var i=0; i<downQuote*2; i++){
                    stored.unshift($(qqObj[i]).children('blockquote').text());
                    if(i==9){
                        for(var j=level-1; j>=2*downQuote; j--){
                            stored.unshift($(qqObj[j]).children('blockquote').text());
                        }
                    }
                }
            }
            return stored;
        },
        dealQuote: function(){
            var stored = new Array();
            var obj, floor, qtextID, qObj, answer, quote, qqObj, level
            var quoteUser, enterAnswer, quoteAnswer;

            obj = quoteObj;
            quoteUser = obj.data('user');
            floor = obj.data('floor');
            qtextID = new Array('#','qtext', floor);
            qtextID = qtextID.join('');
            qObj = $(qtextID);

            answer = qObj.children('.quote-answer').text() || qObj.text();//注册兼顾有quote和无quote两种情况

            quote = qObj.children('.fieldsetDiv');
            qqObj = quote.find('fieldset');
            level = qqObj.length;

            stored = forum.dealFieldset(level, qqObj, stored);

            stored.push(answer);

            enterAnswer = $("#quote-text").val();
            quoteAnswer = {
                'qUserID': quoteUser,
                'qFloor': floor,
                'text': enterAnswer
            }
            stored.push(quoteAnswer);

            forum.dealReply('quote', stored);
            //stored:最后一个是对引用的回答，倒数第二个是引用的相关信息
        },
    }
})(jQuery);
/*===================================================================================================================*/
/*===================================================================================================================*/
/*======================================discuss discuss discuss======================================================*/
/*===================================================================================================================*/
/*===================================================================================================================*/
var discuss = (function($){
    var problemID=$('#pro-id').val();
    var jURL = new Array('/problem/', problemID, '/jdiscuss/');
    jURL = jURL.join('');
    var downDis = 10;
    var replyObj;
    var gIsLogin = $('#user-log').val();
    
    return {
        createLi: function(msgArr){
            var li, len, boxs = new Array();
            var user, avatar, username, floor, p, rSpan, rA, tie, postTime;
            var avatars = new Array(), users = new Array(), ps = new Array(), ties = new Array();

            len = msgArr.length;
            li = tag('li').attr('id', msgArr[len-1].idNO);
            for(var i=0; i<len; i++){
                boxs[i] = tag('div').attr('class', 'comment-box').attr('data-user', msgArr[i].userID);
            }
            for(var i=len-1, j=0; i>=0; i--, j++){
                avatar = tag('div').attr('class', 'show-com-avatar');
                img = tag('img').attr('class', 'show-com-img').attr('src', msgArr[i].asrc);
                user = tag('div').attr('class', 'comment-user');
                username = tag('span', msgArr[i].username).attr('class', 'author');
                postTime = tag('span', msgArr[i].postTime).attr('class', 'post-style pull-right post-discuss');
                floor = tag('span', i+1).attr('class', 'floor-reply');
                p = tag('p', tool.escapeStr(msgArr[i].enterMsg)); //escaped
                rA = tag('a', 'Reply').attr('href', '#').attr('class', 'floor-reply')
                    .attr('data-toggle', 'modal');
                if(gIsLogin=='True') rA.attr('onclick', 'discuss.getReplyObj($(this))');
                else rA.attr('onclick', 'discuss.getReplyObj($(this)); return false;');
                tie = tag('div').attr('class', 'comment-tie');

                avatar.push(img);
                user.push(username).push(floor).push(postTime);
                tie.push(rA);

                avatars[j] = avatar;
                users[j] = user;
                ps[j] = p;
                ties[j] = tie;
            }
            for(var i=0; i<len; i++){
                boxs[i].push(avatars[i]).push(users[i]).push(ps[i]).push(ties[i]);
            }
            if(len > 2*downDis){
                var normalD, special, normalU;
                normalD = boxs[downDis-1];
                for(var i=downDis-2; i>=0; i--){
                    boxs[i].unshift(normalD);
                    normalD = boxs[i]; //nomal = boxs[0]
                }
                special = boxs[downDis-1];
                for(var i=downDis; i<len-downDis; i++){
                    special.unshift(boxs[i]);
                }
                normalU = boxs[len-1];
                for(var i=len-2; i>len-downDis-1; i--){
                    boxs[i].unshift(normalU);
                    normalU = boxs[i];
                }
                special.unshift(normalU);
                li.push(normalD);
            }else{
                var nomalD = undefined;
                for(var i=len-1; i>=0; i--){
                    boxs[i].unshift(normalD);
                    normalD = boxs[i];
                }
                li.push(normalD);
            }
            return li;
        },
        judgeMsg: function(enterMsg){
            if((/^\s*$/g).test(enterMsg)){
                alert('Message can not be EMPTY, and less than 5 characters!');
                return false;
            }else return true;
        },
        judgeLogin: function(){
            if(gIsLogin!='True') {
                $('#myModal_login').modal();
                return false;
            }
            return true;
        },
        makeComment: function(method, stored){
            var postConent = {};
            var enterMsg;
            if(!discuss.judgeLogin()) return false;
            if(method == 'make'){
                enterMsg = $('#enter-msg').val();
                if(!discuss.judgeMsg(enterMsg)) return false; 
                $('#enter-msg').val('');
                postConent.operation = 'make';
            }else{
                enterMsg = $('#reply-msg').val();
                if(!discuss.judgeMsg(enterMsg)) return false;
                $('#reply-msg').val('');
                postConent.operation = 'reply';
                stored = JSON.stringify(stored);
                postConent.stored = stored;
            }
            
            postConent.enterMsg = enterMsg;
            postConent.csrfmiddlewaretoken =  tool.getCookie('csrftoken');
            $.post(jURL, postConent, function(data){
                discuss.showComment(1);
                $('#myModal_reply').modal('hide');
            });
        },
        showComment: function(page){
            var get_content = {};
            get_content.page = page;
            $.get(jURL, get_content, function(data){
                var ul = tag('ul');
                $.each(data.discuss, function(i, dis){
                    ul.push(discuss.createLi(dis));
                });
                $('#show-comment').html(ul.toString());
                $('#page-area').pagination({
                    'max': data.max,
                    'page': data.page,
                    'callback': discuss.showComment
                });
                position.footer($(document).height());
            });
        },
        getReplyObj: function(_self){
            replyObj = _self;
            if(!discuss.judgeLogin()) return false;
            else{
                $('#myModal_reply').modal();
            }
        },
        getReplyed: function(ele){
            var user = ele.children('div.comment-user');
            return {
                'userID': ele.data('user'),
                'postTime': user.children('span.post-style').text(),
                'enterMsg': ele.children('p').text(),
                'idNO':''
            }
        },
        dealSibling: function(parent, stored){
            var prev, brother, sibl = new Array(), child, parent, level;

            prev = parent.prevAll();
            brother = prev.length;
            if(brother>0){
                //最后一个是一个特殊的siblings，放在下面来处理
                for(var i=0; i<brother-1; i++) sibl.push($(prev[i]));
                parent = $(prev[brother-1]);
                sibl.push(parent);
                child = parent.find('div.comment-box');
                level = child.length;
                for(var i=0; i<level; i++) sibl.push($(child[i]));
                level = sibl.length;
                for(var i=0; i<level; i++) stored.push(discuss.getReplyed(sibl[i]));
                stored = stored.reverse();
            }
            return stored;
        },
        dealInner: function(level, child, stored){
            if(level>10){
                if(level < downDis-1) for(var i=0; i<level; i++) stored.unshift(discuss.getReplyed($(child[i])));
                else if(level < 2*downDis-1) {
                    for(var i=0; i<downDis-1; i++) stored.unshift(discuss.getReplyed($(child[i])));
                    for(var i=downDis-1; i<level; i++) stored.unshift(discuss.getReplyed($(child[i])));    
                }
                else if(level >= 2*downDis-1) {
                    for(var i=0; i<downDis-1; i++) stored.unshift(discuss.getReplyed($(child[i])));
                    for(var i=downDis-1; i<2*downDis-1; i++) stored.unshift(discuss.getReplyed($(child[i])));    
                    for(var i=level-1; i>=2*downDis-1; i--) stored.unshift(discuss.getReplyed($(child[i])));
                }
                
            }else{
                for(var i=0; i<level; i++) stored.unshift(discuss.getReplyed($(child[i])));
            }
            return stored;
        },
        dealReply: function(){
            var obj = replyObj;
            var parent, child, level, tParent;
            var stored = new Array();
            parent = obj.parent().parent();
            stored.unshift(discuss.getReplyed(parent));
            child = parent.find('div.comment-box');
            level = child.length;
            if(level==0) stored = discuss.dealSibling(parent, stored);
            else stored = discuss.dealInner(level, child, stored);
            discuss.makeComment('reply', stored);
        }
    }
})(jQuery);
/*===================================================================================================================*/
/*===================================================================================================================*/
/*======================================ojUser ojUser ojUse==========================================================*/
/*===================================================================================================================*/
/*===================================================================================================================*/
var ojUser = (function($){
    var get_content = {};
    var gActive, gNoteProID;
    var gCurRow;
    return {
        /*==================================================user Ranklist=====================================================*/
        rankDisplay: function(data){
            var h = tag('tbody');
            $.each(data.ranks, function(i, rank){
                var ratio;

                if(rank.submit==0) ratio = '';
                else{
                    ratio = new Array((rank.solved/rank.submit*100).toFixed(2), '%');
                    ratio = ratio.join('');  
                }
                h.push(tag('tr',
                    tag('td', rank.rank_num),
                    tag('td',
                        tag('img').attr('src', rank.avatar).attr('class', 'mini-img')).attr('id', 'img-pad'),
                    tag('td', rank.username),
                    tag('td', rank.maxim),
                    tag('td', rank.solved),
                    tag('td', rank.submit),
                    tag('td', ratio)
                    ));
            });
            $('#tableID tbody').html(h.html());
        },
        getRanklist: function(page){
            if(!isNaN(page)) get_content.page = page;
            get_content.operation = 'ALL';
            get_content.range = 0;
            $('#all').attr('class',' radio1');

            var href=window.location.href;
            var reg_patt = /=/g;
            if(reg_patt.test(href)){
                var username = href.split('=')[1];
                $('#username').val(username);
                ojUser.ranklistSearch(1);
                return false;
            }
            $.get('/user/jranklist/', get_content, function(data){
                ojUser.rankDisplay(data);
                $('#page_area').pagination(
                    {'max': data.max,
                     'page': data.page,
                     'callback': ojUser.getRanklist
                });
                position.footer($(document).height());
            });
        },
        ranklistSearch: function(page){
            var _username_entry = $('#username').val();
            var search_content = {};
            search_content.uchoice = ' ';
            week = $('#WeekRanklist').attr('alt');
            month = $('#MonthRanklist').attr('alt');
            day = $('#DayRanklist').attr('alt');
            if (week == 'weekactive')
                search_content.uchoice =  $('#WeekRanklist').attr('alt');
            else if (month == 'monthactive')
                search_content.uchoice =  $('#MonthRanklist').attr('alt');
            else if (day == 'dayactive')
                search_content.uchoice =  $('#DayRanklist').attr('alt');
            search_content.username = _username_entry;
            search_content.operation = 'Search';
            search_content.page = page;
            search_content.range = 0;
            $.get('/user/jranklist/', search_content, function(data){
                ojUser.rankDisplay(data);
                $('#page_area').pagination(
                    {'max': data.max,
                     'page': data.page,
                     'callback': ojUser.ranklistSearch}
                );
            });
        },
        ranklistchoice: function(page, choice){
            var search_content = {};
            if (choice == 'day'){
                search_content.operation = 'Day';
                $('#DayRanklist').attr('alt','dayactive');
                $('#MonthRanklist').attr('alt',' ');
                $('#WeekRanklist').attr('alt',' ');
                $('#DayRanklist').removeClass('radio2').addClass('radio1');
                $('#MonthRanklist').removeClass('radio1').addClass('radio2');
                $('#WeekRanklist').removeClass('radio1').addClass('radio2');
                $('#all').removeClass('radio1').addClass('radio2');
            }
            if (choice == 'week'){
                search_content.operation = 'Week';
                $('#WeekRanklist').attr('alt','weekactive');
                $('#MonthRanklist').attr('alt',' ');
                $('#DayRanklist').attr('alt',' ');
                $('#DayRanklist').removeClass('radio1').addClass('radio2');
                $('#MonthRanklist').removeClass('radio1').addClass('radio2');
                $('#WeekRanklist').removeClass('radio').addClass('radio1');
                $('#all').removeClass('radio1').addClass('radio2');
            }
            if (choice == 'month'){
                search_content.operation = 'Month';
                $('#MonthRanklist').attr('alt','monthactive');
                $('#DayRanklist').attr('alt',' ');
                $('#WeekRanklist').attr('alt',' ');
                $('#DayRanklist').removeClass('radio1').addClass('radio2');
                $('#MonthRanklist').removeClass('radio').addClass('radio1');
                $('#WeekRanklist').removeClass('radio1').addClass('radio2');
                $('#all').removeClass('radio1').addClass('radio2');
            }
            if(choice == 'all'){
                search_content.operation = 'ALL';
                $('#MonthRanklist').attr('alt',' ');
                $('#DayRanklist').attr('alt',' ');
                $('#WeekRanklist').attr('alt',' ');
                $('#DayRanklist').removeClass('radio1').addClass('radio2');
                $('#MonthRanklist').removeClass('radio1').addClass('radio2');
                $('#WeekRanklist').removeClass('radio1').addClass('radio2');
                $('#all').removeClass('radio').addClass('radio1');
            }
            search_content.page = page;
            search_content.range = 0;
            $.get('/user/jranklist/', search_content, function(data){
                ojUser.rankDisplay(data);
                $('#page_area').pagination(
                    {'max': data.max,
                     'page': data.page,
                     'callback': ojUser.ranklistchoice}
                );
            });
        },
        // ================================top10============
        Top10RankDisplay:function(data){
            var h = tag('ul');
            $.each(data.ranks, function(i, rank){
                var liclass = ''
                if(i==0){
                    liclass = 'rank-gold';
                }else if(i>0&&i<3){
                    liclass = 'rank-silver';
                }else{
                    liclass="rank-copper";
                }
                h.push(tag('li',tag('ul',
                        tag('li', rank.rank_num).attr('class', liclass),
                        tag('li', rank.username).attr('class', 't-user'),
                        tag('li','Killed').attr('class', 't-kill'),
                        tag('li', rank.solved)                    
                    )));
            });
            $('#Top10Rank').html(h.html());
        },
        getTop10Ranklist:function(page){
            if(!isNaN(page)) get_content.page = page;
            get_content.operation = 'Day';
            get_content.range = 10;
            $.get('/user/jranklist/', get_content, function(data){
                ojUser.Top10RankDisplay(data);
                $('#page_area').pagination(
                    {'max': data.max,
                     'page': data.page,
                     'callback': ojUser.getRanklist
                });
            });
        },
        Top10RanklistChoice: function(page, choice){

            var search_content = {};
            if (choice == 'day'){
                search_content.operation = 'Day';
                $('#DayRanklist').attr('alt','dayactive');
                $('#MonthRanklist').attr('alt',' ');
                $('#WeekRanklist').attr('alt',' ');
            }
            if (choice == 'week'){
                search_content.operation = 'Week';
                $('#WeekRanklist').attr('alt','weekactive');
                $('#MonthRanklist').attr('alt',' ');
                $('#DayRanklist').attr('alt',' ');
            }
            if (choice == 'month'){
                search_content.operation = 'Month';
                $('#MonthRanklist').attr('alt','monthactive');
                $('#DayRanklist').attr('alt',' ');
                $('#WeekRanklist').attr('alt',' ');
            }
            if(choice == 'all'){
                search_content.operation = 'ALL';
                $('#MonthRanklist').attr('alt',' ');
                $('#DayRanklist').attr('alt',' ');
                $('#WeekRanklist').attr('alt',' ');
            }
            search_content.page = page;
            search_content.range = 10;
            $.get('/user/jranklist/', search_content, function(data){
                ojUser.Top10RankDisplay(data);
                $('#page_area').pagination(
                    {'max': data.max,
                     'page': data.page,
                     'callback': ojUser.ranklistchoice}
                );
            });
        },

        /*====================================================userInfo==========================================*/
        changeActive: function(curActive){
            if(gActive) gActive.removeClass('active');
            gActive = curActive;
            gActive.addClass('active');
        },
        createInput: function(labelID, labelName, addIcon, inputVal, type, placeholder){
            var contorl_group;
            var label;
            var label_icon;
            var controls;
            var input_prepend;
            var add_on;
            var add_on_icon;
            var span;
            var input;

            contorl_group = tag('div').attr('class' ,'control-group');
            label = tag('label', labelName).attr('class', 'control-label').attr('for', labelID);
            controls = tag('div').attr('class', 'controls');
            input_prepend = tag('div').attr('class', 'input-prepend');
            add_on = tag('span').attr('class', 'add-on');
            add_on_icon = tag('i').attr('class', addIcon);
            if(type==0) span = tag('span', inputVal).attr('class', 'span3 input-xlarge uneditable-input');
            else if(type==1) input = tag('input').attr('class', 'span3').attr('id', labelID).attr(
                'type', 'text').attr('value', inputVal);
            else if(type==2) {
                input = tag('textarea').attr('class', 'span3').attr('id', labelID).attr('rows', '1');
                input.push(inputVal);
            }
            if(placeholder) input.attr('placeholder', placeholder).attr('type', 'password');

            if(type==0) return contorl_group.push(label).push(controls.push(input_prepend.push(add_on.push(add_on_icon)).push(span)));
            else return contorl_group.push(label).push(controls.push(input_prepend.push(add_on.push(add_on_icon)).push(input)));
        },
        createProUrl: function(user, pid, type){
            var URL = new Array();
            var addOn = new Array();
            URL[0] = '/problem/allstatus/?';

            addOn[0] = 'pid=';
            addOn[1] = pid;
            URL[1] = addOn.join("");

            addOn[0] = '&type=';
            addOn[1] = type;
            URL[2] = addOn.join("");

            addOn[0] = '&user=';
            addOn[1] = user;
            URL[3] = addOn.join("");

            return URL.join("");
        },
        createECUrl: function(cid){
            var URL = new Array('/contest/', cid, '/problem/');
            return URL.join("");
        },
        createDisUrl: function(did){
            var URL = new Array('/problem/', did, '/discuss/');
            return URL.join("");
        },
        createClctUrl: function(cid){
            var URL = new Array('/problem/', cid);
            return URL.join('');
        },
        createList: function(row_class, title, title_class, num, items, link_class, user, type, ispro){
            var row;
            var left;
            var right;
            var count;
            var link;

            row = tag('div').attr('class', row_class);
            left = tag('div', title).attr('class', title_class);
            right = tag('div').attr('class', 'span7 auto-wrap');
            if(ispro==0){
                for(var i=0; i<items.length; i++){
                    link = tag('a', items[i]).attr('class', link_class).attr('href', ojUser.createProUrl(user, items[i],type));
                    right.push(link);
                }
            }else if(ispro==1){
                for(var i=0; i<items.length; i++){
                    link = tag('a', items[i]).attr('class', link_class).attr('href', ojUser.createECUrl(items[i]));
                    right.push(link);
                }
            }else if(ispro==2){
                for(var i=0; i<items.length; i++){
                    link = tag('a', items[i]).attr('class', link_class).attr('href', ojUser.createDisUrl(items[i]));
                    right.push(link);
                }
            }else if(ispro==3){
                for(var i=0; i<items.length; i++){
                    link = tag('a', items[i]).attr('class', link_class).attr('href', ojUser.createClctUrl(items[i]));
                    right.push(link);
                }
            }
            count = tag('small', num);
            
            return row.push(left.push(count)).push(right);
        },
        createNote: function(row_no, pro_no, row_title, row_time){
            var row;
            var no;
            var title;
            var href;
            var time;
            if(row_no%2==1) row = tag('div').attr('class', 'note-row note-body-row even').attr('data-row', row_no).attr('data-pro', pro_no);
            else row = tag('div').attr('class', 'note-row note-body-row odd').attr('data-row', row_no).attr('data-pro', pro_no);
            no = tag('div', row_no+1).attr('class', 'note-row-no');
            title = tag('div').attr('class', 'note-row-title');
            time = tag('div', row_time).attr('class', 'note-row-time');
            href = tag('a', row_title).attr('href', '#myModal_view_note').attr('data-toggle', 'modal').attr('data-pro', pro_no
                ).attr('onclick', "ojUser.displayNote('user', '#view-note-title', '#view-note-text', $(this)); return false;");

            return row.push(no).push(title.push(href)).push(time);
        },
        /*=================================================ojUser show====================================================*/
        showProfile: function(){
            var alert;
            var span4;
            var button;
            ojUser.changeActive($('#nprofile'));
            $("#uheader").html('Update Your Profile');

            var get_content = {};
            get_content.operation = 'profile';
            $.get('/user/juserinfo/', get_content, function(data){
                var form = tag('form').attr('class', 'form-horizontal user-profile').attr(
                    'action', '').attr('method', 'POST');
                var inputs = new Array();
                inputs[0] = ojUser.createInput('inputUsername', 'Username:', 'icon-user', data.username, 1);
                inputs[1] = ojUser.createInput('inputEmail', 'Email:', 'icon-envelope', data.email, 1);
                inputs[2] = ojUser.createInput('inputSchool', 'School:', 'icon-home', data.school, 1);
                inputs[3] = ojUser.createInput('inputInstitution', 'Institution:', 'icon-home', data.institution, 1);
                inputs[4] = ojUser.createInput('inputClass', 'Class:', 'icon-home', data.student_class, 1);
                inputs[5] = ojUser.createInput('inputPhone', 'Phone:', 'icon-filter', data.phone, 1);
                inputs[6] = ojUser.createInput('inputQQ', 'QQ:', 'icon-globe', data.qq, 1);
                inputs[7] = ojUser.createInput('inputMaxim', 'Maxim:', 'icon-heart', data.maxim, 2);
                if(data.is_inner){
                    inputs.splice(0, 0, ojUser.createInput('inputRealName', 'Real Name: ', 'icon-user', data.real_name, 0));
                    inputs.splice(0, 0, ojUser.createInput('inputStdID', 'Student ID: ', 'icon-user', data.student_id, 0));
                }
                for (var i=0; i<inputs.length; i++) form.push(inputs[i]);

                alert = tag('div').attr('class', 'alert alert-info').attr('id', 'alert-style');
                span4 = tag('div').attr('class', 'span4 result-msg');
                result_span = tag('span').attr('id', 'modify-result');
                button = tag('button', "Submit").attr('class', 'btn btn-primary').attr('onclick', 'ojUser.changeUserinfo();return false');
                form.push(alert.push(span4.push(result_span)).push(button));
                $('#user-display').html(form.toString());
            });
        },
        changeUserinfo: function() {
            var username = $("#inputUsername").val();
            var email = $("#inputEmail").val();
            var school = $("#inputSchool").val();
            var institution = $("#inputInstitution").val();
            var stuent_class = $("#inputClass").val();
            var phone_number = $("#inputPhone").val();
            var qq = $("#inputQQ").val();
            var maxim = $("#inputMaxim").val();
            var user = {};
            var alert_style;

            user.csrfmiddlewaretoken =  tool.getCookie('csrftoken');
            user.username = username;
            user.email = email;
            user.school = school;
            user.institution = institution;
            user.class = stuent_class;
            user.phone = phone_number;
            user.qq = qq;
            user.maxim = maxim;
            $.post("/user/change_userinfo/", user, function(data) {
                if(data.ok) {
                    alert_style = $('#alert-style');
                    if(alert_style.hasClass('alert-info')) alert_style.removeClass('alert-info');
                    if(!alert_style.hasClass('alert-success')) alert_style.addClass('alert-success');
                    $("#modify-result").html("Modified Successfully!").fadeIn(1000).fadeOut(3000);
                } else {
                    alert_style = $('#alert-style');
                    if(alert_style.hasClass('alert-success')) alert_style.removeClass('alert-success');
                    if(!alert_style.hasClass('alert-info')) alert_style.addClass('alert-info');
                    $("#modify-result").html(data.errmsg).fadeIn(1000).fadeOut(5000);
                }
            });
        },
        changeAccount: function(){
            var alert_style;
            var data = {};

            data.csrfmiddlewaretoken =  tool.getCookie('csrftoken');
            data.oldpassword = $("#inputOldPwd").val();
            data.newpassword = $("#inputNewPwd").val();
            data.newpassword_again = $("#inputConfirm").val()
            $.post("/user/chang_account/", data, function(data) {
                if(data.ok) {
                    alert_style = $('#alert-style');
                    if(alert_style.hasClass('alert-info')) alert_style.removeClass('alert-info');
                    if(!alert_style.hasClass('alert-success')) alert_style.addClass('alert-success');
                    $("#modify-result").html("Modified Successfully!").fadeIn(1000).fadeOut(3000);
                } else {
                    alert_style = $('#alert-style');
                    if(alert_style.hasClass('alert-success')) alert_style.removeClass('alert-success');
                    if(!alert_style.hasClass('alert-info')) alert_style.addClass('alert-info');
                    $("#modify-result").html(data.errmsg).fadeIn(1000).fadeOut(5000);
                }
            });
        },
        showAccount: function(){
            ojUser.changeActive($('#naccount'));
            $("#uheader").html('Modify Your Password');

            var inputs = new Array();
            var form = tag('form').attr('class', 'form-horizontal user-profile').attr(
                    'action', '').attr('method', 'POST');

            inputs[0] = ojUser.createInput('inputOldPwd', 'Old Password', 'icon-lock', '', 1, 'Old Password');
            inputs[1] = ojUser.createInput('inputNewPwd', 'New Password', 'icon-lock', '', 1, 'New Password');
            inputs[2] = ojUser.createInput('inputConfirm', 'Confirm', 'icon-lock', '', 1, 'Confirm');
            for(var i=0; i<inputs.length; i++) form.push(inputs[i]);

            alert = tag('div').attr('class', 'alert alert-info').attr('id', 'alert-style');
            span4 = tag('div').attr('class', 'span4 result-msg');
            result_span = tag('span').attr('id', 'modify-result');
            button = tag('button', "Submit").attr('class', 'btn btn-primary').attr('onclick', 'ojUser.changeAccount(); return false;');

            form.push(alert.push(span4.push(result_span)).push(button));
            $('#user-display').html(form.toString());
        },
        showProblem: function(){
            ojUser.changeActive($('#nproblem'));
            $("#uheader").html('Your Problem Statistic');

            var get_content = {};

            $.get('/user/jproblem/', get_content, function(data){
                var container_ac;
                var container_ch;
                var tObj;
                var num_ac;
                var num_ch;

                num_ac = new Array('(', data.num_ac, '):');
                num_ac = num_ac.join("");
                num_ch = new Array('(', data.num_ch, '):');
                num_ch = num_ch.join("");

                tObj = tag('div');
                container_ac = ojUser.createList('row row-ac', 'Accepted','span-ac text-right', num_ac, data.ac_pros, 'link-ac', data.user, 'ac', 0);
                container_ch = ojUser.createList('row row-ch', 'Chellenging','span-ch text-right', num_ch, data.ch_pros, 'link-ch', data.user, 'all', 0);
                
                $('#user-display').html(tObj.push(container_ac).push(container_ch).html());
                position.footer($(document).height(), true);
            });
        },
        showDiscuss: function(){
            ojUser.changeActive($('#ndiscuss'));
            $("#uheader").html('View Your Discuss');

            var get_content = {};
            $.get('/user/jdiscuss/', get_content, function(data){
                var dis_num, tObj, discuss;

                dis_num = new Array('(', data.dis_num, '):');
                dis_num = dis_num.join('')

                tObj = tag('div');
                discuss = ojUser.createList('row row-ac', 'Discuss', 'span-ac text-right', dis_num, data.dp, 'link-ac', '', '', 2);

                $("#user-display").html(tObj.push(discuss).html());

                position.footer($(document).height(), true);
            });
        },
        showClct: function(){
            ojUser.changeActive($('#nclct'));
            $('#uheader').html('View Your Collect');

            var get_content = {};
            $.get('/user/jcollect/', get_content, function(data){
                var clt_num, tObj, collect;

                clt_num = new Array('(', data.clt_num, '):');
                clt_num = clt_num.join('');

                tObj = tag('div');
                collect = ojUser.createList('row row-ch', 'Collect', 'span-ch text-right', clt_num, data.cp, 'link-ch', '', '', 3);

                $("#user-display").html(tObj.push(collect).html());

                position.footer($(document).height(), true);
            });
        },
        showContest: function(){
            ojUser.changeActive($('#ncontest'));
            $("#uheader").html('Your Contest Statistic');

            var get_content = {};

            $.get('/user/jcontest/', get_content, function(data){
                var experiment;
                var contest;
                var tObj;
                var num_exp;
                var num_con;

                num_exp = new Array('(', data.num_exp, '):');
                num_exp = num_exp.join('');
                num_con = new Array('(', data.num_con, '):');
                num_con = num_con.join('');

                tObj = tag('div');
                experiment = ojUser.createList('row row-exp', 'Experiment', 'span-exp text-right', num_exp, data.exps, 'link-exp', '', '', 1);
                contest = ojUser.createList('row row-con', 'Contest', 'span-con text-right', num_con, data.cons, 'link-con', '', '', 1);

                $('#user-display').html(tObj.push(contest).push(experiment).html());

                position.footer($(document).height(), true);
            });
        },
        createCloud: function(cloud, username){
            var tagDiv, tagA;
            tagDiv = tag('div').attr('class', 'tag');
            tagA = tag('a', cloud).attr('class', 'tag3 normal-radius').attr('href', '/problem/list/').
                attr('onclick', 'ojProblem.reformCloudUrl($(this));').attr('data-user', username);
            return tagDiv.push(tagA);
        },
        showCloud: function(){
            ojUser.changeActive($('#ncloud'));
            $("#uheader").html('View Your Cloud');

            var get_content = {};

            $.get('/user/jcloud/', get_content, function(data){
                var cloudDiv;
                var cloudForm;
                var username = data.username;

                cloudDiv = tag('div').attr('class', 'cloud user-cloud');
                
                $.each(data.cloud, function(i, c){
                    cloudDiv.push(ojUser.createCloud(c, username));
                });
                $('#user-display').html(cloudDiv.toString());

                position.footer($(document).height(), true);
            });
        },
        makeCloud: function(){
            var post_content = {};
            post_content.text = tool.delBBB($('#cloud-text').val());
            post_content.problemid = $('#cloud-problem').val();
            post_content.csrfmiddlewaretoken = tool.getCookie('csrftoken');

            $.post('/problem/cloud/jmake/', post_content, function(data){
                $('#cloudform').submit();
            });
        },
        collect: function(that){
            var oper;
            var button;
            var pro_id = $('#desc-pro-id').val();
            var post_content = {};

            button = that.children();
            if(button.hasClass('btn-danger')) oper = 'collected';
            else oper = 'collect';

            post_content.csrfmiddlewaretoken = tool.getCookie('csrftoken');
            post_content.operation = oper;
            post_content.problem_id = pro_id;

            $.post('/problem/jcollect/', post_content, function(data){
                if(data.collected===true) {
                    button.addClass('btn-danger');
                    button.attr('title', 'collected');
                }
                else if(data.collected==false) {
                    button.removeClass('btn-danger');
                    button.attr('title', 'collect');
                }
            });
        },
        showNotes: function(){
            ojUser.changeActive($('#nnotes'));
            $("#uheader").html('Review Your Notes');

            var get_content = {};

            get_content.operation = 'all';

            $.get('/user/jnote/', get_content, function(data){
                var wrapper,header,header_row,body,body_row,row,no;
                var title,href,time,floatbtn,view,view_i,edit,edit_i;
                var del,del_i,_pro_no;

                wrapper = tag('div').attr('class', 'note-wrapper');
                row = tag('div').attr('class', 'note-row note-header-row');
                no = tag('div', 'NO.').attr('class', 'note-row-no');
                title = tag('div', 'Titile').attr('class', 'note-row-title');
                time = tag('div', 'Time').attr('class', 'note-row-time');
                header = tag('div').attr('class', 'note-header');
                header_row = row.push(no).push(title).push(time);
                header.push(header_row);
                body = tag('div').attr('class', 'note-body');
                real_body = tag('div').attr('id', 'note-real-body');

                for(var i=0; i<data.total; i++){
                    body_row = ojUser.createNote(i, data.row[i]._pro_no, data.row[i]._title, data.row[i].post_time);
                    real_body.push(body_row);
                }

                floatbtn = tag('div').attr('class', 'floatBtn').attr('id','oper-btn');
                view = tag('a').attr('href', '#myModal_view_note').attr('data-toggle', 'modal').attr('id', 'note-view'
                    ).attr('onclick', "ojUser.displayNote('user', '#view-note-title', '#view-note-text', $(this)); return false;"
                    ).attr('title', 'View');
                view_i = tag('i').attr('class', 'icon-eye-open icon-white');
                edit = tag('a').attr('href',  '#myModal_uedit_note').attr('data-toggle', 'modal').attr('id', 'note-edit'
                    ).attr('onclick', "ojUser.displayNote('user', '#uedit-note-title', '#uedit-note-text', $(this)); return false;"
                    ).attr('title', 'Edit');
                edit_i = tag('i').attr('class', 'icon-pencil icon-white');
                del = tag('a').attr('href', '#').attr('id', 'note-del').attr('onclick', 'ojUser.deleteNote($(this)); return false;'
                    ).attr('title', 'Delete');
                del_i = tag('i').attr('class', 'icon-remove icon-white');
                wrapper.push(header).push(body.push(real_body.push(floatbtn.push(view.push(view_i)).push(edit.push(edit_i)).push(del.push(del_i)))));
                $('#user-display').html(wrapper.toString());

                $('.note-body-row').mouseover(function(){
                    gCurRow = $(this);
                    $(this).addClass('note-hover');
                    var pos = new Array( $(this).data('row')*30, 'px');
                    $('#oper-btn').css('top', pos.join(''));
                }).mouseleave(function(){
                    $(this).removeClass('note-hover');
                });
                $('#oper-btn').mouseover(function(){
                    gCurRow.addClass('note-hover');
                }).mouseleave(function(){
                    gCurRow.removeClass('note-hover');
                });
                $('#note-real-body').mouseleave(function(){
                    $('#oper-btn').css('top', '-100px');
                });
            });
        },
        getNoteProID: function(origin, that){
            return $('#problem-id').val() || gCurRow.data('pro');
        },
        makeNote: function(origin, that){
            var _title_entry = $('#edit-note-title').val() || $('#uedit-note-title').val();
            var _text_entry = $('#edit-note-text').val() || $('#uedit-note-text').val();
            var _pro_id = ojUser.getNoteProID(origin, that);
            var note = {};
            note.csrfmiddlewaretoken = tool.getCookie('csrftoken');
            note._title = _title_entry;
            note._text = _text_entry;
            note._pro_id = _pro_id;
            note.operation = 'make';
            if(origin == 'problem'){
                $('#noteform').hide();
                $('#noteloading').show();
            }else{
                $('#unoteform').hide();
                $('#unoteloading').show();
            }
            $.post('/user/jnote/', note, function(data){
                if(origin == 'problem'){
                    $('#noteloading').hide();
                    $('#note-msg').attr('class', 'alert alert-success'
                    ).html('Make your note successfully!');
                    var cnt =1;
                    var closit = setTimeout(function(){
                        if(cnt==2){
                            clearTimeout(closit);
                            $('#noteform').submit();
                        }
                        $('#myModal_edit_note').modal('hide');
                        cnt = cnt + 1;
                    }, 1000);
                }else{
                    $('#unoteloading').hide();
                    $('#myModal_uedit_note').modal('hide');
                }
                ojUser.showNotes();

            });
        },
        displayNote: function(origin, noteTitle, noteText, that){
            var _pro_id = ojUser.getNoteProID(origin, that);
            var get_content = {};
            
            get_content._pro_id = _pro_id;
            get_content.operation = 'one';
            if(origin=="problem") $('#noteform').show();
            else $('#unoteform').show();
            $.get('/user/jnote/', get_content, function(data){
                if(noteTitle=='#edit-note-title' || noteTitle=='#uedit-note-title'){
                    $(noteTitle).val(data._title);
                    $(noteText).val(data._text);    
                }else if(noteTitle=="#view-note-title"){
                    $(noteTitle).text(data._title);
                    $(noteText).text(data._text);
                    var post_time = new Array('Post at: ', data.post_time);
                    $('#view-note-date').text(post_time.join(''));      
                }
            });
        },
        deleteNote: function(that){
            var pro_no = ojUser.getNoteProID(that);
            var deleteContent = {};
            deleteContent._pro_no = pro_no;
            deleteContent.csrfmiddlewaretoken = tool.getCookie('csrftoken');
            deleteContent.operation = 'del';

            $.post('/user/jnote/', deleteContent, function(data){
                ojUser.showNotes();
            });
        },
        /*============================================sysUser sysUser=================================================*/
        isEmail: function(fData)
        {
            var emailreg = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+(\.com|\.cn)$");
            return emailreg.test(fData);
        },
        isUsername: function(fData)
        {
            var usernamereg = new RegExp("^[a-zA-Z0-9._-]{4,20}$");
            return usernamereg.test(fData)
        },
        isStudentID: function(fData){
            var stuIDpatt = /^[0-9]{8}$/;
            return stuIDpatt.test(fData);
        },
        isPassword: function(fData) {
            var password = new RegExp("^[a-zA-Z0-9._-]{5,20}$");
            return password.test(fData)
        },
        checkout_password: function(password, password_again) {
            if(!password) {return false;}
            if (password === password_again) {
                return true;
            }
            return false;
        },
        register: function() {
            var username = $("#registerUsername").val();//通过id从前台获得输入的内容
            var email = $("#registerEmail").val();
            var password = $("#registerPassword").val();
            var password_again = $("#registerPassword-again").val();
            var student_id = $("#studentID").val();
            var real_name = $("#realName").val();

            $('#reg_username_error').attr('class', 'hide');
            $('#reg_realname_error').attr('class', 'hide');
            $('#reg_studentid_error').attr('class', 'hide');
            $('#reg_email_error').attr('class', 'hide');
            $('#reg_password_error').attr('class', 'hide');
            $('#confirm').attr('class', 'hide');
            if(!ojUser.isUsername(username)) {
                $("#reg_username_error").attr('class', 'alert alert-error'
                    ).html("Your username should be made of '0-9a-zA-Z_' and it's length > 4.");
                return false;
            }
            if(real_name==""){
                $("#reg_realname_error").attr('class', 'alert alert-error'
                    ).html("Your name can not be null.");
                return false;
            }
            if(!ojUser.isStudentID(student_id)){
                $("#reg_studentid_error").attr('class', 'alert alert-error'
                    ).html("Student ID should be 8 digits.")
                return false;
            }
            if(!ojUser.isEmail(email)) {
                $("#reg_email_error").attr('class', 'alert alert-error'
                    ).html("Please checkout your email format!")
                return false;
            }
            if(!ojUser.isPassword(password)) {
                $("#reg_password_error").attr('class', 'alert alert-error'
                    ).html("Your password should be made of '0-9a-zA-Z_-' and it's length >= 6");
                return false;
            }
            if(!ojUser.checkout_password(password, password_again)) {
                $("#confirm").attr('class', 'alert alert-error'
                    ).html('Password does not match!');
                return false;
            }
            
            //当所有的数据通过了前台的验证以后，我们就形成一个user对象(其实是一个字典)，准备向后台传送数据。
            var user = {};
            user.csrfmiddlewaretoken =  tool.getCookie('csrftoken');
            user.username = username;
            user.realname = real_name;
            user.student_id = student_id;
            user.email = email;
            user.password = password;
            user.password_again = password_again;
            $("#registerform").hide();
            $("#registerloading").show();
            //采用post方法向后台传送信息。
            $.post("/user/ajaxregister/", user, function(data) {
                //利用匿名回调函数，处理后台返回的信息。
                if(data.canregister) {
                    $("#registerform").submit();
                } else {
                    $("#registerloading").hide();
                    $("#registerform").show();
                    if(data.user_exist) {
                        $("#reg_username_error").attr('class', 'alert alert-error'
                            ).html(data.errmsg);
                    }
                    else if(data.studentID_exist){
                        $("#reg_studentid_error").attr('class', 'alert alert-error'
                            ).html(data.errmsg);
                    } else if(data.email_exist) {
                        $("#reg_email_error").attr('class', 'alert alert-error'
                            ).html(data.errmsg);
                    }
                }
            });
        },
        login: function() {
            var username = $("#loginUsername").val();
            var password = $("#loginPassword").val();

            $('#login_error').attr('class', 'hide');
            $("#login_prompt").attr('class', 'hide');
            if(!ojUser.isUsername(username)){
                $('#login_error').attr('class', 'alert alert-error'
                    ).html("Your username should be made of '0-9a-zA-Z_' and it's length > 4.");
                return false;
            }
            if(!ojUser.isPassword(password)){
                $('#login_error').attr('class', 'alert alert-error'
                    ).html("Your password should be made of '0-9a-zA-Z_-' and it's length >= 6");
                return false;
            }
            var user = {};
            user.csrfmiddlewaretoken =  tool.getCookie('csrftoken');
            user.username = username;
            user.password = password;
            $("#loginform").hide();
            $("#loginloading").show();
            $.post("/user/ajaxlogin/", user, function(data) {
                if(data.canlogin) {
                    $("#loginform").submit();
                } else {
                    $("#loginloading").hide();
                    $("#loginform").show();
                    if(data.login){
                        $("#login_prompt").attr('class', 'alert alert-error'
                            ).html("You have already logined in.");    
                    }
                    else{
                        $("#login_error").attr('class', 'alert alert-error'
                            ).html(data.errmsg);    
                    }
                }
            });
        },
        retrieve: function() {
            var email = $("#email").val();
            $("#email_msg").attr('class', 'hide');
            if(!ojUser.isEmail(email)){
                $('#email_msg').attr('class', 'alert alert-error'
                    ).html('Please checkout your email format!');
                return false;
            }
            var user = {};
            user.csrfmiddlewaretoken =  tool.getCookie('csrftoken');
            user.email = email;
            $("#retrieveform").hide();
            $("#retrieveloading").show();
            $.post("/user/ajaxretrieve/", user, function(data) {
                if(data.ok) {
                    $("#retrieveloading").hide();
                    $("#email_msg").attr('class', 'alert alert-success'
                        ).html("Congratulations,go to your email and reset your password!");
                    var cnt = 1;
                    var closit = setTimeout(function(){
                        if(cnt==2){
                            clearTimeout(closit);
                            $("#retrieveform").submit();
                        }
                        $('#myModal_retrieve').modal('hide');
                        cnt=cnt+1;
                    }, 2000);
                } else {
                    $("#retrieveloading").hide();
                    $("#retrieveform").show();
                    $("#email_msg").attr('class', 'alert alert-error'
                        ).html("No such email!");
                }
            });
        },
    }
})(jQuery);
/*===================================================================================================================*/
/*===================================================================================================================*/
/*==========================================ojProblem ojProblem======================================================*/
/*===================================================================================================================*/
/*===================================================================================================================*/
var ojProblem = (function($){
    var gStatusFooter = true;
    var gGetStatus = {};
    var gSearchStatus = {};
    var gGetStatistic = {};
    var gSearchStatistic = {};
    var _HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
    var sort_content = {};
    var extended_base, contest_id, problem_id;
    var gStatusListReturn;
    return {
        getProURL: function(cid, pid){
            var res;
            if(cid===-1) res = new Array('/problem/', pid, '/');
            else res = new Array('/contest/', cid, '/problem/', pid, '/');
            return res.join("");
        },
        getMyCodeURL: function(cid, pid){
            var res;
            if(cid===-1) res = new Array('/problem/code/', pid,'/');
            else res = new Array('/contest/', cid, '/problem/code/', pid, '/');
            return res.join("");
        },
        getPicURL: function(pid){
            if(pid) return '/static/img/icon-ok.png';
            else return '';
        },
        allStatusDisplay: function(data){
            var h = tag('tbody');
            $.each(data.submits, function(i, submit) {
                var p_c_URL = [];
                var code_URL = [];

                contest_id = submit.contest_id
                p_c_URL[0] = tag('td',
                                    tag('a',submit.problemid).attr('href',
                                        ojProblem.getProURL(contest_id, submit.problemid)));
                
                if(submit.show_code){
                    code_URL = tag('td',
                                   tag('a', submit.compiler).attr('href',
                                       ojProblem.getMyCodeURL(contest_id, submit.id)));
                }
                else{
                    code_URL = tag('td', submit.compiler);
                }

                h.push(tag('tr',
                    tag('td', submit.id),
                    p_c_URL,
                    tag('td', submit.username),
                    tag('td', oj._status_str[submit.result]),
                    tag('td', submit.memory),
                    tag('td', submit.time),
                    code_URL,
                    tag('td', submit.length),
                    tag('td', submit.submit_time)
                ));
            });
            $('#tableID tbody').html(h.html());
        },
        getStatusList: function(page) {
            if(!isNaN(page)) gGetStatus.page=page;

            extended_base = $('#extended-base').val();
            contest_id = $("#contest-id").val();
            if(extended_base == 'contest_base.html'){
                gGetStatus.purview = 'contest';
            }else{
                gGetStatus.purview = 'normal';
            }
            var href = window.location.href;
            var reg_patt = /=/g;
            if(reg_patt.test(href)){
                var patts = href.split("=");
                if(patts.length==3){
                    var pid = patts[1].split("&")[0];
                    var type = patts[2];
                }else if(patts.length==4){
                    var pid = patts[1].split("&")[0];
                    var type = patts[2].split('&')[0];
                    var username = patts[3];
                }
                if(pid && type){
                    var val_res = {
                        'ac':0, "wa":4, "ce":7, "pe":1, "tle":2, "mle":3,
                        "re":5, "ole":6, "sye":8, "see":9,
                    }
                    $("#result").val(val_res[type]);
                    if(type=='all') $('#result').val('');
                    $("#problemid").val(pid);
                    $('#userid').val(username);
                    if(gStatusListReturn) {
                        clearTimeout(gStatusListReturn);
                        gStatusFooter = false;
                    }
                    ojProblem.searchStatusList(1);
                    return false;
                }
            }

            gGetStatus.contest_id = contest_id;
            $.get('/problem/jallstatus/', gGetStatus, function(data) {
                ojProblem.allStatusDisplay(data);
                $('#page_area').pagination(
                    {'max': data.max,
                     'page': data.page,
                     'callback': ojProblem.getStatusList
                });
                if(gStatusFooter) position.footer($(document).height());
            });
            if(gStatusListReturn) {
                clearTimeout(gStatusListReturn);
                gStatusFooter = false;
            }
            gStatusListReturn = setTimeout(ojProblem.getStatusList, 3000);
        },
        searchStatusList: function(page) {
            if(gStatusListReturn) clearTimeout(gStatusListReturn);
            var _userid_search = $("#userid").val();
            var _problemid_search = $("#problemid").val();
            var _result_search = $("#result").val();
            var _compiler_search = $("#compiler").val();

            gSearchStatus.csrfmiddlewaretoken =  tool.getCookie('csrftoken');
            gSearchStatus.userid = _userid_search;
            gSearchStatus.problemid = _problemid_search;
            gSearchStatus.result = _result_search;
            gSearchStatus.compiler = _compiler_search;
            gSearchStatus.page = page;

            extended_base = $('#extended-base').val();
            if(extended_base == 'contest_base.html'){
                gSearchStatus.purview = 'contest';
            }else{
                gSearchStatus.purview = 'normal';
            }
            contest_id = $("#contest-id").val();
            gSearchStatus.contest_id = contest_id;

            $.post('/problem/jallstatus/', gSearchStatus, function(data) {
                ojProblem.allStatusDisplay(data);
                $('#page_area').pagination(
                    {'max': data.max,
                     'page': data.page,
                     'callback': ojProblem.searchStatusList}
                );
                position.footer($(document).height(), true);
            });
        },
        proDisplay: function(data){
            var h = tag('tbody');

            $.each(data.problems, function(i, problem) {
                var ratio, diffculty;
                var cloudDiv, progress, bar, img_td;

                if(problem.submit_num==0) ratio = 0;
                else ratio = problem.ac_num/problem.submit_num;
                ratio = (ratio*100).toFixed(2);
                diffculty = (100-ratio).toString()+'%';
                ratio = ratio.toString()+'%';
                progressVal = 'width:'+diffculty;
                progress = tag('div').attr('class', 'progress');
                bar = tag('div').attr('class', 'bar').attr('style', progressVal);
                progress.push(bar).toString();
                img_td = problem.ac ? tag('img', "").attr('src', '/static/img/icon-ok.png'):" ";

                cloudDiv = tag('div').attr('class', 'pro-cloud normal-radius');
                $.each(problem.cloud, function(j, c){
                    cloudDiv.push(tag('span', c).attr('class', 'normal-radius'));
                });

                h.push(tag('tr',
                    tag('td',img_td),
                    tag('td',
                        tag('a', problem.id).attr('href', ojProblem.getProURL(-1, problem.id))),
                    tag('td',
                        tag('a',problem.title).attr('href', ojProblem.getProURL(-1, problem.id))).
                        push(cloudDiv).attr('class', 'pro-title'),
                    tag('td', progress),
                    tag('td', '('+problem.ac_num+' / '+problem.submit_num+') '+ratio),
                    tag('td', problem.last_submit_time)
                ));
            });
            $('#tableID tbody').html(h.html());
        },
        statisticDisplay: function(data){
          extended_base = $('#extended-base').val();
          var h = tag('tbody');
            $.each(data.pstatus, function(i, ps){
              if(ps.show_code){
                code_URL = tag('td',
                               tag('a', ps.compiler).attr('href',
                                   ojProblem.getMyCodeURL('', ps.runid, extended_base)));
              }else{
                  code_URL = tag('td', ps.compiler);
              }

              h.push(tag('tr',
                tag('td', ps.runid),
                tag('td', ps.username),
                tag('td', ps.memory),
                tag('td', ps.time),
                code_URL,
                tag('td', ps.length),
                tag('td', ps.submit_time)
              ));
            });
            $('#tableID tbody').html(h.html());
        },
        getProList: function(page) {
            var _click_cloud;
            var username;
            var href = decodeURI(window.location.href);
            var result = href.split('=');
            var length = result.length;

            if(length == 2){ /*search from cloud*/
                _click_cloud = result[1];
                username = "";
            }else if(length==3){ /*search from user-cloud*/
                _click_cloud = result[1].split('&')[0];
                username = result[2];
            }

            var search_content = {};
            if(!isNaN(page)) search_content.page=page;
            if(_click_cloud!=null){
                search_content._id = "";
                search_content.title = "";
                search_content.source ="";
                search_content.cloud = _click_cloud;
                search_content.operation = "COMBINE";
                $("#cloud").val(_click_cloud);
            }else{
                search_content.operation = "ALL";
            }
            
            search_content.csrfmiddlewaretoken =  tool.getCookie('csrftoken');
            $.post('/problem/jlist/', search_content, function(data) {
                ojProblem.proDisplay(data);
                $('#page_area').pagination(
                    {'max': data.max,
                     'page': data.page,
                     'callback': ojProblem.getProList}
                );
                position.footer($(document).height());
            });
        },
        getStatistic: function(page){
            if(!isNaN(page)) gGetStatistic.page = page;
            gGetStatistic.operation = "ALL";

            extended_base = $('#s-extended-base').val();

            if(extended_base=="base.html") gGetStatistic.purview = 'normal';
            else {
                gGetStatistic.purview = 'contest';
                contest_id = $("#s-contest-id").val();
                gGetStatistic.contest_id = contest_id;
            }
            problem_id = $("#s-problem-id").val();
            $.get('/problem/'+problem_id+'/jstatistic/', gGetStatistic, function(data){
                ojProblem.statisticDisplay(data);
                $("#page_area").pagination(
                    {'max': data.max,
                     'page': data.page,
                     'callback': ojProblem.getStatistic
                });
                position.footer($(document).height());
            });
        },
        reformCloudUrl: function(that) {
            var href;
            var text = that.text();
            var username = that.data('user');
            var content;

            if(username!==undefined) content = new Array(text, '&user=', username);
            else content = new Array(text);

            href = new Array("/problem/list/?cloud=", content.join(''));

            that.attr("href", href.join(""));
        },
        reformStatisticUrl: function(that, extended_base, type){
            var href;
            contest_id = $("#s-contest-id").val();
            problem_id = $("#s-problem-id").val();
            if(extended_base == "base.html") href = new Array("/problem/allstatus/?pid=", problem_id, "&type="+type);
            else if(extended_base == "contest_base.html") href = new Array("/contest/",contest_id,"/allstatus/?pid=",problem_id,"&type=",type);
            that.attr("href", href.join(""));
        },
        reformUserRankUrl: function(that){
            var href;
            username = $('#rank-username').val();
            href = new Array('/user/ranklist/?username=', username);
            that.attr('href', href.join(''));
        },
        encodeHtml: function(s){
          return (typeof s != "string") ? s :
            s.replace(_HTML_ENCODE,
                      function($0){
                        var c = $0.charCodeAt(0), r = ["&#"];
                        c = (c==0x20)?0xA0:c;
                        r.push(c); r.push(';');
                        return r.join("");
                      });
        },
        render: function(lan){
          var lan_table = {
            'gcc': 'c',
            'g++': 'c',
            'python': 'python',
            'java': 'java',
            'pascal': 'pascal',
          };
          $("#result_div").empty();
          $("#result_div").prepend("<pre>"+ojProblem.encodeHtml($("#code_source").val())+"</pre>");
          var class_v = "brush :" + lan_table[lan] +";";
          $("#result_div pre").addClass(class_v);
          SyntaxHighlighter.highlight();
        },
        combineSearch: function(page){
            var _id_entry = $("#problemID").val() || "";
            var _title_entry = $("#title").val() || "";
            var _source_entry = $("#source").val() || "";
            var _cloud_entry = $("#cloud").val() || "";

            var search_content = {};
            search_content.csrfmiddlewaretoken =  tool.getCookie('csrftoken');
            search_content._id = _id_entry;
            search_content.title = _title_entry;
            search_content.source = _source_entry;
            search_content.cloud = _cloud_entry;
            search_content.page = page;
            search_content.operation = "COMBINE";
            $.post('/problem/jlist/', search_content, function(data){
                ojProblem.proDisplay(data);
                $('#page_area').pagination(
                    {'max': data.max,
                     'page': data.page,
                     'callback': ojProblem.combineSearch}
                );
                position.footer($(document).height(), true);
            });
        },
        searchStatistic: function(page, type_, order){
          if(!isNaN(page)) gSearchStatistic.page = page;
          else return false;

          var _compiler_entry = $("#compiler").val();
          var _username_entry = $("#username").val();
          if(type_!=undefined && order!=undefined){
            gSearchStatistic.type_ = type_;
            gSearchStatistic.order = order;  
          }
          gSearchStatistic.compiler = _compiler_entry;
          gSearchStatistic.username = _username_entry;
          gSearchStatistic.operation = "Search";

          extended_base = $('#extended-base').val();
          if(extended_base == 'contest_base.html'){
              gSearchStatistic.purview = 'contest';
          }else{
              gSearchStatistic.purview = 'normal';
          }

          contest_id = $("#s-contest-id").val();
          problem_id = $("#s-problem-id").val();
          gSearchStatistic.contest_id = contest_id;
          $.get("/problem/"+problem_id+"/jstatistic/", gSearchStatistic, function(data){
            ojProblem.statisticDisplay(data);
            $("#page_area").pagination(
              {'max': data.max,
               'page': data.page,
               'order': order,/*order参数是为了statistic中的table排序时而用的*/
               'type_': type_,/*type_参数是为了statistic中的table排序时而用的*/
               'callback': ojProblem.searchStatistic
            });
            position.footer($(document).height(), true);
          });
        },
        changeArrow: function(_self){
          if($(_self).hasClass('down_arrow')){
              $(_self).removeClass('down_arrow').addClass('up_arrow');
              return 's2b'; 
            }else{
              $(_self).removeClass('up_arrow').addClass('down_arrow');
              return 'b2s';
            }
        },
        statisticSort: function(){
          /*searchStatistic()传第二个参数时要和数据库的字段一致*/
          $("#memory").click(function(){
            var order = ojProblem.changeArrow($(this));
            ojProblem.searchStatistic(1, 'memory_used', order);
          });/*end of memory-sort*/

          $("#time").click(function(){
            var order = ojProblem.changeArrow($(this));
            ojProblem.searchStatistic(1, 'time_used', order);
          });/*end of memory-time*/

          $("#length").click(function(){
            var order = ojProblem.changeArrow($(this));
            ojProblem.searchStatistic(1, 'code_length', order);
          });/*end of memory-length*/

          $("#submit").click(function(){
            var order = ojProblem.changeArrow($(this));
            ojProblem.searchStatistic(1, 'submit_date', order);
          });/*end of memory-submit*/
        },
    }
})(jQuery);

/*===================================================================================================================*/
/*===================================================================================================================*/
/*==========================================plugin plugin plugin=====================================================*/
/*===================================================================================================================*/
/*===================================================================================================================*/
var ojPage = (function($){
    var gConf;
    //这里的插件只会在初始化的时候被创建一次，在以后的ojPage的调用中，不会再次创建它了,，所以不需要判断插件是不是在$中
    $.fn.pagination = function(conf){
        gConf = conf;
        var page = this.ojPaginate(conf);
        var startPage = page[0];
        var endPage = page[1];
        var inhtml = this.ojFormat(conf, startPage, endPage);
        $.each(this, function(i, obj){
            $(obj).html(inhtml);
        });
    };
    $.fn.ojPaginate = function(conf){
        var startPage, endPage;

        if(conf.span == undefined) conf.span = 9;
        conf.span = conf.span - 1;

        if (conf.page > 5 && conf.max - conf.span > 0){
            startPage = conf.page - 4;
            if (startPage > conf.max - conf.span){
                startPage = conf.max - conf.span;    
            }
        }else startPage = 1;

        endPage = startPage + conf.span;
        if(endPage > conf.max) endPage = conf.max;

        return [startPage, endPage];
    };
    $.fn.ojFormat = function(conf, startPage, endPage){
        var ul = tag('ul');
        if(conf.page == 1){
            ul.push(tag('li',tag('a', '<<')).attr('class', 'disabled')).
            push(tag('li',tag('a', '<')).attr('class', 'disabled'));
        }else{
            ul.push(tag('li',tag('a', '<<').attr('href', '#').attr('onclick', 'ojPage.paging($(this).html()); return false'))).
            push(tag('li',tag('a','<').attr('href', '#').attr('onclick', 'ojPage.paging($(this).html()); return false;')));
        }

        for(var i=startPage; i<=endPage; i++){
            if (i == conf.page) ul.push(tag('li',tag('a', i)).attr('class','active'));
            else ul.push(tag('li',tag('a', i).attr('href', '#').attr('onclick', 'ojPage.paging($(this).html());return false;')));
        }

        if(conf.page == conf.max){
            ul.push(tag('li',tag('a','>')).attr('class', 'disabled')).
            push(tag('li',tag('a', '>>')).attr('class','disabled'));
        }else{
            ul.push(tag('li',tag('a', '>').attr('href', '#').attr('onclick', 'ojPage.paging($(this).html()); return false;'))).
            push(tag('li',tag('a', '>>').attr('href', '#').attr('onclick', 'ojPage.paging($(this).html()); return false;')));
        }

        return tag('div').attr('class','pagination').push(ul).toString();
    };
    return {
        paging: function(val){
            if (val == '&lt;') gConf.callback(gConf.page-1, gConf.type_, gConf.order);
            else if(val == '&gt;') gConf.callback(gConf.page+1, gConf.type_, gConf.order);
            else if(val == '&lt;&lt;') gConf.callback((gConf.page=1), gConf.type_, gConf.order);
            else if(val == '&gt;&gt;') gConf.callback((gConf.page=gConf.max), gConf.type_, gConf.order);
            else gConf.callback(parseInt(val), gConf.type_, gConf.order);
        },
    }
})(jQuery);

(function($){
    var dis=0;
    var arr = new Array();

    $.fn.myMarq = function(conf){
        var fdiv, sdiv, gReturn, road, wrapperWidth, textWidth, res, rText;

        rText = this.text();
        rText = rText.replace(/(\s+)/ig, '&nbsp;');

        fdiv = tag('div').attr('class', 'fdiv');
        sdiv = tag('div', rText).attr('class', 'sdiv');
        fdiv.push(sdiv);
        this.html(fdiv.toString());

        target = this.children().children();

        wrapperWidth = this.children().width();
        textWidth = target.width();
        road = wrapperWidth + textWidth;

        target.css('width', textWidth);

        for(var i=0; i<road; i++){
            res = new Array(wrapperWidth, 'px');
            arr[i] = res.join('');
            wrapperWidth = wrapperWidth - 1;
        }

        var roll = function(){
            target.css(conf.direction, arr[dis]);
            dis = dis + 1;
            if(dis >= road) dis = dis % road; //一定要注意边界的问题，可能导致浏览器崩溃！
            gReturn = setTimeout(roll, conf.speed);
        };

        roll();

        this.hover(
            function(){
                clearTimeout(gReturn);
            },
            function(){
                roll();
            }
        );
    };
})(jQuery);

(function($){
    var preArr=null, liHeight = 26;
    var createSubmit = function(submits){
        var len = submits.length, ul=tag('ul');
        for(var i=0; i<len; i++){
            var li = tag('li'), ul2 = tag('ul'), li1, li2, li3, li4;
            var pro_url = new Array('/problem/', submits[i].problemid, '/');
            li1 = tag('li', 'Congratulations!').attr('class', 'congratulation');
            li2 = tag('li', submits[i].username).attr('class', 'd-user');
            li3 = tag('li', 'Killed').attr('class', 'kill');
            li4 = tag('li').push(tag('a', submits[i].problemid).attr('href', pro_url.join('')));
            ul.push(li.push(ul2.push(li1).push(li2).push(li3).push(li4)));
        }
        return ul;
    };
    $.fn.roll = function(speed){
        var getContent = {};
        var gReturn;

        $.get('/news/submit/', getContent, function(data){
            if(preArr!=null){ //如果有新的AC
                var master = preArr[0];
                var count=-1, arr=data.ac_arr, len=data.ac_arr.length;
                //get roll count
                for(var i=0; i<10; i++){
                    if(arr[i].username != master.username || arr[i].problemid != master.problemid ){
                        break;
                    }
                    count = count + 1;
                }
                if(count > -1){
                    var dis = (count+1)*26;
                    var move = 0;
                    var rolledDis;
                    //insert after
                    var liS = createSubmit(data.ac_arr.slice(0, 5).reverse());
                    var inserted = $(liS.html());
                    target.append(inserted);
                    //roll it
                    var rollIt = function(){
                        if(move==dis) {
                            clearTimeout(gReturn);
                            return;
                        }
                        rolledDis = new Array(0-move, 'px');
                        move = move + 1;
                        target.css('margin-top', rolledDis.join(''));
                        gReturn = setTimeout(rollIt, speed);
                    }

                    rollIt();
                    //remove before

                    for(var i=0; i<=count; i++) target.remove(target.children());
                }
                
            }else{ //如果是首次打开页面
                var ul = createSubmit(data.ac_arr);
                $('#r-submit').html(ul.toString());
                preArr = data.ac_arr.slice();
            }
            count = 4;
            var target = $('#r-submit').children();
            var dis = (count+1)*liHeight;
            var rolledDis;
            var move = 0;
            //insert after
            var liS = createSubmit(data.ac_arr.slice(0, 5));
            var inserted = $(liS.html());
            target.append(inserted);
            //roll it
            var rollIt = function(){
                if(move==dis) {
                    clearTimeout(gReturn);
                    //remove before
                    for(var i=0; i<=count; i++) target.children().first().remove();
                    target.css('margin-top', 0);
                    return;
                }
                rolledDis = new Array(0-move, 'px');
                move = move + 1;
                target.css('margin-top', rolledDis.join(''));
                gReturn = setTimeout(rollIt, speed);
            };

            rollIt();

                   
        });
    };
})(jQuery);

/*===================================================================================================================*/
/*===================================================================================================================*/
/*==========================================tag tag tag tag tag======================================================*/
/*===================================================================================================================*/
/*===================================================================================================================*/
var tag = (function(){
    var Tag = function(tagName, tagAttrs, single){
        var _tagName, _tagAttrs, _single, _brother=[], _childTag=[];
        _tagName = tagName;
        _tagAttrs = tagAttrs;
        _single = single;
        return {
            isMe: function(){},
            attr: function(key, value){
                if(value === undefined) return _tagAttrs[key];
                else _tagAttrs[key] = value;
                return this;
            },
            push: function(inserted_tag){
                _childTag.push(inserted_tag);
                return this;
            },
            unshift: function(inserted_tag){
                _childTag.unshift(inserted_tag);
                return this;
            },
            concat: function(inserted_tag){
                _brother = _brother.concat(inserted_tag);
                return this;
            },
            toString: function(){//selfHtml
                var arr = new Array();
                var tmp = new Array();
                var arrlen = 0;
                arr[arrlen++] = '<';
                arr[arrlen++] = _tagName;
                for (var key in _tagAttrs){
                    tmp[0] = ' ';
                    tmp[1] = key;
                    tmp[2] = '="';
                    tmp[3] = _tagAttrs[key];
                    tmp[4] = '"';
                    arr[arrlen++] = tmp.join('');
                }

                arr[arrlen++] = _single ? ' />' : '>';
                
                _childTag.map(function(inserted_tag){
                    if(inserted_tag!=undefined) arr[arrlen++] = inserted_tag.toString();
                });

                if(!_single){
                    arr[arrlen++] = '</';
                    arr[arrlen++] = _tagName;    
                    arr[arrlen++] = '>';
                }

                _brother.map(function(concated_tag){
                    if(concated_tag!=undefined) arr[arrlen++] = concated_tag.toString();
                });
                return arr.join('');
            },
            html: function() {//childHtml
                var arr = new Array();
                var arrlen = 0;
                _childTag.map(function(inserted_tag){
                    arr[arrlen++] = inserted_tag.toString();
                });
                return arr.join('');
            },
        }
    };
    return function(tagName){
        var attrs = {}, tObj, i=1;
        if(arguments[1]!='s'){//is not a single tag
            if(arguments[1] instanceof Object){
                try{
                    arguments[1].isMe();
                }catch(e){
                    attrs = arguments[1];
                    i = 2;
                }
            }
            tObj = Tag(tagName, attrs);
        }else{ // is a single tag
            i = 2;
            if(arguments[1] instanceof Object){ //arguments[1] is {} object
                try{
                    arguments[1].isMe();
                }catch(e){
                    attrs = arguments[2];
                    i = 3;
                }
            }
            tObj = Tag(tagName, attrs, true);
        }
        for(; i<arguments.length; i++) {
            tObj.push(arguments[i]);
        }
        return tObj;
    };
})();

/*===================================================================================================================*/
/*===================================================================================================================*/
/*==========================================online online============================================================*/
/*===================================================================================================================*/
/*===================================================================================================================*/
var online = (function($){
    var beat = function(){
        var beat_content = {};
        beat_content.csrfmiddlewaretoken = tool.getCookie('csrftoken');
        $.post("/online/jbeat/", beat_content, function(data) {});
        setTimeout(beat, 5000);
    };
    beat();

    return{
        showCharts: function(){
            var show_content = {};
            show_content.csrfmiddlewaretoken = tool.getCookie('csrftoken');
            $.post('/online/submit/', show_content, function(datas){
                 Highcharts.theme = {
                   colors: ["#08c", "#DF5353", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                   chart: {
                      backgroundColor: {
                         linearGradient: [234, 234, 234, 1000],
                         stops: [
                            [0, 'rgb(234, 234, 2234)'],
                            [1, 'rgb(200, 200, 200)']
                         ]
                      },
                      borderColor: '#f0f0f0',
                      borderWidth: 2,
                      className: 'dark-container',
                      plotBackgroundColor: 'rgba(200, 200, 200, .1)',
                      plotBorderColor: '#ccc',
                      plotBorderWidth: 1
                   },
                   title: {
                      style: {
                         color: '#C0C0C0',
                         font: '16px "Trebuchet MS", Verdana, sans-serif'
                      }
                   },
                   subtitle: {
                      style: {
                         color: '#666666',
                         font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
                      }
                   },
                   xAxis: {
                      gridLineColor: '#ccc',
                      gridLineWidth: 1,
                      labels: {
                         style: {
                            color: '#A0A0A0'
                         }
                      },
                      lineColor: '#ccc',
                      tickColor: '#ccc',
                      title: {
                         style: {
                            color: '#CCC',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                         }
                      }
                   },
                   yAxis: {
                      gridLineColor: '#ccc',
                      labels: {
                         style: {
                            color: '#A0A0A0'
                         }
                      },
                      lineColor: '#ccc',
                      minorTickInterval: null,
                      tickColor: '#ccc',
                      tickWidth: 1,
                      title: {
                         style: {
                            color: '#CCC',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                         }
                      }
                   },
                   tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      style: {
                         color: '#F0F0F0'
                      }
                   },
                   toolbar: {
                      itemStyle: {
                         color: 'silver'
                      }
                   },
                   plotOptions: {
                      line: {
                         dataLabels: {
                            color: '#CCC'
                         },
                         marker: {
                            lineColor: '#333'
                         }
                      },
                      spline: {
                         marker: {
                            lineColor: '#333'
                         }
                      },
                      scatter: {
                         marker: {
                            lineColor: '#333'
                         }
                      },
                      candlestick: {
                         lineColor: 'white'
                      }
                   },
                   legend: {
                      itemStyle: {
                         font: '9pt Trebuchet MS, Verdana, sans-serif',
                         color: '#A0A0A0'
                      },
                      itemHoverStyle: {
                         color: '#08c'
                      },
                      itemHiddenStyle: {
                         color: '#444'
                      }
                   },
                   credits: {
                      style: {
                         color: '#666'
                      }
                   },
                   labels: {
                      style: {
                         color: '#CCC'
                      }
                   },


                   navigation: {
                      buttonOptions: {
                         symbolStroke: '#DDDDDD',
                         hoverSymbolStroke: '#FFFFFF',
                         theme: {
                            fill: {
                               linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                               stops: [
                                  [0.4, '#606060'],
                                  [0.6, '#333333']
                               ]
                            },
                            stroke: '#000000'
                         }
                      }
                   },

                   // scroll charts
                   rangeSelector: {
                      buttonTheme: {
                         fill: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                               [0.4, '#888'],
                               [0.6, '#555']
                            ]
                         },
                         stroke: '#000000',
                         style: {
                            color: '#ccc',
                            fontWeight: 'bold'
                         },
                         states: {
                            hover: {
                               fill: {
                                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                  stops: [
                                     [0.4, '#BBB'],
                                     [0.6, '#888']
                                  ]
                               },
                               stroke: '#000000',
                               style: {
                                  color: 'white'
                               }
                            },
                            select: {
                               fill: {
                                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                  stops: [
                                     [0.1, '#000'],
                                     [0.3, '#333']
                                  ]
                               },
                               stroke: '#000000',
                               style: {
                                  color: 'yellow'
                               }
                            }
                         }
                      },
                      inputStyle: {
                         backgroundColor: '#333',
                         color: 'silver'
                      },
                      labelStyle: {
                         color: 'silver'
                      }
                   },

                   navigator: {
                      handles: {
                         backgroundColor: '#666',
                         borderColor: '#ccc'
                      },
                      outlineColor: '#CCC',
                      maskFill: 'rgba(16, 16, 16, 0.5)',
                      series: {
                         color: '#7798BF',
                         lineColor: '#A6C7ED'
                      }
                   },

                   scrollbar: {
                      barBackgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                               [0.4, '#888'],
                               [0.6, '#555']
                            ]
                         },
                      barBorderColor: '#CCC',
                      buttonArrowColor: '#CCC',
                      buttonBackgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                               [0.4, '#888'],
                               [0.6, '#555']
                            ]
                         },
                      buttonBorderColor: '#CCC',
                      rifleColor: '#FFF',
                      trackBackgroundColor: {
                         linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                         stops: [
                            [0, '#000'],
                            [1, '#333']
                         ]
                      },
                      trackBorderColor: '#666'
                   },

                   // special colors for some of the
                   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
                   legendBackgroundColorSolid: 'rgb(35, 35, 70)',
                   dataLabelsColor: '#444',
                   textColor: '#C0C0C0',
                   maskColor: 'rgba(255,255,255,0.3)'
                };

                // Apply the theme
                var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
                $('#container').highcharts({
                    colors: [
                       '#4572A7', 
                       '#8bbc21', 
                       '#b94a48', 
                       '#3D96AE', 
                       '#DB843D', 
                       '#92A8CD', 
                       '#A47D7C', 
                       '#B5CA92'
                    ],
                    title: {
                        text: '',
                        x: 0 
                    },
                    xAxis: {
                        categories: datas.dates
                    },
                    yAxis: {
                        title: {
                            text: null,
                            style: {
                                color: '#08c',
                                fontWeight: 'normal'
                            },
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'top',
                        borderWidth: 1,
                        x: 447
                    },
                    series: [{
                        name: 'User',
                        data: datas.user
                    }, {
                        name: 'Submit(AC)',
                        data: datas.ac
                    },{
                        name:  'Submit(All)',
                        data: datas.al
                    }]
                });
            });
            $('text:contains(Highcharts.com)').remove();
        },
    }
})(jQuery);

var recommend = (function($){
    var newCome = true;

    return {
        showHistory: function(page){
            var get_content = {};
            get_content.page = page;

            $.get('/recommend/jrecommend/', get_content, function(data){
                var h = tag('tbody');
                $.each(data.histy, function(i, his) {
                    var p_c_URL = [];
                    var code_URL = [];
                    var title = new Array(his.title, '(', his.problemid, ')');

                    contest_id = his.contest_id
                    p_c_URL[0] = tag('td',
                                        tag('a',title.join('')).attr('href',
                                            ojProblem.getProURL(contest_id, his.problemid)));
                    
                    if(his.show_code){
                        code_URL = tag('td',
                                       tag('a', his.compiler).attr('href',
                                           ojProblem.getMyCodeURL(contest_id, his.submit_id)));
                    }
                    else{
                        code_URL = tag('td', his.compiler);
                    }

                    h.push(tag('tr',
                        tag('td', his.seq),
                        p_c_URL,
                        tag('td', oj._status_str[his.result]),
                        code_URL,
                        tag('td', his.submit_time)
                    ));
                });
                
                $('#his-table tbody').html(h.html());

                $('#page_area').pagination({
                    'max': data.max,
                    'page': data.page,
                    'callback': recommend.showHistory
                });
                if(newCome) {
                    recommend.showColumn();
                    newCome = false;
                }

                var hh = tag('tbody');
                var total = tag('td', 'total');
                var ntotal = tag('td', data.total);
                var ac = tag('td', 'AC');
                var nac = tag('td', data.ac_num);
                var other = tag('td', 'Other');
                var nother = tag('td', data.other_num);
                var tr = tag('tr');
                hh.push(tr.push(total).push(ac).push(other));
                var tr = tag('tr');
                hh.push(tr.push(ntotal).push(nac).push(nother));
                $('#statistic-table tbody').html(hh.html());
            });
        },
        showColumn: function(){
            var show_content = {};
            show_content.csrfmiddlewaretoken = tool.getCookie('csrftoken');
            $.post('/recommend/jrecommend/', show_content, function(data){
                var tbody = tag('tbody');
                $.each(data.message, function(i, msg){
                    var tr = tag('tr');
                    var td1 = tag('td', msg.seq);
                    var td2 = tag('td', msg.cloud);
                    var ratio = new Array(msg.AC, '/', msg.Total);
                    var td3 = tag('td', ratio.join(''));
                    tr.push(td1).push(td2).push(td3);
                    tbody.push(tr);
                });
                $('#know tbody').html(tbody.html());
                position.footer($(document).height(), false, false);
            });
        },
    }
})(jQuery);


/*===================================================================================================================*/
/*===================================================================================================================*/
/*==========================================Optimize Optimize========================================================*/
/*===================================================================================================================*/
/*===================================================================================================================*/
var optimize = (function($){
    return {
        debounce: function(func, wait, immediate){
            var timeout;
            return function(){
                var context = this, args = arguments;
                var later = function(){
                    timeout = null;
                    if(!immediate) func.apply(context, args); //如果不是立即执行
                };
                var callNow = immediate && !timeout; //判断是不是立即执行
                clearTimeout(timeout);
                timeout = setTimeout(later, wait); //延迟执行
                if(callNow) func.apply(context, args); //如果是立即执行，那么就执行
            };
        }
    }
})(jQuery);

/*===================================================================================================================*/
/*===================================================================================================================*/
/*==========================================Footer and error============================================================*/
/*===================================================================================================================*/
/*===================================================================================================================*/

var position = (function($){
    return {
        footer: function(docHeight, error, adjust){
            var footer = $('#footer');
            var topDis;
            if(error || adjust) topDis = new Array(docHeight - 50, 'px');
            else topDis = new Array(docHeight, 'px');
            footer.css('top', topDis.join('')); 
        },
        errora: function(winHeight){
            var errorPage = $('#error-page');
            var errorTip = $('#tip-row');
            var height = winHeight - 50 + 1;//add 1: in case of height/2
            var errorHeight = new Array(height, 'px');
            var topDis = new Array((height-40)/2 + 40 - 30 - 1, 'px'); //30 = error-tip / 2

            errorPage.css('height', errorHeight.join(''));
            errorTip.css('top', topDis.join(''));
        }
    }
})(jQuery);

(function($){
    if(document.addEventListener){ //for firefox and chrome
        window.addEventListener('resize', optimize.debounce(function(event){
            position.footer($(document).height(), false, true);
        }, 300), false);
    }else if(window.attachEvent){ //for ie
        window.attachEvent('onresize', optimize.debounce(function(event){
            position.footer($(document).height(), false, true);
        }, 300));
    }
})(jQuery);

