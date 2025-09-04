
if(/MicroMessenger/.test(window.navigator.userAgent)) {
    $(".down_pop").addClass('wxBro')
}else{

}

var payId = ''
$(".orderIdTips").on('click',function (){
    $(".mask").show();
    $(".orderTipsPop").show();
})

$(".mask").on('click',function (){
    $(".mask").hide();
    $(".orderTipsPop").hide();
    $(".SingleDownload").hide();
})

$(".hidePop").on('click',function (){
    $(".mask").hide();
    $(".orderTipsPop").hide();
    $(".SingleDownload").hide();
})

// function showOrder(payWay) {
//     if(payWay.default == 'scanCodeRich'){
//         $(".block_tips[data-ordertips='zh']").hide()
//         $(".block_tips[data-ordertips='wx']").hide()
//         $(".block_tips[data-ordertips='ali']").hide()
//         $(".ZhOrder").show()
//     }else{
//         $(".block_tips[data-ordertips='zh']").hide()
//         $(".block_tips[data-ordertips='wx']").show()
//         $(".block_tips[data-ordertips='ali']").show()
//         $(".WxOrder").show()
//     }
// }


// function throttle(method, context) {
//     clearTimeout(method.tid);
//     method.tid = setTimeout(function(){
//         method.call(context);
//     },1500);
// }

var throttle = function(func, delay) {
    var timer = null;
    return function() {
        var context = this;
        var args = arguments;
        if (!timer) {
            func.apply(context,args)
            timer = setTimeout(function() {
                timer = null;
            }, delay);
        }
    }
}

$(".searchText").on('click', throttle(aaa,2000))

function aaa(){
    if(!$('#searchID').val()){
        toast('请输入订单号或优惠券!')
        $('.resultBox').hide()
        $('.nodata').show()
        $(".toSearch").html("输入订单号/优惠券查询结果")
        return;
    }
    query(true)
}

function query(e) {
    if(e) {
        toast({
            msg: '正在为您查询订单...',
            type: 'loading'
        })
    }
    $.ajax({
        type: "post",
        url: urls + "/api/client/order/order_list/order_id?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME,
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: getFormData({
            pay_id: $('#searchID').val(),
            'wx_param[appid]': threeMsg.wx,
            'wx_param[openId]': order_openid,
        }),
        success: function (res) {
            var text = "";
            var automaticPolling = false
            if(res.data.length) {
                $('.resultBox').show()
                for(var i=0; i<res.data.length; i++) {
                    var statusColor = res.data[i].order_status == 60? 'completed' : [res.data[i].order_status == 80? 'processed':'']
                    var operateText = ''
                    var word_num = ''
                    var showWord = ''
                    var hasAIGC = false
                    for(key in typeData){
                        if( res.data[i].goods_name.indexOf('毕业论文')>-1 && typeData[key].name == res.data[i].goods_name){
                            if(typeData[key].increment_goods_infos.zjcaigczz){
                                hasAIGC = true
                            }
                        }
                    }
                    if(res.data[i].place_order_data.word_num){
                        word_num = res.data[i].place_order_data.word_num.value
                    }else{
                        word_num = '--'
                        showWord = 'hide-word'
                    }
                    if(res.data[i].goods_short_name == 'scirs'){
                        res.data[i].place_order_data.title = {
                            label: '',
                            value: '--'
                        }
                    }
                    if(res.data[i].isPartDownload) {
                        operateText =   '<div class="report-operate">' +
                                '            <div data-goodsname="'+res.data[i].goods_name+'" data-id="'+res.data[i].order_sn+'" data-endProduct="'+ res.data[i].end_product +'" class="report-download downloadable DownloadSeparately titles">' +
                                '                <span>下载</span>' +
                                '            </div>'
                        if(res.data[i].end_product) {
                            operateText +=
                                '            <div class="report-order">' +
                                '                <a href="/">再下单</a>' +
                                '            </div>' +
                                '            <div class="report-delete" data-orderid="'+ res.data[i].order_sn +'">' +
                                '               删除' +
                                '            </div>' +
                                '        </div>'
                        }
                    }else if(res.data[i].end_product){
                        if(res.data[i].added_value_goods_names.indexOf('早降重-降AIGC率') == -1 && res.data[i].goods_name.indexOf('毕业论文') !== -1 && hasAIGC && res.data[i].son_order_goods_names.indexOf('zjcaigczz') == -1){
                            operateText =   '        <div class="report-operate">' +
                                '            <div class="report-download downloadable downloadPop" data-goodsname="'+res.data[i].goods_name+'" data-id="'+res.data[i].order_sn+'" data-endProduct="'+ res.data[i].end_product +'">' +
                                '                <span>下载</span>' +
                                '            </div>' +
                                '            <div class="report-order">' +
                                '                <a href="/">再下单</a>' +
                                '            </div>' +
                                '            <div class="report-AIGC" data-orderid="'+res.data[i].order_sn +'" data-name="'+res.data[i].goods_name+'" data-title="'+res.data[i].place_order_data.title.value+'" data-wordnum="'+res.data[i].place_order_data.word_num.value+'">' +
                                '                <span >降AIGC率</span>' +
                                '            </div>' +
                                '            <div class="report-delete" data-orderid="'+ res.data[i].order_sn +'">' +
                                '               删除' +
                                '            </div>' +
                                '        </div>'
                        }else if( ["ktbg" , 'ktbgsenior'].includes(res.data[i].goods_short_name) && res.data[i].son_order_goods_names.indexOf('bylw') == -1){
                            operateText =   '        <div class="report-operate">' +
                                '            <div class="report-download downloadable downloadPop" data-goodsname="'+res.data[i].goods_name+'" data-id="'+res.data[i].order_sn+'" data-endProduct="'+ res.data[i].end_product +'">' +
                                '                <span>下载</span>' +
                                '            </div>' +
                                '            <div class="report-order">' +
                                '                <a href="/">再下单</a>' +
                                '            </div>' +
                                '            <div class="report-generate" data-orderid="'+res.data[i].order_sn +'"  data-title="'+res.data[i].place_order_data.title.value+'" data-time="'+res.data[i].created+'">' +
                                '                <span >生成论文</span>' +
                                '            </div>' +
                                '            <div class="report-delete" data-orderid="'+ res.data[i].order_sn +'">' +
                                '               删除' +
                                '            </div>' +
                                '        </div>'
                        }else{
                            operateText =   '        <div class="report-operate">' +
                                '            <div class="report-download downloadable downloadPop" data-goodsname="'+res.data[i].goods_name+'" data-id="'+res.data[i].order_sn+'" data-endProduct="'+ res.data[i].end_product +'">' +
                                '                <span>下载</span>' +
                                '            </div>' +
                                '            <div class="report-order">' +
                                '                <a href="/">再下单</a>' +
                                '            </div>' +
                                '            <div class="report-delete" data-orderid="'+ res.data[i].order_sn +'">' +
                                '               删除' +
                                '            </div>' +
                                '        </div>'
                        }
                    }else{
                        operateText =   '        <div class="report-operate">' +
                                        '            <div class="report-download unDownloadable">' +
                                        '                <a href="javascript:void(0);">下载</a>' +
                                        '            </div>' +
                                        '        </div>'
                    }
                    text += resultsHtml(res , statusColor , i , showWord , word_num , operateText )

                    if(res.data[i].order_status != 60) {
                        automaticPolling = true
                    }
                }
                if(automaticPolling){
                    setTimer()
                }
                $('.nodata').hide()
                $('.resultBox').children().remove()
                $('.resultBox').append(text)
                localStorage.setItem('orderId', $('#searchID').val())
                $('.deleteS').show()
            }else {
                deleteS(true)
                $('.resultBox').hide()
                $('.nodata').show()
                if(res.code == 400) {
                    toast({msg:res.codeMsg, time:2000});
                    $(".toSearch").html(res.codeMsg)
                }else {
                    toast({msg:"未查询到结果!", time:2000});
                    // $('.deleteS').hide()
                    $(".toSearch").text("非常抱歉，没有找到该订单号。请重新核对是否输入了正确的订单号或者记录已被删除")
                }
            }
        },
        error: function () {
            $('.resultBox').hide()
            $('.nodata').show()
            toast({msg:"请求失败!请检查网络", time:2000 });
            $('.deleteS').hide()
        },
    });
}

$('.deleteS').click(function() {
    deleteS()
    $('.deleteS').hide()
    $('.resultBox').hide()
    $('.nodata').show()
})

function deleteS(clearInput) {
    // 请求没有数据,判断是查询的本地id且查询的id和本地id一致, 就删除本地id(该id未支付)
    if(localStorage.getItem('orderId') == $('#searchID').val()) { // 请求没有数据,判断是查询的本地id且查询的id和本地id一致, 就删除本地id(该id未支付)
        localStorage.removeItem('orderId')
    }
    if(!clearInput){
        $('#searchID').val('')
    }
}

// 有内容展示删除图标, 没有内容隐藏图标, 图标删除会和本地存储对比, 相同删除本地存储和输入框内容, 不相同只删除输入框内容
$("#searchID").on("input", function() {
    if(!$(this).val().length) {
        $('.deleteS').hide()
    }else {
        $('.deleteS').show()
    }
});

// var M = {}
// var isTrue2 = true
// $('.resultBox').on("click",'.causeBtn.again', function() {
//     if(M.dialog4){
//         return M.dialog4.show();
//     }
//     M.dialog4 = jqueryAlert({
//         'title'   : '温馨提示',
//         'content' : '您确定要再次生成结果吗?',
//         'modal'   : true,
//         'animateType' : '',
//         'buttons' :{
//             '确定' : function(){
//                 if(isTrue2) again()
//             },
//             '取消' : function(){
//                 M.dialog4.close();
//             }
//         }
//     })
// })
function again() {
    toast({msg:"正在重新生成...", time:2000});
    isTrue2 = false
    $.ajax({
        type: 'POST',
        url: urls + '/api/pgTask/again',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            payId: payId
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data) {
            if (data.code == 200) {
                // location.reload()
                query(true)
                M.dialog4.close();
            }else if(data.code == 401) {
                toast({msg:data.msg, time:2000});
            } else {
                M.dialog4.close();
                toast({msg:"重新生成失败! 请稍后重试或联系客服", time:2000});
            }
        },
        error: function() {
            M.dialog4.close();
            toast({msg:"请求失败!请检查网络", time:2000});
        },
        complete: function() {
            setTimeout(function() {
                isTrue2 = true
            }, 1000)
        }
    });
}
// $('.resultBox').on("click",'.causeBtn.red', function() {
//     location.href = '/'
// })

var timers = null
function setTimer() {
    clearTimeout(timers);
    $.ajax({
        type: "post",
        url: urls + "/api/client/order/order_list/order_id?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME,
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: getFormData({
            pay_id: $('#searchID').val(),
            'wx_param[appid]': threeMsg.wx,
            'wx_param[openId]': order_openid,
        }),
        success: function (res) {
            if(res.data.length) {
                for(var i=0; i<res.data.length; i++) {
                    var resData = res.data[i]
                    if(resData.order_status != 60) {
                        timers = setTimeout(()=>{
                            setTimer()
                        },60000)
                        return
                    }
                }
            }
            clearTimeout(timers);
            query(false)
        },
        error: function() {
            timers = setTimeout(()=>{
                setTimer()
            },60000)
        }
    });
}

// $(".block_tips").on('click',function (){
//     $(".block_tips").removeClass('active_tips')
//     $(this).addClass('active_tips')
//     var data = $(this).attr('data-ordertips')
//     if(data=='wx'){
//         $(".orderTipImg").hide()
//         $(".WxOrder").show()
//     }else if(data=='ali'){
//         $(".orderTipImg").hide()
//         $(".AliOrder").show()
//     }else if(data=='zh'){
//         $(".orderTipImg").hide()
//         $(".ZhOrder").show()
//     }
// })

$(".fixed-problem").on('click',function (){
    $(".myProblems").show()
    $(".mask").show()
    document.body.style.height = '100vh'
    document.body.style['overflow-y'] = 'hidden'
})
$(".p-item").on('click',function (){
    if($(this).hasClass('activePr')){
        $(".p-item").removeClass('activePr')
        $(".p-a").stop(false,true).slideUp(100)
        return
    }
    $(".p-a").stop(false,true).slideUp(100)
    $(".p-item").removeClass('activePr')
    $(this).addClass('activePr')
    $($(this).find('.p-a')).stop(false,true).slideDown(100)
})

//开题报告生成论文
$(document).on('click', '.report-generate', function (){
    $(".ktbg-title").text($(this).data('title'))
    $(".ktbg-time").text($(this).data('time'))
    $(".ktbg-oid").text($(this).data('orderid'))
    $(".ktbg-generate").show();
    $(".mask").show();
})

$(".close-generate").on('click',function (){
    $(".ktbg-generate").hide();
    $(".mask").hide();
})

$(".generate-now").on('click',function (){
    window.location.href = './index.html?ktbg=' +  $(".ktbg-oid").text() + '&title=' + $(".ktbg-title").text()
})


//AIGC增值服务
let canClick = true
$(document).on('click','.report-AIGC',function (){
    var zjcaigc = ''
    var orderKind = $(this).data('name')
    var title = $(this).data('title')
    for(key in typeData){
        if(typeData[key].name == $(this).data('name')){
            zjcaigc =  typeData[key].increment_goods_infos.zjcaigczz.goods_id
            $(".unit-price").text(typeData[key].increment_goods_infos.zjcaigczz.selling_price + '元/' + typeData[key].increment_goods_infos.zjcaigczz.unit_count + '字')
        }
    }
    var form_data = {
        goods_id: zjcaigc,
        order_sn: $(this).data('orderid'),
        source: /MicroMessenger/.test(window.navigator.userAgent)? 2:7,
        domain_record: window.location.origin,
        frontNotifyUrl: window.location.origin+ window.location.pathname + '?oid=#outTradeNo#',
    }
    if(!canClick){
        return
    }
    toast({
        msg: '正在提交,请稍后...',
        type: 'loading',
        time: 20000
    })
    canClick = false
    $.ajax({
        type: 'post',
        url: urls + '/api/client/order/unified/create?user_token='+USER_TOKEN+'&jane_name='+JANE_NAME+(suffix?'&'+suffix:'') + (suffix2?'&'+suffix2:''),
        data: getFormData(form_data),
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            toastNone()
            if (data.code == 200) {
                canClick = true
                var wordNum = data.data.word_num
                if (/MicroMessenger/.test(window.navigator.userAgent) && payWay_Info.wx && payWay_Info.wx_jsapi) {  // 微信浏览器
                    let pathName = window.location.pathname
                    if(window.location.pathname.indexOf('query.html')!==-1){
                        pathName = pathName.replace('query.html','pay.html')
                    }else{
                        pathName = pathName + 'pay.html'
                    }
                    location.href = 'https://api.taoxiangyoushu.com/weixin/getOpenId?appid=' + payWay_Info.wx_jsapi + '&otherUrl=' + encodeURIComponent(window.location.origin + pathName +'?commitId=' + data.data.order_sn +'&lw_type='+title + '&paper_type=' + '&NumberWords=' + wordNum  + '&speciality=' + '&order_amount=' + data.data.order_amount + '&dateTime=' + data.data.created + '&contentType=' + form_data.goods_id+ '&goods=&payId=' + '&pay_wap_url=' + data.data.pay_wap_url + '&orderType=AIGC' + '&orderKind=' + orderKind)
                    return
                }
                location.href = './pay.html?commitId=' + data.data.order_sn +'&lw_type='+ title + '&paper_type=' + '&NumberWords=' + wordNum + '&order_amount=' + data.data.order_amount + '&dateTime=' + data.data.created + '&payId=' + '&pay_wap_url=' + data.data.pay_wap_url + '&orderType=AIGC' + '&orderKind=' + orderKind + '&contentType=' + form_data.goods_id
            } else {
                canClick = true
                toast(data.codeMsg)
            }
        },
        error: function(err) {
            toastNone()
            canClick = true
            // error_dl(err)
        }
    });
})

$(document).on('click','.report-delete',function (){
    $(".mask").show();
    $(".delete_pop").show()
    $(".delete_pop").attr('data-orderid',$(this).attr('data-orderid'))
})

$(".mask").on('click',function (){
    $(".mask").hide();
    $(".delete_pop").hide();
    $(".down_pop").hide()
})

$(".cancel_btn").on('click',function (){
    $(".mask").hide();
    $(".delete_pop").hide();
})

$(".close_downPop").on('click',function (){
    $(".mask").hide();
    $(".down_pop").hide();
})

$(".determine_btn").on('click',function (){
    $(".mask").hide();
    $(".delete_pop").hide();
    toast({
        msg: '删除中,请稍后...',
        type: 'loading',
        time: 20000
    })
    $.ajax({
        type: 'get',
        url: urls + '/api/client/order/del?user_token='+ USER_TOKEN +'&orderSn='+ $(".delete_pop").attr('data-orderid') +'&jane_name=' + JANE_NAME,
        success: function (res) {
            if (res.code == 200) {
                toastNone()
                $('#searchID').val( $(".delete_pop").attr('data-orderid') )
                query(false)
            }else {
                toast(data.codeMsg)
            }
        },
        error: function () {
            toast("请求失败!请检查网络")
        },
    });
})

$(document).on('click','.resultItem .downloadPop',function (){
    $(".down_pop .imgBlock p").text($(this).attr('data-goodsname'))
    $(".down_pop .copyBtn").attr('data-oid',$(this).attr('data-id'))
    $(".down_pop .downBtn a").attr('href', $(this).attr('data-endProduct'))
    $(".down_pop").show()
    $(".mask").show()
})

$(".copyBtn").on('click',function (){
    var text = window.location.href
    if(text.indexOf('?') != -1) {
        if(getQueryVariable('oid')){
            if( getQueryVariable('oid') != $(this).attr('data-oid')){
                text = text.replace(getQueryVariable('oid') , $(this).attr('data-oid') )
            }
        }else{
            text += ('&oid=' + $(this).attr('data-oid'))
        }
    }else{
        text +=  ('?oid=' + $(this).attr('data-oid'))
    }
    $("#copyInput").val(text)
    $("#copyInput").select()
    try {
        var state = document.execCommand("copy");
    } catch (err) {
        var state = false;
    }
    if (state) {
        $(".mask").hide();
        $(".down_pop").hide()
        toast('复制成功')
    } else {
        $(".mask").hide();
        $(".down_pop").hide()
        toast({
            msg: "复制失败,请手动复制",
            type: 'error',
            time: 2000
        })
    }
})

$(document).on('click','.SingleDownload .pop_bottom .copyBtn',function (){
    var text = window.location.href
    if(text.indexOf('?') != -1) {
        if(getQueryVariable('oid')){
            if( getQueryVariable('oid') != $(this).attr('data-oid')){
                text = text.replace(getQueryVariable('oid') , $(this).attr('data-oid') )
            }
        }else{
            text += ('&oid=' + $(this).attr('data-oid'))
        }
    }else{
        text +=  ('?oid=' + $(this).attr('data-oid'))
    }
    $("#copyInput").val(text)
    $("#copyInput").select()
    try {
        var state = document.execCommand("copy");
    } catch (err) {
        var state = false;
    }
    if (state) {
        $(".mask").hide();
        $(".SingleDownload").hide()
        toast('复制成功')
    } else {
        $(".mask").hide();
        $(".SingleDownload").hide()
        toast({
            msg: "复制失败,请手动复制",
            type: 'error',
            time: 2000
        })
    }
})