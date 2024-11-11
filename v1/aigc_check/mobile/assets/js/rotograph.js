!function(){ // 生成随机轮播图
    var x = 35;
    var y = 0;
    var rand = parseInt(Math.random()*(x-y+1)+y);
    var sex = [
        "交互式",
        "山东省",
        "湖南省",
        "地下停",
        "B2B",
        "浅谈上",
        "小学卫",
        "浅析中",
        "三角形",
        "时间额",
        "新技术",
        "倾向于",
        "校内外",
        "虚拟网",
        "虚拟机",
        "前端开",
        "单片机",
        "信息化",
        "机电一",
        "磨床的",
        "公路建",
        "桥梁基",
        "广东省",
        "沥青与",
        "显示器",
        "谈胰腺",
        "H农业",
        "制造业",
        "工业与",
        "污水治",
        "市场影",
        "发电机",
        "风力发",
        "顺丰冷",
        "混泥土",
        "刷式密",
        "抗生素",
        "天津城",
        "共享单",
        "A公司",
        "生态环",
        "高管团",
        "交通银",
        "给排水",
        "北京市",
        "基于随",
        "一罪与",
        "醉酒驾",
        "与非编",
        "简述韩",
        "数字化",
        "土壤肝",
        "针灸､推",
        "虚拟电",
        "契约受",
        "家用热",
        "充分利",
        "地铁盾",
        "宜昌市",
        "越橘杂",
        "红参提",
        "长岭县",
        "美食实",
        "区角活"
    ]
    function rand2() {
         var x = 35;
          var y = 0;
          var rand = sex[parseInt(Math.random()*(x-y+1)+y)];
          return rand || '交互式'
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
        text += "								<div class=\"SuccessfulCase\">"+time()+"分钟前论文《"+rand2()+"**********》检测成功</span></div>";
        text += "							</a></li>";
        $('.news_li').append(text)
    }
}()
function b(){	// 首页新闻滚动
    t = parseInt(x.css('top'));
    y.css('top','30px');
    x.animate({top: t - 30 + 'px'},'slow');	//30为每个li的高度
    if(Math.abs(t) == h-30){ //30为每个li的高度
        y.animate({top:'0px'},'slow');
        z=x;
        x=y;
        y=z;
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
