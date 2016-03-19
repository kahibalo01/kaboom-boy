(function(){

	/**
	 * Represents a grid of equally sized `sprites` from a part of (or the whole)
	 * image reference. 
	 *
	 */
	function Spritesheet(image, xBase, yBase, numRows, numCols, spriteWidth, spriteHeight){
		this._image = image;

		// Offset on image
		this._xBase = xBase;
		this._yBase = yBase;

		// Spritesheet dimensions
		this.numRows = numRows;
		this.numCols = numCols;
		this.spriteWidth = spriteWidth;
		this.spriteHeight = spriteHeight;
	}

	/**
	 * Draws the sprite from the specified row and column into a context
	 *
	 */
	Spritesheet.prototype.drawSpriteToContext = function(ctx, row, col, x, y){
		var sw = null, sh = null;

		if(row > -1 && row < this.numRows && col > -1 && col < this.numCols){
			sw = this.spriteWidth;
			sh = this.spriteHeight;
			ctx.drawImage(this._image, this._xBase + (col * sw), this._yBase + (row * sh), sw, sh, x, y, sw, sh);
		}
	}

	/**
	 * Draws the sprite from the specified index into a context.
	 * The sprites' numbering is from left to right, then from top to bottom.
	 *
	 */
	Spritesheet.prototype.drawSpriteOnIndexToContext = function(ctx, index, x, y){
		this.drawSpriteToContext(ctx, Math.floor(index / this._numCols), (index % this._numCols), x, y);
	}


	window.KaboomBoy.Spritesheet = Spritesheet;

})();