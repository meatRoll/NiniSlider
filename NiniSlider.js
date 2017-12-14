/**
 * version: 1.0.0
 * author: meatroll
 * date: 2017.12.14
 */
(function(global, factory){
    "use strict";
    // amd标准
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
    var version = "1.0.0", 
        NiniSlider = function(option) {
            return NiniSlider.fn.init(option);
        };

    // 构造函数
    NiniSlider.fn = NiniSlider.prototype = {
        NiniSlider: version,
        constructor: NiniSlider,
        init: function(option) {

        }
    }

    // 初始化函数
    var init = NiniSlider.fn.init = function(option) {
        
    } 

    // 导出工厂函数
    return NiniSlider;
});