

// 投诉的js

var uploadImgArr = [];
var uploadingImg = false;
var cupload = new Cupload ({
	ele	 : '#upload-P',
	name : 'image',
	num  : 3,
	width: 70,
	height: 70,
	url  : urls + '/upload/image',
});

$("#complainFormBox").bootstrapValidator({
	excluded: [':disabled',':hidden'], //[':disabled', ':hidden', ':not(:visible)'] //设置隐藏组件可验证
	feedbackIcons: {
		valid: 'glyphicon',
		invalid: 'glyphicon',
		validating: 'glyphicon'
	},
	fields: {
		textarea: {
			container: "#textarea_err",
			validators: {
				callback: {
					message: '请输入15至100字内的反馈内容',
					callback: function (value, validator, $field) {
						if(value.length>=15 && value.length<=100) {
							return true
						}else {
							return false
						}
					}
				}
			}
		},
		CellPhone_s: {
			container: "#CellPhone_s_err",
			validators: {
				notEmpty: {
					message: '手机号不能为空'
				},
				regexp: {
					regexp: /^1[3-9]\d{9}$/,
					message: '请输入正确手机号'
				}
			}
		}
	}
});
$('.complainTS').click(function() {
	$('.complainForm').toggle()
	$('.mask').toggle()
	$('#contenteditable').val(localStorage.getItem('orderId') || '')
})
$('.hader_S .delete').click(function() {
	$('.complainForm').hide()
	$('.complainRecord').hide();
	$('.mask').hide()
})
$(".radioData").on('click','input',function(){
	$('.labelTitle').removeClass('selected')
	$(this).parent('.labelTitle').addClass('selected')
	$("#complainFormBox").data('bootstrapValidator').resetForm();
});

// 随机字符串
function randomRange(min, max){
	var returnStr = "",
		range = (max ? Math.round(Math.random() * (max-min)) + min : min),
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	for(var i=0; i<range; i++){
		var index = Math.round(Math.random() * (arr.length-1));
		returnStr += arr[index];
	}
	return returnStr;
}

let throttling = true

// 反馈历史标识
var complaintRandomString = ''
if(window.localStorage.getItem('complaintRandomString')){
	complaintRandomString = window.localStorage.getItem('complaintRandomString')
}else{
	complaintRandomString = randomRange(12)
	window.localStorage.setItem('complaintRandomString',complaintRandomString)
}
$('.complainGenerate').click(function() {
	var bootstrapValidator = $("#complainFormBox").data("bootstrapValidator").validate();
	if (bootstrapValidator.isValid()) {
		if(!throttling) return
		$('.complainForm').hide()
		$(".mask").hide();
		toast({
			msg: '正在提交,请稍后...',
			type: 'loading',
			time: 20000
		})
		throttling = false
		var formData = {
			order_sn: $('#contenteditable').val(),
			feedback_reason: $('#textarea').val(),
			label: $('.radioBox .selected input').val(),
			phone: $('#CellPhone_s').val(),
			source: window.location.origin,
			user_images: uploadImgArr,
			token: complaintRandomString
		}
		var form_data = getFormData(formData)
		$.ajax({
			type: 'post',
			url: urls + "/api/client/complaint/apply?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME,
			processData: false,
			contentType: false,
			xhrFields: {
				withCredentials: true
			},
			data: form_data,
			success: function(data) {
				toastNone()
				if (data.code == 200) {
					throttling = true
					toast({
						msg: '已提交投诉!',
						type: 'success',
						time: 2000
					})
					$('#textarea').val('')
					$('#CellPhone_s').val('')
					for(var i=$(".cupload-image-list li .cupload-delete-btn").length-1; i>=0; i--){  //手动删除已上传图片
						$(".cupload-image-list li .cupload-delete-btn")[i].click()
					}
				} else {
					throttling = true
					toast({
						msg:  data.codeMsg,
						type: 'error',
						time: 2000
					})
				}
			},
			error: function(err) {
				toastNone()
				throttling = true
			}
		});
	}
})

var page = 1;
var limit = 100;
$(".feedbackHistory span").on('click', function (){
	$(".complainForm").hide();
	$(".complainRecord").show();
	$(".formMain section").show();
	$(".complain-item").remove();
	var formdata = new FormData()
	formdata.append('page',page)
	formdata.append('limit', limit)
	formdata.append('token',complaintRandomString);
	$.ajax({
		type: 'post',
		processData: false,
		contentType: false,
		url: urls +'/api/client/complaint/list?user_token=' + USER_TOKEN+"&jane_name="+JANE_NAME,
		data: formdata,
		success: function (res){
			var obj = {}
			var resData = res.data
			if(resData.length > 0){
				for(var i=0; i<resData.length; i++){
					var element = ''
					var answer = ''
					if(resData[i].status == 60) {
						if(!resData[i].answer_content) {
							answer = '投诉已处理完成'
						}else{
							answer = resData[i].answer_content
						}
					}else if(resData[i].status == 10){
						answer = '客服正在处理中，请稍后刷新.....'
					}else{
						answer = resData[i].answer_content
					}

					element += '<div class="complain-item">' +
						'                    <div class="requestBox">' +
						'                        <p class="text">' +
						'                            <span class="ask">问</span>' +
						resData[i].feedback_reason +
						'                        </p>' +
						'                        <div id="requestBoxImg'+ i +'" class="requestBox-Img"></div>' +
						'                    </div>' +
						'                    <div class="answer">' +
						'                        <p class="text">' +
						'                            <span class="reply">答</span>' +
						answer +
						'                        </p>' +
						'                        <div id="requestBoxImgA'+ i +'" class="requestBox-Img"></div>' +
						'                    </div>' +
						'                </div>'
					$(".complainRecord .formMain .formMain-sc").append(element)
					if(resData[i].user_images.length > 0){
						obj['requestBoxImg'+i] = new Cupload ({
							ele	 : '#requestBoxImg' + i,
							name : 'image',
							num  : 3,
							width: 70,
							height: 70,
							onlyShowBox: true,
							data: resData[i].user_images
						});
					}
					if(resData[i].answer_images.length > 0){
						obj['requestBoxImgA'+i] = new Cupload ({
							ele	 : '#requestBoxImgA' + i,
							name : 'image',
							num  : 3,
							width: 70,
							height: 70,
							onlyShowBox: true,
							data: resData[i].answer_images
						});
					}
				}
				$(".formMain section").hide()
			}else{
				$(".formMain section").hide()
				$(".complainRecord .formMain .formMain-sc").append('<p class="complain-item">暂无反馈历史</p>')
			}
		}
	})
})

$(".deleteRecord").on('click',function (){
	$(".complainForm").hide();
	$(".complainRecord").hide();
})
