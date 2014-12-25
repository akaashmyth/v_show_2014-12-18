function wapSilder(opts){
    //构造函数需要的参数
    this.wrap  = opts.dom;
    this.list  = opts.imgList;
    this.load  = opts.loading;
    this.music = opts.music;
    this.init();
}
wapSilder.prototype.init = function (fn){
    var _this = this,
        count = 0,
        len   = this.list.length,
        oImg  = new Image();
    for(var i = 0; i < len;i++){
        count ++;
        oImg.src = this.list[i]["src"];
        oImg.onload = function (){
            if(count == len){
                var oLoad = document.getElementById(_this.load);
                setTimeout(function (){
                   oLoad.style.display = "none";     
                },3000);
                if(_this.music){
                    _this.musicDom = document.createElement("div");
                    document.body.appendChild(_this.musicDom);
                    _this.musicDom.innerHTML='<audio id="audio" src="'+_this.music+'" preload="auto" controls="controls" loop="true" hidden="true"></audio>';
                }
                _this.renderDOM();
                _this.bindDOM();
            };
        };
    }
    this.wrapWidth = document.documentElement.clientWidth;
    this.wrapHeight = document.documentElement.clientHeight;
    this.idx = 0;
};
wapSilder.prototype.renderDOM = function (){
    var wrap = this.wrap,
        imgData = this.list;
    this.outer = document.createElement("ul");
    for(var i=0;i<imgData.length;i++){
        var ele = document.createElement("li");
        ele.style.webkitTransform = "translate3d(0 ,"+ i*this.wrapHeight +"px, 0)";
        ele.innerHTML = "<span style='background-image:url(" + imgData[i]["src"] +")'></span>";
        this.outer.appendChild(ele);
    }
    this.wrap.appendChild(this.outer);
};
wapSilder.prototype.bindDOM = function (){
    var _this = this,
        outer = _this.outer,
        len   = _this.length,
        Eli = outer.getElementsByTagName("li");
    function startHandler(event){
        _this.startY = event.touches[0].pageY;
        _this.Y = 0;
    }
    function moveHandler(event){
        //兼容chrome android，阻止浏览器默认行为
        event.preventDefault();
        _this.Y = event.touches[0].pageY - _this.startY;
        var start  = _this.idx-1,
            last   = _this.idx+2;
        for(start; start < last; start++){
            // document.getElementById("a").innerHTML = _this.wrapHeight+"----"+_this.wrapWidth;
            Eli[start] && (Eli[start].style.webkitTransition = '-webkit-transform 0s ease-out');
            Eli[start] && (Eli[start].style.webkitTransform = "translate3d(0, "+ (((start-_this.idx)*_this.wrapHeight)+_this.Y) +"px, 0)");
        };
    }
    function endHandler (event){
        event.preventDefault();
        var boundary = _this.wrapHeight/8;
        if(_this.Y >= boundary){
            _this.goto(-1);
        }else if(_this.Y < 0 && _this.Y < -boundary){
            _this.goto(1);
        }else{
            _this.goto(0);
        }
    }
    outer.addEventListener("touchstart", startHandler);
    outer.addEventListener("touchmove", moveHandler);
    outer.addEventListener("touchend", endHandler);
    Eli[0].addEventListener("touchstart", function (){
        if(_this.musicDom){
            _this.musicDom.getElementsByTagName("audio")[0].play();
        }
    });
};
wapSilder.prototype.goto = function (num){
    var   outer = this.outer,
          idx   = this.idx,
                  nIdx,
          Eli   = outer.getElementsByTagName("li"),
          len = Eli.length;
    nIdx = idx + num*1;
    //当索引右超出
    if(nIdx > len-1){
      nIdx = len - 1;
    //当索引左超出  
    }else if(nIdx < 0){
      nIdx = 0;
    }

    //保留当前索引值
    this.idx = nIdx;
    Eli[nIdx] && (Eli[nIdx].style.webkitTransition = "-webkit-transform 0.2s ease-out");
    Eli[nIdx-1] && (Eli[nIdx-1].style.webkitTransition = "-webkit-transform 0.2s ease-out");
    Eli[nIdx+1] && (Eli[nIdx+1].style.webkitTransition = "-webkit-transform 0.2s ease-out");
    Eli[nIdx] && (Eli[nIdx].style.webkitTransform = "translate3d(0, 0, 0)");
    Eli[nIdx-1] && (Eli[nIdx-1].style.webkitTransform = "translate3d(0, "+ (-this.wrapHeight) +"px, 0)");
    Eli[nIdx+1] && (Eli[nIdx+1].style.webkitTransform = "translate3d(0, "+ (this.wrapHeight) +"px, 0)");
};