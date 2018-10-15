/*
 * VERSION: 1.0.0
 * RELEASE: 2018
 *
 * @author: Jiawei Zhou, leftscenery@gmail.com
 */

document.write("<script src='utils.js'></script>");
document.write("<link rel='stylesheet' href='qslide.css' type='text/css' media='screen'>");

~function () {
    let SlideShow = function SlideShow(options) {
        //default setting
        let _default = {
            pluginMode: 'image_only',
            targetClass: '',
            autoPlay:true,
            mode: 'scroll',
            scrollAnimation: 'smooth',
            stayTime: 2000,
            transTime: 600,
            stretchImg: true,
            lazyLoadURL: '',
            navDot: true,
            navDotControl: true,
            navDotControlMode: 'click',
            arrow: true,
            mousePause: true,
            imgLink: false,
            linkOpenNew: true,
            imgURL: [],
            linkURL: [],
            resize: false
        };
        //init data
        if (options !== undefined) {
            for (let key in _default) {
                if (options.hasOwnProperty(key)) {
                    this[key] = options[key];
                } else {
                    this[key] = _default[key];
                }
            }
        } else {
            for (let key in _default) {
                this[key] = _default[key];
            }
        }
        this.targetHolder = document.getElementsByClassName(this.targetClass)[0];
        this.imgHolder = null;
        this.dotHolder = null;
        this.arrows = this.targetHolder.getElementsByClassName('slide_js_arrow');
        this.holderHeight = $u(this.targetHolder).css('height');
        this.holderWidth = $u(this.targetHolder).css('width');
        this.leftArrow = null;
        this.rightArrow = null;
        this.imgs = null;
        this.imgInImgs = null;
        this.dots = null;
        this.step = 0;



        buildStructure(this);
        init(this);
        bindLink(this);

        //event delegates
        mousePauseAct(this);
        arrowTrans(this);
        dotTrans(this);
        resizeAct(this);
        mainTrans(this);
    };


    //--------------->Tools
    //lazy img + navgation + center
    function prepareSize(self) {
        for (let i = 0; i < self.imgs.length; i++) {

            $u(self.imgs[i]).css('width', self.holderWidth);
            $u(self.imgs[i]).css('height', self.holderHeight);

            //set scroll holder
            self.mode == 'scroll' ? $u(self.imgHolder).css({
                'width': self.holderWidth * (self.imgs.length),
                'height': self.holderHeight
            }) : $u(self.imgHolder).css({'width': self.holderWidth, 'height': self.holderHeight})
            $u(self.imgHolder).css('height', self.holderHeight);

            //nav dots position
            $u(self.dotHolder).css('marginLeft', -$u(self.dotHolder).css('width') / 2);
            $u(self.dotHolder).css('bottom', $u(self.holderHeight) >= 300 ? 15 : $u(self.holderHeight) / 30);

            if(self.pluginMode == 'custom'){
                continue;
            }

            //lazy img
            let img = new Image();
            img.src = self.imgInImgs[i].getAttribute('data-img');
            img.onload = () => {
                self.imgInImgs[i].setAttribute('src', img.src);
                //which side needs to be filled
                let temp = img.width / img.height - self.holderWidth / self.holderHeight;
                if (temp >= 0) {
                    //width
                    //scale?
                    self.imgInImgs[i].style.height = 'auto';
                    if (img.width < self.holderWidth) {
                        if (self.stretchImg) {
                            $u(self.imgInImgs[i]).css('width', self.holderWidth);
                        } else {
                            $u(self.imgInImgs[i]).css('width', img.width);
                        }
                    } else {
                        $u(self.imgInImgs[i]).css('width', self.holderWidth);
                    }
                } else if (temp < 0) {
                    //height
                    //scale?
                    self.imgInImgs[i].style.width = 'auto';
                    if (img.height - self.holderHeight < 0) {
                        if (self.stretchImg) {
                            $u(self.imgInImgs[i]).css('height', self.holderHeight);
                        } else {
                            $u(self.imgInImgs[i]).css('height', img.height);
                        }
                    } else {
                        $u(self.imgInImgs[i]).css('height', self.holderHeight);
                    }
                }

                //center
                if ((self.holderHeight - $u(self.imgInImgs[i]).css('height')) >= 0) {
                    $u(self.imgInImgs[i]).css('top', (self.holderHeight - $u(self.imgInImgs[i]).css('height')) / 2);
                }
                if ((self.holderWidth - $u(self.imgInImgs[i]).css('width')) >= 0) {
                    $u(self.imgInImgs[i]).css('left', (self.holderWidth - $u(self.imgInImgs[i]).css('width')) / 2);
                }

                img = null;
            };
        }
    }

    function changePage(self, targetStep, duration, callback) {
        let currentStep = self.step;
        switch (self.mode) {
            case 'scroll':
                //current last, click next
                if ((targetStep == self.imgs.length) && (currentStep == self.imgs.length-1)) {
                    self.dots[0].classList.remove('slide_js_dot_select');
                    $u(self.imgHolder).css('left', 0);
                    targetStep = 1;
                    self.dots[targetStep].classList.add('slide_js_dot_select');
                } else if (targetStep == -1 && currentStep == 0) {
                    //current first, next last
                    targetStep = self.imgs.length - 2;
                    $u(self.imgHolder).css('left', (self.imgs.length-1) * (-self.holderWidth));
                    self.dots[currentStep].classList.remove('slide_js_dot_select');
                    self.dots[targetStep].classList.add('slide_js_dot_select');
                } else if (targetStep == self.imgs.length-1) {
                    self.dots[self.imgs.length -2].classList.remove('slide_js_dot_select');
                    self.dots[0].classList.add('slide_js_dot_select');
                } else {
                    //normal
                    self.dots[currentStep].classList.remove('slide_js_dot_select');
                    self.dots[targetStep].classList.add('slide_js_dot_select');
                }
                switch (self.scrollAnimation) {
                    case 'smooth':
                        $u(self.imgHolder).animation({left: targetStep * (-self.holderWidth)}, duration, 1, callback);
                        break;
                    case 'linear':
                        $u(self.imgHolder).animation({left: targetStep * (-self.holderWidth)}, duration, 0, callback);
                        break;
                    default:
                        break;
                }
                self.step = targetStep;
                break;
            case 'trans':
                //current is last and next is first, jump to first
                if (currentStep == self.imgs.length - 1 && targetStep == self.imgs.length) {
                    targetStep = 0;
                }else if(targetStep == -1 && currentStep == 0){
                    //back from first
                    targetStep = self.imgs.length - 1;
                }
                $u(self.imgs[currentStep]).animation({opacity: 0}, duration);
                self.imgs[currentStep].style.zIndex = -1;
                self.dots[currentStep].classList.remove('slide_js_dot_select');
                self.dots[targetStep].classList.add('slide_js_dot_select');
                self.imgs[targetStep].style.zIndex = 1;
                $u(self.imgs[targetStep]).animation({opacity: 1}, duration, callback);
                self.step = targetStep;
                break;
            default:
                throw new Error('mode is not acceptable');
                break;
        }
    };



    //--------------->MAIN
    function buildStructure(self) {
        let str = '';
        let strDot = '';
        let tempStr = '';

        //check position
        $u(self.targetHolder).css('position') == 'static' ? $u(self.targetHolder).css('position', 'relative') : null;

        //bind
        self.targetHolder.classList.add('slide_js_outerHolder');

        tempStr = self.targetHolder.innerHTML;
        str = `
                   <div class="slide_js_arrow slide_js_arrowLeft"><</div>
                   <div class="slide_js_arrow slide_js_arrowRight">></div>
                   <div class="slide_js_imgHolder"></div>
                   <ul class="slide_js_dotHolder"></ul>
                  `;
        self.targetHolder.innerHTML = str;
        self.imgHolder = self.targetHolder.getElementsByClassName('slide_js_imgHolder')[0];
        self.dotHolder = self.targetHolder.getElementsByClassName('slide_js_dotHolder')[0];
        self.mode == 'scroll' ? self.imgHolder.classList.add('slide_js_imgHolder_scroll') : self.imgHolder.classList.add('slide_js_imgHolder_trans')
        self.leftArrow = self.targetHolder.getElementsByClassName('slide_js_arrowLeft')[0];
        self.rightArrow = self.targetHolder.getElementsByClassName('slide_js_arrowRight')[0];
        self.imgs = self.imgHolder.getElementsByClassName('slide_js_img');
        self.dots = self.dotHolder.getElementsByTagName('li');
        //get img tag in imgs div
        self.imgInImgs = self.imgHolder.getElementsByTagName('img');
        str = '';


        //deal content in each holder
        if(self.pluginMode == 'image_only'){
            //image mode, bind image and nav dots
            if (self.mode == 'scroll') {
                for (let i = 0; i < self.imgURL.length; i++) {
                    str += `
                    <div class="slide_js_img slide_js_img_scroll" style="background: url(${self.lazyLoadURL}) no-repeat center center"><img data-img="${self.imgURL[i]}" alt=""></div>
                `;
                    strDot += `
                    <li></li>
                `;
                }
                //scroll mode, add one to the last
                str += `<div class="slide_js_img slide_js_img_scroll"  style="background: url(${self.lazyLoadURL}) no-repeat center center"><img data-img="${self.imgURL[0]}" alt=""></div>`;
            } else if (self.mode == 'trans') {
                for (let i = 0; i < self.imgURL.length; i++) {
                    str += `
                    <div class="slide_js_img slide_js_img_trans"  style="background: url(${self.lazyLoadURL}) no-repeat center center"><img data-img="${self.imgURL[i]}" alt=""></div>
                `;
                    strDot += `
                    <li></li>
                `;
                }
            }
            self.imgHolder.innerHTML = str;
        }else if(self.pluginMode == 'custom'){
            //layout custom div
            self.imgHolder.innerHTML = tempStr;

            //add scroll mode class
            if (self.mode == 'scroll') {
                for (let i = 0; i < self.imgs.length; i++) {
                    self.imgs[i].classList.add('slide_js_img_scroll');
                    strDot += `<li></li>`;
                }
                //scroll mode, add one to the last
                self.imgHolder.innerHTML += self.imgs[0].outerHTML;
            }else if (self.mode == 'trans'){
                for (let i = 0; i < self.imgs.length; i++) {
                    self.imgs[i].classList.add('slide_js_img_trans');
                    strDot += `<li></li>`;
                }
            }
        }
        self.dotHolder.innerHTML = strDot;

        prepareSize(self);
    };

    //init
    function init(self) {
        //nav dot switch
        self.navDot == true ? $u(self.dotHolder).css('display', 'block') : $u(self.dotHolder).css('display', 'none');

        //arrow switch
        for (let i = 0; i < self.arrows.length; i++) {
            if (self.arrow == true) {
                $u(self.arrows[i]).css('display', 'block');
            } else {
                $u(self.arrows[i]).css('display', 'none');
            }
        }

        //init state
        self.dots[self.step].classList.add('slide_js_dot_select');
        if (self.mode == 'scroll') {
            //scroll part
        } else if (self.mode == 'trans') {
            //trans part
            $u(self.imgs[self.step]).css('opacity', 1);
        }
    };

    //bind img link
    function bindLink(self) {
        if (self.imgLink) {
            for (let i = 0; i < self.imgs.length; i++) {
                if (self.linkURL[i] == undefined) {
                    continue;
                }
                if (self.linkOpenNew) {
                    self.imgs[i].addEventListener('click', () => {
                        window.open(self.linkURL[i])
                    }, false)
                } else {
                    self.imgs[i].addEventListener('click', () => {
                        window.location.href = self.linkURL[i]
                    }, false)
                }
            }
        }
    };

    //Main Trans Start
    function mainTrans(self) {
        if(self.autoPlay){
            if (self.mode == 'scroll') {
                self.timer = setInterval(() => {
                    changePage(self, (self.step + 1), self.transTime);
                }, self.stayTime + self.transTime);
            } else if (self.mode == 'trans') {
                self.timer = setInterval(() => {
                    changePage(self, (self.step + 1), self.transTime);
                }, self.stayTime + self.transTime);
            }
        }
    };

    //bind mouse hover
    function mousePauseAct(self) {
        if (self.mousePause) {
            self.targetHolder.addEventListener('mouseover', (e) => {
                e.target = e.target || e.srcElement;
                clearInterval(self.timer);
            }, false);
            self.targetHolder.addEventListener('mouseout', (e) => {
                e.target = e.target || e.srcElement;
                mainTrans(self)
            }, false);
        }
    };

    //bind nav arrow event
    function arrowTrans(self) {
        clearInterval(self.timer);
        if (self.arrow) {
            if (self.mode == 'scroll') {
                self.targetHolder.addEventListener('click', (e) => {
                    e.target = e.target || e.srcElement;
                    if (e.target === self.leftArrow) {
                        changePage(self, (self.step - 1), self.transTime, self.mousePause ? null:mainTrans(self));
                    } else if (e.target === self.rightArrow) {
                        changePage(self, (self.step + 1), self.transTime, self.mousePause ? null:mainTrans(self));
                    }
                }, false)
            } else if (self.mode == 'trans') {
                self.targetHolder.addEventListener('click', (e) => {
                    e.target = e.target || e.srcElement;
                    if (e.target === self.leftArrow) {
                        changePage(self, (self.step - 1), self.transTime, self.mousePause ? null:mainTrans(self));
                    } else if (e.target === self.rightArrow) {
                        changePage(self, (self.step + 1), self.transTime, self.mousePause ? null:mainTrans(self));
                    }
                }, false)
            }
        }
    };

    //bottom navigation
    function dotTrans(self) {
        if (self.navDotControl) {
            if (self.navDotControlMode == 'click') {
                for (let i = 0; i < self.dots.length; i++) {
                    self.dots[i].addEventListener('click', (e) => {
                        e.preventDefault();
                        if (self.mode == 'scroll') {
                            changePage(self, i, self.transTime/2);
                        } else if (self.mode == 'trans') {
                            changePage(self, i, self.transTime/2);
                        }
                    }, false);
                }
            } else if (self.navDotControlMode == 'hover') {
                for (let i = 0; i < self.dots.length; i++) {
                    self.dots[i].addEventListener('mouseenter', () => {
                        if (self.mode == 'scroll') {
                            changePage(self, i, self.transTime/2);
                        } else if (self.mode == 'trans') {
                            changePage(self, i, self.transTime/2);
                        }
                    }, false);
                }
            }
        }
    };

    //auto resize
    function resizeAct(self) {
        if (self.resize) {
            window.addEventListener('resize', () => {
                console.log('here');
                clearInterval(self.timer);

                self.holderHeight = $u(self.targetHolder).css('height');
                self.holderWidth = $u(self.targetHolder).css('width');
                prepareSize(self);

                //reset
                changePage(self, self.step, 30);

                mainTrans(self);
            }, false)
        }
    };


    //prototype
    SlideShow.prototype = {
        constructor: SlideShow,
    };

    //export
    window.SlideShow = SlideShow;
}();