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
                $('#author').text(orderInfoData.place_order_data.author && orderInfoData.place_order_data.author.value) // 作者
                $('#amountText').text(orderInfoData.order_amount) // 金额
            }else if(result.code == 3001) {
                toast({msg: '订单已支付'})
                window.location.href = "./query.html?oid=" + (getQueryVariable('order_sn') || getQueryVariable('commitId'));
            }
        }
    });
})()
