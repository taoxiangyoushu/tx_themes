jQuery.extend(
{
	/**
	* @see  将json字符串转换为对象
	* @param   json字符串
	* @return 返回object,array,string等对象
	*/
	evalJSON : function (strJson){
		try {
			return eval( "(" + strJson + ")");
		} catch(e){
			return "";
		}
	}
});
jQuery.extend(
{
	/**
	* @see  将javascript数据类型转换为json字符串
	* @param 待转换对象,支持object,array,string,function,number,boolean,regexp
	* @return 返回json字符串
	*/
	toJSON : function (object){
		var type = typeof object;
		if ('object' == type && object !== null)
		{
			if (Array == object.constructor)
				type = 'array';
			else if (RegExp == object.constructor)
				type = 'regexp';
			else
				type = 'object';
		}
		switch(type)
		{
			case 'undefined':
			case 'unknown': 
				return;
				break;
			case 'function':
			case 'boolean':
			case 'regexp':
				return object.toString();
				break;
			case 'number':
				return isFinite(object) ? object.toString() : 'null';
				break;
			case 'string':
				return '"' + object.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,
				function(){
					var a = arguments[0];
					return  (a == '\n') ? '\\n':
   						(a == '\r') ? '\\r':
   						(a == '\t') ? '\\t': ""
				}) + '"';
				break;
			case 'object':
				if (object === null) return 'null';
				var results = [];
				for (var property in object) {
					var value = jQuery.toJSON(object[property]);
					if (value !== undefined)
					results.push(jQuery.toJSON(property) + ':' + value);
				}
				return '{' + results.join(',') + '}';
				break;
			case 'array':
				var results = [];
				for(var i = 0; i < object.length; i++)
				{
					var value = jQuery.toJSON(object[i]);
					if (value !== undefined) results.push(value);
				}
				return '[' + results.join(',') + ']';
				break;
		}
	}
});

jQuery.extend(
{
	/**
	* @see  写入读取Cookie插件
	* 设置cookie的值 example $.cookie('the_cookie', 'the_value');
	* 新建一个cookie 包括有效期 路径 域名等 example $.cookie('the_cookie', 'the_value', {expires: 7, path:'/', domain: 'jquery.com', secure: true});
	* 新建cookie example $.cookie('the_cookie', 'the_value');
	* 删除一个cookie example $.cookie('the_cookie', null);
	*/
	cookie : function(name, value, options) { 
		if (typeof value != 'undefined') {
			options = options || {}; 
			if (value === null) { 
				value = ''; 
				options.expires = -1; 
			} 
			var expires = ''; 
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) { 
				var date; 
				if (typeof options.expires == 'number') { 
					date = new Date(); 
					date.setTime(date.getTime() + (options.expires * 60 * 1000)); 
				} else { 
					date = options.expires; 
				} 
				expires = '; expires=' + date.toUTCString();
			} 
			var path = options.path ? '; path=' + options.path : ''; 
			var domain = options.domain ? '; domain=' + options.domain : ''; 
			var secure = options.secure ? '; secure' : ''; 
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join(''); 
		} else {
			var cookieValue = null; 
			if (document.cookie && document.cookie != '') { 
				var cookies = document.cookie.split(';'); 
				for (var i = 0; i < cookies.length; i++) { 
					var cookie = jQuery.trim(cookies[i]); 
					if (cookie.substring(0, name.length + 1) == (name + '=')) { 
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); 
						break; 
					} 
				} 
			} 
			return cookieValue; 
		} 
	}
});

var AjaxUtil = function (){};
AjaxUtil.USERINFO={};
AjaxUtil.resources = AjaxUtil.prototype = {
	BASEPATHSE: null,
	AJAXACTION: '/servlet/servletActionSupper.action',
	OTHERACTION:'/servlet/ServletModuleCommon',
	BASEPATHSERVLET: '/appRootPath',
    getBaseParent: function(win){
    	if(!((typeof(win) != "undefined") && (win !== null) && (win != "")) || win==win.parent) return win;
		return this.getBaseParent(win.parent);
	},
	getBasePathse: function(){
		if(this.BASEPATHSE == null){
			var baseParent = this.getBaseParent(window);
			if(baseParent.__appBasePathse){
				this.BASEPATHSE = baseParent.__appBasePathse;
			} else {
				this.BASEPATHSE = AjaxUtil.command.getWebRoot();
				baseParent.__appBasePathse = this.BASEPATHSE;
			}
		}
		return this.BASEPATHSE;
		//return "http://wms.ikoori.com";
	},
	getAjaxActionPath: function (){
		return this.getBasePathse() + this.AJAXACTION;
	},
	getOtherActionPath:function(){
		return this.getBasePathse() + this.AJAXACTION;
	},
	//查询方法
	FUNC_EXECUTEQUERY : 1,

	//更新方法
	FUNC_EXECUTEUPDATE : 2,
	
	//事务提交
	FUNC_EXECUTETRANSACTION : 3,
	
	//批量查询
	FUNC_EXECUTEQUERYTRANSACTION : 4,
	
	//分页查询数据
	FUNC_PAGING : 5,
	
	//获取服务器数据
	FUNC_SERVER_DATA : 6,
	
	//获取拼音码
	FUNC_PINYIN_DATA : 7
};

AjaxUtil.command = AjaxUtil.prototype = {
	/**
	 * 执行其他业务逻辑
	 * classname String   执行的类名称
	 * method String 方法名称
	 * attr Array    参数值
	 */
	executeOtherModule:function(classname,attr){
		var _data={
				CLASSNAME:classname,
				request_type:"other"
		};
		var d = $.extend({},_data,attr);
		return this.f_asyncOther(d);
	},	
	/**
     * 执行导出
     * @param {String} _sqlID sql编号
     * @param {Array} _arrValue 参数值
     */
	executeExport : function (url, _arrValue ){ 
    	//alert($.toJSON(_arrValue));
        var _data = { 
			iFunc: AjaxUtil.resources.FUNC_EXECUTEQUERY, 
			url:url
		};
        _data = $.extend({},_data,_arrValue);
		
			 $.ajax({
				url:_data.url,
				type: "GET",
				dataType: "String",
				timeout: 90000,
				data: _data,
				async: false
			})
	 		/*html=html.replace(/\n/g, ""); 
			var data = $.evalJSON(html);   
			return data;*/
    },
	/**
     * 执行查询
     * @param {String} _sqlID sql编号
     * @param {Array} _arrValue 参数值
     */
    executeQuery : function (url, _arrValue ,_op){ 
    	//alert($.toJSON(_arrValue));
        var _data = { 
			iFunc: AjaxUtil.resources.FUNC_EXECUTEQUERY, 
			url:url
		};
        _data = $.extend({},_data,_arrValue);
		if ((typeof(_op) != "undefined") && ("async" in _op) && _op.async) {
			
			this.t_async(_data, _op);
		}else{
			
			return this.f_async(_data);
		}
    },
	
	/**
     * 执行更新
     * @param {String} _sqlID sql编号
     * @param {Array} _arrValue 参数值
     */
	executeUpdate : function (url, _arrValue, _op){
		var _data = { 
			iFunc: AjaxUtil.resources.FUNC_EXECUTEUPDATE, 
			url:url};
		_data = $.extend({},_data,_arrValue);
		if ((typeof(_op) != "undefined") && ("async" in _op) && _op.async) {
			
			this.t_async(_data, _op);
		}else{
			
			return this.f_async(_data);
		}
	},
	
	/**
     * 执行事务
     * @param {Array} _arrSqlValue sql编号，参数值
     */
	executeTransaction : function (_sqlID,_arrSqlValue, _op){ 
		var _data = {
			iFunc: AjaxUtil.resources.FUNC_EXECUTETRANSACTION,
			strData: $.toJSON({module:_sqlID,arrValue: _arrSqlValue})
		};
		
		if ((typeof(_op) != "undefined") && ("async" in _op) && _op.async) {
			
			this.t_async(_data, _op);
		}else{
			
			return this.f_async(_data);
		}
	},
	
	/**
     * 执行批量查询
     * @param {Array} _arrSqlValue sql编号，参数值
     */
	executeQueryTransaction : function (_arrSqlValue, _op){
		var _data = {
			iFunc: AjaxUtil.resources.FUNC_EXECUTEQUERYTRANSACTION,
			strData: $.toJSON({arrSqlValue: _arrSqlValue})
		};
		
		if ((typeof(_op) != "undefined") && ("async" in _op) && _op.async) {
			
			this.t_async(_data, _op);
		}else{
			
			return this.f_async(_data);
		}
	},
	
	/**
     * 分页查询数据
     * @param {String} _sqlID sql编号
     * @param {Array} _arrValue 参数值
     * @param {int} _page 当前页
     * @param {int} _pagesize 页面大小
     */
	paging : function (_sqlID, _arrValue, _page, _pagesize, _op){  
		var _data = {
			iFunc: AjaxUtil.resources.FUNC_PAGING,
			strData: $.toJSON({sqlID: _sqlID,
						arrValue: _arrValue,
						page: _page,
						pagesize: _pagesize})
		};
		
		if ((typeof(_op) != "undefined") && ("async" in _op) && _op.async) {
			
			this.t_async(_data, _op);
		}else{
			
			return this.f_async(_data);
		}
	},
	
	/**
     * 获取服务器数据
     * @param {Array} _arrNameValue 参数值(类似事物方法)
     */
	serverData : function (_arrNameValue, _op){
		var _data = {
			iFunc: AjaxUtil.resources.FUNC_SERVER_DATA,
			strData: $.toJSON({arrNameValue: _arrNameValue})
		};
		
		if ((typeof(_op) != "undefined") && ("async" in _op) && _op.async) {
			this.t_async(_data, _op);
		}else{
			return this.f_async(_data);
		}
	},
	
	/**
     * 获取拼音码
     * @param {String} _ChineseCharacters 汉字字符串
     */
	getPinyinCode : function (_strChineseCharacters, _op){
		var _data = {
			iFunc: AjaxUtil.resources.FUNC_PINYIN_DATA,
			strData: $.toJSON({strChineseCharacters: _strChineseCharacters})
		};
		
		if ((typeof(_op) != "undefined") && ("async" in _op) && _op.async) {
			this.t_async(_data, _op);
		}else{
			return this.f_async(_data);
		}
	},
	
	/**
     * 判断是否成功得到数据
     */
	isSucceed : function(_data) {
		if(_data)return true;
		if((typeof(_data) == "object") && ("bSucceed" in _data) && _data.bSucceed) return true;
		else return false;
	},
	
	/**
     * 异步加载服务器数据
     */
	t_async : function (_data, _op) {
		var suc = function(msg){
			var data = $.evalJSON(msg); 
			if(typeof(_op.success) == "function") _op.success(data);
		};
		
		var err = function(){
			alert(_data.strData);
			if(typeof(_op.error) == "function") _op.error();
		};
 
		$.ajax({
			url: _data.url,
			type: "POST",
			dataType: "html",
			timeout: 90000,
			data: _data,
			success: suc,
			error: err
		});
	},
	
	/**
     * 同步加载服务器数据
     */
	f_async : function(_data) { 
 		var html = $.ajax({
			url:_data.url,
			type: "POST",
			dataType: "html",
			timeout: 90000,
			data: _data,
			async: false
		}).responseText;
 		html=html.replace(/\n/g, ""); 
		var data = $.evalJSON(html);   
		return data;
	},
	/*
	 * 执行业务逻辑
	 */
	f_asyncOther:function(d){
		var html = $.ajax({
			url:_data.url,
			type: "POST",
			dataType: "html",
			timeout: 90000,
			data: d,
			async: false
		}).responseText; 
 		html=html.replace(/\n/g, "");
		var data = $.evalJSON(html); 
		return data;
	},
	/**
	 * 获取服务器根目录
	 */
	getWebRoot : function(){
		var basePath = this.f_async_html(AjaxUtil.resources.BASEPATHSERVLET);

		var url = ""; 
		if(basePath == null){
			var path = window.location.href;
			var flag = 0;
			for(var i=0; i<path.length; i++){ 
			    if(path.charAt(i)=='/') flag ++; 
			    if(flag==4) break;
			    url += path.charAt(i);
			}  
		}
		
		return url;
	},
	
	/**
	 * 同步获取网页内容
	 */
	f_async_html : function(url){
		var flag = true;
		var html = $.ajax({
			url: url,
			type: "POST",
			dataType: "html",
			timeout: 90000,
			async: false,
			error:function() {flag = false}
		}).responseText;
		if(flag){
			return html;
		} else {
			return null;
		}
	}
};