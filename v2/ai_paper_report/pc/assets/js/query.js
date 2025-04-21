var qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 135,
    height: 135,
});

var source = ''
// 先判断是不是微信端打开的
let client_type = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if(client_type){
    source = 7
    if (/(micromessenger)/i.test(navigator.userAgent)) {
        source = 2
    }
}else{
    source = 1
}

function startQuerying(){
    if(getQueryVariable('oid')) {
        $('.orderId').val(getQueryVariable('oid'))
        query(false)
    }else if(localStorage.getItem('oid') && !memberFu.isLogin) {
        $('.orderId').val(localStorage.getItem('oid'))
        query(false)
    }else if(!memberFu.isLogin){
        $('.resultBox').addClass('initTipsShow')
    }
}

var isTrue;
$('.searchBtn').click(function() {
    if(isTrue) return
    isTrue = true
    setTimeout(() => {
        isTrue = false
    },3000)
    if(!$('.orderId').val() && !memberFu.isLogin) {
        cocoMessage.destroyAll();
        cocoMessage.error("请输入订单号或优惠券后查询!", 2000);
        $(".guide").html("输入订单号/优惠券查询结果")
        $('.tbody').hide()
        $('.noData').show()
        $('.resultBox').addClass('initTipsShow')
    }else {
        query(true)
    }
})

// function showOrder(payWay) {
//     if(payWay.default == 'scanCodeRich'){
//         $(".integrationorder ").show();
//         $(".wxorder").hide();
//         $(".aliorder").hide();
//     }else{
//         $(".integrationorder ").hide();
//         $(".wxorder").show();
//         $(".aliorder").show();
//     }
// }
function query(e) {
    $('.resultBox').removeClass('initTipsShow')
    $('.searchBtn').addClass('valuable')

    cocoMessage.destroyAll();
    if(e) cocoMessage.success('正在为您查询...')
    $('.loadLine').show()
    $('.noData').hide()
    $('.tbody').children().remove()
    var pay_Id = ''
    if(memberFu.isLogin && !$('.orderId').val()) {
        pay_Id = 'all_project_order'
    }else {
        pay_Id = $('.orderId').val()
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
            pay_id: pay_Id,
            user_token: USER_TOKEN,
            jane_name: JANE_NAME,
        }),
        success: function (res) {
            $('.tbody').show()
            $('.tbody').children().remove()
            var text = "";
            var automaticPolling = false;
            
            if(res.data.length && res.data[0].jane_name==JANE_NAME) {
                for(var i=0; i<res.data.length; i++) {
                    var payId = res.data[i].order_sn
                    var resData = res.data[i]
                    var btnNum = 2
                    var btnNC = ''
                    var hasAIGC = false
                    var hasDbppt = false
                    for(key in typeData){
                        if( res.data[i].goods_name.indexOf('毕业论文')>-1 && typeData[key].name == res.data[i].goods_name){
                            if(typeData[key].increment_goods_infos.zjcaigczz){
                                hasAIGC = true
                            }
                            if(typeData[key].increment_goods_infos.dbppt){
                                hasDbppt = true
                            }
                        }
                    }
                    if(resData.end_product && resData.added_value_goods_names.indexOf('早降重-降AIGC率') == -1 && resData.goods_name.indexOf("毕业论文") !== -1 && hasAIGC && resData.son_order_goods_names.indexOf('zjcaigczz') == -1){
                        btnNum = btnNum +1
                    }
                    if(resData.end_product && resData.added_value_goods_names.indexOf('答辩PPT') == -1 && resData.goods_name.indexOf("毕业论文") !== -1 && hasDbppt && resData.son_order_goods_names.indexOf('dbppt') == -1){
                        btnNum = btnNum +1
                    }
                    btnNC = 'btnN' + btnNum
                    text += "<tr>";
                    text += "<th class=\"first\">"+ resData.order_sn +"</th>";
                    text += "<th class=\"titles\" title=\""+ resData.place_order_data.title.value +"\">"+ resData.place_order_data.title.value +"</th>";
                    text += "<th class=\"titles\" title=\""+ resData.goods_name +"\">"+ resData.goods_name +"</th>";
                    var status = resData.order_status_human
                    var styleClass = resData.order_status==60? 'complete':'not'
                    text += "<th>"+ resData.created +"</th>";
                    text += "<th class=\"titles statusT "+styleClass+"\"><span>"+ status +"</span></th>";
                    text += "<th class=\"download\">";
                    if(!resData.isBind && threeMsg.wx && !resData.end_product){
                        text += '<div class="scanFollow">\n' +
                            '    <div class="codeBox">\n' +
                            '        <img class="codeImg'+ i +'" src="../pc/assets/img/loading2.gif" alt="">\n' +
                            '    </div>\n' +
                            '    <div class="tipsText">\n' +
                            '        <p class="p-1">扫码关注</p>\n' +
                            '        <p class="p-1 noMarginTop">实时了解订单进度</p>\n' +
                            '        <p class="p-2">如果您未绑定</p>\n' +
                            '        <p class="p-2 noMarginTop">请一定保存订单号</p>\n' +
                            '    </div>\n' +
                            '</div>'
                    }else{
                        if(resData.order_status != '97') {
                            if(res.data[i].isPartDownload) {
                                text += "<div class='DownloadSeparately "+ btnNC +"' data-id=\""+resData.order_sn+"\"><span>下载</span></div>";
                            }else if(resData.end_product) {
                                var download_dom = "<div class='Download_Results'><a class='complete "+ btnNC +"' href=\""+resData.end_product+"\" target=\"_blank\"><span class=\"allowText\">下载结果</span></a> </div>";
                                if (window.hasOwnProperty('download_post_handle')){
                                    download_dom = window.download_post_handle(download_dom)
                                }
                                text += download_dom
                            }else {
                                if(['zjcaigc','xzaigccheck'].includes(res.data[i].goods_short_name)){
                                    text += "<span>--</span>"
                                }else{
                                    text += "<div class=\"nots\"><span>生成中</span></div> ";
                                }
                            }
                        }
                        var is_supper_added_goods=true
                        var more=''
                        if(is_supper_added_goods){
                            if(resData.end_product && resData.added_value_goods_names.indexOf('早降重-降AIGC率') == -1 && resData.goods_name.indexOf("毕业论文") !== -1 && hasAIGC && resData.son_order_goods_names.indexOf('zjcaigczz') == -1){
                                text += "<div class='aigc-btn purchasing "+ btnNC +"' data-goodsname='zjcaigczz' data-orderid="+res.data[i].order_sn+" data-name="+res.data[i].goods_name+" data-wordNum="+res.data[i].place_order_data.word_num.value+"><span>降AIGC率</span>" +
                                    "   <div class='aigc-introduce'>" +
                                    "       <p>AIGC疑似率是有效识别文本是否部分或全部由AI模型生成，结果与论文质量无关、仅表示论文中内容片段存在Al生成可能性的概率。</p>" +
                                    "       <p class='p2'>根据《中华人民共和国学位法(草案)》第六章第三十三条之规定，已经获得学位者，在获得该学位过程中如有人工智能写作等学术不端行为，经学位评定委员会审议决定，可由学位授予单位撤销学位证书。</p>" +
                                    "   </div> " +
                                    "</div> ";
                                more += "<div class='purchasing "+ btnNC +"' data-goodsname='zjcaigczz' data-orderid="+res.data[i].order_sn+" data-name="+res.data[i].goods_name+" data-wordNum="+res.data[i].place_order_data.word_num.value+"><span>降AIGC率</span></div>"
                            }
                            if(resData.end_product && resData.added_value_goods_names.indexOf('答辩PPT') == -1 && resData.goods_name.indexOf("毕业论文") !== -1 && hasDbppt && resData.son_order_goods_names.indexOf('dbppt') == -1){
                                text += "<div class='dbppt-btn purchasing "+ btnNC +"' data-goodsname='dbppt' data-orderid="+res.data[i].order_sn+" data-name="+res.data[i].goods_name+" data-wordNum="+res.data[i].place_order_data.word_num.value+"><span>生成PPT</span></div> ";  
                                more += "<div class='purchasing "+ btnNC +"' data-goodsname='dbppt' data-orderid="+res.data[i].order_sn+" data-name="+res.data[i].goods_name+" data-wordNum="+res.data[i].place_order_data.word_num.value+"><span>生成PPT</span></div> ";  
                            }
                            if(resData.end_product && ["ktbg" , 'ktbgsenior'].includes(resData.goods_short_name) && resData.son_order_goods_names.indexOf('bylw') == -1){
                                text += "<div class='generate-btn Paper_Box ' data-orderid='"+res.data[i].order_sn+"'  data-title='"+ res.data[i].place_order_data.title.value +"' data-time='"+ res.data[i].created +"'><span>生成论文</span>" + "</div> ";
                                more += "<div class='Paper_Box ' data-orderid='"+res.data[i].order_sn+"'  data-title='"+ res.data[i].place_order_data.title.value +"' data-time='"+ res.data[i].created +"'><span>生成论文</span>" + "</div> ";
                            }
                        }
                        if(resData.end_product) {
                            text += "<div class='delete-btn delete_method "+ btnNC +"' data-orderid='"+ res.data[i].order_sn +"'><span>删除订单</span></div> ";
                            more += "<div class='delete_method ' data-orderid='"+ res.data[i].order_sn +"'><span>删除订单</span></div> ";
                        }
                        text += "<div class='Operate_more'><span>更多</span>"+
                                "<div class='Suspended_more'></div>"+
                                "</div> "
                    }
                    text += "</th>";
                    text += "</tr>";
                    if(resData.order_status != 60) {
                        automaticPolling = true
                       if(threeMsg.wx && !resData.isBind){
                           getWxCode(resData.order_sn, 'codeImg'+i)
                       }
                    }
                }
                if(automaticPolling){
                    setTimer(pay_Id)
                }
                $('.tbody').append(text)
                $('.Suspended_more').append(more)
                if(!memberFu.isLogin) {
                    localStorage.setItem('oid',$('.orderId').val());
                }
                $('.deleteS').show()
                var childCount = $('.download div').filter(function() {
                    return $(this).is(':visible');
                }).length;
                var windowWidth=''
                var initialWidth = $(window).width();
                var all = {
                    v2: '1440',
                    v1: '1810',
                }
                var Except_for={
                    v2: '3',
                    v1: '2',
                }
                if(initialWidth<all[$('#App').data('v')]&&childCount>Except_for[$('#App').data('v')]){
                    $('.Operate_more').css('display','inline-block')
                    $('.aigc-btn,.dbppt-btn,.generate-btn,.delete-btn').hide()
                }
                $(window).resize(function() {
                    windowWidth = $(window).width();
                    if(windowWidth<all[$('#App').data('v')]&&childCount>Except_for[$('#App').data('v')]){
                        $('.Operate_more').css('display','inline-block')
                        $('.aigc-btn,.dbppt-btn,.generate-btn,.delete-btn').hide()
                    }
                    else{
                        $('.Operate_more').css('display','none')
                        $('.aigc-btn,.dbppt-btn,.generate-btn,.delete-btn').show()
                    }
                });
                var More_Display=true
                $('.Operate_more').on('click',function(){
                    More_Display=!More_Display
                    if(More_Display){
                        $('.Suspended_more').hide()
                    }
                    else{
                        $('.Suspended_more').show()
                    }
                })
            }else {
                deleteS(true)
                $('.tbody').hide()
                $('.noData').show()
                cocoMessage.destroyAll();
                if(res.code == 400) {
                    cocoMessage.error(res.codeMsg, 2000);
                    $(".guide").html(res.codeMsg)
                }else if(e && $('.orderId').val()) {
                    cocoMessage.error("未查询到结果!", 2000);
                    $(".guide").html("非常抱歉，没有找到该订单号。<\/br>请重新核对是否输入了正确的订单号或者记录已被删除")
                }else {
                    $(".guide").html("非常抱歉，没有找到订单记录")
                }
                clearTimeout(timers);
                $('.resultBox').addClass('initTipsShow')
                // $('.deleteS').hide()
            }
            $('.loadLine').hide()
        },
        error: function () {
            $('.tbody').hide()
            $('.noData').show()
            cocoMessage.destroyAll();
            cocoMessage.error("请求失败!请检查网络", 2000);
            $('.deleteS').hide()
            $('.loadLine').hide()
            clearTimeout(timers);
            $('.resultBox').addClass('initTipsShow')
        },
    });
}

$('.deleteS').click(function() {
    deleteS()
    $('.deleteS').hide()
    $('.tbody').hide()
    $('.noData').show()
    $('.resultBox').addClass('initTipsShow')
})
function deleteS(clearInput) {
    // 请求没有数据,判断是查询的本地id且查询的id和本地id一致, 就删除本地id(该id未支付)
    if(localStorage.getItem('oid') == $('.orderId').val()) {
        localStorage.removeItem('oid')
    }
    if(!clearInput){
        $('.orderId').val('')
    }
}
// 有内容展示删除图标, 没有内容隐藏图标, 图标删除会和本地存储对比, 相同删除本地存储和输入框内容, 不相同只删除输入框内容
$(".orderId").on("input", function() {
    if(!$(this).val().length) {
        $('.deleteS').hide()
    }else {
        $('.deleteS').show()
    }
});
$('.tbody').on("click", "a.complete", function(){cocoMessage.success('正在下载...')});

var timers = null
function setTimer(pay_Id) {
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
            pay_id: pay_Id,
            user_token: USER_TOKEN,
            jane_name: JANE_NAME
        }),
        success: function (res) {
            if(res.data.length && res.data[0].jane_name==JANE_NAME) {
                for(var i=0; i<res.data.length; i++) {
                    var resData = res.data[i]
                    if(resData.order_status != 60) {
                        timers = setTimeout(()=>{
                            setTimer(pay_Id)
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
                setTimer(pay_Id)
            },60000)
        }
    });
}

var WxTime = 300;
var WxTimeOut = null;
function getWxCode(order_id, element){
    $.ajax({
        type: 'GET',
        url: urls + '/weixin/qr/bind_order?order_id=' + order_id,
        success: function (res){
           if(res.code == 200){
               $('.'+element).attr('src', res.data)
               $('.'+element).css('width', '100%')
               WxTime = 300
               WxPolling(order_id)
           }
        },
        error: function (err){
        }
    })
}

function WxPolling(order_id){
    $.ajax({
        type: 'GET',
        url: urls + '/weixin/qr/regist/query?bindOid=' + order_id,
        success: function (res){
            if(res.code == 200){
                if(!res.data.isbind){
                    clearTimeout(WxTimeOut)
                    WxTimeOut = setTimeout(function (){
                        if(WxTime > 0){
                            WxTime--
                            WxPolling(order_id)
                        }
                    },1000)
                }else{
                    query(false)
                }
            }
        },
        error: function (err){

        }
    })
}

if(getQueryVariable('qhclickid')) {
    window.localStorage.setItem('qhclickid',getQueryVariable('qhclickid'))
}
if(getQueryVariable('bd_vid')) {
    window.localStorage.setItem('bd_vid',window.location.href)
}

$('.Breadcrumb').click(function() {
    location.href = '/'
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

$(".complainForm .complaint-oid").mouseenter(function (){
    $(".complaint-orderId").show();
})
$(".complainForm .complaint-oid").mouseleave(function (){
    $(".complaint-orderId").hide();
})

//开题报告生成论文
$(document).on('click','.Paper_Box',function (){
    // window.location.href = './index.html?ktbg=' + $(this).data('orderid') + '&title=' + $(this).data('title')
    $(".ktbg-generate").show();
    $(".mask_body").show();
    $(".ktbg-title").text($(this).data('title'))
    $(".ktbg-time").text($(this).data('time'))
    $(".ktbg-oid").text($(this).data('orderid'))
})

$(".close-generate").on('click',function (){
    $(".ktbg-generate").hide()
    $(".mask_body").hide();
})

$(".generate-now").on('click',function (){
    window.location.href = './index.html?ktbg=' + $(".ktbg-oid").text() + '&title=' + $(".ktbg-title").text()
})

// AIGC增值服务
var isVerify = false
var pay_orderid= ''
var contentTypeIs = true
var time = 600
var Timeout = ''
var payType = ''
var payUrl = ''
var pay_id = ''
var isClose = false
var searchOid = ''

$(document).on('click','.purchasing',function (){
    $(".mask_body").show();
    $(".aigc-payBox").show();
    $('.Suspended_more').hide()
    // $(".wordNumber").text($(this).data('wordnum') + '字')
    $('.load').show()
    $(".mask").hide();
    isClose = false
    if(payWayInfo.alipay) $('#alipay').show()
    if(payWayInfo.wx) $('#wx').show()
    if(payWayInfo.scanCodeRich) $('#scanCodeRich').show();
    $('#' + payWayInfo.default).addClass('select')
    if($("#scanCodeRich").hasClass('select')){
        $(".tips1").show()
        if(scanCodeRichInfo.scanCodeRichAlipay.enabled) {
            $(".AliPay-icon").show();
        }
        if(scanCodeRichInfo.scanCodeRichWx.enabled) {
            $(".wxPay-icon").show();
        }
    }else{
        $(".tips1").hide()
    }
    var payTypeNum = 0;
    for(var i=0; i<$('.payType div').length;i++){
        if($($('.payType div')[i]).is(':visible')){
          payTypeNum ++
        }
    }
    if(payTypeNum <= 1){
        $(".payType").hide()
        $(".aigc-payBox").css({width:'812px',marginLeft: '-406px'})
        $(".payAIGC-right").css({ width:'550px', })
        if($("#alipay").hasClass('select')){
            $(".AliPay-icon").show()
        }
        if($("#wx").hasClass('select')){
            $(".wxPay-icon").show()
        }
    }
    var addGoods = ''
    for(key in typeData){
        if(typeData[key].name == $(this).data('name')){
            if($(this).attr('data-goodsname') == 'zjcaigczz') {
                $(".aigc-payBox").removeClass('purchasingPPT')
                addGoods = typeData[key].increment_goods_infos.zjcaigczz.goods_id
                $(".unit-price").text(typeData[key].increment_goods_infos.zjcaigczz.selling_price + '元/' + typeData[key].increment_goods_infos.zjcaigczz.unit_count + typeData[key].increment_goods_infos.zjcaigczz.unit_type)
            }
            if($(this).attr('data-goodsname') == 'dbppt') {
                $(".aigc-payBox").addClass('purchasingPPT')
                addGoods = typeData[key].increment_goods_infos.dbppt.goods_id
                $(".unit-price").text(typeData[key].increment_goods_infos.dbppt.selling_price + '元/' + typeData[key].increment_goods_infos.dbppt.unit_count + typeData[key].increment_goods_infos.dbppt.unit_type)
            }
        }
    }
    var form_data = {
        goods_id: addGoods,
        order_sn: $(this).data('orderid'),
        source: source,
        domain_record: window.location.origin,
    }
    createOrder(getFormData(form_data))
})

// 支付方式切换
$('.buy-content .payType>div').click(function () {
    if(payType) {
        if(!contentTypeIs) return
        if($(this).attr('data-type') != payType) {
            closeMsg = cocoMessage.loading('正在切换支付方式...');
            time = 0;
            $(".pay-time").text('--')
            clearTimeout(timeout2)
            contentTypeIs = false
            $('.buy-content .payType>div').removeClass('select')
            $(this).addClass('select')
            payType = $(this).attr('data-type')
            if( $(this).attr('data-type')== 'scanCodeRich'){
                $(".tips1").show()
            }else{
                $(".tips1").hide()
            }
            $(".mask").hide();
            $('.load').show();
            if($("#scanCodeRich").hasClass('select')){
                $(".AliPay-icon").show();
                $(".wxPay-icon").show();
            }
            payOrder()
        }
    }
})

//关闭支付弹窗
$(".close-aigc").on('click',function (){
    $(".mask_body").hide();
    $(".aigc-payBox").hide();
    clearTimeout(Timeout);
    clearTimeout(timeout2)
    $('.buy-content .payType>div').removeClass('select')
    $(".price-T").text('--')
    $(".oid-T").text('获取中')
    $("#coupon").val('')
    $("#coupon").trigger('change')
    isClose = true
    searchOid = pay_orderid
    pay_orderid = ''
})

function createOrder(form_data) {
    $.ajax({
        type: 'post',
        url: urls + '/api/client/order/unified/create?user_token='+ USER_TOKEN + '&jane_name='+ JANE_NAME+(suffix?'&'+suffix:'') + (suffix2?'&'+suffix2:''),
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: form_data,
        success: function(data) {
            if (data.code == 200) {
                $(".oid-T").text(data.data.order_sn)
                $(".price-T").text(data.data.order_amount)
                $(".wordNumber").text(data.data.word_num + '字')
                pay_orderid = data.data.order_sn
                if(payWayInfo.default == 'alipay'){
                    payType = 'alipayScan'
                }
                if(payWayInfo.default == 'wx'){
                    payType = 'wxScan'
                }
                if(payWayInfo.default == 'scanCodeRich'){
                    payType = 'scanCodeRich'
                }
                if(payWayInfo.default == 'kLenovoAiMiniPay'){
                    payType = 'kLenovoAiMiniPay'
                }
                payUrl = data.data.pay_wap_url
                payOrder()
            } else {
                cocoMessage.error(data.codeMsg, 2000);
                $(".mask").show()
                $('.load').hide()
            }
        },
        error: function(err) {

            cocoMessage.error("请求失败!请检查网络", 2000);
        }
    });
}

function payOrder(price) {
    if(payType == 'scanCodeRich') {
        $(".code").show()
        qrcode.makeCode(payUrl + '/pay/waporder/' + pay_orderid + '?source=' + source);
        $('.load').hide()
        $('.mask').hide()
        time = 600
        $('.pay-time').text(time)
        contentTypeIs = true
        if(price){
            $(".price-T").text(price)
        }
        cocoMessage.destroyAll();
        payStatus()
        countdown()
    }else {
        var formData = {
            order_sn: pay_orderid,
            pay_type: payType,
            source: source
        }
        $.ajax({
            type: 'post',
            url: urls + '/api/client/pay/payOrder',
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            data: getFormData(formData),
            success: function(data) {
                cocoMessage.destroyAll();
                if(data.code == 200) {
                    qrcode.makeCode(data.data.qrlink);
                    $('.price-T').text(data.data.payment_money || '0.00')
                    $('.load').hide()
                    $(".mask").hide()
                    time = 600
                    $('.pay-time').text(time)
                    pay_id = data.data.pay_id
                    payStatus()
                    countdown()
                }else if(data.code == 3001) {
                    cocoMessage.success('订单已支付', 2000)
                    $(".close-aigc").click();
                    $(".orderId").val(searchOid)
                    $(".searchBtn").click()
                }else if(data.code == -1 && data.codeMsg == '不支持的该支付方式'){
                    cocoMessage.error(data.codeMsg, 2000);
                }else {
                    cocoMessage.error(data.codeMsg, 2000);
                    $(".mask").show()
                    $('.load').hide()
                }
                contentTypeIs = true
            },
            error: function(err) {
                cocoMessage.destroyAll();
                cocoMessage.error("请求失败!请检查网络", 2000);
                contentTypeIs = true
            }
        });
    }
}

function payStatus() { // 轮询
    if(isClose){
        return
    }
    clearTimeout(Timeout);
    $.ajax({
        type: 'get',
        url: urls + '/apirs/order/is_pay?pay_id=' + pay_orderid,
        xhrFields: {
            withCredentials: true
        },
        success: function (res) {
            clearTimeout(Timeout);
            if (time <= 0) {
                $(".mask").show();
            }
            if (!res.data) {
                if (time > 0) {
                    Timeout = setTimeout(function () {
                        payStatus();
                    }, 1000);
                }
            }else {
                clearTimeout(Timeout);
                $(".close-aigc").click();
                $(".orderId").val(searchOid)
                $(".searchBtn").click()
            }
        },
        error: function () {
            cocoMessage.error("请求失败!请检查网络", 2000);
        },
    });
}

var timeout2 = null
function countdown(){
    clearTimeout(timeout2)
    timeout2 = setTimeout(function (){
        time --
        $('.pay-time').text(time>0? time : 0)
        if(time > 0){
            countdown()
        }
    },1000)
}

$('.mask').click(function() { // 点击刷新
    $(".mask").hide();
    $('.load').show();
    payOrder()
})

// 验证支付
$('.next-verify').click(function() {
    if(isVerify) return
    isVerify = true
    setTimeout(() => {
        isVerify = false
    },3000)
    var form_data = getFormData({
        pay_id: pay_orderid
    })
    $.ajax({
        type: 'post',
        url: urls + '/api/client/pay/verifyOrder',
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: form_data,
        success: function (res) {
            if (res.code == 3001) {
                cocoMessage.destroyAll();
                cocoMessage.success('订单已支付', 2000)
                $(".close-aigc").click();
                $(".orderId").val(searchOid)
                $(".searchBtn").click()
            }else {
                cocoMessage.destroyAll();
                cocoMessage.error("您的订单未支付", 2000);
            }
        },
        error: function () {
            cocoMessage.error("请求失败!请检查网络", 2000);
        },
    });
})

$(".copy-text").on('click',function (){
    var text = $(".oid-T").text()
    $("#copyInput").val(text)
    $("#copyInput").select()
    try {
        var state = document.execCommand("copy");
    } catch (err) {
        var state = false;
    }
    if (state) {
        cocoMessage.success(1000, "复制成功", function() {
        });
    } else {
        cocoMessage.error(1000, "复制失败", function() {
        });
    }
})

// 优惠券支付
$("#coupon").on('input',function (){
    if($(this).val().length > 0){
        $(".use_now").addClass('can')
    }else{
        $(".use_now").removeClass('can')
    }
})

$("#coupon").on('change',function (){
    $(".errorTip").hide();
    $(".confirmCoupon").hide()
})

let canClick = true;

$(".use_now").on('click',function() {
    if(!canClick){
        return
    }
    canClick = false
    closeMsg = cocoMessage.loading('正在兑换优惠券...');

    var formData = getFormData({
        order_sn: pay_orderid,
        code: $("#coupon").val()
    })

    $.ajax({
        type: 'post',
        url: urls + '/api/client/order/variation/order',
        data: formData,
        contentType: false,
        processData: false,
        xhrFields: {
            withCredentials: true
        },
        success: function (res) {
            canClick = true
            closeMsg()
            if (res.code == 200) {
                pay_orderid = res.data.order_sn
                $('.oid-T').text(res.data.order_sn)
                $(".price-T").text(res.data.order_amount)
                if(Number(res.data.order_amount) == 0) {
                   $(".confirmCoupon").show()
                }else{
                    $(".confirmCoupon").hide()
                    payOrder(res.data.order_amount)
                }
            }else {
                // cocoMessage.error(res.codeMsg, 2000);
                $(".errorTip span").text(res.codeMsg)
                $(".errorTip").show();
                $(".confirmCoupon").hide()
                closeMsg()
            }
        },
        error: function () {
            cocoMessage.error("请求失败!请检查网络", 2000);
            contentTypeIs = true
            closeMsg()
            canClick = true
        },
    });

})

$(".couponPay").on('click',couponsPay)
function couponsPay() {
    var formData2 = getFormData({
        order_sn: pay_orderid,
        pay_type: 'coupons',
        source: source
    })
    $.ajax({
        type: 'post',
        url: urls + '/api/client/pay/payOrder',
        data: formData2,
        contentType: false,
        processData: false,
        xhrFields: {
            withCredentials: true
        },
        success: function (res) {
            if (res.code == 200) {

            }else if(res.code == 3001) {
                cocoMessage.success('订单已支付', 2000)
                $(".close-aigc").click();
                $(".orderId").val(searchOid)
                $(".searchBtn").click()
            }else {
                cocoMessage.error(res.codeMsg, 2000);
                closeMsg()
            }
        },
        error: function () {
            cocoMessage.error("请求失败!请检查网络", 2000);
            contentTypeIs = true
            closeMsg()
        },
    });
}

$(document).on('click','.delete_method',function (){
    $(".mask_body").show();
    $(".delete-pop").show()
    $('.Suspended_more').hide()
    $(".delete-pop").attr('data-orderid',$(this).attr('data-orderid'))
})

$(".cancel_btn").on('click', function (){
    $(".mask_body").hide();
    $(".delete-pop").hide()
})

$(".close_pop").on('click', function (){
    $(".mask_body").hide();
    $(".delete-pop").hide()
    $(".SingleDownload").hide()
    clearTimeout(order_resultTimeout);
})

$(".determine_btn").click(function (){
    closeMsg = cocoMessage.loading('正在删除...');
    $.ajax({
        type: 'get',
        url: urls + '/api/client/order/del?user_token='+ USER_TOKEN +'&orderSn='+ $(".delete-pop").attr('data-orderid') +'&jane_name=' + JANE_NAME,
        success: function (res) {
            if (res.code == 200) {
                $(".mask_body").hide();
                $(".delete-pop").hide()
                $('.orderId').val( $(".delete-pop").attr('data-orderid') )
                query(false)
            }else {
                cocoMessage.error(res.codeMsg, 2000);
                closeMsg()
            }
        },
        error: function () {
            cocoMessage.error("请求失败!请检查网络", 2000);
            closeMsg()
        },
    });
})


