(function(){

	/**
 	 *	Game State Manager
 	 */
 	 function GameStateManager(){
 	 	this._states = {};
 	 	this._currentState = null;
 	 }

 	 GameStateManager.prototype.addState = function(id, state){
 	 	if(typeof this._states[id] === "undefined"){
 	 		this._states[id] = state;
 	 	}

 	 	return this;
 	 }

 	 GameStateManager.prototype.removeState = function(id){
 	 	if(this._states[id]){
 	 		if(this._states[id] === this._currentState){
 	 			this._currentState = null;
 	 		}
 	 		delete this._states[id];
 	 	}

 	 	return this;
 	 }

 	 GameStateManager.prototype.loadState = function(id, reset){
 	 	if(this._states[id]){
 	 		this._currentState = this._states[id];

 	 		if(reset){
 	 			this._currentState.init();
 	 		}
 	 	}

 	 	return this;
 	 }

 	 GameStateManager.prototype.init = function(){
 	 	if(this._currentState){
 	 		this._currentState.init();
 	 	}
 	 }

 	 GameStateManager.prototype.update = function(){
 	 	if(this._currentState){
 	 		this._currentState.update();
 	 	}
 	 }

 	 GameStateManager.prototype.render = function(ctx){
 	 	if(this._currentState){
 	 		this._currentState.render(ctx);
 	 	}
 	 }

 	 window.KaboomBoy.GameStateManager = GameStateManager;


})();