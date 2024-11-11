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
                $('#title').text(orderInfoData.place_order_data.title.value)
                $('#NumberWords').text(orderInfoData.place_order_data.word_num && orderInfoData.place_order_data.word_num.value + '字')
                $('#dateTime').text(orderInfoData.created)
                $('#amountText').text(orderInfoData.order_amount)
                if(orderInfoData.goods_short_name == 'lwjc'){
                    if(getQueryVariable('bgjc') == 'bgjc') {
                        $("#typeTag").text('降查重率-报告降重')
                    }else{
                        $("#typeTag").text('降查重率-全文降重')
                    }
                }
                if(orderInfoData.goods_short_name == 'aigclwjc'){
                    if(getQueryVariable('bgjc') == 'bgjc') {
                        $("#typeTag").text('降AIGC率-报告降重')
                    }else{
                        $("#typeTag").text('降AIGC率-全文降重')
                    }
                }
            }else if(result.code == 3001) {
                toast({msg: '订单已支付'})
                window.location.href = "./query.html?oid=" + (getQueryVariable('order_sn') || getQueryVariable('commitId'));
            }
        }
    });
})()
