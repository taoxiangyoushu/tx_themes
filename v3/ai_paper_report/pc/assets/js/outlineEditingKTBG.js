    var least = 0;
    var educationKTBG = ''
    var maxlenght = 0
    function EditingKTBG() {
        if(!LiteratureFU()) return;
        // $('.OutlineEditingKTBG').show()
        if(educationKTBG != $('.selectDegree .cardSelect').data('education')) {
            educationKTBG = $('.selectDegree .cardSelect').data('education')
            maxlenght = $('.selectDegree .cardSelect').data('key')
            $('.outlineContent').html('')
            $('.previewContent').html('')
            previewData = []
            var closeMsg = cocoMessage.loading('正在获取数据...');
            $.ajax({
                type: 'post',
                url: urls + "/api/project/ai_paper_report/pre_handle/pre_data?type=ktbg_outline&education="+educationKTBG+"",
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function success(result) {
                    closeMsg()
                    if(result.code == '200') {
                        least = result.data.min_len
                        var data = result.data.outlines
                        var html = ''
                        var dataLvl = 0
                        for(var i=0; i<data.length; i++) {
                            if(data[i].level == 1) {
                                dataLvl++
                            }
                            html+="<div class='aidashi outline-lv"+data[i].level+"' data-lv='"+data[i].level+"' data-lvl='"+dataLvl+"'>"
                            html+=      data[i].outline
                            html+=      "<div data-lv='"+data[i].level+"' data-lvl='"+dataLvl+"' class='add_icon'></div>"
                            html+= "</div>"
                        }
                        $('.outlineContent').append(html);
                    }
                }
            });
        }
    }

    $(document).on('click','.add_icon',function (){ // 加
        if($(this).data('lv') == 1) {
            // 点击第一级提纲, 遍历当前提纲下所有提纲
            $('.outlineContent [data-lvl="'+$(this).data('lvl')+'"]').filter('.aidashi').each(function() {
                previewData.push(
                    {
                        level: $(this).data('lv'),
                        outline: $(this).text(),
                        dataLvl: $(this).data('lvl')
                    }
                )
                $(this).children('.add_icon').addClass('hidden')
            });
        }else if($(this).data('lv') == 2) {
            var IndexKey = 0
            for(var i=0; i<previewData.length; i++) {
                if(previewData[i].dataLvl == $(this).data('lvl')) {
                    IndexKey = i+1
                }
            }
            if(IndexKey) {
                previewData.splice(IndexKey, 0, {
                    level: $(this).data('lv'),
                    outline: $(this).parent().text(),
                    dataLvl: $(this).data('lvl')
                })
            }else {
                previewData.push(
                    {
                        level: 1,
                        outline: $('.outlineContent [data-lv="1"][data-lvl="'+$(this).data('lvl')+'"]').text(),
                        dataLvl: $(this).data('lvl')
                    },{
                        level: 2,
                        outline: $(this).parent().text(),
                        dataLvl: $(this).data('lvl')
                    }
                )
            }
            $(this).addClass('hidden')
            $('.outlineContent [data-lv="1"][data-lvl="'+$(this).data('lvl')+'"]').children('.add_icon').addClass('hidden')
        }
        previewOutline(previewData)
    })
    $(document).on('click','.subtracting_icon',function (){ // 减
        if($(this).data('lv') == 1) {
            var previewData2=[]
            for(var i=0; i<previewData.length; i++) {
                if(previewData[i].dataLvl != $(this).data('lvl')) {
                    previewData2.push(previewData[i])
                }
            }
            previewData = previewData2
            previewOutline(previewData)

            var this_ = $(this) // 一二级提纲加号允许出现
            $('.outlineContent [data-lvl="'+$(this).data('lvl')+'"]').filter('.aidashi').each(function() {
                $(this).children('.add_icon').removeClass('hidden')
            });
        }else {
            previewData.splice($(this).data('index'), 1);

            var this_ = $(this) // 二级提纲允许出现
            $('.outlineContent [data-lvl="'+$(this).data('lvl')+'"]').filter('.aidashi').each(function() {
                if(this_.data('text') == $(this).text()) {
                    $(this).children('.add_icon').removeClass('hidden')
                }
            });
        }
        previewOutline(previewData)
    });

    function previewOutline(data) { // 右边数据变化
        ktbgseniorOutline(data)
        // 预计字数
        var numberOfWords = classificationCount(data , 'dataLvl') * 650
        if(numberOfWords>0) {
            $('.NumberWordsKTBG').text(numberOfWords>maxlenght? maxlenght : numberOfWords)
            $('.EstimatedNumberWords').css('display' , 'flex')
            $('.EstimatedNumberWords').css('align-items' , 'center')
            $('.confirmedKTBGzdy').css('top','-16px')
            $('.confirmedKTBGzdy').css('margin-top','0px')
        }else {
            $('.EstimatedNumberWords').css('display' , 'none')
            $('.confirmedKTBGzdy').css('top','0px')
            $('.confirmedKTBGzdy').css('margin-top','20px')
        }
        $('.previewTips').hide()
    }

    $('.confirmedKTBGzdy').click(function() { // 弹窗生成按钮, 将数据给到index文件的变量,  直接创建订单
        if(previewData.length<least) {
            $('.previewTips').show()
        }else {
            ktbgProfessional= []
            $('.previewContent div').filter('.aidashi').each(function() {
                ktbgProfessional.push($(this).text().replace(/\s+$/, ''))
            });
            professionalSubmitted()
        }
    })

    $('.OutlineEditingKTBG .delete').click(function() {
        $('.OutlineEditingKTBG').hide()
    })

    $(document).on('click','.up_lv',function (){
        adjustmentData($(this).parent().parent('.aidashi') , 'up')
    }) 
    $(document).on('click','.down_lv',function (){
        adjustmentData($(this).parent().parent('.aidashi') , 'down')
    }) 
    
    function adjustmentData(this_ , type) {
        if(this_.data('lv') == 1) { // 一级提纲
            var dataLvl = this_.data('hierarchy')-1
            if(type == 'up') { // 上
                if(dataLvl>0) {
                    previewData = adjustment(this_ , this_.prev().data('lvl') , 'up')
                    previewOutline(previewData)
                }
            }else { // 下
                if(dataLvl<maxLvl-1) {
                    var TargetLvl = ''
                    this_.nextAll().each(function() {
                        if($(this).data('lvl') != this_.data('lvl')) {
                            TargetLvl = $(this).data('lvl')
                            return false
                        }
                    })
                    previewData = adjustment(this_ , TargetLvl)
                    previewOutline(previewData)
                }
            }
        }else if(this_.data('lv') == 2) { //二级提纲
            if(type == 'up') { // 上
                if(this_.prev().data('lv') != 1) {
                    var index = this_.data('index')
                    var a = previewData[index]
                    previewData[index] = previewData[index-1]
                    previewData[index-1] = a
                    previewOutline(previewData)
                }
            }else { // 下
                if(this_.next().data('lv') != 1) {
                    var index = this_.data('index')
                    var a = previewData[index]
                    previewData[index] = previewData[index+1]
                    previewData[index+1] = a
                    previewOutline(previewData)
                }
            }
        }
    }


// 一级提纲排序, 整理数据
function adjustment(this_ , TargetLvl , type) {
    var previewData2=[] // 前
    var previewData3=[] // 当前点击
    var previewData5=[] // 后
    var previewData4=[] // 目标
    var is= true
    for(var i=0; i<previewData.length; i++) {
        if(previewData[i].dataLvl == this_.data('lvl')) {
            previewData3.push(previewData[i])
        }else if(previewData[i].dataLvl == TargetLvl) {
            previewData4.push(previewData[i])
            is = false
        }else {
            if(is) {
                previewData2.push(previewData[i])
            }else {
                previewData5.push(previewData[i])
            }
        }
    }
    if(type == 'up') {
        return [...previewData2 , ...previewData3, ...previewData4 , ...previewData5]
    }else {
        return [...previewData2 , ...previewData4, ...previewData3 , ...previewData5]
    }
}

var maxLvl = 0
function ktbgseniorOutline(data) {
    var html = ''
    var dataLvl = 0 
    var second = 0
    for(var i=0; i<data.length; i++) {
        if(data[i].level == 1) {
            dataLvl++
            second=0
        }
        html+="<div class='aidashi previewOutline outline-lv"+data[i].level+"' data-index='"+ i +"' data-hierarchy='"+dataLvl+"' data-lv='"+data[i].level+"' data-lvl='"+data[i].dataLvl+"'>"
        html+=      (dataLvl + '.' + (second || ''))+ ' ' + data[i].outline
        html+="     <div class='sort'>"
        html+="         <span class='up_lv'></span><span class='down_lv'></span>"
        html+="     </div>"
        html+="     <div data-text='"+data[i].outline+"' data-lv='"+data[i].level+"' data-index='"+ i +"' data-lvl='"+data[i].dataLvl+"' class='subtracting_icon'></div>"
        html+="</div>"
        second++
    }
    maxLvl = dataLvl
    $('.previewContent').html('').append(html);

    setTimeout(function() {
        var this_up = ''
        var lv_up = 1
        $('.previewContent .aidashi').each(function(e) {
            if(($(this).data('lv') == 1 && this_up && this_up.data('lv')==2)) {
                this_up.addClass('down_lv_no')
            }
            if(e==$('.previewContent .aidashi').length-1) {
                $(this).addClass('down_lv_no')
            }
            if((lv_up==1 && $(this).data('lv')==2) || e == 0) {
                $(this).addClass('up_lv_no')
            }
            lv_up = $(this).data('lv')
            this_up = $(this)
        })
    }, 50)
}

// 排序计数算出有效提纲(有二级提纲一级提纲无效, 无二级提纲一级提纲有效)
function classification(arr , prop) {
    var grouped = {};
    arr.forEach((item , index) => {
        var key = item[prop];
        if(!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(item);
    });
    return grouped
}

function classificationCount(arr , prop) {
    var grouped = classification(arr , prop)
    var index = 0
    for (var keys in grouped) {
        if (grouped.hasOwnProperty(keys)) {
            index+=grouped[keys].length>1? grouped[keys].length-1 : 1
        }
    }
    return index
}
