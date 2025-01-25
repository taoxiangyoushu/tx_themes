
  var screenHeight = $(window).height();
  var div = document.getElementById("serviceBtn");
  var clientWidth = document.documentElement.clientWidth; // 获取手机的像素宽度
  var clientHeight = document.documentElement.clientHeight; // 获取手机的像素高度
  var divattr = document.createAttribute("id");
  divattr.value = "float_info";
  //把属性id = "float_info"添加到div
  div.setAttributeNode(divattr);
  var flag = 0; //标记是拖曳还是点击
  var oDiv = document.getElementById("float_info");
  oDiv.style.display = "block"; // 显示元素
  oDiv.addEventListener("touchstart", () => {
    flag = 0;
    oDiv.style.transition = "none";
  });

  // 在拖拽的过程中，按钮应该跟随鼠标的移动而移动。
  oDiv.addEventListener("touchmove", (e) => {
    flag=1
    if (e.targetTouches.length === 1) {  // 一根手指 
        e.preventDefault();// 阻止默认的滚动行为
        div.style.left = e.targetTouches[0].clientX-20 +'px'//clientX：触摸目标在视口中的x坐标。
        div.style.top = e.targetTouches[0].clientY -25 +'px'//clientY：触摸目标在视口中的y坐标。
    }
}) 

// 拖拽结束以后，重新调整按钮的位置并重新设置过度动画。
oDiv.addEventListener("touchend", () => {
    // 如果是点击跳转到首页
    if(flag==0){

    }else {
        div.style.transition = 'all 0.3s'
        if ( parseInt(div.style.left)> (document.documentElement.clientWidth / 2)) {
            div.style.left = document.documentElement.clientWidth - 58 +'px';
        } else {
            div.style.left = 5+'px'
        }
        // 控制其超出屏幕回到原始位置
         if ( parseInt(div.style.top)<0) {
             div.style.top = '0px';
         } 
         if ( parseInt(div.style.top)>document.documentElement.clientHeight-50) { 
             div.style.top = (document.documentElement.clientHeight-50)+'px';
         } 
    }

})
