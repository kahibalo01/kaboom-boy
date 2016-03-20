(function(SpriteSheet){

	var INDEFINITE = -1;

	/**
	 * Animation manager
	 */
	function Animation(spritesheet, animationData){
		this._spritesheet = spritesheet;

		// Add code to check for undefined and invalid values in animationData

		this._colBase = animationData.colBase || 0;
		this._rowBase = animationData.rowBase || 0;

		this._numSequences = animationData.numFrames.length;
		this._sequences = [];

		var i = 0,
			numFrames = animationData.numFrames,
			speed = animationData.speed;

		for(i = 0; i < numFrames.length; i++){
			this._sequences[i] = {
				numFrames: numFrames[i],
				speed: speed[i]
			}
		}
	}

	
	Animation.prototype.createHandle = function(){
		return new AnimationHandle(this);
	}


	/**
	 * A handle for an Animation data object.
	 * Supports:
	 *		- playing an animation sequence a definite/indefinite number of times
	 *		- pausing/unpausing an animation
	 *		- manual advance to next frame
	 */
	function AnimationHandle(animation){
		this._animation = animation;

		this.currentSequenceIndex = 0;
		this.currentFrame = 0;

		this._currentSequence = null;
		this._finishCallback = null;

		this._delay = 0;
		this._timesToPlay = 0;
	}



	AnimationHandle.prototype.INDEFINITE = INDEFINITE;

	/**
	 *	Sets the animation sequence to the provided `seqIndex`. Note that calling this method
	 *	will turn back the current frame to 0.
	 *
	 */
	AnimationHandle.prototype.setSequence = function(seqIndex, timesToPlay, callback){

		if(seqIndex > -1 && seqIndex < this._animation._numSequences){
			this.currentSequenceIndex = seqIndex;
			this._currentSequence = this._animation._sequences[seqIndex];

			this._delay = this._currentSequence.speed;
			this.currentFrame = 0;

			this._timesToPlay = (timesToPlay < 0 ? INDEFINITE: timesToPlay);


			if(this._timesToPlay > 0){
				this._finishCallback = callback;
			}else{
				this._finishCallback = null;
			}

		}
	}


	AnimationHandle.prototype.nextFrame = function(){
		this.currentFrame = (this.currentFrame + 1) % this._currentSequence.numFrames;
	}


	AnimationHandle.prototype.pause = function(){
		this._paused = true;
		return this;
	}


	AnimationHandle.prototype.unpause = function(){
		this._paused = false;
		return this;
	}


	// Check later, please.
	// Seems to be working
	AnimationHandle.prototype.update = function(){
		if(this._paused || this._timesToPlay === 0){
			return;
		}

		this._delay--;
		if(this._delay === 0){
			this.currentFrame++;

			if(this.currentFrame === this._currentSequence.numFrames){
				this.currentFrame = 0;

				if(this._timesToPlay !== INDEFINITE){
					this._timesToPlay--;
				
					if(this._timesToPlay === 0 && this._finishCallback !== null){
						this._finishCallback();
						return;
					}
				}
				
			}

			this._delay = this._currentSequence.speed;
		}

	}




	AnimationHandle.prototype.render = function(ctx, x, y){
		this._animation._spritesheet.drawSpriteToContext(ctx, this._animation._rowBase + this.currentSequenceIndex, this._animation._colBase + this.currentFrame, x, y);
	}


	window.KaboomBoy.Animation = Animation;

})(KaboomBoy.SpriteSheet);