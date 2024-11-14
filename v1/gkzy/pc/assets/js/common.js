$(window).scroll(function() {
	scrollTop($(this))
});
function scrollTop(this_) {
	if(this_.scrollTop() > 30) { 
        $('.navbarBox').addClass('scrollCS')
    }else {
        $('.navbarBox').removeClass('scrollCS')
	}

    if(this_.scrollTop() > 500) {
        if(!$('.FloatingWindow').attr('isShow')) {
            $('.FloatingWindow').show()
        }
    }else{
        $('.FloatingWindow').hide()
    }
    if(this_.scrollTop()>=7095) {
        $('.FloatingWindow').addClass('FloatingWindow2')
    }else {
        $('.FloatingWindow').removeClass('FloatingWindow2')
    }


    if(this_.scrollTop() > 600) {
        $('.fiexBox').show()
    }else {
        $('.fiexBox').hide()
    } 
}
scrollTop($(window));
function navBox() {
	//右侧悬浮栏位置
	if ($(window).width() > 1360) {
		if ($(".asRegardS")[0]) {
			$(".fiexBox").css("right", "");
			$(".fiexBox").css(
				"left",
				$(".asRegardS").offset().left + 1200 + 40
			);
		} else if ($("#content")[0]) {
			$(".fiexBox").css("right", "");
			$(".fiexBox").css("left", $("#content").offset().left + 1200 + 40);
		} else {
			$(".fiexBox").css("right", 20);
		}
	} else {
		$(".fiexBox").css("left", "");
		$(".fiexBox").css("right", 20);
	}
	$(".fiexBox").css("display", "block");
}


var urls = 'https://api.taoxiangyoushu.com'
// var urls = 'http://api.project_libraries.report'


function getFormData (object) { // 转FromData 对象
    const formData = new FormData()
    Object.keys(object).forEach(key => {
        const value = object[key]
        if (Array.isArray(value)) {
            value.forEach((subValue, i) =>
                formData.append(key + `[${i}]`, subValue)
            )
        } else {
            formData.append(key, object[key])
        }
    })
    return formData
}

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

var time = 60
var permit = true // 是否允许请求
var timeout = null;
$('.VerificationCode').click(function() {
    if(!permit) return
    const regex = /^1[3456789]\d{9}$/;
    var phone = $('.'+$(this).attr('data-key')).val()
    var formData ={}
    if(regex.test(phone)) {
        formData =  getFormData({
            phone: phone,
            scenes_id: $(this).attr('data'),
            _session_type: 'user'
        })
        $('.VerificationCode').addClass('forbid')
        $('.VerificationCode').html('剩余<span></span>')
        time = 60
        counDown()
        $.ajax({
            type : 'post',
            url : urls+"/api/verify_code/get_phone_validate?_session_type=user",
            processData : false,
            contentType : false,
            xhrFields: {
                        withCredentials: true
                    },
            data : formData,
            success : function(result) {
                if(result.code == 200) {
                    cocoMessage.success('已发送到指定手机号,请注意查收',2000);
                    window.localStorage.setItem('phone' , phone)
                }else if(result.code == -1) {
                    cocoMessage.error(result.codeMsg, 2000);
                }else {
                    cocoMessage.error('获取失败', 2000);
                }
            },
        });
    }else {
        cocoMessage.error('请输入正确的手机号', 2000);
        return
    }
})

function counDown() {
    permit = false
    if (time === 0) {
        time = 60;
        $('.VerificationCode').html('发送验证码')
        $('.VerificationCode').removeClass('forbid')
        permit = true
        clearTimeout(setTime)
        return;
    } else {
        time--;
        $('.VerificationCode>span').text(time+'S');
    }
    timeout = setTimeout(function() {
        counDown();
    },1000);
}

$('.closecc').click(function() {
    $('.FloatingWindow').hide()
    $('.FloatingWindow').attr('isShow','true')
})

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

var isclick = false
var parameterSet = {}
var threeMsg = {}
var payWayInfo= {}
window.onload = function (){
    $.ajax({
        type: 'post',
        url: urls + "/api/project/info?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME +(suffix?'&'+suffix:''),
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
                //绑定微信需要 确保代理是否绑定微信
                if($('.report-block').length){
                    startQuerying()
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
            }else{
                cocoMessage.error(result.codeMsg, 2000);
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
	window.onresize = function () {
		navBox();
	};
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
