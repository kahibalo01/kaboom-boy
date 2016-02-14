(function(){
	
	/**
	 *
	 *
	 */
	function Map(grid, tilesheet, screenWidth, screenHeight){
		// Map data
		this.grid = grid;
		this._gridCols = grid[0].length;
		this._gridRows = grid.length;
		// Tiles Spritesheet
		this._tilesheet = tilesheet;

		// World coordinates
		this._xWorld;
		this._yWorld;

		// Tile Positions
		this._xTileOffset;
		this._yTileOffset;

		// Dimensions
		this._tilesheetDimensions = tilesheet.getDimensions();

		// Tiles to draw
		this._numColsVisible = Math.ceil(screenWidth / this._tilesheetDimensions.spriteWidth);
		this._numRowsVisible = Math.ceil(screenHeight / this._tilesheetDimensions.spriteHeight);

		this.setWorldPosition(0, 0);
	}

	/**
	 *	Sets the top-left corner of the screen to be at [x, y] in world coordinates
	 */
	Map.prototype.setWorldPosition = function(x, y){
		this._xWorld = x;
		this._yWorld = y;

		// Recalculate tile Offset
		this._xTileOffset = Math.floor(x / this._tilesheetDimensions.spriteWidth);
		this._yTileOffset = Math.floor(y / this._tilesheetDimensions.spriteHeight);
	}

	Map.prototype.render = function(ctx){
		var rows = this._numRowsVisible,
			cols = this._numColsVisible,
			spriteWidth = this._tilesheetDimensions.spriteWidth,
			spriteHeight = this._tilesheetDimensions.spriteHeight;

		// Determine range of tiles to draw
		var xStart = this._xTileOffset,
			yStart = this._yTileOffset;

		var xEnd = xStart + cols,
			yEnd = yStart + rows;


		// Bounds
		xEnd = (xEnd > this._gridCols - 1 ? this._gridCols - 1 : xEnd);
		yEnd = (yEnd > this._gridRows - 1 ? this._gridRows - 1 : yEnd);

		// Determine screen coordinates (where to draw tiles on screen)
		var xScreenStart = -(this._xWorld % spriteWidth),
			y = -(this._yWorld % spriteHeight);

		var i, j

		for(i = yStart; i < yEnd + 1; i++){
			
			x = xScreenStart;
			for(j = xStart; j < xEnd + 1; j++){
				// Draw Tile
				this._tilesheet.drawSpriteToContext(ctx, this.grid[i][j], x, y);
				x += spriteWidth
			}
			y += spriteHeight;
		}

	}

	window.KaboomBoy.Map = Map;	

})();