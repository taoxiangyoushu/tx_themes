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

    if(this_.scrollTop()>=5400) {
        $('.FloatingWindow').addClass('FloatingWindow2')
    }else {
        $('.FloatingWindow').removeClass('FloatingWindow2')
    }
    if(this_.scrollTop() > 600) {
        $('.fiexBox').show()
		$('.Bottombuy').show()
    }else {
        $('.fiexBox').hide()
		$('.Bottombuy').hide()
    }


}
scrollTop($(window));
var urls = 'https://api.taoxiangyoushu.com'
// var urls = 'http://api.project_libraries.report'


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


$('.closecc').click(function() {
    $('.FloatingWindow').hide()
    $('.FloatingWindow').attr('isShow','true')
})

// var clipboard = new Clipboard('.copynum', {
// 	text: function(trigger) {
// 		$(".mask").hide();
// 		$(".dashi_wx_box").hide();
// 		toast("复制成功！在微信中点右上角“添加朋友”后粘贴，即将前往微信。");
// 		// window.location.href = "weixin://";
// 		return trigger.getAttribute('data-clipboard-text');
// 	}
// });

$(".close-wx").on('click',function (){
	$(".mask").hide();
	$(".dashi_wx_box").hide();
})

$(".customer-wx").on('click',function (){
	$(".mask").show();
	$(".dashi_wx_box").show();
})
$(".mask").on('click',function (){
	$(".mask").hide();
	$(".dashi_wx_box").hide();
	$(".myProblems").hide()
	$(".dashi_fz").hide();
	$(".complainForm").hide();
	document.body.style.height = 'unset'
	document.body.style['overflow-y'] = 'auto'
})

$(".close-Pr").on('click',function (){
	$(".mask").hide();
	$(".myProblems").hide()
	document.body.style.height = 'unset'
	document.body.style['overflow-y'] = 'auto'
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

// var goods_id = ''
var selling_price = ''
var payWay_Info = {}
var parameterSet = {}
var threeMsg= {}
var pay_config = {}

window.onload = function (){
	$.ajax({
		type: 'post',
		url: urls + "/api/project/info?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME + (suffix?'&'+suffix:''),
		xhrFields: {
			withCredentials: true
		},
		success: function success(result) {
			if(result.code == '200'){
				var data = result.data

				var seller_info = data.seller_info
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

				payWay_Info = data.project[0].pay_way
				threeMsg = data.project[0].threeMsg
				pay_config = data.pay_config

				typefun(data.project[0].goods_info)
				setArguments(data.project[0].goods_info)

				if($(".toabaoID").length && data.project[0].pay_way.taobao) {
					$(".toabaoID").show()
				}

				// if($(".orderIdTips").length) {
				// 	showOrder(data.project[0].pay_way)
				// }

				if($(".resultBox").length) {
					startQuerying()
				}

				if($('.index_app').length) {
					// dropDownType(result.data.project[0] && result.data.project[0].goods_info)
					setPriceInfo(data.project[0].goods_info[0])
				}
				if($('.payApp').length) {
					payWay(data.project[0].goods_info , data.project[0].pay_way )
				}
			}else{
				toast(result.codeMsg)
			}
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
