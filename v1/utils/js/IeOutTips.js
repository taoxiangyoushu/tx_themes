/*IE低版本提示*/
var IE_Safari={}
var jsFileName = "IeOutTips.js";  
var rName = new RegExp(jsFileName+"(\\?(.*))?$")  
var jss=document.getElementsByTagName('script');  
for (var i = 0;i < jss.length; i++){  
  var j = jss[i];  
  if (j.src&&j.src.match(rName)){  
    var oo = j.src.match(rName)[2];  
    if (oo&&(t = oo.match(/([^&=]+)=([^=&]+)/g))){  
        for (var l = 0; l < t.length; l++){  
            r = t[l];  
            var tt = r.match(/([^&=]+)=([^=&]+)/);  
            if (tt) {
                IE_Safari.DEFAULT_VERSION = tt[2] 
            }
        }
    }
  }
}
var text = "";
text += "<div id=\"IeMinTip\" style=\"border: 1px solid #ffe38c; background: #fffdf6; text-align: center; clear: both; width:780px; height: 136px; position: absolute; z-index:999999999; top: 2px; bottom: 2px; padding:0 8px;\">";
text += "   <div style=\"position: absolute; font-size: 14px; right: 6px; top: 3px; font-weight: bold;z-index:999999999;\"><a href=\"javascript:void(0)\" onclick=\"this.parentNode.parentNode.style.display='none'\">关闭</a></div>";
text += "   <div style=\"width: 740px; margin: 0 auto; text-align: left; padding: 0; overflow: hidden; color: black;\">";
text += "       <div style=\"float: left; overflow: hidden;\">";
text += "           <div style=\"float:left; margin-left: 20px; padding-top: 45px;\"><img src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/browser-warn-ico.png\" style=\"border:none;\"></div>";
text += "           <div style=\"float:left; margin-left: 42px;\">";
text += "               <div style=\"font-size: 16px; font-we ight: bold; margin-top: 27px;\">您使用的浏览器版本过低</div>";
text += "               <div style=\"color: #999;font-size: 12px; margin-top: 6px; line-height: 16px;letter-spacing: 0px;\">为了您的优质使用体验，请升级到";
text += "                   <a style=\"color: #4081ff;\" href=\"https://support.microsoft.com/zh-cn/topic/internet-explorer-%E4%B8%8B%E8%BD%BD-d49e1f0d-571c-9a7b-d97e-be248806ca70\" target=\"_blank\">最新版本浏览器</a>,";
text += "                   或者使用其他高级浏览器, 如:<br/><br/>";
text += "                   <a style=\"color: #666;\" href=\"https://browser.360.cn/\" target=\"_blank\"><img src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/browser-360-logo.png\" style=\"border:none; margin-right:5px;position: relative;top: -2px;\">360浏览器</a>";
text += "                   <a style=\"color: #666;\" href=\"https://www.google.cn/chrome/\" target=\"_blank\"><img src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/browser-chrome-logo.png\" style=\"border:none; margin-left:20px; margin-right:5px;position: relative;top: -2px;\">Chrome(谷歌浏览器)</a>";
text += "                   <a style=\"color: #666;\" href=\"https://ie.sogou.com/\" target=\"_blank\"><img src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/browser-sougou-logo.png\" style=\"border:none; margin-left:20px; margin-right:5px;position: relative;top: -2px;\">搜狗浏览器</a>";
text += "                   <a style=\"color: #666;\" href=\"https://browser.qq.com/\" target=\"_blank\"><img src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/browser-qq-logo.png\" style=\"border:none; margin-left:20px; margin-right:5px;position: relative;top: -2px;\">QQ浏览器</a>";
text += "                   <a style=\"color: #666;\" href=\"http://www.firefox.com.cn/\" target=\"_blank\"><img src=\"https://api.taoxiangyoushu.com/html/v1/utils/img/browser-huohu-logo.png\" style=\"border:none; margin-left:20px; margin-right:5px;position: relative;top: -2px;\">火狐浏览器</a>";
text += "               </div>";
text += "           </div>";
text += "       </div>";
text += "   </div>";
text += "</div>";
IE_Safari.IeMinTipsHTML = text
IE_Safari.ua = navigator.userAgent.toLowerCase();
IE_Safari.isIE = IE_Safari.ua.indexOf("msie") > -1;
IE_Safari.safariVersion;

if (IE_Safari.isIE) {
   IE_Safari.safariVersion = IE_Safari.ua.match(/msie ([\d.]+)/)[1];   //获取浏览器版本号 
}else{
   IE_Safari.isIE = IE_Safari.ua.indexOf("rv:") > -1;
   try {
       IE_Safari.safariVersion = IE_Safari.ua.match(/rv:([\d.]+)/)[1];   //获取浏览器版本号  
   } catch (error) {
       IE_Safari.isIE=false;
       IE_Safari.safariVersion='99999';
   }
}
if ((IE_Safari.safariVersion * 1) <= (IE_Safari.DEFAULT_VERSION * 1)) {   //若版本号低于IE10，则跳转到如下页面
    document.write(IE_Safari.IeMinTipsHTML);
    document.getElementById("IeMinTip").style.left=(window.innerWidth-780)/2+"px";
}
