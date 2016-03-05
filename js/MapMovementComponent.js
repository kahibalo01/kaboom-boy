(function(){


	function correctPosition(entity, collisionIndex, onRow){

	}

	function placeholder(){
		var dx = this._entity.dx, 
			dy = this._entity.dy;

		// vel: velocity of the entity (there are only 4 directions, left, right, up, down)
		// mTileSize: length of a tile when measured parallel to the direction
		// pTileSize: length of a tile when measured perpendicular to the direction
		var vel, mTileSize, pTileSize;


		// mEntitySize: size of entity when measured parallel to the direction
		// pEntitySize: size of entity when measured perpendicular to the direction
		var entityCoord, mEntitySize, pEntitySize;

		// sFront: major axis coordinate of the side facing the direction of motion
		// mDist: distance moved, with the origin at the nearest side of the next tile
		var sFront, mDist;

		// [pStart, pEnd]: range of the tiles to be checked in the perpendicular axis
		var pStart, pEnd;

		var tilesToPass;

		if(dx !== 0){
			vel = dx;
			mTileSize = this._tileDimensions.w;
			pTileSize = this._tileDimensions.h;

			mEntityCoord = this._entity.x;
			pEntityCoord = this._entity.y;

			mEntitySize = this._entity.w;
			pEntitySize = this._entity.h;
		}else
		if(dy !== 0){
			vel = dy;
			mTileSize = this._tileDimensions.h;
			pTileSize = this._tileDimensions.w;

			mEntityCoord = this._entity.y;
			pEntityCoord = this._entity.x;

			mEntitySize = this._entity.h;
			pEntitySize = this._entity.w;
		}else{
			// No motion
			return;
		}

		if(vel > 0){
			dir = 1;
			sFront = (entityCoord + mEntitySize - 1);
			mDist = dx - mTileSize + (sFront % mTileSize);
		}else{
			dir = -1;
			sFront = entityCoord;
			mDist = (-dx) - (sFront % mTileSize) - 1;
		}

		pStart = Math.floor(pEntityCoord / pTileSize);
		pEnd = Math.floor((pEntityCoord + pEntitySize) / pTileSize);
		mStart = Math.floor(sFront / mTileSize);
		tilesToPass = Math.floor(mDist / mTileSize) + 1;

	}

	// NOTE: it is assumed that every entity is equal to or less than the size of a tile
	function MapMovementComponent(tilemap, entity){
		// Tilemap and relevant data
		this._tilemap = tilemap;
		this._tileDimensions = tilemap.getTileDimensions();

		this._entity = entity;
	}

	MapMovementComponent.prototype.move = function(){
		var dx = this._entity.dx, 
			dy = this._entity.dy;

		// vel: velocity of the entity (there are only 4 directions, left, right, up, down)
		// mTileSize: length of a tile when measured parallel to the direction
		// pTileSize: length of a tile when measured perpendicular to the direction
		var vel, mTileSize, pTileSize;


		// mEntitySize: size of entity when measured parallel to the direction
		// pEntitySize: size of entity when measured perpendicular to the direction
		var entityCoord, mEntitySize, pEntitySize;

		// sFront: major axis coordinate of the side facing the direction of motion
		// mDist: distance moved, with the origin at the nearest side of the next tile
		// eOffset: entity's offset from the colliding tile in case of collision
		var sFront, mDist, eOffset;

		// [pStart, pEnd]: range of the tiles to be checked in the perpendicular axis
		var pStart, pEnd;

		var tilesToPass, curTile, tile, resPos, i, j;

		// Narrow down focus on a single dimension
		if(dx !== 0){
			vel = dx;
			mTileSize = this._tileDimensions.w;
			pTileSize = this._tileDimensions.h;

			mEntityCoord = this._entity.x;
			pEntityCoord = this._entity.y;

			mEntitySize = this._entity.w;
			pEntitySize = this._entity.h;
		}else
		if(dy !== 0){
			vel = dy;
			mTileSize = this._tileDimensions.h;
			pTileSize = this._tileDimensions.w;

			mEntityCoord = this._entity.y;
			pEntityCoord = this._entity.x;

			mEntitySize = this._entity.h;
			pEntitySize = this._entity.w;
		}else{
			// No motion
			return;
		}

		if(vel > 0){
			dir = 1;
			sFront = (mEntityCoord + mEntitySize - 1);
			mDist = vel - mTileSize + (sFront % mTileSize);
			eOffset = -mEntitySize;
		}else{
			dir = -1;
			sFront = mEntityCoord;
			mDist = (-vel) - (sFront % mTileSize) - 1;
			eOffset = mTileSize;
		}

		//
		pStart = Math.floor(pEntityCoord / pTileSize);
		pEnd = Math.floor((pEntityCoord + pEntitySize - 1) / pTileSize);
		mStart = Math.floor(sFront / mTileSize);
		tilesToPass = Math.floor(mDist / mTileSize) + 1;

		console.log("\ndy: " + dy + "\nsFront: " + sFront + "\nmDist: " + mDist + "\npStart: " + pStart + "\npEnd: " + pEnd
			  + "\nmStart: " + mStart + "\ntilesToPass: " + tilesToPass);

		// Detect collisions
		resPos = null;
		curTile = mStart;
		for(i = 0; i < tilesToPass + 1; i++){
			for(j = pStart; j < pEnd + 1; j++){
				// Check if tile is passable
				if(dx !== 0){
					tile = this._tilemap.getTile(j, curTile);
				}else{
					tile = this._tilemap.getTile(curTile, j);
				}

				if(tile !== null && tile.type > this._entity.passLevel){
					// Entity cannot pass the tile
					console.log("collision\ncurTile:" + curTile);
					resPos = (curTile * mTileSize) + eOffset;
					break;
				}

			}
			curTile += dir;
		}

		if(resPos !== null){
			if(dx !== 0){
				this._entity.x = resPos;
			}else{
				this._entity.y = resPos;
			}
		}else{
			this._entity.x += dx;
			this._entity.y += dy;
		}

		console.log("y: " + this._entity.y );

		/*
		//if(this._entity.dx === 0 && this._entity.dy === 0){
		//	return;
		//}
		// Determines tile collision by checking if the hitbox's side facing the direction of
		// movement collides with an unpassable tile.
		//
		// Steps:
		//		1. Determine the direction and the hitbox's side to check.
		//		2. Calculate the range of possible tile collisions relative to the motion
		//		3. Perform tile collision checking ("narrow phase?")
		//
		//

		// Entity Data
		var x = this._entity.x, y = this._entity.y,
			w = this._entity.w, h = this._entity.h,
			dx = this._entity.dx, dy = this._entity.dy;

		// Tile Data
		var tw = this._tileDimensions.w, th = this._tileDimensions.h;

		var nextx = x + dx,
			nexty = y + dy;


		// NEEDS TESTING: dx - (sFront % tw)
		//				  -(dx - (tw - (sFront % tw)))

		// dir: +/- direction
		// sFront: side of the hitbox facing the direction
		// mDist: displacement of the entity with the origin being the next tile in the entity's direction.
		var dir, sFront, mDist;

		// pStart, pEnd: the range (or "width") of tiles in the perperdicular dimension that is sweeped by the motion
		var pStart, pEnd, mStart, mTile, tilesToPass;

		var tile;

		var i, j;

		// Calculate the variables
		if(dx !== 0){
			if(dx > 0){
				dir = 1;
				sFront = x + w - 1;
				mDist = dx - tw + (sFront % tw);
			}else{
				dir = -1;
				sFront = x;
				mDist = (-dx) - (sFront % tw) - 1;
			}

			pStart = Math.floor(y / th);
			pEnd = Math.floor((y + h - 1) / th);
			mStart = Math.floor(sFront / tw);
			tilesToPass = Math.floor(mDist / tw) + 1;
		}else
		if(dy !== 0){
			if(dy > 0){
				dir = 1;
				sFront = y + h - 1;
				mDist = dy - th + (sFront % th);
			}else{
				dir = -1;
				sFront = y;
				mDist = (-dy) - (sFront % tw) - 1;
			}

			pStart = Math.floor(x / tw);
			pEnd = Math.floor((x + w - 1) / tw);
			mStart = Math.floor(sFront / th);
			tilesToPass = Math.floor(mDist / th) + 1;
		}

		//console.log("dir: " + dir + "\nsFront: " + sFront + "\nmDist: " + mDist);
		//console.log("\npStart: " + pStart + "\npEnd: " + pEnd + "\nmStart: " + mStart + "\ntilesToPass: " + tilesToPass);

		var endTileIndex;

		// Determine if there is collision
		mTile = mStart;
		for(i = 0; i < tilesToPass + 1; i++){
			for(j = pStart; j < pEnd + 1; j++){
				
				if(dx !== 0){
					tile = this._tilemap.getTile(j, mTile);
				}else
				if(dy !== 0){
					tile = this._tilemap.getTile(mTile, j);
				}
				
				if(tile.type === 1){
					//console.log("Collision Detected\ni: " + mTile + "\nj: " + j + "\ntype: " + tile.type);
					if(dx !== 0){
						//endTileIndex = mStart + ((i + 1) * dir);
					}else
					if(dy !== 0){

					}
					return;
				}
			}
			mTile += dir;
		}


		this._entity.x += dx;
		this._entity.y += dy;
		
		*/
	}

	window.KaboomBoy.MapMovementComponent = MapMovementComponent;

})();