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

	Spritesheet.prototype.getSpriteWidth = function(){
		return this._spriteWidth;
	}

	Spritesheet.prototype.getSpriteHeight = function(){
		return this._spriteHeight;
	}

	Spritesheet.prototype.getCols = function(){
		return this._cols;
	}

	Spritesheet.prototype.getRows = function(){
		return this._rows;
	}

	Spritesheet.prototype.getDimensions = function(){
		return {
			sheetWidth: this._width,
			sheetHeight: this._height,
			spriteWidth: this._spriteWidth,
			spriteHeight: this._spriteHeight
		};
	}

	Spritesheet.prototype.drawSpriteToContext = function(ctx, row, col, x, y){
		var sw, sh;

		if(row > -1 && row < this._spriteHeight && col > -1 && col < this._spriteWidth){
			sw = this._spriteWidth;
			sh = this._spriteHeight;
			ctx.drawImage(this._image, (col * sw), (row * sh), sw, sh, x, y, sw, sh);
		}		
	}

	
	Spritesheet.prototype.drawSpriteOnIndexToContext = function(ctx, index, x, y){
		var sw = this._spriteWidth, sh = this._spriteHeight;
		var xSprite = (index % this._cols) * this._spriteWidth;
		var ySprite = Math.floor(index / this._cols) * this._spriteHeight;

		ctx.drawImage(this._image, xSprite, ySprite, sw, sh, x, y, sw, sh);
	}

	window.KaboomBoy.Spritesheet = Spritesheet;

})();