/**
 *
 *
 */
(function(Defines, Entity, TilemapCollisionComponent, Spritesheet, Animation){

	var directions = [Defines.LEFT, Defines.UP, Defines.RIGHT, Defines.DOWN],
		BOMBER_DEFAULT_SPEED = 2,
		
		// Animation
		IDLE = 0,
		MOVING_LEFT = 2,
		MOVING_RIGHT = 1,
		MOVING_UP = 4,
		MOVING_DOWN = 3;


	function Bomber(values){
		Entity.call(this, values.x, values.y, values.w, values.h);

		this._input = values.input || null;
		this._tilemap = values.tilemap;
		this._tilemapCollisionComponent = new TilemapCollisionComponent(values.tilemap, this);

		// Movement
		this.speed = values.speed || BOMBER_DEFAULT_SPEED;
		this._direction = 0;
		this.passLevel = 0;

		// Animation
		this._animation = new Animation(new Spritesheet(values.sprites, 20, 20), 
			[1, 7, 7, 2, 2],
			[0, 3, 3, 12, 12]
		);
	}

	Bomber.prototype = new Entity();

	Bomber.prototype.handleInput = function(){
		// Changing directions
		this._direction = 0;
		
		if(this._input.isDown(Defines.LEFT)){
			this._direction = Defines.LEFT;
			this._animation.setSequence(MOVING_LEFT);
		}else
		if(this._input.isDown(Defines.UP)){
			this._direction = Defines.UP;
			this._animation.setSequence(MOVING_UP);
		}else
		if(this._input.isDown(Defines.RIGHT)){
			this._direction = Defines.RIGHT;
			this._animation.setSequence(MOVING_RIGHT);
		}else
		if(this._input.isDown(Defines.DOWN)){
			this._direction = Defines.DOWN;
			this._animation.setSequence(MOVING_DOWN);
		}else{
			this._animation.setSequence(IDLE);
		}


	}

	Bomber.prototype.update = function(){
		this.handleInput();
		this._animation.update();

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

		//ctx.fillRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
		this._animation.render(ctx, this.x, this.y);
	}

	window.KaboomBoy.Bomber = Bomber;


})(KaboomBoy.Defines, KaboomBoy.Entity, KaboomBoy.TilemapCollisionComponent, KaboomBoy.Spritesheet, KaboomBoy.Animation);