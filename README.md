Qslide_js
---

<br/>

Qslide is a javascript plugin can build a slide show quickly with bunch of custom setting. Not only support image but also support custom block.


---

#### Key Feature
+ Quick setup
+ Support both image-only and custom block as content
+ Lots of custom settings
+ Opacity and scroll transition mode with smooth animation.

<br/>

---

#### Quick Start
>**Set holder in HTML**
>```javascript
><div class="slide1"></div>
>```

<bt>

>**Set Slideshow**
>```javascript
>new SlideShow({
>        targetClass:'slide1',           // slide show holder class
>        imgURL:[ imgURL1, imgURL2],     // images url arr
>        mode: 'scroll',                 // transition mode   
>        resize:true,                    // re-render when browser resize
>        lazyLoadURL:'url',              // loading image for lazy load
>    });
>```

<br/>

---

#### Image-only mode
Image-only mode is the classic mode of slide show, use image for each page.

<br/>

---

#### Custom content mode
Custom mode support custom div as each page.<br>
```javascript
<div class="yourClassName">
    <div class="slide_js_img">
        ...content block here...
    </div>
    <div class="slide_js_img">
        ...content block here...
    </div>
    <div class="slide_js_img">
        ...content block here...
    </div>
</div>
```


<br/>

---

#### Full Options
+ **pluginMode**
    + 'image_only' (default): only can use image as each page
    + 'custom': use custom block for each page
+ **targetClass**: only effect on the first child in class array
    + ''    (default)
+ **autoPlay**: slide show autoplay
    + true  (default)
+ **mode**: slide show transition mode
    + 'scroll'  (default)
    + 'trans'
+ **scrollAnimation**: for transition ease
    + 'smooth'  (default)
    + 'linear'
+ **stayTime**: time stay on each page, ms
    + 2000  (default)
+ **transTime**: animation transition time
    + 600   (default)
+ **stretchImg**: scale image fit for slideshow holder
    + true  (default)
+ **lazyLoadURL**: lazy image loading url
    + ''    (default)
+ **navDot**: use navigation dots
    + true  (default)
+ **navDotControl**: enable navigation dots control
    + true  (default)
+ **navDotControlMode**: If enable dots control, the way to change page, click or hover
    + 'click'   (default)
    + 'hover'
+ **arrow**: active arrow control
    + true  (default)
+ **mousePause**: when mouse move on slideshow, stop autoplay
    + true  (default)
+ **imgURL**: url list that shows
    + []    (default)
+ **imgLink** : click page re-direction
    + false  (default)
+ **linkOpenNew**: click page jump to new window or re-fresh current window
    + true  (default)
+ **linkURL**: re-direction url, must match the number imgURL, if some page do not need re-direction, fill undefined
    + []    (default)
+ **resize**: re-render when browser resize
    + false (default)


<br/>

---



Feel free to let me know if there are any functions or parts need to be fixed :)
<br>By Jiawei Zhou 2018
