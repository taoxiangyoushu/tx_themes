var urls = 'https://api.taoxiangyoushu.com'

function getFormData (object) { // 转FromData 对象
    const formData = new FormData()
    Object.keys(object).forEach(key => {
        const value = object[key]
        if (Array.isArray(value)) {
            value.forEach((subValue, i) =>
                formData.append(key + `[${i}]`, subValue)
            )
        } else {
            formData.append(key, object[key])
        }
    })
    return formData
}

// 封装url参数获取
function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return decodeURI(pair[1]);}
    }
    return(false);
}

var time = 60
var permit = true // 是否允许请求
var timeout = null;
$('.VerificationCode').click(function() {
    if(!permit) return
    const regex = /^1[3456789]\d{9}$/;
    var phone = $('.phoneInput').val()
    var formData ={}
    if(regex.test(phone)) {
        formData =  getFormData({
            phone: phone,
            scenes_id: $(this).attr('data'),
            _session_type: 'user'
        })
        $('.VerificationCode').addClass('forbid')
        $('.VerificationCode').html('剩余<span></span>')
        time = 60
        counDown()
        $.ajax({
            type : 'post',
            url : urls+"/api/verify_code/get_phone_validate?_session_type=user",
            processData : false,
            contentType : false,
            xhrFields: {
                        withCredentials: true
                    },
            data : formData,
            success : function(result) {
                if(result.code == 200) {
                    toast('已发送到指定手机号,请注意查收')
                }else if(result.code == -1) {
                    toast({
                        msg: result.codeMsg,
                        type: 'error',
                        time: 2000
                    })
                }else {
                    toast({
                        msg: '获取失败',
                        type: 'error',
                        time: 2000
                    })
                }
            },
        });
    }else {
        toast('请输入正确的手机号')
        return
    }
})

function counDown() {
    permit = false
    if (time === 0) {
        time = 60;
        $('.VerificationCode').html('发送验证码')
        $('.VerificationCode').removeClass('forbid')
        permit = true
        clearTimeout(timeout)
        return;
    } else {
        time--;
        $('.VerificationCode>span').text(time+'S');
    }
    timeout = setTimeout(function() {
        counDown();
    },1000);
}


// 当日和当月数据
function DataCalculation() {
    var DayCoefficient = [
        2,
        8,
        6
    ]
    var Dates = new Date()
    var currentHour = Dates.getHours(); // 当前小时
    var Day = Dates.getDate(); // 当天日
    var TodayData = 10
    for(var i=0; i<currentHour; i++) {
        TodayData+=(DayCoefficient[i<8? 0:[i>18? 2:1]])
    }
    $('.TodayQuantity').text(TodayData + currentHour)
    var MonthData = 50
    for(var k=0; k<Day; k++) {
        MonthData+=150
    }
    $('.MonthQuantity').text(MonthData)
}
DataCalculation()



$(window).scroll(function() {
	scrollTop($(this))
});
function scrollTop(this_) {
	if(this_.scrollTop() > 30) { 
        $('.navbarBox').addClass('scrollCS')
    }else {
        $('.navbarBox').removeClass('scrollCS')
	}
}
scrollTop($(window))