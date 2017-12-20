/**
 * version: 1.0.0
 * author: meatroll
 * date: 2017.12.14
 */
(function(global, factory){
    "use strict";
    // amd规范
    if ( typeof define === "function" && define.amd ) {
        define( "NiniSlider", [], function() {
            return factory(global);
        } );
    } 
    // commonJS
    else if ( typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(global);
    }
    // 全局输出
    else {
        global.NiniSlider = factory(global);
    }
})(typeof window !== "undefined"? window: this, function(window){
    "use strict";

    // 检测是否存在document
    if(!window.document) {
        throw new Error("当前环境中不存在document");
    }

    // 默认参数和工厂函数
    var version = "1.0.0"
    , document = window.document
    , slider
    , switchClocker
    , moveClocker
    , NiniSlider = function(options) {
        var i = 0
        , optName
        , optNameArr = ["id", "data"];
        // 对传入的值做预先的检查
        NiniSlider.each(optNameArr, function(value){
            if(!options[value]) {
                throw new Error("参数" + value + "的值不能为" + options[value]);
            }
        })
        return new NiniSlider.fn.init(options);
    };

    // 构造函数
    NiniSlider.fn = NiniSlider.prototype = {
        NiniSlider: version
        , constructor: NiniSlider
    }

    var opts = { 
        moveTime: 500,
        switchTime: 1000
    }
    // 初始化函数
    , init = NiniSlider.fn.init = function(options) {
        var el
        , id
        , data
        , dots
        , dotsContainer
        , dotsContainerWidth = 0
        , styleTag
        , sliderWidth
        , slidersContainer
        , singleSilders
        , picHtml = ""
        , dotHtml = ""
        , insertHtml = ""
        , styleText = "";
        slider = this;
        // 将传入选项与默认选项混合
        NiniSlider.extend(opts, options);
        id = opts.id;
        data = opts.data;
        el = slider.el = document.getElementById(id);
        sliderWidth = slider.width = NiniSlider.css(el, "width");
        slider.height = NiniSlider.css(el, "height");
        // 添加dom结构
        NiniSlider.each(data, function(value, index) {
            var lastIndex = this.length - 1;
            if(index === 0) {
                picHtml +=  "<li><img src=\"" + (this[lastIndex].src?this[lastIndex].src:"") + "\" alt=\"\"></li>";
            }
            picHtml +=  "<li><img src=\"" + (value.src?value.src:"") + "\" alt=\"\"></li>";
            if(index === lastIndex) {
                picHtml += "<li><img src=\"" + (this[0].src?this[0].src:"") + "\" alt=\"\"></li>";
            }
            dotHtml +=  "<li class=\"dot\"></li>";
        });
        insertHtml = "<ul class=\"sliders-container clearfix\" id=\"" + id + "SlidersContainer\">" + picHtml + "</ul>"
                   + "<div class=\"pagination\" id=\"" + id + "Pagination\"><ul class=\"pagination-container clearfix\" id=\"" + id + "PaginationContainer\">" + dotHtml + "</ul></div>";
        el.innerHTML = insertHtml;
        // 调整样式
        slidersContainer = document.getElementById(id + "SlidersContainer");
        NiniSlider.css(slidersContainer, { width: sliderWidth.replace("px", "") * (data.length + 2) + "px", "margin-left": "-" + sliderWidth});
        singleSilders = slidersContainer.getElementsByTagName("li");
        NiniSlider.each(singleSilders, function(value){
            NiniSlider.css(value, {width: sliderWidth.replace("px", "") + "px"});
        });
        styleText = "#" + id + " div,#" + id + " ul,#" + id + " li,#" + id + " img{box-sizing:border-box;padding: 0;margin: 0;}#" + id + " ul{margin:0;padding:0;}#" + id + "{overflow:hidden;position:relative;}#" + id + " .clearfix{zoom:1;}#" + id + " .clearfix::after{content:\"\";display:table;clear:both;}#" + id + " .sliders-container{height:100%;}#" + id + " ul>li{height:100%;float:left;list-style:none;}#" + id + " .pagination-container>li+li{margin-left:10px}#" + id + " .pagination{width:100%;position:absolute;left:0;bottom:5%;}#" + id + " .pagination-container{margin:0 auto;}#" + id + " .dot{width:16px;height:16px;float:left;border-radius:50%;background-color:red;cursor:pointer;}";
        styleTag = document.createElement("style");
        // IE8兼容写法
        if ('styleSheet' in styleTag) {
            styleTag.setAttribute('type', 'text/css');
            styleTag.styleSheet.cssText = styleText;
        } else {
            styleTag.innerHTML = styleText;
        }
        document.getElementsByTagName("head")[0].appendChild(styleTag);
        dotsContainer = document.getElementById(id + "PaginationContainer");
        dots = dotsContainer.getElementsByTagName("li");
        NiniSlider.each(dots, function(value) {
            dotsContainerWidth += parseFloat(NiniSlider.css(value,"width")) + parseFloat(NiniSlider.css(value, "margin-left"));
        });
        NiniSlider.css(dotsContainer, {"width": dotsContainerWidth + "px"});
        // 绑定方法
        bindMethods();
        // 进行行为的初始化
        if(opts.switchTime >= opts.moveTime) {
            switchClocker = setInterval(function(){
                animate(opts.switchTime);
            }, opts.switchTime);
        } else {
            throw new Error("切换时间为");
        }
    } 

    // 初始化完成后在slider上面绑定方法
    function bindMethods() {
        NiniSlider.extend(slider, {
            animate: function(time) {
                moveClocker = setInterval(function(){
                    
                }, time);
            }
        });
    }

    // 扩展函数(只提供浅拷贝)
    NiniSlider.extend = function() {
        var target = arguments[0]
        , i = 1
        , length = arguments.length
        , name
        , copy;
        if(typeof target !== "function" && typeof target !== "object" || !target){
            throw new Error("传入目标类型错误，不能为" + target);
        }
        for(;i < length; i++) {
            copy = arguments[i];
            if(typeof copy !== "object" || !copy){
                throw new Error("拷贝目标类型错误，不能为" + copy + "。\n位置为第" + i + "个参数。");
            }
            for(name in arguments[i]){
                target[name] = copy[name];
            }
        }
    }

    // 增加方法
    NiniSlider.extend(NiniSlider, {
        // 遍历
        each: function(target, callback) {
            if(!(target instanceof Array) && typeof target !== "object" || !target){
                throw new Error("传入目标类型错误，不能为" + target);
            }
            var i = 0
            , length = target.length;
            if(typeof length === "undefined") {
                throw new Error("传入的对象必须是伪数组");
            }
            for(; i < length; i++){
                callback.bind(target, target[i], i)();
            }
        },
        // 获取样式与赋予样式
        css: function(target, obj) {
            if(typeof obj === "string") {
                var style = window.getComputedStyle && window.getComputedStyle(target) || target.currentStyle;
                return style[obj];
            }
            for(var style in obj) {
                target.style[style] = obj[style];
            }
        },
        //获取文本与赋予文本
        // text: function(target, text) {
        //     if(arguments.length === 1) {
        //         return target.textContent? target.textContent: target.innerText;
        //     }
        //     if(arguments.length > 1) {
        //         target.textContent? target.textContent = text: target.innerText = text;
        //     }
        // }
    });

    // 导出工厂函数
    return NiniSlider;
});