/*
 Movy.JS
 Version 1.0.0 (05.03.2013)

 Author : Ilker Guller (http://ilkerguller.com)

 Description: Users can control your website with their mouse move (or touch move) now! Use preset moves or create your move. This plugin works on IE8+, Chrome, Firefox, Safari and also on safari mobile and android mobile.
 Details: https://github.com/Sly777/MovyJS
 */

(function($){

    var defOptions = {
        pixelLimit: 30,
        moveType: "shake",
        customMoveType: [],
        onComplete: function (){},
        onEveryTick: function (){},
        onAfterStart: function (){}
    };

    $.movyjs = function(el, options){
        var base = this;
        base.el = el;
        base.$el = $(el);

        base.mousex = 0;
        base.mousey = 0;

        var status = "none",
            mouseMoveCount = 0;

        var resetCount = function (){
            status = "none";
            mouseMoveCount = 0;
            base.mousex = 0;
            base.mousey = 0;
        };

        base.moveList = {
            topright: function(x, y) {
                return x > base.mousex + base.options.pixelLimit && y < base.mousey - base.options.pixelLimit;
            },
            bottomright: function(x, y) {
                return x > base.mousex + base.options.pixelLimit && y > base.mousey + base.options.pixelLimit;
            },
            topleft: function(x, y) {
                return x < base.mousex + base.options.pixelLimit && y < base.mousey - base.options.pixelLimit;
            },
            bottomleft: function(x, y) {
                return x < base.mousex + base.options.pixelLimit && y > base.mousey + base.options.pixelLimit;
            },
            right: function(x, y) {
                return x > base.mousex + base.options.pixelLimit;
            },
            left: function(x, y) {
                return x < base.mousex - base.options.pixelLimit;
            },
            top: function(x, y) {
                return y < base.mousey - base.options.pixelLimit;
            },
            bottom: function(x, y) {
                return y > base.mousey + base.options.pixelLimit;
            }
        };

        base.moveCombos = {
            shake: ["left", "right", "left", "right", "left"],
            triangle: ["topright", "bottomright", "left"],
            square: ["right", "bottom", "left", "top"]
        };

        var attachEvent = function (){
            base.$el.on({
                mousedown : function (e){
                    base.mousex = e.pageX;
                    base.mousey = e.pageY;
                    status = "working";

                    base.options.onAfterStart(e);
                },
                mousemove: function (e){
                    if (status === "working") {
                        moveEvent(base.options.moveType.toLowerCase(), e.pageX, e.pageY);
                    }
                },
                mouseup: function (e) {
                    resetCount();
                },
                touchstart: function (e){
                    e.preventDefault();
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    base.mousex = touch.pageX;
                    base.mousey = touch.pageY;
                    status = "working";

                    base.options.onAfterStart(e);
                },
                touchmove: function (e){
                    e.preventDefault();
                    if (status === "working") {
                        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
                            x = touch.pageX,
                            y = touch.pageY;

                        moveEvent(base.options.moveType.toLowerCase(), x, y);
                    }
                },
                touchend: function (e){
                    resetCount();
                }
            });
        };

        var moveEvent = function (type, x, y){
            if(x <= 0 || y <= 0 || x >= window.outerWidth - 30 || y >= window.outerHeight - 30) {
                resetCount();
                return;
            }

            if(base.moveCombos[type].length > mouseMoveCount) {
                var _mcom = base.moveCombos[type],
                    _mtyp = _mcom[mouseMoveCount].toLowerCase(),
                    _mfun = base.moveList[_mtyp];

                if(_mfun(x, y)) {
                    mouseMoveCount++;
                    base.mousex = x;
                    base.mousey = y;

                    base.options.onEveryTick(mouseMoveCount);
                }

                if(base.moveCombos[type].length === mouseMoveCount)
                {
                    base.options.onComplete();
                }
            }
        };

        base.init = function (){
            base.options = $.extend({}, $.movyjs.defaultOptions, options);

            if (base.options.moveType.toLowerCase() === "custom") {
                if (base.options.customMoveType.length <= 0) {
                    alert("If you select custom move type, you must add custom moves to CustomMoveType options.");
                    return;
                } else {
                    base.moveCombos["custom"] = base.options.customMoveType;
                }
            }

            attachEvent();
        };

        base.init();
    };

    $.movyjs.defaultOptions = defOptions;

    $.fn.movyjs = function(options){
        return this.each(function(){
            (new $.movyjs(this, options));
        });
    };

})(jQuery);