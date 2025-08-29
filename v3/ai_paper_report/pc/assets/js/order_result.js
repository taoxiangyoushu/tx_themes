function ResultHtml(src) {
    var text = "";
    for(var i=0; i<src.length; i++) {
        text += "        <div class=\"OnLine first\">";
        text += "            <div class=\"MerchandiseName\">";
        text += "                <span>"+src[i].goods_name+"";
        text += "                <span class=\""+src[i].label+"\">"+(src[i].label == 'zengsong'? '赠送':[src[i].label == 'zengzhi'? '增值':''])+"";
        text += "                </span>"
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
                text += "                   <span class=\""+src[i].children[k].label+"\">"+(src[i].children[k].label == 'zengsong'? '赠送':[src[i].children[k].label == 'zengzhi'? '增值':''])+"";
                text += "                   </span>"
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
    $('.SingleDownload .Loading').hide();
}

var order_resultTimeout = null
function order_result(order_snid) { // 轮询
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
                var download_dom = '<a class="determine_package Success" href="'+res.data.end_product+'" target="_blank" rel="noopener noreferrer">打包下载</a>'
                if (window.hasOwnProperty('download_post_handle')){
                    download_dom = window.download_post_handle(download_dom)
                }
                $('.SingleDownload .pop_bottom').html(download_dom)
                $('.Operation.AloneDownload').text('已完成').addClass('Success').css('pointerEvents' , 'none')
            }
        },
        error: function () {
            cocoMessage.error("请求失败!请检查网络", 2000);
            clearTimeout(order_resultTimeout);
            order_resultTimeout = setTimeout(function () {
                order_result(order_snid);
            }, 5000);
        },
    });
}

$(document).on('click','.DownloadSeparately',function (){
    $('.determine_package').removeClass('Success')
    $('.SingleDownload .pop_bottom').html('<div class="determine_package">打包下载</div>')
    $('.SingleDownload .pop_cont').html('')
    order_result($(this).data('id'))
    $(".mask_body").show();
    $('.SingleDownload').show();
    $('.SingleDownload .Loading').show();
})
