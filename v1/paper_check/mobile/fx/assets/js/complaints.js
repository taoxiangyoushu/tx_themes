

var withdrawalSn = ''
$(document).on('click','.complaints',function(){
    $('.complaintsBox').show()
    withdrawalSn = $(this).data('withdrawalsn')
})
$("#complaints").bootstrapValidator({
    excluded: [':disabled',':hidden'], //[':disabled', ':hidden', ':not(:visible)'] //设置隐藏组件可验证
    feedbackIcons: {
        valid: 'glyphicon',
        invalid: 'glyphicon',
        validating: 'glyphicon'
    },
    fields: {
        real_name: {container: "#real_name_err", validators: {notEmpty: {message: '真实姓名不能为空'}}},
        content: {container: "#content_err", validators: {notEmpty: {message: '请输入申诉内容'}}},
        complaintsPhone: {
			container: "#phone2_err",
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

var fid = []
// 图片上传
$("#exampleInputFile2").on('change',function (e){
    $('#voucher_err').hide()
    if($("#exampleInputFile2")[0].files[0]){
        $(".file-block2").show()
        $(".file-box").removeClass('error')

        var formdata = new FormData()
        formdata.append('file',  $("#exampleInputFile2")[0].files[0])
        formdata.append('type',  'dist')
        $.ajax({
            type: 'POST',
            url: urls + '/unified/upload/image',
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            data: formdata,
            success: function (res){
                if(res.code == 200){
                    fid.push(res.data)
                    fidHtml()
                }else{
                    if(res.codeMsg){
                        cocoMessage.error(res.codeMsg, 2000);
                    }else{
                        cocoMessage.error('文件上传失败，请重试', 2000);
                    }
                }
                $('#exampleInputFile2').val('');
            }
        })
    }else{
        $(".upload-block2").show()
        $(".file-block2").hide()
    }
})

$(document).on('click','.delete-img2',function(){
    fid.splice($(this).data('index'), 1)
    fidHtml()
})

function fidHtml() {
    if(fid.length>=3) {
        $(".upload-block2").hide()
    }else {
        $(".upload-block2").show()
    }
    var text = "";
    for(var i=0; i<fid.length; i++) {
        text += "<div class=\"preview file-block2\">";
        text += "    <img id=\"voucher\" src=\""+fid[i].path+"\" alt=\"\">";
        text += "    <div class=\"delete-file2\">";
        text += "        <img class=\"delete-img2\" data-index=\""+i+"\" src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/Deletewd.png\" alt=\"\">";
        text += "    </div>";
        text += "</div>";
    }
    $('.imgArr').html('').append(text)
}

$('.submitApplication').click(function() {
    var bootstrapValidator = $("#complaints").data("bootstrapValidator").validate();
    if(!fid.length) {
        $('#voucher_err').show().text('请上传相关凭证图片')
    }
    if (bootstrapValidator.isValid() && fid.length) {
        var voucher = ''
        for(var i=0; i<fid.length; i++) {
            voucher+=fid[i].path + (fid.length-1==i? '':',')
        }
        var formData = getFormData({
            real_name: $('#real_name').val(),
            phone: $('#complaintsPhone').val(),
            content: $('#content').val(),
            voucher: voucher,
            withdrawal_sn: withdrawalSn
        })
        var closeMsg = cocoMessage.loading('正在提交信息...')
        $.ajax({
            type: 'post',
            url: urls + '/api/client/distribution/withdrawal_appeal?user_token='+USER_TOKEN+'&jane_name='+JANE_NAME,
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            data: formData,
            success: function(data) {
                closeMsg();
                if (data.code == 200) {
                    cocoMessage.success('已发起申诉!', 2000)
                    $('.complaintsBox').hide()
                    userInfo()
                    withdrawal_list()
                } else {
                    cocoMessage.error(data.codeMsg, 2000);
                }
            },
            error: function(err) {
                closeMsg();
                cocoMessage.error('数据获取失败,请检查网络', 2000);
            }
        });
    }
})