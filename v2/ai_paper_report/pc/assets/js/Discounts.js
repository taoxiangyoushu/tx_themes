
$('.but_close').click(function () { 
    $('.mask_body').hide()
    $('.Discounts_box').hide()
    $('body').css('overflow' , 'auto')

});
$('.Activity').click(function() {
    $('.mask_body').show()
    $('.Discounts_box').show()
    $('body').css('overflow' , 'hidden')
})
// 获取优惠券
$(document).on('click','.Not',function (){
    if(!$('#Cell-phoneNumber').val()) {
        cocoMessage.error("请输入正确的手机号!", 2000);
        return
    }
    if(throttling == false) return;
    throttling = false
    var closeMsg = cocoMessage.loading('正在获取优惠券,请稍后...');
    $.ajax({
        type: 'post',
        url: urls + '/api/client/activity/coupons/lehua?phone='+$('#Cell-phoneNumber').val()+'&user_token='+ USER_TOKEN + '&jane_name='+ JANE_NAME+(suffix?'&'+suffix:'') + (suffix2?'&'+suffix2:''),
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            throttling = true
            if (data.code == 200) {
                closeMsg();
                cocoMessage.success('优惠券获取成功!', 3000);
                $('.GetCode .Not').attr('class' , 'success')
                $('.CouponCode').text(data.data)
                window.localStorage.setItem('CouponCode', data.data)
                window.localStorage.setItem('CouponNumber', $('#Cell-phoneNumber').val())
                window.localStorage.setItem('CouponUltimate', data.data)
            }else {
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
})
$('#Cell-phoneNumber').on('input' , function() {
    window.localStorage.removeItem('CouponNumber')
    window.localStorage.removeItem('CouponCode')
    $('.GetCode .success').attr('class' , 'Not')
})

$(".CopyCode").on('click',function (){
    var text = $(".CouponCode").text()
    $("#copyInput2").val(text)
    $("#copyInput2").select()
    try {
        var state = document.execCommand("copy");
    } catch (err) {
        var state = false;
    }
    if (state) {
        cocoMessage.success(1000, "已复制到粘贴板!", function() {
        });
    } else {
        cocoMessage.error(1000, "复制失败", function() {
        });
    }
})
$(document).ready(function(){ 
    var qrcode = new QRCode(document.getElementById("codeBox"), {
        width: 110,
        height: 110,
    });
    $.ajax({
        type: 'post',
        url: urls + '/api/client/activity/qr/lehua?user_token='+ USER_TOKEN + '&jane_name='+ JANE_NAME+(suffix?'&'+suffix:'') + (suffix2?'&'+suffix2:''),
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            if (data.code == 200) {
                $('.Activity').show()
                $('.Discounts_box').show()
                $('body').css('overflow' , 'hidden')
                $('.mask_body').show()
                qrcode.makeCode(data.data);
                if(window.localStorage.getItem('CouponNumber') && window.localStorage.getItem('CouponCode')) {
                    $('.GetCode .Not').attr('class' , 'success')
                    $('#Cell-phoneNumber').val(window.localStorage.getItem('CouponNumber'))
                    $('.CouponCode').text(window.localStorage.getItem('CouponCode'))
                }
            }else {
               $('.Activity').hide()
               $('.mask_body').hide()
                $('.Discounts_box').hide()
                $('body').css('overflow' , 'auto')
            }
        }
    });
}); 