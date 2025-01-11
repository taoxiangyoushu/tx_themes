$('.GoWithdrawal').click(function() {
    $('.withdrawBox').show()
})
var fid = ''

$('.version-item').click(function() {
    $('.version-item').removeClass('active')
    $(this).addClass('active')
    $('.paper-title').hide()
    $('.'+$(this).data('form')).show()
})

$("#ContainerTo").bootstrapValidator({
    excluded: [':disabled',':hidden'], //[':disabled', ':hidden', ':not(:visible)'] //设置隐藏组件可验证
    feedbackIcons: {
        valid: 'glyphicon',
        invalid: 'glyphicon',
        validating: 'glyphicon'
    },
    fields: {
        zfbName: {container: "#zfbName_err", validators: {notEmpty: {message: '支付宝账号不能为空'}}},
        realName: {container: "#realName_err",validators: {notEmpty: {message: '真实姓名不能为空'}}},
        microSignal: {container: "#microSignal_err",validators: {notEmpty: {message: '微信号不能为空'}}},
        WeChatName: {container: "#WeChatName_err",validators: {notEmpty: {message: '微信名称不能为空'}}},
        collectionCode: {container: "#collectionCode_err",validators: {notEmpty: {message: '收款码不能为空'}}},
        bankCardNumber: {container: "#bankCardNumber_err",validators: {notEmpty: {message: '银行卡卡号不能为空'}}},
        openingBank: {container: "#openingBank_err",validators: {notEmpty: {message: '银行卡卡号不能为空'}}},
        cardholderName: {container: "#cardholderName_err",validators: {notEmpty: {message: '银行卡卡号不能为空'}}},
        cashAmount: {
            container: "#cashAmount_err",
            validators: {
                callback: {
                    message: '提现金额不能为空,且大于10元',
                    callback: function (value, validator, $field) {
                        if(value>=10) {
                            return true
                        }else {
                            return false
                        }
                    }
                }
            }
        }
    }
});
$('.initiatedBt').click(function() {
    var bootstrapValidator = $("#ContainerTo").data("bootstrapValidator").validate();
    if (bootstrapValidator.isValid()) {
        if(Number($('#cashAmount').val()) > Number($('#balanceMoney').text())) return cocoMessage.error('可提现余额不足!', 2000);
        var type = $('.version-item.active').data('type')
        $('.ConfirmPopUpWindow').show()
        $('.zfbInfo , .wxInfo , .yhkInfo').hide()
        if(type == 'zfb') {
            $('.zfbInfo').show()
            $('.rightText.AlipayAccount').text($('#zfbName').val())
            $('.rightText.realName').text($('#realName').val())
        }else if(type == 'wx') {
            $('.wxInfo').show()
            $('.rightText.microSignal').text($('#microSignal').val())
            $('.rightText.WeChatName').text($('#WeChatName').val())
        }else if(type == 'yhk') {
            $('.yhkInfo').show()
            $('.rightText.bankCardNumber').text($('#bankCardNumber').val())
            $('.rightText.openingBank').text($('#openingBank').val())
            $('.rightText.cardholderName').text($('#cardholderName').val())
        }
    }
})
var isConfirmed = true
$('.confirmed').click(function() {
    if(!isConfirmed) return;
    isConfirmed = false
    var type = $('.version-item.active').data('type')
    var valType = { 
        'zfb': 20,
        'wx': 10,
        'yhk': 30
    }
    var paramis = {
        money: $('#cashAmount').val(),
        mode: valType[type],
        op_domain: window.location.origin
    }
    if(type == 'zfb') {
        paramis.zfb_account_no = $('#zfbName').val()
        paramis.zfb_real_name = $('#realName').val()
    }else if(type == 'wx') {
        paramis.wx_account_no = $('#microSignal').val()
        paramis.wx_name = $('#WeChatName').val()
        paramis.wx_payment_code = fid
    }else if(type == 'yhk') {
        paramis.bank_account_no = $('#bankCardNumber').val()
        paramis.bank_branch_name = $('#openingBank').val()
        paramis.bank_real_name = $('#cardholderName').val()
    }

    var formData = getFormData(paramis)
    var closeMsg = cocoMessage.loading('正在提交信息...')
    $.ajax({
        type: 'post',
        url: urls + '/api/client/distribution/withdrawal?user_token='+USER_TOKEN+'&jane_name='+JANE_NAME,
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: formData,
        success: function(data) {
            closeMsg();
            if (data.code == 200) {
                cocoMessage.success('已发起提现申请!', 2000)
                $('.withdrawBox ,.ConfirmPopUpWindow').hide()
                userInfo()
                withdrawal_list()
            } else {
                cocoMessage.error(data.codeMsg, 2000);
            }
        },
        error: function(err) {
            closeMsg();
            cocoMessage.error('数据获取失败,请检查网络', 2000);
        },
        complete: function() {
            isConfirmed = true
        }
    });
})

// 图片上传
$("#exampleInputFile").on('change',function (e){
    if($("#exampleInputFile")[0].files[0]){
        $(".upload-block").hide()
        $(".file-block").show()
        $(".voucher_err").removeClass('error')

        var files = e.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = function(e) {
                $(".file-block #collectionCode").attr('src' , e.target.result)
            }
            reader.readAsDataURL(file);
        }
        var formdata = new FormData()
        formdata.append('file',  $("#exampleInputFile")[0].files[0])
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
                    fid = res.data.relative_path
                }else{
                    if(res.codeMsg){
                        cocoMessage.error(res.codeMsg, 2000);
                    }else{
                        cocoMessage.error('文件上传失败，请重试', 2000);
                    }
                    $("#collectionCode_err").text('文件上传失败，请重试')
                    $("#collectionCode_err").show();
                }
            }
        })
    }else{
        $(".upload-block").show()
        $(".file-block").hide()
        fid = ''
    }
})
$(".delete-img").on('click',function (){
    $("#exampleInputFile").val('')
    $("#exampleInputFile").trigger('change')
})

$('#closeConfirmPopUpWindow').click(function() {
    $('.ConfirmPopUpWindow').hide()
})
$('#cashAmount').on('input' , function(e) {
    verification($(this))
    $('#amount , #WindowAmount').text($(this).val())
})