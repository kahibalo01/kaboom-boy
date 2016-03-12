/**
 *
 *
 */
(function(Defines, Entity, TilemapCollisionComponent){

	var directions = [Defines.LEFT, Defines.UP, Defines.RIGHT, Defines.DOWN];
	var BOMBER_DEFAULT_SPEED = 2;

	function Bomber(values, tilemap){
		Entity.call(this, values.x, values.y, values.w, values.h);

		this._input = values.inputhandler || null;
		this._tilemap = tilemap;
		this._tilemapCollisionComponent = new TilemapCollisionComponent(tilemap, this);

		// Movement
		this.speed = values.speed || BOMBER_DEFAULT_SPEED;
		this._direction = 0;
		this.passLevel = 0;
	}

	Bomber.prototype = new Entity();

	Bomber.prototype.handleInput = function(){
		// Changing directions
		this._direction = 0;
		
		if(this._input.isDown(Defines.LEFT)){
			this._direction = Defines.LEFT;
		}else
		if(this._input.isDown(Defines.UP)){
			this._direction = Defines.UP;
		}else
		if(this._input.isDown(Defines.RIGHT)){
			this._direction = Defines.RIGHT;
		}else
		if(this._input.isDown(Defines.DOWN)){
			this._direction = Defines.DOWN;
		}


	}

	Bomber.prototype.update = function(){
		this.handleInput();

		// Update Map position
		this.dx = this.dy = 0;
		switch(this._direction){
			case Defines.LEFT: this.dx = -this.speed; break;
			case Defines.UP: this.dy = -this.speed; break;
			case Defines.RIGHT: this.dx = this.speed; break;
			case Defines.DOWN: this.dy = this.speed; break;
			default: break;
		}

		this._tilemapCollisionComponent.handleTileCollision();
		//this.x += this.dx;
		//this.y += this.dy;

		
	}

	Bomber.prototype.render = function(ctx){
		var hitbox = this.getHitbox();

		ctx.fillRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
	}

	window.KaboomBoy.Bomber = Bomber;


})(KaboomBoy.Defines, KaboomBoy.Entity, KaboomBoy.TilemapCollisionComponent);