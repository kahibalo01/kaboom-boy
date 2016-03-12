(function(){

	var handleCollision = (function(){
		var NO_VALUE = -1,
			slideDirection = 0;

		var handleCollisionFunc = function(tilemap, entity, onXAxis){

			var mEntitySideA, pEntitySideA, mEntitySideB, pEntitySideB, mTileSize, pTileSize;

			// dir: normalized direction vector
			// sFront: major axis coordinate of the side facing the direction of motion
			// mDist: distance moved, with the origin at the nearest side of the next tile
			// eOffset: entity's offset from the colliding tile in case of collision
			var velocity, dir, sFront, mDist, eOffset;

			// [pStart, pEnd]: range of the tiles to be checked in the perpendicular axis
			var pStart, pEnd;

			// tilesTopass: number of tiles along the major axis passed by the entity's path of movement
			// resPos: if the entity collides with a tile, it is the major axis coordinate of the collision
			var tilesToPass, curTile, tile, resPos, corner, newVelocity, i, j, halfTileSize, slideFaceCoord;

			// Determine variable values according to axis
			if(onXAxis){
				velocity = entity.dx;
				mEntitySideA = entity.x;
				pEntitySideA = entity.y;

				mEntitySideB = entity.x + entity.w - 1;
				pEntitySideB = entity.y + entity.h - 1;

				mTileSize = tilemap.getTileWidth();
				pTileSize = tilemap.getTileHeight();
			}else{
				velocity = entity.dy;
				mEntitySideA = entity.y;
				pEntitySideA = entity.x;

				mEntitySideB = entity.y + entity.h - 1;
				pEntitySideB = entity.x + entity.w - 1;

				mTileSize = tilemap.getTileHeight();
				pTileSize = tilemap.getTileWidth();
			}

			if(velocity > 0){
				dir = 1;
				sFront = mEntitySideB;
				mDist = velocity - mTileSize + (sFront % mTileSize);
				eOffset = -1;
			}else{
				dir = -1;
				sFront = mEntitySideA;
				mDist = (-velocity) - (sFront % mTileSize) - 1;
				eOffset = mTileSize;
			}

			// Determine tile checking range
			pStart = Math.floor(pEntitySideA / pTileSize);
			pEnd = Math.floor(pEntitySideB / pTileSize);
			mStart = Math.floor(sFront / mTileSize);
			tilesToPass = Math.floor(mDist / mTileSize) + 1;

			// Detect collisions
			resPos = null;
			curTile = mStart;
			corner = NO_VALUE;

			for(i = 0; i < tilesToPass + 1; i++){
				for(j = pStart; j < pEnd + 1; j++){
					if(onXAxis === true){
						tile = tilemap.getTile(j, curTile);
					}else{
						tile = tilemap.getTile(curTile, j);
					}

					// Check if tile is passable
					if(tile !== null && tile.type > entity.passLevel){
						if(resPos === null){
							resPos = (curTile * mTileSize) + eOffset;
						}

						if(corner === NO_VALUE){
							corner = j;
						}
					}

				}

				if(resPos !== null){
					break;
				}

				curTile += dir;
			}

			// Collision Resolution
			if(resPos !== null){
				newVelocity = (resPos - sFront);

				if(newVelocity === 0 && slideDirection === 0){
					halfTileSize = pTileSize / 2;

					if(corner === pStart && (pEntitySideB % pTileSize) > halfTileSize){
						slideDirection = 1;
					}else
					if(corner === pEnd && (pEntitySideA % pTileSize) < halfTileSize){
						slideDirection = -1;
					}
				}

				if(slideDirection !== 0){
					if(onXAxis){
						entity.dy = (velocity * dir) * slideDirection;	
						entity.dx = 0;				
					}else{
						entity.dx = (velocity * dir) * slideDirection;
						entity.dy = 0;
					}

					slideDirection = 0;

					return handleCollisionFunc(tilemap, entity);
				}else{
					if(onXAxis){
						entity.dx = newVelocity;
					}else{
						entity.dy = newVelocity;
					}	
				}

				return true;
			}

			return false;

		}

		return handleCollisionFunc;
	
	})();


	function TilemapCollisionComponent(tilemap, entity){
		this._tilemap = tilemap;
		this._entity = entity;
	}


	TilemapCollisionComponent.prototype.handleTileCollision = function(){
		var en = this._entity;

		if(en.dx === 0 && en.dy === 0){
			return false;
		}

		if(en.dx !== 0){
			handleCollision(this._tilemap, en, true);
		}else{
			handleCollision(this._tilemap, en, false);
		}
		
		en.x += en.dx;
		en.y += en.dy;
	}

	window.KaboomBoy.TilemapCollisionComponent = TilemapCollisionComponent;

})();