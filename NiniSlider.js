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
    , movingLeftTime
    , moveTime = 5
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
        moveTime: 700
        , switchTime: 1000
        , defaultIndex: 0
        , direction: "right"
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
        slider.width =  NiniSlider.css(el, "width");
        sliderWidth = window.parseFloat(slider.width);
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
        slidersContainer = slider.slidersContainer = document.getElementById(id + "SlidersContainer");
        NiniSlider.css(slidersContainer, { width: sliderWidth * (data.length + 2) + "px", "margin-left": "-" + sliderWidth * (opts.defaultIndex + 1) + "px"});
        singleSilders = slidersContainer.getElementsByTagName("li");
        slider.sliders = Array.prototype.concat.apply([],singleSilders).slice(1, singleSilders.length - 1);
        NiniSlider.each(singleSilders, function(value){
            NiniSlider.css(value, {width: sliderWidth + "px"});
        });
        styleText = "#" + id + " div,#" + id + " ul,#" + id + " li,#" + id + " img{box-sizing:border-box;padding: 0;margin: 0;}#" + id + " ul{margin:0;padding:0;}#" + id + "{overflow:hidden;position:relative;}#" + id + " .clearfix{zoom:1;}#" + id + " .clearfix::after{content:\"\";display:table;clear:both;}#" + id + " .sliders-container{height:100%;}#" + id + " ul>li{height:100%;float:left;list-style:none;}#" + id + " .pagination-container>li+li{margin-left:10px}#" + id + " .pagination{width:100%;position:absolute;left:0;bottom:5%;}#" + id + " .pagination-container{margin:0 auto;}#" + id + " .dot{width:16px;height:16px;float:left;border-radius:50%;background-color:white;cursor:pointer;}#" + id + " .currentIndexDot{background-color:red}";
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
        dots = slider.dots = dotsContainer.getElementsByTagName("li");
        NiniSlider.addClass(dots[opts.defaultIndex], ["currentIndexDot"]);
        NiniSlider.each(dots, function(value) {
            dotsContainerWidth += parseFloat(NiniSlider.css(value,"width")) + parseFloat(NiniSlider.css(value, "margin-left"));
        });
        NiniSlider.css(dotsContainer, {"width": dotsContainerWidth + "px"});
        // 给slider绑定方法
        NiniSlider.extend(slider, {
            // 移动动画（只做简单的匀速运动）
            animate: function(time, index, callback) {
                clearInterval(moveClocker);
                NiniSlider.removeClass(slider.dots[slider.previousIndex], ["currentIndexDot"]);
                NiniSlider.addClass(slider.dots[index], ["currentIndexDot"]);
                movingLeftTime = time;
                var container = slider.slidersContainer,
                    count = slider.sliders.length,
                    width = parseFloat(slider.width),
                    targetLocation = -width * (index + 1),
                    currentLocation = parseFloat(NiniSlider.css(this.slidersContainer, "margin-left"));
                var leftDis, rightDis, direction, distance, nextLocation
                    , speed = 0;
                if (targetLocation !== currentLocation) {
                    if (targetLocation < currentLocation) {
                        leftDis = Math.abs(currentLocation - (-400)) + Math.abs(-width * count - targetLocation);
                        rightDis = Math.abs(targetLocation - currentLocation);
                    } else if (targetLocation > currentLocation) {
                        leftDis = Math.abs(currentLocation - targetLocation);
                        rightDis = Math.abs(targetLocation - (-400)) + Math.abs(-width * count - currentLocation);
                    }
                    if (leftDis > rightDis) {
                        direction = "right";
                        distance = rightDis;
                    } else if (leftDis < rightDis) {
                        direction = "left";
                        distance = leftDis;
                    } else {
                        direction = slider.direction;
                        distance = rightDis;
                    }
                    speed = distance / (time / moveTime);
                    speed = direction === "right"? -speed: speed;
                }
                moveClocker = setInterval(function(){
                    var positiveSpeed = Math.abs(speed);
                    currentLocation = currentLocation + speed;
                    NiniSlider.css(container, {"margin-left": currentLocation + "px"});
                    if (direction === "left" && (currentLocation + width) < positiveSpeed) {
                        NiniSlider.css(container, {"margin-left": -width * (count + 1) + "px"});
                    } else if (direction === "right" && (currentLocation + width * count) < positiveSpeed) {
                        NiniSlider.css(container, {"margin-left": 0});
                    }
                    if (currentLocation - targetLocation < positiveSpeed){
                        clearInterval(moveClocker);
                    }
                    movingLeftTime -= moveTime;
                    if (callback && movingLeftTime < moveTime) {
                        callback(index);
                    }
                }, moveTime);
            },
            // 开始轮播
            startCarousel: function() {
                if(opts.switchTime >= opts.moveTime) {
                    switchClocker = setInterval(function(){
                        slider.previousIndex = slider.currentIndex;
                        if (slider.direction === "right") {
                            slider.currentIndex === slider.sliders.length - 1? slider.currentIndex = -1: void(0);
                        } else {
                            slider.currentIndex === 0? slider.currentIndex = slider.sliders.length: void(0);
                        }
                        slider.animate(opts.moveTime, slider.direction === "right"? ++slider.currentIndex: --slider.currentIndex);
                    }, opts.switchTime);
                } else {
                    throw new Error("存在错误：\nswitchTime为" + opts.switchTime + "；\nmoveTime为" + opts.moveTime);
                }
            },
            stopCarousel: function() {
                clearInterval(switchClocker);
                clearInterval(moveClocker);
            }
        });
        // 窗口失去焦点
        NiniSlider.on(window, "blur", slider.stopCarousel);
        // 窗口得到焦点
        NiniSlider.on(window, "focus", function() {
            clearInterval(switchClocker);
            if (movingLeftTime >= moveTime) {
                slider.animate(movingLeftTime, slider.currentIndex, slider.startCarousel);
            } else {
                slider.startCarousel();
            }
        });
        // 给导航的小点绑定事件
        NiniSlider.on(dotsContainer, "click", dots, function(index) {
            if(index !== slider.currentIndex) {
                slider.stopCarousel();
                slider.previousIndex = slider.currentIndex;
                slider.currentIndex = index;
                slider.animate(opts.moveTime, index, slider.startCarousel);
            }
        });
        // 进行行为的初始化
        slider.currentIndex = slider.defaultIndex = opts.defaultIndex;
        slider.previousIndex = undefined;
        slider.direction = opts.direction;
        slider.startCarousel();
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
                callback.call(target, target[i], i);
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
        // 增加类名
        addClass: function(target, classNameArr) {
            if(!(classNameArr instanceof Array)) {
                throw new Error("传入的必须为数组");
            }
            var oldClassNameArr = target.className.split(" "),
                newClassNameArr = oldClassNameArr.concat(classNameArr);
            target.className = newClassNameArr.join(" ");
        },
        // 删除类名
        removeClass: function(target, classNameArr) {
            if(!(classNameArr instanceof Array)) {
                throw new Error("传入的必须为数组");
            }
            var newClassNameArr = target.className.split(" "),
                i = newClassNameArr.length - 1,
                j = 0,
                length = classNameArr.length;
            for(; i >= 0; i--){
                for(; j < length; j++) {
                    if (newClassNameArr[i] === classNameArr[j]) {
                        newClassNameArr.splice(i, 1);
                        break;
                    }
                }
            }
            target.className = newClassNameArr.join(" ");
        },
        // 绑定事件兼容
        on: function(target, type) {
            var callback, delegator, callbackFn;
            if(arguments.length === 3) {
                callback = arguments[2];
            } else {
                callback = arguments[3];
                delegator = arguments[2];
            }
            callbackFn = function(event) {
                var eventElem
                    , length
                    , i = 0;
                event = event || window.event;
                if (delegator) {
                    eventElem = event.target || event.srcElement;
                    if (delegator && delegator.length) {
                        length = delegator.length;
                        for(; i < length; i++) {
                            if (delegator[i] === eventElem) {
                                callback.call(event, i, delegator[i], event);
                            }
                        }
                    } else {
                        if (delegator === eventElem) {
                            callback.call(event, delegator, event);
                        }
                    }
                } else {
                    callback.call(event, event);
                }
            };
            if (document.addEventListener) {
                target.addEventListener(type, callbackFn, false);
            } else {
                target.attachEvent("on" + type, callbackFn);
            }
        }
    });

    // 导出工厂函数
    return NiniSlider;
});