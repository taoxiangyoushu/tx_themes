var throttling2 = true;
var closeMsg = null;
var editData = [[]];
var rid = '';
var editData_index = 0; // 当前editData里面所在下标
var keyWordZy = ''  //关键词

// 预下单,生成提纲id
$('#outline').click(function() {
	// is强制登录拦截
	if(memberFu.interceptLogin && memberFu.interceptLogin()) return false;


    $('.editTips , .editTips2').hide()
    if(!$('.inputCheck').prop("checked")) return cocoMessage.error('请确认知晓并同意 "生成的论文范文仅用于参考,不作为毕业、发表使用" 条款!', 3000)
    var bootstrapValidator = $("#ContainerTo").data("bootstrapValidator").validate();
    if( typeData[$("#type_s2").val()].short_name=='bylwsenior' || typeData[$("#type_s2").val()].short_name=='qklwsenior'){
        if($("#illustrate").val().length > 0) {
            if($("#illustrate").val().length < 200) {
                $(".professional").css('borderColor', '#f34f4f')
                $(".professional-err").show()
                return;
            }
        }
    }
    if(typeData[$('#type_s2').val()].short_name == 'qklwsenior') {
        if(!$(".periodicalType.select")[0]){
            $(".selectPeriodical .periodical-err").show();
        }
        if(!$(".l-numB.select")[0]){
            $(".literatureNum .literatureNum-err").show();
        }
    }
    if (bootstrapValidator.isValid()) {
        if( typeData[$("#type_s2").val()].short_name=='ktbgsenior' ){
            EditingKTBG()
            return
        }
        if(typeData[$('#type_s2').val()].short_name == 'qklwsenior') {
            if(!$(".periodicalType.select")[0]){
                $(".selectPeriodical .periodical-err").show();
                return ;
            }
            if(!$(".l-numB.select")[0]){
                $(".literatureNum .literatureNum-err").show();
                return ;
            }
        }
        keyWordZy = ''
        if($("#mf_keyword_list li").length > 8 || ($("#mf_keyword_list li").length < 3 && $("#mf_keyword_list li").length > 0)){
            $("#keyword_err").show()
            $(".mf_container").addClass('errorBorder')
            $(".keywordBox .contenteditable_s").addClass('has-error')
            return
        }else{
            $("#keyword_err").hide()
            $(".mf_container").removeClass('errorBorder')
            $(".keywordBox .contenteditable_s").removeClass('has-error')
            $("#mf_keyword_list li").each(function () {
                keyWordZy += $(this).find('input').val()+'；'
            })
            if(keyWordZy.lastIndexOf('；') == (keyWordZy.length-1)){
                keyWordZy = keyWordZy.slice(0,keyWordZy.lastIndexOf('；'))
            }
        }
        if(!LiteratureFU()) return;
        $('.PaperTitle').text($('#contenteditable').val())
        $('#NumberWords3').val($("#NumberWords").val())
        pre_handlePreOrder($('#contenteditable').val() , $("#NumberWords").val())
        $('.EditPopup').removeClass('bylwsenior qklwsenior')
        $('.EditPopup').addClass(typeData[$('#type_s2').val()].short_name)
        $('.EditPopup').show()
        $('.logingEditor2').show()
        $('.logingEditor2 p').text('正在获取数据...')
    }
})

function pre_handlePreOrder(contenteditable , NumberWords , button_this) {
    if(!throttling2) return
    if(!NumberWords) {
        cocoMessage.error("论文字数不能为空", 2000);
        return
    }
    $('#anew').addClass('prohibit')
    throttling2 = false
    var formData = {
        title: contenteditable,
        word_num: NumberWords,
        gen_img: $(".gen_img").is(':checked')?1:0,
        gen_tab:  $(".gen_tab").is(':checked')?1:0,
        gen_formula: $(".gen_formula").is(':checked')?1:0,
        gen_code: $(".gen_code").is(':checked')?1:0,
        questionnaire: $(".gen_questionnaire").is(':checked')?1:0,
        goods_id: $('#type_s2').val(),
        
    }
    if( typeData[$('#type_s2').val()].short_name == 'qklwsenior' ) {
        formData.is_paper_type = $(".periodicalType.select").attr('data-type')
        formData.references_num_type = $(".l-numB.select").attr('data-num')
        // 英文参考
        var LiteratureType =$('input:checkbox[name="LiteratureType"]').is(':checked');
        if(LiteratureType) {
            formData.references_en_num = $('#NumberEnglishReference').val()
        }else {
            formData.references_en_num =0
        }
        //补充说明
        if($("#illustrate").val().length > 0) {
            if($("#illustrate").val().length < 200) {
            }else{
                formData.reference_content = $("#illustrate").val()
            }
        }
    }

    if( typeData[$('#type_s2').val()].short_name == 'bylwsenior' ) {
        if($("#illustrate").val().length > 0) {
            if($("#illustrate").val().length < 200) {
            }else{
                formData.reference_content = $("#illustrate").val()
            }
        }
        if($(".education_c").is(':visible')){
            formData.education = $("input[name='reportType']:checked").val()
        }
        if(typeData[$('#type_s2').val()].short_name == 'bylwsenior' && $("#basic").val() && $("#basic").val() !== 'A'){
            if($(".major").is(':visible')){
                formData.paper_type = configs[$("#basic").val()]
            }
        }
        // 英文参考
        var LiteratureType =$('input:checkbox[name="LiteratureType"]').is(':checked');
        if(LiteratureType) {
            formData.references_en_num = $('#NumberEnglishReference').val()
        }else {
            formData.references_en_num =0
        }

        // 自写开题报告
        if($(".proposal-check").is(':checked') && fid){
            formData.fid = fid
        }else if(ktbg_generate){
            formData['order_sn'] = ktbg_generate
        }
    }

    if($(".keywordBox").is(':visible')){
       formData.keyword = keyWordZy
    }

    var form_data = getFormData(formData)
    $.ajax({
        type: 'post',
        url: urls + '/api/project/ai_paper_report/pre_handle/preOrder',
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: form_data,
        success: function(data) {
            if (data.code == 200) {
                rid = data.data.rid
                if(!button_this) {
                    query_outline(contenteditable)
                }else { // 判断是点击的生成论文按钮, 就需要再次点击一下生成论文
                    $('#NumberWords').val($("#NumberWords3").val())
                    button_this.click()
                }
            } else {
                throttling2 = true
                if(!button_this) {
                    $('#anew').removeClass('prohibit');
                    $('.EditPopup').hide()
                    $('.logingEditor2').hide()
                }
                cocoMessage.error(data.codeMsg, 3000);
            }
        },
        error: function(err) {
            throttling2 = true
            cocoMessage.error("请求失败!请检查网络", 2000);
            $('#anew').removeClass('prohibit')
            $('.EditPopup').hide()
            $('.logingEditor2').hide()
        }
    });
}
// 通过提纲id获取提纲
function query_outline(title) {
    // var form_data = getFormData({
    //     rid
    // })
    $.ajax({
        type: 'post',
        url: urls + '/api/project/ai_paper_report/pre_handle/get_outline?title=' + title,
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        // data: form_data,
        success: function(data) {
            if (data.code == 200) {
                throttling2 = true
                editData = foo(data.data)
                editData_index = editData.length-1
                Recommended(editData[0] , $("#editor2"))
                pageChage()
                $('#anew').removeClass('prohibit')
                $('.logingEditor2').hide()
                $('.editGenerate2').removeClass('gray')
            }else {
                throttling2 = true
                cocoMessage.error(data.codeMsg, 3000);
                $('.logingEditor2').hide()
                $('#anew').removeClass('prohibit')
            }
        },
        error: function(err) {
            throttling2 = true
            cocoMessage.error("请求失败!请检查网络", 2000);
            $('.logingEditor2').hide()
            $('#anew').removeClass('prohibit')
        }
    });
}

// 洗牌函数
function foo(arr) {
    var cloneArr = arr.concat()
    for(var i=0; i<cloneArr.length; i++) {
        var index = Math.floor(Math.random() * cloneArr.length);
        var temp = cloneArr[index]
        cloneArr[index] = cloneArr[i]
        cloneArr[i] = temp
    }
    return cloneArr;
}

// 接口返回数据变成指定数据
function Recommended(outline , this_ , isChange) {
    this_.text('').removeClass('editorBox')
    var html = ""
    for(var i=0; i<outline.length; i++) {
        html+="<p>"+outline[i]+"</p>"
    }
    this_.html(html);

    if(!isChange) {
        // 根据内容来生成标准的html
        filterHtml2(this_.children('p'),function(str){
            this_.html(str);
        });
        change(this_)
        $('.logingEditor2').hide()
    }
}

// 控制翻页显示状况
function pageChage() {
    if(editData_index>0) {
        $('.TowardsTheRight').addClass('ok')
        $('.TowardsTheRight').show()
        $('.Regenerate').hide()
    }else {
        $('.TowardsTheRight').hide()
        $('.Regenerate').show()
    }
    if(editData_index>=editData.length-1) {
        $('.TowardsTheLeft').removeClass('ok')
    }else {
        $('.TowardsTheLeft').addClass('ok')
    }
}
// 下一篇
$('.TowardsTheRight').click(function() {
    if($(this).hasClass('ok') && throttling2) {
        editData_index -=1
        Recommended(editData[editData_index] , $("#editor2"))
        change($("#editor2"))
        $('.logingEditor2').hide()
        pageChage()
    }
})
// 上一篇
$('.TowardsTheLeft').click(function() {
    if($(this).hasClass('ok') && throttling2) {
        editData_index +=1
        Recommended(editData[editData_index] , $("#editor2"))
        change($("#editor2"))
        $('.logingEditor2').hide()
        pageChage()
    }
})

// 重新生成提纲洗牌
$('.Regenerate').click(function() {
    $('.logingEditor2').show()
    $('.logingEditor2 p').text('正在获取数据...')
    $("#editor2").text('').addClass('editorBox')
    setTimeout(function() {
        editData = foo(editData)
        editData_index = editData.length-1
        Recommended(editData[0] , $("#editor2"))
        $('.TowardsTheRight').show()
        $('.Regenerate').hide()
    }, 1500)
})

$('.delete').click(function() {
    $('.EditPopup').hide()
    $('.PageTurning').show()
    $("#editor2").text('').addClass('editorBox')
    $('#NumberWords3').removeClass('errColor')
    $('.editTips2').removeClass('Error2').hide()
    $('.editTips1').removeClass('Error2').hide()
    
    // 实时提纲参数重置
    sseData = ['']
    NewLineIndex = 0
    isRequest = true
    // 参考提纲和实时提纲复位
    $('.typeTab .tabOption').removeClass('Select')
    $('#ReferencId').addClass('Select')
})

$('.editGenerate').click(function(e) {
	// is强制登录拦截
	if(memberFu.interceptLogin && memberFu.interceptLogin()) return false;
    
    e.stopPropagation();
    if($(this).attr('ischecked') == 'false') return;
    if($(this).attr('button-type') == 'Detection') { // 提交检测
        if(!throttling2) return;
        throttling2 = false
        var this_ = $('#'+$(this).attr('edit-key'))
        filterHtml(this_.children() , function(str) {
            this_.html(str);
        }, this_)
    }else { // 提交提纲
        if(!throttling2) return;
        if($('#NumberWords3').val() != $('#NumberWords').val()) {
            pre_handlePreOrder($('#contenteditable').val() , $('#NumberWords3').val() , $(this))
            throttling2 = true
            return
        }
        if($('#' + $(this).attr('edit-key')).children('p').length<=0) {
            cocoMessage.error("提纲不可为空!!", 2000);
            throttling2 = true
            return;
        }
        var editKey = $(this).attr('edit-key')
        var this_s = $(this)
        present($('#' + $(this).attr('edit-key')).children('p') ,function(outline){
            closeMsg = cocoMessage.loading('正在提交提纲,请稍后...');
            throttling2 = false
            var form_data = getFormData({
                rid,
                outline,
                must: true,
                version: 'v3',
                theme:'v3'
            })
            $.ajax({
                type: 'post',
                url: urls + '/api/project/ai_paper_report/pre_handle/update_outline',
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                data: form_data,
                success: function(data) {
                    if (data.code == 200) {
                        throttling2 = true
                        closeMsg();
                        var formData = {
                            goods_id: $("#type_s2").val(),
                            domain_record: window.location.origin,
                            customer_invitation: dct_code,
                            theme:'v3'
                        }
                        formData['data[rid][label]'] = '记录ID'
                        formData['data[rid][value]'] = rid
                        formData['data[outline_type][label]'] = '提纲类型'
                        formData['data[outline_type][value]'] = editKey=='editor'? '自写提纲': [$('.tabOption.Select').data('key') == 'Referenc'? '推荐提纲':'实时提纲']
                        // 自写开题报告
                        if($(".proposal-check").is(':checked') && typeData[$("#type_s2").val()].short_name=='bylwsenior'){
                            if(fid) {
                                formData['data[gen_ktbg][label]'] = '开题报告';
                                formData['data[gen_ktbg][value]'] = $(".proposal-check").is(':checked')?1:0;
                                formData['data[fid][label]'] = '文件标识';
                                formData['data[fid][value]'] = fid;
                            }else if(ktbg_generate) {
                                formData['order_sn'] = ktbg_generate
                            }
                        }
                        unifiedCreate(getFormData(formData) , $("#type_s2").val() , outline)
                    }else {
                        throttling2 = true
                        var editTips = $("[tips-show='"+this_s.attr('edit-key')+"']")
                        editTips.show()
                        editTips.children('.WordsText').text(data.codeMsg)
                        editTips.addClass('Error2')
                        $('#NumberWords3').addClass('errColor')
                        this_s.addClass('gray').attr('ischecked' , false)
                        setTimeout(function() {
                            closeMsg();
                        }, 300)
                    }
                },
                error: function(err) {
                    throttling2 = true
                    closeMsg();
                    cocoMessage.error("请求失败!请检查网络", 2000);
                }
            });
        })
    }
})

// 将html转化成需要的数据
function present(src , callback) {
    var datas = []
    src.each(function(index, domele) {
        if(domele.getAttribute('data-lv') == 1) {
            var text = removeChars(domele.getAttribute('data-lvt') , '第' , '章')
            if(domele.textContent.trim().substring(0, 1)==='、') {
                domele.textContent = domele.textContent.replace(new RegExp("、"),"");
            }
            datas.push(text + domele.textContent)
        }else {
            datas.push(domele.getAttribute('data-lvt') + domele.textContent)
        }
    })
    callback(datas);
}

function removeChars(str, char1, char2) {
    return str.replace(new RegExp(char1 + '|' + char2, 'g'), '') + '、';
}


$('.editLeft , .editRight').click(function() {
    $('.editLeft , .editRight').removeClass('checked').find('.editGenerate').attr('ischecked' , 'false')
    $(this).addClass('checked').find('.editGenerate').attr('ischecked' , 'true').removeClass('gray')
    $('#NumberWords3').removeClass('errColor')
    $('.Error2').hide()
})

$('.up').click(function() {
    if($('#NumberWords3').val()<50000) {
        var Number_data = Number($('#NumberWords3').val())+1000
        $('#NumberWords3').val(Number_data<50000? Number_data:50000)
        disappear()
    }else {
        cocoMessage.error("最大字数不能高于50000!", 2000);
    }
})
$('.Lower').click(function() {
    if($('#NumberWords3').val()>5000) {
        var Number_data = Number($('#NumberWords3').val())-1000
        $('#NumberWords3').val(Number_data<5000? 5000:Number_data)
        disappear()
    }else {
        cocoMessage.error("最少字数不能低于5000!", 2000);
    }
})

$('#NumberWords3').click(function() {
    disappear()
})
function disappear() {
    $('#NumberWords3').removeClass('errColor')
    $('.editTips2').removeClass('Error2').hide()
    $('.editTips1').removeClass('Error2').hide()
    $('.editMain .checked .editGenerate').removeClass('gray').attr('ischecked' , true)
}

var sseData = ['']
var NewLineIndex = 0
var isRequest = true
$('.typeTab .tabOption').click(function() {
    $("[edit-key='editor2']").text('检测提纲')
    $("[edit-key='editor2']").attr('button-type' , 'Detection')
    $("[edit-tips='editor2']").html('提纲编辑区： <span>tab</span>  /  <span>Shift+Tab</span> 可切换提纲级别')
    $('.typeTab .tabOption').removeClass('Select')
    $(this).addClass('Select')
    if($(this).data('key') == 'Referenc') {
        Recommended(editData[editData_index] , $("#editor2"))
        $('.PageTurning').show()
        $('.editGenerate2').removeClass('isGenerating')
    }else {
        if(isRequest) {
            $("#editor2").html('')
            sseData = ['']
            NewLineIndex = 0
            sseFU()
            $('.editGenerate2').addClass('isGenerating')
        }else {
            Recommended(sseData , $("#editor2"))
        }
        $('.PageTurning').hide()
    }
})
function isNotDigitOrPunctuation(character) {
    return /^[^0-9,.!?]+$/g.test(character);
}
function sseFU() {
    if(typeof(EventSource) !== "undefined") {
        var source = new EventSource("https://outline.taoxiangyoushu.com/api/outline/online_generate?title="+$('#contenteditable').val()+"&words="+$("#NumberWords").val()+"&keyword="+keyWordZy+"&educations="+$("input[name='reportType']:checked").val()+"&major="+configs[$("#basic").val()]);
        source.onmessage = function(event) {
            // 处理服务器发送的消息
            if(event.data == '[error]') {
                source.close()
                cocoMessage.error('你的请求过于频繁，请稍后再来试试吧~', 3000);
                $('.editGenerate2').removeClass('isGenerating')
            } else if(event.data == '[outline_error]') {
                source.close()
                $("#editor2").html('')
                sseData = ['']
                NewLineIndex = 0
                sseFU()
            } else if (event.data == '[DONE]'){
                source.close()
                $('.editGenerate2').removeClass('isGenerating')
            } else {
                if(event.data) {
                    if(event.data!='[NN]') {
                        sseData[NewLineIndex]+=event.data
                        if(isNotDigitOrPunctuation(event.data) && $('.tabOption.Select').data('key') == 'RealTime') {
                            Recommended(sseData , $("#editor2"))
                            $('.editGenerate2').addClass('isGenerating')
                        }
                    }else {
                        NewLineIndex+=1
                        sseData[NewLineIndex] = ''
                    }
                    isRequest = false
                }
            }
        };
        source.onerror = function(event){
            source.close()
            console.error("SSE error:", event);
        };
    } else {
        console.log("错误");
    }
}
