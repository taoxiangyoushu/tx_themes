!function(){ // 生成随机轮播图
    var x = 35;
    var y = 0;
    var rand = parseInt(Math.random()*(x-y+1)+y);
    var sex = [
        134, 135, 136, 137, 138, 139, 150, 151, 152, 157, 158, 159, 182, 183, 184, 187, 188,130, 131, 132, 155, 156, 166, 176, 185, 186,133, 153, 177, 180, 181, 189
    ]
    function rand2() {
         var x = 35;
          var y = 0;
          var rand = sex[parseInt(Math.random()*(x-y+1)+y)];
          return rand || '157'
    }

    function rand3(count) {
        return Array.from({ length: count }, () => Math.floor(Math.random() * 10)).join('');
    }
    function time() {
        var x = 15;
          var y = 1;
          var rand = parseInt(Math.random()*(x-y+1)+y);
          return rand
    }
    for(var i=0; i<20; i++) {
        var text = "";
        text += "							<li><a href=\"#\">";
        text += "								<div class=\"SuccessfulCase\">"+time()+"分钟前"+rand2()+"****"+rand3(4)+"升级成为专属推广员 </span></div>";
        text += "							</a></li>";
        $('.news_li').append(text)
    }
}()
function b(){	// 首页新闻滚动
    t = parseInt(x.css('top'));
    y.css('top','32px');
    x.animate({top: t - 32 + 'px'},'slow');	//30为每个li的高度
    if(Math.abs(t) == h-32){ //30为每个li的高度
        y.animate({top:'0px'},'slow');
        var z=x;
        x=y;
        y=z;
    }

    setTimeout(b,3000);//滚动间隔时间 现在是3秒
}

$(document).ready(function(){
    $('.swap').html($('.news_li').html());
    x = $('.news_li');
    y = $('.swap');
    h = $('.news_li li').length * 32; //30为每个li的高度
    setTimeout(b,3000);//滚动间隔时间 现在是3秒
})



