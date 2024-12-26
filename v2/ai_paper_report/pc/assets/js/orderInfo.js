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
                $('#orderTitle').text(orderInfoData.place_order_data.title && orderInfoData.place_order_data.title.value) // 标题
                $('#NumberWords').text(orderInfoData.place_order_data.word_num && orderInfoData.place_order_data.word_num.value) // 字数
                $("#orderAmount2").text(orderInfoData.order_amount) // 订单信息金额
                $(".orderAmount").text(orderInfoData.order_amount) // 二维码右侧默认金额
                $('.typeTag').text(orderInfoData.goods_name).show()
                if( orderInfoData.goods_short_name == 'ktbgsenior') {
                    if( orderInfoData.place_order_data.education.value == 'dz' ) {
                        $('.typeTagKTBG').text('大专').show()
                    }
                    if( orderInfoData.place_order_data.education.value == 'bk' ) {
                        $('.typeTagKTBG').text('本科').show()
                    }
                    if( orderInfoData.place_order_data.education.value == 'ss' ) {
                        $('.typeTagKTBG').text('硕士').show()
                    }
                }
                $('.typeTag').text(orderInfoData.goods_name).show()
                if(orderInfoData.place_order_data.paper_type && orderInfoData.place_order_data.paper_type.value && orderInfoData.short_name == 'zjcaigc') { // 论文类型
                    $('#PaperType').show()
                    $('.PaperTypeName').text(orderInfoData.place_order_data.paper_type.value)
                }
            }else if(result.code == 3001) {
                cocoMessage.success('订单已支付', 2000)
                window.location.href = "./query.html?oid=" + (getQueryVariable('order_sn') || getQueryVariable('commitId'));
            }else {
                closeMsg()
                cocoMessage.error(result.codeMsg, 2000)
            }
        }
    });
})()
