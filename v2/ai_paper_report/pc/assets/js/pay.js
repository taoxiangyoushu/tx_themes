
var orderInfoData = {}
var qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 135,
    height: 135,
});
var time = 600
var Timeout = ''
var pay_id = ''
var isTrue = false
var pay_type = ''
var pay_way_index = ''
var contentTypeIs = true
var order_sn = getQueryVariable('order_sn') || getQueryVariable('commitId')
var closeMsg = cocoMessage.loading('正在获取价格...')
var order_amount = '';
var noPayWay = false;
var typeAll = {
    wx: "wxScan",
    alipay: "alipayScan",
    scanCodeRich: "scanCodeRich",
    taobao: "taobao",
    redBook: 'redBook',
    kLenovoAiMiniPay: 'kLenovoAiMiniPay'
}
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

// url不携带订单号, 返回提交页
if(!order_sn) location.href='./index.html'

// 支付
function payOrder(payType,price) {
    $('.load').show()
    $(".mask").hide();
    if(pay_type == 'taobao' || pay_type == 'redBook') {
        $('.load').hide()
        closeMsg()
        $('#orderIdText').text(order_sn)
        pay_id = order_sn
        contentTypeIs = true
        return;
    }
    if(pay_type == 'scanCodeRich') {
        if(orderInfoData.pay_wap_url) {
            $(".code").show()
            $(".orderAmount").text(price)
            qrcode.makeCode(orderInfoData.pay_wap_url + '/pay/waporder/' + order_sn + '?source=' + source);
            $('.load').hide()
            time = 600
            $('.payTime').text(time)
            closeMsg()
            $('#orderIdText').text(order_sn)
            pay_id = order_sn
            contentTypeIs = true
            payStatus()
            countdown()
        }else {
            // 避免订单信息接口太慢, 导致pay_wap_url拿不到
            setTimeout(function() {
                payOrder(payType,price)
            }, 1000)
        }
    }else {
        var formData = getFormData({
            order_sn: order_sn,
            pay_type,
            source
        })
        $.ajax({
            type: 'post',
            url: urls + '/api/client/pay/payOrder',
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            data: formData,
            success: function(data) {
                if(data.code == 200) {
                    $('#orderIdText').text(data.data.pay_id)
                    $('#dateTime').text(data.data.place_order_time)
                    qrcode.makeCode(data.data.qrlink);
                    $('.orderAmount').text(data.data.payment_money || '0.00')
                    $('.load').hide()
                    time = 600
                    $('.payTime').text(time)
                    pay_id = data.data.pay_id
                    payStatus()
                    countdown()
                }else if(data.code == 3001) {
                    cocoMessage.success('订单已支付', 2000)
                    window.location.href = "./query.html?oid=" + order_sn ;
                }else if(data.code == -1 && data.codeMsg == '不支持的该支付方式'){

                }else {
                    cocoMessage.error(data.codeMsg, 2000);
                    $(".mask").show()
                    $('.load').hide()
                }
                contentTypeIs = true
                closeMsg()
            },
            error: function(err) {
                cocoMessage.error("请求失败!请检查网络", 2000);
                contentTypeIs = true
                closeMsg()
            }
        });
    }
}

// 切换第三方支付方式
$('.zdyType').click(function() {
    $('.zdyType').removeClass('Select')
    $(this).addClass('Select')
    placeholder()
    $(".errTip").text('')
})

// 第三方支付,确认按钮
var TbPaying = false
$(".tb-payOrder").click(function (){
    $(".errTip").hide();
    $(".tbPay").removeClass('errInput')
    if(TbPaying){
        return;
    }
    if(!$("#tbTid").val()) {
        $(".errTip").text($('#tbTid').attr('placeholder'))
        $(".tbPay").addClass('errInput')
        $(".errTip").show();
        return
    }
    var closeMsgTb = cocoMessage.loading("订单支付中", 2000);
    
    // 判断是否存在优惠券, 存在的话重新生成订单
    if($('.errorTip1').is(':visible')) {
        // 清空优惠券
        $('.Exchange_hidden').show()
        $('.errorTip1').hide()
        $('.eliminateCoupon').click()
        var goods = []
        for(var i = 0; i< $('.appreciationLI').length; i++) {
            if($('.appreciationLI').eq(i).hasClass('selected')) {
                goods.push($('.appreciationLI').eq(i).attr('goodsId-key'))
            }
        }
        var formData = getFormData({
            order_sn: order_sn,
            goods: goods.toString()
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
                closeMsg()
                if (res.code == 200) {
                    $('.orderAmount').text( res.data.order_amount || '0.00')
                    $("#orderAmount2").text(res.data.order_amount)
                    $('#dateTime').text(res.data.created)
                    $('#orderIdText').text(res.data.order_sn)
                    if(typeData2.calc_price_type==2){
                        if(res.data.old_amount-typeData2.selling_price_list[price_index].price>0){
                            $('.tiered_pricing').show()
                            $('#Discount_amount1').text(Number((res.data.old_amount )- Number(typeData2.selling_price_list[price_index].price) + Number(res.data.coupon_money)).toFixed(2))
                        }
                    }
                    else{
                        $('.tiered_pricing').hide()
                    }
                    $('#original_price').text(res.data.old_amount)

                    order_sn = res.data.order_sn
                    thirdParty(closeMsgTb)
                }else {
                    closeMsg()
                }
            },
            error: function () {
                cocoMessage.error("请求失败!请检查网络", 2000);
                contentTypeIs = true
                closeMsg()
            },
        });
    }else {
        thirdParty(closeMsgTb)
    }
})
function thirdParty(closeMsgTb) {
    let formData = getFormData({
        order_sn: order_sn,
        pay_type: $('.zdyType.Select').attr('data-type'),
        tids: $("#tbTid").val() + ($('#tbTid-2').val()?(','+$('#tbTid-2').val()):''),
        source
    })
    TbPaying = true
    $.ajax({
        type: 'post',
        url: urls + '/api/client/pay/payOrder',
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: formData,
        success: function (data) {
            TbPaying = false
            if(data.code == 200){

            }else{
                if(data.code == 3001){
                    cocoMessage.success('订单已支付', 2000)
                    window.location.href = window.location.origin + "/query_order?oid=" + order_sn ;
                    return
                }
                $(".tbPay").addClass('errInput')
                $(".errTip").text(data.codeMsg)
                $(".errTip").show();
            }
        },
        error: function (err) {
            TbPaying = false
            cocoMessage.error("请求失败!请检查网络", 2000);
            contentTypeIs = true
        },
        complete: function (){
            closeMsgTb()
        }
    })
}

// 切换到第三方支付
function thirdpartyPayOrder() {
    $(".code.pull-left").hide();
    contentTypeIs = true;
    $(".tbPay").show();
    $('.Coupondisabled').addClass('Coupon_dis')
    $('.Picture_event1').show()
    $('.Picture_event').hide()
    if(pay_way_index.taobao) $('#TB').show()
    if(pay_way_index.redBook) $('#XHS').show()

    // 默认选中第三方支付方式
    if(pay_way_index.redBook) {
        $('#XHS').addClass('Select')
    }else {
        $('#TB').addClass('Select')
    }

    placeholder()
    clearTimeout(Timeout)
    time = 0
    closeMsg();
}

// 切换自定义订单提示
function placeholder() {
    if($('.zdyType.Select').attr('id')=='XHS') {
        $('#tbTid').attr('placeholder' , '填写小红书订单编号(必填)')
    }else {
        $('#tbTid').attr('placeholder' , '填写淘宝订单编号(必填)')
    }
}

var unit_price=''
var price_index = ''


// 初始化默认支付
function payWay(pay_way , goods_info, scanCodeRichInfo) {
    // 默认支付方式
    pay_type = typeAll[pay_way.default]
    pay_way_index = pay_way
    // 没有支付方式的时候隐藏订单金额
    if(!pay_way.alipay && !pay_way.wx && !pay_way.scanCodeRich && !pay_way.taobao && !pay_way.redBook&&!pay_way.kLenovoAiMiniPay){
        noPayWay = true
    }
    if(pay_type == 'scanCodeRich'||pay_type=='kLenovoAiMiniPay') { // 扫码付
        if(scanCodeRichInfo.scanCodeRichWx.enabled) {
            $('.tipsBox .scanCodeRichWx').show()
            $('.scanCodeRichWxText').text('微信')
            if(!scanCodeRichInfo.scanCodeRichAlipay.enabled && pay_way.alipay) {
                $('#alipay').show()
                $('#scanCodeRich').show()
                $('#scanCodeRich').addClass('select')
            }
        }
        if(scanCodeRichInfo.scanCodeRichAlipay.enabled) {
            $('.tipsBox .scanCodeRichAlipay').show()
            $('.scanCodeRichAlipayText').text('支付宝')
            if(!scanCodeRichInfo.scanCodeRichWx.enabled && pay_way.wx) {
                $('#wx').show()
                $('#scanCodeRich').show()
                $('#scanCodeRich').addClass('select')
            }
        }
        if(scanCodeRichInfo.scanCodeRichWx.enabled && scanCodeRichInfo.scanCodeRichAlipay.enabled){
            $('.scanCodeRichWxText').text('微信、')
        }
        $('.tipsBox').show()
        $(".code").show();
        $('.titlesRight').removeClass('payTypeClass')
        if(pay_way.taobao || pay_way.redBook) {// 扫码付有自定义订单的时候, 出现左侧选项
            $('#thirdparty').show()
            $('#scanCodeRich').show()
            $('#scanCodeRich').addClass('select')
        }
    }else { // 其他支付方式
        if(pay_way.alipay) $('#alipay').show()
        if(pay_way.wx) $('#wx').show()
        $('.clearfix2>.payType>div').removeClass('select')
        $('#' + pay_way.default).addClass('select')
        if(pay_way.taobao || pay_way.redBook) {// 第三方订单展示控制
            if(pay_type != 'taobao' && pay_type!='redBook') $('#thirdparty').show()

            if(pay_way.taobao) {
                $('#TB').show()
            }
            if(pay_way.redBook) {
                $('#XHS').show()
            }
        }
        // 默认支付方式为淘宝或小红书的时候, 说明没有其他支付方式了
        if(pay_type == 'taobao' || pay_type=='redBook') { // 淘宝或小红书订单(第三方订单)
            $(".code").hide();
            $(".tbPay").show();
            $(".tbPay").css('paddingLeft', 0)

            if(pay_type == 'taobao') { // 默认选中第三方支付方式
                $('#TB').addClass('Select')
            }else {
                $('#XHS').addClass('Select')
            }
            placeholder()
        }else {
            $(".code").show();
        }
    }

    typeData2 = typeData[getQueryVariable('contentType')] // 拿到当前版本的info参数
    if(typeData2.calc_price_type==2){
        $('.Step_price').show()
    }
    else{
        $('.UnitPrice').show()
    }
    /**
     TODO
     判断是否有增值业务,
     有就调接口加上,成功后默认选中
     否则就直接调二维码接口
     **/
    var increment_goods_arr = []
    for(var i in typeData2.increment_goods_infos) {
        increment_goods_arr.push(typeData2.increment_goods_infos[i])
    }
    if(increment_goods_arr.length) { // 以后改默认不选中改此处
        var variationOrderId = []
        for(var i=0; i<increment_goods_arr.length; i++){
            for(var j=0; j<$(".appreciationLI").length; j++){
                if($($(".appreciationLI")[j]).attr('data-janename') == increment_goods_arr[i].short_name || $($(".appreciationLI")[j]).attr('data-janename1') == increment_goods_arr[i].short_name){   //增值服务块显示
                    $($(".appreciationLI")[j]).attr('goodsid-key',increment_goods_arr[i].goods_id)
                    if(increment_goods_arr[i].selection) {
                        $($(".appreciationLI")[j]).addClass('selected')
                    }
                    $($(".appreciationLI")[j]).find('.good_name').text(increment_goods_arr[i].name)
                   if(increment_goods_arr[i].unit_type == '篇') {
                       $($(".appreciationLI")[j]).find('.currentPrice').text(increment_goods_arr[i].selling_price + '元')
                       $($(".appreciationLI")[j]).find('.originalPrice').text((increment_goods_arr[i].selling_price * 2).toFixed(2) + '元')
                   }else{
                       $($(".appreciationLI")[j]).find('.price').text(increment_goods_arr[i].selling_price + '元/' + increment_goods_arr[i].unit_count + increment_goods_arr[i].unit_type)
                   }
                    $($(".appreciationLI")[j]).show()
                }
            }
            if(getQueryVariable('zxktbg') && getQueryVariable('zxktbg')!=='false' && increment_goods_arr[i].short_name == 'ktbg'){
                $(".appreciationLI[data-janename='ktbg']").hide()
                $(".appreciationLI[data-janename='ktbg']").removeClass('selected')
            }
        }
        $('.appreciation').show()
        for(var i=0;i<$(".appreciationLI.selected").length; i++){
            variationOrderId.push($($(".appreciationLI.selected")[i]).attr('goodsid-key'))
        }
        variationOrder(variationOrderId)
    }else {
        //无支付方式隐藏扫码支付
        if(noPayWay){
            $(".noPayWay").show()
            $("#orderAmount2").text(order_amount)
            $(".pay_Box_y").hide();
            $("#coupon").attr("placeholder", "请输入优惠券兑换码支付");
            $(".no_pay_text").show();
            closeMsg()
        }else{
            if(pay_type == 'thirdparty'){
                closeMsg()
                return
            }
            payOrder(pay_type)
        }
    }  
    
    if(typeData2.calc_price_type == 2) {
        for (var i=0; i<typeData2.selling_price_list.length;i++){
            if(Number(getQueryVariable('wordNum')) >= Number(typeData2.selling_price_list[typeData2.selling_price_list.length-1].word)){
                price_index = typeData2.selling_price_list.length-1
                break
            }
            if(Number(getQueryVariable('wordNum')) <= Number(typeData2.selling_price_list[0].word)){
                price_index = 0
                break
            }
            if(Number(getQueryVariable('wordNum')) > Number(typeData2.selling_price_list[i].word) && Number(getQueryVariable('wordNum')) <= Number(typeData2.selling_price_list[i+1].word) ){
                price_index = i+1
            }
        }
        $('.NumberWordsBox').show()
        $('.Step_price').text(typeData2.selling_price_list[price_index].price+'元/篇')
    }else{
        if(typeData2.unit_type == '字') {
            $('.UnitPrice').text(typeData2.selling_price+'元/'+typeData2.unit_count+typeData2.unit_type+"（不满千字按千字计算）")
            $('#UnitPrice2').text(typeData2.selling_price+'元/'+typeData2.unit_count+typeData2.unit_type+"（不满千字按千字计算）")
            $('.NumberWordsBox').show()
        }else {
            $('.UnitPrice').text(typeData2.selling_price+'元/每'+typeData2.unit_type)
            $('#UnitPrice2').text(typeData2.selling_price+'元/每'+typeData2.unit_type)
        }
    }


    // if(typeData2.unit_type == '字') {
    //     $('.UnitPrice').text(typeData2.selling_price+'元/'+typeData2.unit_count+typeData2.unit_type+"（不满千字按千字计算）")
    //     $('#UnitPrice2').text(typeData2.selling_price+'元/'+typeData2.unit_count+typeData2.unit_type+"（不满千字按千字计算）")
    //     $('.NumberWordsBox').show()
    // }else {
    //     $('.UnitPrice').text(typeData2.selling_price+'元/每'+typeData2.unit_type)
    //     $('#UnitPrice2').text(typeData2.selling_price+'元/每'+typeData2.unit_type)
    // }
    window.setHeight()
    if(window.localStorage.getItem('CouponUltimate')){
        $('#coupon').val(window.localStorage.getItem('CouponUltimate'))
        $('#coupon').trigger('input')
        $(".activityTip").text('已自动填写活动优惠券码，请点击兑换使用')
        $(".activityTip").show();
    }
}


function payStatus() { // 轮询
    clearTimeout(Timeout);
    $.ajax({
        type: 'get',
        url: urls + '/apirs/order/is_pay?pay_id=' + pay_id,
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
                window.location.href = "./query.html?oid=" + pay_id ;
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
                    $('.payTime').text(time>0? time : 0)
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

// 下一步
$('.next').click(function() {
    if(isTrue) return
    isTrue = true
    setTimeout(() => {
        isTrue = false
    },3000)
    var form_data = getFormData({
        pay_id: pay_id
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
                window.location.href = "./query.html?oid=" + pay_id;
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

// 支付方式切换
$('.clearfix2>.payType>div').click(function () {
    if(pay_type) {
        if(!contentTypeIs) return
        if($(this).attr('data-type') != pay_type) {
            closeMsg = cocoMessage.loading('正在切换支付方式...');
            contentTypeIs = false
            $('.clearfix2>.payType>div').removeClass('select')
            if($(this).attr('data-type') == 'scanCodeRich'){
                $('.titlesRight').removeClass('payTypeClass')
                $(".tipsBox").show()
            }else{
                $('.titlesRight').addClass('payTypeClass')
                $(".tipsBox").hide()
            }
            $(this).addClass('select')
            pay_type = $(this).attr('data-type')
            if(pay_type == 'thirdparty'){
                thirdpartyPayOrder()
                $('#coupon').attr('disabled' , true)
                $('.use_now').addClass('disabledCss')
                return;
            }
            else{
                $('.Coupondisabled').removeClass('Coupon_dis')
                $('.Picture_event1').hide()
                if(window.sessionStorage.getItem('editionKey') == 'bylwsenior'){
                    $('.Picture_event3').show()
                }
                else{
                    $('.Picture_event2').show()
                }
                $('#coupon').attr('disabled' , false)
                $('.use_now').removeClass('disabledCss')
            }
            $(".tbPay").hide();
            $(".code").show();
            payOrder()
        }
    }
})

$(".appreciationUL").on('click','.appreciationLI',function(){
    if(!contentTypeIs) return
    closeMsg = cocoMessage.loading('正在重新计算价格...');
    $('.orderAmount').text('0.00')
    contentTypeIs = false
    if($(this).hasClass('selected')) {
        $(this).removeClass('selected')
    }else {
        $(this).addClass('selected')
    }
    // 加载
    $('.load').show()
    $(".mask").hide();
    $('.Exchange_hidden').show()
    $('.use_now').removeClass('can')
    // 组装goods
    var goods = []
    for(var i = 0; i< $('.appreciationLI').length; i++) {
        if($('.appreciationLI').eq(i).hasClass('selected')) {
            goods.push($('.appreciationLI').eq(i).attr('goodsId-key'))
        }
    }
    $("#coupon").val('')
    $('.errorTip1').hide()
    $('.errorTip').hide()
    $('.Discountamount').hide()
    // $('.use_now').text('兑换')
    $('.eliminateCoupon').hide()
    var formData = getFormData({
        order_sn: order_sn,
        goods: goods.toString()
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
            if (res.code == 200) {
                order_sn = res.data.order_sn
                $('.orderAmount').text( res.data.order_amount || '0.00')
                $("#orderAmount2").text(res.data.order_amount)
                $('#dateTime').text(res.data.created)
                $("#Total_amount").text(res.data.order_money)
                if(typeData2.calc_price_type==2){
                    if(res.data.old_amount-typeData2.selling_price_list[price_index].price>0){
                        $('.tiered_pricing').show()
                        $('#Discount_amount1').text(Number((res.data.old_amount )- Number(typeData2.selling_price_list[price_index].price) + Number(res.data.coupon_money)).toFixed(2))
                    }
                }
                else{
                    $('.tiered_pricing').hide()
                }
                $('#original_price').text(res.data.old_amount)

                if(pay_type!='thirdparty') {
                    payOrder()
                }else {
                    closeMsg()
                    contentTypeIs = true
                    $('#orderIdText').text(order_sn)
                }
                clearTimeout(Timeout);
            }else {
                cocoMessage.error("增值服务选择失败!", 2000);
                if($(this).hasClass('selected')) {
                    $(this).removeClass('selected')
                }else {
                    $(this).addClass('selected')
                }
                contentTypeIs = true
                closeMsg()
            }
        },
        error: function () {
            cocoMessage.error("请求失败!请检查网络", 2000);
            contentTypeIs = true
            closeMsg()
        },
    });
});

 // 默认选中增值服务(进入页面需要请求三个接口, 二维码显示时间太慢
function variationOrder(variationOrderId) {
    contentTypeIs = false
    // 组装goods
    var goods = variationOrderId

    var formData = getFormData({
        order_sn: order_sn,
        goods: goods.toString(),
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
            if (res.code == 200) {
                order_sn = res.data.order_sn
                order_amount = res.data.order_amount
                $('.orderAmount').text( res.data.order_amount || '0.00')
                if(typeData2.calc_price_type==2){
                    if(res.data.old_amount-typeData2.selling_price_list[price_index].price>0){
                        $('.tiered_pricing').show()
                        $('#Discount_amount1').text(Number((res.data.old_amount )- Number(typeData2.selling_price_list[price_index].price) + Number(res.data.coupon_money)).toFixed(2))
                    }
                }
                else{
                    $('.tiered_pricing').hide()
                }
                $('#original_price').text(res.data.old_amount)
                $('#dateTime').text(res.data.created)
                $('#Total_amount').text(res.data.order_money)

            }else {
                $('.appreciationLI').removeClass('selected')
            }
            if(noPayWay){
                $('#orderIdText').text(res.data.order_sn)
                $(".noPayWay").show()
                $("#orderAmount2").text(order_amount)
                $('#dateTime').text(res.data.created)
                $(".pay_Box_y").hide();
                $("#coupon").attr("placeholder", "请输入优惠券码支付");
                $(".no_pay_text").show();
                contentTypeIs = true
                closeMsg()
            }else{
                if(pay_type !== 'thirdparty'){
                    payOrder(pay_type)
                }else{
                    closeMsg()
                    contentTypeIs = true
                }
            }
        },
        error: function () {
            cocoMessage.error("请求失败!请检查网络", 2000);
            contentTypeIs = true
        },
    });
}

//优惠券
$("#coupon").on('input',function (){
    if($(this).val().length > 0){
        $(".use_now").addClass('can')
        $(".eliminateCoupon").css('display','inline-block')
    }else{
        $(".use_now").removeClass('can')
        $(".eliminateCoupon").hide()
        $('.Discountamount').hide()
        $('.errorTip1').hide()
        $('.errorTip').hide()
        // Readjust()
    }
})

$(".eliminateCoupon").on('click', function (){
    // $('.use_now').text('兑换')
    $("#coupon").val('')
    $("#coupon").trigger('input')
    $("#coupon").trigger('change')
})

$("#coupon").on('change',function (){
    $(".errorTip").hide();
    $(".activityTip").hide()
})

let canClick = true;

$(".use_now").on('click',function() {
    if(!$("#coupon").val()){
        closeMsg = cocoMessage.error('请输入优惠券兑换码',2000);
        $("#coupon").trigger('input')
        return;
    }
    if(!canClick){
        return
    }
    canClick = false
    // closeMsg = cocoMessage.loading('正在兑换优惠券...');
    $('.Exchange_loading').show()
    $('.use_now').removeClass('can')
    // 组装goods
    var goods = []
    for(var i = 0; i< $('.appreciationLI').length; i++) {
        if($('.appreciationLI').eq(i).hasClass('selected')) {
            goods.push($('.appreciationLI').eq(i).attr('goodsId-key'))
        }
    }

    var formData = getFormData({
        order_sn: order_sn,
        goods: goods.toString(),
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
                
                order_sn = res.data.order_sn
                $('.orderId_pop').text(res.data.order_sn)
                $('#orderIdText').text(res.data.order_sn)
                $('#Discount_amount').text(res.data.coupon_money)
                if(typeData2.calc_price_type==2){
                    if(res.data.old_amount-typeData2.selling_price_list[price_index].price>0){
                        $('.tiered_pricing').show()
                        $('#Discount_amount1').text(Number((res.data.old_amount )- Number(typeData2.selling_price_list[price_index].price) + Number(res.data.coupon_money)).toFixed(2))
                    }
                }
                else{
                    $('.tiered_pricing').hide()
                }
                $('#original_price').text(res.data.old_amount)
                $('.Exchange_loading').hide()
                if(Number(res.data.order_amount) == 0) {
                    $(".coupon_pop").show();
                    $(".mask_body").show();
                }else{
                    if(noPayWay){
                        cocoMessage.error("此优惠券不满足免单条件！", 2000);
                        return;
                    }
                    payOrder('',res.data.order_amount)
                    if(res.data.coupon_money>0){
                        // $('.use_now').text('已兑换')
                        $('.use_now').removeClass('can')
                        $('.errorTip1').show()
                        $('.Exchange_hidden').hide()
                        if(typeData2.calc_price_type!=2){
                            $('.Discountamount').show()
                        }
                        $('#After_discounts').text(res.data.coupon_money)
                    }
                }
            }else {
                // cocoMessage.error(res.codeMsg, 2000);
                $('.errorTip1').hide()
                $(".errorTip span").text(res.codeMsg)
                $(".errorTip").show();
                $(".activityTip").hide()
                $('.Exchange_loading').hide()
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

$(".copy_pop").on('click',function (){
    var text = $(".orderId_pop").text()
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

function couponsPay() {
    var formData2 = getFormData({
        order_sn: order_sn,
        pay_type: 'coupons',
        source
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
                window.location.href = "./query.html?oid=" + order_sn ;
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

$(".close_pop").on('click',function (){
    $('.use_now').addClass('can')
    $(".coupon_pop").hide();
    $(".mask_body").hide();
})
$(".cancel_btn").on('click',function (){
    $('.use_now').addClass('can')
    $(".coupon_pop").hide();
    $(".mask_body").hide();
})
$(".determine_btn").on('click',function (){
    couponsPay()
})
$('.getBack').click(function() {
    if(typeData[getQueryVariable('contentType')]){
        window.localStorage.setItem('projectName_order', typeData[getQueryVariable('contentType')].short_name)
        window.localStorage.setItem('project_order', getQueryVariable('contentType'))
    }
    if( ['bylwsenior' , 'ktbgsenior' , 'qklwsenior'].includes(window.sessionStorage.getItem('editionKey'))){
        $(".jump-prompt").fadeIn()
        $(".mask_body").fadeIn()
    }else {
        location.href = './index.html'
    }
})

$(".jump-prompt .close").click(function (){
    $(".mask_body").fadeOut()
    $(".jump-prompt").fadeOut()
})

$(".jump-prompt .cancel").click(function (){
    $(".mask_body").fadeOut()
    $(".jump-prompt").fadeOut()
})

$(".jump-prompt .confirm").click(function (){
    location.href = './index.html'
})

$(".mask_body").click(function (){
    $(".mask_body").fadeOut()
    $(".jump-prompt").fadeOut()
})

$('.PreviewClick').click(function() {
    if($('#App').hasClass('ktbgsenior')) {
        ktbgseniorOutline(JSON.parse(localStorage.getItem('reviewData')))
        $('.EditPopup').show()
        $('#editor2').hide()
    }else {
        Recommended(JSON.parse(localStorage.getItem('reviewData')) , $("#editor2"))
        $('.EditPopup').show()
        $('#ktbgseniorBox').hide()
        $('#editor2').attr('contenteditable' , false)
    }
})
if(localStorage.getItem('reviewData') && !JSON.parse(localStorage.getItem('reviewData')).length) {
    $('.Preview').hide()
}

function setCssHeight(){
    if($(window).height()> 830){
        $(".main .h3Text").css('marginTop', '24px')
        $(".main .titles").css('marginTop', '30px')
        $(".main .table").css('marginTop', '26px')
        $(".main .table").css('paddingBottom', '20px')
        $(".main .clearfix2").css('marginTop', '26px')
        $(".main #tbTid-2").css('marginTop', '10px')
        $(".main .tb-payOrder").css('marginTop', '20px')
        $(".main .appreciation").css('marginTop', '30px')
        $(".main .coupon_box").css('marginTop', '30px')
        $(".main .appreciationUL").css('marginTop', '22px')
    }
}

window.onresize = function (){
    setCssHeight()
}
setCssHeight()

$(".szsj_tips_block").on('click',function (e){
    e.stopPropagation()
})

$('#outlineReplication').click(function() {
    if(localStorage.getItem('reviewData')) {
        var reviewData = []
        $('#editor2').children('p').each(function(index, domele) {
            reviewData.push(domele.getAttribute('data-lvt') + domele.textContent)
        })
        var text = ''
        for(var i=0; i<reviewData.length; i++) {
            text+=reviewData[i] + `\r\n`
        }
        var content = text;
        var $tempInput = $("<textarea>");
        $("body").append($tempInput);
        $tempInput.val(content).select();
        document.execCommand("copy");
        $tempInput.remove();
        cocoMessage.success('复制成功', 2000)
    }
})
// $('.Coupon_con').on('click',function(){
//     $('.Coupon_exceeds').hide()
// })

$('.Picture_event').on('click',function(){
    $('.Exchange_hidden').show()
    $('.errorTip1').hide()
    $("#coupon").val('')
    // $('.use_now').text('兑换')
    $('.eliminateCoupon').hide()
    $('.Discountamount').hide()
    Readjust()
})


function Readjust(){
    var goods = []
    for(var i = 0; i< $('.appreciationLI').length; i++) {
        if($('.appreciationLI').eq(i).hasClass('selected')) {
            goods.push($('.appreciationLI').eq(i).attr('goodsId-key'))
        }
    }

    var formData = getFormData({
        order_sn: order_sn,
        goods: goods.toString(),
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
            if (res.code == 200) {
                order_sn = res.data.order_sn
                $('.orderAmount').text( res.data.order_amount || '0.00')
                $("#orderAmount2").text(res.data.order_amount)
                $('#dateTime').text(res.data.created)
                if(typeData2.calc_price_type==2){
                    if(res.data.old_amount-typeData2.selling_price_list[price_index].price>0){
                        $('.tiered_pricing').show()
                        $('#Discount_amount1').text((Number(res.data.old_amount) - Number(typeData2.selling_price_list[price_index].price) + Number(res.data.coupon_money)).toFixed(2))
                    }
                }
                else{
                    $('.tiered_pricing').hide()
                }
                $('#original_price').text(res.data.old_amount)
                payOrder()
                clearTimeout(Timeout);
            }else {
                cocoMessage.error("请求失败!", 2000);
                if($(this).hasClass('selected')) {
                    $(this).removeClass('selected')
                }else {
                    $(this).addClass('selected')
                }
                contentTypeIs = true
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
