(function(){

	/**
	 *	An Entity represents a rectangular object
	 */
	function Entity(x, y ,w, h){
		// Position
		this.x = x;
		this.y = y;

		// Velocity
		this.dx = 0;
		this.dy = 0;

		// Dimensions
		this.w = w;
		this.h = h;

		// Drawing
		this._visible = true;
	}

	/**
	 * @return An object defining the hitbox of the entity.
	 */
	Entity.prototype.getHitbox = function(){
		return {
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.h
		};
	}


	/**
	 *	
	 */
	Entity.prototype.collidesWith = function(oEntity){
		return !(this.x > oEntity.x + oEntity.w || oEntity.x > this.x + this.w ||
				 this.y > oEntity.y + oEntity.h || oEntity.y > this.y + this.h);
	}

	window.KaboomBoy.Entity = Entity;
	
})();