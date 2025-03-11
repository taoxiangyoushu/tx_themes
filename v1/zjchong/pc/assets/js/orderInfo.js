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
                $(".wordsNm").text(orderInfoData.place_order_data.word_num && orderInfoData.place_order_data.word_num.value)
                $(".tit").text(orderInfoData.place_order_data.title.value)
                if(orderInfoData.goods_short_name=='aigclwjc') {
                    $(".cjwt-jc").hide()
                    $(".cjwt-aigc").show()
                    $(".jcReport").hide()
                    $(".aigcReport").show()
                    if(getQueryVariable('fileInputType') =='zips') {
                        $(".file-type").text('降AIGC率-报告降AI率')
                    }else{
                        $(".file-type").text('降AIGC率-全文降AI率')
                    }
                }
                if(orderInfoData.goods_short_name=='lwjc'){
                    $(".cjwt-jc").show()
                    $(".cjwt-aigc").hide()
                    $(".jcReport").show()
                    $(".aigcReport").hide()
                    if(getQueryVariable('fileInputType') =='zips') {
                        $(".file-type").text('降查重率-报告降重')
                    }else{
                        $(".file-type").text('降查重率-全文降重')
                    }
                }
            }else if(result.code == 3001) {
                cocoMessage.success('订单已支付', 2000)
                window.location.href = "./query.html?oid=" + (getQueryVariable('order_sn') || getQueryVariable('commitId'));
            }
        }
    });
})()
