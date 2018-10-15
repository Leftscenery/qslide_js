/*
使用说明
$u.win(attr)
$u.getByClass(className)
$u.getRandom(min,max)

$u(content).toJSON()
$u(element).toArray()
$u(element).offsetToLeft()
$u(element).offsetToTop()

$u(element).getCss(attr)
$u(element).setCss(attr, value)
$u(element).setGroupCss({attr: value, attr: value, attr: value})
$u(element).css(...)        //get + set + setGroup

$u(element).getIndex()
$u(element).siblings()
$u(element).prevSiblings()
$u(element).nextSiblings()
$u(element).firstSibling()
$u(element).lastSibling()
$u(element).allChildren()

$u(element).hasClass(className);
$u(element).addClass(className);
$u(element).removeClass(className);
$u(element).toggleClass(className);

$u(element).animation(target, duration, effect, callBack);

$.makePlan();
    .add(fn)
    .remove(fn)
    .check()
    .fire(arg1,arg2,arg3)

//同步only
$.ajax({
        url: xxx,
        method: 'post',
        async: true,
        success: function(){...},
        returnObject: true
        });
*/

~function () {
    var Utils = function(ele){
        return new Utils.init(ele)
    };


    Utils.init = function(ele,context){
        this.ele = ele;
    };


    Utils.init.prototype = Utils.prototype = {
        constructor: Utils,
        copyright: 'zf_JiaweiZhou',
        time: 'create 2018-07-28',

        //-----------------------------------------------> CSS
        getCss: function getCss(attr) {
            let val = null;
            let reg = null;
            let curEle = this.ele;
            if ("getComputedStyle" in window) {
                val = window.getComputedStyle(curEle)[attr];//
            } else {
                if (attr === "opacity") {
                    val = curEle.currentStyle["filter"];//alpha(opacity=50)
                    reg = /^alpha\(opacity=((?:\d|(?:[1-9]\d+))(?:\.\d+)?)\)$/;
                    var temp = reg.exec(val)[1];
                    val = temp ? temp / 100 : 1;
                    val = parseFloat(val);
                } else {
                    val = curEle.currentStyle[attr];
                }
            }
            ;
            let reg1 = /^([+-]?(\d|[1-9]\d+)(\.\d+)?)(px|pt|rem|em)?$/;
            val = reg1.test(val) ? parseFloat(val) : val;
            return val;
        },

        setCss: function setCss(attr, value) {
            let curEle = this.ele;
            if (attr === "opacity") {
                curEle.style["opacity"] = value;
                curEle.style["filter"] = "alpha(opacity=" + value * 100 + ")";
            }
            ;
            if (attr === "float") {
                curEle.style["cssFloat"] = value;
                curEle.style["styleFloat"] = value;
            }
            let reg = /^width|height|top|left|bottom|right|((margin|padding)(Top|Bottom|Left|Right)?)$/;
            if (reg.test(attr)) {
                if (!isNaN(value)) {
                    value += "px";
                }
            }
            curEle.style[attr] = value;
        },

        setGroupCss: function setGroupCss(options) {
            for (var attr in options) {
                this.setCss(attr, options[attr])
            }
        },

        css: function css() {
            var len = arguments.length,
                attr = null,
                value = null,
                options = null;
            if (len === 2) {
                attr = arguments[0];
                value = arguments[1];
                this.setCss(attr, value);
                return;
            }
            if (len === 1 && typeof arguments[0] === "object") {
                options = arguments[0];
                this.setGroupCss(options)
                return;
            }
            attr = arguments[0];
            return this.getCss(attr);
        },

        //animation effect
        animation: function animation(target, duration, effect, callBack) {
            // default animation
            let tempEffect = Utils.aniEffect.Linear;
            let curEle = this.ele;
            if (typeof effect === "number") {
                switch (effect) {
                    case 0:
                        tempEffect = Utils.aniEffect.Linear;
                        break;
                    case 1:
                        tempEffect = Utils.aniEffect.Quad.easeInOut;
                        break;
                    case 2:
                        tempEffect = Utils.aniEffect.Bounce.easeIn;
                        break;
                    case 3:
                        tempEffect = Utils.aniEffect.Cubic.easeInOut;
                        break;
                }
            } else if (effect instanceof Array) {
                tempEffect = effect.length === 2 ? Utils.aniEffect[effect[0]][effect[1]] : Utils.aniEffect[effect[0]];
            } else if (typeof effect === "function") {
                callBack = effect;
            }
            curEle.aniTimer ? clearInterval(curEle.aniTimer) : null;

            let begin = {};
            let change = {};
            for (let key in target) {
                if (target.hasOwnProperty(key)) {
                    begin[key] = this.css(key);

                    change[key] = target[key] - begin[key]
                }
            }


            let time = null;
            let that = this;
            curEle.aniTimer = setInterval(function () {
                time += 17;
                if (time >= duration) {
                    that.css(target);
                    clearInterval(curEle.aniTimer);
                    typeof callBack === "function" ? callBack.call(curEle) : null;
                    return;
                }
                for (let key in target) {
                    if (target.hasOwnProperty(key)) {
                        let curPos = tempEffect(time, begin[key], change[key], duration);
                        that.css(key, curPos);
                    }
                }
            }, 17);
        },
    };

    //-------------------------------------------------->Other tools
    //animation
    Utils.aniEffect = {
        Linear: function (t, b, c, d) {
            return t/d * c + b;
        },
        Bounce: {
            easeIn: function(t, b, c, d) {
                return c - Utils.aniEffect.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function(t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function(t, b, c, d) {
                if (t < d / 2) {
                    return Utils.aniEffect.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                }
                return Utils.aniEffect.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        },
        Quad: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut: function(t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t + b;
                }
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        Cubic: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        Quart: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function(t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t + b;
                }
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        Quint: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        Sine: {
            easeIn: function(t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function(t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function(t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        Expo: {
            easeIn: function(t, b, c, d) {
                return (t == 0)
                    ? b
                    : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function(t, b, c, d) {
                return (t == d)
                    ? b + c
                    : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if (t == 0)
                    return b;
                if (t == d)
                    return b + c;
                if ((t /= d / 2) < 1)
                    return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        Circ: {
            easeIn: function(t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function(t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                }
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        Back: {
            easeIn: function(t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function(t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function(t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                if ((t /= d / 2) < 1) {
                    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                }
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        Elastic: {
            easeIn: function(t, b, c, d, a, p) {
                if (t == 0)
                    return b;
                if ((t /= d) == 1)
                    return b + c;
                if (!p)
                    p = d * .3;
                var s;
                !a || a < Math.abs(c)
                    ? (a = c, s = p / 4)
                    : s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut: function(t, b, c, d, a, p) {
                if (t == 0)
                    return b;
                if ((t /= d) == 1)
                    return b + c;
                if (!p)
                    p = d * .3;
                var s;
                !a || a < Math.abs(c)
                    ? (a = c, s = p / 4)
                    : s = p / (2 * Math.PI) * Math.asin(c / a);
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut: function(t, b, c, d, a, p) {
                if (t == 0)
                    return b;
                if ((t /= d / 2) == 2)
                    return b + c;
                if (!p)
                    p = d * (.3 * 1.5);
                var s;
                !a || a < Math.abs(c)
                    ? (a = c, s = p / 4)
                    : s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1)
                    return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        }
    };

    //export
    window._Qslide = Utils;
}();