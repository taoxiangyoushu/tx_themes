
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
// var cupload2 = new Cupload ({
// 	ele	 : '#requestBoxImg1',
// 	name : 'image',
// 	num  : 3,
// 	width: 70,
// 	height: 70,
// 	onlyShowBox: true,
// 	data: ['http://xzx.dashixiezuo.net/projects/aipr/assets/img/logo.png?v87']
// });

// 投诉的js
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
	$('.complainRecord').hide();
	$('.complainForm').toggle()
	$('#contenteditable').val(localStorage.getItem('oid') || '')
})
$('.hader_S .delete').click(function() {
	$('.complainForm').hide()
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
var complaintRandomString = ''
if(window.localStorage.getItem('complaintRandomString')){
	complaintRandomString = window.localStorage.getItem('complaintRandomString')
}else{
	complaintRandomString = randomRange(12)
	window.localStorage.setItem('complaintRandomString',complaintRandomString)
}
let throttling = true
$('.complainGenerate').click(function() {
	var bootstrapValidator = $("#complainFormBox").data("bootstrapValidator").validate();
	if (bootstrapValidator.isValid()) {
		if(!throttling) return
		var closeMsg = cocoMessage.loading('正在提交,请稍后...');
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
				if (data.code == 200) {
					throttling = true
					closeMsg();
					$('.complainForm').hide()
					cocoMessage.success("已提交投诉!", 2000);
					$('#textarea').val('')
					$('#CellPhone_s').val('')
					for(var i=$(".cupload-image-list li .cupload-delete-btn").length-1; i>=0; i--){  //手动删除已上传图片
						$(".cupload-image-list li .cupload-delete-btn")[i].click()
					}
				} else {
					throttling = true
					closeMsg();
					cocoMessage.error(data.codeMsg, 3000);
				}
			},
			error: function(err) {
				throttling = true
				closeMsg();
				cocoMessage.error("请求失败!请检查网络", 2000);
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
		url: urls +'/api/client/complaint/list?user_token=' + USER_TOKEN +"&jane_name="+ JANE_NAME,
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