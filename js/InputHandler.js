(function(){

	function KeyHandler(){
		this._keys = {};
	}

	KeyHandler.prototype.init = function(eventTarget){
		var that = this,
			focus = eventTarget;

		// Workaround on listening to keypress on canvas
		document.addEventListener("mousedown", function(e){
			focus = event.target;
		});

		document.addEventListener("keydown", function(e){
			if(focus === eventTarget){
				var keycode = e.keyCode;
				that.onKeydown.call(that, e);

				if(keycode > 36 && keycode < 41){
					e.preventDefault();
				}
			}
		});

		document.addEventListener("keyup", function(e){
			if(focus === eventTarget){
				that.onKeyup.call(that, e);
			}
		});

	}

	KeyHandler.prototype.isDown = function(keyCode){
		return this._keys[keyCode] || false;
	}

	KeyHandler.prototype.onKeydown = function(keyevent){
		//console.log(keyevent.keyCode);
		this._keys[keyevent.keyCode] = true;
	}

	KeyHandler.prototype.onKeyup = function(keyevent){
		delete this._keys[keyevent.keyCode];
	}
	
	window.KaboomBoy.KeyHandler = KeyHandler;
})();