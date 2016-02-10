(function(){

	/**
	 *	ImageLoader handles the pre-loading and storage of images.
	 *	
	 *	Image download is queued by usind the method `queueLoadImage`, providing the key and the path 
	 *	of the image file, and later batch downloaded by calling `loadAllImages`.
	 *
	 *	Images can be retrieved by providing it's key
	 */
	function ImageLoader(){
		// Images 
		this._images = [];

		// image loading queue [key, path]
		this._pathQueue = [];
	}

	/**
	 *	Adds the path to the list of images to download later
	 *	@param key [string] - key to identify the downloaded image
	 *	@param path [string] - path to the image file
	 */
	ImageLoader.prototype.queueLoadImage = function(key, path){
		this._pathQueue[this._pathQueue.length] = [key, path];
	}


	
	/**
	 *	Downloads all the images from the list of paths
	 *
	 *	@param notifyProgress [function] 
	 *					- function to call whenever an image download is completed, whether it 
	 * 					 is a success or a failure, is finished. 
	 *
	 *					@param filepath [string] - filepath of the image
	 *					@param success [boolean] - true if download is successful, false otherwise
	 *					@param remaining [int] - number of images still in queue
	 *
	 *
	 */
	ImageLoader.prototype.loadAllImages = function(notifyProgress, callback){
		var queueLength = this._pathQueue.length;

		if(queueLength === 0){
			return;
		}else{
			var remaining = queueLength;
			var path, key, image;
			var failed = [], that = this;

			// Checks if there the pathQueue is empty, if it is, it then calls the `callback` functions.
			// Then, replace the pathQueue with the failed ones.
			var isFinished = function(){
				if(remaining === 0){
					that._pathQueue = failed;
					callback();
				}
			}

			// Try to download images
			for(var i = 0; i < queueLength; i++){
				key = this._pathQueue[i][0];
				path = this._pathQueue[i][1];
				image = new Image();

				image.addEventListener("load", (function(p){
					return function(){
						notifyProgress(p, true, --remaining);
						isFinished();
					}
				})(path), false);

				image.addEventListener("error", (function(k, p){
					return function(){
						failed[failed.length] = [k, p];
						notifyProgress(p, false, --remaining);
						isFinished();
					}
				})(key, path), false);

				image.src = path;
				this._images[key] = image;
			}

		}

	}

	ImageLoader.prototype.numQueued = function(){
		return this._pathQueue.length;
	}

	ImageLoader.prototype.getImage = function(key){
		return this._images[key] || null;
	}

	window.Bomberboy.ImageLoader = ImageLoader;

})();