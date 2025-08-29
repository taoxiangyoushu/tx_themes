
// 现用未压缩代码
// 第一步复制copy文件代码黏贴到editor.js
// 第二步修改editor.js代码, 测试完整
// 第三步将editor.js代码复制到copy文件
// 第四步将editor.js代码加密提交
// 代码加密地址: https://www.jshaman.com/
// editor.js源代码

function trim(str){
    return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
}
var upkey = ''
var keyNo = [17 , 91]
$('#editor , #editor2').on('keydown', function(e) {
    if($(this).children().length == 0) {
        var text = $(this).text()
        $(this).text('').removeClass('editorBox')
        if(!keyNo.includes(e.keyCode)) {
            if((upkey==17 && e.keyCode==86) || (upkey==86 && e.keyCode==86)) { // ctrl + v 给原始p标签
                $(this).append('<p>'+text+'</br></p>')
            }else { // 键盘输入给指定p标签
                $(this).append('<p class="outline-title outline-lv1 aidashi" data-lv="1" data-lvl="0" data-lvt="第一章">'+text+'</br></p>')
            }
        }
        upkey = e.keyCode
    }else if(keyNo.includes(e.keyCode) && !trim($(this).children().first().text())) {
        $(this).html('')
    }

    if(e.keyCode == 16 && e.shiftKey) { // 禁止shift加空格进行换行
        e.preventDefault();
    }

    // 获取光标所在的选区信息
    var selection = window.getSelection();
    var cursorNode = selection.anchorNode; // 本身
    var parentNode = cursorNode.parentNode; // 上一级
    var node = parentNode.getAttribute('data-lv')? parentNode : cursorNode;
    
    if (e.keyCode == 9 || (e.keyCode == 32 && e.shiftKey)) { // Tab键 或 Shift + 空格键
        if (e.shiftKey) { // Shift + Tab
            if (node.getAttribute('data-lv') === '2') {
                deletes(cursorNode)
                node.setAttribute('data-lv' , '1')
                node.setAttribute('data-lvl' , node.getAttribute('data-lvl')+1)
                node.setAttribute('class' , 'outline-title aidashi outline-lv1')
                change($(this))
            }else if(node.getAttribute('data-lv') === '3') {
                node.setAttribute('data-lv' , '2')
                node.setAttribute('class' , 'outline-title aidashi outline-lv2')
                change($(this))
            }
        }else {
            if (selection.type === 'Caret') { // Tab按键
                if (node.getAttribute('data-lv') === '1' && node.previousElementSibling) { // 生成第二级
                    node.setAttribute('data-lv' , '2')
                    node.setAttribute('data-lvt' , node.getAttribute('data-lvl')+'.1')
                    node.setAttribute('data-lvl' , node.getAttribute('data-lvl')-1)
                    node.setAttribute('class' , 'outline-title aidashi outline-lv2')
                    change($(this))
                }else if (node.getAttribute('data-lv') === '2' && node.previousSibling && node.previousSibling.getAttribute('data-lv')!=1) { // 生成第三级
                    node.setAttribute('data-lv' , '3')
                    node.setAttribute('data-lvt' , node.getAttribute('data-lvt')+'.1')
                    node.setAttribute('data-lvl' , node.getAttribute('data-lvl'))
                    node.setAttribute('class' , 'outline-title aidashi outline-lv3')
                    change($(this))
                }
            }
        }
        e.preventDefault();
    }
    // 禁止部分快捷键(下划线, 斜体, 加粗等)
    if (e.ctrlKey || e.metaKey) {
        switch(e.keyCode){
            case 66: //ctrl+B or ctrl+b
            case 98: 
            case 73: //ctrl+I or ctrl+i
            case 105: 
            case 85: //ctrl+U or ctrl+u
            case 117: {
                e.preventDefault();    
                break;
            }
        }
    }  
});



var InitialSticking = 0
var children0 = false
// 复制事件
if($('#editor' )[0]) {
    $('#editor' )[0].onpaste = function(){
        InitialSticking = $(this).children().length
        children0 = !trim($(this).children().first().text())
        setTimeout(()=>{
            onpasteFu($(this))
        },200);
    }
}
if($('#editor2')[0]) {
    $('#editor2')[0].onpaste = function(){
        InitialSticking = $(this).children().length
        children0 = !trim($(this).children().first().text())
        setTimeout(()=>{
            onpasteFu($(this))
        },200);
    }
}
function onpasteFu(this_) {
    if(InitialSticking<=1 && children0) {
        filterHtml(this_.children(),function(str){
            this_.html(str);
        } , this_);
    }else {
        filterHtml2(this_.children(),function(str){
            this_.html(str);
        });
        change(this_)
    }
}


// 内容为已知正确内容或自编后复制黏贴 , 走前端
function filterHtml2(str,callback){
    var s = ""
    str.each(function(index, domele) {
        var text =  ''
        // 1. 本编辑器的内且不是一级标题, 就需要拼接序号
        if(domele.classList.contains('aidashi') && domele.getAttribute('data-lv')!=1) {
            text = (domele.getAttribute('data-lvt') + domele.textContent)
        } else {
            text = domele.textContent
        }
        function removeNumberPrefix(str) {
            var regex0 = /^\s+/
            var regex1 = /^(\d+\.)+/;
            var regex2 = /^\d+/;
            var regex3 = /^(（|\()s*([一二三四五六七八九十百千万亿]+\.?)+(\s*）|\))/;
            var regex4 = /[0-9]+、|[一二三四五六七八九十]+、/g
            str = str.replace(regex0, ''); // 清除字符串前面空格
            str = str.replace(regex1, ''); // 清除带小数点的序号
            str = str.replace(regex2, ''); // 清除单纯的数字序号
            str = str.replace(regex3, ''); // 清除带括号的序号(一)
            str = str.replace(regex4, ''); // 清除带顿号的序号 '一、'或'1、'
            return str;
        }
        if(index == 0 ) {
            var lv = 1
        }else {
            var lv = ((text.split('.').length)>3? '3':(text.split('.').length))
        }
        s+="<p class='outline-title aidashi outline-lv"+lv+"' data-lv='"+lv+"'>"+removeNumberPrefix(text)+"</p>"
    })

    callback(s);
}

// 一开始就黏贴 , 走后端
function filterHtml(str,callback , this_){ // 内容未知是否为正确内容
    var outline = strEach(str , 'text')
    if(outline.length) {
        $("[loging-type='"+this_.attr('id')+"']").show().children('p').text('正在验证提纲...')
        $.ajax({
            type: 'post',
            url: urls + '/api/project/ai_paper_report/pre_handle/check_outline',
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            data: getFormData({
                outline
            }),
            success: function(data) {
                if (data.code == 200) {
                    var outline = data.data.outline
                    var indexkey = []
                    var error = {}
                    if(data.data.msg=='no') { // 有错误的情况
                        for(var i=0; i<outline.length; i++) {
                            indexkey.push(outline[i].error_index)
                            error[outline[i].error_index] = outline[i]
                        }
                        CopywritingChange(this_ , '检测提纲' , 'Detection' , false , false)
                        callback(strEach(str , 'html' , indexkey , error));
                    }else { //没有错误的情况
                        if(data.data.maxLv>=4) {
                            Recommended(outline , this_ , true)
                            CopywritingChange(this_ , '下一步' , 'submit' , false , true)
                        }else {
                            Recommended(outline , this_)
                            CopywritingChange(this_ , '下一步' , 'submit' , true , true)
                        }
                        dataIsCorrectV3(outline)
                    }
                } else {
                    cocoMessage.error(data.codeMsg, 3000);
                }
                $("[loging-type='"+this_.attr('id')+"']").hide()
                setTimeout(function() {
                    throttling2 = true
                }, 500)
            },
            error: function(err) {
                $("[loging-type='"+this_.attr('id')+"']").hide()
                this_.html('');
                cocoMessage.error("请求失败!请检查网络", 2000);
                throttling2 = true
            }
        });
    }else {
        cocoMessage.error("未检测到提纲!!", 2000);
        throttling2 = true
    }
}

/*
    this_: 当前输入框
    buttonText: 按钮文案
    buttonKey: 按钮key值
    isEditing: 是否为提纲编辑器
    msg: 提示文案
*/
function CopywritingChange(this_ , buttonText , buttonKey , isEditing , msg) {
    $("[edit-key='"+this_.attr('id')+"']").text(buttonText)
    $("[edit-key='"+this_.attr('id')+"']").attr('button-type' , buttonKey)
    $("[edit-tips='"+this_.attr('id')+"']").html(isEditing? '提纲编辑区： <span>tab</span>  /  <span>Shift+Tab</span> 可切换提纲级别' : '点击文本内容可以进行编辑修改')
    if(msg) {
        cocoMessage.success('论文提纲格式正确', 1500);
        this_.parent('.recommend').siblings('.submitDiv').children('.editGenerate').removeClass('gray')
    }else {
        cocoMessage.error('论文提纲格式有误!', 1500);
    }
}

// 遍历节点,提供文本数组或html字符串
/*
    str: 当前dom数据
    type: 需求数据类型
    indexkey: 错误数据下标
    error: 错误数据内容
*/
function strEach(str , type , indexkey , error) {
    var html = ""
    var data = []
    var dataLvt = '' 
    var index_jl = 0
    str.each(function(index, domele) {
        var text =  ''
        // 判断p标签的内容是否是当前平台的内容, 当前平台的p标签会携带'aidashi', 平台的文本内容需拼接序号
        if(domele.classList.contains('aidashi') && dataLvt!=domele.getAttribute('data-lvt')) {
            text = (domele.getAttribute('data-lvt') + domele.textContent)
        } else {
            text = domele.textContent
            if(index == 1 && data[0] && domele.classList.contains('aidashi')) {
                data[0] = data[0].replace(new RegExp("第一章"),"");
            }
        }
        if(text) {
            if(type=='text') {
                data.push(text)
            }else {
                if(indexkey.includes(index-index_jl)) {
                    html+="<p class='error_text' data-error='"+error[index-index_jl].error_message+"'>"+text+"</p>"
                }else {
                    html+="<p>"+text+"</p>"
                }
            }
        }else {
            index_jl++
        }
        dataLvt = domele.getAttribute('data-lvt')
    })
    return type=='text'? data : html
}
$('#editor , #editor2').on('input', function() { // 输入框变化后变成检测提纲
    $("[edit-key='"+$(this).attr('id')+"']").text('检测提纲')
    $("[edit-key='"+$(this).attr('id')+"']").attr('button-type' , 'Detection')
})
// 按键抬起
$('#editor , #editor2').on('keyup', function(e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        change($(this))
    }
    if(e.keyCode == 8) {
        change($(this))
    }
    isShow($(this))
    var Direction = [37 , 38 , 39 , 40]
    var editTips = $("[tips-show='"+$(this).attr('id')+"']")
    editTips.removeClass('Error2')
    if(Direction.includes(Number(e.keyCode))) { // 判断按键为上下左右
        var classList = document.getSelection().anchorNode.parentElement.getAttribute("class")
        if(classList == 'error_text') { // 上下左右切到错误语句
            editTips.children('.WordsText').text(document.getSelection().anchorNode.parentElement.getAttribute("data-error"))
            editTips.show()
        }else {
            editTips.hide()
        }
    }else if(document.getSelection().anchorNode.parentElement.getAttribute("data-error")) { 
        // 判断光标当前节点是错误语句, 就删除提示, 删除样式
        editTips.hide()
        document.getSelection().anchorNode.parentElement.classList.remove('error_text')
    }else {
        // 当前不是错误语句, 错误隐藏
        editTips.hide()
    }
});

$('#editor , #editor2').on("click", "p", function(){// 错误语句点击展示错误
    var editTips = $("[tips-show='"+$(this).parents('.editor_s').attr('id')+"']")
    editTips.removeClass('Error2')
    if($(this).hasClass('error_text')) {
        editTips.show()
        editTips.children('.WordsText').text($(this).attr('data-error'))
        $('.EditingMainbox').css('height' , '320px')
        $('.recommend').css('height' , 'calc(100% - 40px)')
    }else {
        editTips.hide()
        $('.EditingMainbox').css('height' , '280px')
        $('.recommend').css('height' , '100%')
    }
});


function isShow(this_) {
    if(this_.children().length == 0) {
        this_.parent('.recommend').siblings('.submitDiv').children('.editGenerate').addClass('gray')
    }else {
        this_.parent('.recommend').siblings('.submitDiv').children('.editGenerate').removeClass('gray')
    }
}
isShow($('#editor'))
isShow($('#editor2'))


// 失焦事件
$('#editor , #editor2').focusout(function() {
    if($(this).children().length == 0) {
        $(this).addClass('editorBox')
        $(this).nextAll('#ImportantHint').css('display' , 'block')
    }else {
        $(this).nextAll('#ImportantHint').css('display' , 'none')
    }
    $(this).parent('.recommend').removeClass('recommendColor')
})
$('#editor , #editor2').focus(function() {
    $(this).parent('.recommend').addClass('recommendColor')
})


// 修改提纲
function change(this_) {
    h1Change(this_)
    h2Change(this_)
    h3Change(this_)
}

// 第三级提纲变化
var timeH3 = true
function h3Change(this_) {
    this_.children('[data-lv="3"]').each(function(index, domele){
        var upBrother = $(this).prevUntil(".outline-lv2") // 获取当前等级提纲里面的所有二级提纲
        var father = upBrother.last().prev()
        var fathers = $(this).prev(".outline-lv2")
        var selector = upBrother.length? father : fathers
        // 数量小于98, 判断如果是
        if(index<=98 && ($(this).attr('data-lvl') == selector.attr('data-lvl') || !$(this).attr('data-lvl'))) { // 判断当前的提纲和前一个提纲是否属于同一类提纲
            var lv1 = selector.length>0? selector.attr('data-lvt') : '1.1';
            var lv2 = upBrother.length+1;
            $(this).attr('data-lvt' , lv1 +'.'+ lv2);
        }else { // 不等于就删除当前提纲
            $(this).remove()
            if(timeH3) {// 删除后再刷新一遍二级提纲
                setTimeout(() => {
                    h2Change(this_)
                    timeH3 = true
                }, 100);
            }
            timeH3 = false
        }
    })
}

// 第二级提纲变化
function h2Change(this_) {
    this_.children('[data-lv="2"]').each(function(index, domele){
        if(index<=98) {
            $(this).attr('data-lvl' , mapGetters($(this)).selector.attr('data-lvl'))
            var data = mapGetters($(this))
            var lv1 = data.selector.length>0? Number(data.selector.attr('data-lvl'))+1 : 1;
            var lv2 = data.upBrother.length+1;
            $(this).attr('data-lvt' , lv1 +'.'+ lv2);
        }else {
            $(this).remove()
        }
    })
}
// 第一级提纲变化
function h1Change(this_) {
    this_.children('[data-lv="1"]').each(function(index, domele){
        if(index<=98) { // 最大99条, 需要超过的话要去toChineseNumber修改逻辑
            $(this).attr('data-lvt' , '第'+toChineseNumber(index+1)+'章')
            $(this).attr('data-lvl' , index)
        }else {
            $(this).remove()
        }
    })
}

// 第一级提纲中文生成规则
function toChineseNumber(number) {
    var chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if(number >= 20) {
        return chineseNumbers[(Math.floor(number/10)) - 1] +chineseNumbers[9] + ((number%10)>0? chineseNumbers[(number%10)-1] : '');
    }
    if(number > 10) {
        return chineseNumbers[9] + chineseNumbers[(number%10)-1];
    }
    return chineseNumbers[number - 1];
}

// 第二级提纲向上找第一个 第一级提纲
function mapGetters(this_) {
    var upBrother = this_.prevUntil(".outline-lv1" , '.outline-lv2') // 往上查找直到第一级提纲的兄弟元素
    var father = upBrother.last().prev() // 通过第一个兄弟元素找到第一级提纲
    var fathers = this_.prev(".outline-lv1") // 直接拿上一级(第一级提纲)
    var selector = upBrother.length? father : fathers // 向上找不到同级兄弟元素说明自己就是第一个
    return {
        upBrother,
        selector
    }
}

// 二级提纲变一级提纲, 删除相邻的三级提纲
function deletes(cursorNode) {
    if(cursorNode.nextSibling && cursorNode.nextSibling.getAttribute('data-lv') == '3') {
        cursorNode.nextElementSibling.remove()
        deletes(cursorNode)
    }
}
