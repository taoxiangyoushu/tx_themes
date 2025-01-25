/*
    * 改js依赖的其他js
    * 1. jquery.min.js
    * 2. coco-message.js
*/
(function(window, document) {
    //定义上传类
	var member = function(options) {
		//初始化 new对象
		if (!(this instanceof member)) {
			return new member(options)
		}
		//设置默认参数
		this.localValue = {
			ele: '#App',
            urls: 'https://api.taoxiangyoushu.com',
            whether: false,
            USER_TOKEN: '',
            JANE_NAME: '',
            binding: false, // 手机号绑定
            success_info: function(){},
            complete_info: function(){},
            exitLogin: function(){},
            bindingSuccessful: function(){},
            avatar_min: 'txLogin', // 小头像
            avatar_max: 'tx', // 大头像
            drop_down: 'arrowDL', // 下拉箭头
            query_ico: 'query', // 默认查询图标
            query_selected_ico: 'query2', // 选中查询图片
            exit_ico: 'exit', // 默认退出图标
            exit_selected_ico: 'exit2', // 选中退出图标
            delete_ico: 'close_dl', // 关闭弹窗小按钮
            bindingText: '短信验证码登录',
            bindingButton: '登录',
            loginTips: '未注册手机号验证后自动登录',
            is_activity: false,
        }

		//参数覆盖
		this.opt = this.extend(this.localValue, options, true)
		//所需变量
		this.i = 0;
        this.Timeout = null;
        this.time = 150;
        this.isLogin = false
		if ((typeof options.ele) === "string") {
			this.opt.ele = $(options.ele)
		} else {
			this.opt.ele = options.ele
		}
		this.initDom();
	}
    member.prototype = {
        constructor: this,
        //初始化
        initDom: function() {
            this.createOverlay() // 遮罩层
            if(this.opt.whether&&(this.opt.whether.is_must_login_enable||this.opt.whether.is_must_phone_login_enable)) {
                this.createQRCodeBox() // 二维码扫码
                this.SMSloginbox()//手机号登录
            }else if(!this.opt.binding){
                this.opt.complete_info(false)
                return;
            }
            if(this.opt.binding) {
                if(!this.MergeBox){
                    this.bind_phone() // 绑定手机号
                }
            }
            this.createLoginButtonBox() // 登录按钮
            this.createFloatingWindowBox() // 已登录浮窗
            this.userUserInfo() // 获取用户信息
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
        // 创建登录按钮
        createLoginButtonBox: function() {
            var html = ''
            html += '<div class="loginBox">'
            html += '   <div style="display: none;" class="loginButton">登录</div>'
            html += '   <div style="display: none;" class="hasLogin">'
            html += '       <img class="txLogin" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.avatar_min+'.png" alt="">'
            html += '       <img class="arrowDL" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.drop_down+'.png" alt="">'
            html += '   </div>'
            html += '</div>'
            this.loginBox = $(html)
            this.loginBox.css({
                "display": "inline-block",
                "position": "absolute",
                "right": "36px",
                "top": "24px",
                "cursor": "pointer",
                "z-index": "999"
            }).children('.loginButton').css({
                "font-size": "14px",
                "text-align": "center",
                "border": "#0072FF 1px solid",
                "width": "66px",
                "height": "32px",
                "lineHeight": "31px",
                "borderRadius": "15px",
                "color": "#0081FF",
                "float": "right",
                "background": "#fff"
            });
            this.loginBox.children('.hasLogin').css({
                "width": "66px",
                "height": "42px",
                "background": "#F7F8FB",
                "border-radius": "21px",
                "padding": "5px",
                "float": "right",
            }).children('.arrowDL').css({
                "margin-left": "4px"
            });
            this.loginBox.children('.hasLogin').children('.txLogin').css({
                "max-height": "100%"
            })
            this.opt.ele.append(this.loginBox)
            var _this = this
            this.loginBox.children('.loginButton').mouseover(
                function() {
                    _this.loginBox.children('.loginButton').css('background' , '#EBF4FF')
                }
            )
            this.loginBox.children('.loginButton').mouseout(
                function() {
                    _this.loginBox.children('.loginButton').css('background' , '#fff')
                }
            )

            // 点击出现登录弹窗
            this.loginBox.children('.loginButton').click(function() {
                _this.openLogin()
            })

            // 浮窗显示与隐藏
            $('.loginBox').mouseover(function() {
                if(_this.isLogin) {
                    $('.FloatingWindow').show()
                }
            })
            $('.loginBox').mouseout(function() {
                $('.FloatingWindow').hide()
            })
        },

        // 创建登录按钮浮窗
        createFloatingWindowBox: function() {
            var html = ''
            html+= '<div class="FloatingWindow">'
            html+= '    <div class="userName">'
            html+= '        <img src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.avatar_max+'.png" alt=""> <span>正在获取</span>'
            html+= '    </div>'
            html+= '    <div class="resultsQuery">'
            html+= '        <img class="query img1" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.query_ico+'.png?v=p2.001" alt="">'
            html+= '        <img style="display: none;" class="query2 img2" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.query_selected_ico+'.png?v=p2.001" alt="">'
            html+= '        查询结果'
            html+= '    </div>'
            html+= '    <div class="logOut">'
            html+= '        <img class="exit img1" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.exit_ico+'.png?v=p.2001" alt="">'
            html+= '        <img style="display: none;" class="exit2 img2" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.exit_selected_ico+'.png?v=p2.001" alt="">'
            html+= '        退出登录'
            html+= '    </div>'
            html+= '</div>'
            this.floatingWindow = $(html)
            this.floatingWindow.css({
                "width": "210px",
                "background-color": "#ffffff",
                "box-shadow": "0px 0px 9px 0px rgba(0, 0, 0, 0.15)",
                "border-radius": "5px",
                "color": "#666666",
                "text-align": "left",
                "cursor": "default",
                "padding-bottom": "10px",
                "display": "none",
                "font-size": "14px",
                "margin-top": "50px"
            });
            this.floatingWindow.children('.userName').css({
                "margin": "0 22px 0 22px",
                "padding": "20px 0 17px 0",
                "margin-bottom": "10px",
                "border-bottom": "1px solid #f3f3f3"
            }).children('img').css({
                "margin-right": "4px",
            })

            this.floatingWindow.children('.resultsQuery , .logOut').css({
                "height": "36px",
                "line-height": "36px",
                "padding-left": "28px",
                "cursor": "pointer",
            }).children('img').css({
                "margin-right": "8px",
                "position": "relative",
                "top": "-1px",
            })
            this.loginBox.append(this.floatingWindow)

            var children = this.floatingWindow.children('.resultsQuery , .logOut')
            children.mouseover(
                function() {
                    $(this).children('.img1').hide()
                    $(this).children('.img2').show()
                    $(this).css({
                        "color": "#333333",
                        "background-color": "#F7F8FB"
                    })
                }
            )
            children.mouseout(
                function() {
                    $(this).children('.img2').hide()
                    $(this).children('.img1').show()
                    $(this).css({
                        "color": "#666",
                        "background-color": "#fff"
                    })
                }
            )
            $('.resultsQuery').click(function() {
                location.href = '/query.html'
            })

            var _this = this
            $('.logOut').click(function() {
                _this.apiuserLogout()
            })
        },

        //创建遮罩
		createOverlay: function() {
			this.overlay = $('<div class="cupload-overlay"></div>')
            this.overlay.css({
                "display": "none",
                "position": "fixed",
                "textAlign": "center",
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0,
                "zIndex": 9115,
                "backgroundColor": "rgba(0,0,0,.3)",

            })
            this.opt.ele.append(this.overlay)
			var _this = this
			this.overlay.click(function() {
				_this.closeslogin()
                _this.closeslogin2()
            })
		},

        // 创建登录二维码
        createQRCodeBox: function() {
            var html = ''
            html += '<div class="QRCodeBox">'
            html += '    <img class="closedDL " src="https://api.taoxiangyoushu.com/html/v1/utils/img/close.png" alt="">'
            html += '    <img class="closedDL closehover" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.delete_ico+'.png" alt="">'
            html += '    <div class="whiteboard">'
            html += '        <div class="Switchlogin">'
            html += '           <div class="SMS_verification">'
            html += '               <span class="SMS_button Switch_phone">短信验证码登录</span>'
            html += '               <img class="SMS_image Switch_phone" src="https://api.taoxiangyoushu.com/html/v1/utils/img/Mobilelogin.png">'
            html += '           </div>'
            html += '        </div>'
            html += '        <h3>微信扫码登录</h3>'
            html += '        <div class="QRCodeDL">'
            html += '           <div style="display: none;" class="QRCodeDiv" id="QRCodeDiv"><img src="" alt=""></div>'
            html += '           <div class="load">'
            html += '               <img src="https://api.taoxiangyoushu.com/html/v1/utils/img/loding.gif" alt="">'
            html += '           </div>'
            html += '           <div style="display: none;" class="mask">'
            html += '               <img src="https://api.taoxiangyoushu.com/html/v1/utils/img/expired.png" alt="">'
            html += '               <p>点击刷新</p>'
            html += '           </div>'
            html += '        </div>'
            html += '        <div class="loginTips"><img class="wx_icon" src="https://api.taoxiangyoushu.com/html/v1/utils/img/wx_icon.png" alt="">微信扫码，关注后自动登录</div>'
            html += '       <p class="PromptText">微信和手机号是两个独立账号，账号信息不互通</p>'
            html += '    </div>'
            html += '</div>'
			this.QRCodeBox = $(html)
            this.QRCodeBox.css({
                "display": "none",
                "position": "fixed",
                "left": '50%',
                "top": '50%',
                "z-index": '10000',
                "margin-left": "-180px",
                "margin-top": "-250px",
                "text-align": "center",
            }).children('.closedDL').css({
                "position": "absolute",
                "right": "-35px",
                "cursor": "pointer",
            })

            var HOVER=this.QRCodeBox.children('.closehover')
            HOVER.css({
                'display':'none'
            })

            this.QRCodeBox.children('.closedDL').mouseover(function(){
                HOVER.css({
                    'display':'block'
                })
            })
            this.QRCodeBox.children('.closedDL').mouseout(function(){
                HOVER.css({
                    'display':'none'
                })
            })
            var SMS=this.QRCodeBox.children('.whiteboard').children('.Switchlogin').children('.SMS_verification')
            SMS.css({
                "text-align": "right"
            })

            SMS.children('.SMS_button').css({
                "display": "inline-block",
                "background-image":"url(https://api.taoxiangyoushu.com/html/v1/utils/img/SMS_background.png)",
                "background-size": "100% 100%",
                "background-repeat": "no-repeat",
                "color":"#0096FF",
                "font-size": "12px",
                "width":"110px",
                "height":"22px",
                "line-height":"24px",
                "text-align":"center",
                "position": "relative",
                "top": "20px",
                "left": "10px",
                "cursor": "pointer",
            })
            SMS.children('.SMS_image').css({
                "float":"right",
                "cursor": "pointer",
            })

            var children = this.QRCodeBox.children('.whiteboard')
            children.css({
                "width": "360px",
                "height": "380px",
                "background-color": "#ffffff",
                "border-radius": "15px",
            })
            children.children('.Switchlogin').css({
                "height":"60px",
                "with":"100%"
            })

            children.children('h3').css({
                "color": "#333333",
                "font-size": "24px",
                "font-weight": "bold",
                "padding-bottom": "24px",
                "margin-top": "0px"
            })

            children.children('.QRCodeDL').css({
                "width": "176px",
                "height": "171px",
                "border-radius": "5px",
                "border": "solid 1px #c4c9d0",
                "margin": "auto",
                "position": "relative"
            }).children('.QRCodeDiv').css({
                "background-color": "#ccc",
                "width": "100%",
                "height": "100%",
            }).children('img').css({
                "width": "100%",
                "height": "100%",
                "border-radius": "5px",
            })


            children.children('.QRCodeDL').children('.load').css({
                "width": "100%",
                "height": "100%",
            }).children('img').css({
                "width": "100%",
                "height": "100%",
            })
            children.children('.QRCodeDL').children('.mask').css({
                "width": "100%",
                "height": "100%",
                "background-color": "#ccc",
                "font-size": "16px",
                "color": "#fff",
                "cursor": "pointer",
            }).children('img').css({
                "margin-top": "52px",
                "margin-bottom": "10px",
            })

            children.children('.loginTips').css({
                "font-size": "16px",
                "color": "#888888",
                "line-height": "14px",
                "margin-top": "22px"
            }).children('img').css({
                "margin-right": "12px",
                "position": "relative",
                'top': "-2px"
            })
            children.children('.PromptText').css({
                "font-size":"12px",
                "color":"#C6C6C6",
                "margin-top": "12px"
            })
            this.opt.ele.append(this.QRCodeBox)
            var _this = this

            this.QRCodeBox.children('.closedDL').click(function() {
				_this.closeslogin()
            })

            SMS.children('.Switch_phone').click(function(){
                _this.Switchphone()
            })

            $('.QRCodeDL .mask').click(function() {
                _this.weixinQrCLogin()
            })
        },

          // 创建手机号登录
          SMSloginbox: function() {
            var html = ''
            html += '<div class="SMSodeBox">'
            html += '    <img class="closedDL" src="https://api.taoxiangyoushu.com/html/v1/utils/img/close.png" alt="">'
            html += '    <img class="closedDL closehover" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.delete_ico+'.png" alt="">'
            html += '    <div class="whiteboard">'
            html += '        <div class="Switchlogin">'
            html += '           <div class="WeChat_verification">'
            html += '               <span class="WeChat_button Switchscann_code">微信扫码登录</span>'
            html += '               <img class="WeChat_image Switchscann_code" src="https://api.taoxiangyoushu.com/html/v1/utils/img/QRcode_login.png">'
            html += '           </div>'
            html += '        </div>'
            html += '        <h3>短信验证码登录</h3>'
            html += '        <div class="QRCodeDL">'
            html += '            <form id="formSubmit">  '
            html += '             <div class="Enter_number border1">'
            html += '                   <img src="https://api.taoxiangyoushu.com/html/v1/utils/img/phone.png"/>'
            html += '                   <input placeholder="请输入手机号" class="number_input" id="phone" autocomplete="off" name="phone"/>'
            html += '               </div>'
            html += '                   <span id="phone_err"></span>'
            html += '             <div class="Verification_Code border1">'
            html += '                   <input placeholder="请输入验证码" class="Code_input" name="phone_code" autocomplete="off"/>'
            html += '                    <li></li>'
            html += '                   <span class="obtain">获取验证码<span/>'
            html += '               </div>'
            html += '                   <span id="phone_code_err"></span>'
            html += '             </form>'
            html += '             <div class="Confirmlogin">登录</div>'
            html += '        </div>'
            html += '        <div class="loginTips">未注册手机号验证后自动登录</div>'
            html += '       <p class="PromptText">微信和手机号是两个独立账号，账号信息不互通</p>'
            html += '    </div>'
            html += '</div>'
			this.SMSodeBox = $(html)
            this.SMSodeBox.css({
                "display": "none",
                "position": "fixed",
                "left": '50%',
                "top": '50%',
                "z-index": '10000',
                "margin-left": "-180px",
                "margin-top": "-250px",
                "text-align": "center",
            }).children('.closedDL').css({
                "position": "absolute",
                "right": "-35px",
                "cursor": "pointer",
            })

            var HOVER=this.SMSodeBox.children('.closehover')
            HOVER.css({
                'display':'none'
            })

            this.SMSodeBox.children('.closedDL').mouseover(function(){
                HOVER.css({
                    'display':'block'
                })
            })
            this.SMSodeBox.children('.closedDL').mouseout(function(){
                HOVER.css({
                    'display':'none'
                })
            })

            var WECHAT=this.SMSodeBox.children('.whiteboard').children('.Switchlogin').children('.WeChat_verification')
            WECHAT.css({
                "text-align": "right",
            })

            WECHAT.children('.WeChat_button').css({
                "display": "inline-block",
                "background-image":"url(https://api.taoxiangyoushu.com/html/v1/utils/img/SMS_background.png)",
                "background-size": "100% 100%",
                "background-repeat": "no-repeat",
                "color":"#0096FF",
                "font-size": "12px",
                "width":"100px",
                "height":"22px",
                "line-height":"24px",
                "text-align":"center",
                "position": "relative",
                "top": "20px",
                "left": "10px",
                "cursor": "pointer",
            })

            WECHAT.children('.WeChat_image').css({
                "float":"right",
                "cursor": "pointer",
            })


            var children = this.SMSodeBox.children('.whiteboard')
            children.css({
                "width": "360px",
                "height": "380px",
                "background-color": "#ffffff",
                "border-radius": "15px",
            })
            children.children('.Switchlogin').css({
                "height":"60px",
                "with":"100%"
            })

            children.children('h3').css({
                "color": "#333333",
                "font-size": "24px",
                "font-weight": "bold",
                "padding-bottom": "24px",
                'margin-top':'0px'
            })
            children.children('.QRCodeDL').css({
                "width":"288px",
                "height": "176px",
                "margin": "auto",
                "position": "relative"
            }).children('.Confirmlogin').css({
                'height': '45px',
                'background': 'linear-gradient(90deg, #006CFF, #0096FF)',
                'border-radius': '5px',
                'line-height': '45px',
                'font-size': '16px',
                'color': '#FFFFFF',
                'margin-top': '30px',
                "cursor": "pointer",
            })
            children.children('.QRCodeDL').children('#formSubmit').children('#phone_err').css({
                "position": "absolute",
                "color": "#F56C6C",
                "top": "37px",
                "left":"0px"
            }).children('.help-block').css({
                "color": "#F56C6C",
            })
            children.children('.QRCodeDL').children('#formSubmit').children('#phone_code_err').css({
                "position": "absolute",
                "color": "#F56C6C",
                "left":"0px"
            })

            children.children('.loginTips').css({
                "font-size": "14px",
                "color": "#888888",
                "line-height": "14px",
                "margin-top": "22px"
            }).children('img').css({
                "margin-right": "12px",
                "position": "relative",
                'top': "-2px"
            })
            children.children('.PromptText').css({
                "font-size":"12px",
                "color":"#C6C6C6",
                "margin-top": "12px"
            })

            var NUMBER=this.SMSodeBox.children('.whiteboard').children('.QRCodeDL').children('#formSubmit').children('.Enter_number')
            NUMBER.css({
                "width": "100%",
                "height":"40px",
                "padding":"0px 0px 0px 14px",
                "border": "solid 1px #C4C9D0",
                "border-radius": "5px",
                "text-align": "left",
            }).children('img').css({
                "position": "relative",
                "top": "-2px",
                "margin-right": "4px",
            })
            NUMBER.children('.number_input').css({
                    "height": "100%",
                    "width": "90%",
                    "border": "none",
                    "font-size": "14px",
            })

            var CODE=this.SMSodeBox.children('.whiteboard').children('.QRCodeDL').children('#formSubmit').children('.Verification_Code')
            CODE.css({
                "width": "100%",
                "height":"40px",
                "padding":"0px 0px 0px 14px",
                "border": "solid 1px #C4C9D0",
                "border-radius": "5px",
                "text-align": "left",
                "margin-top": "20px",
            })
            CODE.children('li').css({
                "display": "inline-block",
                "width": "1px",
                "height": "20px",
                "background-color": "#C4C9D0",
                "position": "relative",
                "top": "5px"
            })
            CODE.children('.Code_input').css({
                    "height": "100%",
                    "width": "65%",
                    "border": "none",
                    "border-radius": "5px",
                    "font-size": "14px",
            })
            CODE.children(".obtain").css({
                "display": "inline-block",
                "width": '31%',
                "position": "relative",
                'font-size':" 14px",
                "color": "#0096FF",
                "text-align": "center",
                'cursor': 'pointer',
            }).children('li').css({
                "display": "inline-block",
                "width": "1px",
                "height": "20px",
                "background-color": "#C4C9D0",
                "float": "left",
            })
            var LOGIN=this.SMSodeBox.children('.whiteboard').children('.QRCodeDL').children('.Confirmlogin')

            LOGIN.mouseover(function(){
                $(this).css({
                    'background': 'linear-gradient(260deg, #006CFF, #0096FF)',
                })
            })
            LOGIN.mouseout(function(){
                $(this).css({
                    'background': 'linear-gradient(90deg, #006CFF, #0096FF)',
                })
            })

            this.opt.ele.append(this.SMSodeBox)
            var _this = this

            this.SMSodeBox.children('.closedDL').click(function() {
				_this.closeslogin()
            })

            NUMBER.children('.number_input').focus(function(){
                NUMBER.css({
                    "border": "solid 1px #0096FF",
                })
                $(this).css({
                    "outline": "none"
                })
            })
            NUMBER.children('.number_input').blur(function(){
                NUMBER.css({
                    "border": "solid 1px #C4C9D0",
                })
            })

            CODE.children('.Code_input').focus(function(){
                CODE.css({
                    "border": "solid 1px #0096FF",
                })
                $(this).css({
                    "outline": "none"
                })
            })
            CODE.children('.Code_input').blur(function(){
                CODE.css({
                    "border": "solid 1px #C4C9D0",
                })
            })

            WECHAT.children('.Switchscann_code').click(function(){
                _this.Switchscanncode()
            })
            CODE.children(".obtain").click(function(){
                _this.Obtainverificationcode()
            })

            LOGIN.click(function(){
                _this.Verificationcodelogin()
            })
            $('.QRCodeDL .mask').click(function() {
                _this.weixinQrCLogin()
            })
        },

        // 创建手机号绑定
        bind_phone: function() {
            var html = ''
            html += '<div class="SMSodeBox" id="bindingMobile">'
            html += '    <img class="closedDL" src="https://api.taoxiangyoushu.com/html/v1/utils/img/close.png" alt="">'
            html += '    <img class="closedDL closehover" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.delete_ico+'.png" alt="">'
            html += '    <div class="whiteboard">'
            html += '        <div class="Switchlogin">'
            html += '           <div class="WeChat_verification"></div>'
            html += '        </div>'
            html += '        <h3>'+this.opt.bindingText+'</h3>'
            html += '        <div class="QRCodeDL">'
            html += '            <form id="formSubmit2">  '
            html += '             <div class="Enter_number border1">'
            html += '                   <img src="https://api.taoxiangyoushu.com/html/v1/utils/img/phone.png"/>'
            html += '                   <input placeholder="请输入手机号" class="number_input2" id="phone2" autocomplete="off" name="phone"/>'
            html += '               </div>'
            html += '                   <span id="phone_err2"></span>'
            html += '             <div class="Verification_Code border1">'
            html += '                   <input placeholder="请输入验证码" class="Code_input2" name="phone_code" autocomplete="off"/>'
            html += '                    <li></li>'
            html += '                   <span class="obtain">获取验证码<span/>'
            html += '               </div>'
            html += '                   <span id="phone_code_err2"></span>'
            html += '             </form>'
            html += '             <div class="BindingNow">'+this.opt.bindingButton+'</div>'
            html += '        </div>'
            html += '        <div class="loginTips">'+this.opt.loginTips+'</div>'
            html += '    </div>'
            html += '</div>'
			this.SMSodeBox2 = $(html)
            this.SMSodeBox2.css({
                "display": "none",
                "position": "fixed",
                "left": '50%',
                "top": '50%',
                "z-index": '10000',
                "margin-left": "-180px",
                "margin-top": "-250px",
                "text-align": "center",
            }).children('.closedDL').css({
                "position": "absolute",
                "right": "-35px",
                "cursor": "pointer",
            })

            var HOVER=this.SMSodeBox2.children('.closehover')
            HOVER.css({
                'display':'block'
            })

            this.SMSodeBox2.children('.closedDL').mouseover(function(){
                HOVER.css({
                    'display':'none'
                })
            })
            this.SMSodeBox2.children('.closedDL').mouseout(function(){
                HOVER.css({
                    'display':'block'
                })
            })

            var children = this.SMSodeBox2.children('.whiteboard')
            children.css({
                "width": "360px",
                "height": "380px",
                "background-color": "#ffffff",
                "border-radius": "15px",
            })
            children.children('.Switchlogin').css({
                "height":"60px",
                "with":"100%"
            })

            children.children('h3').css({
                "color": "#333333",
                "font-size": "24px",
                "font-weight": "bold",
                "padding-bottom": "24px",
                'margin-top':'0px'
            })
            children.children('.QRCodeDL').css({
                "width":"288px",
                "height": "176px",
                "margin": "auto",
                "position": "relative"
            }).children('.BindingNow').css({
                'height': '45px',
                'background': 'linear-gradient(90deg, #006CFF, #0096FF)',
                'border-radius': '5px',
                'line-height': '45px',
                'font-size': '16px',
                'color': '#FFFFFF',
                'margin-top': '30px',
                "cursor": "pointer",
            })
            children.children('.QRCodeDL').children('#formSubmit2').children('#phone_err2').css({
                "position": "absolute",
                "color": "#F56C6C",
                "top": "37px",
                "left":"0px"
            }).children('.help-block').css({
                "color": "#F56C6C",
            })
            children.children('.QRCodeDL').children('#formSubmit2').children('#phone_code_err2').css({
                "position": "absolute",
                "color": "#F56C6C",
                "left":"0px"
            })

            children.children('.loginTips').css({
                "font-size": "14px",
                "color": "#888888",
                "line-height": "14px",
                "margin-top": "22px"
            }).children('img').css({
                "margin-right": "12px",
                "position": "relative",
                'top': "-2px"
            })
            children.children('.PromptText').css({
                "font-size":"12px",
                "color":"#C6C6C6",
                "margin-top": "12px"
            })

            var NUMBER=this.SMSodeBox2.children('.whiteboard').children('.QRCodeDL').children('#formSubmit2').children('.Enter_number')
            NUMBER.css({
                "width": "100%",
                "height":"40px",
                "padding":"0px 0px 0px 14px",
                "border": "solid 1px #C4C9D0",
                "border-radius": "5px",
                "text-align": "left",
            }).children('img').css({
                "position": "relative",
                "top": "-2px",
                "margin-right": "4px",
            })
            NUMBER.children('.number_input2').css({
                    "height": "100%",
                    "width": "90%",
                    "border": "none",
                    "font-size": "14px",
            })

            var CODE=this.SMSodeBox2.children('.whiteboard').children('.QRCodeDL').children('#formSubmit2').children('.Verification_Code')
            CODE.css({
                "width": "100%",
                "height":"40px",
                "padding":"0px 0px 0px 14px",
                "border": "solid 1px #C4C9D0",
                "border-radius": "5px",
                "text-align": "left",
                "margin-top": "20px",
            })
            CODE.children('li').css({
                "display": "inline-block",
                "width": "1px",
                "height": "20px",
                "background-color": "#C4C9D0",
                "position": "relative",
                "top": "5px"
            })
            CODE.children('.Code_input2').css({
                    "height": "100%",
                    "width": "65%",
                    "border": "none",
                    "border-radius": "5px",
                    "font-size": "14px",
            })
            CODE.children(".obtain").css({
                "display": "inline-block",
                "width": '31%',
                "position": "relative",
                'font-size':" 14px",
                "color": "#0096FF",
                "text-align": "center",
                'cursor': 'pointer',
            }).children('li').css({
                "display": "inline-block",
                "width": "1px",
                "height": "20px",
                "background-color": "#C4C9D0",
                "float": "left",
            })
            var BindingNow=this.SMSodeBox2.children('.whiteboard').children('.QRCodeDL').children('.BindingNow')

            BindingNow.mouseover(function(){
                $(this).css({
                    'background': 'linear-gradient(260deg, #006CFF, #0096FF)',
                })
            })
            BindingNow.mouseout(function(){
                $(this).css({
                    'background': 'linear-gradient(90deg, #006CFF, #0096FF)',
                })
            })
            this.opt.ele.find('#bindingMobile').remove();
            this.opt.ele.append(this.SMSodeBox2)
            var _this = this

            this.SMSodeBox2.children('.closedDL').click(function() {
				_this.closesBinding()
            })

            NUMBER.children('.number_input2').focus(function(){
                NUMBER.css({
                    "border": "solid 1px #0096FF",
                })
                $(this).css({
                    "outline": "none"
                })
            })
            NUMBER.children('.number_input2').blur(function(){
                NUMBER.css({
                    "border": "solid 1px #C4C9D0",
                })
            })

            CODE.children('.Code_input2').focus(function(){
                CODE.css({
                    "border": "solid 1px #0096FF",
                })
                $(this).css({
                    "outline": "none"
                })
            })
            CODE.children('.Code_input2').blur(function(){
                CODE.css({
                    "border": "solid 1px #C4C9D0",
                })
            })

            CODE.children(".obtain").click(function(){
                _this.Obtainverificationcode2()
            })

            BindingNow.click(function(){
                _this.Verificationcodelogin2()
            })
            $('.QRCodeDL .mask').click(function() {
                _this.weixinQrCLogin()
            })
        },

        // 创建二维码/手机号  二合一登录
        createMergeBox: function (){
            var html = ''
            html += '<div class="MergeBox">'
            html += '    <img class="closedDL " src="https://api.taoxiangyoushu.com/html/v1/utils/img/close.png" alt="">'
            html += '    <img class="closedDL closehover" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.delete_ico+'.png" alt="">'
            html += '    <div class="QRCodeBox">'
            html += '        <div class="whiteboard">'
            html += '            <div class="Switchlogin">'
            html += '            </div>'
            html += '            <h3>微信扫码登录</h3>'
            html += '            <div class="QRCodeDL">'
            html += '                <div style="display: none;" class="QRCodeDiv" id="QRCodeDiv"><img src="" alt=""></div>'
            html += '                <div class="load">'
            html += '                    <img src="https://api.taoxiangyoushu.com/html/v1/utils/img/loding.gif" alt="">'
            html += '                </div>'
            html += '                <div style="display: none;" class="mask">'
            html += '                    <img src="https://api.taoxiangyoushu.com/html/v1/utils/img/expired.png" alt="">'
            html += '                    <p>点击刷新</p>'
            html += '                </div>'
            html += '            </div>'
            html += '            <div class="loginTips"><img class="wx_icon" src="https://api.taoxiangyoushu.com/html/v1/utils/img/wx_icon.png" alt="">微信扫码，关注后自动登录</div>'
            html += '        </div>'
            html += '    </div>'
            html += '    <div class="SMSodeBox" id="bindingMobile">'
            html += '        <div class="whiteboard">'
            html += '            <div class="Switchlogin">'
            html += '                <div class="WeChat_verification"></div>'
            html += '            </div>'
            html += '            <h3>'+this.opt.bindingText+'</h3>'
            html += '            <div class="QRCodeDL">'
            html += '                <form id="formSubmit2">  '
            html += '                <div class="Enter_number border1">'
            html += '                        <img src="https://api.taoxiangyoushu.com/html/v1/utils/img/phone.png"/>'
            html += '                        <input placeholder="请输入手机号" class="number_input2" id="phone2" autocomplete="off" name="phone"/>'
            html += '                    </div>'
            html += '                        <span id="phone_err2"></span>'
            html += '                <div class="Verification_Code border1">'
            html += '                        <input placeholder="请输入验证码" class="Code_input2" name="phone_code" autocomplete="off"/>'
            html += '                        <li></li>'
            html += '                        <span class="obtain">获取验证码<span/>'
            html += '                    </div>'
            html += '                        <span id="phone_code_err2"></span>'
            html += '                </form>'
            html += '                <div class="BindingNow">'+this.opt.bindingButton+'</div>'
            html += '            </div>'
            html += '            <div class="loginTips">'+this.opt.loginTips+'</div>'
            html += '        </div>'
            html += '    </div>'
            html += '</div>'
            this.MergeBox = $(html)
            this.MergeBox.css({
                "display": "none",
                "position": "fixed",
                "left": '50%',
                "top": '50%',
                "z-index": '10000',
                "transform": "translate(-50%, -50%)",
                "text-align": "center",
                "width": "750px",
            }).children('.closedDL').css({
                "position": "absolute",
                "right": "-35px",
                "cursor": "pointer",
            })

            this.MergeBox.children('.QRCodeBox').css({
                "float": "left"
            })

            this.MergeBox.children('.SMSodeBox').css({
                "float": "left"
            })

            var HOVER=this.MergeBox.children('.closehover')
            HOVER.css({
                'display':'none'
            })

            this.MergeBox.children('.closedDL').mouseover(function(){
                HOVER.css({
                    'display':'block'
                })
            })
            this.MergeBox.children('.closedDL').mouseout(function(){
                HOVER.css({
                    'display':'none'
                })
            })

            //  二合一  扫码部分
            var SMS=this.MergeBox.children('.QRCodeBox').children('.whiteboard').children('.Switchlogin').children('.SMS_verification')
            SMS.css({
                "text-align": "right"
            })

            SMS.children('.SMS_button').css({
                "display": "inline-block",
                "background-image":"url(https://api.taoxiangyoushu.com/html/v1/utils/img/SMS_background.png)",
                "background-size": "100% 100%",
                "background-repeat": "no-repeat",
                "color":"#0096FF",
                "font-size": "12px",
                "width":"110px",
                "height":"22px",
                "line-height":"24px",
                "text-align":"center",
                "position": "relative",
                "top": "20px",
                "left": "10px",
                "cursor": "pointer",
            })
            SMS.children('.SMS_image').css({
                "float":"right",
                "cursor": "pointer",
            })

            var children = this.MergeBox.children('.QRCodeBox').children('.whiteboard')
            children.css({
                "width": "350px",
                "height": "380px",
                "background-color": "#ffffff",
                "border-top-left-radius": "15px",
                "border-bottom-left-radius": "15px",
                "border-right": "1px solid #e1e1e1",
            })
            children.children('.Switchlogin').css({
                "height":"60px",
                "with":"100%"
            })

            children.children('h3').css({
                "color": "#333333",
                "font-size": "24px",
                "font-weight": "bold",
                "padding-bottom": "24px",
                "margin-top": "0px"
            })

            children.children('.QRCodeDL').css({
                "width": "176px",
                "height": "171px",
                "border-radius": "5px",
                "border": "solid 1px #c4c9d0",
                "margin": "auto",
                "position": "relative"
            }).children('.QRCodeDiv').css({
                "background-color": "#ccc",
                "width": "100%",
                "height": "100%",
            }).children('img').css({
                "width": "100%",
                "height": "100%",
                "border-radius": "5px",
            })


            children.children('.QRCodeDL').children('.load').css({
                "width": "100%",
                "height": "100%",
            }).children('img').css({
                "width": "100%",
                "height": "100%",
            })
            children.children('.QRCodeDL').children('.mask').css({
                "width": "100%",
                "height": "100%",
                "background-color": "#ccc",
                "font-size": "16px",
                "color": "#fff",
                "cursor": "pointer",
            }).children('img').css({
                "margin-top": "52px",
                "margin-bottom": "10px",
            })

            children.children('.loginTips').css({
                "font-size": "16px",
                "color": "#888888",
                "line-height": "14px",
                "margin-top": "22px"
            }).children('img').css({
                "margin-right": "12px",
                "position": "relative",
                'top': "-2px"
            })
            children.children('.PromptText').css({
                "font-size":"12px",
                "color":"#C6C6C6",
                "margin-top": "12px"
            })

            // 二合一  手机号部分
            var childrenPhone = this.MergeBox.children('.SMSodeBox').children('.whiteboard')
            childrenPhone.css({
                "width": "400px",
                "height": "380px",
                "background-color": "#ffffff",
                "border-top-right-radius": "15px",
                "border-bottom-right-radius": "15px",
            })
            childrenPhone.children('.Switchlogin').css({
                "height":"60px",
                "with":"100%"
            })

            childrenPhone.children('h3').css({
                "color": "#333333",
                "font-size": "24px",
                "font-weight": "bold",
                "padding-bottom": "24px",
                'margin-top':'0px',
                'margin-bottom': '0px',
            })
            childrenPhone.children('.QRCodeDL').css({
                "width":"288px",
                "height": "176px",
                "margin": "auto",
                "position": "relative"
            }).children('.BindingNow').css({
                'height': '45px',
                'background': 'linear-gradient(90deg, #006CFF, #0096FF)',
                'border-radius': '5px',
                'line-height': '45px',
                'font-size': '16px',
                'color': '#FFFFFF',
                'margin-top': '30px',
                "cursor": "pointer",
            })
            childrenPhone.children('.QRCodeDL').children('#formSubmit2').children('#phone_err2').css({
                "position": "absolute",
                "color": "#F56C6C",
                "top": "37px",
                "left":"0px"
            }).children('.help-block').css({
                "color": "#F56C6C",
            })
            childrenPhone.children('.QRCodeDL').children('#formSubmit2').children('#phone_code_err2').css({
                "position": "absolute",
                "color": "#F56C6C",
                "left":"0px"
            })

            childrenPhone.children('.loginTips').css({
                "font-size": "14px",
                "color": "#888888",
                "line-height": "14px",
                "margin-top": "22px"
            }).children('img').css({
                "margin-right": "12px",
                "position": "relative",
                'top': "-2px"
            })
            childrenPhone.children('.PromptText').css({
                "font-size":"12px",
                "color":"#C6C6C6",
                "margin-top": "12px"
            })

            var NUMBER=this.MergeBox.children('.SMSodeBox').children('.whiteboard').children('.QRCodeDL').children('#formSubmit2').children('.Enter_number')
            NUMBER.css({
                "width": "100%",
                "height":"40px",
                "padding":"0px 0px 0px 14px",
                "border": "solid 1px #C4C9D0",
                "border-radius": "5px",
                "text-align": "left",
            }).children('img').css({
                "position": "relative",
                "top": "-2px",
                "margin-right": "4px",
            })
            NUMBER.children('.number_input2').css({
                "height": "100%",
                "width": "90%",
                "border": "none",
                "font-size": "14px",
            })

            var CODE=this.MergeBox.children('.SMSodeBox').children('.whiteboard').children('.QRCodeDL').children('#formSubmit2').children('.Verification_Code')
            CODE.css({
                "width": "100%",
                "height":"40px",
                "padding":"0px 0px 0px 14px",
                "border": "solid 1px #C4C9D0",
                "border-radius": "5px",
                "text-align": "left",
                "margin-top": "20px",
            })
            CODE.children('li').css({
                "display": "inline-block",
                "width": "1px",
                "height": "20px",
                "background-color": "#C4C9D0",
                "position": "relative",
                "top": "5px"
            })
            CODE.children('.Code_input2').css({
                "height": "100%",
                "width": "65%",
                "border": "none",
                "border-radius": "5px",
                "font-size": "14px",
            })
            CODE.children(".obtain").css({
                "display": "inline-block",
                "width": '31%',
                "position": "relative",
                'font-size':" 14px",
                "color": "#0096FF",
                "text-align": "center",
                'cursor': 'pointer',
            }).children('li').css({
                "display": "inline-block",
                "width": "1px",
                "height": "20px",
                "background-color": "#C4C9D0",
                "float": "left",
            })

            var BindingNow=this.MergeBox.children('.SMSodeBox').children('.whiteboard').children('.QRCodeDL').children('.BindingNow')

            BindingNow.mouseover(function(){
                $(this).css({
                    'background': 'linear-gradient(260deg, #006CFF, #0096FF)',
                })
            })
            BindingNow.mouseout(function(){
                $(this).css({
                    'background': 'linear-gradient(90deg, #006CFF, #0096FF)',
                })
            })
            this.opt.ele.find('#bindingMobile').remove();

            this.opt.ele.append(this.MergeBox)
            var _this = this

            this.MergeBox.children('.closedDL').click(function() {
                _this.closeslogin()
            })

            $('.QRCodeDL .mask').click(function() {
                _this.weixinQrCLogin()
            })

            NUMBER.children('.number_input2').focus(function(){
                NUMBER.css({
                    "border": "solid 1px #0096FF",
                })
                $(this).css({
                    "outline": "none"
                })
            })
            NUMBER.children('.number_input2').blur(function(){
                NUMBER.css({
                    "border": "solid 1px #C4C9D0",
                })
            })

            CODE.children('.Code_input2').focus(function(){
                CODE.css({
                    "border": "solid 1px #0096FF",
                })
                $(this).css({
                    "outline": "none"
                })
            })
            CODE.children('.Code_input2').blur(function(){
                CODE.css({
                    "border": "solid 1px #C4C9D0",
                })
            })

            CODE.children(".obtain").click(function(){
                _this.Obtainverificationcode2()
            })

            BindingNow.click(function(){
                _this.Verificationcodelogin_ac()
            })
        },

        // 创建手机号绑定_活动
        bind_phone_activity: function (){
            var html = ''
            html += '<div class="SMSodeBox" id="bindingMobile">'
            html += '    <img class="closedDL" src="https://api.taoxiangyoushu.com/html/v1/utils/img/close.png" alt="">'
            html += '    <img class="closedDL closehover" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.delete_ico+'.png" alt="">'
            html += '    <div class="whiteboard">'
            html += '        <div class="Switchlogin">'
            html += '           <div class="WeChat_verification"></div>'
            html += '        </div>'
            html += '        <h3>'+this.opt.bindingText+'</h3>'
            html += '        <div class="QRCodeDL">'
            html += '            <form id="formSubmit2">  '
            html += '             <div class="Enter_number border1">'
            html += '                   <img src="https://api.taoxiangyoushu.com/html/v1/utils/img/phone.png"/>'
            html += '                   <input placeholder="请输入手机号" class="number_input2" id="phone2" autocomplete="off" name="phone"/>'
            html += '               </div>'
            html += '                   <span id="phone_err2"></span>'
            html += '             <div class="Verification_Code border1">'
            html += '                   <input placeholder="请输入验证码" class="Code_input2" name="phone_code" autocomplete="off"/>'
            html += '                    <li></li>'
            html += '                   <span class="obtain">获取验证码<span/>'
            html += '               </div>'
            html += '                   <span id="phone_code_err2"></span>'
            html += '             </form>'
            html += '             <div class="BindingNow">'+this.opt.bindingButton+'</div>'
            html += '        </div>'
            html += '        <div class="loginTips">'+this.opt.loginTips+'</div>'
            html += '    </div>'
            html += '</div>'
            this.SMSodeBox2 = $(html)
            this.SMSodeBox2.css({
                "display": "none",
                "position": "fixed",
                "left": '50%',
                "top": '50%',
                "z-index": '10000',
                "margin-left": "-180px",
                "margin-top": "-250px",
                "text-align": "center",
            }).children('.closedDL').css({
                "position": "absolute",
                "right": "-35px",
                "cursor": "pointer",
            })

            var HOVER=this.SMSodeBox2.children('.closehover')
            HOVER.css({
                'display':'block'
            })

            this.SMSodeBox2.children('.closedDL').mouseover(function(){
                HOVER.css({
                    'display':'none'
                })
            })
            this.SMSodeBox2.children('.closedDL').mouseout(function(){
                HOVER.css({
                    'display':'block'
                })
            })

            var children = this.SMSodeBox2.children('.whiteboard')
            children.css({
                "width": "360px",
                "height": "380px",
                "background-color": "#ffffff",
                "border-radius": "15px",
            })
            children.children('.Switchlogin').css({
                "height":"60px",
                "with":"100%"
            })

            children.children('h3').css({
                "color": "#333333",
                "font-size": "24px",
                "font-weight": "bold",
                "padding-bottom": "24px",
                'margin-top':'0px',
                'margin-bottom': '0px',
            })
            children.children('.QRCodeDL').css({
                "width":"288px",
                "height": "176px",
                "margin": "auto",
                "position": "relative"
            }).children('.BindingNow').css({
                'height': '45px',
                'background': 'linear-gradient(90deg, #006CFF, #0096FF)',
                'border-radius': '5px',
                'line-height': '45px',
                'font-size': '16px',
                'color': '#FFFFFF',
                'margin-top': '30px',
                "cursor": "pointer",
            })
            children.children('.QRCodeDL').children('#formSubmit2').children('#phone_err2').css({
                "position": "absolute",
                "color": "#F56C6C",
                "top": "37px",
                "left":"0px"
            }).children('.help-block').css({
                "color": "#F56C6C",
            })
            children.children('.QRCodeDL').children('#formSubmit2').children('#phone_code_err2').css({
                "position": "absolute",
                "color": "#F56C6C",
                "left":"0px"
            })

            children.children('.loginTips').css({
                "font-size": "14px",
                "color": "#888888",
                "line-height": "14px",
                "margin-top": "22px"
            }).children('img').css({
                "margin-right": "12px",
                "position": "relative",
                'top': "-2px"
            })
            children.children('.PromptText').css({
                "font-size":"12px",
                "color":"#C6C6C6",
                "margin-top": "12px"
            })

            var NUMBER=this.SMSodeBox2.children('.whiteboard').children('.QRCodeDL').children('#formSubmit2').children('.Enter_number')
            NUMBER.css({
                "width": "100%",
                "height":"40px",
                "padding":"0px 0px 0px 14px",
                "border": "solid 1px #C4C9D0",
                "border-radius": "5px",
                "text-align": "left",
            }).children('img').css({
                "position": "relative",
                "top": "-2px",
                "margin-right": "4px",
            })
            NUMBER.children('.number_input2').css({
                "height": "100%",
                "width": "90%",
                "border": "none",
                "font-size": "14px",
            })

            var CODE=this.SMSodeBox2.children('.whiteboard').children('.QRCodeDL').children('#formSubmit2').children('.Verification_Code')
            CODE.css({
                "width": "100%",
                "height":"40px",
                "padding":"0px 0px 0px 14px",
                "border": "solid 1px #C4C9D0",
                "border-radius": "5px",
                "text-align": "left",
                "margin-top": "20px",
            })
            CODE.children('li').css({
                "display": "inline-block",
                "width": "1px",
                "height": "20px",
                "background-color": "#C4C9D0",
                "position": "relative",
                "top": "5px"
            })
            CODE.children('.Code_input2').css({
                "height": "100%",
                "width": "65%",
                "border": "none",
                "border-radius": "5px",
                "font-size": "14px",
            })
            CODE.children(".obtain").css({
                "display": "inline-block",
                "width": '31%',
                "position": "relative",
                'font-size':" 14px",
                "color": "#0096FF",
                "text-align": "center",
                'cursor': 'pointer',
            }).children('li').css({
                "display": "inline-block",
                "width": "1px",
                "height": "20px",
                "background-color": "#C4C9D0",
                "float": "left",
            })
            var BindingNow=this.SMSodeBox2.children('.whiteboard').children('.QRCodeDL').children('.BindingNow')

            BindingNow.mouseover(function(){
                $(this).css({
                    'background': 'linear-gradient(260deg, #006CFF, #0096FF)',
                })
            })
            BindingNow.mouseout(function(){
                $(this).css({
                    'background': 'linear-gradient(90deg, #006CFF, #0096FF)',
                })
            })
            this.opt.ele.find('#bindingMobile').remove();
            this.opt.ele.append(this.SMSodeBox2)
            var _this = this

            this.SMSodeBox2.children('.closedDL').click(function() {
                _this.closesBinding()
            })

            NUMBER.children('.number_input2').focus(function(){
                NUMBER.css({
                    "border": "solid 1px #0096FF",
                })
                $(this).css({
                    "outline": "none"
                })
            })
            NUMBER.children('.number_input2').blur(function(){
                NUMBER.css({
                    "border": "solid 1px #C4C9D0",
                })
            })

            CODE.children('.Code_input2').focus(function(){
                CODE.css({
                    "border": "solid 1px #0096FF",
                })
                $(this).css({
                    "outline": "none"
                })
            })
            CODE.children('.Code_input2').blur(function(){
                CODE.css({
                    "border": "solid 1px #C4C9D0",
                })
            })

            CODE.children(".obtain").click(function(){
                _this.Obtainverificationcode2()
            })

            BindingNow.click(function(){
                _this.Verificationcodelogin3()
            })
            $('.QRCodeDL .mask').click(function() {
                _this.weixinQrCLogin()
            })
        },

        // 创建手机号登录_活动
        phone_loginbox: function () {
            var html = ''
            html += '<div class="SMSodeBox" id="bindingMobile">'
            html += '    <img class="closedDL" src="https://api.taoxiangyoushu.com/html/v1/utils/img/close.png" alt="">'
            html += '    <img class="closedDL closehover" src="https://api.taoxiangyoushu.com/html/v1/utils/img/'+this.opt.delete_ico+'.png" alt="">'
            html += '    <div class="whiteboard">'
            html += '        <div class="Switchlogin">'
            html += '           <div class="WeChat_verification"></div>'
            html += '        </div>'
            html += '        <h3>'+this.opt.bindingText+'</h3>'
            html += '        <div class="QRCodeDL">'
            html += '            <form id="formSubmit2">  '
            html += '             <div class="Enter_number border1">'
            html += '                   <img src="https://api.taoxiangyoushu.com/html/v1/utils/img/phone.png"/>'
            html += '                   <input placeholder="请输入手机号" class="number_input2" id="phone2" autocomplete="off" name="phone"/>'
            html += '               </div>'
            html += '                   <span id="phone_err2"></span>'
            html += '             <div class="Verification_Code border1">'
            html += '                   <input placeholder="请输入验证码" class="Code_input2" name="phone_code" autocomplete="off"/>'
            html += '                    <li></li>'
            html += '                   <span class="obtain">获取验证码<span/>'
            html += '               </div>'
            html += '                   <span id="phone_code_err2"></span>'
            html += '             </form>'
            html += '             <div class="BindingNow">'+this.opt.bindingButton+'</div>'
            html += '        </div>'
            html += '        <div class="loginTips">'+this.opt.loginTips+'</div>'
            html += '    </div>'
            html += '</div>'
            this.SMSodeBox2 = $(html)
            this.SMSodeBox2.css({
                "display": "none",
                "position": "fixed",
                "left": '50%',
                "top": '50%',
                "z-index": '10000',
                "margin-left": "-180px",
                "margin-top": "-250px",
                "text-align": "center",
            }).children('.closedDL').css({
                "position": "absolute",
                "right": "-35px",
                "cursor": "pointer",
            })

            var HOVER=this.SMSodeBox2.children('.closehover')
            HOVER.css({
                'display':'block'
            })

            this.SMSodeBox2.children('.closedDL').mouseover(function(){
                HOVER.css({
                    'display':'none'
                })
            })
            this.SMSodeBox2.children('.closedDL').mouseout(function(){
                HOVER.css({
                    'display':'block'
                })
            })

            var children = this.SMSodeBox2.children('.whiteboard')
            children.css({
                "width": "360px",
                "height": "380px",
                "background-color": "#ffffff",
                "border-radius": "15px",
            })
            children.children('.Switchlogin').css({
                "height":"60px",
                "with":"100%"
            })

            children.children('h3').css({
                "color": "#333333",
                "font-size": "24px",
                "font-weight": "bold",
                "padding-bottom": "24px",
                'margin-top':'0px',
                'margin-bottom': '0px',
            })
            children.children('.QRCodeDL').css({
                "width":"288px",
                "height": "176px",
                "margin": "auto",
                "position": "relative"
            }).children('.BindingNow').css({
                'height': '45px',
                'background': 'linear-gradient(90deg, #006CFF, #0096FF)',
                'border-radius': '5px',
                'line-height': '45px',
                'font-size': '16px',
                'color': '#FFFFFF',
                'margin-top': '30px',
                "cursor": "pointer",
            })
            children.children('.QRCodeDL').children('#formSubmit2').children('#phone_err2').css({
                "position": "absolute",
                "color": "#F56C6C",
                "top": "37px",
                "left":"0px"
            }).children('.help-block').css({
                "color": "#F56C6C",
            })
            children.children('.QRCodeDL').children('#formSubmit2').children('#phone_code_err2').css({
                "position": "absolute",
                "color": "#F56C6C",
                "left":"0px"
            })

            children.children('.loginTips').css({
                "font-size": "14px",
                "color": "#888888",
                "line-height": "14px",
                "margin-top": "22px"
            }).children('img').css({
                "margin-right": "12px",
                "position": "relative",
                'top': "-2px"
            })
            children.children('.PromptText').css({
                "font-size":"12px",
                "color":"#C6C6C6",
                "margin-top": "12px"
            })

            var NUMBER=this.SMSodeBox2.children('.whiteboard').children('.QRCodeDL').children('#formSubmit2').children('.Enter_number')
            NUMBER.css({
                "width": "100%",
                "height":"40px",
                "padding":"0px 0px 0px 14px",
                "border": "solid 1px #C4C9D0",
                "border-radius": "5px",
                "text-align": "left",
            }).children('img').css({
                "position": "relative",
                "top": "-2px",
                "margin-right": "4px",
            })
            NUMBER.children('.number_input2').css({
                "height": "100%",
                "width": "90%",
                "border": "none",
                "font-size": "14px",
            })

            var CODE=this.SMSodeBox2.children('.whiteboard').children('.QRCodeDL').children('#formSubmit2').children('.Verification_Code')
            CODE.css({
                "width": "100%",
                "height":"40px",
                "padding":"0px 0px 0px 14px",
                "border": "solid 1px #C4C9D0",
                "border-radius": "5px",
                "text-align": "left",
                "margin-top": "20px",
            })
            CODE.children('li').css({
                "display": "inline-block",
                "width": "1px",
                "height": "20px",
                "background-color": "#C4C9D0",
                "position": "relative",
                "top": "5px"
            })
            CODE.children('.Code_input2').css({
                "height": "100%",
                "width": "65%",
                "border": "none",
                "border-radius": "5px",
                "font-size": "14px",
            })
            CODE.children(".obtain").css({
                "display": "inline-block",
                "width": '31%',
                "position": "relative",
                'font-size':" 14px",
                "color": "#0096FF",
                "text-align": "center",
                'cursor': 'pointer',
            }).children('li').css({
                "display": "inline-block",
                "width": "1px",
                "height": "20px",
                "background-color": "#C4C9D0",
                "float": "left",
            })
            var BindingNow=this.SMSodeBox2.children('.whiteboard').children('.QRCodeDL').children('.BindingNow')

            BindingNow.mouseover(function(){
                $(this).css({
                    'background': 'linear-gradient(260deg, #006CFF, #0096FF)',
                })
            })
            BindingNow.mouseout(function(){
                $(this).css({
                    'background': 'linear-gradient(90deg, #006CFF, #0096FF)',
                })
            })
            this.opt.ele.find('#bindingMobile').remove();
            this.opt.ele.append(this.SMSodeBox2)
            var _this = this

            this.SMSodeBox2.children('.closedDL').click(function() {
                _this.closesBinding()
            })

            NUMBER.children('.number_input2').focus(function(){
                NUMBER.css({
                    "border": "solid 1px #0096FF",
                })
                $(this).css({
                    "outline": "none"
                })
            })
            NUMBER.children('.number_input2').blur(function(){
                NUMBER.css({
                    "border": "solid 1px #C4C9D0",
                })
            })

            CODE.children('.Code_input2').focus(function(){
                CODE.css({
                    "border": "solid 1px #0096FF",
                })
                $(this).css({
                    "outline": "none"
                })
            })
            CODE.children('.Code_input2').blur(function(){
                CODE.css({
                    "border": "solid 1px #C4C9D0",
                })
            })

            CODE.children(".obtain").click(function(){
                _this.Obtainverificationcode2()
            })

            BindingNow.click(function(){
                _this.Verificationcodelogin_ac()
            })
            $('.QRCodeDL .mask').click(function() {
                _this.weixinQrCLogin()
            })
        },

        // 关闭登录
        closeslogin: function() {
			this.overlay.hide()
            this.QRCodeBox && this.QRCodeBox.hide()
            this.SMSodeBox && this.SMSodeBox.hide()
            this.MergeBox && this.MergeBox.hide()
            clearTimeout(this.Timeout);
		},
        // 关闭绑定
        closeslogin2: function() {
            this.overlay && this.overlay.hide()
            this.SMSodeBox2 && this.SMSodeBox2.hide()
            this.MergeBox && this.MergeBox.hide()
        },
        // 打开登录
        openLogin: function() {
            var _this=this
            if(this.opt.whether&&this.opt.whether.is_must_login_enable&&this.opt.whether.is_must_phone_login_enable){
                if(this.opt.is_activity){
                    if(this.opt.is_mobileActivity) {
                        this.SMSodeBox2.show()
                    }else{
                        this.MergeBox.show()
                        _this.QRCodeStatus()
                    }
                }else{
                    this.QRCodeBox.show()
                    this.SMSodeBox.show()
                }
                this.weixinQrCLogin()
            }
            else if(this.opt.whether&&this.opt.whether.is_must_login_enable){
                if(this.opt.is_activity){
                    if(this.opt.is_mobileActivity) {
                        this.SMSodeBox2.show()
                    }else{
                        this.MergeBox.show()
                    }
                }else {
                    this.QRCodeBox.show()
                }
                $('.SMS_verification').hide()
                _this.QRCodeStatus()
                this.weixinQrCLogin()
                $('.PromptText').hide()
            }
            else if(this.opt.whether&&this.opt.whether.is_must_phone_login_enable){
                if(this.opt.is_activity && this.opt.is_mobileActivity){
                    this.SMSodeBox2.show()
                }else{
                    this.SMSodeBox.show()
                }
                $('.WeChat_verification').hide()
                $('.PromptText').hide()
            }else{
                if(this.opt.is_activity){
                    this.openBinding()
                }
            }
			this.overlay.show()

        },
        // 关闭绑定
        closesBinding: function() {
            this.SMSodeBox2.hide()
			this.overlay.hide()
        },
        openBinding: function() {
            this.SMSodeBox2.show()
			this.overlay.show()
        },
        // 切换手机登录
        Switchphone:function(){
            this.QRCodeBox.hide()
            this.SMSodeBox.show()
            clearTimeout(this.Timeout);
        },
        // 切回二维码登录
        Switchscanncode:function(){
            var _this=this
            this.QRCodeBox.show()
            this.SMSodeBox.hide()
            _this.QRCodeStatus()
        },
        // 获取二维码
        weixinQrCLogin: function() {
            $('.QRCodeDiv , .mask').hide()
            $('.load').show()
            var _this = this
            $.ajax({
                type: 'post',
                url: this.opt.urls + '/weixin/qr/cLogin?user_token='+ this.opt.USER_TOKEN +'&jane_name='+ this.opt.JANE_NAME +'&_session_type=user',
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    if(data.code == 200) {
                        if(data.data.length) {
                            $('.load , .mask').hide()
                            $('.QRCodeDiv').show().children('img').attr('src' , data.data)
                            _this.time = 150
                        }else {
                            cocoMessage.error('配置有误! 请联系商家!', 2000);
                        }
                    }else {
                        cocoMessage.error(data.codeMsg, 2000);
                    }
                },
                error: function(err) {
                    cocoMessage.error("请求失败!请检查网络", 2000);
                }
            });
        },
        QRCodeStatus: function() { // 轮询登录
            clearTimeout(this.Timeout);
            var _this=this
            $.ajax({
                type: 'post',
                url: this.opt.urls + '/weixin/qr/regist/query?_session_type=user',
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                data: getFormData({
                    login_domain: window.location.origin,
                }),
                success: function (res) {
                    clearTimeout(_this.Timeout);
                    if (_this.time <= 0) {
                        $(".mask").show();
                        $('.QRCodeDiv').hide()
                    }
                    if (!res.data.isbind || !res.data.isscan) {
                        if (_this.time > 0) {
                            _this.time--
                            _this.Timeout = setTimeout(function () {
                                _this.QRCodeStatus();
                            }, 2000);
                        }
                    }else {
                        clearTimeout(_this.Timeout);
                        _this.userUserInfo(true)
                    }
                },
                error: function () {
                    cocoMessage.error("请求失败!请检查网络", 2000);
                },
            });
        },
        // 获取用户信息
        userUserInfo: function(is) {
            var _this = this
            var formdata = {
                login_domain: window.location.origin,
            }
            if(this.opt.is_activity){
                formdata.area = 'act'
            }
            $.ajax({
                type: 'post',
                url: this.opt.urls + '/api/client/user/user_info?_session_type=user&user_token='+this.opt.USER_TOKEN+'&jane_name='+this.opt.JANE_NAME,
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                data: getFormData(formdata),
                success: function (res) {
                    if(res.code == 200) {
                        _this.closeslogin();
                        if(res.data.username) {
                            $('.loginBox .loginButton').hide()
                            $('.loginBox .hasLogin').show()
                            $('.userName span').text(res.data.username)
                            _this.isLogin = true
                            _this.opt.success_info(res.data)
                            if(is) {
                                cocoMessage.success('已登录!', 2000)
                            }
                        }else {
                            $('.loginBox .loginButton').show()
                            $('.loginBox .hasLogin').hide()
                            _this.isLogin = false
                        }
                        // if(is && _this.opt.is_activity){
                        //     console.log(res.data.is_bind_phone)
                        //     _this.opt.bindingText = '绑定手机号'
                        //     _this.opt.bindingButton = '立即绑定'
                        //     _this.opt.loginTips = '未注册手机号验证后自动登录'
                        //     _this.bind_phone_activity()
                        //     _this.openBinding()
                        // }
                    }else {
                        $('.loginBox .loginButton').show()
                        $('.loginBox .hasLogin').hide()
                        _this.isLogin = false
                        if(is) {
                            cocoMessage.error(res.codeMsg, 2000);
                        }
                    }
                    _this.opt.complete_info(res.data , res.code)
                },
                error: function () {
                    cocoMessage.error("请求失败!请检查网络", 2000);
                    _this.opt.complete_info(false)
                },
            });
        },

        // 退出登录
        apiuserLogout: function() {
            var _this = this
            $.ajax({
                type: 'post',
                url: this.opt.urls + '/apiuser/logout?_session_type=user',
                xhrFields: {
                    withCredentials: true
                },
                success: function (res) {
                    if(res.code == 200) {
                        $('.loginBox .loginButton').show()
                        $('.loginBox .hasLogin').hide()
                        $('.FloatingWindow').hide()
                        _this.isLogin = false
                        _this.opt.success_info({})
                        cocoMessage.success('已退出登录!', 2000)
                        _this.opt.exitLogin()
                    }else {
                        cocoMessage.error(res.codeMsg, 2000);
                    }
                },
                error: function () {
                    cocoMessage.error("请求失败!请检查网络", 2000);
                },
            });
        },

        // 未登录拦截
        interceptLogin: function() {
            if((this.opt.whether&&!this.isLogin)&&((this.opt.whether.is_must_login&&this.opt.whether.is_must_login_enable)
                ||(this.opt.whether.is_must_phone_login&&this.opt.whether.is_must_phone_login_enable))) {
                this.openLogin()
                return true
            }
            return false
        },

        // 获取验证码
        Obtainverificationcode:function(){
            var t = $('.obtain'); //当前按钮对象
            if(t.attr("disabled")) return;
            t.attr("disabled", "true")//让按钮不可用
            $("#formSubmit").bootstrapValidator({
                excluded: [":disabled", ":hidden"], // 关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
                feedbackIcons: {
                    valid: 'glyphicon',
                    invalid: 'glyphicon',
                    validating: 'glyphicon'
                },
                fields: {
                    phone: {
                        container: "#phone_err",
                        validators: {
                            notEmpty: {
                                message: '手机号不能为空'
                            },
                            regexp: {
                                regexp: /^1[3-9]\d{9}$/,
                                message: '请输入正确手机号'
                            }
                        }
                    }
                }
            });
	        var bootstrapValidator = $("#formSubmit").data("bootstrapValidator").validate();
            if(bootstrapValidator.isValid()){
                $('.obtain').attr('disabled', true);
            }else{
                $('.help-block').css({
                    "color":"#F56C6C"
                })
                $('.obtain').attr('disabled', false);
            }
             var phone = $("#phone").val(); //填写的电话号码
            var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            if(!myreg.test(phone)){
                $("#phone").val("");
                $("#phone").addClass("change");
                return false;
            }
            var data = {
              _session_type: "user",
              scenes_id: "client_phone_login",
            }; //向后台提交的数据

            data.phone = phone; //赋值给数据对象
            var formData = getFormData(data);
            $.ajax({
              url: urls + "/api/verify_code/get_phone_validate?user_token="+this.opt.USER_TOKEN+'&jane_name='+this.opt.JANE_NAME,
              type: "post",
              processData: false,
              contentType: false,
              xhrFields: {
                withCredentials: true,
              },
              data: formData,
              success: function (data) {
                if(data.code == 200) {
                    cocoMessage.success('发送成功', 2000)
                }else {
                    cocoMessage.error(data.codeMsg, 2000)
                }
              },
              error: function () {
                cocoMessage.error('发送失败', 2000)
              },
            });

            var time = 60; //倒计时60秒后可以重新点击发送
            var timer = null;
            t.html(time + "秒后重试"); //倒计时显示
            clearInterval(timer);
            timer = setInterval(function () {
              if (time == 1) {
                //如果是最后一秒
                clearInterval(timer);
                t.html("获取验证码");
                t.attr("disabled", false); //允许重新点击按钮
              } else {
                time--;
                t.html(time + "秒后重试");
              }
            }, 1000);
        },


        // 手机号绑定
        Verificationcodelogin2:function(){
            var _this = this;
            $("#formSubmit2").bootstrapValidator({
                excluded: [":disabled", ":hidden"], // 关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
                feedbackIcons: {
                valid: "glyphicon",
                invalid: "glyphicon",
                validating: "glyphicon",
                },
                fields: {
                    phone: {
                        container: "#phone_err2",
                        validators: {
                        notEmpty: {
                            message: "手机号不能为空",
                        },
                        regexp: {
                            regexp: /^1[3-9]\d{9}$/,
                            message: "请输入正确手机号",
                        },
                        },
                    },
                    phone_code: {
                        container: "#phone_code_err2",
                        validators: {
                        notEmpty: {
                            message: "请输入验证码",
                        },
                        },
                    },
                },
            });
	        var bootstrapValidator = $("#formSubmit2").data("bootstrapValidator").validate();
            if(bootstrapValidator.isValid()){
                var _this=this
                var formData={
                    _session_type: "user",
                    phone:$('.number_input2').val(),
                    phone_code:$('.Code_input2').val(),
                    login_domain: window.location.origin,
                }
                var form_data = getFormData(formData)
                $.ajax({
                    url: urls + "/api/client/user/bind_phone?user_token="+this.opt.USER_TOKEN+'&jane_name='+this.opt.JANE_NAME,
                    type:'post',
                    processData: false,
                    contentType: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    data:form_data,
                    success:function(res){
                        if(res.code=='200'){
                            _this.closeslogin2();
                            _this.opt.bindingSuccessful()
                        }
                        else {
                            cocoMessage.error(res.codeMsg, 2000);
                        }
                    },
                    error: function(err) {
                        cocoMessage.error("请求失败!请检查网络", 2000);
                    }
                })
            }else{
                $('.help-block').css({
                    "color":"#F56C6C"
                })
            }
        },

        // 手机号绑定_活动
        Verificationcodelogin3: function(){
            var _this = this;
            $("#formSubmit2").bootstrapValidator({
                excluded: [":disabled", ":hidden"], // 关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
                feedbackIcons: {
                    valid: "glyphicon",
                    invalid: "glyphicon",
                    validating: "glyphicon",
                },
                fields: {
                    phone: {
                        container: "#phone_err2",
                        validators: {
                            notEmpty: {
                                message: "手机号不能为空",
                            },
                            regexp: {
                                regexp: /^1[3-9]\d{9}$/,
                                message: "请输入正确手机号",
                            },
                        },
                    },
                    phone_code: {
                        container: "#phone_code_err2",
                        validators: {
                            notEmpty: {
                                message: "请输入验证码",
                            },
                        },
                    },
                },
            });
            var bootstrapValidator = $("#formSubmit2").data("bootstrapValidator").validate();
            if(bootstrapValidator.isValid()){
                var _this=this
                var formData={
                    _session_type: "user",
                    phone:$('.number_input2').val(),
                    phone_code:$('.Code_input2').val(),
                    login_domain: window.location.origin,
                }
                var form_data = getFormData(formData)
                $.ajax({
                    url: urls + "/api/client/user/bind_user_phone?user_token="+this.opt.USER_TOKEN+'&jane_name='+this.opt.JANE_NAME,
                    type:'post',
                    processData: false,
                    contentType: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    data:form_data,
                    success:function(res){
                        if(res.code=='200'){
                            _this.closeslogin2();
                            _this.opt.bindingSuccessful()
                            _this.userUserInfo(true)
                        }
                        else {
                            cocoMessage.error(res.codeMsg, 2000);
                        }
                    },
                    error: function(err) {
                        cocoMessage.error("请求失败!请检查网络", 2000);
                    }
                })
            }else{
                $('.help-block').css({
                    "color":"#F56C6C"
                })
            }
        },

        // 获取验证码
        Obtainverificationcode2:function(){
            var t = $('.obtain'); //当前按钮对象
            var _this = this
            if(t.attr("disabled")) return;
            t.attr("disabled", "true")//让按钮不可用
            $("#formSubmit2").bootstrapValidator({
                excluded: [":disabled", ":hidden"], // 关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
                feedbackIcons: {
                    valid: 'glyphicon',
                    invalid: 'glyphicon',
                    validating: 'glyphicon'
                },
                fields: {
                    phone: {
                        container: "#phone_err2",
                        validators: {
                            notEmpty: {
                                message: '手机号不能为空'
                            },
                            regexp: {
                                regexp: /^1[3-9]\d{9}$/,
                                message: '请输入正确手机号'
                            }
                        }
                    }
                }
            });
	        var bootstrapValidator = $("#formSubmit2").data("bootstrapValidator").validate();
            if(bootstrapValidator.isValid()){
                $('.obtain').attr('disabled', true);
            }else{
                $('.help-block').css({
                    "color":"#F56C6C"
                })
                $('.obtain').attr('disabled', false);
            }
             var phone = $("#phone2").val(); //填写的电话号码
            var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            if(!myreg.test(phone)){
                $("#phone2").val("");
                $("#phone2").addClass("change");
                return false;
            }
            var data = {
              _session_type: "user",
              scenes_id: "client_phone_login",
            }; //向后台提交的数据

            var sendType = 'distribution_login'
            if(_this.opt.is_activity){
                sendType = 'act'
            }
            data.phone = phone; //赋值给数据对象
            var formData = getFormData(data);
            $.ajax({
              url: urls + "/api/verify_code/get_phone_validate?user_token="+this.opt.USER_TOKEN+'&jane_name='+this.opt.JANE_NAME+'&send_type=' + sendType,
              type: "post",
              processData: false,
              contentType: false,
              xhrFields: {
                withCredentials: true,
              },
              data: formData,
              success: function (data) {
                if(data.code == 200) {
                    cocoMessage.success('发送成功', 2000)
                }else {
                    cocoMessage.error(data.codeMsg, 2000)
                }
              },
              error: function () {
                cocoMessage.error('发送失败', 2000)
              },
            });

            var time = 60; //倒计时60秒后可以重新点击发送
            var timer = null;
            t.html(time + "秒后重试"); //倒计时显示
            clearInterval(timer);
            timer = setInterval(function () {
              if (time == 1) {
                //如果是最后一秒
                clearInterval(timer);
                t.html("获取验证码");
                t.attr("disabled", false); //允许重新点击按钮
              } else {
                time--;
                t.html(time + "秒后重试");
              }
            }, 1000);
        },

        // 手机号登录_活动
        Verificationcodelogin_ac: function (){
            var _this = this;
            $("#formSubmit2").bootstrapValidator({
                excluded: [":disabled", ":hidden"], // 关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
                feedbackIcons: {
                    valid: "glyphicon",
                    invalid: "glyphicon",
                    validating: "glyphicon",
                },
                fields: {
                    phone: {
                        container: "#phone_err2",
                        validators: {
                            notEmpty: {
                                message: "手机号不能为空",
                            },
                            regexp: {
                                regexp: /^1[3-9]\d{9}$/,
                                message: "请输入正确手机号",
                            },
                        },
                    },
                    phone_code: {
                        container: "#phone_code_err2",
                        validators: {
                            notEmpty: {
                                message: "请输入验证码",
                            },
                        },
                    },
                },
            });
            var bootstrapValidator = $("#formSubmit2").data("bootstrapValidator").validate();
            if(bootstrapValidator.isValid()){
                var _this=this
                var formData={
                    _session_type: "user",
                    phone:$('.number_input2').val(),
                    phone_code:$('.Code_input2').val(),
                    login_domain: window.location.origin,
                }
                var form_data = getFormData(formData)
                $.ajax({
                    url: urls + "/api/client/user/phone_login?user_token="+this.opt.USER_TOKEN+'&jane_name='+this.opt.JANE_NAME,
                    type:'post',
                    processData: false,
                    contentType: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    data:form_data,
                    success:function(res){
                        if(res.code=='200'){
                            _this.closeslogin2();
                            _this.userUserInfo(true)
                        }
                        else {
                            cocoMessage.error(res.codeMsg, 2000);
                        }
                    },
                    error: function(err) {
                        cocoMessage.error("请求失败!请检查网络", 2000);
                    }
                })
            }else{
                $('.help-block').css({
                    "color":"#F56C6C"
                })
            }
        },

        // 手机号登录
        Verificationcodelogin:function(){
           var _this = this;
           $("#formSubmit").bootstrapValidator({
             excluded: [":disabled", ":hidden"], // 关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
             feedbackIcons: {
               valid: "glyphicon",
               invalid: "glyphicon",
               validating: "glyphicon",
             },
             fields: {
               phone: {
                 container: "#phone_err",
                 validators: {
                   notEmpty: {
                     message: "手机号不能为空",
                   },
                   regexp: {
                     regexp: /^1[3-9]\d{9}$/,
                     message: "请输入正确手机号",
                   },
                 },
               },
               phone_code: {
                 container: "#phone_code_err",
                 validators: {
                   notEmpty: {
                     message: "请输入验证码",
                   },
                 },
               },
             },
           });
	        var bootstrapValidator = $("#formSubmit").data("bootstrapValidator").validate();
            if(bootstrapValidator.isValid()){
                $('.Confirmlogin').attr('disabled', true);
            }else{
                $('.help-block').css({
                    "color":"#F56C6C"
                })
            }
            var _this=this
            var formData={
                _session_type: "user",
                phone:$('.number_input').val(),
                phone_code:$('.Code_input').val(),
                login_domain: window.location.origin,
            }
            var form_data = getFormData(formData)
            $.ajax({
                url: urls + "/api/client/user/phone_login?user_token="+this.opt.USER_TOKEN+'&jane_name='+this.opt.JANE_NAME,
                type:'post',
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                data:form_data,
                success:function(res){
                    if(res.code=='200'){
                        _this.closeslogin();
                        _this.userUserInfo()
                    }
                    else {
                        cocoMessage.error(res.codeMsg, 2000);
                    }
                },
                error: function(err) {
                    cocoMessage.error("请求失败!请检查网络", 2000);
                }
            })
        }
    }
    window.member = member;
})(window, document)
