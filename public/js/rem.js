(function(win, util) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var dpr = 1;
    var scale = 1;
    var fontBase = 16;
  
    // 仅ios考虑2/3倍方案，其他设备下，仍旧使用1倍的方案
    if (/i(Phone|Pod|Pad)/.test(navigator.userAgent)) {
      var ratio = win.devicePixelRatio;
      dpr = ratio >= 3 ? 3 : (ratio >= 2 ? 2 : 1);
    } else {
      dpr = 1;
    }
    scale = 1 / dpr;
  
    docEl.setAttribute('data-dpr', dpr);
    metaEl.setAttribute('content', 'initial-scale=' + scale +
      ', maximum-scale=' + scale + ', user-scalable=no');
  
    function refreshFontSize() {
      var clientWidth = docEl.clientWidth;
      var clientHeight = docEl.clientHeight;
      var isPortrait = clientWidth > clientHeight; // 横屏
      var design = isPortrait ? clientHeight : clientWidth;
      docEl.style.fontSize = design / 10 + 'px';
      util.designWidth = isPortrait ? 1334 : 750; //设计稿宽度，横屏取1334px，竖屏取750px
      util.rem = 75; //基准rem
    }
  
    var tid = null;
    win.addEventListener('resize', function() {
      clearTimeout(tid);
      tid = setTimeout(refreshFontSize, 300);
    }, false);
  
    if (doc.readyState === 'complete') {
      doc.body.style.fontSize = fontBase * dpr + 'px';
    } else {
      doc.addEventListener('DOMContentLoaded', function(e) {
        doc.body.style.fontSize = fontBase * dpr + 'px';
      }, false);
    }
  
    refreshFontSize();
  
    util.dpr = dpr;
      
    util.rem2px = function(d) {
      var val = parseFloat(d) * util.rem;
      if (typeof d === 'string' && d.match(/rem$/)) {
        val += 'px';
      }
      return val;
    }
  
    util.px2rem = function(d) {
      var val = parseFloat(d) / util.rem;
      if (typeof d === 'string' && d.match(/px$/)) {
        val += 'rem';
      }
      return val;
    }
  })(window, (util = (window.util || {})));
  