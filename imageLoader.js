/* 
 * imageLoader
 * @author Marcin Rek
 * @version 0.1
 */

/*
 *  1. Promise polyfill 
 */
if (!window.Promise) {
    /* jshint ignore:start */
    !function(e){function n(){}function t(e,n){return function(){e.apply(n,arguments)}}function o(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],s(e,this)}function i(e,n){for(;3===e._state;)e=e._value;return 0===e._state?void e._deferreds.push(n):(e._handled=!0,void o._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null===t)return void(1===e._state?r:u)(n.promise,e._value);var o;try{o=t(e._value)}catch(i){return void u(n.promise,i)}r(n.promise,o)}))}function r(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var i=n.then;if(n instanceof o)return e._state=3,e._value=n,void f(e);if("function"==typeof i)return void s(t(i,n),e)}e._state=1,e._value=n,f(e)}catch(r){u(e,r)}}function u(e,n){e._state=2,e._value=n,f(e)}function f(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;n<t;n++)i(e,e._deferreds[n]);e._deferreds=null}function c(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}function s(e,n){var t=!1;try{e(function(e){t||(t=!0,r(n,e))},function(e){t||(t=!0,u(n,e))})}catch(o){if(t)return;t=!0,u(n,o)}}var a=setTimeout;o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var o=new this.constructor(n);return i(this,new c(e,t,o)),o},o.all=function(e){var n=Array.prototype.slice.call(e);return new o(function(e,t){function o(r,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var f=u.then;if("function"==typeof f)return void f.call(u,function(e){o(r,e)},t)}n[r]=u,0===--i&&e(n)}catch(c){t(c)}}if(0===n.length)return e([]);for(var i=n.length,r=0;r<n.length;r++)o(r,n[r])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(n){n(e)})},o.reject=function(e){return new o(function(n,t){t(e)})},o.race=function(e){return new o(function(n,t){for(var o=0,i=e.length;o<i;o++)e[o].then(n,t)})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){a(e,0)},o._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},o._setImmediateFn=function(e){o._immediateFn=e},o._setUnhandledRejectionFn=function(e){o._unhandledRejectionFn=e},"undefined"!=typeof module&&module.exports?module.exports=o:e.Promise||(e.Promise=o)}(this); 
    /* jshint ignore:end */
}

/*
 *  2. Create custom events
 */
var loaderUpdated = new Event('loader-updated');

/*
 *  3. Image Loader OBJ
 */
var imageLoader = {

    // Images to load
    images: [],

    // Preload promise array
    preloadPromises: [],

    // Preloader data
    preloadData: {
        imageCount: undefined,
        imagesLoaded: 0,
        percent: 0
    },

    // Act on image loaded
    onImageLoaded: function(loaderId) {
        var _this = this;

        // Increment loaded images count
        _this.preloadData.imagesLoaded = _this.preloadData.imagesLoaded + 1;

        // Count percent
        _this.preloadData.percent = Math.round((_this.preloadData.imagesLoaded / _this.preloadData.imageCount) * 100);

        // Run custom trigger
        if (document.getElementById(loaderId) && undefined !== loaderId) {
            document.getElementById(loaderId).dispatchEvent(loaderUpdated);
        }

    },

    // Get images from scene 
    getImagesFromScene: function(id) {
        var _this = this;

        // Clear arrays
        _this.images = [];
        _this.preloadPromises = [];

        // Loop through images 
        var elements = document.querySelectorAll('#' + id + ' [data-src], #' + id + ' [data-src-bg]'), 
            i;

        for (i = 0; i < elements.length; i+=1) {
            var item       = elements[i],
                parent     = item,
                parentNode = item.parentNode;
                id         = item.id ? item.id : undefined,
                data       = item.dataset ? item.dataset : undefined,
                src        = item.dataset.src ? item.dataset.src : item.dataset.srcBg,
                type       = item.dataset.src ? 'img' : 'bg',
                alt        = item.dataset.alt ? item.dataset.alt : false,
                classVal   = item.dataset.class ? item.dataset.class : false;

            // Create OBJ with image data
            var tempImgObj = {
                id:         id,
                data:       data,
                parent:     parent,
                parentNode: parentNode,
                src:        src,
                type:       type,
                alt:        alt,
                classVal:   classVal
            };

            // Push the object to array
            _this.images.push(tempImgObj);

        }

        // Update data OBJ
        _this.preloadData.imageCount = _this.images.length;

    },

    // Place the images in DOM
    buildImages: function() {
        var _this   = this;

        // Loop through image OBJs
        _this.images.map(function(el, i){

            // Regular image
            if (el.type === 'img') {

                //var $img = $('<img src="'+item.src+'"/>');
                var img = document.createElement('img');
                
                // Set img src
                img.src = el.src;

                // Apply id
                if (el.id) {
                    img.id = el.id;
                }

                // Apply alt
                if (el.alt) {
                    img.alt = el.alt;
                }

                // Apply classes
                if (el.classVal) {
                    el.classVal.split(' ').map(function(item){
                        img.classList.add(item);
                    });
                }

                // Apply data
                if (el.data) {
                    for (var property in el.data) {
                        if (el.data.hasOwnProperty(property) && (property !== 'src' && property !== 'alt' && property !== 'class')) {
                            img.dataset[property] = el.data[property];
                        }
                    }
                }

                // Insert image before item
                el.parentNode.insertBefore(img, el.parent);
                
                // Remove item
                el.parentNode.removeChild(el.parent);

            } else { // ... else background image
                el.parent.style.backgroundImage = 'url("' + el.src+'")';

                // Apply classes
                if (el.classVal) {
                    el.classVal.split(' ').map(function (item) {
                        el.parent.classList.add(item);
                    });
                }

                // Remove data-src-bg
                delete el.parent.dataset.srcBg;

                // Remove data-src-bg
                delete el.parent.dataset.class;
            }

        });

    },

    // Preload the images
    preloadImages: function(parentResolve, loaderId) {
         var _this   = this;

         // Loop trough images
         _this.images.map(function(item, i){
            var imgSrc = item.src;

            // Create the promise
            var imagePromise = new Promise(function(resolve,reject){
                var img = new Image();
                img.onload = function(){
                    _this.onImageLoaded(loaderId);
                    resolve();
                };
                img.onerror = function(){
                    _this.onImageLoaded(loaderId);
                    resolve();
                };
                img.src = imgSrc;
            });

            // Push the promise to array
            _this.preloadPromises.push(imagePromise);

         });

         // When all images load put them in DOM
         Promise.all(_this.preloadPromises)
            .then(function() {
                
                // Place the images in DOM
                _this.buildImages();

                // Resolved passed promises if available
                if (parentResolve !== undefined) {
                    parentResolve();
                }
            });

    },

    // Run
    loadSceneImages: function(id, loaderId) {
        var _this   = this;

        // Clear arrays
        _this.images = [];
        _this.preloadPromises = [];
        _this.preloadData = {
            imageCount: undefined,
            imagesLoaded: 0,
            percent: 0
        }

        // Create the promise
        var promise = new Promise(function(resolve, reject){

            // Get images data
            _this.getImagesFromScene(id);

            // Preload the images
            _this.preloadImages(resolve, loaderId);

        });
        return promise;
    }

};
