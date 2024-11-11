!function(){ // 生成随机轮播图
    var x = 35;
    var y = 0;
    var rand = parseInt(Math.random()*(x-y+1)+y);
    var sex = [
        "用户130******, ",
        "用户157******, ",
        '用户131******, ',
        '用户155******, ',
        '用户156******, ',
        '用户158******, ',
        '用户189******, ',
        '用户180******, ',
        '用户133******, ',
        '用户134******, ',
        '用户152******, ',
        '用户188******, ',
        '用户187******, ',
        '用户183******, ',
        '用户182******, ',
        '用户151******, ',
    ]
    function rand2() {
         var x = 35;
          var y = 0;
          var rand = sex[parseInt(Math.random()*(x-y+1)+y)];
          return rand || '用户151******, '
    }
    function time() {
        var x = 15;
          var y = 1;
          var rand = parseInt(Math.random()*(x-y+1)+y);
          return rand
    }
    
    function getRandomArbitrary(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
    }
    for(var i=0; i<20; i++) {
        var text = "";
        text += "							<li><a href=\"#\">";
        text += "								<div class=\"SuccessfulCase\">"+rand2()+'降重前'+getRandomArbitrary(38 , 85)+'%,降重后'+'<span>'+getRandomArbitrary(2 , 20)+'%'+"</span></div>";
        text += "							</a></li>";
        $('.news_li').append(text)
    }
}()
function b(){	// 首页新闻滚动
    t = parseInt(x.css('top'));
    if(Math.abs(t) < h-90){
        y.css('top','108px');
    }
    x.animate({top: t - 30 + 'px'},'slow');	//30为每个li的高度
    if(Math.abs(t) == h-30){ //30为每个li的高度
        y.animate({top:'0px'},'slow');
        z=x;
        x=y;
        y=z;
    }
    if(Math.abs(t) == h-60){ //30为每个li的高度
        y.animate({top:'30px'},'slow');
    }
    if(Math.abs(t) == h-90){ //30为每个li的高度
        y.animate({top:'60px'},'slow');
    }
    setTimeout(b,3000);//滚动间隔时间 现在是3秒
}

$(document).ready(function(){
    $('.swap').html($('.news_li').html());
    x = $('.news_li');
    y = $('.swap');
    h = $('.news_li li').length * 30; //30为每个li的高度
    setTimeout(b,3000);//滚动间隔时间 现在是3秒
})
