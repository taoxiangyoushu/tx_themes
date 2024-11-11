function ResultHtml(src) {
    var text = "";
    for(var i=0; i<src.length; i++) {
        text += "        <div class=\"OnLine first\">";
        text += "            <div class=\"MerchandiseName\">";
        text += "                <span>"+src[i].goods_name+"";
        if(src[i].label == 'zengsong') {
                text += "                   <img class=\"Label\" src=\"/html/v1/zjchong/mobile/assets/img/Present.png\" alt=\"\">";
        }else if(src[i].label == 'zengzhi') {
            text += "                   <img class=\"Label\" src=\"/html/v1/zjchong/mobile/assets/img/Value-added.png\" alt=\"\">";
        }
        text += "                </span>"
        text += "            </div>";
        text += "            <i></i>";
        if(src[i].file_path) {
            text += "            <span class=\"Operation AloneDownload\" urlData=\""+src[i].file_path+"\" ><a href=\""+src[i].file_path+"\" target=\"_blank\" rel=\"noopener noreferrer\">下载</a></span>";
        }else {
            text += "<span class=\"Operation inStatus\">生成中<dot>...</dot></span>";
        }
        text += "        </div>";

        if(src[i].children && src[i].children.length) {
            for(var k=0; k<src[i].children.length; k++) {
                text += "        <div class=\"OnLine Second\">";
                text += "            <div class=\"MerchandiseName\">";
                text += "                <span>"+src[i].children[k].goods_name+"";
                if(src[i].children[k].label == 'zengsong') {
                    text += "                   <img class=\"Label\" src=\"/html/v1/zjchong/mobile/assets/img/Present.png\" alt=\"\">";
                }else if(src[i].children[k].label == 'zengzhi') {
                    text += "                   <img class=\"Label\" src=\"/html/v1/zjchong/mobile/assets/img/Value-added.png\" alt=\"\">";
                }
                text += "                </span>"
                text += "            </div>";
                text += "            <i></i>";
                if(src[i].children[k].file_path) {
                    text += "            <span class=\"Operation AloneDownload\" urlData=\""+src[i].children[k].file_path+"\"><a href=\""+src[i].children[k].file_path+"\" target=\"_blank\" rel=\"noopener noreferrer\">下载</a></span>";
                }else {
                    text += "<span class=\"Operation inStatus\">生成中<dot>...</dot></span>";
                }
                text += "        </div>";
            }
        }
    }
    $('.SingleDownload .pop_cont').html('').append(text)
}

var order_resultTimeout = null
function order_result(order_snid , is) { // 轮询
    clearTimeout(order_resultTimeout);
    $.ajax({
        type: 'get',
        url: urls + "/api/client/order/order_result?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME+"&order_sn=" + order_snid,
        xhrFields: {
            withCredentials: true
        },
        success: function (res) {
            clearTimeout(order_resultTimeout);
            ResultHtml(res.data.list)
            order_resultTimeout = setTimeout(function () {
                order_result(order_snid);
            }, 5000);
            if(res.data.end_product) {
                clearTimeout(order_resultTimeout);
                $('.determine_package').addClass('Success')
                if(/MicroMessenger/.test(window.navigator.userAgent)){
                    $('.SingleDownload .pop_bottom').html('<div class="copyBtn" data-oid="'+ order_snid +'">复制链接去电脑浏览器下载 <span class="recommend">推荐</span></div>')
                }else{
                    $('.SingleDownload .pop_bottom').html('<div class="copyBtn" data-oid="'+ order_snid +'">复制链接去电脑浏览器下载 <span class="recommend">推荐</span></div><a class="determine_package Success" href="'+res.data.end_product+'" target="_blank" rel="noopener noreferrer">打包下载</a>')
                }
                $('.Operation.AloneDownload').text('已完成').addClass('Success')
            }
            if(is) {
                $(".mask").show();
                $(".SingleDownload").show();
            }
        },
        error: function () {
            toast({msg:"请求失败!请检查网络", time:2000 });
            $(".mask").hide();
            $(".SingleDownload").hide();
            clearTimeout(order_resultTimeout);
            order_resultTimeout = setTimeout(function () {
                order_result(order_snid);
            }, 5000);
        },
    });
}

$(document).on('click','.DownloadSeparately',function (){
    if(!$(this).attr('data-endproduct') || $(this).attr('data-endproduct')=='null') {
        if(/MicroMessenger/.test(window.navigator.userAgent)){
            $('.SingleDownload .pop_bottom').html('<div class="copyBtn" data-oid="'+ $(this).attr('data-id') +'">复制链接去电脑浏览器下载 <span class="recommend">推荐</span></div>')
        }else{
            $('.SingleDownload .pop_bottom').html('<div class="copyBtn" data-oid="'+ $(this).attr('data-id') +'">复制链接去电脑浏览器下载 <span class="recommend">推荐</span></div>')
        }
        $('.SingleDownload .pop_cont').html('')
        $('.determine_package').removeClass('Success')
        toast({
            msg: '正在为您结果...',
            type: 'loading'
        })
        order_result($(this).data('id') , true)
    }else{
        $(".down_pop .imgBlock p").text($(this).attr('data-goodsname'))
        $(".down_pop .copyBtn").attr('data-oid',$(this).attr('data-id'))
        $(".down_pop .downBtn a").attr('href', $(this).attr('data-endProduct'))
        $(".down_pop").show()
        $(".mask").show()
    }
})