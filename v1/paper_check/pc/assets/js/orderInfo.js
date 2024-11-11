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
                // 订单信息
                $(".time-t").text(orderInfoData.created)
                $(".wordNum-t").text(orderInfoData.place_order_data.word_num && orderInfoData.place_order_data.word_num.value)
                if(orderInfoData.unit_type == '篇'){
                    $(".wordNum-t").text('1篇')
                }
                $(".title-t").text(orderInfoData.place_order_data.author && orderInfoData.place_order_data.author.value)
                $(".system-t").text(orderInfoData.goods_name)
                $(".price-amount").text(orderInfoData.order_amount)
            }else if(result.code == 3001) {
                cocoMessage.success('订单已支付', 2000)
                window.location.href = "./query.html?oid=" + (getQueryVariable('order_sn') || getQueryVariable('commitId'));
            }
        }
    });
})()
