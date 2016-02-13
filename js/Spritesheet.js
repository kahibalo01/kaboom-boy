(function(){

	function Spritesheet(image, spriteWidth, spriteHeight){
		this._image = image;
		this._width = image.width;
		this._height = image.height;

		this._spriteWidth = spriteWidth;
		this._spriteHeight = spriteHeight;

		this._cols = Math.floor(image.width / spriteWidth);
		this._rows = Math.floor(image.height / spriteHeight);
	}

	Spritesheet.prototype.drawSpriteToContext = function(ctx, index, x, y){
		var sw = this._spriteWidth, sh = this._spriteHeight;
		var xSprite = (index % this._cols) * this._spriteWidth;
		var ySprite = Math.floor(index / this._cols) * this._spriteHeight;

		// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
		ctx.drawImage(this._image, xSprite, ySprite, sw, sh, x, y, sw, sh);
	}

	Spritesheet.prototype.createRenderer = function(ctx){
		var image = this._image, sw = this._spriteWidth, sh = this._spriteHeight;

		return function(index, x, y){
			var sprite_x = (index % this._cols) * sw;
			var sprite_y = Math.floor(index / this._cols) * sh;

			// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			ctx.drawImage(image, sprite_x, sprite_y, sw, sh, x, y, sw, sh);
		}
	}

	window.KaboomBoy.Spritesheet = Spritesheet;

})();