// var urls = 'http://tw.papergenerate.tw.local'
// var urls = window.location.origin
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

var clipboard = new Clipboard('.copynum', {
	text: function(trigger) {
		$(".mask-fixed").hide();
		$(".dashi_wx_box").hide();
		toast("复制成功！在微信中点右上角“添加朋友”后粘贴，即将前往微信。");
		// window.location.href = "weixin://";
		return trigger.getAttribute('data-clipboard-text');
	}
});

$(".close-wx").on('click',function (){
	$(".mask-fixed").hide();
	$(".dashi_wx_box").hide();
})

$(".customer-wx").on('click',function (){
	$(".mask-fixed").show();
	$(".dashi_wx_box").show();
})

$(".mask-fixed").on('click',function (){
	$(".mask-fixed").hide();
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

var urls = LOGIN_API_URL //https://api.taoxiangyoushu.com
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
		url: urls + "/api/project/info?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME + (suffix?'&'+suffix:'') + (suffix2?'&'+suffix2:''),
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

				if($(".home").length) {
					setPriceInfo()
				}

				if($(".resultBox").length) {
					startQuerying()
				}

				if($('.index_app').length) {
					// dropDownType(result.data.project[0] && result.data.project[0].goods_info)
				}
				if($('.payApp').length) {
					payWay(data.project[0].goods_info , data.project[0].pay_way )
				}
				
				if(data.domain_config && data.domain_config.distribution_status) {
					$('.distributionEntrance').show()
				}

				if(data.project[0].act_list.length > 0) {
					if(data.domain_config && data.domain_config.distribution_status){
						$(".activity_block").css('top', 'calc(70% - 10.8rem)')
					}else{
						$(".activity_block").css('top', 'calc(70% - 5.4rem)')
					}
					$('.activityEntrance').show()
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

function editionType(edition) {
	if(edition == "Normal") {
		$('#App').removeClass('ProfessionalEdition')
		$('#App').removeClass('zjcaigc')
		$('#generate').text('立即生成')
		$('.Universal').show()
		$('.aigcTips').hide()
	}else if(edition == "zjcaigc") {
		$('#App').removeClass('ProfessionalEdition')
		$('#App').addClass('zjcaigc')
		$('#generate').text('开始降AIGC率')
		$('.Universal').hide()
		$('.aigcTips').show()
	}
}
