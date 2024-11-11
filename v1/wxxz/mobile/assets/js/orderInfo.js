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
                $("#goodsName").text(orderInfoData.goods_name)
                $('#amountText , #amountTextTop').text('￥'+orderInfoData.order_amount)
                $('#amountText').text(orderInfoData.order_amount)
            }else if(result.code == 3001) {
                toast({msg: '订单已支付'})
                window.location.href = "./query.html?oid=" + (getQueryVariable('order_sn') || getQueryVariable('commitId'));
            }
        }
    });
})()
