(function (win, dom) {

	/**
	 * 参数：
	 * o [object]
	 * o.selId -> 滚动内容盒子的id （必须）
	 * o.width -> 滚动条的宽度 （默认10，请设置为偶数)
	 * o.bgColor -> 滚动条包裹层的颜色 (默认#eaeaea)
	 * o.barColor -> 滚动条的颜色 (默认#ccc)
	 * o.enterShow -> 是否为鼠标进入包裹层后显示滚动条 （默认true是）
	 * o.hasY -> 是否需要Y轴滚动条（默认true需要）
	 * o.hasX -> 是否需要X轴滚动条（默认false不需要）
	 * o.borderRadius -> 滚公条圆弧的宽度（默认为o.width的一半）
	 * 注：通过调用MyScrollBar.setSize()函数可以重置滚动条高度
	 */
	function MyScrollBar (o) {
		this.init(o);
	}

	MyScrollBar.prototype.init = function (o) {
		this.bXBar = false;						// 是否有x轴滚动条
		this.bYBar = false;						// 是否有y轴滚动条
					
		this.iScrollTop = 0;					// 滚动内容的y轴滚动距离
		this.iScrollLeft = 0;					// 滚动内容的x轴滚动距离

		this.bYShow = false;					// y轴滚动条显示与否
		this.bXShow = false;					// x轴滚动条显示与否

		this.oWrapper = dom.getElementById(o.selId);		// 滚动盒子
		this.oScroll = this.oWrapper.firstElementChild;		// 滚动内容

		this.setParam(o);									// 调用设置初始参数喊
		this.addScrollBar();								// 调用添加滚动条函数

		this.initState();									// 调用设置初始状态函数
		this.initEvent();									// 调用设置事件函数
	}

	
	// 初始化状态
	MyScrollBar.prototype.initState = function () {
		// 给包裹层设置默认定位
		var sWPosition = getStyle(this.oWrapper, 'position');
		if(sWPosition == 'static') {
			setStyle(this.oWrapper, {
				position: 'relative'
			})
		}

		setStyle(this.oScroll, {
			position: 'relative'
		})

		if ( this.bYBar ) {

			setStyle(this.oYBox, {
				display: this.enterShow ? 'none' : 'block',			// 如果enterShow为true就是需要进入包裹层才显示滚动条
				position: 'absolute',
				top: 0,
				right: 0,
				zIndex: 10,
				width: this.width + 'px',
				height: '100%',
				backgroundColor: this.bgColor
			});

			setStyle(this.oYBar, {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				backgroundColor: this.barColor,
				borderRadius: this.borderRadius + 'px',
				transition: 'all ' + this.time + 'ms'
			})
		}

		if ( this.bXBar ) {

			setStyle(this.oXBox, {
				display: this.enterShow ? 'none' : 'block',			// 如果enterShow为true就是需要进入包裹层才显示滚动条
				position: 'absolute',
				bottom: 0,
				left: 0,
				zIndex: 10,
				height: this.width + 'px',
				width: '100%',
				backgroundColor: this.bgColor
			})

			setStyle(this.oXBar, {
				position: 'absolute',
				bottom: 0,
				left: 0,
				height: '100%',
				backgroundColor: this.barColor,
				borderRadius: this.borderRadius + 'px',
				transition: 'all ' + this.time + 'ms'
			})
		}

		this.setSize();		// 设置滚动条的宽高
	}

	// 初始化事件
	MyScrollBar.prototype.initEvent = function () {
		var _this = this;

		// 鼠标在包裹层中然后滚轴上下滚动
		var sUserAgent = win.navigator.userAgent.toLowerCase();
		if ( sUserAgent.indexOf('firefox') != -1 ) {
			// 火狐浏览器滚轴滚动
			this.oWrapper.addEventListener('DOMMouseScroll', function (e) {
				if ( _this.bYBar && _this.bYShow ) {
					e.preventDefault();

					_this.iScrollTop += e.detail > 0 ? 60 : -60;
					_this.iScrollTop = _this.iScrollTop <= 0 ? 0 : _this.iScrollTop >= _this.iScrollH - _this.iWrapperH ? _this.iScrollH - _this.iWrapperH : _this.iScrollTop;
					_this.setTransLate();
					_this.setYTop(_this.iScrollTop / _this.iScrollH * _this.iYBoxH);
				}
			})
		} else {
			// 谷歌、ie滚轴滚动
			this.oWrapper.onmousewheel = function (evt) {
				if ( _this.bYBar && _this.bYShow ) {
					var e = evt || win.event;
					evt ? e.preventDefault() : e.returnValue = false;

					_this.iScrollTop += e.wheelDelta < 0 ? 60 : -60;
					_this.iScrollTop = _this.iScrollTop <= 0 ? 0 : _this.iScrollTop >= _this.iScrollH - _this.iWrapperH ? _this.iScrollH - _this.iWrapperH : _this.iScrollTop;
					_this.setTransLate();
					_this.setYTop(_this.iScrollTop / _this.iScrollH * _this.iYBoxH);
				}
			}
		}

		// 输入表移入包裹层显示滚动条、移出隐藏滚动条
		var isInWrapper = false;
		this.oWrapper.onmouseenter = function () {
			isInWrapper = true;
			if ( _this.enterShow ) {
				if ( _this.bYBar && _this.bYShow ) {
					setStyle(_this.oYBox, {
						display: 'block'
					})
				}
				if ( _this.bXBar && _this.bXShow ) {
					setStyle(_this.oXBox, {
						display: 'block'
					})
				}
			}
		}
		this.oWrapper.onmouseleave = function () {
			isInWrapper = false;
			if ( _this.enterShow ) {
				if ( _this.bYBar && !bYDown && _this.bYShow ) {
					setStyle(_this.oYBox, {
						display: 'none'
					})
				}
				if ( _this.bXBar && !bXDown && _this.bXShow ) {
					setStyle(_this.oXBox, {
						display: 'none'
					})
				}
			}
		}


		// 鼠标在滚动条上按下，想要拖动
		var bYDown = false, bXDown = false;		// 在滚动条上是否按下
		var bYLeave = true, bXLeave = true;		// 是否离开
		var iDownPageY = 0, iDownPageX = 0;		// 按下时鼠标到页面顶部的距离
		var iYBarTop = 0, iXBarLeft = 0;		// 按下时滚动条的top/left
		if ( this.bYBar ) {
			// 鼠标移上Y轴滚动条变色
			if ( this.enterColor ) {
				this.oYBar.onmouseenter = function () {
					bYLeave = false;
					setStyle(this, {
						backgroundColor: _this.enterColor
					})
				}
				this.oYBar.onmouseleave = function () {
					bYLeave = true;
					if ( !bYDown ) {
						setStyle(this, {
							backgroundColor: _this.barColor
						})
					}
				}
			}
				
			// 鼠标在Y轴滚动条按下
			this.oYBar.onmousedown = function (e) {
				if ( _this.bYShow ) {
					bYDown = true;
					iDownPageY = e.clientY + dom.documentElement.scrollTop || dom.body.scrollTop;
					iYBarTop = parseInt(getStyle(this, 'top'));

					// 设置过度时间为0
					_this.setYTime(0);
					// 禁止文本可选中
					canSelectText(false);
				}
			}

			// 鼠标在按下Y轴滚动条后抬起
			dom.addEventListener('mouseup', function () {
				if ( bYDown && _this.bYShow ) {
					bYDown = false;

					// 回复过度时间
					_this.setYTime(_this.time);
					// 恢复文本可选中
					canSelectText(true);

	    			if ( !isInWrapper && _this.enterShow ) {
	    				setStyle(_this.oYBox, {
	    					display: 'none'
	    				})
	    			}
				}
				if ( !bYDown && bYLeave ) {
					setStyle(_this.oYBar, {
						backgroundColor: _this.barColor
					})
				}
			})

			// 鼠标按下Y轴滚动条后拖动
			dom.addEventListener('mousemove', function (e) {
				if ( bYDown && _this.bYShow ) {
					var iNowPageY = e.clientY + dom.documentElement.scrollTop || dom.body.scrollTop;
					var iNowTop = iYBarTop + iNowPageY - iDownPageY;

					iNowTop = iNowTop <= 0 ? 0 : iNowTop >= _this.iYBoxH - _this.iYBarH ? _this.iYBoxH - _this.iYBarH : iNowTop;
					_this.iScrollTop = iNowTop / _this.iYBoxH * _this.iScrollH;
					_this.setTransLate();
					_this.setYTop(iNowTop);
				}
			})

			// 禁止默认拖动事件
			this.oYBar.ondrag = function (e) {
				var e = evt || win.event;
				evt ? e.preventDefault() : e.returnValue = false;
			}
		}

		if ( this.bXBar ) {
			// 鼠标移上Y轴滚动条变色
			if ( this.enterColor ) {
				this.oXBar.onmouseenter = function () {
					bXLeave = false;
					setStyle(this, {
						backgroundColor: _this.enterColor
					})
				}
				this.oXBar.onmouseleave = function () {
					bXLeave = true;
					if ( !bXDown ) {
						setStyle(this, {
							backgroundColor: _this.barColor
						})
					}
				}
			}

			// 鼠标在X轴滚动条按下
			this.oXBar.onmousedown = function (e) {
				if ( _this.bXShow ) {
					bXDown = true;
					iDownPageX = e.clientX + dom.documentElement.scrollLeft || dom.body.scrollLeft;
					iXBarLeft = parseInt(getStyle(this, 'left'));

					// 设置过度时间为0
					_this.setXTime(0);
					// 禁止文本可选中
	    			canSelectText(false);
				}
			}

			// 鼠标在按下X轴滚动条后抬起
			dom.addEventListener('mouseup', function () {
				if ( bXDown && _this.bXShow ) {
					bXDown = false;

					// 回复过度时间
					_this.setXTime(_this.time);
					// 恢复文本可选中
	    			canSelectText(true);

	    			if ( !isInWrapper && _this.enterShow ) {
	    				setStyle(_this.oXBox, {
	    					display: 'none'
	    				})
	    			}
	    		}

	    		if ( !bXDown && bXLeave ) {
	    			setStyle(_this.oXBar, {
	    				backgroundColor: _this.barColor
	    			})
	    		}
			})

			// 鼠标按下X轴滚动条后拖动
			dom.addEventListener('mousemove', function (e) {
				if ( bXDown && _this.bXShow ) {
					var iNowPageX = e.clientX + dom.documentElement.scrollLeft || dom.body.scrollLeft;
					var iNowLeft = iXBarLeft + iNowPageX - iDownPageX;

					iNowLeft = iNowLeft <= 0 ? 0 : iNowLeft >= _this.iXBoxW - _this.iXBarW ? _this.iXBoxW - _this.iXBarW : iNowLeft;
					_this.iScrollLeft = iNowLeft / _this.iXBoxW * _this.iScrollW;
					_this.setTransLate();
					_this.setXLeft(iNowLeft);
				}
			})

			// 禁止默认拖动事件
			this.oXBar.ondrag = function (e) {
				var e = evt || win.event;
				evt ? e.preventDefault() : e.returnValue = false;
			}
		}	
	}

	// 设置默认参数
	MyScrollBar.prototype.setParam = function (o) {
		this.width = o.width ? o.width : 10;					// 滚动条的宽度

		this.bgColor = o.bgColor ? o.bgColor : '#eaeaea';		// 滚动条背景颜色

		this.barColor = o.barColor ? o.barColor : '#ccc';		// 滚动条颜色

		this.enterColor = o.enterColor || false;			// 鼠标移上滚动条时的颜色

		this.enterShow = o.enterShow === false ? false : true;	// 是否进入包裹层在显示滚动条

		this.hasY = o.hasY === false ? false : true;			// 是否有Y轴滚动条

		this.hasX = o.hasX === true ? true : false;				// 是否有X轴滚动条

		this.borderRadius = o.borderRadius >= 0 ? o.borderRadius : this.width / 2;	// 圆角

		this.time = o.time || 0;
	}

	// 判断是否添加XY轴滚动条
	MyScrollBar.prototype.addScrollBar = function () {
		// 获取包裹层与滚动层的尺寸
		this.getSize();

		if ( this.hasX ) {
			this.bXBar = true;
			
			this.oXBox = dom.createElement('div');					// X轴滚动条盒子
			this.oXBar = dom.createElement('div');					// X轴滚动条

			this.oXBox.appendChild(this.oXBar);						// 滚动条插入滚动条盒子
			this.oWrapper.insertBefore(this.oXBox, this.oScroll);	// 滚动条盒子插到oScroll之前
		}

		if ( this.hasY ) {
			this.bYBar = true;
			
			this.oYBox = dom.createElement('div');					// X轴滚动条盒子
			this.oYBar = dom.createElement('div');					// X轴滚动条

			this.oYBox.appendChild(this.oYBar);						// 滚动条插入滚动条盒子
			this.oWrapper.insertBefore(this.oYBox, this.oScroll);	// 滚动条盒子插到oScroll之前
		}
	}

	// 更新/获取包裹层与滚动层的尺寸
	MyScrollBar.prototype.getSize = function () {
		var oWrapperSize = getClientSize(this.oWrapper);
		var oScrollSize = getClientSize(this.oScroll);

		this.iWrapperClientW = oWrapperSize.width;
		this.iWrapperClientH = oWrapperSize.height;

		this.iPaddingT = parseInt(getStyle(this.oWrapper, 'paddingTop'));
		this.iPaddingR = parseInt(getStyle(this.oWrapper, 'paddingRight'));
		this.iPaddingB = parseInt(getStyle(this.oWrapper, 'paddingBottom'));
		this.iPaddingL = parseInt(getStyle(this.oWrapper, 'paddingLeft'));

		this.iWrapperW = oWrapperSize.width - this.iPaddingR - this.iPaddingL;
		this.iWrapperH = oWrapperSize.height - this.iPaddingT - this.iPaddingB;
		this.iScrollW = oScrollSize.width;
		this.iScrollH = oScrollSize.height;

		if ( this.bYBar ) {
			this.iYBoxH = oWrapperSize.height;
			this.iYBarH = this.iWrapperH / this.iScrollH * this.iYBoxH;
		}

		if ( this.bXBar ) {
			this.iXBoxW = oWrapperSize.width;
			this.iXBarW = this.iWrapperW /this.iScrollW * this.iXBoxW;
		}
	}

	// 设置尺寸
	MyScrollBar.prototype.setSize = function (time) {
		var _this = this;

		// 修改dom节点可能有延迟
		time = time || 100;
		setTimeout(function () {
			// 更新包裹层与滚动层的尺寸
			_this.getSize();

			// 超出最大滚动高度
			if ( _this.iScrollTop >= _this.iScrollH - _this.iWrapperH ) {
				_this.iScrollTop = _this.iScrollH - _this.iWrapperH;
			}
			if ( _this.iScrollW >= _this.iScrollW - _this.iWrapperW ) {
				_this.iScrollLeft = _this.iScrollW - _this.iWrapperW;
			}
			_this.setTransLate();

			// 滚动条
			if ( _this.bYBar ) {
				if ( _this.iWrapperH >= _this.iScrollH ) {
					setStyle(_this.oYBox, {
						display: 'none'
					})
					_this.bYShow = false;
				} else {
					if ( !_this.enterShow ) {
						setStyle(_this.oYBox, {
							display: 'block'
						})
					}
					setStyle(_this.oYBar, {
						height: _this.iYBarH + 'px',
						top: _this.iScrollTop / _this.iScrollH * _this.iYBoxH + 'px'
					}, 0)
					_this.bYShow = true;
				}
			}

			if ( _this.bXBar ) {
				if ( _this.iWrapperW >= _this.iScrollW ) {
					setStyle(_this.oXBox, {
						display: 'none'
					})
					_this.bXShow = false;
				} else {
					if ( !_this.enterShow ) {
						setStyle(_this.oXBox, {
							display: 'block'
						})
					}
					setStyle(_this.oXBar, {
						width: _this.iXBarW + 'px',
						left: _this.iScrollLeft / _this.iScrollW * _this.iYBoxW + 'px'
					}, 0)
					_this.bXShow = true;
				}
			}
		}, time);
	}

	/**
	 * 作用：设置oScroll的位置转换transform:translate
	 * iTime -> 动画时间，大于0有效，否则无动画，毫秒
	 */ 
	MyScrollBar.prototype.setTransLate = function (iTime) {
		var sTranslate = 'translate(-' + this.iScrollLeft + 'px, -' + this.iScrollTop + 'px)';
		setStyle(this.oScroll, {
			transition: 'all ' + (iTime >= 0 ? iTime : this.time) + 'ms',
			transform: sTranslate,
			msTransform: sTranslate,
			mozTransform: sTranslate,
			webkitTransform: sTranslate,
			oTransform: sTranslate
		})
	}

	// 设置Y轴过度时间
	MyScrollBar.prototype.setYTime = function (iTime) {
		setStyle(this.oYBar, {
			transition: 'all ' + (iTime >= 0 ? iTime : this.time) + 'ms'
		})
	}

	// 设置滚动top
	MyScrollBar.prototype.setYTop = function (iTop) {
		setStyle(this.oYBar, {
			top: iTop + 'px'
		})
	}

	// 设置X轴过度时间
	MyScrollBar.prototype.setXTime = function (iTime) {
		setStyle(this.oXBar, {
			transition: 'all ' + (iTime >= 0 ? iTime : this.time) + 'ms'
		})
	}

	// 设置滚动left
	MyScrollBar.prototype.setXLeft = function (iLeft, iTime) {
		setStyle(this.oXBar, {
			transition: 'all ' + (iTime >= 0 ? iTime : this.time) + 'ms',
			left: iLeft + 'px'
		})
	}

	/**
	 * 作用：跳到指定位置
	 * o.id -> 要跳到那个id的位置；
	 * o.pos -> 要跳到那个具体的位置，如果为字符串（两个选中择'top','bottom'，'left'，'right')，
	 如果为对象（{top: number, left: number}），为对象时如果要Y轴滚动条滚动就设置top，要两个轴一起滚动才一起设置。
	 * o.time -> 动画时间，不设没有动画
	 * 注：如果id存在，则pos不生效
	 */
	MyScrollBar.prototype.jump = function (o) {
		o = o || {};
		var oPos = {top: 0, left: 0};
		var iTop = 0;
		var iBottome = this.iScrollH - this.iWrapperClientH + this.iPaddingT + this.iPaddingB > 0 ? this.iScrollH - this.iWrapperClientH + this.iPaddingT + this.iPaddingB : 0;
		var iLeft = 0;
		var iRight = this.iScrollW - this.iWrapperClientW + this.iPaddingL + this.iPaddingR > 0 ? this.iScrollW - this.iWrapperClientW + this.iPaddingL + this.iPaddingR : 0;

		if ( o.id ) {
			var obj = document.getElementById(o.id);
			oPos = getPosition(obj, this.oScroll);
			
			if ( this.bYBar ) {
				oPos.top += this.iPaddingT;
			}

			if ( this.bXBar ) {
				oPos.left += this.iPaddingL;
			}
		} else if ( o.pos ) {
			if ( typeof o.pos == 'string' ) {
				switch(o.pos) {
					case 'top': oPos.top = iTop; break;
					case 'bottom': oPos.top = iBottome; break;
					case 'left': oPos.left = iLeft; break;
					case 'right': oPos.left = iRight; break;
					default: break;
				}
			} else if ( typeof o.pos == 'object' ) {
				oPos = o.pos;
			}
		}

		oPos.top = oPos.top > iBottome ? iBottome : oPos.top >= 0 ? oPos.top : 0;
		oPos.left = oPos.left > iRight ? iRight : oPos.left >= 0 ? oPos.left : 0;

		this.iScrollTop = oPos.top;
		this.iScrollLeft = oPos.left;
		this.setTransLate(o.time);
		if ( this.bYBar ) {
			this.setYTime(o.time);
			this.setYTop(this.iScrollTop / this.iScrollH * this.iYBoxH);
		}
		if ( this.bXBar ) {
			this.setXTime(o.time);
			this.setXLeft(this.iScrollLeft / this.iScrollW * this.iXBoxW, o.time);
		}
	}

	// 获取样式
	function getStyle (obj, name) {
		if(win.getComputedStyle) {
			return getComputedStyle(obj, null)[name];
		} else {
			return obj.currentStyle[name];
		}
	}

	// 设置样式
	function setStyle (obj, oStyle) {
        for(var i in oStyle) {
            obj.style[i] = oStyle[i];
        }
    }

	/**
	 * 作用：获取对象的offset（内容尺寸+padding+border）尺寸，display:none;元素也可以获取
	 * 参数：obj -> 要获取尺寸的元素
	 * 返回：res -> width 宽; res -> height 高
	 * 依赖：getStyle，setStyle
	 */
	function getOffsetSize (obj) {
	    var sDisplay = getStyle(obj, "display");
	    var res = {}

	    if ( sDisplay != "none" ) {
	        res.width = obj.offsetWidth;
	        res.height = obj.offsetHeight;
	    } else {
	        var oldStyle = {
	            position: getStyle(obj, "position"),
	            visibility: getStyle(obj, "visibility"),
	            display: sDisplay
	        }
	        var newStyle = {
	            position: "absolute",
	            visibility: "hidden",
	            display: "inline-block"
	        }
	        setStyle(obj, newStyle);
	        res.width = obj.offsetWidth;
	        res.height = obj.offsetHeight;
	        setStyle(obj, oldStyle);
	    }
	    return res;
	}

	// 计算实际内容+padding宽高即clientWidth/clientHeight，但ie时client包含边框
	function getClientSize (obj) {
		var iTopW = parseInt(getStyle(obj, 'borderTopWidth'));
		var iRightW = parseInt(getStyle(obj, 'borderRightWidth'));
		var iBottomW = parseInt(getStyle(obj, 'borderBottomWidth'));
		var iLeftW = parseInt(getStyle(obj, 'borderLeftWidth'));

		var oOffset = getOffsetSize(obj);
		return {
			width: oOffset.width <= 0 ? oOffset.width : oOffset.width - iLeftW - iRightW,
			height: oOffset.height <= 0 ? oOffset.height : oOffset.height - iTopW - iBottomW
		}
	}

	// 禁止与恢复文本可选中,true为可选中，false为不可选中
	function canSelectText (bCan) {
		if ( !bCan ) {
			dom.body.style.mozUserSelect = 'none';
			dom.body.style.webkitUserSelect = 'none';
			dom.body.style.msUserSelect = 'none';
			dom.body.style.khtmlUserSelect = 'none';
			dom.body.style.userSelect = 'none';
		} else {
			dom.body.style.mozUserSelect = 'text';
			dom.body.style.webkitUserSelect = 'text';
			dom.body.style.msUserSelect = 'text';
			dom.body.style.khtmlUserSelect = 'text';
			dom.body.style.userSelect = 'text';
		}
	}

	/**
	 * 作用：获取obj到目标goal的position距离
	 */
	function getPosition (obj, goal) {
		var oPos = {
			top: obj.offsetTop,
			left: obj.offsetLeft
		}

		if ( obj.parentNode != goal ) {
			var obj = getPosition(obj.parentNode, goal);
			oPos.top += obj.top;
			oPos.left += obj.left;
		} else {
			return oPos;
		}
	}

	if ( typeof define === "function" && define.amd ) {
		define([], function () {
			return MyScrollBar;
		});
	}
	win.MyScrollBar = MyScrollBar;
})(window, document);