(function(){

	function Spritesheet(image, xBase, yBase, numRows, numCols, spriteWidth, spriteHeight){
		this._image = image;

		// Offset on image
		this._xBase = xBase;
		this._yBase = yBase;

		// Spritesheet dimensions
		this._numRows = numRows;
		this._numCols = numCols;
		this._spriteWidth = spriteWidth;
		this._spriteHeight = spriteHeight;
	}


	Spritesheet.prototype.getSpriteWidth = function(){
		return this._spriteWidth;
	}


	Spritesheet.prototype.getSpriteHeight = function(){
		return this._spriteHeight;
	}


	Spritesheet.prototype.getRows = function(){
		return this._numRows;
	}


	Spritesheet.prototype.getCols = function(){
		return this._numCols;
	}


	Spritesheet.prototype.drawSpriteToContext = function(ctx, row, col, x, y){
		var sw = null, sh = null;

		if(row > -1 && row < this._numRows && col > -1 && col < this._numCols){
			sw = this._spriteWidth;
			sh = this._spriteHeight;
			ctx.drawImage(this._image, this._xBase + (col * sw), this._yBase + (row * sh), sw, sh, x, y, sw, sh);
		}
	}


	Spritesheet.prototype.drawSpriteOnIndexToContext = function(ctx, index, x, y){
		this.drawSpriteToContext(ctx, Math.floor(index / this._numCols), (index % this._numCols), x, y);
	}


	window.KaboomBoy.Spritesheet = Spritesheet;

})();