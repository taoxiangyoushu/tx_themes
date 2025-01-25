// var urls = 'http://tw.papergenerate.tw.local'
// var urls = window.location.origin
var SPECIALITY = [
    '汉语国际教育',
    '工程造价',
    '建筑工程技术',
    '环境艺术设计',
    '艺术设计',
    '护理',
    '公共事业管理',
    '工商企业管理',
    '汽车检测与维修技术',
    '汽车技术服务与营销',
    '计算机网络技术',
    '影视多媒体技术',
    '软件技术',
    '高速铁路客运服务',
    '现代物流管理',
    '物联网应用技术',
    '无人机应用技术',
    '大数据与会计',
    '公共文化服务与管理',
    '烹饪工艺与营养',
    '市场营销',
    '学前教育',
    '会计信息管理',
    '大数据与财务管理',
    '体育运营与管理',
    '酒店管理',
    '计算机应用技术',
    '移动互联应用技术',
    '城市轨道交通运营管理',
    '电子商务',
    '汽车制造与试验技术',
    '新能源汽车技术',
    '旅游管理',
    '经济',
    '教育',
    '文学',
    '医药',
    '法律',
    '计算机科学',
    '建筑科学',
    '工业技术',
	'其他（自动识别）'
];
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
		$(".mask").hide();
		$(".dashi_wx_box").hide();
		toast("复制成功！在微信中点右上角“添加朋友”后粘贴，即将前往微信。");
		// window.location.href = "weixin://";
		return trigger.getAttribute('data-clipboard-text');
	}
});

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

var urls = 'https://api.taoxiangyoushu.com'//http://api.project_libraries.report

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
var keyConversion = {
	bylw: 'bylw',
	wxzs: 'wxzs',
	ktbg: 'ktbg',
	rws : 'rws',
	qklw: 'qklw',
	sjbg: 'sxbg',
	dbppt: 'lwdbppt',
	kclw: 'kclw',
	dybg: 'dybg',
	aigccc: 'xzaigccheck',
	jaigcl: 'zjcaigc'
}

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
					dropDownType(result.data.project[0] && result.data.project[0].goods_info, data.project[0])
				}
				if($('.payApp').length) {
					payWay(data.project[0].goods_info , data.project[0].pay_way )
				}
				
				if(data.domain_config && data.domain_config.distribution_status) {
					if(data.project[0].act_list.length > 0) {
						if($('.index_app').length) {
							$(".extension").css('top', 'calc(75% - 5.4rem)')
							$(".customer-wx").css({'top':'75%','box-shadow':'none'})
							$(".fixed-problem").css({'top':'75%','box-shadow':'none'})
							$(".more-Fbtn-s").show()
						}
					}else{

					}
					$('.distributionEntrance').show()
				}

				if(data.project[0].act_list.length > 0) {
					if(data.domain_config && data.domain_config.distribution_status){
						if($('.index_app').length) {
							$(".activity_block").css('top', 'calc(75% - 10.8rem)')
							$(".customer-wx").css({'top':'75%','box-shadow':'none'})
							$(".fixed-problem").css({'top':'75%','box-shadow':'none'})
							$(".more-Fbtn-s").show()
						}
					}else{
						$(".activity_block").css('top', 'calc(75% - 10.8rem)')
					}
					$('.activityEntrance').show()
				}

				$(".customer-wx").css({'display':'block'})
				$(".fixed-problem").css({'display':'block'})
				var sw = keyConversion[getQueryVariable('short_name') || getQueryVariable('sw')]
				if(sw) defaultType(sw) // 默认选中版本
			}else{
				toast(result.codeMsg)
			}
		}
	});
}

var typeData = {}
var short_name_data = {}
var WordCount_data = {
	bylw: [5000 , 10000 , 30000 , 50000],
	qklw: [3000 , 8000 , 10000 , 20000],
	bylwsenior: [5000 , 10000 , 30000 , 50000],
	sxbg: [1000 , 3000 , 5000 , 10000]
}
var Radius_data = {
	bylw: [5000 , 50000],
	qklw: [3000 , 20000],
	bylwsenior: [5000 , 50000],
	sxbg: [1000 , 30000]
}
function typefun(goods_info) {
	for(var i=0; i<goods_info.length; i++) {
		typeData[goods_info[i].goods_id] = {
			WordCount: WordCount_data[goods_info[i].short_name] || [],
			Radius: Radius_data[goods_info[i].short_name] || [],
			short_name: goods_info[i].short_name,
			increment_goods_list: goods_info[i].increment_goods_list,
			increment_goods_infos: goods_info[i].increment_goods_infos,
			selling_price: goods_info[i].selling_price,
			unit_type: goods_info[i].unit_type,
			unit_count: goods_info[i].unit_count,
			name: goods_info[i].name
		}
		short_name_data[goods_info[i].short_name] = {
			goods_id: goods_info[i].goods_id
		}
	}
}

function setArguments(info) {
	for (var i=0;i<info.length; i++){
		parameterSet[info[i].short_name] = info[i].goods_config
	}
}

function editionType(edition) {
	// 注意bylw
	$('#App').removeClass('bylw bylwsenior wxzs ktbg rws qklw kclw dybg zjcaigc sxbg lwdbppt xzaigccheck')
	if(edition == "Normal") {
		$('#App').removeClass('ProfessionalEdition')
		$('#App').removeClass('zjcaigc')
		$('#generate').text('立即生成')
		$('.Universal').show()
		$('.aigcTips').hide()
		$('#App').addClass('bylw')
	}else {
		if(edition == 'xzaigccheck') {
			$('.Universal').hide()
			$('#generate').text('提交检测')
			$('.aigcTips').show()
		}else if(edition == "zjcaigc"){
			$('#generate').text('开始降AIGC率')
			$('.Universal').hide()
			$('.aigcTips').show()
		}else {
			$('#generate').text('立即生成')
			$('.Universal').show()
			$('.aigcTips').hide()
		}
		$('#App').removeClass('ProfessionalEdition')
		$('#App').addClass(edition)
	}
}

// 英文参考文献判断
function LiteratureFU() {
	var LiteratureType = $('.EnglishReference-check').is(':checked');
	if(LiteratureType && !$('#NumberEnglishReference').val()) {
		toast('请输入自定义文献篇数')
		return false
	}else {
		return true
	}
}



$('.Image_enlargement').click(function(){
	$('.overlay').show()
	$('.Image_enlargement_content').show()
	var zoomedImage = document.getElementById('zoomedImage');
    zoomedImage.src = this.src;
})
$('.overlay').click(function(){
	$('.overlay').hide()
	$('.Image_enlargement_content').hide()
	$('.Image_enlargement_content1').hide()

})
$(".Image_enlargement_content").click(function(){
	$('.overlay').hide()
	$('.Image_enlargement_content').hide()
})

$(".Image_enlargement_content1").click(function(){
	$('.overlay').hide()
	$('.Image_enlargement_content1').hide()
})
$('.Image_enlargement1').click(function(){
	$('.overlay').show()
	$('.Image_enlargement_content1').show()
	var zoomedImage1 = document.getElementById('zoomedImage1');
    zoomedImage1.src = this.src;
})


$('#myLink').click(function(e){
	e.preventDefault(); // 阻止默认行为
	var url = $(this).data('url'); // 获取data-url属性值
	var param = $(this).data('param'); // 获取data-param属性值
	
	// 构建带参数的URL
	var fullUrl = url + '?type=' + encodeURIComponent(param);
	
	// 在新窗口中打开URL
	window.open(fullUrl, '_blank');
});

// 默认选择版本
function defaultType(type) {
	if(type && $('.index_app').length && short_name_data[type]) {
		setTimeout(function() {
			$("#type_s").val(short_name_data[type].goods_id)
			$("#type_s").selectpicker('refresh');
			editionType(type , false)
			changeType($('#type_s'))
		}, 0)
	}
}