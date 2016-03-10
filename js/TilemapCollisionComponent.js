(function(){

	// corner values for sliding
	var NO_CORNER = -2, NO_VALUE = -1;

	/**
	 *
	 *
	 *
	 */
	function detectTileCollisions(tilemap, newVector, passLevel, mEntityCoord, pEntityCoord, mEntitySize, pEntitySize, mTileSize, pTileSize, xaxis){
		// dir: normalized direction vector
		// sFront: major axis coordinate of the side facing the direction of motion
		// mDist: distance moved, with the origin at the nearest side of the next tile
		// eOffset: entity's offset from the colliding tile in case of collision
		var dir, sFront, mDist, eOffset;

		// [pStart, pEnd]: range of the tiles to be checked in the perpendicular axis
		var pStart, pEnd;

		// tilesTopass: number of tiles along the major axis passed by the entity's path of movement
		var tilesToPass, curTile, tile, resPos, adVel, corner, i, j;

		// resPos: if the entity collides with a tile, it is the major axis coordinate of the collision
		var resPos;

		vel = (xaxis ? newVector.dx : newVector.dy);

		if(vel > 0){
			dir = 1;
			sFront = mEntityCoord + mEntitySize - 1;
			mDist = vel - mTileSize + (sFront % mTileSize);
			eOffset = -1;
		}else{
			dir = -1;
			sFront = mEntityCoord;
			mDist = (-vel) - (sFront % mTileSize) - 1;
			eOffset = mTileSize;
		}

		// Determine tile checking range
		pStart = Math.floor(pEntityCoord / pTileSize);
		pEnd = Math.floor((pEntityCoord + pEntitySize - 1) / pTileSize);
		mStart = Math.floor(sFront / mTileSize);
		tilesToPass = Math.floor(mDist / mTileSize) + 1;

		// Detect collisions
		resPos = null;
		adVel = null;
		curTile = mStart;

		for(i = 0; i < tilesToPass + 1; i++){
			for(j = pStart; j < pEnd + 1; j++){
				if(xaxis === true){
					tile = tilemap.getTile(j, curTile);
				}else{
					tile = tilemap.getTile(curTile, j);
				}

				// Check if tile is passable
				if(tile !== null && tile.type > passLevel){
					if(resPos === null){
						resPos = (curTile * mTileSize) + eOffset;
						adVel = resPos - sFront;
					}
				}

			}

			if(resPos !== null){
				break;
			}

			curTile += dir;
		}

		
		if(resPos !== null){
			if(xaxis === true){
				newVector.dx = adVel;
			}else{
				newVector.dy = adVel;
			}

			return true;
		}else{
			return false;
		}
	}



	function TilemapCollisionComponent(tilemap){
		this._tilemap = tilemap;

		this._newVector = {
			dx: 0,
			dy: 0
		};

		(function(that){
			var td = tilemap.getTileDimensions();
			that._tileWidth = td.w;
			that._tileHeight = td.h;

			that._getTileXY = function(x, y){
				return tilemap.getTile(y, x);
			}

			that._getTileYX = function(y, x){
				return tilemap.getTile(y, x);
			}
		})(this);

	}

	TilemapCollisionComponent.prototype.moveEntity = function(e){
		/*
		 *	This function checks for entity-tilemap collisions and adjusts and corrects them accordingly.
		 *	The entity is assumed to move only in a single axis (either x-axis or y-axis, but not both).
		 * 
		 *	The check is performed by checking the tiles that collides with the path of the entity. If the
		 *	tile can block the entity, a collision occurs, and the collision will be resolved.
		 *
		 *
		 */
		 this._newVector.dx = e.dx;
		 this._newVector.dy = e.dy;

		 if(e.dx !== 0){
		 	if(detectTileCollisions(this._tilemap, this._newVector, e.passLevel, e.x, e.y, e.w, e.h, this._tileWidth, this._tileHeight, true) === true){
		 		e.dx = this._newVector.dx;
		 	}
		 	
		 }else
		 if(e.dy !== 0){
		 	if(detectTileCollisions(this._tilemap, this._newVector, e.passLevel, e.y, e.x, e.h, e.w, this._tileHeight, this._tileWidth, false) === true){
		 		e.dy = this._newVector.dy;
		 	}
		 }else{
		 	// No motion
		 	return false;
		 }

		 e.x += e.dx;
		 e.y += e.dy;

		 return;
	}

	

	window.KaboomBoy.TilemapCollisionComponent = TilemapCollisionComponent;

})();