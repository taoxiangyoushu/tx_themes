    // 类型10收入;20支出
    var typeData = [
        {
            name: '全部',
            id: ''
        },
        {
            name: '收入',
            id: '10'
        },
        {
            name: '支出',
            id: '20'
        }
    ]
    var selectObj2 = $("#basic2");
    selectObj2.find("option:not(:first)").remove();
    for (var i=0; i<typeData.length; i++) {
        selectObj2.append(new Option(typeData[i].name, typeData[i].id));
    }
    selectObj2.selectpicker('refresh');
    $('#basic2').on('hidden.bs.select', function(e) {
        var tmpSelected = $('#basic2').val();
        if (tmpSelected != null) {
            $('#roleidsxbg').val(tmpSelected);
        } else {
            $('#roleidsxbg').val("");
        }
    });


    // 提现方式
    var typeData3 = [
        {
            name: '全部',
            id: ''
        },
        {
            name: '微信',
            id: '10'
        },
        {
            name: '支付宝',
            id: '20'
        },
        {
            name: '银行转账',
            id: '30'
        }
    ]
    var selectObj3 = $("#basic3");
    selectObj3.find("option:not(:first)").remove();
    for (var i=0; i<typeData3.length; i++) {
        selectObj3.append(new Option(typeData3[i].name, typeData3[i].id));
    }
    selectObj3.selectpicker('refresh');
    $('#basic3').on('hidden.bs.select', function(e) {
        var tmpSelected = $('#basic3').val();
        if (tmpSelected != null) {
            $('#mode').val(tmpSelected);
        } else {
            $('#mode').val("");
        }
    });


    // 状态
    var typeData4 = [
        {
            name: '全部',
            id: ''
        },
        {
            name: '提现中',
            id: '10'
        },
        {
            name: '已提现',
            id: '30'
        },
        {
            name: '提现失败',
            id: '40'
        },
        {
            name: '申诉中',
            id: '50'
        },
        {
            name: '申诉成功',
            id: '51'
        },
        {
            name: '申诉失败',
            id: '52'
        }
    ]
    var selectObj4 = $("#basic4");
    selectObj4.find("option:not(:first)").remove();
    for (var i=0; i<typeData4.length; i++) {
        selectObj4.append(new Option(typeData4[i].name, typeData4[i].id));
    }
    selectObj4.selectpicker('refresh');

    $('#basic4').on('hidden.bs.select', function(e) {
        var tmpSelected = $('#basic4').val();
        if (tmpSelected != null) {
            $('#typeStatus').val(tmpSelected);
        } else {
            $('#typeStatus').val("");
        }
    });


    $('#date1').datetimepicker({minView: 2, language: "zh-CN"});
    $('#date2').datetimepicker({minView: 2, language: "zh-CN"});
    $('#date3').datetimepicker({minView: 2, language: "zh-CN"});
    $('#date4').datetimepicker({minView: 2, language: "zh-CN"});
    $('#date5').datetimepicker({minView: 2, language: "zh-CN"});
    $('#date6').datetimepicker({minView: 2, language: "zh-CN"});

    // 分页初始化
    function loadData(num) {
        $("#PageCount").val(num);
        if(num) {
            $('.PageCountDiv').show()
            $('.PageCountText').text(num)
        }else {
            $('.PageCountDiv').hide()
        }
    }

    // 保存海报
    $(document).ready(function(){
        $("#btn").on("click", function () {
            if (/MicroMessenger/.test(window.navigator.userAgent)) {  // 微信浏览器
                cocoMessage.success( 2000, "长按海报图片, 可保存海报");
            }else {
                window.open(urls + "/api/client/distribution/poster_download?user_token="+USER_TOKEN+"&jane_name="+JANE_NAME+"&isDownload=1&_session_type=user&domain="+window.location.origin)
            }
        });
    })

    // 复制链接
    $(".copy_pop").on('click',function (){
        var text = $(".orderId_pop #orderId_pop_id").val()
        $("#copyInput").val(text)
        $("#copyInput").select()
        try {
            var state = document.execCommand("copy");
        } catch (err) {
            var state = false;
        }
        if (state) {
            cocoMessage.success(1000, "复制成功", function() {
            });
        } else {
            cocoMessage.error(1000, "复制失败", function() {
            });
        }
    })
    // 复制海报
    $(".copy_pop3").on('click',function (){
        var text = $(".DownloadPoster1").data('poster')
        $("#copyInput").val(text)
        $("#copyInput").select()
        try {
            var state = document.execCommand("copy");
        } catch (err) {
            var state = false;
        }
        if (state) {
            cocoMessage.success(1000, "复制成功", function() {
            });
        } else {
            cocoMessage.error(1000, "复制失败", function() {
            });
        }
    })
    $(".copy_pop2").on('click',function (){
        var text = $(".orderId_pop2").text()
        $("#copyInput").val(text)
        $("#copyInput").select()
        try {
            var state = document.execCommand("copy");
        } catch (err) {
            var state = false;
        }
        if (state) {
            cocoMessage.success(1000, "复制成功", function() {
            });
        } else {
            cocoMessage.error(1000, "复制失败", function() {
            });
        }
    })
    