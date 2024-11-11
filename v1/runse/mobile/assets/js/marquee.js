/*
 * @Author: JiaoShou 
 * @Date: 2020-07-09 16:46:23 
 * @Last Modified by:   JiaoShou 
 * @Last Modified time: 2020-07-09 16:46:23 
 */
;(function(window,$,undefined){

  $.fn.extend({
    /**
     * 跑马灯无缝滚动效果
     * 通常html布局结构是一个滚动可视区className为marquee-area，滚动可视区里包含一个滚动区域主体className为marquee-container，滚动区域主体里面含有若干个滚动项className为marquee-item，这样的html结构
     * 插件对象获取在这个className为marquee-area的对象上
     *<div class="marquee-area j-quee">
     *  <div class="marquee-container">
     *    <div class="marquee-item h100">
     *      <a href="javascript:;"><img src="./images/jd1.jpg"></a>
     *    </div>
     *    <div class="marquee-item h50">
     *      <a href="javascript:;"><img src="./images/jd2.jpg"></a>
     *    </div>
     *  </div>
     *</div>
     * @param {object} option  可选参数
     */
    'marquee': function(option){
      var defaults = {
            contentClass: '.marquee-container',      //滚动主体的className,需要带选择器的#、.
            itemClass: '.marquee-item',      //滚动项的className,需要带选择器的#、.
            direction: 'left',      //滚动方向，默认往左滚动,可选right、top、bottom
            pauseOnHover: false,   //在hover时暂停滚动
            equal: true,      //滚动项移动方向的宽或者高是否相等，特殊情况下不等的时候需要调用此项，默认都是相等宽高
            step: 5,      //移动步长
            speed: 30      //切换速度

          },
          opts = $.extend({}, defaults, option);
      
      // 遍历插件对象，防止多个效果同步bug
      return this.each(function () {
        var marquee = {
          $el: $(this), //事件对象
          defaults: defaults,      //插件默认值
          contentClass: opts.contentClass,      //滚动主体的className
          itemClass: opts.itemClass,  //滚动项的className
          direction: opts.direction,  //滚动方向，默认往左滚动,可选right、top、bottom
          pauseOnHover: opts.pauseOnHover,   //在hover时暂停滚动
          equal: opts.equal,      //滚动项移动方向的宽或者高是否相等，特殊情况下不等的时候需要调用此项，默认都是相等宽高
          step: opts.step,      //移动步长
          speed: opts.speed,      //切换速度
          $content: null,  //用jq获取content元素集合，限定this范围内获取,需要带选择器的#、.
          $item: null,  //用jq获取item元素集合，限定this范围内获取,需要带选择器的#、.
          timer: null,      //偏移当前位置
          offset: 0,      //当前偏移位置
          offsetDirection: 'left',      //当前偏移值的属性
          iArea: 0,      //可视区的数值
          iContent: 0,      //原滚动主体的数值，也可以理解为，轮播一次的数值
          iItemLength: 0,      //原item个数
          // offsetAttr: 'width',      //暂存没有使用
          // 初始化
          'init': function(){
            // 规范初始化参数
            this.initProp();

            // 多复制一份滚动项内容，实现无缝滚动
            this.createHtml();

            // 获取滚动数值
            this.getScrollVal();

            // 开始移动
            this.startMove();

            // hover事件
            this.onHover();
          },
          // 规范传入数字型参数，如果不合规，恢复为插件默认值
          'initProp': function(){
            
            // 规范传入数字型参数,防止手残输入错误，输入错误则恢复成插件默认值
            this.step = Number(this.step) || this.defaults.step;
            this.speed = Number(this.speed) ||  this.defaults.speed;
            this.contentClass = $.trim(this.contentClass) ||  this.defaults.contentClass;
            this.itemClass = $.trim(this.itemClass) ||  this.defaults.itemClass;
            this.direction = $.trim(this.direction) ||  this.defaults.direction;
            
            this.$content = $(opts.contentClass, this.$el);
            this.$item = $(opts.itemClass, this.$el);
            
            if (this.direction == 'left' || this.direction =='right') {
              // 如果偏移属性
              this.offsetDirection = 'left';
              return false;
            }
            this.offsetDirection = 'top';
          },
          // 多复制一份滚动项内容，实现无缝滚动
          'createHtml': function () {
            // 获取原item长度
            this.iItemLength = this.$item.length;
            // 获取原item 布局
            var el = this.$content.html();
            
            // 在滚动区域复制一份item内容
            this.$content.append(el);

          },
          // 获取滚动数值
          'getScrollVal': function () {
            if (!this.equal) {
              // 如果设置内容不是相等宽度属性，需要遍历每一个项，计算滚动区域的宽度
              this.getItemVal();
              return false;
            }
            // 获取相同item滚动项的值
            this.getItemEqualVal();
          },
          // 获取不同滚动项数值
          'getItemVal': function () {
            if (this.direction == 'left' || this.direction =='right') {
              // 如果是横向滚动就计算width
              this.getItemValWidth();
              return false;
            }
            // 如果是竖向滚动就计算height
            this.getItemValHeight();
          },
          // 获取相同滚动项数值
          'getItemEqualVal': function () {
            if (this.direction == 'left' || this.direction =='right') {
              // 如果是横向滚动就计算width
              this.getItemEqualValWidth();
              return false;
            }
            // 如果是竖向滚动就计算height
            this.getItemEqualValHeight();
          },
          // 获取不同滚动项数值height
          'getItemValHeight': function () {
            // 存储this变量
            var _this = this;
            // 如果设置内容不是相等宽度属性，需要遍历每一个项，计算滚动区域的宽度
            $.each(_this.$item, function (index) {
              _this.iContent += _this.$item.eq(index).height();
            });
            // 给滚动区设置复制完item后的新宽度
            this.$content.css('height', this.iContent * 2);
            // 获取可视区的宽度
            this.iArea = this.$el.height();
          },
          // 获取相同滚动项数值height
          'getItemEqualValHeight': function () {
            // 计算原item的滚动区域的宽度
            this.iContent = this.$item.eq(0).height() * this.iItemLength;

            // 给滚动区设置复制完item后的新宽度
            this.$content.css('height', this.iContent * 2);
            // 获取可视区的宽度
            this.iArea = this.$el.height();
          },
          // 获取不同滚动项数值width
          'getItemValWidth': function () {
            // 存储this变量
            var _this = this;
            // 如果设置内容不是相等宽度属性，需要遍历每一个项，计算滚动区域的宽度
            $.each(_this.$item, function (index) {
              _this.iContent += _this.$item.eq(index).width();
            });
            // 给滚动区设置复制完item后的新宽度
            this.$content.css('width', this.iContent * 2);
            // 获取可视区的宽度
            this.iArea = this.$el.width();
          },
          // 获取相同滚动项数值width
          'getItemEqualValWidth': function () {
            // 计算原item的滚动区域的宽度
            this.iContent = this.$item.eq(0).width() * this.iItemLength;

            // 给滚动区设置复制完item后的新宽度
            this.$content.css('width', this.iContent * 2);
            // 获取可视区的宽度
            this.iArea = this.$el.width();
          },
          // 开始移动
          'startMove': function(){
            
            // 存储this变量
            var _this = this;
            clearInterval(this.timer);
            this.timer = setInterval(function(){
                          
              // 计算偏移值
              _this.countVal();
              if(_this.offset < 0){
                // 使用取模赋值，一直是偏移量，可以不用给_this.offset值归零，一直累加
                // 因为left偏移量是从0开始的，要左移动，复制的内容在右侧不会出现空白，原item的总宽度算一个周期，取模肯定不足一个周期，所以不会超出复制的item内容
                _this.$content.css(_this.offsetDirection, _this.offset % _this.iContent);
              }else{
                // 因为left偏移量是从0开始的，要往右移动，复制的内容在右侧，左侧可能出现空白，所以按照原item的总宽度算一个周期，括号内的(left%w-w)是为了把滚动区域，往右移动一个周期，防止再右移的时候出现空白，这样取模肯定不足一个周期，所以不会超出复制的item内容
                _this.$content.css(_this.offsetDirection, (_this.offset % _this.iContent - _this.iContent) % _this.iContent);
              }
            },this.speed);
          },
          // 计算偏移量
          'countVal': function(){
            // 存储this变量
            var _this = this;
            switch (this.direction) {
              case 'left':
                // 往左移动累减
                _this.offset -= _this.step;
                break;
              case 'right':
                // 往左移动累加
                _this.offset += _this.step;
                break;
              case 'top':
                // 往左移动累减
                _this.offset -= _this.step;
                break;
              case 'bottom':
                // 往左移动累加
                _this.offset += _this.step;
                break;
              default:
                break;
            }
          },
          // hover事件
          'onHover': function(){
            // 存储this变量
            var _this = this;
            if (!this.pauseOnHover) {
              return false;
            }
            this.$el.on('mouseenter',function () {
              clearInterval(_this.timer);
            });
            this.$el.on('mouseleave',function () {
              // 开启移动函数
              _this.startMove();
            });
          },
        };
        // 初始化插件
        marquee.init();
      });
    }
  });
})(window,jQuery);
