(function(){

	// corner values for sliding
	var NO_CORNER = -2, NO_VALUE = -1;

	function detectTileCollisions(tilemap, passlevel, mEntityCoord, pEntityCoord, mEntitySize, pEntitySize, mTileSize, pTileSize, vel, horizontal){
		// dir: normalized direction vector
		// sFront: major axis coordinate of the side facing the direction of motion
		// mDist: distance moved, with the origin at the nearest side of the next tile
		// eOffset: entity's offset from the colliding tile in case of collision
		var dir, sFront, mDist, eOffset;

		// [pStart, pEnd]: range of the tiles to be checked in the perpendicular axis
		var pStart, pEnd;

		var tilesToPass, curTile, tile, resPos, adVel, corner, i, j;

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
		curTile = mStart;
		for(i = 0; i < tilesToPass + 1; i++){
			for(j = pStart; j < pEnd + 1; j++){
				if(horizontal){
					tile = tilemap.getTile(j, curTile);
				}else{
					tile = tilemap.getTile(curTile, j);
				}

				// Check if tile is passable
				if(tile !== null && tile.type > passlevel){
					resPos = resPos || (curTile * mTileSize) + eOffset;
				}

			}

			if(resPos !== null){
				break;
			}
			curTile += dir;
		}

		if(resPos !== null){
			return (resPos - sFront);
		}else{
			return vel;
		}
	}

	function TilemapCollisionComponent(tilemap){
		this._tilemap = tilemap;

		(function(that){
			var td = tilemap.getTileDimensions();
			that._tileWidth = td.w;
			that._tileHeight = td.h;
		})(this);

		//this._tileDimensions = tilemap.getTileDimensions();

		this._getTileXY;
		this._getTileYX;
	}

	TilemapCollisionComponent.prototype.moveEntity = function(entity){
		/*
		 *	This function checks for entity-tilemap collisions and adjusts and corrects them accordingly.
		 *	The entity is assumed to move only in a single axis (either x-axis or y-axis, but not both).
		 * 
		 *	The check is performed by checking the tiles that collides with the path of the entity. If the
		 *	tile can block the entity, a collision occurs, and the collision will be resolved.
		 *
		 *
		 */



		 if(entity.dx !== 0){
		 	entity.dx = detectTileCollisions(this._tilemap, entity.passLevel, entity.x, entity.y, entity.w, entity.h, this._tileWidth, 
		 		this._tileHeight, entity.dx, true);
		 }else
		 if(entity.dy !== 0){
		 	entity.dy = detectTileCollisions(this._tilemap, entity.passLevel, entity.y, entity.x, entity.h, entity.w, this._tileHeight, 
		 		this._tileWidth, entity.dy, false);
		 }else{
		 	// No motion
		 	return false;
		 }

		 entity.x += entity.dx;
		 entity.y += entity.dy;

		 return;
	}

	

	window.KaboomBoy.TilemapCollisionComponent = TilemapCollisionComponent;

})();