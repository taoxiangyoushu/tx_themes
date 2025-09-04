(function() {
    $.ajax({
        type: 'post',
        url: urls + "/api/client/order/order_tmp/order_id?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME ,
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: getFormData({order_sn: getQueryVariable('order_sn') || getQueryVariable('commitId') }),
        success: function success(result) {
            if(result.code == '200') {
                orderInfoData = result.data
                $("#dateTime").text(orderInfoData.created) // 时间
                $('#title').text(orderInfoData.place_order_data.title && orderInfoData.place_order_data.title.value) // 标题
                $('#NumberWords').text((orderInfoData.place_order_data.word_num && orderInfoData.place_order_data.word_num.value)  + '字') // 字数
                $('#amountText1').text(orderInfoData.order_amount)
                if(orderInfoData.place_order_data.paper_type && orderInfoData.place_order_data.paper_type.value && orderInfoData.short_name == 'zjcaigc') { // 论文类型
                    $('.Subject').show()
                    $('#PaperTypeName').text(orderInfoData.place_order_data.paper_type.value)
                }else {
                    $('.Subject').hide()
                    $('#PaperTypeName').text('')
                }
                if(orderInfoData.short_name == 'scirs'){
                    $(".title_block").hide()
                    is_SCIRS = true
                }else{
                    $(".title_block").show()
                }
            }else if(result.code == 3001) {
                toast({msg: '订单已支付'})
                window.location.href = "./query.html?oid=" + (getQueryVariable('order_sn') || getQueryVariable('commitId'));
            }else {
                closeMsg()
                cocoMessage.error(result.codeMsg, 2000)
            }
        }
    });
})()
