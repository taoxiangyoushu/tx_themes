/*  AI推荐题目
    * 改js依赖的其他js
    * 1. jquery.min.js
    * 2. coco-message.js
    * 3. smartTopic.css
*/
// aiTopicFu = new aiTopic ({
//     ele	 : '#titleID', // 插入节点
//     urls : urls, // 接口域名
//     USER_TOKEN: USER_TOKEN,
//     JANE_NAME: JANE_NAME,
//     inputID: '#contenteditable', // 对应的input节点
//     TriggerButton: '.optimize', // 触发推荐节点class名称
// });

(function(window, document) {
	var aiTopic = function(options) {
        //初始化 new对象
		if (!(this instanceof aiTopic)) {
			return new aiTopic(options)
		}
		//设置默认参数
		this.localValue = {
			ele: '#titleID',
            urls: 'https://api.taoxiangyoushu.com',
            USER_TOKEN: '',
            JANE_NAME: '',
            inputID: '#contenteditable',
            TriggerButton: '.optimize'
        }
		//参数覆盖
		this.opt = this.extend(this.localValue, options, true)
        // 所需参数
        this.timeout = null
        this.again = true
        if ((typeof options.ele) === "string") {
			this.opt.ele = $(options.ele)
		} else {
			this.opt.ele = options.ele
		}
		this.initDom();
	}
    aiTopic.prototype = {
        constructor: this,
        initDom: function() {
            if($(this.opt.ele).length) {
                this.addRecommendedTitle()
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
        addRecommendedTitle: function() {
            var _this=this
            var text = "";
            text += "<div class=\"smartTopic\">";
            text += "    <div class=\"smartHead\">";
            text += "        <div class=\"version1 smartHead1\">";
            text += "            <img class=\"hot\" src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/hot.svg\" alt=\"\">";
            text += "            热门标题";
            text += "            <span class=\"ChangeBatch\">";
            text += "                <img src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/RefreshTopic.svg\" alt=\"\">";
            text += "                换一批";
            text += "            </span>";
            text += "        </div>";
            text += "        <div class=\"version2 smartHead2\">";
            text += "            <span class=\"titleText\">AI智能原创推荐标题</span>";
            text += "            <span class=\"ChangeBatch\">";
            text += "                <img src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/RefreshTopic.svg\" alt=\"\">";
            text += "                换一批";
            text += "            </span>";
            text += "        </div>";
            text += "        <div class=\"version3 smartLoading\">";
            text += "            <p class=\"titleText\">AI正在智能推荐标题</p>";
            text += "            <div class=\"mainLoading\">";
            text += "                <span class=\"has\">";
            text += "                    <img class=\"finishImg\" src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/finish.svg\" alt=\"\">";
            text += "                    <img class=\"loadingImg\" src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/loading.svg\" alt=\"\">";
            text += "                    数据收集与预处理";
            text += "                </span>";
            text += "                <i></i>";
            text += "                <span class=\"beBeing\">";
            text += "                    <img class=\"finishImg\" src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/finish.svg\" alt=\"\">";
            text += "                    <img class=\"loadingImg\" src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/loading.svg\" alt=\"\">";
            text += "                    <img class=\"unfinishImg\" src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/unfinish.svg\" alt=\"\">";
            text += "                    深度分析";
            text += "                </span>";
            text += "                <i></i>";
            text += "                <span class=\"not\">";
            text += "                    <img class=\"finishImg\" src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/finish.svg\" alt=\"\">";
            text += "                    <img class=\"unfinishImg\" src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/unfinish.svg\" alt=\"\">";
            text += "                    完成";
            text += "                </span>";
            text += "            </div>";
            text += "        </div>";
            text += "    </div>";
            text += "    <div class=\"smartContent\">";
            text += "        <div class=\"version1\">";
            text += "            <ul class=\"smartMain1\">";
            text += "            </ul>";
            text += "        </div>";
            text += "        <div class=\"version2\">";
            text += "            <ul class=\"smartMain2\">";
            text += "            </ul>";
            text += "        </div>";
            text += "    </div>";
            text += "</div>";
            this.opt.ele.append(text)

            $(document).on('click',this.opt.TriggerButton,function (){
                _this.getData()
            })
            $(document).mouseup(function(e) {
                if (!$(e.target).closest('.smartTopic').length) {
                    $('.smartTopic').hide()
                }
            });
            $(document).on('click','.ChangeBatch',function (){
                _this.getData()
            })
            $(document).on('click','.smartMain1 li , .smartMain2 li',function (){
                $(_this.opt.inputID).val($(this).children('.text').text())
                $(_this.opt.inputID).trigger('change')
                $('.smartTopic').hide()
            })
        },
        getData: function() {
            $('.smartTopic').show()
            if(this.again) {
                this.again = false
                $('.version3').show().attr('class' , 'version3 smartLoading hasStatus') // 加载第一步
                $('.version1').hide()
                $('.version2').hide()
                if($(this.opt.inputID).val()){
                    // 优化标题
                    this.gen_title($(this.opt.inputID).val())
                }else {
                    // 推荐标题
                    this.search_title()
                }
            }
        },
        // 推荐标题
        search_title: function() {
            var this_ = this
            $.ajax({
                type: 'post',
                url: this.opt.urls + '/api/project/ai_paper_report/pre_handle/search_title?user_token='+ USER_TOKEN + '&jane_name='+ JANE_NAME,
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    if (data.code == 200) {
                        var text = ''
                        for(var i=0; i<data.data.length;i++) {
                            text += "<li>";
                            text += "    <p class=\"text\">"+data.data[i]+"</p>";
                            text += "    <span class=\"adopted\">+ 采纳</span>";
                            text += "</li>";
                        }
                        $('.smartMain1').html('').append(text)

                        $('.version3').attr('class' , 'version3 smartLoading beBeingStatus') // 加载第二步
                        setTimeout(function() {
                            $('.version3').attr('class' , 'version3 smartLoading notStatus') // 加载第三步
                            setTimeout(function() {
                                $('.version2 , .version3').hide()
                                $('.version1').show()
                                this_.again = true
                            }, 500)
                        }, 1500)
                    } else {
                        cocoMessage.error(data.codeMsg, 3000);
                        $('.smartTopic').hide()
                        this_.again = true
                    }
                },
                error: function(err) {
                    cocoMessage.error("请求失败!请检查网络", 2000);
                    $('.smartTopic').hide()
                    this_.again = true
                }
            });
        },
        
        // 通过标题预下单
        gen_title: function (val) {
            var _this=this
            $.ajax({
                type: 'post',
                url: this.opt.urls + '/api/project/ai_paper_report/pre_handle/gen_title?user_token='+ USER_TOKEN + '&jane_name='+ JANE_NAME,
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                data: getFormData({
                    title: val
                }),
                success: function(data) {
                    if (data.code == 200) {
                        $('.version3').attr('class' , 'version3 smartLoading beBeingStatus') // 加载第二步
                        _this.get_title(data.data.rid)
                    } else {
                        cocoMessage.error(data.codeMsg, 3000);
                        $('.smartTopic').hide()
                    }
                },
                error: function(err) {
                    cocoMessage.error("请求失败!请检查网络", 2000);
                    $('.smartTopic').hide()
                    this_.again = true
                }
            });
        },

        // 通过rid优化标题
        get_title:function (rid) {
            var _this=this
            $.ajax({
                type: 'post',
                url: this.opt.urls + '/api/project/ai_paper_report/pre_handle/get_title?user_token='+ USER_TOKEN + '&jane_name='+ JANE_NAME,
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                data: getFormData({
                    rid: rid
                }),
                success: function(data) {
                    clearTimeout(_this.Timeout)
                    if (data.code == 200) {
                        var text = ''
                        for(var i=0; i<data.data.titles.length;i++) {
                            text += "<li>";
                            text += "    <p class=\"text\">"+data.data.titles[i]+"</p>";
                            text += "</li>";
                        }
                        $('.smartMain2').html('').append(text)

                        $('.version3').attr('class' , 'version3 smartLoading notStatus') // 加载第三步
                        setTimeout(function() {
                            $('.version1 , .version3').hide()
                            $('.version2').show()
                            _this.again = true
                        }, 500)
                    } else {
                        if(data.code=2001) {
                            _this.Timeout = setTimeout(function() {
                                _this.get_title(rid)
                            }, 2000)
                        }else {
                            cocoMessage.error(data.codeMsg, 3000);
                            $('.smartTopic').hide()
                            _this.again = true
                        }
                    }
                },
                error: function(err) {
                    cocoMessage.error("请求失败!请检查网络", 2000);
                    $('.smartTopic').hide()
                    _this.again = true
                }
            });
        }
    }
    window.aiTopic = aiTopic;
})(window, document)
