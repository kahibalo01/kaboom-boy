(function(){
	
	/**
	 * The purposes of Map are:
	 *		- Container for the tilemap data
	 *		- Tracks which part of the map is vieved
	 *		- Renders the viewable part of the map
	 *
	 *	@param grid - a 2D array of `Tile` objects containing tile data
	 *	@param tilesheet - a `Spritesheet` to be used for rendering the map
	 *	@param screenWidth - width of the display screen
	 *	@param screenHeight - height of the display screen
	 *
	 */
	function Map(tiles, tilesheet, screenWidth, screenHeight){
		// Map data
		this._mapTiles = tiles;
		this._mapCols = this._mapTiles[0].length;
		this._mapRows = this._mapTiles.length;

		// Tiles Spritesheet
		this._tilesheet = tilesheet;

		// World coordinates
		this._xWorld;
		this._yWorld;

		// Tile Positions
		this._xTileOffset;
		this._yTileOffset;

		// Dimensions
		var tilesheetDimensions = tilesheet.getDimensions();
		this._tileWidth = tilesheet.getSpriteWidth();
		this._tileHeight = tilesheet.getSpriteHeight();

		// Tiles to draw
		this._numColsVisible = Math.ceil(screenWidth / this._tileWidth);
		this._numRowsVisible = Math.ceil(screenHeight / this._tileHeight);

		this.setWorldPosition(0, 0);
	}

	Map.prototype.getTileWidth = function(){
		return this._tileWidth;
	}

	Map.prototype.getTileHeight = function(){
		return this._tileHeight;
	}

	Map.prototype.getTileDimensions = function(){
		return {
			w: this._tileWidth,
			h: this._tileHeight
		};
	}

	/**
	 *	Sets the top-left corner of the screen to be at [x, y] in world coordinates
	 */
	Map.prototype.setWorldPosition = function(x, y){
		this._xWorld = x;
		this._yWorld = y;

		// Recalculate tile Offset
		this._xTileOffset = Math.floor(x / this._tileWidth);
		this._yTileOffset = Math.floor(y / this._tileHeight);
	}

	Map.prototype.getTile = function(r, c){
		if(r < 0 || r > (this._mapRows - 1) || c < 0 || c > (this._mapCols - 1)){
			return null;
		}
		return this._mapTiles[r][c] || null;
	}

	/**
	 *	Renders the viewed part of the tilemap
	 */
	Map.prototype.render = function(ctx){
		var spriteWidth = this._tileWidth,
			spriteHeight = this._tileHeight;

		// Determine range of tiles to draw
		var xStart = this._xTileOffset,
			yStart = this._yTileOffset;

		var xEnd = xStart + this._numColsVisible,
			yEnd = yStart + this._numRowsVisible;

		// Bounds
		xEnd = (xEnd > this._mapCols - 1 ? this._mapCols - 1 : xEnd);
		yEnd = (yEnd > this._mapRows - 1 ? this._mapRows - 1 : yEnd);

		// Determine screen coordinates (where to draw tiles on screen)
		var xScreenStart = -(this._xWorld % spriteWidth),
			y = -(this._yWorld % spriteHeight);

		var i, j;

		// Loop for drawing tiles
		for(i = yStart; i < yEnd + 1; i++){
			
			x = xScreenStart;
			for(j = xStart; j < xEnd + 1; j++){
				// Draw Tile
				this._tilesheet.drawSpriteOnIndexToContext(ctx, this._mapTiles[i][j].index, x, y);
				x += spriteWidth;
			}
			y += spriteHeight;
		}

	}

	window.KaboomBoy.Map = Map;	

})();