var orderInfoData = {}
// 微信浏览器并且有微信支付
function refreshPageWx() {
    if(getQueryVariable('openid')){
        window.sessionStorage.setItem('openid_pay', getQueryVariable('openid'))
    }
    if (/MicroMessenger/.test(window.navigator.userAgent) && payWay_Info.wx && payWay_Info.wx_jsapi) {  // 微信浏览器 且 有微信支付
        if(getQueryVariable('getOpenId') == 'true' && !openid){
            location.href = 'https://api.taoxiangyoushu.com/weixin/getOpenId?appid=' + payWay_Info.wx_jsapi + '&otherUrl=' + encodeURIComponent(window.location.href.replace('getOpenId=true','getOpenId=false'))
        }
    }
}

toast({
    msg: '正在计算价格...',
    type: 'loading',
    time: 20000
})

var orderId = ''
var payType = ""
var time = 1800
var source = 7
var Timeout = ''
var order_sn = getQueryVariable('commitId')
var payId = getQueryVariable('payId')
var payIs = false
var isTips = true
var noPayWay = false
var openid = getQueryVariable('openid') || window.sessionStorage.getItem('openid_pay')
var is_wxApplet = false
var price_index = ''
var price_stairs = ''

// 判断是否微信小程序内
function isWx() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return new Promise(resolve => {
            wx.miniProgram.getEnv(function(res) {
                if (res.miniprogram) {
                    resolve("mini-wx");
                } else {
                    resolve("wx");
                }
            });
        });
    } else {
        return new Promise(resolve => {
            resolve("no-wx");
        });
    }
}

isWx().then(type => {
    if (type == "wx") {
    }
    if( type == 'mini-wx') {
        is_wxApplet = true
    }
});

// 控制支付方式选中
function typeSelect(type,use) {
    if(type == 'wxPublicNum' || type == 'wxWap') {
        $('.isSelect2>.img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/select.png')
        $('.isSelect1>.img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/noselect.png')
    }else if(type == 'alipayWap') {
        $('.isSelect1>.img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/select.png')
        $('.isSelect2>.img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/noselect.png')
    }
    if(!use){
        payType = type
    }
}
function llqType(pay_way) {
    isTips = false
    if(pay_way.taobao){
        $(".taobao_pay").css('display' , 'flex')
    }
    if(pay_way.redBook){
        $(".redBook_pay").css('display' , 'flex')
    }

    if(pay_way.default == 'scanCodeRich') {
        payType = "scanCodeRich"
        $('.payType').hide()
        payIs = true
        if(!pay_config.scanCodeRichAlipay.enabled && pay_way.alipay) {
            $('.payType').show()
            typeSelect('wxWap',true)
            $('#wx-pay').attr('data-paytype', 'scanCodeRich')
        }
        if(!pay_config.scanCodeRichWx.enabled && pay_way.wx) {
            $('.payType').show()
            typeSelect('alipayWap',true)
            $('#ali-pay').attr('data-paytype', 'scanCodeRich')
            if(!pay_way.wx_jsapi){
                $('#wx-pay').hide()
            }
            if (/MicroMessenger/.test(window.navigator.userAgent)) {  // 微信浏览器
                $('#wx-pay').attr('data-payType','wxPublicNum')
                if(!openid){
                    $('#wx-pay').hide()
                }
            }
        }
        if (/MicroMessenger/.test(window.navigator.userAgent)) {  // 微信浏览器
            source = 2
            if (!pay_config.scanCodeRichWx.enabled) {  // 扫码付不支持微信支付
                $(".btn_transferPay").attr('data-single', 'zfb')
                $(".btn_transferPay").attr('data-type', 'scanCodeRich')
                $(".btn_transferPay .p_tips1").text('(支付宝扫码支付)')
                $(".btn_clone .p_tips1").text('(电脑端打开)')
                // $(".modal-body .tips2").text('请复制链接至电脑端打开')
                $('.payBotton').attr('data-toggle' , "modal").attr("data-target" , "#myModal")
                isTips = true
                $('.linkUrl').text(window.location.href)
                return
            }
        }
        if(!(/MicroMessenger/.test(window.navigator.userAgent)) && !(/AlipayClient/.test(window.navigator.userAgent)) && !is_wxApplet ) {   // 外部浏览器
            $(".btn_transferPay").attr('data-type', 'scanCodeRich')
            $(".btn_transferPay .p_tips1").text('(微信或支付宝扫码支付)')
            $(".btn_clone .p_tips1").text('(微信或电脑端打开)')
            if (!pay_config.scanCodeRichWx.enabled) {  // 扫码付不支持微信支付
                // $(".modal-body .tips2").text('请复制链接至电脑端打开')
                $(".btn_transferPay").attr('data-single', 'zfb')
                $(".btn_transferPay .p_tips1").text('(支付宝扫码支付)')
                $(".btn_clone .p_tips1").text('(电脑端打开)')
            }
            if (!pay_config.scanCodeRichAlipay.enabled) {  // 扫码付不支持支付宝支付
                // $(".modal-body .tips2").text('请复制链接至电脑端打开')
                $(".btn_transferPay").attr('data-single', 'wx')
                $(".btn_transferPay .p_tips1").text('(微信扫码支付)')
                $(".btn_clone .p_tips1").text('(微信或电脑端打开)')
            }
            $('.payBotton').attr('data-toggle' , "modal").attr("data-target" , "#myModal")
            isTips = true
            $('.linkUrl').text(window.location.href)
            return
        }
    }else if(pay_way.default == 'kLenovoAiMiniPay'){
        payType = "kLenovoAiMiniPay"
        $('.payType').hide()
        payIs = true
        // $('.payBotton').attr('data-toggle' , "modal").attr("data-target" , "#myModal")
        // isTips = true
        // $('.linkUrl').text(window.location.href)
    }else {
        if (/MicroMessenger/.test(window.navigator.userAgent) && !is_wxApplet) {    // 微信浏览器
            typeSelect('wxPublicNum')
            $('#wx-pay').attr('data-payType','wxPublicNum')
            source = 2

            if(openid){
                $('.payType').show()
                payIs = true
                $('#wx-pay').show()
            }
            if(pay_way.wx){
                if(openid){
                    typeSelect('wxPublicNum')
                }else{
                    $('#wx-pay').hide()
                    typeSelect('alipayWap')
                }
            }else {
                $('#wx-pay').hide()
                typeSelect('alipayWap')
            }
        }else { // 除微信浏览器, 其他浏览器默认选中支付宝支付
            if(pay_way.alipay) {
                typeSelect('alipayWap')
            }else if(pay_way.wx) {
                typeSelect('wxWap')
                $(".btn_transferPay").attr('data-type', 'wxScan')
                $(".btn_transferPay .p_tips1").text('(微信扫码支付)')
                $(".btn_clone .p_tips1").text('(微信或电脑端打开)')
                if( !is_wxApplet ){
                    $('.payBotton').attr('data-toggle' , "modal").attr("data-target" , "#myModal")
                    isTips = true
                }
                $('.linkUrl').text(window.location.href)
            }
        }
        if(pay_way.alipay || pay_way.wx) {
            $('.payType').show()
            // if(pay_way.default == 'alipay'){
            //     typeSelect('alipayWap')
            // }
            // if(pay_way.default == 'wx'){
            //     typeSelect('wxPublicNum')
            // }
            // if(pay_way.alipay){
            //     $("#ali-pay").show()
            // }else{
            //     $("#ali-pay").hide()
            // }
            // if(pay_way.wx){
            //     $("#wx-pay").show()
            // }else{
            //     $("#wx-pay").hide()
            // }
            payIs = true
        }
        if(!pay_way.alipay) {
            $(".payTypeBox[data-paytype='alipayWap']").hide()
        }
        if(!pay_way.wx) {
            $(".payTypeBox[data-paytype='wxWap']").hide()
            $(".payTypeBox[data-paytype='wxPublicNum']").hide()
        }


        // 默认支付方式为淘宝或小红书, 说明没有其他支付方式了
        if(pay_way.default == 'taobao' || pay_way.default == 'redBook') {
            $(".noPayWay").show();
            $(".bottomBox").hide()
        }
        if(pay_way.default == 'taobao'){
            if(pay_way.scanCodeRich){
                payIs = true
                payType = "scanCodeRich"
                if(!(/MicroMessenger/.test(window.navigator.userAgent)) && !(/AlipayClient/.test(window.navigator.userAgent))) {
                    $('.payBotton').attr('data-toggle' , "modal").attr("data-target" , "#myModal")
                    isTips = true
                    $('.linkUrl').text(window.location.href)
                    return
                }
            }
        }
    }
}

$('.payTypeBox').click(function() {
    $('.payTypeBox .img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/noselect.png')
    $(this).children().children('.img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/select.png')
    payType = $(this).attr('data-payType')

    // 除开微信浏览器的时候, 选中微信支付就弹窗提示复制链接, 否则正常提交
    if(!(/MicroMessenger/.test(window.navigator.userAgent))) {
        if(payType == 'wxWap' || payType == 'scanCodeRich') {
            if(payType == 'wxWap'){
                $(".modal-body .tips2").text('请复制链接至微信或电脑端打开')
                if( is_wxApplet ){
                    return
                }
            }
            $(".btn_transferPay").attr('data-type', 'wxScan')
            $(".btn_transferPay .p_tips1").text('(微信扫码支付)')
            $(".btn_clone .p_tips1").text('(微信或电脑端打开)')
            $('.payBotton').attr('data-toggle' , "modal").attr("data-target" , "#myModal")
            isTips = true
            $('.linkUrl').text(window.location.href)
            return
        }else {
            $('.payBotton').attr('data-toggle' , "").attr("data-target" , "")
            isTips = false
            return
        }
    }else{
        if(payType == 'wxPublicNum') {
            $('.payBotton').attr('data-toggle' , "").attr("data-target" , "")
            isTips = false
        }
        if(payType == 'scanCodeRich' && $(this).attr('id')!=='wx-pay') {
            $('.payBotton').attr('data-toggle' , "modal").attr("data-target" , "#myModal")
            isTips = true
        }
    }
})
$('#orderIdText').text(order_sn)
if(!order_sn) location.href='./index.html'

function payWay(goods_info , pay_way) {
    refreshPageWx()
    if(getQueryVariable('contentType')){
        var typeData2 = typeData[getQueryVariable('contentType')] // 拿到当前版本的info参数
       if(typeData2){
           $('#typeTag').text(typeData2.name).show()
       }
    }

    var increment_goods_arr = []
    if(typeData2){
        for(var i in typeData2.increment_goods_infos) {
            increment_goods_arr.push(typeData2.increment_goods_infos[i])
        }
    }
    if(increment_goods_arr.length) { // 配置增值服务并配置默认选中
        var buttonDiv = ''
        for(var i=0; i<increment_goods_arr.length; i++) {
            for(var j=0; j<$(".appreciationLI").length; j++) {
                if(increment_goods_arr[i].short_name == $($(".appreciationLI")[j]).attr('data-janename') || increment_goods_arr[i].short_name == $($(".appreciationLI")[j]).attr('data-janename1') ) {
                    $($(".appreciationLI")[j]).attr('goodsid-key',increment_goods_arr[i].goods_id)
                    $($(".appreciationLI")[j]).find('.good_name').text(increment_goods_arr[i].name)
                    if(increment_goods_arr[i].unit_type == '篇') {
                        $($(".appreciationLI")[j]).find('.current-price').text(increment_goods_arr[i].selling_price + '元')
                        $($(".appreciationLI")[j]).find('.original-price').text((increment_goods_arr[i].selling_price * 2).toFixed(2) + '元')
                    }else{
                        $($(".appreciationLI")[j]).find('.price').text(increment_goods_arr[i].selling_price + '元/' + increment_goods_arr[i].unit_count + increment_goods_arr[i].unit_type)
                    }
                    $($(".appreciationLI")[j]).show()
                    $($(".appreciationLI")[j]).css('display','flex')
                }
            }
            if(getQueryVariable('zxktbg') && getQueryVariable('zxktbg')!=='false' && increment_goods_arr[i].short_name == 'ktbg'){
                $(".appreciationLI[data-janename='ktbg']").hide()
                $(".appreciationLI[data-janename='ktbg']").removeClass('selected')
            }
        }
        // $('.appreciationUL').html(buttonDiv)
        $('.appreciation').show()
        var goods = getQueryVariable('goods')? JSON.parse(getQueryVariable('goods')) : []
        for(var k = 0; k< $('.appreciationLI').length; k++) {
            if(goods.includes($('.appreciationLI').eq(k).attr('goodsId-key'))) {
                $('.appreciationLI').eq(k).addClass('selected')
            }
        }
        /**
         判断goods是否存在数据
         index跳转过来goods为空,
         其他返回过来没有数据的情况下为[]
         所以只有index过来的时候才会给增值服务根据接口默认选中并切换了订单号
         **/
        if(!getQueryVariable('goods')) {
            for(var i=0; i<increment_goods_arr.length; i++) {
                for(var j=0; j<$(".appreciationLI").length; j++) {
                    if(increment_goods_arr[i].short_name == $($(".appreciationLI")[j]).attr('data-janename') || increment_goods_arr[i].short_name == $($(".appreciationLI")[j]).attr('data-janename1')) {
                        if(increment_goods_arr[i].selection) {
                            $($(".appreciationLI")[j]).addClass('selected')
                        }
                    }
                }
            }
            variationOrder()
        }else {
            toastNone()
            $('#amountText').text(getQueryVariable('order_amount'))
            $('#amountText2').text(getQueryVariable('order_amount'))
        }
    }else {
        toastNone()
        $('#amountText').text(getQueryVariable('order_amount'))
        $('#amountText2').text(getQueryVariable('order_amount'))
    }

    if(!pay_way.alipay && !pay_way.wx && !pay_way.scanCodeRich && !pay_way.taobao&&!pay_way.kLenovoAiMiniPay){
        noPayWay = true
    }
    if(noPayWay){
        $(".noPayWay").show();
        $(".no_pay_text").show();
        $(".payType").hide();
        $(".bottomBox").hide();
    }

    llqType(pay_way)

    if(typeData2){
        if(typeData2.calc_price_type == 2) {
            for (var i=0; i<typeData2.selling_price_list.length;i++){
                if(Number(getQueryVariable('wordNum')) >= Number(typeData2.selling_price_list[typeData2.selling_price_list.length-1].word)){
                    price_index = typeData2.selling_price_list.length-1
                    price_stairs = typeData2.selling_price_list[typeData2.selling_price_list.length-1].price
                    break
                }
                if(Number(getQueryVariable('wordNum')) <= Number(typeData2.selling_price_list[0].word)){
                    price_index = 0
                    price_stairs = typeData2.selling_price_list[0].price
                    break
                }
                if(Number(getQueryVariable('wordNum')) > Number(typeData2.selling_price_list[i].word) && Number(getQueryVariable('wordNum')) <= Number(typeData2.selling_price_list[i+1].word) ){
                    price_index = i+1
                    price_stairs = typeData2.selling_price_list[i+1].price
                }
            }
            $('.NumberWordsBox').show()
            $('#priceTetx2').text(typeData2.selling_price_list[price_index].price+'元/篇')
        }else{
            if(typeData2.unit_type == '字') {
                $('#priceTetx').text(typeData2.selling_price+'元/'+typeData2.unit_count+typeData2.unit_type)
                $('#priceTetx2').text(typeData2.selling_price+'元/'+typeData2.unit_count+typeData2.unit_type)
                $('.NumberWordsBox').show()
            }else {
                $('#priceTetx').text(typeData2.selling_price+'元/每'+typeData2.unit_type)
                $('#priceTetx2').text(typeData2.selling_price+'元/每'+typeData2.unit_type)
            }
        }
    }
    if(window.localStorage.getItem('CouponUltimate')){
        $('#coupon').val(window.localStorage.getItem('CouponUltimate'))
        $('#coupon').trigger('input')
        $(".activityTip").show();
    }
}
$('.payBotton').click(function() {
    if(isTips) return
    if(!payIs) return toast({msg: '暂未配置支付'})
    if(payType == 'scanCodeRich') {
        if(orderInfoData.pay_wap_url) {
            editUrl(order_sn)
            if( is_wxApplet ){
                window.location.href = './transfer_pay.html?pay_url=' + encodeURIComponent(orderInfoData.pay_wap_url) + '&order_sn=' + order_sn + '&amount=' + $('#amountText').text() + '&payType=scanCodeRich&sourceT=3'
                return
            }
            window.location.href = orderInfoData.pay_wap_url + '/pay/waporder/' + order_sn + '?source=' + source
        }else {
            return toast({msg: '请刷新页面重试'})
        }
    }else if(payType == 'wxPublicNum'){
        if( is_wxApplet ){
            window.location.href = './transfer_pay.html?pay_url=' + encodeURIComponent(orderInfoData.pay_wap_url) + '&order_sn=' + order_sn + '&amount=' + $('#amountText').text() + '&payType=wxScan&sourceT=3'
            return
        }
        var formData = getFormData({
            order_sn: order_sn,
            pay_type: payType,
            source,
            openid: openid,
        })
        $.ajax({
            type: "POST",
            url:urls + '/api/client/pay/payOrder',
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            data: formData,
            success: function (resX) {
                if(resX.code !== 200){
                    toast(resX.codeMsg)
                    if(resX.code == 3001){
                        toast('订单已支付')
                        window.location.href = "./query.html?oid=" + order_sn;
                    }
                    return
                }
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener(
                            "WeixinJSBridgeReady",
                            onBridgeReady,
                            false
                        );
                    } else if (document.attachEvent) {
                        document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                        document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
                    }
                } else {
                    onBridgeReady(resX.data);
                }
                function onBridgeReady(data) {
                    // let wxData = Object.assign({
                    //     "appId": "wxafff7239b695dce5",
                    // }, data)
                    // console.log(data, "=========");
                    window.WeixinJSBridge.invoke(
                        "getBrandWCPayRequest",
                        {
                            appId: payWay_Info.wx_jsapi, //公众号名称，由商户传入
                            timeStamp: data.timeStamp + "", //时间戳，自1970年以来的秒数
                            nonceStr: data.nonceStr, //随机串
                            package: "prepay_id=" + data.package,
                            signType: data.signType, //微信签名方式：
                            paySign: data.paySign, //微信签名
                            jsApiList: ["chooseWXPay"]
                        },
                        function(res) {
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                // 使用以上方式判断前端返回,微信团队郑重提示：
                                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                            }else{ //跳转支付失败页
                                toast('支付失败')
                            }
                        }
                    );
                }
            },
            error: function () {
                toast("网络错误！")
            }
        })
    }else{
        if( is_wxApplet ){
            if(payType == 'alipayWap'){
                window.location.href = './transfer_pay.html?pay_url=' + encodeURIComponent(orderInfoData.pay_wap_url) + '&order_sn=' + order_sn + '&amount=' + $('#amountText').text() + '&payType=alipayScan&sourceT=3'
                return
            }
            if(payType == 'wxWap'){
                window.location.href = './transfer_pay.html?pay_url=' + encodeURIComponent(orderInfoData.pay_wap_url) + '&order_sn=' + order_sn + '&amount=' + $('#amountText').text() + '&payType=wxScan&sourceT=3'
                return
            }
        }
        var formData = getFormData({
            order_sn: order_sn,
            pay_type: payType,
            source,
            return_url: window.location.protocol + '//' + window.location.hostname + "/pay_result.html?oid=" + order_sn + "&price= "+$('#amountText').text()+"" + "&payType="+ payType + ""
        })
        toast({
            msg: '正在跳转支付...',
            type: 'loading'
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
                    if(/MicroMessenger/.test(window.navigator.userAgent) && payType == 'alipayWap') { // 微信浏览器且支付宝支付跳转之间页
                        _AP.pay(data.data.payUrl);
                    }else if (payType == 'kLenovoAiMiniPay'){
                        if (typeof jsbridge !== "undefined"){
                            jsbridge.requestPayment({
                                payNotify: data.data.payNotify,
                                mchNo: data.data.mchNo,
                                goodsCode: data.data.goodsCode,
                                goodsName: data.data.goodsName,
                                goodsDesc: data.data.goodsDesc,
                                payAmount: data.data.payAmount,
                                attach: data.data.attach
                            }).then(res => {
                                // 调起支付成功
                                console.log(res.data)
                            }).catch(() => {
                                // 调起支付失败
                                console.log(res.code) // 10001、10003、10004、10005、50000
                                toast('支付失败，请重试！！！')
                            })
                        }else{
                            toast('支付失败，请重试！！！')
                        }
                    }else {
                        window.location.href = data.data.payUrl
                    }
                    editUrl(data.data.pay_id)
                }else if(data.code == 3001) {
                    toast('订单已支付')
                    window.location.href = "./query.html?oid=" + order_sn;
                } else {
                    toast({
                        msg: data.codeMsg,
                        type: 'error',
                        time: 2000
                    })
                }
            },
            error: function(err) {
                toast({
                    msg: "请求失败!请检查网络",
                    type: 'error',
                    time: 2000
                })
            }
        });
    }
})

var zdyPayType = ''
// 自定义订单切换
$('.dsf-Pay').click(function() {
    var dsfData = {
        redBook: {
            name: '小红书',
            placeholder: '请填写小红书订单编号'
        },
        taobao: {
            name: '淘宝',
            placeholder: '请填写淘宝订单编号'
        }
    }
    $('.dsf-Pay .img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/noselect.png')
    $(this).children().children('.img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/select.png')
    $('.payTypeBox .img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/noselect.png')
    if($('#coupon').val()!=''){
        $('.Deduction .img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/noselect.png')
    }
    $('.partyamount').hide()
    $('.partyamount1').show()
    $('.Discountamount').hide()
    $('#typeName').text(dsfData[$(this).attr('data-type')].name)
    $('#taobao-tid').attr('placeholder' , dsfData[$(this).attr('data-type')].placeholder)
    zdyPayType = $(this).attr('data-type')
})

$('#CustomModal').on('hidden.bs.modal', function (e) {
    $("#taobao-tid").val('')
    $('#taobao-tid-1').val('')
    $('.partyamount').show()
    $('.partyamount1').hide()
    if($('#coupon').val()!=''){
        $('.Discountamount').show()
        $('.Deduction .img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/select.png')
    }
    typeSelect(payType,true)
    $('.dsf-Pay .img').attr('src','https://api.taoxiangyoushu.com/html/v1/utils/img/noselect.png')
})
// 自定义订单支付
let TbPaying = false
$(".taobao-payBtn").click(function (){
    if(TbPaying){
        return;
    }
    if(!$("#taobao-tid").val()){
        if(zdyPayType == 'redBook'){
            toast('请填写小红书订单编号')
        }
        if(zdyPayType == 'taobao'){
            toast('请填写淘宝订单编号')
        }
        return;
    }
    toast({
        msg: '正在支付...',
        type: 'loading',
        time: 20000
    })

    // 判断是否存在优惠券, 存在的话重新生成订单
    if($('.Deduction').is(':visible')) {
        // 清空优惠券
        $('.info.couponBox').show()
        $('.Deduction').hide()
        $('.eliminateCoupon').click()
        var formData = getFormData({
            order_sn: order_sn,
            goods: goods().toString()
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
                    $('#amountText').text(res.data.order_amount)
                    $('#amountText2').text(res.data.order_amount)
                    $('#original_price').text(res.data.old_amount + '元')
                    if(Number(res.data.old_amount) - Number(price_stairs) > 0 && price_stairs) {
                        $('#discount_amount').text((Number(res.data.old_amount) - Number(price_stairs) + Number(res.data.coupon_money)).toFixed(2) + '元')
                        $(".amount .discount").show()
                    }else{
                        $(".amount .discount").hide()
                    }
                    $('#dateTime').text(res.data.created)
                    $('#orderIdText').text(res.data.order_sn)
                    $('#amountText1').text(res.data.order_money)
                    payStatus(order_sn)
                    thirdParty()
                    toastNone()
                }else {
                    toastNone()
                }
            },
            error: function () {
                toastNone()
                toast({
                    msg: "请求失败!请检查网络",
                    type: 'error',
                    time: 2000
                })
            },
        });
    }else {
        thirdParty()
    }
})
function thirdParty() {
    TbPaying = true
    let formData = getFormData({
        order_sn: order_sn,
        pay_type: zdyPayType,
        source,
        tids: $("#taobao-tid").val() + ($('#taobao-tid-1').val()?(','+$('#taobao-tid-1').val()):'')
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
        success: function (data) {
            TbPaying = false
            if(data.code == 200){

            }else{
                if(data.code == 3001){
                    toast('支付成功')
                    window.location.href = "./query.html?oid=" + order_sn;
                    return
                }else{
                    toast({
                        msg: data.codeMsg,
                        type: 'error',
                        time: 3000
                    })
                }
            }
        },
        error: function (err) {
            TbPaying = false
        },
        complete: function (){

        }
    })
}
function editUrl(pay_id) {
    // 修改url参数保留数据,防止返回这个页面数据发生变化
    replaceParamVal('commitId' , order_sn , 0)
    replaceParamVal('order_amount' , $('#amountText').text() , 0)
    var goodsTo = JSON.stringify(goods())
    replaceParamVal('goods' , goodsTo||'' , 0)
    replaceParamVal('payId' , pay_id , 0)
}
function payStatus(id) { // 轮询
    $.ajax({
        type: "get",
        url: urls + '/apirs/order/is_pay?pay_id=' + id,
        xhrFields: {
            withCredentials: true
        },
        success: function (res) {
            clearTimeout(Timeout);
            if (!res.data) {
                Timeout = setTimeout(function () {
                    payStatus(id);
                }, 1000);
            }else {
                window.location.href = "./pay_result.html?oid=" + id + "&price= "+$('#amountText').text()+"" + "&payType="+ payType + "" ;
            }
        },
        error: function () {
            toast({
                msg: "请求失败!请检查网络",
                type: 'error',
                time: 2000
            })
        },
    });
}
if(payId) payStatus(payId)

var contentTypeIs = true
$(".appreciationUL").on('click','.appreciationLI',function(){
    if(!contentTypeIs) return
    toast({
        msg: '正在重新计算价格...',
        type: 'loading',
        time: 20000
    })
    $('#amountText').text('0.00')

    contentTypeIs = false
    if($(this).hasClass('selected')) {
        $(this).removeClass('selected')
    }else {
        $(this).addClass('selected')
    }
    $("#coupon").val('')
    $('.Deduction').hide()
    $('.couponBox').show()
    $('.Discountamount').hide()
    $('#coupon').val('')
    $('.use_now').removeClass('active')
    $('.eliminateCoupon').hide()
    $(".amount .discount").hide()

    var formData = getFormData({
        order_sn: order_sn,
        goods: goods().toString()
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
                $('#amountText').text(res.data.order_amount)
                $('#amountText2').text(res.data.order_amount)
                $('#original_price').text(res.data.old_amount + '元')
                if(Number(res.data.old_amount) - Number(price_stairs) > 0 && price_stairs) {
                    $('#discount_amount').text((Number(res.data.old_amount) - Number(price_stairs) + Number(res.data.coupon_money)).toFixed(2) + '元')
                    $(".amount .discount").show()
                }else{
                    $(".amount .discount").hide()
                }
                $('#dateTime').text(res.data.created)
                $('#orderIdText').text(res.data.order_sn)
                $('#amountText1').text(res.data.order_money)
                payStatus(order_sn)
                toastNone()
            }else {
                toast({
                    msg: "增值服务选择失败!",
                    type: 'error',
                    time: 2000
                })
                if($(this).hasClass('selected')) {
                    $(this).removeClass('selected')
                }else {
                    $(this).addClass('selected')
                }
            }
            contentTypeIs=true
        },
        error: function () {
            toastNone()
            toast({
                msg: "请求失败!请检查网络",
                type: 'error',
                time: 2000
            })
            contentTypeIs=true
        },
    });
});

function goods() {
    // 组装goods
    var goods = []
    for(var i = 0; i< $('.appreciationLI').length; i++) {
        if($('.appreciationLI').eq(i).hasClass('selected') && $('.appreciationLI').eq(i).is(':visible')) {
            goods.push($('.appreciationLI').eq(i).attr('goodsId-key'))
        }
    }
    return goods
}
// 修改url参数
function replaceParamVal(name, val, isRefresh) {
    var url = this.location.href.toString();
    var pattern = "[\?]" + name + '=([^&]*)';
    var pattern2 = "[&]" + name + '=([^&]*)';
    var replaceText = name + '=' + val;
    var replaceText1 = "\?" + replaceText;
    var replaceText2 = "&" + replaceText;
    if (url.match(pattern)) {
        var tmp = '/\\?(' + name + '=)([^&]*)/gi';
        var nUrl = url.replace(eval(tmp), replaceText1);;
    } else if (url.match(pattern2)) {
        var tmp = '/&(' + name + '=)([^&]*)/gi';
        var nUrl = url.replace(eval(tmp), replaceText2);;
    }
    else {
        if (url.match('[\?]')) {
            var nUrl= url + '&' + replaceText;
        } else {
            var nUrl= url + '?' + replaceText;
        }
    }
    if (isRefresh) {
        window.location.href = nUrl
    }
    var stateObject = { id: "" };
    var title = "";
    history.replaceState(stateObject, title, nUrl);
}

// TODO 默认选中增值服务
function variationOrder() {
    $('#amountText').text('0.00')
    contentTypeIs = false
    var formData = getFormData({
        order_sn: order_sn,
        goods: goods().toString(),
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
                $('#amountText').text(res.data.order_amount)
                $('#amountText2').text(res.data.order_amount)
                $('#dateTime').text(res.data.created)
                $('#orderIdText').text(res.data.order_sn)
                $('#amountText1').text(res.data.order_money)
                $('#original_price').text(res.data.old_amount + '元')
                if(Number(res.data.old_amount) - Number(price_stairs) > 0 && price_stairs) {
                    $('#discount_amount').text((Number(res.data.old_amount) - Number(price_stairs) + Number(res.data.coupon_money)).toFixed(2) + '元')
                    $(".amount .discount").show()
                }else{
                    $(".amount .discount").hide()
                }
                payStatus(order_sn)
            }
            contentTypeIs=true
            toastNone()
        },
        error: function () {
            toastNone()
            toast({
                msg: "请求失败!请检查网络",
                type: 'error',
                time: 2000
            })
            contentTypeIs=true
            toastNone()
        },
    });
}

var clipboard = new Clipboard('.btn_clone', {
    text: function () {
        return $('.linkUrl').text();
    },
});

//中转支付页
$(".btn_transferPay").on('click', function (){
    if($(".btn_transferPay").attr('data-single')){
        window.location.href = './transfer_pay.html?pay_url=' + encodeURIComponent(orderInfoData.pay_wap_url) + '&order_sn=' + order_sn + '&amount=' + $('#amountText').text() + '&payType=' + $(this).attr('data-type') + '&single=' + $(".btn_transferPay").attr('data-single')+ '&sourceT=' + source
        return
    }
    window.location.href = './transfer_pay.html?pay_url=' + encodeURIComponent(orderInfoData.pay_wap_url) + '&order_sn=' + order_sn + '&amount=' + $('#amountText').text() + '&payType=' + $(this).attr('data-type') + '&sourceT=' + source
})

//复制成功响应
clipboard.on('success', function (e) {
    toast({
        msg: "复制成功",
        type: 'success',
        time: 2000
    })
});

//复制失败响应
clipboard.on('error', function (e) {
    toast({
        msg: "复制失败!请重新尝试",
        type: 'error',
        time: 2000
    })
});

$(".mask").on('click',function (){
    $(".mask").hide();
    $(".errTipBox").hide()
    $(".coupons_pop").hide();
    $(".aigc-page").hide();
    $(".szsj-tips-block").hide();
})

$(".mask").on('click',function (){
    $(".mask").hide();
    $(".aigc-page").hide();
})

$(".aigc-page").on('click',function (){
    $(".mask").hide();
    $(".aigc-page").hide();
})

$(".y_e").on('click',function (){
    $(".mask").hide();
    $(".errTipBox").hide()
})

$(".cancel_btn").on('click',function (){
    $(".mask").hide();
    $(".coupons_pop").hide();
})

$(".determine_btn").on('click',function (){
    couponsPay()
})

let canClick = true;
//优惠券
$("#coupon").on('input',function (){
    if($(this).val().length > 0){
        $(".use_now").addClass('active')
        $(".eliminateCoupon").show()
    }else{
        $(".use_now").removeClass('active')
        $(".eliminateCoupon").hide()
    }
    $(".activityTip").hide()
})

$(".eliminateCoupon").on('click', function (){
    $("#coupon").val('')
    $("#coupon").trigger('input')
})

function couponsPay(){
    var formData2 = getFormData({
        order_sn: order_sn,
        pay_type: 'coupons',
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
        data: formData2,
        success: function(data) {
            if(data.code == 200) {
                if(/MicroMessenger/.test(window.navigator.userAgent) && payType == 'alipayWap') {
                    _AP.pay(data.data.payUrl);
                }else {
                    window.location.href = data.data.payUrl
                }
                // 修改url参数保留数据,防止返回这个页面数据发生变化
                replaceParamVal('commitId' , order_sn , 0)
                replaceParamVal('order_amount' , $('#amountText').text() , 0)
                var goodsTo = JSON.stringify(goods())
                replaceParamVal('goods' , goodsTo||'' , 0)
                replaceParamVal('payId' , data.data.pay_id , 0)
            }else if(data.code == 3001) {
                toast('订单已支付')
                window.location.href = "./query.html?oid=" + order_sn;
            } else {
                toast({
                    msg: data.codeMsg,
                    type: 'error',
                    time: 2000
                })
            }
        },
        error: function(err) {
            toast({
                msg: "请求失败!请检查网络",
                type: 'error',
                time: 2000
            })
        }
    });
}

$(".copy_pop").on('click',function (){
    var text = $(".oid_pop").text()
    $("#copyInput").val(text)
    $("#copyInput").select()
    try {
        var state = document.execCommand("copy");
    } catch (err) {
        var state = false;
    }
    if (state) {
        toast('复制成功')
    } else {
        toast({
            msg: "复制失败,请手动复制",
            type: 'error',
            time: 2000
        })
    }
})

$(".use_now").on('click',function (){
    if(!$("#coupon").val().length){
        toast({
            msg: "请输入优惠券码",
            type: 'error',
            time: 2000
        })
        return;
    }
    if(!canClick) return;
    canClick = false
    toast({
        msg: '正在兑换优惠券...',
        type: 'loading',
        time: 20000
    })

    contentTypeIs = false
    var formData = getFormData({
        order_sn: order_sn,
        goods: goods().toString(),
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
            setTimeout(function () {
                toastNone()
            }, 2000);
            toastNone()
            if (res.code == 200) {
                order_sn = res.data.order_sn
                // $('#amountText2').text(res.data.order_amount)
                // $('#amountText').text(res.data.order_amount)
                $('#dateTime').text(res.data.created)
                $('#orderIdText').text(res.data.order_sn)
                $(".oid_pop").text(res.data.order_sn)
                $('#original_price').text(res.data.old_amount + '元')
                if(Number(res.data.old_amount) - Number(price_stairs) > 0 && price_stairs) {
                    $('#discount_amount').text((Number(res.data.old_amount) - Number(price_stairs) + Number(res.data.coupon_money)).toFixed(2) + '元')
                    $(".amount .discount").show()
                }else{
                    $(".amount .discount").hide()
                }
                payStatus(order_sn)
                if(Number(res.data.order_amount) == 0) {
                    $(".mask").show();
                    $(".coupons_pop").show()
                }else{
                    if(res.data.coupon_money>0){
                        $('.couponBox').hide()
                        $('.Deduction').show()
                        $('.Discountamount').show()
                        $('#Discount_amount').text(res.data.coupon_money)
                        $('#After_discounts').text(res.data.coupon_money)
                    }
                    $('#amountText2').text(res.data.order_amount)
                    $('#amountText').text(res.data.order_amount)
                }
            }else{
                $(".errTip_p").text(res.codeMsg)
                $(".errTipBox").show();
                $(".mask").show();
            }
            contentTypeIs=true
            canClick = true
        },
        error: function () {
            toastNone()
            toast({
                msg: "请求失败!请检查网络",
                type: 'error',
                time: 2000
            })
            contentTypeIs=true
            canClick = true
        },
    })
})

$('.Deduction').on('click',function(){
    $('.Deduction').hide()
    $('.couponBox').show()
    $('.Discountamount').hide()
    $('#coupon').val('')
    $('.use_now').removeClass('active')
    $('.eliminateCoupon').hide()

    var formData = getFormData({
        order_sn: order_sn,
        goods: goods().toString(),
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
            if (res.code == 200) {
                order_sn = res.data.order_sn
                $('#amountText').text(res.data.order_amount)
                $('#dateTime').text(res.data.created)
                $('#orderIdText').text(res.data.order_sn)
                $('#amountText1').text(res.data.order_money)
                $(".oid_pop").text(res.data.order_sn)
                $('#original_price').text(res.data.old_amount + '元')
                if(Number(res.data.old_amount) - Number(price_stairs) > 0 && price_stairs) {
                    $('#discount_amount').text((Number(res.data.old_amount) - Number(price_stairs) + Number(res.data.coupon_money)).toFixed(2) + '元')
                    $(".amount .discount").show()
                }else{
                    $(".amount .discount").hide()
                }
                payStatus(order_sn)
            }else{
                $(".errTip_p").text(res.codeMsg)
                $(".errTipBox").show();
                $(".mask").show();
            }
            contentTypeIs=true
            canClick = true
        },
        error: function () {
            toastNone()
            toast({
                msg: "请求失败!请检查网络",
                type: 'error',
                time: 2000
            })
            contentTypeIs=true
            canClick = true
        },
    })
})

$(".zjc-wh").on('click', function (e){
    $(".aigc-page").show()
    $(".aigc-page").css('display','flex')
    $(".mask").show()
    e.stopPropagation();
})

$(".szsj_notice").click(function (e){
    $(".mask").show()
    $(".szsj-tips-block").show()
    e.stopPropagation();
})

$(".closeTips").click(function (){
    $(".mask").hide()
    $(".szsj-tips-block").hide()
})
