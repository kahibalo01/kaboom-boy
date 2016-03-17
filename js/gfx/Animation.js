(function(SpriteSheet){

	function Animation(spritesheet, baseX, baseY, numFrames, delay){
		this._spritesheet = spritesheet;
		this._baseX = baseX;
		this._baseY = baseY;

		this._spriteWidth = spritesheet.getSpriteWidth();
		this._spriteHeight = spritesheet.getSpriteHeight();

		this._numSequences = numFrames.length;
		this._sequences = [];
		this._currentSeqIndex = -1;
		this._currentSequence = null;

		this._playOnce = false;
		this._isFinished = false;
		this._paused = false;

		var i = 0;


		for(i = 0; i < numFrames.length; i++){
			this._sequences[i] = {
				numFrames: numFrames[i],
				delay: delay[i]
			}
		}

		this._delayCtr = 0;
		this._curFrame = 0;

		this.startSequence(0);
	}


	Animation.prototype.startSequence = function(seqIndex, playOnce, canRestart){
		canRestart = canRestart || false;

		if(seqIndex === this._currentSeqIndex && !canRestart){
			return false;
		}

		if(seqIndex > -1 && seqIndex < this._numSequences){
			this._currentSeqIndex = seqIndex;
			this._currentSequence = this._sequences[seqIndex];
			this._delayCtr = this._currentSequence.delay;
			this._curFrame = 0;
			this._playOnce = playOnce;
			this._isFinished = false;
			return true;
		}

		return false;
	}


	Animation.prototype.pause = function(){
		this._paused = true;
	}


	Animation.prototype.resume = function(){
		this._paused = false;
	}


	Animation.prototype.isFinished = function(){
		return this._isFinished;
	}


	Animation.prototype.update = function(){
		if(this._paused || this._isFinished){
			return;
		}

		this._delayCtr--;
		if(this._delayCtr < 0){
			this._delayCtr = this._currentSequence.delay;

			this._curFrame++;
			if(this._curFrame === this._currentSequence.numFrames){
				this._curFrame = 0;

				if(this._playOnce){
					this._isFinished = true;
				}
			}
		}
	}


	Animation.prototype.render = function(ctx, x, y){
		this._spritesheet.drawSpriteToContext(ctx, this._baseY + this._currentSeqIndex, this._curFrame, x, y);
	}


	window.KaboomBoy.Animation = Animation;

})(KaboomBoy.SpriteSheet);