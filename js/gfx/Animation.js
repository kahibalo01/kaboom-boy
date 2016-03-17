(function(SpriteSheet){

	var INDEFINITE = -1;

	function Animation(spritesheet, baseX, baseY, numFrames, delay){
		this._spritesheet = spritesheet;
		this._baseX = baseX;
		this._baseY = baseY;

		this._spriteWidth = spritesheet.getSpriteWidth();
		this._spriteHeight = spritesheet.getSpriteHeight();

		this._numSequences = numFrames.length;
		this._sequences = [];

		var i = 0;

		for(i = 0; i < numFrames.length; i++){
			this._sequences[i] = {
				numFrames: numFrames[i],
				delay: delay[i]
			}
		}
	}

	Animation.prototype.createHandle = function(){
		return new AnimationHandle(this);
	}


	function AnimationHandle(animation){
		this._animation = animation;

		this._currentSequenceIndex = -1;
		this._currentSequence;

		this._delayCtr = 0;
		this._curFrame = 0;

		this._timesToPlay = 0;
		this._paused = false;
	}

	AnimationHandle.prototype.INDEFINITE = INDEFINITE;

	AnimationHandle.prototype.setSequence = function(seqIndex, timesToPlay){
		if(seqIndex === this._currentSequenceIndex){
			return false;
		}

		if(seqIndex > -1 && seqIndex < this._animation._numSequences){
			this._currentSequenceIndex = seqIndex;
			this._currentSequence = this._animation._sequences[seqIndex];

			this._delayCtr = this._currentSequence.delay;
			this._curFrame = 0;

			this._timesToPlay = timesToPlay || INDEFINITE;
		}
	}


	AnimationHandle.prototype.pause = function(){
		this._paused = true;
	}

	AnimationHandle.prototype.unpause = function(){
		this._paused = false;
	}


	AnimationHandle.prototype.isFinished = function(){
		return (this._timesToPlay == 0);
	}


	AnimationHandle.prototype.update = function(){
		if(this._paused || this._timesToPlay === 0){
			return;
		}

		this._delayCtr--;
		if(this._delayCtr < 0){
			this._delayCtr = this._currentSequence.delay;

			this._curFrame++;
			if(this._curFrame === this._currentSequence.numFrames){
				this._curFrame = 0;

				if(this._timesToPlay !== INDEFINITE){
					this._timesToPlay--;
				}
			}
		}
	}


	AnimationHandle.prototype.render = function(ctx, x, y){
		this._animation._spritesheet.drawSpriteToContext(ctx, this._animation._baseY + this._currentSequenceIndex, this._curFrame, x, y);
	}


	window.KaboomBoy.Animation = Animation;

})(KaboomBoy.SpriteSheet);