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
					dropDownType(result.data.project[0] && result.data.project[0].goods_info)
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

var typeData = {}
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
	}
}

function setArguments(info) {
	for (var i=0;i<info.length; i++){
		parameterSet[info[i].short_name] = info[i].goods_config
	}
}

function editionType(edition) {
	$('#App').removeClass('bylwsenior wxzs ktbg rws qklw kclw dybg zjcaigc sxbg lwdbppt')
	if(edition == "Normal") {
		$('#App').removeClass('ProfessionalEdition')
		$('#App').removeClass('zjcaigc')
		$('#generate').text('立即生成')
		$('.Universal').show()
		$('.aigcTips').hide()
	}else {
		if(edition == "zjcaigc"){
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


// 毕业论文样例弹窗
$('.Sample_window').click(function(){
	$('.Sample_Graduation_Thesis').show()
	$('.Graduation_Thesis').show()
})
$('.window_closed').click(function(){
	$('.Sample_Graduation_Thesis').hide()
	$('.Graduation_Thesis').hide()
})
$('.Graduation_Thesis').click(function(){
	$('.Sample_Graduation_Thesis').hide()
	$('.Graduation_Thesis').hide()
})

$(".Sample_window").click(function () {
	var scrollTopValue1 = $(".Color_paper_contenthead")[0].offsetTop;
    var scrollTopValue2 = $(".Catalog_Box")[0].offsetTop;
    var scrollTopValue3 = $(".Text_box")[0].offsetTop;
    var scrollTopValue4 = $(".Empirical_datacolor_head")[0].offsetTop;
    var scrollTopValue5 = $(".DataAnalysisimg_Box")[0].offsetTop;
    var scrollTopValue6 = $(".Content_element_colorhead")[0].offsetTop;
    var scrollTopValue7 = $(".Mathematical_formula_model")[0].offsetTop;
    var scrollTopValue8 = $(".Analysis_TableBox")[0].offsetTop;
    var scrollTopValue9 = $(".CodeExample_Box")[0].offsetTop;
    var scrollTopValue10 = $(".End_color_paperhead")[0].offsetTop;
    var scrollTopValue11 = $(".Thankyou_box")[0].offsetTop;
	$(function () {
		function navgationTo(height) {
		  var height11 = String(height) - 50;
		  $(".dialogBox").scrollTop(height11);
		}
  
		$(".Left_style span").on("click", function () {
		  switch ($(this).attr("data-a")) {
			case "1":
			  navgationTo(scrollTopValue1);
			  break;
			case "2":
			  navgationTo(scrollTopValue2);
			  break;
			case "3":
			  navgationTo(scrollTopValue3);
			  break;
			case "4":
			  navgationTo(scrollTopValue4);
			  break;
			case "5":
			  navgationTo(scrollTopValue5);
			  break;
			case "6":
			  navgationTo(scrollTopValue6);
			  break;
			case "7":
			  navgationTo(scrollTopValue7);
			  break;
			case "8":
			  navgationTo(scrollTopValue8);
			  break;
			case "9":
			  navgationTo(scrollTopValue9);
			  break;
			case "10":
			  navgationTo(scrollTopValue10);
			  break;
			case "11":
			  navgationTo(scrollTopValue11);
			  break;
		  }
		});
	  });

  $("#Content_sliding").scroll(function () {
    var scrollTopValue = $(this).scrollTop();
    if (scrollTopValue > 0 && scrollTopValue < scrollTopValue4 - 50) {
      $(".abstract").addClass("Format_paper_content");
      $(".catalogueDiv").removeClass("Format_paper_content");
      if (scrollTopValue > 0) {
        $(".abstract").addClass("Format_paper_content");
      }
      if (scrollTopValue > scrollTopValue2 - 80) {
        $(".catalogueDiv").addClass("Format_paper_content");
        $(".abstract").removeClass("Format_paper_content");
        $(".maintext").removeClass("Format_paper_content");
      }
    } else if (scrollTopValue == 0) {
      $(".abstract").addClass("Format_paper_content");
      $(".maintext").removeClass("Format_paper_content");
      $(".catalogueDiv").removeClass("Format_paper_content");
    } else {
      $(".catalogueDiv").removeClass("Format_paper_content");
      $(".abstract").removeClass("Format_paper_content");
    }

    if (
      scrollTopValue > scrollTopValue2 + 200 &&
      scrollTopValue < scrollTopValue6
    ) {
      $(".maintext").addClass("Format_paper_content");
      $(".catalogueDiv").removeClass("Format_paper_content");
    }
    if (
      scrollTopValue > scrollTopValue4 - 80 &&
      scrollTopValue < scrollTopValue6 - 80
    ) {
      $(".maintext").removeClass("Format_paper_content");
      $(".Data_analysis").addClass("Empirical_data_style");
      $(".Data_analysis_images").removeClass("Empirical_data_style");
      if (scrollTopValue > scrollTopValue5 - 80) {
        $(".Data_analysis_images").addClass("Empirical_data_style");
        $(".Data_analysis").removeClass("Empirical_data_style");
      }
    } else {
      $(".Data_analysis").removeClass("Empirical_data_style");
      $(".Data_analysis_images").removeClass("Empirical_data_style");
    }

    if (scrollTopValue > scrollTopValue6 - 80 &&scrollTopValue < scrollTopValue10 - 80) {
      $(".Process_structure").addClass("Content_element_style");
      $(".Mathe_formula_model").removeClass("Content_element_style");
      $(".Code_Example").removeClass("Content_element_style");
      $(".maintext").removeClass("Format_paper_content");
      $(".Analysis_Table").removeClass("Content_element_style");
      if (scrollTopValue > scrollTopValue6 + 200) {
        $(".Mathe_formula_model").addClass("Content_element_style");
        $(".Process_structure").removeClass("Content_element_style");
        $(".Code_Example").removeClass("Content_element_style");
        $(".Analysis_Table").removeClass("Content_element_style");
      }
      if (scrollTopValue > scrollTopValue7 + 80) {
        $(".Mathe_formula_model").removeClass("Content_element_style");
        $(".Analysis_Table").addClass("Content_element_style");
        $(".Code_Example").removeClass("Content_element_style");
      }
      if (scrollTopValue > scrollTopValue8 + 80) {
        $(".Code_Example").addClass("Content_element_style");
        $(".Analysis_Table").removeClass("Content_element_style");
      }
    } else {
      $(".Process_structure").removeClass("Content_element_style");
      $(".Code_Example").removeClass("Content_element_style");
      $(".Mathe_formula_model").removeClass("Content_element_style");
      $(".Analysis_Table").removeClass("Content_element_style");
    }
    if (scrollTopValue > scrollTopValue10 - 80) {
      $(".reference").addClass("Ending_style_paper");
    } else {
      $(".thank").removeClass("Ending_style_paper");
      $(".reference").removeClass("Ending_style_paper");
      $(".thank").removeClass("Ending_style_paper");
    }
    if (scrollTopValue > scrollTopValue10 + 100) {
      $(".thank").addClass("Ending_style_paper");
      $(".reference").removeClass("Ending_style_paper");
    } else {
      $(".thank").removeClass("Ending_style_paper");
    }
  });
});


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