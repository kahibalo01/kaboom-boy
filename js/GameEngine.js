/* 
 * GameEngine for Bomberboy	
 *
 *
 *
 *
 *
 */
 (function(){

 	window.Bomberboy = {};
 	window.requestAnimationFrame = window.requestAnimationFrame || null;

 	/**
 	 *	Game Engine
 	 */
 	function GameEngine(){
 		this._fps = 60;
 	}

 	GameEngine.prototype.run = function(){
 		var ge = this;

 		// FPS regulation
 		var nextTime = 0,
 			msPerFrame = Math.floor(1000 / this._fps);

 		// Minute Timer / FPS counter
 		var nextMinute = 0,
 			framesLastSecond = 0,
 			curFPS = 0;

 		var gameloop = (function(){

 			var loop = function(timestamp){
 				// If Game Tick should happen
	 			if(nextTime < timestamp){
	 				// Game Tick

	 				nextTime += msPerFrame;
	 				framesLastSecond++;
	 			}

	 			// Minute Timer / FPS counter
	 			if(nextMinute < timestamp){
	 				curFPS = framesLastSecond;
	 				framesLastSecond = 0;
	 				nextMinute += 1000;
	 				console.log(curFPS);
	 			}

	 			requestAnimationFrame(loop);
	 		}

	 		return function(timestamp){
	 			loop.call(ge, timestamp);
	 		}

 		})();

 		// Start running
 		requestAnimationFrame(gameloop);

 	}



 	/**
 	 *	Game State Manager
 	 */
 	 function GameStateManager(){
 	 	
 	 }

 	 GameStateManager.prototype.addState = function(){

 	 }

 	 GameStateManager.prototype.removeState = function(){

 	 }

 	 GameStateManager.prototype.loadState = function(){

 	 }

 	 GameStateManager.prototype.changeState = function(){

 	 }

 	 GameStateManager.prototype.init = function(){

 	 }

 	 GameStateManager.prototype.update = function(){

 	 }

 	 GameStateManager.prototype.render = function(){
 	 	
 	 }

 	window.Bomberboy.GameEngine = GameEngine;

 })();