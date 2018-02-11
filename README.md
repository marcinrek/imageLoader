# imageLoader #
Image loader ... nothing more.

This small lib was created as part of a custom project that is why some solutions here may look a bit awkward.
But overall it is quite simple and should be easy to adjust to other custom needs.

## Key features ##
* returns a promise - it can be easily chained 
* triggers a custom action when each image is loaded (or when it fails to load)
* based on data attributes you can set:
	* image alt
	* image as background
	* image class or element class if set as background
	* copy custom data attributes to images

## Usage ##

* Init:
```
imageLoader.loadSceneImages('wrapper-id', 'loader-id')
    .then(function(){
        // Some action after all images load
    });
```

* Act on image load
```
document.getElementById('loader').addEventListener('loader-updated', function(){
    // Do something
}, false);
```

* Get preloader data from "imageLoader.preloadData" object
```
{ 
	imageCount:   8,    // images to load 
	imagesLoaded: 4,    // images already loaded
	percent:      50    // percent of images loaded
}
```

* Template - image
~~~~
<span data-src="IMG/SRC" data-alt="ALT" data-class="CLASS_NAME"></span>
~~~~
will produce
~~~~
<img src="IMG/SRC" alt="ALT" class="CLASS_NAME" />
~~~~

* Template - background
~~~~
<div data-src-bg="IMG/SRC" data-class="CLASS_NAME" ></div>
~~~~
will produce
~~~~
<div class="CLASS_NAME" style="background-image: url('IMG/SRC');"></div>
~~~~