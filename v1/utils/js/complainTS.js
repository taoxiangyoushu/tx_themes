var urlTS = 'https://api.taoxiangyoushu.com';
// var urlTS = 'http://api.project_libraries.report';
// 使用方法

// var Floating = new Floating ({
//     num  : 3, // 可传图片数量
//     width: 70, // 上传图片展示宽度
//     height: 70, // 上传图片展示高度
//     maxSize: 5120, // 图片最大上传大小
//     complaintApply: "/api/client/complaint/apply?user_token="+window.USER_TOKEN+"&jane_name="+window.JANE_NAME, // 投诉提交链接
//     complaintList: '/api/client/complaint/list?user_token=' + window.USER_TOKEN+"&jane_name="+window.JANE_NAME, // 投诉提交历史
// });
function getJsParam(jsName, paramName) {
    /*******************************************
    说明：获取js文件后的参数
            jsName：js文件名称
            paramName：要获取的参数名称（如果该参数没有传，则返回整个js参数的数组Json对象）
    ********************************************/
    var retJsonArr = [],
        retVal = '';

    var rName = new RegExp(jsName + "(\\?(.*))?$");
    var jss = document.getElementsByTagName('script');
    for (var i = 0; i < jss.length; i++) {
        var j = jss[i];
        if (j.src && j.src.match(rName)) {
            var oo = j.src.match(rName)[2];
            if (oo && (t = oo.match(/([^&=]+)=([^=&]+)/g))) {
                for (var l = 0; l < t.length; l++) {
                    r = t[l];
                    var tt = r.match(/([^&=]+)=([^=&]+)/);
                    if (tt) {
                        retJsonArr.push({ key: tt[1], val: tt[2] });

                        if (paramName != undefined && paramName.length > 0 && paramName == tt[1]) {
                            retVal = tt[2];
                        }
                    }
                }
            }
        }
    }
    return paramName != undefined && paramName.length > 0 ? retVal : retJsonArr;
}
function getFormData(object) {
    // 转FromData 对象
    var formData = new FormData();
    Object.keys(object).forEach(function (key) {
        var value = object[key];
        if (Array.isArray(value)) {
            value.forEach(function (subValue, i) {
                formData.append(key + "[" + i + "]", subValue);
            });
        } else {
            formData.append(key, object[key]);
        }
    });
    return formData;
}
function remove(el) {
    var toRemove = document.querySelector(el);
    if(toRemove) {
        toRemove.parentNode.removeChild(toRemove);
    }
}

var uploadImgArr = [];
var uploadingImg = false;
// 随机字符串
function randomRange(min, max){
	var returnStr = "",
		range = (max ? Math.round(Math.random() * (max-min)) + min : min),
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	for(var i=0; i<range; i++){
		var index = Math.round(Math.random() * (arr.length-1));
		returnStr += arr[index];
	}
	return returnStr;
}
var complaintRandomString = ''
if(window.localStorage.getItem('complaintRandomString')){
	complaintRandomString = window.localStorage.getItem('complaintRandomString')
}else{
	complaintRandomString = randomRange(12)
	window.localStorage.setItem('complaintRandomString',complaintRandomString)
}
var FloatingBox = {}

FloatingBox.isMobile = function() {
    // const reg = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    // return reg.test(navigator.userAgent);
    return screen.width < 768;
}
   
FloatingBox.showPopPanel = function() {
    if(FloatingBox.isMobile()) {
        document.querySelector(".mask").style.display = 'block'
    }
    document.querySelector(".complainRecord").style.display = 'none'
    if(document.querySelector(".complainForm").style.display == "none") {
        document.querySelector(".complainForm").style.display = 'block'
    }else {
        document.querySelector(".complainForm").style.display = 'none'
    }
    document.getElementById('contenteditable_s').value = (localStorage.getItem('oid') || '')
}
FloatingBox.delete = function() {
    if(FloatingBox.isMobile()) {
        document.querySelector(".mask").style.display = 'none'
    }
    document.querySelector(".complainForm").style.display = 'none'
}
FloatingBox.inputClick= function(this_) {
    document.querySelector('.labelTitle1').classList.remove('selected');
    document.querySelector('.labelTitle2').classList.remove('selected');
    document.querySelector('.labelTitle3').classList.remove('selected');
    document.querySelector('.'+this_).classList.add('selected');
    var selectedInput_s = document.querySelector('.radioBox .selected input').value
    if(selectedInput_s!=30) {
        document.querySelector('.orderNumber').style.display = 'inline-block'
    }else {
        document.querySelector('.orderNumber').style.display = 'none'
    }
}
FloatingBox.deleteRecord = function() {
    if(FloatingBox.isMobile()) {
        document.querySelector(".mask").style.display = 'none'
    }
    document.querySelector(".complainForm").style.display = 'none'
    document.querySelector(".complainRecord").style.display = 'none'
}
FloatingBox.complaintOidMouseenter = function() {
    document.querySelector(".complaint-orderId").style.display = 'block'
}
FloatingBox.complaintOidMouseleave = function() {
    document.querySelector(".complaint-orderId").style.display = 'none'
}

FloatingBox.locationOrigin = function() {
    return window.location.origin
}
FloatingBox.complaintList = function(data, success) {
    var xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    xhr.open('POST', urlTS + Floating.opt.complaintList, true);
    // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                success(xhr)
            } else {
                alert('数据获取失败!')
                return false
            }
        }
    }
},
FloatingBox.complaintList_api = function(data, success) {
    var xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    xhr.open('POST', urlTS + Floating.opt.complaintApply, true);
    // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                success(xhr)
            } else {
                throttling = true
                return alert('数据获取失败!')
            }
        }
    }
},


FloatingBox.feedbackHistory = function() {
    if(FloatingBox.isMobile()) {
        document.querySelector(".mask").style.display = 'block'
    }
    document.querySelector(".complainForm").style.display = 'none'
    document.querySelector(".complainRecord").style.display = 'block'
    document.querySelector(".formMain section").style.display = 'block'
    remove('.complain-item');

    var formdata = new FormData()
    formdata.append('page',1)
    formdata.append('limit', 100)
    formdata.append('token',complaintRandomString);
    formdata.append('jane_name',window.JANE_NAME)
    formdata.append('user_token',window.USER_TOKEN)
    // 
    formdata.append('source',FloatingBox.locationOrigin());
    FloatingBox.complaintList(formdata, function(res) {
        var resData = JSON.parse(res.responseText)
        if(resData.code !== 200){
            alert(resData.codeMsg)
            return false
        }else {
            var obj = {}
            var resData = resData.data
            if(resData.length > 0){
                document.querySelector('.formMain-sc').innerHTML = ''
                for(var i=0; i<resData.length; i++){
                    var element = ''
                    var answer = ''
                    if(resData[i].status == 60) {
                        if(!resData[i].answer_content) {
                            answer = '投诉已处理完成'
                        }else{
                            answer = resData[i].answer_content
                        }
                    }else if(resData[i].status == 10){
                        answer = '客服正在处理中，请稍后刷新.....'
                    }else{
                        answer = resData[i].answer_content
                    }

                    element += '<div class="complain-item">' +
                        '                    <div class="requestBox">' +
                        '                        <p class="text">' +
                        '                            <span class="ask">问</span>' +
                                                     resData[i].feedback_reason +
                        '                        </p>' +
                        '                        <div id="requestBoxImg'+ resData[i].id +'" class="requestBox-Img"></div>' +
                        '                    </div>' +
                        '                    <div class="answer">' +
                        '                        <p class="text">' +
                        '                            <span class="reply">答</span>' +
                                                      answer +
                        '                        </p>' +
                        '                        <div id="requestBoxImgA' + resData[i].id +'" class="requestBox-Img"></div>' +
                        '                    </div>' +
                        '                </div>'
                    // $('.formMain-sc').append(element)
                    // document.querySelector('.formMain-sc').appendChild(element)
                    document.querySelector('.formMain-sc').insertAdjacentHTML('beforeend',element)

                    if(resData[i].user_images.length > 0){
                        obj['requestBoxImg' + resData[i].id] = new Cupload ({
                            ele	 : '#requestBoxImg' + resData[i].id,
                            name : 'image',
                            num  : 3,
                            width: 70,
                            height: 70,
                            onlyShowBox: true,
                            data: resData[i].user_images
                        });
                    }
                    if(resData[i].answer_images.length > 0){
                        obj['requestBoxImgA' + resData[i].id] = new Cupload ({
                            ele	 : '#requestBoxImgA'  + resData[i].id,
                            name : 'image',
                            num  : 3,
                            width: 70,
                            height: 70,
                            onlyShowBox: true,
                            data: resData[i].answer_images
                        });
                    }
                }
                document.querySelector(".formMain section").style.display = 'none'
            }else{
                document.querySelector(".formMain section").style.display = 'none'
                document.querySelector('.complainRecord .formMain .formMain-sc').innerHTML += '<p class="complain-item">暂无反馈历史</p>'
            }
        }
    })
}

FloatingBox.submitFeedback = function (){
    document.querySelector(".complainForm").style.display = 'block'
    document.querySelector(".complainRecord").style.display = 'none'
    document.querySelector(".formMain section").style.display = 'none'
}

var throttling = true
FloatingBox.complainGenerate = function() {
    let regexp = /^1[3-9]\d{9}$/
    var CellPhone_s = document.getElementById('CellPhone_s').value
    var textarea_s = document.getElementById('textarea').value
    var contenteditable_s = document.getElementById('contenteditable_s').value
    var selectedInput_s = document.querySelector('.radioBox .selected input').value
    
    if(!CellPhone_s || !regexp.test(CellPhone_s)) {
        return alert('请输入正确的手机号')
    }

    if(textarea_s.length<15 || textarea_s.length>100) {
        return alert('请输入15至100字内的反馈内容')
    }

    if(selectedInput_s!=30 && !contenteditable_s) {
        return alert('请输入订单号')
    }
    if(!throttling) return
    throttling = false

    var formData = {
        order_sn: contenteditable_s,
        feedback_reason: textarea_s,
        label: selectedInput_s,
        phone: CellPhone_s,
        source: FloatingBox.locationOrigin(),
        user_images: uploadImgArr,
        token: complaintRandomString,
        jane_name:window.JANE_NAME,
        user_token:window.USER_TOKEN
    }
    var form_data = getFormData(formData)

    FloatingBox.complaintList_api(form_data, function(res) {
        var resData = JSON.parse(res.responseText)
        if(resData.code !== 200){
            alert(resData.codeMsg)
            throttling = true
            return false
        }else {
            throttling = true
            if(FloatingBox.isMobile()) {
                document.querySelector(".mask").style.display = 'none'
            }
            document.querySelector(".complainForm").style.display = 'none'
            document.getElementById('textarea').value = ''
            document.getElementById('CellPhone_s').value = ''
            var cuploadDeleteBtn = document.getElementsByClassName("cupload-delete-btn")
            for(var i=cuploadDeleteBtn.length-1; i>=0; i--){  //手动删除已上传图片
                cuploadDeleteBtn[i].click()
            }
            alert('已提交投诉')
            return false
        }
    })
}

var Floating = function(options) {
    //初始化 new对象
    if (!(this instanceof Floating)) {
        return new Floating(options)
    }
    var USER_TOKEN = getJsParam('complainTS.js' , 'user_token')
    //设置默认参数
    this.localValue = {
        complaintApply: '/api/client/complaint/apply',
        complaintList: '/api/client/complaint/list'
    }

    // 初始化css
    this.setCss();
    // 初始化html
    this.init();

    //参数覆盖
    this.opt = this.extend(this.localValue, options, true)
}


Floating.prototype = {
    setCss: function () {
        var textArr = [];
        if(FloatingBox.isMobile()) {
            textArr.push('.complainBox {');
            // textArr.push('  position: absolute;');
            // textArr.push('  bottom: 0;');
            textArr.push('  right: calc(50% - 25px);');
            textArr.push('  text-align: center;');
            textArr.push('  font-size: 14px;');
            textArr.push('}');
            textArr.push('.complainBox .complainForm,');
            textArr.push('.complainBox .complainRecord {');
            textArr.push('   display: none;');
            textArr.push('   position: fixed;');
            textArr.push('   right: 5%;');
            textArr.push('   top: 10vh;');
            textArr.push('   width: 90%;');
            textArr.push('   background-image: linear-gradient(0deg, #fafdff 0%, #ffffff 100%);');
            textArr.push('   box-shadow: 0px 0px 0.4rem 0px rgba(0, 0, 0, 0.09);');
            textArr.push('   border-radius: 1rem;');
            textArr.push('   text-align: left;');
            textArr.push('   z-index: 1000;');
            textArr.push('}');
            textArr.push('.complainBox .complainTS {');
            textArr.push('  padding: 3rem 0;');
            textArr.push('  color: #0075ff;');
            textArr.push('  font-size: 1.2rem;');
            textArr.push('  text-align: center;');
            textArr.push('}');
            textArr.push('.complainBox .complainTS img {');
            textArr.push('  width: 1.25rem;');
            textArr.push('  height: 1.25rem;');
            textArr.push('  margin-top: -2px;');
            textArr.push('}');
            textArr.push(' body {');
            textArr.push('position: relative;');
            textArr.push('}');
            textArr.push('            .complainBox .formMain {');
            textArr.push('                height: 64vh;');
            textArr.push('}');
        }else {
            textArr.push('.complainBox {');
            textArr.push('  position: fixed;');
            textArr.push('  top: calc(60% - 66px);');
            textArr.push('  right: 0;');
            textArr.push('  background-color: #ffffff;');
            textArr.push('  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.09);');
            textArr.push('  border-radius: 10px;');
            textArr.push('  text-align: center;');
            textArr.push('  font-size: 14px;');
            textArr.push('}');
            
            textArr.push('.complainBox .complainForm,.complainForm,.complainRecord {');
            textArr.push('  display: none;');
            textArr.push('  position: absolute;');
            textArr.push('  right: 72px;');
            textArr.push('  top: -150px;');
            textArr.push('  width: 334px;');
            textArr.push('  background-image: linear-gradient(0deg, #fafdff 0%, #ffffff 100%);');
            textArr.push('  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.09);');
            textArr.push('  border-radius: 10px;');
            textArr.push('  text-align: left;');
            textArr.push('}');

            textArr.push('  .complainBox .complainTS,');
            textArr.push('  .complainBox .delete,');
            textArr.push('  .complainBox .deleteRecord {');
            textArr.push('    cursor: pointer;');
            textArr.push('}');
            textArr.push('  .complainBox .complainTS {');
            textArr.push('    padding: 12px 15px 6px 15px;');
            textArr.push('}');
            textArr.push('            .complainBox .formMain {');
            textArr.push('                height: 390px;');
            textArr.push('}');
        }


        textArr.push('.complainBox .complainRecord .requestBox, .complainBox .complainRecord .answer {');
        textArr.push('  padding: 10px 12px 6px;');
        textArr.push('}');
        textArr.push('.complainBox .complainRecord .answer {');
        textArr.push('  background: #f2f5f9;');
        textArr.push('  border-radius: 6px;');
        textArr.push('}');
        textArr.push('.complainBox .complainRecord .requestBox-Img {');
        textArr.push('  margin-top: 10px;');
        textArr.push('}');
        textArr.push('.complainBox .complainRecord .text {');
        textArr.push('  position: relative;');
        textArr.push('  padding-left: 24px;');
        textArr.push('  text-align: justify;');
        textArr.push('  color: #333333;');
        textArr.push('}');
        textArr.push('.complainBox .complainRecord .text span.ask {');
        textArr.push('  display: inline-block;');
        textArr.push('  color: #006dff;');
        textArr.push('  padding: 1px 3px 1px;');
        textArr.push('  background: #d7edff;');
        textArr.push('  border: 1px solid #006dff;');
        textArr.push('  font-size: 12px;');
        textArr.push('  position: absolute;');
        textArr.push('  left: 0;');
        textArr.push('  line-height: normal;');
        textArr.push('}');
        textArr.push('.complainBox .complainRecord .text span.reply {');
        textArr.push('    display: inline-block;');
        textArr.push('    color: #ed8e28;');
        textArr.push('    padding: 1px 3px 1px;');
        textArr.push('    background: #ffd7ac;');
        textArr.push('    border: 1px solid #ed8e28;');
        textArr.push('    font-size: 12px;');
        textArr.push('    position: absolute;');
        textArr.push('    left: 0;');
        textArr.push('    line-height: normal;');
        textArr.push('}');
        textArr.push('  .complainBox .hader_S {');
        textArr.push('    padding: 13px;');
        textArr.push('    color: #333333;');
        textArr.push('    font-size: 16px;');
        textArr.push('    border-bottom: 1px solid #f4f4f4;');
        textArr.push('    font-weight: bold;');
        textArr.push('    position: relative;');
        textArr.push('}');
        textArr.push('  .complainBox .hader_S img {');
        textArr.push('    float: right;');
        textArr.push('    width: 11px;');
        textArr.push('    height: 11px;');
        textArr.push('    margin-top: 6px;');
        textArr.push('  }');
        textArr.push('  .complainBox .complaint-orderId {');
        textArr.push('    position: absolute;');
        textArr.push('    left: -390px;');
        textArr.push('    background: #fff;');
        textArr.push('    top: 0px;');
        textArr.push('    width: 379px;');
        textArr.push('    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.23);');
        textArr.push('    border-radius: 10px;');
        textArr.push('    padding: 6px 10px 6px;');
        textArr.push('    display: none;');
        textArr.push('  }');
        textArr.push('  .complainBox .complaint-orderId p {');
        textArr.push('    margin: 4px 0;');
        textArr.push('}');
        textArr.push('  .complainBox .complaint-oid {');
        textArr.push('    font-size: 12px;');
        textArr.push('    color: #a3a3a3 !important;');
        textArr.push('    cursor: pointer;');
        textArr.push('}');
        textArr.push('  .complainBox .complaint-tips {');
        textArr.push('    width: 15px;');
        textArr.push('    vertical-align: sub;');
        textArr.push('    margin-right: 2px;');
        textArr.push('}');
        textArr.push('  .complainBox .formMain {');
        textArr.push('    padding: 7px 14px 0 14px;');
        textArr.push('    overflow-y: auto;');
        textArr.push('    margin-bottom: 10px;');
        textArr.push('}');
        textArr.push('  .complainBox .formMain .label_s {');
        textArr.push('    font-weight: 400;');
        textArr.push('    text-align: left;');
        textArr.push('    width: 100%;');
        textArr.push('}');
        textArr.push('  .complainBox .contenteditable_s {');
        textArr.push('    float: none;');
        textArr.push('    width: 100%;');
        textArr.push('}');
        textArr.push('  .complainBox .formMain .label_s span {');
        textArr.push('    color: #ff1e1e;');
        textArr.push('}');
        textArr.push('  .complainBox .formMain p.complain-item {');
        textArr.push('    text-align: center;');
        textArr.push('    font-size: 14px;');
        textArr.push('    color: #333333;');
        textArr.push('    margin-top: 100px;');
        textArr.push('}');
        textArr.push('  .complainBox .formMain #textarea {');
        textArr.push('    max-width: 306px;');
        textArr.push('}');
        textArr.push('  .complainBox .formMain::-webkit-scrollbar {');
        textArr.push('    width: 6px;');
        textArr.push('    background-color: #F5F5F5;');
        textArr.push('}');
        textArr.push('  .complainBox .formMain::-webkit-scrollbar-thumb {');
        textArr.push('    border-radius: 10px;');
        textArr.push('    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);');
        textArr.push('    background-color: #4294f4;');
        textArr.push('}');
        textArr.push('  .complainBox .formMain::-webkit-scrollbar-track {');
        textArr.push('    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);');
        textArr.push('    border-radius: 10px;');
        textArr.push('    background-color: #F5F5F5;');
        textArr.push('}');
        textArr.push('  .complainBox .kind {');
        textArr.push('    margin-bottom: 8px;');
        textArr.push('}');
        textArr.push('  .complainBox .radioData .radioBox {');
        textArr.push('    overflow: hidden;');
        textArr.push('}');
        textArr.push('  .complainBox .radioData input {');
        textArr.push('    display: none;');
        textArr.push('}');
        textArr.push('  .complainBox .radioData .radio {');
        textArr.push('    float: left;');
        textArr.push('    margin: 0 10px 0 0;');
        textArr.push('}');
        textArr.push('  .complainBox .radioData .radio label {');
        textArr.push('    background-color: #f5f5f5;');
        textArr.push('    padding: 6px 7px 4px 7px;');
        textArr.push('    color: #666666;');
        textArr.push('    font-size: 12px;');
        textArr.push('    font-weight: 400;');
        textArr.push('    cursor: pointer;');
        textArr.push('  }');
        textArr.push('  .complainBox .radioData .radio .selected {');
        textArr.push('    background-color: #e4f4ff;');
        textArr.push('    color: #006dff;');
        textArr.push('  }');
        textArr.push('  .complainBox .btn-primary {');
        textArr.push('    width: 100%;');
        textArr.push('    background-color: #006fff !important;');
        textArr.push('    border-radius: 4px;');
        textArr.push('    color: #fff;');
        textArr.push('    border: 0 !important;');
        textArr.push('    outline: auto !important;');
        textArr.push('    outline-offset: 0 !important;');
        textArr.push('    margin-top: 22px;');
        textArr.push('  }');
        textArr.push('  .complainBox .btn-primary:hover {');
        textArr.push('      background-color: #035acc !important;');
        textArr.push('  }');
        textArr.push(' .complainBox .has-success .form-control {');
        textArr.push('    border-color: #ccc !important;');
        textArr.push('    box-shadow: none !important;');
        textArr.push('}');
        textArr.push('  .complainBox .btn {');
        textArr.push('    padding: 8px 12px;');
        textArr.push('}');

        textArr.push('  .complainBox .Picture_s p {');
        textArr.push('    color: #8d8d8d;');
        textArr.push('    font-size: 12px;');
        textArr.push('}');
        textArr.push('  .complainBox .feedbackHistory {');
        textArr.push('    color: #006fff;');
        textArr.push('    font-size: 14px;');
        textArr.push('    font-weight: normal;');
        textArr.push('    margin-bottom: 6px;');
        textArr.push('    margin-top: 0px;');
        textArr.push('    text-align: center;');
        textArr.push('    position: absolute;');
        textArr.push('    top: 14px;');
        textArr.push('    right: 40px;');
        textArr.push('}');
        textArr.push('  .complainBox .feedbackHistory span {');
        textArr.push('    cursor: pointer;');
        textArr.push('}');
        textArr.push('  .complainBox .feedbackHistory span:hover {');
        textArr.push('    color: #1a5aad;');
        textArr.push('}');
        textArr.push('  .complainBox .form-group.groupSubmit {');
        textArr.push('    text-align: right;');
        textArr.push('    margin-top: -20px;');
        textArr.push('}');
        textArr.push('  .complainBox .complaint-oid {');
        textArr.push('    font-size: 12px;');
        textArr.push('    color: #a3a3a3 !important;');
        textArr.push('    cursor: pointer;');
        textArr.push('}');

        textArr.push('  .complainBox .complaint-tips {');
        textArr.push('    width: 15px;');
        textArr.push('    vertical-align: sub;');
        textArr.push('    margin-right: 2px;');
        textArr.push('}');

        textArr.push('     .complainBox .complaint-orderId {');
        textArr.push('        position: absolute;');
        textArr.push('       left: -390px;');
        textArr.push('        background: #fff;');
        textArr.push('        top: 0px;');
        textArr.push('        width: 379px;');
        textArr.push('        box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 23%);');
        textArr.push('        border-radius: 10px;');
        textArr.push('        padding: 6px 10px 6px;');
        textArr.push('        display: none;');
        textArr.push('}');

        textArr.push('  .complainBox .complaint-orderId p {');
        textArr.push('            margin: 4px 0;');
        textArr.push('}');

        textArr.push('     .complainBox .orderIMG-s {');
        textArr.push('        width: 100%;');
        textArr.push('      }');

        textArr.push('  .tousu {');
        textArr.push('      margin: 0;');
        textArr.push('}');

        textArr.push('         .complainBox .label_s {');
        textArr.push('            line-height: 24px;');
        textArr.push('}');

        textArr.push('         .complainBox .form-control {');
        textArr.push('            display: block;');
        textArr.push('            width: 100%;');
        textArr.push('            padding: 6px 12px;');
        textArr.push('            font-size: 14px;');
        textArr.push('            line-height: 1.42857143;');
        textArr.push('            color: #555;');
        textArr.push('            background-color: #fff;');
        textArr.push('            background-image: none;');
        textArr.push('            border: 1px solid #ccc;');
        textArr.push('            border-radius: 4px;');
        textArr.push('            -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);');
        textArr.push('            box-shadow: inset 0 1px 1px rgba(0,0,0,.075);');
        textArr.push('            -webkit-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;');
        textArr.push('            -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;');
        textArr.push('            -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;');
        textArr.push('            transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;');
        textArr.push('            transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;');
        textArr.push('            transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;');
        textArr.push('            display: inline-block;');
        textArr.push('            outline: 0;');
        textArr.push('            border: solid 1px #eeeeee;');
        textArr.push('            border-radius: 10px;');
        textArr.push('            box-shadow: none;');
        textArr.push('}');

        textArr.push('         .complainBox #CellPhone_s {');
        textArr.push('            height: 38px;');
        textArr.push('}');

        textArr.push('         .complainBox #CellPhone_s::placeholder {');
        textArr.push('           font-size: 12px;');
        textArr.push('}');

        textArr.push('        * {');
        textArr.push('            -webkit-box-sizing: border-box;');
        textArr.push('            -moz-box-sizing: border-box;');
        textArr.push('            box-sizing: border-box;');
        textArr.push('}');

        textArr.push('         .complainBox .form-control:focus {');
        textArr.push('            border-color: #006cff;');
        textArr.push('}');

        textArr.push('          .complainBox .form-group {');
        textArr.push('            margin-bottom: 8px;');
        textArr.push('}');

        textArr.push('          .complainBox .form-group.form-group_s.kind.Picture_s {');
        textArr.push('            margin-bottom: 10px;');
        textArr.push('            margin-top: -3px;');
        textArr.push('}');

        textArr.push('.formMain section{');
        textArr.push('text-align: center;');
        textArr.push('margin-top: 50px;');
        textArr.push('}');
        
        var cssStr = textArr.join('\n');
        var style = document.createElement("STYLE");
        style.innerHTML = cssStr;
        document.getElementsByTagName("HEAD")[0].appendChild(style);
    },
    init: function () {
        var div = document.createElement("DIV");
        div.id = "floatingBox";
        var text = "";
        text += "    <div class=\"complainBox\">";
        if(FloatingBox.isMobile()) {
            text += "<div class=\"complainTS\" onclick=\"FloatingBox.showPopPanel(this)\">"
            text += "   <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAMAAAAc9R5vAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAEUUExURQAAAHOz/wBr/wBr/wBr/wBr/3Oz/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/3Oz/wBr/wBr/3Oz/3Oz/3Oz/3Oz/3Oz/3Oz/wBr/3Oz/wBr/3Oz/3Oz/3Oz/3Oz/wBr/wBr/wBr/3Oz/3Oz/wBr/3Oz/wBr/3Oz/3Oz/3Oz/3Oz/wBr/wBr/3Oz/3Oz/wBr/3Oz/3Oz/3Oz/3Oz/wBr/3Oz/3Oz/3Oz/3Oz/3Oz/wBr/wBr/3Oz/3Oz/wBr/wBr/3Oz/wBr/3Oz/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/3Oz/yiHLMMAAABadFJOUwDgFq0g+wrA8FDZ/RTMxPxPaNQRgkd4FwK6OcoBqjb7rB/9tQTXaSwOgoUD+JLD5D8dxRLucfF56VAM7AiUB89S9M2P0PUoSClm3N7dq9UDEcICqgkL+tFCPUuZdzsAAADeSURBVCjPY2CI5OOPQgFcggwgEMEahQFEQBK8mOJRrExAiShsQBSXBCdcgpUDArjRJPhCGSCAxwdVIhgqzhDEi2ZUODsEcKHbgdNynBJhUFfxo0kEhkAtD/BClfCFucrfCcyXgxvlB3WVN5inLIPVcm4tFUU2LBL6BtqaStJsGBLMxoZ60dHRsmgSrp4MliZA8WhGVAl7DxtbkHC0pDiDEJK4s52bC0hYXkyCgUEALmzhzuDgCDZGCuwnTlWorUwMVtYgcQVhmHd5WIBAA8gwBQrrqDFgAnMzI111KBsA21qNXEzrkv8AAAAASUVORK5CYII=\" alt=\"投诉\">"
            text += "   <span>投诉</span>"
            text += "</div>"
        }else {
            text += "        <div class=\"complainTS\" onclick=\"FloatingBox.showPopPanel(this)\">";
            text += "            <img src=\""+'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAMAAAAc9R5vAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAEUUExURQAAAHOz/wBr/wBr/wBr/wBr/3Oz/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/3Oz/wBr/wBr/3Oz/3Oz/3Oz/3Oz/3Oz/3Oz/wBr/3Oz/wBr/3Oz/3Oz/3Oz/3Oz/wBr/wBr/wBr/3Oz/3Oz/wBr/3Oz/wBr/3Oz/3Oz/3Oz/3Oz/wBr/wBr/3Oz/3Oz/wBr/3Oz/3Oz/3Oz/3Oz/wBr/3Oz/3Oz/3Oz/3Oz/3Oz/wBr/wBr/3Oz/3Oz/wBr/wBr/3Oz/wBr/3Oz/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/wBr/3Oz/yiHLMMAAABadFJOUwDgFq0g+wrA8FDZ/RTMxPxPaNQRgkd4FwK6OcoBqjb7rB/9tQTXaSwOgoUD+JLD5D8dxRLucfF56VAM7AiUB89S9M2P0PUoSClm3N7dq9UDEcICqgkL+tFCPUuZdzsAAADeSURBVCjPY2CI5OOPQgFcggwgEMEahQFEQBK8mOJRrExAiShsQBSXBCdcgpUDArjRJPhCGSCAxwdVIhgqzhDEi2ZUODsEcKHbgdNynBJhUFfxo0kEhkAtD/BClfCFucrfCcyXgxvlB3WVN5inLIPVcm4tFUU2LBL6BtqaStJsGBLMxoZ60dHRsmgSrp4MliZA8WhGVAl7DxtbkHC0pDiDEJK4s52bC0hYXkyCgUEALmzhzuDgCDZGCuwnTlWorUwMVtYgcQVhmHd5WIBAA8gwBQrrqDFgAnMzI111KBsA21qNXEzrkv8AAAAASUVORK5CYII='+"\" alt=\"投诉\">";
            text += "            <p class=\"tousu\" style=\" margin: 0;\">投诉</p>";
            text += "        </div>";
        }

        text += "        <div class=\"complainForm\" style=\"display: none;\">";
        text += "            <div class=\"hader_S\">";
        text += "                <span>反馈建议</span>";
        text += "                <p class=\"feedbackHistory\" onclick=\"FloatingBox.feedbackHistory(this)\">";
        text += "                    <span>反馈建议记录</span>";
        text += "                </p>";
        text += "                <img class=\"delete\" onclick=\"FloatingBox.delete(this)\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVCRDRFQkUwQkYyRDExRUQ4NjQwODcyNkEyMTdDNTM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVCRDRFQkUxQkYyRDExRUQ4NjQwODcyNkEyMTdDNTM4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUJENEVCREVCRjJEMTFFRDg2NDA4NzI2QTIxN0M1MzgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUJENEVCREZCRjJEMTFFRDg2NDA4NzI2QTIxN0M1MzgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7fjP7SAAAENklEQVR42sSZWWgUQRCGx3HiHRON8cIDNRqf9clHhRADRiPeF+qDCt4HCBqjyW5EBEEEHwQRQVFRIjEREUVNghdKxBNZD/Yh6JtIPBGNWf/Cv2Fddqa797LgW5aZnp1/aqqrunp7RKNRB5YPVoNy0AkawVXwzfk/VgpWgrmgH3gFmsAJDx8DwVkwDQwCXfxeAo7xAXJpk0EdqKAjxcaAsaBDBK8AZaAXT+aBcWA7jx0FH3MoNgSqqCPeJoG1Lj5mAi/JxcVgE9gCinIUBiGGQZ7PmKki+BPDIJkNARvo7eIsihXv1YP5Ps5T1imC74FfAYPEu+vBVjA0S2JDFNtDM7ZZBN+i6CArpKe3gWEZFDsR1IJFmnExcAGcFMERcAC0ai4qABsZHiMyFLP7wBLNOAnXBrBX0puKlxbQzYPTA17NAIqW80fA+zSywW6wTDNOQvWSEisH3LiTbXw9Sryf9WP22AFGpejZaqZTU7ERddBNGHQb1IAbGtF9GNM7wWhLsfL7Sw3C4CLHRuJPuEkG36enrzHY/UyKylqwi1XIRKyaYG7AOHHUeY59lXjS9ZmRSvQVjYjeYBVf2zhNzIbBPE2edbhMCCcT62ie9CFrepPmBn0502XGT7Ast4l2Guz3E6sTLNbOp202EL2Ib6XEstwqO0OxkaBBnkHsPaL3xGZrJuJifg/RGXWGFewcx77RifEMZ/cTQ9EewyOfIisNxKoJ9sZEiGeRkp5wcjkaIT3BHIPfizF1yW++NhVhI1jsKdjD1FNJcalYF7uaGhuxqQgWe06viIdmGUwmbbnNtmAleg89VcE1hol9ZW6v1WWDVNNakL3kK22xuOZW4togl4IdTen2G9+dzg3TEawq2HSLa2YwHCamelMvTbFVlpMun4UkxkLxNhcetim3fgumBZy047Mt2LS7NRG9hAv5sdkSbNrdxrhYumywnl7O9fSYTMewbXer1h0/NA/Yi3t6UkwOgneZEKzaGpPutpFiVQWrZfmeHXAvEb2G1x/SNbauQTaoNuxuG5OU25d8gMsBu0sqptdxs2ZkqoLT6m7j7EVcu9WlaQLWcy9vuK3gtLvbBHsW5+nfmi0E6cY3+22LeQHd7XzD7jZsuOp6yizjsOD4TcT+FC0T+DD4EOThjHW3AU1A2KCxHUjREtNFfoIz2t0G2GMWH53oAsa0hMfgRMEZ724NGtt6g32PQfS07OcVqhgudcz3Z427WwNr51wRDeUB44q4l/cTHPW4c7PQ4AZW3a2F6H1802UB44YwT0ddTduuym2DbXdrYQ8oWte5yCJpnss0EpRnG7gUzIZYZffpkBbNgqmvGyDEr9xmy+5wfrT5nP8O7rlML68Teq0vcWIjTu6sjQngpvPvv7Ay4e6KVpl0J0AHV0xTnL9/g8na4FSOPJtoreAz18qVbKuug+Oi548AAwCYXQwivF+GuAAAAABJRU5ErkJggg==\" alt=\"关闭\">";
        text += "            </div>";
        text += "            <div class=\"complaint-orderId\">";
        text += "                <p>支付宝订单号</p>";
        text += "                <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjIAAAEZCAIAAAACLVhmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg3NDY3MkIwQkVFRDExRUQ4MzMzREEzMUI2MUE3QTVGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg3NDY3MkIxQkVFRDExRUQ4MzMzREEzMUI2MUE3QTVGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODc0NjcyQUVCRUVEMTFFRDgzMzNEQTMxQjYxQTdBNUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODc0NjcyQUZCRUVEMTFFRDgzMzNEQTMxQjYxQTdBNUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4rGKIoAADefElEQVR42ux9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\" alt=\"支付宝订单\" class=\"orderIMG-s\">";
        text += "                <p>微信订单号</p>";
        text += "                <img src=\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAZAAA/+EDL2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5MjFENDkxQUJGMjkxMUVEOEI5N0MwOUUzRUFEMEUzNSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MjFENDkxOUJGMjkxMUVEOEI5N0MwOUUzRUFEMEUzNSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NzQ2NzJCMEJFRUQxMUVEODMzM0RBMzFCNjFBN0E1RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4NzQ2NzJCMUJFRUQxMUVEODMzM0RBMzFCNjFBN0E1RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB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\" alt=\"微信订单\" class=\"orderIMG-s\">";
        text += "            </div>";
        text += "            <div class=\"formMain\">";
        text += "                <form class=\"complainFormBox clearfix\" id=\"complainFormBox\">";
        text += "                    <div class=\"kind radioData\">";
        text += "                        <label class=\"label_s\">分类</label>";
        text += "                        <div class=\"radioBox\">";
        text += "                            <div class=\"radio\">";
        text += "                                <label class=\"labelTitle labelTitle1 selected\">";
        text += "                                    <input type=\"radio\" onclick=\"FloatingBox.inputClick('labelTitle1')\" name=\"optionsRadios\" id=\"optionsRadios1\" value=\"10\" checked>";
        text += "                                    支付问题";
        text += "                                </label>";
        text += "                            </div>";
        text += "                            <div class=\"radio\">";
        text += "                                <label class=\"labelTitle labelTitle2\">";
        text += "                                    <input type=\"radio\" onclick=\"FloatingBox.inputClick('labelTitle2')\" name=\"optionsRadios\" id=\"optionsRadios2\" value=\"20\">";
        text += "                                    报告问题";
        text += "                                </label>";
        text += "                            </div>";
        text += "                            <div class=\"radio\">";
        text += "                                <label class=\"labelTitle labelTitle3\">";
        text += "                                    <input type=\"radio\" onclick=\"FloatingBox.inputClick('labelTitle3')\" name=\"optionsRadios\" id=\"optionsRadios3\" value=\"30\">";
        text += "                                    BUG反馈";
        text += "                                </label>";
        text += "                            </div>";
        text += "                        </div>";
        text += "                    </div>";
        text += "";
        text += "                    <div class=\"form-group form-group_s kind CellPhone_s\">";
        text += "                        <label class=\"label_s\"><span>*</span>手机号</label>";
        text += "                        <div>";
        text += "                            <input autocomplete=\"off\" class=\"form-control\" maxlength=\"11\" name=\"CellPhone_s\" type=\"text\" placeholder=\"请输入您的联系方式（手机号）\" id=\"CellPhone_s\" />";
        text += "                        </div>";
        text += "                        <span id=\"CellPhone_s_err\"></span>";
        text += "                    </div>";
        text += "";
        text += "                    <div class=\"form-group form-group_s kind textarea_s\">";
        text += "                        <label class=\"label_s\"><span>*</span>反馈内容</label>";
        text += "                        <div>";
        text += "                            <textarea id=\"textarea\" name=\"textarea\" class=\"form-control\" rows=\"3\"></textarea>";
        text += "                        </div>";
        text += "                        <span id=\"textarea_err\"></span>";
        text += "                    </div>";
        text += "";
        text += "                    <div class=\"form-group form-group_s kind Picture_s\">";
        text += "                        <label class=\"label_s\">相关图片</label>";
        text += "                        <div id=\"upload-P\"></div>";
        text += "                        <p>单张图片最大5M,最多上传3张图片</p>";
        text += "                    </div>";
        text += "";
        text += "                    <div class=\"form-group form-group_s kind contenteditable_s\">";
        text += "                        <label class=\"label_s\"><span class=\"orderNumber\">*</span>订单号";
        if(!FloatingBox.isMobile()) {
        text += "                            <span class=\"complaint-oid\" onmouseleave = \"FloatingBox.complaintOidMouseleave()\" onmouseenter=\"FloatingBox.complaintOidMouseenter()\">";
        text += "                                <img class=\"complaint-tips\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABFVJREFUWEfFl01sG0UUx9/zOlZi0QhOFRwQhaqVkDilSfk4tGmR+FCLyiHpAQ5U4qOiUiAJ88bLpdtL7ZlxlCoIEAUBlx4gBxCtWhAqbQ+A6tALqIdGNEU9gHoB1CIncrL70FjryF7v2pvmkJV88Mx7b37z3tuZ/yJs8IMbvD6kBpiZmemvVqtPIOKuTCazi5k3I+JmuwFmvoWIt4IguMTMl/L5/M9jY2O302wuFYBS6k1ElADwYJqgAHCTmZWU8oNu9h0BPM/L9vX1fYOIz4U7nUfE077vn8nlcn+urKz8Zcez2ez9tVrtAcdx9jHzfkTcFtqfW1xcfMHzvJUkkEQAY8woM38ROl4BgJNEdLLbjuy81vp1ALC/AfsfEQ8KIb6M840FMMbsYebzocMsEY2mWThqo7W2i46EEHuFED9EbdoARkZGnMHBwXrKmPmYlNKLCbwPAPYz854wuA18mojORG2VUh4iHrXjc3Nz2dnZWb/Zpg3AGKOZWSBiUQjxbqeA0bkkYGPMcWZ2EdEIISgRoFQqjWYyGVv3K0S0I2bxHYg418gOAHwS2rza2CUzD0opf4nJmh0bCILgYKFQWO2H1QxMT0/fu7y8bJvtYQB4I67htNafAcArzPyylPJU8yJa6w8B4DAAfE5Eh2IAbFN+BAALPT09A+Pj4//Wy9cwVEodQMSvAOAGEVmItkdrfQMAHgKArUR0vdmgXC4/GgTBVQD4g4i2JPgvAMAWZn5RSvl1C4AxZpqZ37ZpJaLXEgJcsONENBydL5fLNr02zZeJ6PEE/48BwJbrhBBiPArwIzM/6fv+sOu6F+MCdBozxpxlZntgjRHRe3G2xWJxt+M4FxDxJyHEUy0AWuvfAeARx3G2T05Ozq8FQGvNoX2FiHYm+U5NTW3zff8aAFwnoq3RDNxh5nuYuV9KeSctgNb6BAC8FZam49GulNqEiLcR8T8hxKZ1AxhjDjHzpwDwazabHZ6YmPi7E3hHgLspgdb6ewB4Ou61jAPpVoI1N2Gj9kSU6lrv2IRKqeOI6ALAFBG9k6YH1gqgtS4DwCQzF6WU9WN+lbxUKj2TyWS+ZeZ5KeX2lACJ50Kcv1LqmtUKQRA8WygUvmsBsJJraWnpt1D1xB7FaaCSbEKNYI/im729vY81JFtL7ULp9X7SZbROgPplxMxHmqVaW/Mopc6GEqyjEPE8rz+fz9fP82q1esDzvEQR2hAmzHxOSvl880baAKwOzOfzy9Yo6X63c8aYo8xcFyuI6AkhjiXUfVWQVKvVnqg+TJJkq3owSZgUi8X7HMe5bBf1fX+n67r/RAEaQiSEjNWFnURpsy5cryiN1YMtb0Fc+qw+HBoaKlqJFs5bPXDe9/1TCbL8JQDYa+/8cNemUqm4UR3YsQfiQEKpVgzVUpqXYSEIArdZeiU5pTpCrbOVbLVabbf9LAOAobhPMwCo2M+zXC53sSG5utGmBugW6G7nNxzgf58QQD+2nYJgAAAAAElFTkSuQmCC\" alt=\"\">什么是订单号";
        text += "                            </span>";
        }
        text += "                        </label>";
        text += "                        <div>";
        text += "                            <input autocomplete=\"off\" class=\"form-control\" maxlength=\"30\" name=\"contenteditable\" type=\"text\" placeholder=\"请输入您要反馈的订单号\" id=\"contenteditable_s\" />";
        text += "                        </div>";
        text += "                    </div>";
        text += "";
        text += "                    <div class=\"form-group groupSubmit\">";
        text += "                        <button type=\"button\" class=\"btn btn-primary complainGenerate\" onclick=\"FloatingBox.complainGenerate(this)\">去提交反馈</button>";
        text += "                    </div>";
        text += "";
        text += "                </form>";
        text += "            </div>";
        text += "        </div>";
        text += "        <div class=\"complainRecord\">";
        text += "            <div class=\"hader_S\">";
        text += "                <span>反馈建议记录</span>";
        text += "                <p class=\"feedbackHistory\" onclick=\"FloatingBox.submitFeedback(this)\">";
        text += "                    <span>提交反馈</span>";
        text += "                </p>";
        text += "                <img class=\"deleteRecord\" onclick=\"FloatingBox.deleteRecord(this)\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVCRDRFQkUwQkYyRDExRUQ4NjQwODcyNkEyMTdDNTM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVCRDRFQkUxQkYyRDExRUQ4NjQwODcyNkEyMTdDNTM4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUJENEVCREVCRjJEMTFFRDg2NDA4NzI2QTIxN0M1MzgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUJENEVCREZCRjJEMTFFRDg2NDA4NzI2QTIxN0M1MzgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7fjP7SAAAENklEQVR42sSZWWgUQRCGx3HiHRON8cIDNRqf9clHhRADRiPeF+qDCt4HCBqjyW5EBEEEHwQRQVFRIjEREUVNghdKxBNZD/Yh6JtIPBGNWf/Cv2Fddqa797LgW5aZnp1/aqqrunp7RKNRB5YPVoNy0AkawVXwzfk/VgpWgrmgH3gFmsAJDx8DwVkwDQwCXfxeAo7xAXJpk0EdqKAjxcaAsaBDBK8AZaAXT+aBcWA7jx0FH3MoNgSqqCPeJoG1Lj5mAi/JxcVgE9gCinIUBiGGQZ7PmKki+BPDIJkNARvo7eIsihXv1YP5Ps5T1imC74FfAYPEu+vBVjA0S2JDFNtDM7ZZBN+i6CArpKe3gWEZFDsR1IJFmnExcAGcFMERcAC0ai4qABsZHiMyFLP7wBLNOAnXBrBX0puKlxbQzYPTA17NAIqW80fA+zSywW6wTDNOQvWSEisH3LiTbXw9Sryf9WP22AFGpejZaqZTU7ERddBNGHQb1IAbGtF9GNM7wWhLsfL7Sw3C4CLHRuJPuEkG36enrzHY/UyKylqwi1XIRKyaYG7AOHHUeY59lXjS9ZmRSvQVjYjeYBVf2zhNzIbBPE2edbhMCCcT62ie9CFrepPmBn0502XGT7Ast4l2Guz3E6sTLNbOp202EL2Ib6XEstwqO0OxkaBBnkHsPaL3xGZrJuJifg/RGXWGFewcx77RifEMZ/cTQ9EewyOfIisNxKoJ9sZEiGeRkp5wcjkaIT3BHIPfizF1yW++NhVhI1jsKdjD1FNJcalYF7uaGhuxqQgWe06viIdmGUwmbbnNtmAleg89VcE1hol9ZW6v1WWDVNNakL3kK22xuOZW4togl4IdTen2G9+dzg3TEawq2HSLa2YwHCamelMvTbFVlpMun4UkxkLxNhcetim3fgumBZy047Mt2LS7NRG9hAv5sdkSbNrdxrhYumywnl7O9fSYTMewbXer1h0/NA/Yi3t6UkwOgneZEKzaGpPutpFiVQWrZfmeHXAvEb2G1x/SNbauQTaoNuxuG5OU25d8gMsBu0sqptdxs2ZkqoLT6m7j7EVcu9WlaQLWcy9vuK3gtLvbBHsW5+nfmi0E6cY3+22LeQHd7XzD7jZsuOp6yizjsOD4TcT+FC0T+DD4EOThjHW3AU1A2KCxHUjREtNFfoIz2t0G2GMWH53oAsa0hMfgRMEZ724NGtt6g32PQfS07OcVqhgudcz3Z427WwNr51wRDeUB44q4l/cTHPW4c7PQ4AZW3a2F6H1802UB44YwT0ddTduuym2DbXdrYQ8oWte5yCJpnss0EpRnG7gUzIZYZffpkBbNgqmvGyDEr9xmy+5wfrT5nP8O7rlML68Teq0vcWIjTu6sjQngpvPvv7Ay4e6KVpl0J0AHV0xTnL9/g8na4FSOPJtoreAz18qVbKuug+Oi548AAwCYXQwivF+GuAAAAABJRU5ErkJggg==\" alt=\"关闭\">";
        text += "            </div>";
        text += "            <div class=\"formMain\">";
        text += "                <section><span class=\"loader-59\"></span></section>";
        text += "                <div class=\"formMain-sc\"></div>";
        text += "            </div>";
        text += "        </div>";
        text += "    </div>";
        div.innerHTML = text
        document.body.appendChild(div);
    },
    //参数覆盖
    extend: function(o, n, override) {
        for (var key in n) {
            if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
                o[key] = n[key]
            }
        }
        return o
    },
}


var Cupload = function(options) {
    //初始化 new对象
    if (!(this instanceof Cupload)) {
        return new Cupload(options)
    }
    //设置默认参数
    this.localValue = {
        ele: '#cupload',
        name: 'image',
        num: 1,
        width: 148,
        height: 148,
        maxSize: 5120
    }
    //参数覆盖
    this.opt = this.extend(this.localValue, options, true)
    //所需变量
    this.i = 0;
    this.imageArr 		= new Array();//图片
    this.widthArr 		= new Array();//图片宽度
    this.heightArr 		= new Array();//图片高度
    this.imageBox 		= new Array();//图片盒子
    this.imagePreview 	= new Array();//图片预览
    this.imageInput 	= new Array();//图片input
    this.imageDelete 	= new Array();//图片删除遮罩
    this.deleteBtn 		= new Array();//图片删除按钮
    this.sortLeftBtn	= new Array();//图片左排序按钮
    this.sortRightBtn	= new Array();//图片右排序按钮
    if ((typeof options.ele) === "string") {
        this.opt.ele = document.querySelector(options.ele)
    } else {
        this.opt.ele = options.ele
    }
    this.initDom();
}


Cupload.prototype = {
    constructor: this,

    //初始化
    initDom: function() {
        this.cteateImageList()
        if(!this.opt.onlyShowBox){
            this.createUploadBox()
        }
        this.createOverlay()
        if (this.opt.data) {
            this.showImagePreview()
        }
    },

    //参数覆盖
    extend: function(o, n, override) {
        for (var key in n) {
            if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
                o[key] = n[key]
            }
        }
        return o
    },

    //创建图片列表
    cteateImageList: function() {
        this.imageList = document.createElement('ul')
        this.imageList.className = 'cupload-image-list'
        this.imageList.style.margin = 0
        this.imageList.style.padding = 0
        this.imageList.style.display = 'inline-block'
        this.imageList.style.minHeight = this.opt.height
        this.opt.ele.appendChild(this.imageList)
        this.imageList.ondragstart = function(event) {
            console.log('start')
        }
    },

    //创建上传框
    createUploadBox: function() {
        this.uploadBox = document.createElement('div')
        this.uploadBox.className = 'cupload-upload-box'
        this.uploadBox.style.position = 'relative'
        this.uploadBox.style.display = 'inline-block'
        this.uploadBox.style.textAlign = 'center'
        this.uploadBox.style.backgroundColor = '#fbfdff'
        this.uploadBox.style.border = '1px dashed #c0ccda'
        this.uploadBox.style.borderRadius = '6px'
        this.uploadBox.style.WebkitBoxSizing = 'border-box'
        this.uploadBox.style.boxSizing = 'border-box'
        this.uploadBox.style.width = this.opt.width + 'px'
        this.uploadBox.style.height = this.opt.height + 'px'
        this.uploadBox.style.lineHeight = this.opt.height + 'px'
        this.opt.ele.appendChild(this.uploadBox)
        this.createUploadBtn()
        this.createUploadInput()
        var _this = this
        this.uploadBox.onmouseover = function() {
            _this.uploadBox.style.borderColor = '#409eff'
        }
        this.uploadBox.onmouseout = function() {
            _this.uploadBox.style.borderColor = '#c0ccda'
        }
    },

    //创建遮罩
    createOverlay: function() {
        this.overlay = document.createElement('div')
        this.overlay.className = 'cupload-overlay'
        this.overlay.style.display = "none"
        this.overlay.style.position = "fixed"
        this.overlay.style.textAlign = "center"
        this.overlay.style.top = 0
        this.overlay.style.right = 0
        this.overlay.style.bottom = 0
        this.overlay.style.left = 0
        this.overlay.style.zIndex = 9115
        this.overlay.style.backgroundColor = "rgba(0,0,0,.3)"
        this.opt.ele.appendChild(this.overlay)
        var _this = this
        this.overlay.onclick = function() {
            _this.zoomOutImage()
        }
    },

    //创建上传按钮
    createUploadBtn: function() {
        this.uploadBtn = document.createElement('span')
        this.uploadBtn.className = 'cupload-upload-btn'
        this.uploadBtn.style.position = 'absolute'
        this.uploadBtn.style.left = (this.opt.width - 21)/2 + 'px'
        this.uploadBtn.style.fontSize = '28px'
        this.uploadBtn.style.color = '#8c939d'
        this.uploadBtn.innerHTML = '+'
        this.uploadBox.appendChild(this.uploadBtn)
    },

    //创建上传input
    createUploadInput: function() {
        this.uploadInput = document.createElement('input')
        this.uploadInput.className = 'cupload-upload-input'
        this.uploadInput.style.position = 'absolute'
        this.uploadInput.style.top = 0
        this.uploadInput.style.right = 0
        this.uploadInput.style.width = '100%'
        this.uploadInput.style.height = '100%'
        this.uploadInput.style.opacity = 0
        this.uploadInput.style.cursor = 'pointer'
        this.uploadInput.type = 'file'
        this.uploadInput.multiple = 'multiple'
        this.uploadInput.accept = 'image/*'
        this.uploadInput.title = ''
        this.uploadBox.appendChild(this.uploadInput)
        var _this = this
        this.uploadInput.onchange = function() {
            _this.removeUploadBox()
            _this.uploadImage()
        }
    },

    //上传图片
    uploadImage: function() {
        if(uploadingImg) {
            alert('请等待上一张图片上传完成')
            this.createUploadBox()
            return false
        }
        if(this.uploadInput.files.length + this.imageList.children.length > this.opt.num) {
            this.createUploadBox()
            alert('图片数量超出限制，请重新选择')
            return false
        }
        for(j = 0; j < this.uploadInput.files.length; j++){
            let file = this.uploadInput.files[j]
            if (!file || this.limitedSize(file)) {
                this.createUploadBox()
                return false
            }
            var reader = new FileReader()
            var _this = this
            reader.filename = file.name;
            reader.onload = function(e) {
                _this.limitedWidthAndHeight(e.target.result, e.target.filename,file)
            }
            reader.readAsDataURL(file);
        }
        if (this.uploadInput.files.length + this.imageList.children.length < this.opt.num) {
            this.createUploadBox()
        }
    },

    //检测图片大小限制
    limitedSize: function(file) {
        if (this.opt.minSize && file.size < this.opt.minSize * 1024) {
            alert('图片' + file.name + '大小未到最小限制，请重新选择')
            return true
        }
        if (this.opt.maxSize && file.size > this.opt.maxSize * 1024) {
            alert('图片' + file.name + '大小超出最大限制，请重新选择')
            return true
        }
        if (this.opt.limitedSize && file.size > this.opt.limitedSize * 1024) {
            alert('图片' + file.name + '大小不符合要求，请重新选择')
            return true
        }
        return false
    },

    //检测图片像素限制
    limitedWidthAndHeight: function(src, name, file) {
        var tempImage = new Image()
        tempImage.src = src
        var _this = this
        tempImage.onload = function() {
            if (_this.opt.minWidth && this.width < _this.opt.minWidth) {
                alert('图片' + name + '宽度未到最小限制，请重新选择')
                _this.isCreateUploadBox()
                return false
            }
            if (_this.opt.minHeight && this.height < _this.opt.minHeight) {
                alert('图片' + name + '高度未到最小限制，请重新选择')
                _this.isCreateUploadBox()
                return false
            }
            if (_this.opt.maxWidth && this.width > _this.opt.maxWidth) {
                alert('图片' + name + '宽度超出最大限制，请重新选择')
                _this.isCreateUploadBox()
                return false
            }
            if (_this.opt.maxHeight && this.height > _this.opt.maxHeight) {
                alert('图片' + name + '高度超出最大限制，请重新选择')
                _this.isCreateUploadBox()
                return false
            }
            if (_this.opt.limitedWidth && this.width != _this.opt.limitedWidth) {
                alert('图片' + name + '宽度不符合要求，请重新选择')
                _this.isCreateUploadBox()
                return false
            }
            if (_this.opt.limitedHeight && this.height != _this.opt.limitedHeight) {
                alert('图片' + name + '高度不符合要求，请重新选择')
                _this.isCreateUploadBox()
                return false
            }
            _this.foreachNum(src, name, this.width, this.height, file)
        }
    },

    //检测图片数量
    foreachNum: function(src, name, width, height, file) {
        if(this.opt.url) {
            var key = this.opt.name
            var data = {}
            data[key] = src
            var _this = this
            uploadingImg = true
            this.ajaxUploadImage(data, file, function(res) {
                var resData = JSON.parse(res.responseText)
                if(resData.code !== 200){
                    cocoMessage.error(resData.codeMsg)
                    return
                }
                uploadImgArr.push(resData.data.path)
                _this.createImageBox(resData.data.path, res.responseText, width, height)
            })
        } else {
            this.createImageBox(src, name, width, height)
        }
    },

    //图片异步上传
    ajaxUploadImage: function(data, file, success) {
        var xhr = null;
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest()
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }
        if(typeof data == 'object'){
            var str = '';
            for(var key in data){
                str += key+'='+data[key]+'&';
            }
            data = str.replace(/&$/, '');
        }
        var formData = new FormData()
        formData.append('file',file)
        xhr.open('POST', this.opt.url, true);
        // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(formData);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                uploadingImg = false
                if(xhr.status == 200){
                    success(xhr)
                } else {
                    // alert(((xhr.responseText).split("</p>")[0]).split("<p>")[1])
                    alert('图片上传失败!')
                    return false
                }
            }
        }
    },

    //创建图片框
    createImageBox: function(src, name, width, height, state = true) {
        this.imageArr[this.i] = src
        this.widthArr[this.i] = width
        this.heightArr[this.i] = height
        this.imageBox[this.i] = document.createElement('li')
        this.imageBox[this.i].className = 'cupload-image-box'
        this.imageBox[this.i].style.position = 'relative'
        this.imageBox[this.i].style.display = 'inline-block'
        this.imageBox[this.i].style.marginRight = 8 + 'px'
        this.imageBox[this.i].style.backgroundColor = '#fbfdff'
        this.imageBox[this.i].style.border = '1px solid #c0ccda'
        this.imageBox[this.i].style.borderRadius = '6px'
        this.imageBox[this.i].style.WebkitBoxSizing = 'border-box'
        this.imageBox[this.i].style.boxSizing = 'border-box'
        this.imageBox[this.i].style.width = this.opt.width + 'px'
        this.imageBox[this.i].style.height = this.opt.height + 'px'
        console.log(this)
        console.log(this.imageBox[this.i])
        console.log(this.imageList)
        this.imageList.appendChild(this.imageBox[this.i])
        this.createImagePreview(src, width, height)
        this.createImageInput(src)
        this.createImageDelete(name)
        if (!state) {
            this.setDefaultImage()
        }
        var _this = this
        for (var m = 0; m <= this.i; m++) {
            this.imageBox[m].index = m
            this.imageBox[m].onmouseover = function(n) {
                return function() {
                    // console.log(_this.opt.onlyShowBox)
                    // if(!_this.opt.onlyShowBox){
                    // 	_this.showImageDelete(n)
                    // }
                    _this.showImageDelete(n)
                }
            }(m)

            this.imageBox[m].onmouseout = function(n) {
                return function() {
                    // if(!_this.opt.onlyShowBox){
                    // 	_this.hideImageDelete(n)
                    // }
                    _this.hideImageDelete(n)
                }
            }(m)
        }
        this.i++
    },

    //创建图片预览框
    createImagePreview: function(src, width, height) {
        this.imagePreview[this.i] = document.createElement('img')
        this.imagePreview[this.i].className = 'cupload-image-preview'
        this.imagePreview[this.i].style.position = 'absolute'
        this.imagePreview[this.i].style.top = 0
        this.imagePreview[this.i].style.left = 0
        this.imagePreview[this.i].style.right = 0
        this.imagePreview[this.i].style.bottom = 0
        this.imagePreview[this.i].style.margin = 'auto'
        this.imagePreview[this.i].src = src
        this.setImageAttribute(width, height)
        this.imageBox[this.i].appendChild(this.imagePreview[this.i])
    },

    //创建图片input
    createImageInput: function(src) {
        this.imageInput[this.i] = document.createElement('input')
        this.imageInput[this.i].type = 'hidden'
        this.imageInput[this.i].name = this.opt.name + '[]'
        this.imageInput[this.i].value = src
        this.imageBox[this.i].appendChild(this.imageInput[this.i])
    },

    //创建删除
    createImageDelete: function(name) {
        this.imageDelete[this.i] = document.createElement('div')
        this.imageDelete[this.i].className = 'cupload-image-delete'
        this.imageDelete[this.i].style.position = 'absolute'
        this.imageDelete[this.i].style.width = '100%'
        this.imageDelete[this.i].style.height = '100%'
        this.imageDelete[this.i].style.left = 0
        this.imageDelete[this.i].style.top = 0
        this.imageDelete[this.i].style.textAlign = 'center'
        this.imageDelete[this.i].style.color = '#fff'
        this.imageDelete[this.i].style.opacity = 0
        this.imageDelete[this.i].style.cursor = 'zoom-in'
        this.imageDelete[this.i].style.backgroundColor = 'rgba(0,0,0,.5)'
        this.imageDelete[this.i].style.WebkitTransition = '.3s'
        this.imageDelete[this.i].style.transition = '.3s'
        this.imageDelete[this.i].title = name
        this.imageBox[this.i].appendChild(this.imageDelete[this.i])
        if(!this.opt.onlyShowBox){
            this.createDeleteBtn()
            // this.createSortBtn()
        }
        var _this = this
        for (var m = 0; m <= this.i; m++) {
            this.imageDelete[m].onclick = function(n) {
                return function() {
                    _this.zoomInImage(n)
                }
            }(m)
        }
    },

    //创建删除按钮
    createDeleteBtn: function() {
        this.deleteBtn[this.i] = document.createElement('span')
        this.deleteBtn[this.i].className = 'cupload-delete-btn'
        this.deleteBtn[this.i].style.position = 'absolute'
        this.deleteBtn[this.i].style.top = 0
        this.deleteBtn[this.i].style.right = 0
        this.deleteBtn[this.i].style.margin = 0
        this.deleteBtn[this.i].style.padding = 0
        this.deleteBtn[this.i].style.fontSize = '18px'
        this.deleteBtn[this.i].style.width = '24px'
        this.deleteBtn[this.i].style.height = '24px'
        this.deleteBtn[this.i].style.cursor = 'pointer'
        this.deleteBtn[this.i].style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAAwUlEQVRYhe2WwQ3CMAxFPxXqOjAAqGwHo3QNCIxSxuBzcaRStcRxcin4XSJHjv2aNkoBRwHJhmSgnhvJpqbAPqN5ZKeprbU8ydhvEgDoJ2uqCHQyXhW5Maf7mrUEyYdhu7WEab+5HXiZzJXPp88Uijsm6tQ7KkZcYF0CckSDNi5i7uudzqXipbkx63oFLuACPymwzcy/4/NKTcV2/Dp2AQBPACB5sBYneRzXyl18qfAXHDlbBFqRGAoaD1KjzRb4G96BvtfyCUSIygAAAABJRU5ErkJggg==')"
        this.deleteBtn[this.i].style.backgroundSize = '18px 18px'
        this.deleteBtn[this.i].style.backgroundRepeat = 'no-repeat'
        this.deleteBtn[this.i].style.backgroundPosition = 'right top'
        this.deleteBtn[this.i].innerHTML = ''
        this.deleteBtn[this.i].title = '删除'
        this.imageDelete[this.i].appendChild(this.deleteBtn[this.i])
        var _this = this

        for (var m = 0; m <= this.i; m++) {
            this.deleteBtn[m].onclick = function(n) {
                return function() {
                    _this.deleteImage(n)
                }
            }(m)
        }
    },

    createSortBtn: function() {
        this.sortLeftBtn[this.i] = document.createElement('span')
        this.sortLeftBtn[this.i].className = 'cupload-sort-left'
        this.sortLeftBtn[this.i].style.position = 'absolute'
        this.sortLeftBtn[this.i].style.bottom = 0
        this.sortLeftBtn[this.i].style.left = 0
        this.sortLeftBtn[this.i].style.margin = 0
        this.sortLeftBtn[this.i].style.padding = 0
        this.sortLeftBtn[this.i].style.fontSize = '18px'
        this.sortLeftBtn[this.i].style.width = '24px'
        this.sortLeftBtn[this.i].style.height = '24px'
        this.sortLeftBtn[this.i].style.cursor = 'pointer'
        this.sortLeftBtn[this.i].style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABP0lEQVRYhe2UIUsEURRGv7suGza4sCBoENYgGMwWs/4A/4AWwWRyMfgHRCyKGhWsYtegRYOCCGoUk1kwKLiws8dywRFGcXZ23yDMiW8e75z3YK5UUPBfAQbzlK8BEbCa9axySrFJ2pC0klWcGsCALb7Y8aAg8gHgICZfDyJ2eQU4dnEHCPf8QBU4dXkELIaU14BLl7eB+ZDyOnDt8g9gLqR8BHhw+Rsw00/ft98IaEg6lzTmS2eSbnroiyTtm9lT4ldgm/6z+9sLTPoLDPnSraTk2u5oSdo0s7sfdwATwLPXvgBTPQz4G0ADePSIV2A6j4hh4N4j3oHZPCLqwJVHtAg5D2IRNeDCI8JOxFhEFTjxiA6wnEdEBTiKRTTziCgDh7GhspT1zFKazWbWlrQgac+XRrMGdA0wDqS6QEFBEp/yS6NBq8E1tgAAAABJRU5ErkJggg==')"
        this.sortLeftBtn[this.i].style.backgroundSize = '18px 18px'
        this.sortLeftBtn[this.i].style.backgroundRepeat = 'no-repeat'
        this.sortLeftBtn[this.i].style.backgroundPosition = 'left bottom'
        this.sortLeftBtn[this.i].innerHTML = ''
        this.sortLeftBtn[this.i].title = '左移'
        this.imageDelete[this.i].appendChild(this.sortLeftBtn[this.i])

        this.sortRightBtn[this.i] = document.createElement('span')
        this.sortRightBtn[this.i].className = 'cupload-sort-right'
        this.sortRightBtn[this.i].style.position = 'absolute'
        this.sortRightBtn[this.i].style.bottom = 0
        this.sortRightBtn[this.i].style.right = 0
        this.sortRightBtn[this.i].style.margin = 0
        this.sortRightBtn[this.i].style.padding = 0
        this.sortRightBtn[this.i].style.fontSize = '18px'
        this.sortRightBtn[this.i].style.width = '24px'
        this.sortRightBtn[this.i].style.height = '24px'
        this.sortRightBtn[this.i].style.cursor = 'pointer'
        this.sortRightBtn[this.i].style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAA4UlEQVRYhe3WMUpDQRCA4XkKWlhIqnQWwc4iKbyBTVohJ/AC2lh4gxxBA7lAqhwgvbWtpYWVnVgI4mfhghKeEPCFSeD93cIu8w+7OzMRLS3bDga4Qy9LYOqbZ5xkCBzjqUi84DRD4giPReIVZxkSXTwUiTcMMyQ6uC8S7xhlSBxgUSQ+cJEhsY95kfjEVYbEHmZ+GNftq2oOHkbETkMeuxExiYjzsh5XVXXz525cWz+Xv2MuZ6qhzFdms66gSVZ9hOsKnvcNZRYimaVYZjOS2Y5lDyQ2YCTr41bWUNrS8l++ABQQn/PCTE8cAAAAAElFTkSuQmCC')"
        this.sortRightBtn[this.i].style.backgroundSize = '18px 18px'
        this.sortRightBtn[this.i].style.backgroundRepeat = 'no-repeat'
        this.sortRightBtn[this.i].style.backgroundPosition = 'right bottom'
        this.sortRightBtn[this.i].innerHTML = ''
        this.sortRightBtn[this.i].title = '右移'
        this.imageDelete[this.i].appendChild(this.sortRightBtn[this.i])
        var _this = this
        for (var m = 0; m <= this.i; m++) {
            this.sortLeftBtn[m].onclick = function(n) {
                return function() {
                    _this.sortLeft(event, n)
                }
            }(m)

            this.sortRightBtn[m].onclick = function(n) {
                return function() {
                    _this.sortRight(event, n)
                }
            }(m)
        }
    },

    //设置默认图片
    setDefaultImage: function() {
        this.imageBox[this.i].style.backgroundColor = "#B2B2B2"
        this.imageDelete[this.i].title = '图片不存在'
        this.imagePreview[this.i].src = 'data:image/png;base64,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'
        if (130 / this.opt.width > 105 / this.opt.height) {
            this.imagePreview[this.i].style.width = this.opt.width - 2 + 'px'
            this.imagePreview[this.i].style.height = 105 / (130 / this.opt.width) - 2 + 'px'
        } else {
            this.imagePreview[this.i].style.width = 130 / (105 / this.opt.height) - 2 + 'px'
            this.imagePreview[this.i].style.height = this.opt.height - 2 + 'px'
        }
    },

    //设置图片宽高
    setImageAttribute: function(width, height) {
        if (width / this.opt.width > height / this.opt.height) {
            this.imagePreview[this.i].style.width = this.opt.width - 2 + 'px'
            this.imagePreview[this.i].style.height = height / (width / this.opt.width) - 2 + 'px'
        } else {
            this.imagePreview[this.i].style.width = width / (height / this.opt.height) - 2 + 'px'
            this.imagePreview[this.i].style.height = this.opt.height - 2 + 'px'
        }
    },

    //data图片预览
    showImagePreview: function() {
        var obj = this.opt.data
        if ((obj.length >= this.opt.num) && !this.opt.onlyShowBox) {
            this.removeUploadBox()
        }
        var _this = this
        var tempImage = new Image()
        tempImage.src = obj[this.i]
        tempImage.onload = function() {
            _this.createImageBox(obj[_this.i], obj[_this.i], this.width, this.height)
            setTimeout(function() {
                if (obj[_this.i]) {
                    _this.showImagePreview()
                }
            }, 0);
        }
        tempImage.onerror = function() {
            _this.createImageBox(obj[_this.i], obj[_this.i], 0, 0, false)
            setTimeout(function() {
                if (obj[_this.i]) {
                    _this.showImagePreview()
                }
            }, 0);
        }
    },

    //图片放大预览
    zoomInImage: function(n) {
        if(event.target.classList[0] === 'cupload-delete-btn' || event.target.classList[0] === 'cupload-sort-right' || event.target.classList[0] === 'cupload-sort-left') {
            return;
        }
        if(this.imagePreview[n].src == 'data:image/png;base64,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') {
            toast()
            alert('图片不存在')
            return;
        }
        this.zommImage = document.createElement('img')
        this.zommImage.style.display = "inline-block"
        this.zommImage.style.verticalAlign = "middle"
        this.zommImage.src = this.imageArr[n]
        if (this.widthArr[n] / window.innerWidth > this.heightArr[n] / window.innerHeight) {
            this.zommImage.style.width = 0.3 * window.innerWidth + 'px'
            this.zommImage.style.height = 0.3 * this.heightArr[n] / (this.widthArr[n] / window.innerWidth) + 'px'
        } else {
            this.zommImage.style.width = 0.3 * this.widthArr[n] / (this.heightArr[n] / window.innerHeight) + 'px'
            this.zommImage.style.height = 0.3 * window.innerHeight + 'px'
        }
        this.overlay.appendChild(this.zommImage)
        this.overlay.style.lineHeight = window.innerHeight + 'px'
        this.overlay.style.cursor = "zoom-out"
        this.overlay.style.display = "block"
    },

    //关闭图片放大预览
    zoomOutImage: function() {
        this.overlay.style.display = "none"
        this.zommImage.remove()
    },

    //检测当前图片数量，判断是否创建上传框
    isCreateUploadBox: function() {
        this.removeUploadBox()
        if (this.imageList.children.length < this.opt.num) {
            this.createUploadBox()
        }
    },

    //删除图片
    deleteImage: function(n) {
        var deleteUrl = $(this.imageBox[n]).find('input[type="hidden"]').val()
        for(var i=0; i<uploadImgArr.length; i++){
            if(uploadImgArr[i] == deleteUrl){
                uploadImgArr.splice(uploadImgArr.indexOf(deleteUrl),1)
            }
        }
        this.imageBox[n].remove()
        this.removeUploadBox()
        if (this.imageList.children.length < this.opt.num) {
            this.createUploadBox()
        }
        if(this.opt.deleteUrl) {
            var xhr = null;
            var key = this.opt.name
            var data = {}
            data[key] = this.imageArr[n]
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest()
            } else {
                xhr = new ActiveXObject('Microsoft.XMLHTTP')
            }
            if(typeof data == 'object'){
                var str = '';
                for(var key in data){
                    str += key+'='+data[key]+'&';
                }
                data = str.replace(/&$/, '');
            }
            xhr.open('POST', this.opt.deleteUrl, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(data);
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        // console.log(xhr.response)
                    } else {
                        alert(((xhr.responseText).split("</p>")[0]).split("<p>")[1])
                        return false
                    }
                }
            }
        }
    },

    sortLeft: function(event, n) {
        if(this.imageBox[n].previousSibling) {
            this.imageList.insertBefore(this.imageBox[n], this.imageBox[n].previousSibling)
        }
    },

    sortRight: function(event, n) {
        if(this.imageBox[n].nextSibling) {
            this.imageList.insertBefore(this.imageBox[n].nextSibling, this.imageBox[n])
        }
    },

    //移除上传框
    removeUploadBox: function() {
        this.uploadBox.remove()
    },

    //显示图片删除
    showImageDelete: function(m) {
        this.imageDelete[m].style.opacity = 1
    },

    //隐藏图片删除
    hideImageDelete: function(m) {
        this.imageDelete[m].style.opacity = 0
    },
}

var Floating = new Floating ();
var cupload = new Cupload ({
	ele	 : '#upload-P',
	name : 'image',
	num  : 3,
	width: 70,
	height: 70,
	url  : urlTS + '/upload/image',
});