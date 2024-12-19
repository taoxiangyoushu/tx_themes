var systemInfo = {
	wanfang: {
		comparisonLibrary: '中国学术期刊数据库、中国标准全文数据库、中国优秀报纸全文数据库、中国专利文献全文数据库、中国博士学位论文全文数据库、中国优秀硕士学位论文全文数据、国内外重要学、会议论文数据库、优先出版论文数据库、互联网学术资源数据库、学术网络文献数据库、特色英文文摘数据库',
		Language: '中文',
		timeConsuming: '1-5分钟',
	},
	weipu: {
		comparisonLibrary: '中文科技期刊论文全文数据库、博士/硕士学位论文全文数据库、外文特色文献数据全库、中文主要报纸全文数据库、中国主要会议论文特色数据库、高校论文联合比对库、中国专利特色数据库、维普优先出版论文全文数据库、互联网数据资源/互联网文档资源、港澳台文献资源、图书资源、高校自建资源库、个人自建资源、库年鉴资源、古籍文献资源、IPUB原创作品',
		Language: '中文/英文/小语种',
		timeConsuming: '10-30分钟',
	},
	paperPass: {
		comparisonLibrary: '学术期刊（1990-2019）、学位论文（硕博库1990-2019）、会议论文（1990-2019）、书籍数据（1990-2017）、互联网资源',
		Language: '中文',
		timeConsuming: '10-30分钟',
	},
	checkPass: {
		comparisonLibrary: '论文检测系统基于强大的精准检测算法以及稳定快速的检测云服务器',
		Language: '中文/英文',
		timeConsuming: '2-20分钟',
	},
	zaojiance: {
		comparisonLibrary: '系统超过百亿数据库、含海量学术期刊、学位论文、会议报纸、图书书籍以及互联网资源',
		Language: '中文',
		timeConsuming: '5-10分钟',
	},
	turnitin: {
		comparisonLibrary: '国际版 适合人群：非英国地区学校外语论文检测，留学生等国际论文,UK版 适合人群：在英国留学的学生使用，英国大学的论文请选择UK版',
		Language: '中文/英文/小语种（AI率检测仅支持英文，其它语言无法检测，也无法出AI率报告）',
		timeConsuming: '10-30分钟',
	},
	ithenticate: {
		comparisonLibrary: '700+亿份在线和存档网页、135000000篇文章、书籍、会议记录、预印本、百科全书和摘要，69000000+付费学术文章、书籍和会议记录，可检测几乎所有语种的文章',
		Language: '英文',
		timeConsuming: '30-60分钟',
	},
	dashichachong: {
		comparisonLibrary: '覆盖图书、期刊、学位论文、会议论文、专利、标准、互联网数据，数据实时更新范围更广。',
		Language: '中文、英文',
		timeConsuming: '3分钟',
	},
	paperyy: {
		comparisonLibrary: '覆盖图书、期刊、学位论文、会议论文、专利、标准、互联网数据,数据实时更新范围更广',
		Language: '中文、英文',
		timeConsuming: '1-10分钟',
	},
	grammarly: {
		comparisonLibrary: 'GramMarly提供拼写校正(Spell Checking)，语境分析下的词汇应用纠正(Contextual Spelling Check)，语法规则纠正(Grammar)，标点符号纠正(Punctuation)，句式架构纠正(Sentence Structure)等基础功能，文章类型预判(Document Type，可根据不同类型的文章进行校对)',
		Language: '英文',
		timeConsuming: '5-10分钟',
	},
	yuanwenjian: {
		comparisonLibrary: '100000000篇中文文献，1000万篇各类独家文献，300万港澳台地区学术文献4000万篇英文文献资源，20个亿中英文互联网资源是全国高校用来检测硕博论文的检测系统',
		Language: '中文、英文',
		timeConsuming: '10-30分钟',
	},
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
	$(".system-contrast-pop").hide()
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

window.onload = function (){
	$.ajax({
		type: 'post',
		url: urls + "/api/project/info?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME + (suffix?'&'+suffix:'') + (suffix2?'&'+suffix2:''),
		data: {
			ident: 'check'
		},
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

				// 重组数据
				typefun(data.project[0].goods_info)
				setArguments(data.project[0].goods_info)

				if($(".toabaoID").length && data.project[0].pay_way.taobao) {
					$(".toabaoID").show()
				}

				if($(".home").length) {
					// setPriceInfo()
					dropDownType(typeData)
					getFormaTemplate()
				}

				if($(".resultBox").length) {
					startQuerying()
				}

				if($('.payApp').length) {
					payWay(data.project[0].goods_info , data.project[0].pay_way )
				}
				
				if(data.domain_config && data.domain_config.distribution_status) {
					$('.distributionEntrance').show()
				}
			}else{
				toast(result.codeMsg)
			}
		}
	});
}

var typeData = {}
var sequenceArr = []
function typefun(goods_info) {
	for(var i=0; i<goods_info.length; i++) {
		if(typeData.hasOwnProperty(goods_info[i].type)) {
			typeData[goods_info[i].type].push(goods_info[i])
		}else{
			typeData[goods_info[i].type] = [ goods_info[i] ]
			sequenceArr.push(goods_info[i].type)
		}
	}
}

function setArguments(info) {
	for (var i=0;i<info.length; i++){
		parameterSet[info[i].short_name] = info[i].goods_config
	}
}
