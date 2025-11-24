// const UsageLimit = {
//     // 初始化或获取使用次数
//     init: function() {
//         const today = new Date().toISOString().split('T')[0]; // 获取当前日期(YYYY-MM-DD)
//         const storedData = JSON.parse(localStorage.getItem('usageLimit')) || {};

//         // 如果是新的一天或首次使用，重置次数
//         if (!storedData.lastResetDate || storedData.lastResetDate !== today) {
//             storedData.remaining = 3;
//             storedData.lastResetDate = today;
//             localStorage.setItem('usageLimit', JSON.stringify(storedData));
//         }
//         return storedData.remaining;
//     },

//     // 减少使用次数并返回是否允许使用
//     use: function() {
//         const today = new Date().toISOString().split('T')[0];
//         const storedData = JSON.parse(localStorage.getItem('usageLimit')) || {};

//         // 检查是否需要重置
//         if (storedData.lastResetDate !== today) {
//             this.init();
//             return true;
//         }

//         // 检查剩余次数
//         if (storedData.remaining > 0) {
//             storedData.remaining--;
//             localStorage.setItem('usageLimit', JSON.stringify(storedData));
//             return true;
//         }
//         return false;
//     },

//     // 获取剩余次数
//     getRemaining: function() {
//         this.init(); // 确保数据有效
//         return JSON.parse(localStorage.getItem('usageLimit')).remaining;
//     }
// };
// $('.refresh_outline .remaining').text(UsageLimit.getRemaining());
// let is_refresh = false
// $('.refresh_outline').on('click', function() {
//     if(is_refresh) {
//         return
//     }
//     if(UsageLimit.use()) {
//         realtimeData = []
//         NewLineIndex = 0
//         is_refresh = true
//         sseFU(function() {
//             is_refresh = false
//         })
//     }else {
//         is_refresh = true
//         cocoMessage.error('刷新次数已用完', 2000);
//     }
// })


// 第三步返回第二步
$('.prevStep').on('click', function() {
    $('.rightCont').attr('id', 'OperationSteps2');
    init3()
})

// 开题报告 第三步返回第二步
$('.stepBtn_KTBG .prevStep_KTBG').on('click', function() {
    $('.rightCont').attr('id', 'OperationSteps2');
    init3_KTBG()
})

// 开题报告 选大纲下一步按钮
$('.stepBtn_KTBG .nextStep_KTBG').on('click', function() {
    if(previewData.length<least) {
        $('.previewTips').show()
    }else {
        ktbgProfessional= []
        $('.previewContent div').filter('.aidashi').each(function() {
            ktbgProfessional.push($(this).text().replace(/\s+$/, ''))
        });
        UpdateKTBGV3()
    }
})

// 回车换行
$(document).on('keydown', '.editingInput', function(e) {
    if(e.keyCode == 16 && e.shiftKey) { // 禁止shift加空格进行换行
        e.preventDefault();
    }
    if(e.keyCode == 13) {
        e.preventDefault();
        sameLevel($(this))
    }else if(e.keyCode == 8 || e.keyCode == 46) {
        if($(this).val() == '') {
            $(this).parent().parent().remove()
            editingChage()
        }
    }
});

// 添加同级
$(document).on('click', '.operationAddBrother', function(e) {
    sameLevel($(this))
});

// 同级添加
function sameLevel(this_) {
    // 获取当前元素的父元素并克隆
    let parentElement = this_.closest('.topBox')
    let clonedParent = parentElement.clone();
    clonedParent.find('.topBox').remove();
    clonedParent.find('.operation_button').removeClass('selected');
    // 如果是第一级提纲, 一级提纲下标+1
    if(clonedParent.attr('data-lv') == 1) {
        clonedParent.attr('data-lvl' , (Number(parentElement.attr('data-lvl'))+1))
    }
    parentElement.after(clonedParent);
    // 将光标移动到新元素内的input上
    clonedParent.find('.editingInput').focus().val('');
    editingChage()
}

// 添加子级
$(document).on('click', '.operationAddChild', function() {
    // 找到当前元素的最近的topBox祖先元素
    let topBoxAncestor = $(this).closest('.topBox');
    if(topBoxAncestor.attr('data-lv')>=5) {
        cocoMessage.error('最多添加五级提纲', 2000);
        return
    }
    // 克隆当前元素
    let clonedParent = topBoxAncestor.clone();
    // 如果存在二级提纲则不要
    clonedParent.find('.topBox').remove().find;
    clonedParent.find('.operation_button').removeClass('selected');
    // 当前提纲等级+1, class类名等级+1
    clonedParent.attr('data-lv' , (Number(topBoxAncestor.attr('data-lv'))+1)).removeClass('editing-lv1').addClass('editing-lv'+(Number(topBoxAncestor.attr('data-lv'))+1));
    // 插入到当前元素里面
    topBoxAncestor.append(clonedParent);
    // 光标聚焦,清除输入框内容
    clonedParent.find('.editingInput').focus().val('');
    editingChage()
});

// 序号处理第一版
// function editingChage() {
//     // 第一级提纲变化
//     $('.editingBox').children('[data-lv="1"]').each(function(index){
//         if(index<=98) {
//             $(this).find('.serialNumber').text('第'+H1Rules(index+1)+'章')
//             $(this).find('.dsxz_row').attr('data-lvl' , index)
//         }else {
//             $(this).remove()
//         }
//         if($(this).children('[data-lv="2"]').length==0) return;
//         $(this).addClass('not_operation_button')

//         // 二级提纲
//         $(this).children('[data-lv="2"]').each(function(index2){
//             if(index2<=98) {
//                 $(this).find('.serialNumber').text((Number($(this).attr('data-lvl'))+1)+'.'+(index2+1))
//             }else {
//                 $(this).remove()
//             }
//             if($(this).children('[data-lv="3"]').length==0) return;
//             $(this).addClass('not_operation_button')

//             // 三级提纲
//             $(this).children('[data-lv="3"]').each(function(index3){
//                 if(index3<=98) {
//                     $(this).find('.serialNumber').text((Number($(this).attr('data-lvl'))+1)+'.'+(index2+1)+'.'+(index3+1))
//                 }else {
//                     $(this).remove()
//                 }
//                 if($(this).children('[data-lv="4"]').length==0) return;
//                 $(this).addClass('not_operation_button')

//                 // 四级提纲
//                 $(this).children('[data-lv="4"]').each(function(index4){
//                     if(index4<=98) {
//                         $(this).find('.serialNumber').text((Number($(this).attr('data-lvl'))+1)+'.'+(index2+1)+'.'+(index3+1)+'.'+(index4+1))
//                     }else {
//                         $(this).remove()
//                     }
//                     if($(this).children('[data-lv="5"]').length==0) return;
//                     $(this).addClass('not_operation_button')

//                     // 五级提纲
//                     $(this).children('[data-lv="5"]').each(function(index5){
//                         if(index5<=98) {
//                             $(this).find('.serialNumber').text((Number($(this).attr('data-lvl'))+1)+'.'+(index2+1)+'.'+(index3+1)+'.'+(index4+1)+'.'+(index5+1))
//                         }else {
//                             $(this).remove()
//                         }
//                     })
//                 })
//             })
//         })
//     })
// }

// 序号处理第二版
function editingChage() {
    const MAX_LEVEL = 5; // 最大层级限制
    const MAX_INDEX = 98; // 最大索引限制
    const LEVEL_CONFIG = {
        1: { prefix: '第', suffix: '章', formatter: (indices) => `第${H1Rules(indices[0]+1)}章` },
        2: { formatter: (indices) => `${indices[0]+1}.${indices[1]+1}` },
        3: { formatter: (indices) => `${indices[0]+1}.${indices[1]+1}.${indices[2]+1}` },
        4: { formatter: (indices) => `${indices[0]+1}.${indices[1]+1}.${indices[2]+1}.${indices[3]+1}` },
        5: { formatter: (indices) => `${indices[0]+1}.${indices[1]+1}.${indices[2]+1}.${indices[3]+1}.${indices[4]+1}` }
    };

    // 递归处理所有层级
    function processLevel($element, level = 1, parentIndices = []) {
        const $children = $element.children(`[data-lv="${level}"]`);
        if (!LEVEL_CONFIG[level] || level > MAX_LEVEL) return;
        $children.each((index, child) => {
            const $child = $(child);
            // 索引超限检查
            if (index > MAX_INDEX) return $child.remove();

            // 生成序号
            const indices = [...parentIndices, index];
            const serialNumber = LEVEL_CONFIG[level].formatter(indices);
            $child.find('.serialNumber').text(serialNumber);
            // 子元素检查
            const hasChildren = $child.children(`[data-lv="${level+1}"]`).length > 0;
            $child.toggleClass('not_operation_button', hasChildren);

            // 引言 , 绪论 , 结语 , 结论 , 结束语 , 总结 这些提纲下的子项不能添加(后端要求强匹配)
            setTimeout(() => {
                const isInhibitInsertion = ['引言' , '绪论' , '结语' , '结论' , '结束语' , '总结'].includes($child.find('.editingInput').val())
                $child.toggleClass('completely_banned', isInhibitInsertion);
            }, 100);

            // 递归处理下一级
            processLevel($child, level + 1, indices);
        });
    }

    // 初始调用（从顶级容器和第一级开始）
    $('.editingBox').each(function() {
        processLevel($(this));
    });
}


// 第一级提纲中文生成规则
function H1Rules(number) {
    var chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if(number >= 20) {
        return chineseNumbers[(Math.floor(number/10)) - 1] +chineseNumbers[9] + ((number%10)>0? chineseNumbers[(number%10)-1] : '');
    }
    if(number > 10) {
        return chineseNumbers[9] + chineseNumbers[(number%10)-1];
    }
    return chineseNumbers[number - 1];
}

// 删除提纲
$(document).on('click', '.operationDelete', function() {
    $(this).closest('.topBox').remove()
    editingChage()
});

// 图表公式代码按点击
$(document).on('click', '.operation_button', function() {
    let lt = $('.'+$(this).data('key')+'.selected').length
    if($(this).hasClass('selected')) {
        $(this).removeClass('selected')
        $('.'+$(this).data('key')+'_amount' + ' .has').text((lt-1)<=0? 0 : (lt-1))
    }else {
        if ($(this).siblings('.selected').length > 0) {
            cocoMessage.error('每行提纲最多允许插入一项!', 1000);
        }else if(lt<$('.operationPrompt .img_p .total').text()) {
            $(this).addClass('selected')
            $('.'+$(this).data('key')+'_amount' + ' .has').text(lt+1)
        }else {
            cocoMessage.error('已达到可选数量上限!', 1000);
        }
    }
});

let zdyDataTrue = false
let zdyData = []
let recommendData = []
let realtimeData = []
var throttling2 = true
var editData_index = 0; // 当前editData里面所在下标
var NewLineIndex = 0
var rid = '';
var reference_list = [] // 已选文献

function init() { // 初始化
    $('.all_literature , .empiricalData .checkbox , .gen_questionnaire , .gen_questionnaire2').prop('checked', false);
    $('.questionnaireSurvey').removeClass('selected')
    $('.empiricalData').removeClass('selected')
    throttling2 = true
    rid = '';
    reference_list = [] // 已选文献
    $('#NumberWords , #NumberWords2').val('')
    init3()
}
function init3 () {
    zdyDataTrue = false
    zdyData = []
    recommendData = []
    realtimeData = []
    editData_index = 0; // 当前editData里面所在下标
    NewLineIndex = 0
    $('#editor').html('').focus().focusout()
    $('.zdy_editMain #ImportantHint').css('display' , 'block')
    $('.outlineTab>div').removeClass('selected')
    $('.outlineTab .zdy_tab').click()
}

function init3_KTBG() {
    $('.previewContent').html('')
    // 清空预览大纲
    previewData = []
    previewOutline(previewData)
    $(".OutlineEditingMain .original .outlineContent .hidden").removeClass('hidden')
}

function dataIsCorrectV3(outline) {
    zdyData = outline
    zdyDataTrue = true
    $('.zdy_editMain').hide()
    $('.systemTJ').css('display', 'flex')
    $('.btton_regional').hide()
    RecommendedV3(outline , 'zdy')
}
// tab切换
$('.outlineTab>div').on('click', function() {
    if($(this).hasClass('selected')) return;
    numberControl.emptiedTips()
    $(this).addClass('selected').siblings().removeClass('selected')
    $('.empiricalData .checkbox').prop('checked', false);
    $('.empiricalData').removeClass('selected')
    if($(this).hasClass('zdy_tab')) { // 自定义
        if(!zdyDataTrue) {
            $('.zdy_editMain').show()
            $('.systemTJ').hide()
        }else {
            dataIsCorrectV3(zdyData)
        }
        return
    }

    $('.zdy_editMain').hide()
    $('.systemTJ').css('display', 'flex')
    if($(this).hasClass('recommend_tab')) { // 推荐提纲
        $('.btton_regional').show()
        $('.editingBox').html('') // 清空编辑框
        if(recommendData.length == 0) {
            outline_outline($('#contenteditable').val())
        }else {
            RecommendedV3(recommendData[0] , 'tjtg')
        }
    }else if($(this).hasClass('realtime_tab')) { // 实时提纲
        $('.btton_regional').hide()
        $('.editingBox').html('') // 清空编辑框
        if(realtimeData.length == 0) {
            realtimeData = []
            NewLineIndex = 0
            sseFU()
        }else {
            RecommendedV3(realtimeData, 'sstg')
        }
    }
})

// 实时提纲生成
function sseFU(fn) {
    if(typeof(EventSource) !== "undefined") {
        var source = new EventSource("https://outline.taoxiangyoushu.com/api/outline/online_generate?title="+$('#contenteditable').val()+"&words="+$("#NumberWords").val()+"&keyword="+keyWordZy+"&educations="+$("input[name='reportType']:checked").val()+"&major="+configs[$("#basic").val()]);
        loadingEditorV3(true , 'sstg')
        $('.logingEditor2').show()
        source.onmessage = function(event) {
            // 处理服务器发送的消息
            if(event.data == '[error]') {
                source.close()
                cocoMessage.error('你的请求过于频繁，请稍后再来试试吧~', 3000);
            } else if(event.data == '[outline_error]') {
                source.close()
                realtimeData = ['']
                $('.editingBox').html('') // 清空编辑框
                NewLineIndex = 0
                sseFU()
            } else if (event.data == '[DONE]'){
                source.close()
                loadingEditorV3(false , 'sstg')
                if($('.outlineTab .selected').hasClass('realtime_tab') && realtimeData[NewLineIndex]) {
                    generated_row(realtimeData[NewLineIndex])
                }
                // $('.refresh_outline .remaining').text(UsageLimit.getRemaining());
                // fn()
            } else {
                if(event.data) {
                    if(event.data!='[NN]') {
                        if(realtimeData.length==0) {
                            realtimeData[0] = ''
                        }
                        realtimeData[NewLineIndex]+=event.data
                    }else {
                        if($('.outlineTab .selected').hasClass('realtime_tab') && realtimeData[NewLineIndex]) {
                            generated_row(realtimeData[NewLineIndex])
                        }
                        NewLineIndex+=1
                        realtimeData[NewLineIndex] = ''
                    }
                    isRequest = false
                }
            }
            $('.logingEditor2').hide()
        };
        source.onerror = function(event){
            source.close()
            console.error("SSE error:", event);
            $('.logingEditor2').hide()
        };
    } else {
        console.log("错误");
    }
}

let get_outline_is = false
// 获取推荐提纲生成
function outline_outline(title) {
    loadingEditorV3(true , 'tjtg')
    if(get_outline_is) return
    get_outline_is = true
    $('.logingEditor2').show()
    $.ajax({
        type: 'post',
        url: urls + '/api/project/ai_paper_report/pre_handle/get_outline?title=' + title,
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            if (data.code == 200) {
                throttling2 = true
                recommendData = foo2(data.data)
                editData_index = recommendData.length-1
                if($('.outlineTab .selected').hasClass('recommend_tab')) {
                    RecommendedV3(recommendData[0], 'tjtg')
                }
                pageChageV3()
            }else {
                throttling2 = true
                cocoMessage.error(data.codeMsg, 3000);
            }
        },
        complete: function() {
            get_outline_is = false
        },
        error: function(err) {
            throttling2 = true
            cocoMessage.error("请求失败!请检查网络", 2000);
        }
    });
}

// 提纲加载状态
function loadingEditorV3(show , tipskey = 'tjtg') {
    const tipsText = {
        zdy: {
            generation: '加载中...',
            hasCompleted: '自写提纲已生成'
        },
        tjtg: {
            generation: '加载中...',
            hasCompleted: '推荐提纲已生成'
        },
        sstg: {
            generation: '加载中...',
            hasCompleted: '实时提纲已生成'
        }
    }
    if(show) {
        $('.TJ_loading').show()
        $('.completed , .stepBtn').hide()
        $('.TJ_lodingTips_text1').text(tipsText[tipskey].generation)
    }else {
        $('.TJ_loading').hide()
        $('.completed , .stepBtn').show()
        $('.TJ_lodingTips_text1').text(tipsText[tipskey].hasCompleted)
        $('.empiricalData .checkbox').prop('checked', false);
    }
}

// 推荐洗牌函数
function foo2(arr) {
    var cloneArr = arr.concat()
    for(var i=0; i<cloneArr.length; i++) {
        var index = Math.floor(Math.random() * cloneArr.length);
        var temp = cloneArr[index]
        cloneArr[index] = cloneArr[i]
        cloneArr[i] = temp
    }
    return cloneArr;
}

// 控制翻页显示状况
function pageChageV3() {
    if(editData_index>0) {
        $('.btton_regional_down').addClass('ok')
    }else {
        $('.btton_regional_down').removeClass('ok')
    }
    if(editData_index>=recommendData.length-1) {
        $('.btton_regional_up').removeClass('ok')
    }else {
        $('.btton_regional_up').addClass('ok')
    }
}
// 下一篇
$('.btton_regional_down').click(function() {
    if($(this).hasClass('ok') && throttling2) {
        editData_index -=1
        RecommendedV3(recommendData[editData_index], 'tjtg')
        pageChageV3()
        numberControl.emptiedTips()
    }
})
// 上一篇
$('.btton_regional_up').click(function() {
    if($(this).hasClass('ok') && throttling2) {
        editData_index +=1
        RecommendedV3(recommendData[editData_index], 'tjtg')
        pageChageV3()
        numberControl.emptiedTips()
    }
})

// 遍历数据
function RecommendedV3(outline , tipskey = 'tjtg') {
    let renderTimer = null;
    cleanup();
    $('.editingBox').html('') // 清空编辑框
    let index = 0;
    loadingEditorV3(true , tipskey)
    $('.logingEditor2').show()
    $('.editingBox').hide()
    function renderNext() {
        if (index < outline.length) {
            generated_row(outline[index]);
            index++;
            renderNext()
        }else {
            $('.editingBox').scrollTop(0);
            loadingEditorV3(false , tipskey)
            $('.logingEditor2').hide()
            $('.editingBox').show()
        }
    }
    function cleanup() {
        if (renderTimer) {
            clearTimeout(renderTimer);
            renderTimer = null;
        }
    }
    // 节点处理的过程需要时间, 用定时器截断消除按钮点击延迟的问题
    renderTimer = setTimeout(() => {
        renderNext();
    }, 200);
}

// 数据处理, 生成节点
function generated_row(item) {
    const lastTopBox = $('.editingBox .topBox').last();
    const box_lv = Number(lastTopBox.attr('data-lv'))
    // 相同等级直接添加,再赋值, 如果下一个等级低于当前等级就加子提纲, 如果高于就往上推
    const current = textProcessing(item)
    // “设计”、“开发”、“编程” 允许插入代码
    const allow_dm = current.title.indexOf('设计') != -1 || current.title.indexOf('开发') != -1 || current.title.indexOf('编程') != -1;
    if($('.editingBox').children('.topBox').length == 0) {
        var text = "";
        text += "<div class=\"topBox editing-lv1\" data-lv=\"1\" data-lvl=\"0\">";
        text += "    <div class=\"dsxz_row\">";
        text += "        <span class=\"serialNumber\">";
        text += "            第一章";
        text += "        </span>";
        text += "        <input class=\"editingInput\" type=\"text\">";
        text += "        <div class=\"operation\">";
        text += "            <span class=\"operation_button bg_operation\" data-key=\"bg_operation\">";
        text += "                <span class=\"svgBox bg_nor\"></span>";
        text += "                <span class=\"svgBox bg_pre\"></span>";
        text += "                <span class=\"svgBox bg_dis\"></span>";
        text += "            </span>";
        text += "            <span class=\"operation_button tb_operation\" data-key=\"tb_operation\">";
        text += "                <span class=\"svgBox tb_nor\"></span>";
        text += "                <span class=\"svgBox tb_pre\"></span>";
        text += "                <span class=\"svgBox tb_dis\"></span>";
        text += "            </span>";
        text += "            <span class=\"operation_button tp_operation\" data-key=\"tp_operation\">";
        text += "                <span class=\"svgBox tp_nor\"></span>";
        text += "                <span class=\"svgBox tp_pre\"></span>";
        text += "                <span class=\"svgBox tp_dis\"></span>";
        text += "            </span>";
        text += "            <span class=\"operation_button gs_operation\" data-key=\"gs_operation\">";
        text += "                <span class=\"svgBox gs_nor\"></span>";
        text += "                <span class=\"svgBox gs_pre\"></span>";
        text += "            </span>";
        text += "            <span class=\"operation_button dm_operation\" data-key=\"dm_operation\">";
        text += "                <span class=\"svgBox dm_nor\"></span>";
        text += "                <span class=\"svgBox dm_pre\"></span>";
        text += "                <span class=\"svgBox dm_dis\"></span>";
        text += "            </span>";
        text += "            <span class=\"increaseOrDecrease\">";
        text += "                <span class=\"svgBox more_nor\"></span>";
        text += "                <span class=\"svgBox more_pre\"></span>";
        text += "                <div class=\"floatingWindow\">";
        text += "                    <div>";
        text += "                        <div class=\"operationAddChild\">添加子级</div>";
        text += "                        <div class=\"operationAddBrother\">添加同级</div>";
        text += "                        <div class=\"operationDelete\">删除</div>";
        text += "                    </div>";
        text += "                </div>";
        text += "            </span>";
        text += "        </div>";
        text += "    </div>";
        text += "</div>";

        $('.editingBox').append(text)
        $('.editingBox .topBox').last().find('.editingInput').val(current.title.trim()).focus()
    }else {
        if(current.lv == box_lv) {
            // 同级添加
            sameLevel(lastTopBox.find('.operationAddBrother'))
            lastTopBox.next().find('.editingInput').val(current.title.trim())
        } else if(current.lv > box_lv) {
            // 子级添加
            lastTopBox.find('.operationAddChild').trigger('click')
            $('.editingBox .topBox').last().find('.editingInput').val(current.title.trim())
        } else if(current.lv < box_lv) {
            let parentElement = lastTopBox;
            const levelDiff = box_lv - current.lv;
            for (let i = 0; i < levelDiff && i < 4; i++) { // 往上找到同级提纲
                parentElement = parentElement.parent('.topBox');
                if (!parentElement.length) break;
            }
            if (parentElement && parentElement.length) {
                parentElement.children('.dsxz_row').find('.operationAddBrother').trigger('click');
                const lastEditingBox = $('.editingBox .topBox').last();
                if (lastEditingBox.length) {
                    lastEditingBox.find('.editingInput').val(current.title.trim());
                }
            }
        }
    }
    if(allow_dm) {
        $('.editingBox .topBox').last().find('.operation').find('.dm_operation').removeClass('prohibited').addClass('allow')
    }else {
        $('.editingBox .topBox').last().find('.operation').find('.dm_operation').removeClass('allow').addClass('prohibited')
    }
}
// 实证数据勾选
$(".empiricalData input[type=checkbox]").on('click',function (event){
    if($(this).is(':checked')) {
        $('.tb_operation').removeClass('selected').addClass('prohibited')
        $('.bg_operation').removeClass('selected').addClass('prohibited')
        $('.bg_operation_amount ,.tb_operation_amount').find('.has').text(0)
        $('.empiricalData').addClass('selected')
    }else {
        $('.tb_operation').removeClass('prohibited')
        $('.bg_operation').removeClass('prohibited')
        $('.empiricalData').removeClass('selected')
    }
})
// 
$('.gen_questionnaire2').on('click',function (event){
    if($(this).is(':checked')) {
        $('.questionnaireSurvey').addClass('selected')
    }else {
        $('.questionnaireSurvey').removeClass('selected')
    }
})
// 文本处理, 获取单行提纲等级
function textProcessing(str) {
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
    var lv = ((str.split('.').length)>5? '5':(str.split('.').length))
    var title = removeNumberPrefix(str)
    return {
        lv: lv,
        title: title
    }
}

$('.editGenerate_next_step').click(function(e) {
    $('.Insert_window').show()
    $('.Insert_window').find('.bg_number').text(selected_row().tab.length)
    $('.Insert_window').find('.img_number').text(selected_row().img.length)
    $('.Insert_window').find('.aiImg_number').text(selected_row().aiImg.length)
    $('.Insert_window').find('.formula_number').text(selected_row().formula.length)
    $('.Insert_window').find('.dm_number').text(selected_row().code.length)
    let issz = $(".empiricalData input[type=checkbox]").is(':checked')
    let iswj = $(".gen_questionnaire2").is(':checked')
    if(!issz) {
        $('.Insert_szsj i').show()
        $('.Insert_szsj img').hide()
        $('.Insert_szsj .Insert_text span').text('未')
    }else {
        $('.Insert_szsj i').hide()
        $('.Insert_szsj img').show()
        $('.Insert_szsj .Insert_text span').text('已')
    }
    if(!iswj) {
        $('.Insert_wjdc i').show()
        $('.Insert_wjdc img').hide()
        $('.Insert_wjdc .Insert_text span').text('未')
    }else {
        $('.Insert_wjdc i').hide()
        $('.Insert_wjdc img').show()
        $('.Insert_wjdc .Insert_text span').text('已')
    }
})

// 图片,表格,代码,公式所在行
function selected_row() {
    key = {
        bg_operation: [],
        tb_operation: [],
        gs_operation: [],
        dm_operation: [],
        tp_operation: []
    }
    $('.dsxz_row .operation_button.selected').each(function() {
        var parentRow = $(this).closest('.dsxz_row');
        var rowNumber = $('.dsxz_row').index(parentRow);
        key[$(this).data('key')].push(rowNumber)
    })
    return {
        tab: key.bg_operation,
        img: key.tb_operation,
        code: key.dm_operation,
        formula: key.gs_operation,
        aiImg: key.tp_operation
    }
}
// 下一步按钮
$('.Insert_window .Insert_sure').click(function(e) {
	// is强制登录拦截
	if(memberFu.interceptLogin && memberFu.interceptLogin()) return false;
    e.stopPropagation();
    if($(this).attr('ischecked') == 'false') return;

    if($('#NumberWords3').val() != $('#NumberWords').val() || $(".gen_questionnaire2").is(':checked') != $(".gen_questionnaire").is(':checked')) {
        pre_handlePreOrder($('#contenteditable').val() , $('#NumberWords3').val() , $(this) , $(".gen_questionnaire2").is(':checked'))
        throttling2 = true
        return
    }
    $('#NumberWords3').removeClass('errColor')
    // 开始检验提纲
    var outline = []
    var closeMsg = cocoMessage.loading('正在提交提纲,请稍后...');
    function filterHtml(){
        $('.editingBox .dsxz_row').each(function(index, domele) {
            outline.push($(this).children('.serialNumber').text() + $(this).children('.editingInput').val())
        })
        if(outline.length) {
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
                        if(data.data.msg=='no') { // 有错误的情况
                            closeMsg();
                            cocoMessage.error('第'+(data.data.outline[0].error_index+1)+'行格式有误,'+data.data.outline[0].error_message , 2000);
                        }else { //没有错误的情况
                            throttling2 = true
                            UpdateOutlineV3(outline)
                        }
                    } else {
                        closeMsg();
                        cocoMessage.error(data.codeMsg, 3000);
                        setTimeout(function() {
                            throttling2 = true
                        }, 500)
                    }
                },
                error: function(err) {
                    closeMsg();
                    cocoMessage.error("请求失败!请检查网络", 2000);
                    throttling2 = true
                }
            });
        }else {
            cocoMessage.error("未检测到提纲!!", 2000);
            throttling2 = true
        }
    }
    filterHtml()
    function UpdateOutlineV3(outline) {
        if(!throttling2 || !outline.length) return;
        var form_data = getFormData({
            rid,
            outline,
            must: true,
            szGoodsId: $(".empiricalData input[type=checkbox]").is(':checked') ? $('.empiricalData').attr('data-goodsid') : '',
            version: 'v3',
            theme:'v3',
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
                    var tabKey = $('.outlineTab .selected').data('key')
                    var formData = {
                        goods_id: $("#type_s").val(),
                        domain_record: window.location.origin,
                        customer_invitation: dct_code,
                        theme:'v3'
                    }
                    formData['data[rid][label]'] = '记录ID'
                    formData['data[rid][value]'] = rid
                    formData['data[outline_type][label]'] = '提纲类型'
                    formData['data[outline_type][value]'] = tabKey
                    formData['data[reference_list][label]'] = '参考文献'
                    formData['data[reference_list][value]'] = reference_list
                    formData['data[choose_outline][label]'] = '定制提纲'
                    formData['data[choose_outline][value][tab]'] = selected_row().tab
                    formData['data[choose_outline][value][img]'] = selected_row().img
                    formData['data[choose_outline][value][aiImg]'] = selected_row().aiImg
                    formData['data[choose_outline][value][code]'] = selected_row().code
                    formData['data[choose_outline][value][formula]'] = selected_row().formula
                    // 自写开题报告
                    if($(".proposal-check").is(':checked') && typeData[$("#type_s").val()].short_name=='bylwsenior'){
                        if(fid) {
                            formData['data[gen_ktbg][label]'] = '开题报告';
                            formData['data[gen_ktbg][value]'] = $(".proposal-check").is(':checked')?1:0;
                            formData['data[fid][label]'] = '文件标识';
                            formData['data[fid][value]'] = fid;
                        }else if(ktbg_generate) {
                            formData['order_sn'] = ktbg_generate
                        }
                    }
                    unifiedCreate(getFormData(formData), null , outline , function callback(data , goods_id , hasKtbg , NumberWords1){
                        // $('.previewResults .unlock span').text(data.order_amount)
                        var money=data.order_amount
                        var parts = money.split('.');
                        var integerPart = parts[0]; // 整数部分
                        var decimalPart = parts[1] || '0';
                        $('.Before_amount').text(integerPart)
                        $('.After_amount').text("."+decimalPart)
                        // 第四步
                        $('.rightCont').attr('id', 'OperationSteps4');
                        $('.Insert_window').hide()
                        previewResults(outline)
                        $('.unlock').click(function() {
                            if(!$('.inputCheck2').prop("checked")) return cocoMessage.error('请确认知晓并同意 "生成的论文范文仅用于参考,不作为毕业、发表使用" 条款!', 3000)
                            $(".pay_window .pay_box iframe").css('height', '720px')
                            $('.pay_window').show()
                            $('.pay_box iframe').attr('src', './window_pay.html?order_sn=' + data.order_sn + '&contentType=' + goods_id + '&zxktbg=' + hasKtbg+'&wordNum='+NumberWords1+'&szsj_check='+($(".empiricalData input[type=checkbox]").is(':checked')? 1:0))
                        })
                    })
                    $('#NumberWords3').removeClass('errColor')
                }else {
                    throttling2 = true
                    closeMsg();
                    $('#NumberWords3').addClass('errColor')
                    cocoMessage.error(data.codeMsg, 2000);
                }
            },
            error: function(err) {
                throttling2 = true
                closeMsg();
                cocoMessage.error("请求失败!请检查网络", 2000);
            }
        });
    }
})

function getKeyword() {
    let keyWordZy = []
    $("#mf_keyword_list li").each(function () {
        keyWordZy.push($(this).find('input').val()+'；')
    })
    return keyWordZy
}
function previewResults(outline) {
    $('.previewResults .title_yl span').text($('#contenteditable').val());
    $('.previewResults .outline_yl').html('');
    if(getKeyword().length > 0) {
        $('.keywords_yl span').text(getKeyword().join(''));
    }else {
         $('.keywords_yl span').addClass('noData')
    }
    for(var i=0; i<outline.length; i++) {
        if(i>=9) break; // 最多显示9条
        var current = outline[i]
        var outlineHtml = `<div class="outline_item">
            <span class="outline_text">${current}</span>
        </div>`;
        $('.previewResults .outline_yl').append(outlineHtml);
    }
}

function previewResultsKTBG() {
    var textArr = []
    var element = ''
    $(".previewResults .template_ktbg .content_ktbg").html('')
    $('.previewResults .title_yl span').text($('#contenteditable').val());
    for (var i=0; i<previewData.length; i++) {
        if(previewData[i].dataLvl == 1 && previewData[i].level == 1) {
            textArr.push(previewData[i])
        }
        if(previewData[i].dataLvl == 2 && previewData[i].level == 1) {
            textArr.push(previewData[i])
        }
    }
    for (var i=0; i<textArr.length; i++) {
        element += '<p class="outline_1">'+ textArr[i].dataLvl +'.'+ textArr[i].outline +'</p>' +
            '           <div class="div1">本段文字为占位文字,非生成内容,本研究针对具体研究问题/领域中存在的某些关键挑战与局限性，展开系统探究。通过综合运用方法论A、方法论B及技术C等核心方法，构建了一个新型的理论框架/模型/分析体系。研究过程着重关注了核心变量X、影响因素Y与现象Z之间的内在关联与作用机制。基于对数据类型数据的采集与分析（样本量 N=数值），结合严谨的统计方法/仿真验证，这些发现不仅深化了对研究主题的理解，也为相关应用领域提供了潜在的优化路径与理论支撑。非生成内容......</div>' +
            '           <div class="div1">本段文字为占位文字,非生成内容,本研究针对具体研究问题/领域中存在的某些关键挑战与局限性，展开系统探究。基于对数据类型数据的采集与分析（样本量 N=数值），结合严谨的统计方法/仿真验证，结果表明：所提出的方法/框架在关键性能指标1（提升约模糊数值%）和关键性能指标2（降低模糊数值）方面展现出显著效果，有效克服了现有对比方法的不足。这些发现不仅深化了对研究主题的理解，也为相关应用领域提供了潜在的优化路径与理论支撑。非生成内容......</div>'
    }
    $(".previewResults .template_ktbg .content_ktbg").append(element)
}

$('.pay_close').on('click', function () {
    closePopup()
})
function closePopup() {
    $('.pay_window').hide()
    $('.pay_box iframe').attr('src', '')
}

// 第三步
function outlineStage(data) {
    $('.rightCont').attr('id', 'OperationSteps3');
    reference_list = data
    let szsjzz = typeData[$("#type_s").val()].increment_goods_infos.szsjzz || typeData[$("#type_s").val()].increment_goods_infos.qkszsjzz
    if(szsjzz) {
        $('.empiricalData , .Insert_szsj').show().attr('data-goodsid' , szsjzz.goods_id)
        $('.empirical_price').text(szsjzz.selling_price+'/'+szsjzz.unit_count+szsjzz.unit_type)
    }else {
        $('.empiricalData , .Insert_szsj').hide()
    }
    numberControl.emptiedTips()
}

//开题报告  第三步
function EditingOutlineKTBG(data) {
    reference_list = data
    $('.rightCont').attr('id', 'OperationSteps3');
    $(".rightCont").scrollTop(0)
    EditingKTBG()
}

// 开题报告创建订单
function UpdateKTBGV3() {
    var bootstrapValidator = $("#ContainerTo").data("bootstrapValidator").validate();
    if (bootstrapValidator.isValid()) {
        if(!throttling) return
        var formData = {
            goods_id: $("#type_s").val(),
            domain_record: window.location.origin,
            source: 1,
            customer_invitation: dct_code,
            theme:'v3'
        }
        formData['data[title][label]'] = '论文标题'
        formData['data[title][value]'] = $('#contenteditable').val()
        if(typeData[$('#type_s').val()].short_name == 'ktbgsenior') { // 开题报告专业版
            formData['data[education][label]'] = '学历'
            formData['data[education][value]'] = $(".selectDegree .cardSelect").data('education')
            if(ktbgProfessional.length) {
                formData['data[outlines][label]'] = '提纲'
                for(var kt=0; kt<ktbgProfessional.length; kt++) {
                    formData['data[outlines][value]['+kt+']'] = ktbgProfessional[kt]
                }
            }else {
                return cocoMessage.error("请编辑自定义提纲!", 2000);
            }
            formData['data[reference_list][label]'] = '参考文献'
            formData['data[reference_list][value]'] = reference_list
            unifiedCreate(getFormData(formData) , $("#type_s").val() , previewData, function callback(data , goods_id , hasKtbg , NumberWords1){
                var money=data.order_amount
                var parts = money.split('.');
                var integerPart = parts[0]; // 整数部分
                var decimalPart = parts[1] || '0';
                $('.Before_amount').text(integerPart)
                $('.After_amount').text("."+decimalPart)
                // 第四步
                $('.rightCont').attr('id', 'OperationSteps4');
                previewResultsKTBG()
                $('.unlock').click(function() {
                    if(!$('.inputCheck2').prop("checked")) return cocoMessage.error('请确认知晓并同意 "生成的论文范文仅用于参考,不作为毕业、发表使用" 条款!', 3000)
                    $(".pay_window .pay_box iframe").css('height', '500px')
                    $('.pay_window').show()
                    $('.pay_box iframe').attr('src', './window_pay.html?order_sn=' + data.order_sn + '&contentType=' + goods_id + '&zxktbg=' + hasKtbg+'&wordNum='+NumberWords1+'&szsj_check='+($(".empiricalData input[type=checkbox]").is(':checked')? 1:0))
                })
            })
        }
    }
}

// 预下单,生成提纲id
$("#next_step").on('click',function (){
	// is强制登录拦截
	if(memberFu.interceptLogin && memberFu.interceptLogin()) return false;
    $('.editTips2').hide()
    if(!$('.inputCheck').prop("checked")) return cocoMessage.error('请确认知晓并同意 "生成的论文范文仅用于参考,不作为毕业、发表使用" 条款!', 3000)
    var bootstrapValidator = $("#ContainerTo").data("bootstrapValidator").validate();

    // 补充说明字数验证
    if( typeData[$("#type_s").val()].short_name=='bylwsenior' || typeData[$("#type_s").val()].short_name=='bylwsenior_zrb' || typeData[$("#type_s").val()].short_name=='qklwsenior'){
        if($("#illustrate").val().length > 0) {
            if($("#illustrate").val().length < 200) {
                $(".professional").css('borderColor', '#f34f4f')
                $(".professional-err").show()
                return;
            }
        }
    }

    // 期刊论文
    if(typeData[$('#type_s').val()].short_name == 'qklwsenior') {
        if(!$(".periodicalType.select")[0]){
            $(".selectPeriodical .periodical-err").show();
        }
        // if(!$(".l-numB.select")[0]){
        //     $(".literatureNum .literatureNum-err").show();
        // }
    }
    if (bootstrapValidator.isValid()) {
        if( typeData[$("#type_s").val()].short_name=='ktbgsenior' ){ // 开题报告直接跳转
            LiteratureSelectionKTBG()
            // EditingKTBG()
            return
        }
        if(typeData[$('#type_s').val()].short_name == 'qklwsenior') {
            if(!$(".periodicalType.select")[0]){
                $(".selectPeriodical .periodical-err").show();
                return ;
            }
            // if(!$(".l-numB.select")[0]){
            //     $(".literatureNum .literatureNum-err").show();
            //     return ;
            // }
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

        let isChecked = $(".gen_questionnaire").is(':checked');
        $(".gen_questionnaire2").prop('checked', isChecked);
        if(isChecked) {
            $('.questionnaireSurvey').addClass('selected')
        }else {
            $('.questionnaireSurvey').removeClass('selected')
        }
        $('#NumberWords3').val($("#NumberWords").val())
        pre_handlePreOrder($('#contenteditable').val() , $("#NumberWords").val())
    }
})

function pre_handlePreOrder(contenteditable , NumberWords , button_this , gen_questionnaire2) {
    if(!throttling2) return
    if(!NumberWords) {
        cocoMessage.error("论文字数不能为空", 2000);
        return
    }
    throttling2 = false
    // 如果gen_questionnaire2存在说明是编辑提纲修改
    let questionnaire = gen_questionnaire2? (gen_questionnaire2?1:0):($(".gen_questionnaire").is(':checked')?1:0)
    var formData = {
        title: contenteditable,
        word_num: NumberWords,
        theme:'v3',
        gen_img: $(".gen_img").is(':checked')?1:0,
        gen_tab:  $(".gen_tab").is(':checked')?1:0,
        gen_formula: $(".gen_formula").is(':checked')?1:0,
        gen_code: $(".gen_code").is(':checked')?1:0,
        questionnaire: questionnaire,
        goods_id: $('#type_s').val(),
    }
    if( typeData[$('#type_s').val()].short_name == 'qklwsenior' ) {
        formData.is_paper_type = $(".periodicalType.select").attr('data-type')
        // formData.references_num_type = $(".l-numB.select").attr('data-num')
        // 英文参考
        // var LiteratureType =$('input:checkbox[name="LiteratureType"]').is(':checked');
        // if(LiteratureType) {
        //     formData.references_en_num = $('#NumberEnglishReference').val()
        // }else {
        //     formData.references_en_num =0
        // }
        //补充说明
        if($("#illustrate").val().length > 0) {
            if($("#illustrate").val().length < 200) {
            }else{
                formData.reference_content = $("#illustrate").val()
            }
        }
    }

    if( typeData[$('#type_s').val()].short_name == 'bylwsenior' || typeData[$('#type_s').val()].short_name == 'bylwsenior_zrb'  ) {
        if($("#illustrate").val().length > 0) {
            if($("#illustrate").val().length < 200) {
            }else{
                formData.reference_content = $("#illustrate").val()
            }
        }
        if($(".education_c").css('display') !== 'none'){
            formData.education = $("input[name='reportType']:checked").val()
        }
        if((typeData[$('#type_s').val()].short_name == 'bylwsenior' || typeData[$('#type_s').val()].short_name == 'bylwsenior_zrb') && $("#basic").val() && $("#basic").val() !== 'A'){
            if($(".major").css('display') !== 'none'){
                formData.paper_type = configs[$("#basic").val()]
            }
        }
        // 英文参考
        // var LiteratureType =$('input:checkbox[name="LiteratureType"]').is(':checked');
        // if(LiteratureType) {
        //     formData.references_en_num = $('#NumberEnglishReference').val()
        // }else {
        //     formData.references_en_num =0
        // }

        // 自写开题报告
        if($(".proposal-check").is(':checked') && fid){
            formData.fid = fid
        }else if(ktbg_generate){
            formData['order_sn'] = ktbg_generate
        }
    }

    if($(".keywordBox").css('display') !== 'none'){
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
                    $('.rightCont').attr('id', 'OperationSteps2');
                    $(".rightCont").scrollTop(0)
                    $(".submittedH3 .title_text .paper_title").text(contenteditable)
                    $(".recommend_l .operate_btn .check_all").addClass('disabled_btn')
                    getLiterature(contenteditable, NumberWords, $("input[name='reportType']:checked").val())
                }else {
                    $('#NumberWords').val($("#NumberWords3").val())
                    $(".gen_questionnaire").prop('checked', questionnaire);
                    button_this.click()
                }
                throttling2 = true
            } else {
                throttling2 = true
                cocoMessage.error(data.codeMsg, 3000);
                $('#NumberWords3').addClass('errColor')
            }
        },
        error: function(err) {
            throttling2 = true
            cocoMessage.error("请求失败!请检查网络", 2000);
        }
    });
}

function LiteratureSelectionKTBG() {
    $('.rightCont').attr('id', 'OperationSteps2');
    $(".rightCont").scrollTop(0)
    $(".submittedH3 .title_text .paper_title").text($('#contenteditable').val())
    $(".recommend_l .operate_btn .check_all").addClass('disabled_btn')
    getLiterature($('#contenteditable').val(), 'KTBG')
}

// 现在要求的效果是: 减少字数后不给清空已选择的小图标
$('#NumberWords3').on('input',function () {
    numberControl.emptiedTips(true)
    $(this).removeClass('errColor')
    // numberControl.uncheck(['tb_operation' , 'bg_operation' , 'tp_operation' , 'gs_operation' , 'dm_operation'])
})
$('.Lower , .up').on('click',function () {
    numberControl.emptiedTips(true)
    // numberControl.uncheck(['tb_operation' , 'bg_operation' , 'tp_operation' , 'gs_operation' , 'dm_operation'])
})
var numberControl = {
    uncheck: function(keyArr) {
        for(let i = 0; i < keyArr.length; i++) {
            $('.'+keyArr[i]).removeClass('selected')
        }
    },
    emptiedTips: function(is) {
        // 图片, 表格 , 公式 , 代码准插入量设置
        var total = $("#NumberWords3").val()<=10000? 1:$("#NumberWords3").val()<=20000? 2:3
        $('.operationPrompt .total').text(total)
        if(!is) $('.operationPrompt .has').text(0)
    }
}

$(".questionnaireSurvey .title .allowClick").on('click',function (){
    $(this).siblings('input').click()
})

$(".empiricalData .title .allowClick").on('click',function (){
    $(this).siblings('input').click()
})
