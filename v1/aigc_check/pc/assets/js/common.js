$('.commonProblem , .MustRead').click(function() {
    $('.commonProblem , .MustRead').removeClass('Select');
    $('.commonProblemBox , .MustReadBox').removeClass('Select');
    $(this).addClass('Select')
    $('.'+$(this).attr('ContentKey')).addClass('Select')
})


// 封装url参数获取
function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return decodeURI(pair[1]);}
    }
    return(false);
}

let act_code = ''
if(getQueryVariable('ac')){
    act_code = getQueryVariable('ac')
    window.localStorage.setItem('act_code',getQueryVariable('ac'))
}else{
    if(window.localStorage.getItem('act_code')){
        act_code = window.localStorage.getItem('act_code')
    }
}
let suffix = ''
if(act_code){
    suffix = 'act_code='+ act_code +'&_session_type=user'
}

let dct_code = ''
if(getQueryVariable('dc')) {
	dct_code = getQueryVariable('dc')
	window.localStorage.setItem('dct_code',getQueryVariable('dc'))
}else{
	if(window.localStorage.getItem('dct_code')){
		dct_code = window.localStorage.getItem('dct_code')
	}
}
let suffix2 = ''
if(dct_code){
	suffix2 = 'dct_code='+ dct_code
}

var urls = LOGIN_API_URL //http://api.project_libraries.report

function getFormData(object) {
    // 转FromData 对象
    var formData = new FormData();
    Object.keys(object).forEach(function (key) {
        var value = object[key];
        if (Array.isArray(value)) {
            value.forEach(function (subValue, i) {
                formData.append(key + "[" + i + "]", subValue);
            });
        } else {
            formData.append(key, object[key]);
        }
    });
    return formData;
}

var selling_price = ''
var isclick = false
var parameterSet = {}
var threeMsg = {}
var payWayInfo= {}
var memberFu = {}

window.onload = function (){
    $.ajax({
        type: 'post',
        url: urls + "/api/project/info?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME +(suffix?'&'+suffix:'') + (suffix2?'&'+suffix2:''),
        xhrFields: {
            withCredentials: true
        },
        success: function success(result) {
            if(result.code == '200') {
                var data = result.data
                var seller_info = data.seller_info
                threeMsg = data.project[0].threeMsg
                $(".customerBox .customer-title").text(seller_info.kf_title || '联系客服')
                $(".customerBox .customer-qr").attr('src', seller_info.kf_qr || '')
                $('.customerBox .qqText .s1').text(seller_info.qq || '')
                $('.customerBox .telephone .s1').text(seller_info.phone || '')
                $('.customerBox .mailbox .s1').text(seller_info.email || '')
                $('.customerBox .wxText .s1').text(seller_info.wx || '')
                if(seller_info.qq) $('.customerBox  .qqText').show();
                if(seller_info.phone) $('.customerBox  .telephone').show();
                if(seller_info.email) $('.customerBox  .mailbox').show();
                if(seller_info.wx) $('.customerBox  .wxText').show();
                if(seller_info.kf_qr){
                    $(".customerBox .customerCode").show()
                }else{
                    $(".customerBox .customerCode").hide()
                }
                if(seller_info.qq || seller_info.phone || seller_info.email || seller_info.wx){
                    $(".customerBox .customerWay").show()
                }else{
                    $(".customerBox .customerWay").hide()
                }
                if(seller_info.kf_qr && (seller_info.qq || seller_info.phone || seller_info.email || seller_info.wx)){
                    $(".customerBox .segmentation-line").show()
                }else{
                    $(".customerBox .segmentation-line").hide()
                }
                if(!seller_info.qq && !seller_info.phone && !seller_info.email && !seller_info.wx && !seller_info.kf_qr){
                    $(".noCustomer").show()
                }else{
                    $(".noCustomer").hide()
                }

                // 重组数据
                typefun(data.project[0].goods_info)
                setArguments(data.project[0].goods_info)
                isclick = true

                if($(".submit-form").length > 0){
                    setPriceInfo(data.project[0].goods_info[0])
                }

                if($(".expiration-tips").length > 0){
                    setPriceTips(data.project[0].goods_info[0])
                }

                if($(".payBox").length > 0){
                    tacitPay(data.project[0].goods_info[0], data.project[0].pay_way, data.pay_config)
                }
                payWayInfo = data.project[0].pay_way


				// 功能测试,权限限制
                memberFu = new member ({
                    ele	 : '#memberCarrier', // 插入节点
                    urls : LOGIN_API_URL, // 接口域名
                    whether: data.project[0].link_config, // 网站配置信息
					USER_TOKEN: USER_TOKEN,
					JANE_NAME: JANE_NAME,
                    success_info: function(e){ // 获取用户成功回调
                        if($('#App').data('key') == 'queryApp') {
                            if(!getQueryVariable('oid')){
                                query(e)
                            }
                        }
						if(e.is_distributor	&& e.is_bind_phone) {
							$('#distribution').attr('href' , './fx/index.html')
						}
                        if((e.username)&&($("#App").data("key") == "payApp")){
                            $(".topNav").css("padding-right", "98px");
                        }
                    },
                    complete_info: function(e) { // 获取用户执行完回调
                        if($('#App').data('key') == 'queryApp') {
                            startQuerying()
                        }
                    },
                    exitLogin: function(e){ // 退出回调
						$('#distribution').attr('href' , './fx/init.html')
                    }
                });
                if(data.domain_config && data.domain_config.distribution_status) {
					$('.distributionEntrance').show()
				}
                if(data.project[0].act_list.length > 0) {
                    $('.nav-activity').show()
                    if($('.welfare-entrance')[0]){
                        $('.welfare-entrance').css('display', 'inline-block')
                    }
                }
            }else{
                cocoMessage.error(result.codeMsg, 2000);
            }

             // is_must_login_enable , is_must_phone_login_enable 一项为true, 出现登录按钮
             if (data.project[0].link_config.is_must_login_enable ||data.project[0].link_config.is_must_phone_login_enable) {
               if ( $("#App").data("key") == "payApp" &&!$(".hasLogin").is(":visible")&&!$('.loginButton').is(":visible")) {
                 $(".topNav").css("padding-right", "0");
               } 
               else {
                 $(".topNav").css("padding-right", "98px");
               }
             }

            // pay的二维码需要后端支付类型,
            // 本意是在index存储后, pay判断是否存在数据,
            // 存在数据就可以减少二维码的刷新时间, 不必等待info的接口完成后刷新二维码
            // 但sessionStorage在iframe会发生找不到的情况报错

            // if(!(sessionStorage.getItem("pay_way")) && $('#payHtml').length) {
            // payWay(data.project[0].pay_way)
            // }
            // sessionStorage.setItem("pay_way", JSON.stringify(data.project[0].pay_way));
        }
    });
}

var typeData = []
function typefun(goods_info) {
    for(var i=0; i<goods_info.length; i++) {
        typeData.push(goods_info[i])
    }
}
function setArguments(info) {
    for (var i=0;i<info.length; i++){
        parameterSet[info[i].short_name] = info[i].goods_config
    }
}

$(function (){
    window.setHeight = function (){

    }
    setHeight()
    window.onresize = function (){
        window.setHeight()
    }
})


