var urls = 'https://api.taoxiangyoushu.com'
// var urls = "http://api.projectlibraries.report";
// 常见问题
$(".sideMenu").slide({
	titCell: "h3", //鼠标触发对象
	targetCell: "ul", //与titCell一一对应，第n个titCell控制第n个targetCell的显示隐藏
	effect: "slideDown", //targetCell下拉效果
	delayTime: 100, //效果时间
	triggerTime: 150, //鼠标延迟触发时间（默认150）
	defaultPlay: true, //默认是否执行效果（默认true）
	trigger: "click",
	returnDefault: false //鼠标从.sideMen移走后返回默认状态（默认false）
});

$(".sideMenuDIv").each(function() {
	$(this).bind("click", function() {
		$(this).addClass("liu");
		$(this).siblings("div").removeClass("liu");
	})
});
// 文本框是否有值
function inputText() {}
inputText();


$("#formSubmit").bootstrapValidator({
	excluded: [":disabled", ":hidden"], // 关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
	feedbackIcons: {
		valid: 'glyphicon',
		invalid: 'glyphicon',
		validating: 'glyphicon'
	},
	fields: {
		name: {
			container: "#name_err",
			validators: {
				notEmpty: {
					message: '姓名不能为空'
				},
				regexp: {
					regexp: /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\.·。]{0,18}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,18}[a-zA-Z]{1}$)/,
					message: '请输入正确的姓名'
				}
			}
		},
		phone: {
			container: "#phone_err",
			validators: {
				notEmpty: {
					message: '手机号不能为空'
				},
				regexp: {
					regexp: /^1[3-9]\d{9}$/,
					message: '请输入正确手机号'
				}
			}
		},
		phone_code: {
			container: "#phone_code_err",
			validators: {
				notEmpty: {
					message: '请输入验证码'
				}
			}
		}
	}
});


// let act_code = getQueryVariable('ac')
// let suffix = ''
var SYSTEM_CONFIG = ''
var SYSTEM_INIT = ''
// if (act_code) {
// 	suffix = 'act_code=' + act_code + '&_session_type=user'
// }
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


function getProjectInfo() {
	$.ajax({
		type: 'post',
		url: urls + "/api/project/info?user_token=" + USER_TOKEN + '&jane_name=' + JANE_NAME + (suffix ? '&' +
			suffix : ''),
		success: function(result) {
			if (result.code == 200) {
				SYSTEM_CONFIG = result.data
				SYSTEM_INIT = true
			} else {
				alert("页面加载异常！！！");
			}
		}
	});
}
getProjectInfo();


// var  phoneaaaa= $('#phone').val();
// $("#MyOrder").click(function (){
// 	window.location.href="./query.html?phone="+phoneaaaa
// })

function setCookie(name, value, daysToLive) {
	let cookie = name + "=" + encodeURIComponent(value);
	if (typeof daysToLive === "number") {
		cookie += "; max-age=" + (daysToLive*24*60*60); // 将天数转换为秒数
	}
	document.cookie = cookie;
}

function getCookie(name) {
	const cookies = document.cookie.split("; ");
	for (let i = 0; i < cookies.length; i++) {
		const [cookieName, cookieValue] = cookies[i].split("=");
		if (name === cookieName) {
			return decodeURIComponent(cookieValue);
		}
	}
	return "";
}


// 提交按钮
$("#Submission").click(function() {
	var bootstrapValidator = $("#formSubmit").data("bootstrapValidator").validate();
	console.log(bootstrapValidator);
	if (bootstrapValidator.isValid()) {
		$('#Submission').attr('disabled', true);
		if ($('.requirements').val() && $('.requirements').val().length > 10000) {
			cocoMessage.error('降重要求最多允许10000字, 当前' + $('.requirements').val().length + '字', 2000);
			setTimeout(function() {
				$('#Submission').attr('disabled', false);
			}, 1000)
			return
		}
		var defaultGoodsInfo = SYSTEM_CONFIG["project"][0].goods_info[0]
		var goodsId = null
		if (defaultGoodsInfo) {
			goodsId = defaultGoodsInfo.goods_id
		}
		if (!goodsId) {
			cocoMessage.error('商品信息不存在', 2000);
			setTimeout(function() {
				$('#Submission').attr('disabled', false);
			}, 1000)
			return
		}
		var typefun = function() {
			if (screen.width >= 768) {
				return 1;
			} else if (/MicroMessenger/.test(window.navigator.userAgent)) {
				return 2;
			} else {
				return 7;
			}
		}
		var formData = {
			name: $('#name').val(),
			phone: $('#phone').val(),
			phone_code: $('#Captcha').val(),
			remark: $('.requirements').val(),
			business: $("#business").val(),
			field: $(".pull-left").val(),
			user_token: USER_TOKEN,
			jane_name: JANE_NAME,
			goods_id: goodsId,
			domain_record: window.location.origin,
			source: typefun(),
		}
		formData['data[research][label]'] = '研究领域'
		formData['data[research][value]'] = $("#field option:selected").text()
		var form_data = getFormData(formData)
		$.ajax({
			type: 'post',
			url: urls + "/api/client/order/unified/create",
			processData: false,
			contentType: false,
			xhrFields: {
				withCredentials: true
			},
			data: form_data,
			success: function(result) {
				if (result.code == 200) {
					$("#myModal").modal();
					setTimeout(function (){
						window.location.href = "./query.html?phone="+formData.phone
						$('#Submission').attr('disabled' , false);
					}, 5000);
					setCookie("phone", formData.phone);
				} else {
					cocoMessage.error(result.codeMsg, 2000);
					$('#Submission').attr('disabled', false);
				}
			},
			complete: function() {
				$('#Submission').attr('disabled', false)
			}
		});
	}

})


// 头部导航栏
$(window).scroll(function() {
	scrollTop($(this))
});
function scrollTop(this_) {
	if (this_.scrollTop() > 30) {
		$('.head').addClass('scrollCS')
	} else {
		$('.head').removeClass('scrollCS')
	}
}
scrollTop($(window));



$(window).scroll(function() {
	scrollTop1($(this))
});
function scrollTop1(this_) {
	if (this_.scrollTop() > 500) {
		$("#Hovering-arrows").css('visibility',"visible")
	} else {
		$("#Hovering-arrows").css('visibility',"hidden")
	}
}
scrollTop1($(window));


$(window).scroll(function() {
	scrollTop2($(this))
});
function scrollTop2(this_) {
	if (this_.scrollTop() > 5250) {
		$("#HeadDiv2").css('visibility',"visible")
		$("#HeadDiv1").css('visibility',"hidden")
		$("#HeadDiv12").css('visibility',"visible")
		$("#HeadDiv21").css('visibility',"hidden")
	} else {
		$("#HeadDiv2").css('visibility',"hidden")
		$("#HeadDiv1").css('visibility',"visible")
		$("#HeadDiv12").css('visibility',"hidden")
		$("#HeadDiv21").css('visibility',"visible")
	}
}
scrollTop2($(window));



// 发送验证码
function phoneFun(phones) {
	var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
	if (!myreg.test(phones)) {
		$("#phone").val("");
		$("#phone").attr("placeholder", "请填写正确的手机号格式");
		$("#phone").addClass("#phone change");
		return false;
	} else {
		return true;
	}
}
$("#Send-Captcha").bind("click", function() {
	var data = {
		_session_type: 'user',
		scenes_id: $(this).attr('data'),
	}; //向后台提交的数据
	var phone = $("#phone").val(); //填写的电话号码
	if (!phoneFun(phone)) { //判断一下电话号码是不是符合规则
		return false;
	}
	var t = $(this); //当前按钮对象
	t.attr("disabled", "disabled"); //让按钮不可用
	data.phone = phone; //赋值给数据对象
	var formData = getFormData(data)
	$.ajax({
		url: urls + "/api/verify_code/get_phone_validate",
		type: "post",
		processData : false,
		contentType : false,
		xhrFields: {
			withCredentials: true
		},
		data: formData,
		success: function() {
			// $(".Captcha-succeed").css("visibility", "visible")
			// setTimeout(function() {
			// 	$(".Captcha-succeed").css("visibility", "hidden")
			// }, 2000)
		},
		error: function() {
			alert("发送失败")
		}
	})

	var time = 60; //倒计时60秒后可以重新点击发送
	var timer = null;
	t.html(time + "秒后重试"); //倒计时显示
	timer = setInterval(function() {
		if (time == 1) { //如果是最后一秒
			clearInterval(timer);
			t.html('获取验证码');
			t.attr('disabled', false); //允许重新点击按钮
		} else {
			time--;
			t.html(time + '秒后重试');
		}
	}, 1000)
})

// 学科悬浮
function showMedicine(cid, t) {
	$("#o2,#o3,#o1,#o4,#o5").hide();
	$("#c1,#c2,#c3,#c4,#c5").show();
	$("#" + cid).show();
	$(t).hide();
}
// 方案悬浮
function showMedicine1(cid, t) {
	$(".scheme-NanDiv1,.NanDiv2,.scheme-NanDiv3").show();
	$(".NanDiv1,.scheme-NanDiv2,.NanDiv3").hide();
	$("." + cid).show();
	$(t).hide();
}

$(function() {
	// 出版社走马灯
	$('.j-quee1').marquee({
		'speed': 50,
		'direction': 'right'
	});
	// 学科悬浮
	$(showMedicine("o1", $("#c1")));
	$("#c2").hover(function() {
		$(showMedicine("o2", this))
	}, function() {});
	$("#c1").hover(function() {
		$(showMedicine("o1", this))
	}, function() {});
	$("#c3").hover(function() {
		$(showMedicine("o3", this))
	}, function() {});
	$("#c4").hover(function() {
		$(showMedicine("o4", this))
	}, function() {});
	$("#c5").hover(function() {
		$(showMedicine("o5", this))
	}, function() {});

	// 	方案悬浮
	$(showMedicine1("scheme-NanDiv2", $(".NanDiv2")));
	$(".scheme-NanDiv1").hover(function() {
		$(showMedicine1("NanDiv1", this))
	}, function() {});
	$(".NanDiv2").hover(function() {
		$(showMedicine1("scheme-NanDiv2", this))
	}, function() {});
	$(".scheme-NanDiv3").hover(function() {
		$(showMedicine1("NanDiv3", this))
	}, function() {});
})


//示例轮播图
$(function() {
	var $wrap = $('#wrap'),
		$picUl = $('.pic'),
		$tabLi = $('.tab li'),
		$prev = $('.prev'),
		$next = $('.next'),
		widLi = $picUl.children().eq(0).width(),
		len = $tabLi.length,
		idx = 0,
		timer = null,
		// 方案轮播图
		$scheme = $(".scheme-navigation div"),
		$ccc = $(".ccc"),
		ccdiv = $(".scheme-Nancontent").width(),
		schemeLen = $scheme.length,
		index = 0;

	$scheme.click(function() {
		$(this).addClass("on").siblings().removeClass("on")
		index = $(this).index();
		$ccc.animate({
			left: -index * ccdiv
		}, 500)
	})

	//get first; set all
	$tabLi.click(function() {
		$(this).addClass("on").siblings().removeClass("on")
		idx = $(this).index();
		$picUl.animate({
			left: -idx * widLi
		}, 500)
	})
	// 点击下一张
	$next.click(function() {
		idx++;
		idx %= len; // 序号为小圆按钮的长度时到达第一张
		$tabLi.eq(idx).addClass("on").siblings().removeClass("on")
		$picUl.animate({
			left: -idx * widLi
		}, 500)
	})

	$prev.click(function() {
		idx--;
		if (idx < 0) {
			idx = len - 1
		};
		$tabLi.eq(idx).addClass("on").siblings().removeClass("on")
		$picUl.animate({
			left: -idx * widLi
		}, 500)
	})

	// 自动轮播
	auto();

	function auto() {
		timer = setInterval(function() {
			$next.trigger("click") // 触发click
		}, 5000)
	}
	$wrap.hover(function() {
		clearInterval(timer);
	}, function() {
		auto();
	})
})


//专家轮播图
var $carousel2 = $("#carousel2"); // 大盒子
var $unit2 = $("#unit2"); // “小火车”
var $leftBtn2 = $("#leftBtn2"); // 左按钮
var $rightBtn2 = $("#rightBtn2"); // 右按钮
var amount2 = $unit2.children("li").length;

//克隆第一张图片//同时显示几张就克隆几张
var showImgCount = 3;
for (var i = 0; i < amount2; i++) {
	if (i >= showImgCount) break;
	$unit2.children('li:eq(' + i + ')').clone().appendTo($unit2);
}
amount2 = amount2 + showImgCount;

var timer2 = setInterval(rightBtnHandler2, 5000); //定时器
// 鼠标进入停止定时器
$carousel2.mouseenter(function() {
	clearInterval(timer2);
});
// 鼠标离开重新开启定时器
$carousel2.mouseleave(function() {
	clearInterval(timer2);
	timer2 = setInterval(rightBtnHandler2, 5000);
});
//信号量，表示当前第几张图片。0、1、2、3、4
var idx2 = 0;

$rightBtn2.click(rightBtnHandler2); //右按钮的事件监听
function rightBtnHandler2() {
	// 防止多次点击
	if ($unit2.is(":animated")) {
		return;
	}
	// 先改变信号量，在回调函数中验证
	idx2++;
	$unit2.animate({
		"left": idx2 * -400
	}, 400, function() {
		if (idx2 > amount2 - (showImgCount + 1)) {
			idx2 = 0;
			$unit2.css("left", 0); //瞬间移动
		}
	});
}
$leftBtn2.click(function() {
	// 防止多次点击
	if ($unit2.is(":animated")) {
		return;
	}
	// 改变信号量 
	idx2--;
	// 先判断
	if (idx2 < 0) {
		// 如果信号量小于0，则瞬间移动到被克隆的图片，信号量为最后一张真实图片序号
		//idx2 = amount2 - 1;
		if (idx = -1) idx = 0;
		$unit2.animate({
			"left": (showImgCount + 1 + idx2) * -400
		}, 400);
		if (idx2 < showImgCount * -1) {
			idx2 = 0;
			$unit2.css("left", 0);
			return;
		}
		return;
	}
	$unit2.animate({
		"left": idx2 * -400
	}, 400);
});