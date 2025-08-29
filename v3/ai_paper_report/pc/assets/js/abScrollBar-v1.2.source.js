/*!
 * abScrollBar v1.2 滚动条模拟插件
 * 更多详尽信息请看官网( http://ab.geshai.com/other-plus/abScrollBar/abScrollBar.html )
 *
 * 有疑难问题可选择QQ群① 158544200 或QQ群② 790370978 进行反馈
 *
 * Carlo,Cloud
 *
 * 请尊重原创，保留头部版权
 * 在保留版权的前提下可应用于个人或商业用途
 *
 */
;function abScrollBar(_opts){
	/* fn */
	var __fns__ = {
		/* extend */
		"extend": function(__a, __b){
			for(var __k in __b){
				__a[__k] = __b[__k];
			}
			return __a;
		},

		/* px */
		"px": function (__v) {
			return (__v.toString() + "px");
		},

		/* Is empty */
		"isEmpty": function (__v) {
			return (null == __v || "undefined" == typeof(__v) || "" == __v);
		},

		/* To bool */
		"toBool":function(__v){
			return (__v === true);
		},

		/* To float */
		"toFloat": function (__v) {
			return parseFloat(__v);
		},

		/* Is init */
		"isInit": function () {
			return ("true" == _content.attr(_opts._iname));
		},

		/* Rand string */
		"randStr": function () {
			var __randData = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
			var __id = "", __str = "";

			for(var __i = 0; __i < 10; __i++) {
				__id = Math.max(Math.ceil(Math.random() * 26), 1);
				__str += ("" + __randData[__id - 1]);
			}

			return __str;
		},

		/* Is x */
		"isX": function () {
			return ("x" == _opts.scrollType.toString().toLowerCase());
		},

		/* Scroll do */
		"scrollDo": function () {
			if(_scrollMove <= 0){
				_scrollMove = 0;
			}

			var __attr = "top";
			if (__fns__.isX()) {
				__attr = "left";

				if(_scrollMove > _barAllowWidth){
					_scrollMove = _barAllowWidth;
				}
			} else {
				if(_scrollMove > _barAllowHeight){
					_scrollMove = _barAllowHeight;
				}
			}

			_bar.css(__attr, __fns__.px(_scrollMove));
			_content.css(__attr, __fns__.px(-(_scrollMove * _contentScrollStep)));
		},

		/* Bar event */
		"barEvent": function () {
			_bar.mousedown(function(__e) {
				_moveStatus = true;
				__e = (!window.event ? __e : window.event);

				/* 计算鼠标在滑动条上的位置 */
				if (__fns__.isX()) {
					_mousePos = ((_bar.offset().left + _barWidth) - _contentBoxLeft);
					_mousePos = (_barWidth - (_mousePos - (__e.clientX - _contentBoxLeft)));
				} else {
					_mousePos = ((_bar.offset().top + _barHeight) - _contentBoxTop);
					_mousePos = (_barHeight - (_mousePos - (__e.clientY - _contentBoxTop)));
				}

				/* 移动事件 */
				document.onmousemove = function(__e2){
					/* 停止移动状态 */
					if(!_moveStatus){ return true; }

					__e2 = (!window.event ? __e2 : window.event);

					/* 阻止冒泡 */
					if(__e2.preventDefault) { __e2.preventDefault(); }
					if(__e2.stopPropagation){ __e2.stopPropagation(); }
					__e2.cancelBubble = false;
					__e2.returnValue = false;

					/* 移动运动 */
					if (__fns__.isX()) {
						_scrollMove = ((__e2.clientX - _contentBoxLeft) - _mousePos);
					} else {
						_scrollMove = ((__e2.clientY - _contentBoxTop) - _mousePos);
					}

					// scroll
					__fns__.scrollDo();
				};
				document.onmouseup = function(){
					_moveStatus = false;
					document.onselectstart = function(){ return true; };
					if(_isMouseleave){
						_barBox.stop(true, true).fadeOut(_speed);
					}
				};
				document.onselectstart = function(){ return false; };

				/* 阻止冒泡 */
				if(__e.preventDefault) { __e.preventDefault(); }
				if(__e.stopPropagation){ __e.stopPropagation(); }
				__e.cancelBubble = false;
				__e.returnValue = false;
			});
		},

		/* Mousewheel event */
		"mousewheel": function () {
			var __mwEvent = ((/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll": "mousewheel");

			/* 滚动处理 */
			var __mousewheelFunc = function(__e){
				__e = (__e || window.event);
				var __d = (__e.detail ? (-__e.detail / 3): (__e.wheelDelta / 120));
				if(__e.preventDefault) { __e.preventDefault(); }
				if(__e.stopPropagation){ __e.stopPropagation(); }
				__e.cancelBubble = false;
				__e.returnValue = false;

				/* 滚动 */
				_scrollMove += (__d > 0 ? -_mousewheelStep : _mousewheelStep);
				__fns__.scrollDo();
			};

			/* 滚动事件添加 */
			var __mousewheelAddEvent = function(__o){
				if(__o.attachEvent) {
					__o.attachEvent("on" + __mwEvent, __mousewheelFunc);
				}else if(__o.addEventListener) {
					__o.addEventListener(__mwEvent, __mousewheelFunc, false);
				}
			};

			__mousewheelAddEvent(_content[0]);
			__mousewheelAddEvent(_barBox[0]);
		},

		/* Mouseleave hide bar */
		"hideBar": function () {
			if(!_isHideBar){
				return false;
			}

			/* mouseenter */
			_contentBox.bind("mouseenter", function(){
				clearTimeout(_mouseleave_timeID);
				_isMouseleave = false;
				_barBox.stop(true, true).fadeIn(_speed);
			});

			/* mouseleave */
			_contentBox.bind("mouseleave", function(){
				_mouseleave_timeID = setTimeout(function(){
					_isMouseleave = true;
					if(!_moveStatus){ _barBox.stop(true, true).fadeOut(_speed); }
				}, _mouseleaveTime);
			});
		},

		/* Compute */
		"computeContentWH": function () {
			var _cla = __fns__.randStr();
			var __wh = [0, 0, "10000%"];

			// inner
			_content.wrapInner("<div class=\"" + _cla + "\"></div>");
			// obj
			var __obj = $("." + _cla, _content);

			// x | y
			if (__fns__.isX()) {
				// each
				__obj.css("width", __wh[2]).children().each(function (__index, __el) {
					__wh[0] += $(__el).outerWidth(true) + 1;
				});

				_content.width(__fns__.px(__wh[0]));
			} else {
				// each
				__obj.css("height", __wh[2]).children().each(function (__index, __el) {
					__wh[1] += $(__el).outerHeight(true) + 1;
				});

				_content.height(__fns__.px(__wh[1]));
			}

			// unwrap
			__obj.contents().unwrap();
		},

		/* initialization */
		"init": function () {
			var __contentBox_ID = __fns__.randStr();
			var __barBox_ID = __fns__.randStr();

			// Bar style
			var __barStyle = ["", "", "background:#fafafa;", "background:#ccc;"];
			if (!__fns__.isEmpty(_barBgClass)) {
				__barStyle[0] = _barBgClass;
				__barStyle[2] = "";
			}
			if (!__fns__.isEmpty(_barClass)) {
				__barStyle[1] = _barClass;
				__barStyle[3] = "";
			}

			/* 创建容器元素 */
			_content.wrap("<div id=\"" + __contentBox_ID + "\" style=\"position:relative;margin:0px;padding:0px;overflow:hidden;\"></div>");

			/* 容器盒子对象 */
			_contentBox = $("#" + __contentBox_ID).css({"width": __fns__.px(_width), "height": __fns__.px(_height)});

			/* 创建滚动条元素 */
			_contentBox.append("<div id=\"" + __barBox_ID + "\" class=\"" + __barStyle[0] + "\" style=\"position:absolute;z-index:2;overflow:hidden;display:none;" + __barStyle[2] + "\"><em class=\"" + __barStyle[1] + "\" style=\"position:relative;left:0px;top:0px;width:100%;height:100%;overflow:hidden;border-radius:5px;display:block;" + __barStyle[3] + "\"></em></div>");

			/* 滚动条盒子对象 */
			_barBox = $("#" + __barBox_ID);

			/* x | y */
			if (__fns__.isX()) {
				_barBox.css({
					"left": __fns__.px(0),
					"bottom": __fns__.px(0),
					"width": __fns__.px(_width),
					"height": __fns__.px(_barHeight)
				});
			} else {
				_barBox.css({
					"top": __fns__.px(0),
					"right": __fns__.px(0),
					"width": __fns__.px(_barWidth),
					"height": __fns__.px(_height)
				});
			}

			/* 滚动条对象 */
			_bar = _barBox.children().first();
			_content.css({"position": "absolute", "left": __fns__.px(0), "top": __fns__.px(0)});
		}
	};

	/* options */
	_opts = __fns__.extend({
		"scrollType": "y", /* 滚动方向: x=水平, y=垂直 */
		"contentEl": "", /* 滚动内容元素(如: .demo 或 #demo) */
		"barClass": "", /* 滚动条样式 */
		"barBgClass": "", /* 滚动条背景样式 */
		"barWidth": 6, /* 滚动条宽(当scrollType=y时, 生效) */
		"barHeight": 6, /* 滚动条高(当scrollType=x时, 生效) */
		"width": 300, /* 滚动可视区宽 */
		"height": 300, /* 滚动可视区高 */
		"mousewheelStep": 30, /* 滚动步长(建议设置30) */
		"speed": 350, /* 滚动条过去效果(毫秒) */
		"isHideBar": false, /* 是否隐藏滚动条(离开内容可视区) */

		"_version": 1.2,
		"_innerClass": "ab-scroll-wrap-inner",
		"_iname": "ab-scroll-init",
		"_ivalue": "yes"
	}, _opts);
	
	/* 内容元素对象 */
	var _content = $(_opts.contentEl);
	// 元素是否存在或已初始化
	if(0 == _content.length || __fns__.isInit()) {
		return false;
	}
	/* 初始化标记 */
	_content.attr(_opts._iname, _opts._ivalue);

	/* 计算容器尺寸 */
	__fns__.computeContentWH();

	/* 定义变量 */
	var _contentBox, _barBox, _bar;

	/* 设置变量参数 */
	var _moveStatus = false;
	var _isMouseleave = false;
	var _scrollMove = 0;
	var _mousePos = 0;

	var _barClass = _opts.barClass;
	var _barBgClass = _opts.barBgClass;
	var _barHeight = __fns__.toFloat(_opts.barHeight);
	var _barWidth = __fns__.toFloat(_opts.barWidth);
	var _width = __fns__.toFloat(_opts.width);
	var _height = __fns__.toFloat(_opts.height);
	var _speed = _opts.speed;
	var _isHideBar = __fns__.toBool(_opts.isHideBar);
	var _mousewheelStep = _opts.mousewheelStep;
	var _mouseleaveTime = 50;
	var _mouseleave_timeID;

	/* 内容宽度 */
	var _contentWidth = _content.outerWidth();
	/* 内容高度 */
	var _contentHeight = _content.outerHeight();
    // console.log(_content)

	/* 初始化 */
	__fns__.init();

	/* 容器距 x 部位置 */
	var _contentBoxLeft = _contentBox.offset().left;
	/* 容器距 y 部位置 */
	var _contentBoxTop = _contentBox.offset().top;

	/* 内容超出的高 */
	var _contentOverWidth = (_contentWidth - _width);
	var _contentOverHeight = (_contentHeight - _height);

	/* 滚动条需要的宽 */
	_barWidth = (_width / _contentWidth);
	/* 滚动条需要的高 */
	_barHeight = (_height / _contentHeight);

	/* 允许滚动的宽 */
	var _barAllowWidth = (_width - (_barWidth * _width));
	/* 允许滚动的高 */
	var _barAllowHeight = (_height - (_barHeight * _height));

	/* 内容需要滚动的步伐 */
	var _contentScrollStep = 0;
	if (__fns__.isX()) {
		_contentScrollStep = (_contentOverWidth / _barAllowWidth);
		/* 设置滚动条宽 */
		_bar.width((_barWidth * 100) + "%");
		/* 获取滚动条宽度 */
		_barWidth = _bar.width();
	} else {
		_contentScrollStep = (_contentOverHeight / _barAllowHeight);
		/* 设置滚动条高 */
		_bar.height((_barHeight * 100) + "%");
		/* 获取滚动条高度 */
		_barHeight = _bar.height();
	}
	
	/* 内容超出区域创建滚动条 */
	if (__fns__.isX()) {
		if(_contentOverWidth > 0) {
			if(!_isHideBar){
				_barBox.stop(true, true).fadeIn(_speed);
			}
		}
	} else {
		if(_contentOverHeight > 0) {
			if(!_isHideBar){
				_barBox.stop(true, true).fadeIn(_speed);
			}
		}
	}

	/* Bind event */
	__fns__.barEvent();
	__fns__.mousewheel();
	__fns__.hideBar();
};