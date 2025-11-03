// var urls = window.location.origin
// var urls = 'http://tw.papergenerate.tw.local'
var sex = [
	"交互式",
	"山东省",
	"湖南省",
	"地下停",
	"B2B",
	"浅谈上",
	"小学卫",
	"浅析中",
	"三角形",
	"时间额",
	"新技术",
	"倾向于",
	"校内外",
	"虚拟网",
	"虚拟机",
	"前端开",
	"单片机",
	"信息化",
	"机电一",
	"磨床的",
	"公路建",
	"桥梁基",
	"广东省",
	"沥青与",
	"显示器",
	"谈胰腺",
	"H农业",
	"制造业",
	"工业与",
	"污水治",
	"市场影",
	"发电机",
	"风力发",
	"顺丰冷",
	"混泥土",
	"刷式密",
	"抗生素",
	"天津城",
	"共享单",
	"A公司",
	"生态环",
	"高管团",
	"交通银",
	"给排水",
	"北京市",
	"基于随",
	"一罪与",
	"醉酒驾",
	"与非编",
	"简述韩",
	"数字化",
	"土壤肝",
	"针灸､推",
	"虚拟电",
	"契约受",
	"家用热",
	"充分利",
	"地铁盾",
	"宜昌市",
	"越橘杂",
	"红参提",
	"长岭县",
	"美食实",
	"区角活"
]
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

var urls = LOGIN_API_URL //  'http://api.project_libraries.report'

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
var scanCodeRichInfo = {}
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
	jaigcl: 'zjcaigc',
    zrb: 'bylw_zrb',
    scirs: 'scirs'
}

window.onload = function (){
	// v2版本可以走缓存
	// if(window.sessionStorage.getItem('infoData') && $('.indexAppv2').length) {
	// 	infoData(JSON.parse(window.sessionStorage.getItem('infoData')))
	// }
	$.ajax({
		type: 'post',
		url: urls + "/api/project/info?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME +(suffix?'&'+suffix:'') + (suffix2?'&'+suffix2:''),
		xhrFields: {
			withCredentials: true
		},
		success: function success(result) {
			if(result.code == '200') {
				infoData(result)
				window.sessionStorage.setItem('infoData' , JSON.stringify(result))
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
}
function infoData(result) {
	var data= result.data
	// var info = data.project[0].goods_info[0]
	// selling_price = info.selling_price

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
	scanCodeRichInfo = data.pay_config
	// $('#price').text('￥' + selling_price + '/千字')
	// 重组数据
	typefun(data.project[0].goods_info)
	setArguments(data.project[0].goods_info)
	isclick = true
	// if($('.pointOut').length) {
	// 	showOrder(data.project[0].pay_way)
	// }

	if($('#payHtml').length) {
		payWay(data.project[0].pay_way , data.project[0].goods_info, data.pay_config)
	}
	if($('.indexApp').length) {
		dropDownType(result.data.project[0] && result.data.project[0].goods_info , result.data.project[0])
	}
	payWayInfo = data.project[0].pay_way

	memberFu = new member ({
		ele	 : '#memberCarrier', // 插入节点
		urls : LOGIN_API_URL, // 接口域名
		whether: data.project[0].link_config, // 网站配置信息
		USER_TOKEN: USER_TOKEN,
		JANE_NAME: JANE_NAME,
		success_info: function(e){ // 获取用户成功回调
			if($('.queryApp').length) {
				if(!getQueryVariable('oid')){
					query(e)
				}
			}
			if(e.is_distributor	&& e.is_bind_phone) {
				$('#distribution').attr('href' , './fx/index.html')
			}
		},
		complete_info: function(e) { // 获取用户执行完回调
			if($('.queryApp').length) {
				startQuerying()
			}
		},
		exitLogin: function(e) {
			$('#distribution').attr('href' , './fx/init.html')
		}
	});
	if (typeof jsbridge !== "undefined"){
		window.jsbridge && (null == window ? void 0 : null === (e = window.jsbridge) || void 0 === e ? void 0 : e.getLaunchOptions) && window.jsbridge.getLaunchOptions().then(e=>{
			let t = e.query.data;
			if (t) {
				var query_short_name = (JSON.parse(t)).short_name || false;
				defaultType(query_short_name) // 默认选中版本
			}
		})
	}else{
		var sw = keyConversion[getQueryVariable('short_name') || getQueryVariable('sw')]
		if(sw) defaultType(sw) // 默认选中版本
	}

	if(data.domain_config && data.domain_config.distribution_status) {
		$('.distributionEntrance').show()
	}

	if(data.project[0].act_list.length > 0) {
		$('.nav-activity').show()
		if($('.welfare-entrance')[0]){
			$('.welfare-entrance').css('display', 'inline-block')
		}
	}
	if(data.project[0].link_config){
		$('.nav-activity').css('position', 'absolute')
		$('.nav-activity').css('right', '122px')
	}
}

var typeData = {}
var short_name_data = {}
var WordCount_data = {
	bylw: [5000 , 10000  , 50000 , 100000],
	bylw_zrb: [5000 , 10000  , 50000 , 100000],
	qklw: [3000 , 8000 , 10000 , 20000],
	bylwsenior: [5000 , 10000  , 50000 ,100000],
	bylwsenior_zrb: [5000 , 10000  , 50000 ,100000],
	sxbg: [1000 , 3000 , 5000 , 10000],
	qklwsenior: [3000 , 8000 , 10000 , 20000],
}
var Radius_data = {
	bylw: [5000 , 100000],
	bylw_zrb: [5000 , 100000],
	qklw: [3000 , 20000],
	bylwsenior: [5000 , 100000],
	bylwsenior_zrb: [5000 , 100000],
	sxbg: [1000 , 30000],
	qklwsenior: [3000 , 20000],
}

var targetShortNames = [];
var shortName=[]
var shortName1=[]
var shortName2=[]
var shortName3=[]

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
			name: goods_info[i].name,
			type: goods_info[i].type,
			calc_price_type:goods_info[i].calc_price_type,
			selling_price_list:goods_info[i].selling_price_list
		}
		short_name_data[goods_info[i].short_name] = {
			goods_id: goods_info[i].goods_id
		}

		if(goods_info[i].type=='毕业论文'){
			shortName.push(goods_info[i].short_name)
		}
		if(goods_info[i].type=='期刊论文'){
			shortName1.push(goods_info[i].short_name);

		}
		if(goods_info[i].type=='开题报告'){
			shortName2.push(goods_info[i].short_name)
		}
        if(goods_info[i].type=='专升本'){
            shortName3.push(goods_info[i].short_name)
        }
	}
	if (shortName.includes('bylw') && shortName.includes('bylwsenior')) {
		targetShortNames.push('bylw');
		targetShortNames.push('bylwsenior');
	}
	if (shortName3.includes('bylwsenior_zrb') && shortName3.includes("bylw_zrb")) {
		targetShortNames.push('bylwsenior_zrb');
		targetShortNames.push('bylw_zrb');
	}
	if (shortName1.includes('qklw') && shortName1.includes('qklwsenior')) {
		targetShortNames.push('qklw');
		targetShortNames.push('qklwsenior');
	}
	if (shortName2.includes('ktbgsenior') && shortName2.includes('ktbg')) {
		targetShortNames.push('ktbgsenior');
		targetShortNames.push('ktbg');
	}
}
function setArguments(info) {
	for (var i=0;i<info.length; i++){
		parameterSet[info[i].short_name] = info[i].goods_config
	}
}

$(function (){
	window.setHeight = function (){
		$(".boxLeft").css('height', 'auto')
		$(".rightCont").css('height', 'auto')
		if($('.boxLeft').outerHeight() > $(".rightCont").outerHeight()){
			$(".rightCont").css('height', $('.boxLeft').outerHeight())
			$(".foot").show()
		}

		if($(window).width() > 994){
			if(window.sessionStorage.getItem('editionKey') == 'bylwsenior' && $('.rightCont').height() < 982){
				$(".boxLeft").css('height', '982px')
				return
			}
			var additional = {
				index: 0,
				pay: 120,
				query: 0
			}
			$(".boxLeft").css('height',$('.rightCont').height() + (additional[$('#App').data('key')] || 0))
		}else{
			$(".boxLeft").css('height','auto')
		}

	}
	setHeight()
	window.onresize = function (){
		window.setHeight()
	}
})


$('.Toggle2').click(function () {
	if(!isclick) return;
	deleteFileFU('Toggle') // 专业极速版切换
	$('.VersionSwitchingLoding').show()
	var this_ = $(this)
	setTimeout(function() {
		$('.VersionSwitchingLoding').hide();
		typeSwitching(this_.attr('edition-key'))
		editionType(this_.attr('edition-key') , true)
	}, 500)
});

function editionType(edition , is) {
	$('#App').removeClass('bylw bylw_zrb ktbgsenior bylwsenior bylwsenior_zrb wxzs ktbg rws qklw kclw dybg zjcaigc sxbg lwdbppt qklwsenior xzaigccheck scirs')
	$('#App').addClass(edition)
	window.sessionStorage.setItem('editionKey' , edition)
	if(edition == "bylw") { // 毕业论文极速版
		$('.editionText').text('专业版')
		$('.Toggle2').attr('edition-key' , 'bylwsenior')
		$('#App').removeClass('ProfessionalEdition')
		$('#generate').text('立即生成')
		$('.Universal').show()
		$('.aigcTips').hide()
        $(".sciTips").hide()
		if(is) changeType($('#type_s'))
	}else if(edition == "bylwsenior") { // 毕业论文专业版
		$('#App').addClass('ProfessionalEdition')
		$('.editionText').text('极速版')
		$('.Toggle2').attr('edition-key' , 'bylw')
		$('#outline').text('下一步，选提纲')
		if(is) changeType($('#type_s2'))
	}else if(edition == "bylwsenior_zrb") { // 毕业论文专业版
        $('#App').addClass('ProfessionalEdition')
        $('.editionText').text('极速版')
        $('.Toggle2').attr('edition-key' , 'bylw')
        $('#outline').text('下一步，选提纲')
        if(is) changeType($('#type_s2'))
    }else if(edition == 'ktbgsenior') { // 开题报告专业版
		$('#App').addClass('ProfessionalEdition')
		$('.editionText').text('极速版')
		$('.Toggle2').attr('edition-key' , 'bylw')
		$('#outline').text('下一步，选大纲')
	}else if(edition == 'qklwsenior') { // 期刊论文专业版
		$('#App').addClass('ProfessionalEdition')
		$('.editionText').text('极速版')
		$('.Toggle2').attr('edition-key' , 'bylw')
		$('#outline').text('下一步，选提纲')
	}else {
		if(edition == 'xzaigccheck') {
			$('.Universal').hide()
			$('#generate').text('提交检测')
			$('.aigcTips').show()
            $(".sciTips").hide()
		}else if(edition == 'zjcaigc') {
			$('.Universal').hide()
			$('.aigcTips').show()
			$('#generate').text('开始降AIGC率')
            $(".sciTips").hide()
		}else if(edition == 'scirs') {
            $('.Universal').hide()
            $('.aigcTips').hide()
            $(".sciTips").show()
        }else {
			$('.Universal').show()
			$('.aigcTips').hide()
			$('#generate').text('立即生成')
            $(".sciTips").hide()
		}
		$('#App').removeClass('ProfessionalEdition')
	}
    if(edition == 'scirs') {
        $("h3.submittedInfo").hide()
        $(".groupSubmit").hide()
        $(".SCI_form").show()
        $(".case.realTime").hide()
        $(".main.mainContainer>h3").hide()
    }else{
        $(".main.mainContainer>h3").show()
        $(".groupSubmit").show()
        $(".SCI_form").hide()
        $(".case.realTime").show()
    }
	$(function() {
		setTimeout(function(){
			window.setHeight()
		} , 0)
	});
	if(!$('#App').hasClass('indexApp') && is) {
		location.href = './index.html'
	}
}

// 默认选择版本
function defaultType(type) {
	if(type && $('#App').hasClass('indexApp') && short_name_data[type]) {
		setTimeout(function() {
			$("#type_s").val(short_name_data[type].goods_id)
			$("#type_s").selectpicker('refresh');
			editionType(type , false)
			changeType($('#type_s'))
		}, 0)
	}
}

// 专业版和极速版切换时, 选择对应的产品
function typeSwitching(e) {
	var corresponding = {
		'ktbgsenior': 'ktbg',
		'ktbg': 'ktbgsenior',
		'bylw': 'bylwsenior',
		'bylwsenior': 'bylw',
        'bylw_zrb': 'bylwsenior_zrb',
        'bylwsenior_zrb': 'bylw_zrb',
		'qklw': 'qklwsenior',
		'qklwsenior': 'qklw',
	}
	if(e == 'bylw') {
		var short_name = typeData[$("#type_s2").val()].short_name
		// 比例: 选择了开题报告极速版, 就切换到开题报告专业版(通过goods_id)
		$("#type_s").val(short_name_data[corresponding[short_name]].goods_id)
		$("#type_s").selectpicker('refresh');
	}else {
		var short_name = typeData[$("#type_s").val()].short_name
		$("#type_s2").val(short_name_data[corresponding[short_name]].goods_id)
		$("#type_s2").selectpicker('refresh');
	}
}

// 参数携带
if(getQueryVariable('editionType')) {
	if(getQueryVariable('editionType') == 'bylw') {
		editionType("bylwsenior")
	}else {
		editionType("bylw")
	}
}else {
	// if($('#App').hasClass('indexApp') && window.sessionStorage.getItem('editionKey')=='zjcaigc') {
	// 	editionType("bylw")
	// } else {
	// 	editionType(window.sessionStorage.getItem('editionKey') || "bylw")
	// }
	editionType(window.sessionStorage.getItem('editionKey') || "bylw")
	// editionType("bylw") // 关闭专业版, 打开这一行
}

// 英文参考文献判断
function LiteratureFU() {
	var LiteratureType = $('input:checkbox[name="LiteratureType"]').is(':checked');
	if(LiteratureType && !$('#NumberEnglishReference').val()) {
		$("#LiteratureType_err").show()
		$(".inputQuantity .form-control").addClass('errorBorder')
		return false
	}else {
		$("#LiteratureType_err").hide()
		$(".inputQuantity .form-control").removeClass('errorBorder')
		return true
	}
}


$(document).ready(function(){
    $('.myLink .myLink2 .myLink3 .myLink1 .myLink4 .myLink5 .myLink6 .myLink7 .myLink8 .myLink9').click(function(e){
        e.preventDefault();
        var url = $(this).data('url');
        var param = $(this).data('param');
        var fullUrl = url + '?type=' + encodeURIComponent(param);
        window.open(fullUrl, '_blank');
    });
});

//
$('.pay_close').on('click', function () {
    closePopup()
})
function closePopup() {
    $('.pay_window').hide()
    $('.pay_box iframe').attr('src', '')
}
