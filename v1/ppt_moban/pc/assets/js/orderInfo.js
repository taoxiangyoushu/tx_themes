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
                //  订单信息
                $(".order-time").text(orderInfoData.created)
                $(".order-totalPrice").text(orderInfoData.order_amount + '元')
            }else if(result.code == 3001) {
                cocoMessage.success('订单已支付', 2000)
                window.location.href = "./query.html?oid=" + (getQueryVariable('order_sn') || getQueryVariable('commitId'));
            }
        }
    });
})()
