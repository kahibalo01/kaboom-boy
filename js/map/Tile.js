(function(){

	function Tile(life, resistance, destructionDelay){
		this.life = life;
		this.resistance = resistance;

		this.destructionDelay = destructionDelay;
		this.destructionCountdown = 0;
	}


	Tile.prototype.explodeTile = function(){
		this.destructionCountdown = this.destructionDelay;
	}


	Tile.prototype.update = function(){
		if(this.destructionCountdown > 0 && this.life > 0){
			this.destructionCountdown--;

			if(this.destructionCountdown === 0){
				this.life--;
			}
		}
	}


	Tile.prototype.isDestroyed = function(){
		return (this.life === 0);
	}


})();