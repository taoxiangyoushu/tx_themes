
// 不使用后端验证版本
// 第一步复制copy文件代码黏贴到editor.js
// 第二步修改editor.js代码, 测试完整
// 第三步将editor.js代码复制到copy文件
// 第四步将editor.js代码加密提交
// 代码加密地址: https://www.jshaman.com/
// editor.js源代码
$('#editor , #editor2').on('keydown', function(e) {
    if($(this).children().length == 0) {
        let text = $(this).text()
        $(this).text('').removeClass('editorBox')
        $(this).append('<p class="outline-title outline-lv1" data-lv="1" data-lvl="0" data-lvt="第一章">'+text+'</br></p>')
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

$('#editor , #editor2')[0].onpaste = function(){
    var this_ = $(this)
    // if(this_.children(':last-child').hasClass('aidashi')) return // 判断是右侧复制过来的
    setTimeout(function(){
        filterHtml(this_.children(),function(str){
            this_.html(str);
        });
        change(this_)
    },300);
}

function filterHtml(str,callback){
    var s = ""
    str.each(function(index, domele) {
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
            var lv = ((domele.textContent.split('.').length)>3? '3':(domele.textContent.split('.').length))
        }
        s+="<p class='outline-title aidashi outline-lv"+lv+"' data-lv='"+lv+"'>"+removeNumberPrefix(domele.textContent)+"</p>"
    })
    callback(s);
}

// 按键抬起
$('#editor , #editor2').on('keyup', function(e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        change($(this))
    }
    if(e.keyCode = 8) {
        change($(this))
    }
    isShow($(this))
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
function h3Change(this_) {
    this_.children('[data-lv="3"]').each(function(index, domele){
        var upBrother = $(this).prevUntil(".outline-lv2")
        var father = upBrother.last().prev()
        var fathers = $(this).prev(".outline-lv2")
        var selector = upBrother.length? father : fathers
        if(index<=98) {
            var lv1 = selector.length>0? selector.attr('data-lvt') : '1.1';
            var lv2 = upBrother.length+1;
            $(this).attr('data-lvt' , lv1 +'.'+ lv2);
        }else {
            $(this).remove()
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