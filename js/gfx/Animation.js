(function(SpriteSheet){


	function Animation(spritesheet, numFrames, delay){
		this._spritesheet = spritesheet;

		this._spriteWidth = spritesheet.getSpriteWidth();
		this._spriteHeight = spritesheet.getSpriteHeight();

		this._numSequence = numFrames.length;
		this._sequences = [];
		this._currentSequenceIndex;
		this._currentSequence;

		for(var i = 0; i < numFrames.length; i++){
			this._sequences[i] = {
				numFrames: numFrames[i],
				delay: delay[i]
			};
		}

		this._delayCtr = 0;
		this._curFrame = 0;
		this._sequenceY = 0;

		this.setSequence(0);
	}


	Animation.prototype.setSequence = function(i){
		if(i !== this._currentSequenceIndex && i > -1 && i < this._numSequence){
			this._currentSequenceIndex = i;
			this._delayCtr = 0;
			this._curFrame = 0;
			this._sequenceY = this._spriteHeight * i;
			this._currentSequence = this._sequences[i];
		}
	}


	Animation.prototype.update = function(){
		if(this._delayCtr === 0){
			this._delayCtr = this._currentSequence.delay;
			this._curFrame++;

			if(this._curFrame > this._currentSequence.numFrames - 1){
				this._curFrame = 0;
			}

		}else{
			this._delayCtr--;
		}
	}


	Animation.prototype.render = function(ctx, x, y){
		this._spritesheet.drawSpriteToContext(ctx, this._currentSequenceIndex, this._curFrame, x, y);
	}

	window.KaboomBoy.Animation = Animation;

})(KaboomBoy.SpriteSheet);