
var urls = 'https://api.taoxiangyoushu.com'//  https://api.taoxiangyoushu.com
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
var memberFu=''
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
				
				threeMsg = data.project[0].threeMsg
				if(data.domain_config && data.domain_config.distribution_status) {
					$('.recruit_block').show()
				}
				memberFu = new member ({
					ele	 : '#memberCarrier', // 插入节点
					urls : urls, // 接口域名
					whether: data.project[0].link_config, // 网站配置信息
					USER_TOKEN: USER_TOKEN,
					JANE_NAME: JANE_NAME,
					binding: true,
					is_activity: true,
					success_info: function(e){ // 获取用户成功回调
						if(success_info) success_info(e)
					},
					complete_info: function(e , code) { // 获取用户执行完回调
						if(complete_info) complete_info(e , code)
					},
					bindingSuccessful: function(e) { // 手机号绑定成功回调
						if(distributionJoin_spread) distributionJoin_spread()
					},
					exitLogin: function(e) {
						location.href = './index.html'
					}
				});
				infoSuccess(data)
			}else{
				cocoMessage.error(result.codeMsg, 2000);
			}
		}
	});
}
function verification(this_) {
	val = this_.val()
	this_.val(val.replace(/[^\d.]/g,''))
	// 输入两位数的时候判断第一位是0就只取第二位如01变1
	if(val.length == 1 && this_.val() == 0) {
		this_.val(1)
	}
	if(val.length == 2 && val.substr(0, 1) == 0 && val.substr(1, 1)!='.') {
		this_.val(val.substr(1, 1))
	}
	let index = val.indexOf('.')
	if(index==-1) {
		// 如果小数点不存在允许输入6位
		if(val.length>6) {
			this_.val(val.substr(0, 6))
		}
	}else { // 如果小数点存在允许输入9位,且小数点后输入两位禁止
		if(val.length>9 || val.length>index+3){
			this_.val(val.substr(0, val.length-1))
		}
	}
	// 判断当前输入为小数点
	if(val.substr(val.length-1, val.length) == '.') {
		// 判断之前就存在小数点,就删除最后一位,保持只有一个小数点
		if(val.substr(0, val.length-1).indexOf('.') !=-1) {
			this_.val(val.substr(0, val.length-1))
		}
		// 如果第一位是小数点就替换成0.
		if(val.length == 1) {
			this_.val('1')
		}
	}
}