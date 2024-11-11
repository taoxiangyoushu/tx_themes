/*
 * @Author: JiaoShou 
 * @Date: 2020-07-09 16:46:23 
 * @Last Modified by:   JiaoShou 
 * @Last Modified time: 2020-07-09 16:46:23 
 */
;(function(window,$,undefined){

  $.fn.extend({
    /**
     * ������޷����Ч��
     * ͨ��html���ֽṹ��һ������������classNameΪmarquee-area�����������������һ��������������classNameΪmarquee-container�����������������溬�����ɸ�������classNameΪmarquee-item��������html�ṹ
     * ��������ȡ�����classNameΪmarquee-area�Ķ�����
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
     * @param {object} option  ��ѡ����
     */
    'marquee': function(option){
      var defaults = {
            contentClass: '.marquee-container',      //���������className,��Ҫ��ѡ������#��.
            itemClass: '.marquee-item',      //�������className,��Ҫ��ѡ������#��.
            direction: 'left',      //��������Ĭ���������,��ѡright��top��bottom
            pauseOnHover: false,   //��hoverʱ��ͣ����
            equal: true,      //�������ƶ�����Ŀ���߸��Ƿ���ȣ���������²��ȵ�ʱ����Ҫ���ô��Ĭ�϶�����ȿ��
            step: 5,      //�ƶ�����
            speed: 30      //�л��ٶ�

          },
          opts = $.extend({}, defaults, option);
      
      // ����������󣬷�ֹ���Ч��ͬ��bug
      return this.each(function () {
        var marquee = {
          $el: $(this), //�¼�����
          defaults: defaults,      //���Ĭ��ֵ
          contentClass: opts.contentClass,      //���������className
          itemClass: opts.itemClass,  //�������className
          direction: opts.direction,  //��������Ĭ���������,��ѡright��top��bottom
          pauseOnHover: opts.pauseOnHover,   //��hoverʱ��ͣ����
          equal: opts.equal,      //�������ƶ�����Ŀ���߸��Ƿ���ȣ���������²��ȵ�ʱ����Ҫ���ô��Ĭ�϶�����ȿ��
          step: opts.step,      //�ƶ�����
          speed: opts.speed,      //�л��ٶ�
          $content: null,  //��jq��ȡcontentԪ�ؼ��ϣ��޶�this��Χ�ڻ�ȡ,��Ҫ��ѡ������#��.
          $item: null,  //��jq��ȡitemԪ�ؼ��ϣ��޶�this��Χ�ڻ�ȡ,��Ҫ��ѡ������#��.
          timer: null,      //ƫ�Ƶ�ǰλ��
          offset: 0,      //��ǰƫ��λ��
          offsetDirection: 'left',      //��ǰƫ��ֵ������
          iArea: 0,      //����������ֵ
          iContent: 0,      //ԭ�����������ֵ��Ҳ�������Ϊ���ֲ�һ�ε���ֵ
          iItemLength: 0,      //ԭitem����
          // offsetAttr: 'width',      //�ݴ�û��ʹ��
          // ��ʼ��
          'init': function(){
            // �淶��ʼ������
            this.initProp();

            // �ิ��һ�ݹ��������ݣ�ʵ���޷����
            this.createHtml();

            // ��ȡ������ֵ
            this.getScrollVal();

            // ��ʼ�ƶ�
            this.startMove();

            // hover�¼�
            this.onHover();
          },
          // �淶���������Ͳ�����������Ϲ棬�ָ�Ϊ���Ĭ��ֵ
          'initProp': function(){
            
            // �淶���������Ͳ���,��ֹ�ֲ�����������������ָ��ɲ��Ĭ��ֵ
            this.step = Number(this.step) || this.defaults.step;
            this.speed = Number(this.speed) ||  this.defaults.speed;
            this.contentClass = $.trim(this.contentClass) ||  this.defaults.contentClass;
            this.itemClass = $.trim(this.itemClass) ||  this.defaults.itemClass;
            this.direction = $.trim(this.direction) ||  this.defaults.direction;
            
            this.$content = $(opts.contentClass, this.$el);
            this.$item = $(opts.itemClass, this.$el);
            
            if (this.direction == 'left' || this.direction =='right') {
              // ���ƫ������
              this.offsetDirection = 'left';
              return false;
            }
            this.offsetDirection = 'top';
          },
          // �ิ��һ�ݹ��������ݣ�ʵ���޷����
          'createHtml': function () {
            // ��ȡԭitem����
            this.iItemLength = this.$item.length;
            // ��ȡԭitem ����
            var el = this.$content.html();
            
            // �ڹ���������һ��item����
            this.$content.append(el);

          },
          // ��ȡ������ֵ
          'getScrollVal': function () {
            if (!this.equal) {
              // ����������ݲ�����ȿ�����ԣ���Ҫ����ÿһ��������������Ŀ��
              this.getItemVal();
              return false;
            }
            // ��ȡ��ͬitem�������ֵ
            this.getItemEqualVal();
          },
          // ��ȡ��ͬ��������ֵ
          'getItemVal': function () {
            if (this.direction == 'left' || this.direction =='right') {
              // ����Ǻ�������ͼ���width
              this.getItemValWidth();
              return false;
            }
            // �������������ͼ���height
            this.getItemValHeight();
          },
          // ��ȡ��ͬ��������ֵ
          'getItemEqualVal': function () {
            if (this.direction == 'left' || this.direction =='right') {
              // ����Ǻ�������ͼ���width
              this.getItemEqualValWidth();
              return false;
            }
            // �������������ͼ���height
            this.getItemEqualValHeight();
          },
          // ��ȡ��ͬ��������ֵheight
          'getItemValHeight': function () {
            // �洢this����
            var _this = this;
            // ����������ݲ�����ȿ�����ԣ���Ҫ����ÿһ��������������Ŀ��
            $.each(_this.$item, function (index) {
              _this.iContent += _this.$item.eq(index).height();
            });
            // �����������ø�����item����¿��
            this.$content.css('height', this.iContent * 2);
            // ��ȡ�������Ŀ��
            this.iArea = this.$el.height();
          },
          // ��ȡ��ͬ��������ֵheight
          'getItemEqualValHeight': function () {
            // ����ԭitem�Ĺ�������Ŀ��
            this.iContent = this.$item.eq(0).height() * this.iItemLength;

            // �����������ø�����item����¿��
            this.$content.css('height', this.iContent * 2);
            // ��ȡ�������Ŀ��
            this.iArea = this.$el.height();
          },
          // ��ȡ��ͬ��������ֵwidth
          'getItemValWidth': function () {
            // �洢this����
            var _this = this;
            // ����������ݲ�����ȿ�����ԣ���Ҫ����ÿһ��������������Ŀ��
            $.each(_this.$item, function (index) {
              _this.iContent += _this.$item.eq(index).width();
            });
            // �����������ø�����item����¿��
            this.$content.css('width', this.iContent * 2);
            // ��ȡ�������Ŀ��
            this.iArea = this.$el.width();
          },
          // ��ȡ��ͬ��������ֵwidth
          'getItemEqualValWidth': function () {
            // ����ԭitem�Ĺ�������Ŀ��
            this.iContent = this.$item.eq(0).width() * this.iItemLength;

            // �����������ø�����item����¿��
            this.$content.css('width', this.iContent * 2);
            // ��ȡ�������Ŀ��
            this.iArea = this.$el.width();
          },
          // ��ʼ�ƶ�
          'startMove': function(){
            
            // �洢this����
            var _this = this;
            clearInterval(this.timer);
            this.timer = setInterval(function(){
                          
              // ����ƫ��ֵ
              _this.countVal();
              if(_this.offset < 0){
                // ʹ��ȡģ��ֵ��һֱ��ƫ���������Բ��ø�_this.offsetֵ���㣬һֱ�ۼ�
                // ��Ϊleftƫ�����Ǵ�0��ʼ�ģ�Ҫ���ƶ������Ƶ��������Ҳ಻����ֿհף�ԭitem���ܿ����һ�����ڣ�ȡģ�϶�����һ�����ڣ����Բ��ᳬ�����Ƶ�item����
                _this.$content.css(_this.offsetDirection, _this.offset % _this.iContent);
              }else{
                // ��Ϊleftƫ�����Ǵ�0��ʼ�ģ�Ҫ�����ƶ������Ƶ��������Ҳ࣬�����ܳ��ֿհף����԰���ԭitem���ܿ����һ�����ڣ������ڵ�(left%w-w)��Ϊ�˰ѹ������������ƶ�һ�����ڣ���ֹ�����Ƶ�ʱ����ֿհף�����ȡģ�϶�����һ�����ڣ����Բ��ᳬ�����Ƶ�item����
                _this.$content.css(_this.offsetDirection, (_this.offset % _this.iContent - _this.iContent) % _this.iContent);
              }
            },this.speed);
          },
          // ����ƫ����
          'countVal': function(){
            // �洢this����
            var _this = this;
            switch (this.direction) {
              case 'left':
                // �����ƶ��ۼ�
                _this.offset -= _this.step;
                break;
              case 'right':
                // �����ƶ��ۼ�
                _this.offset += _this.step;
                break;
              case 'top':
                // �����ƶ��ۼ�
                _this.offset -= _this.step;
                break;
              case 'bottom':
                // �����ƶ��ۼ�
                _this.offset += _this.step;
                break;
              default:
                break;
            }
          },
          // hover�¼�
          'onHover': function(){
            // �洢this����
            var _this = this;
            if (!this.pauseOnHover) {
              return false;
            }
            this.$el.on('mouseenter',function () {
              clearInterval(_this.timer);
            });
            this.$el.on('mouseleave',function () {
              // �����ƶ�����
              _this.startMove();
            });
          },
        };
        // ��ʼ�����
        marquee.init();
      });
    }
  });
})(window,jQuery);
