/* 
 * GameEngine for Bomberboy	
 *
 *
 *
 *
 *
 */
 (function(GameStateManager){

 	window.requestAnimationFrame = window.requestAnimationFrame || null;

 	/**
 	 *	Game Engine
 	 */
 	function GameEngine(container){
 		this._fps = 60;

 		this._canvas = document.createElement("canvas");
 		this._canvas.width = 800;
 		this._canvas.height = 600;
 		container.appendChild(this._canvas);
 		this._ctx = this._canvas.getContext("2d");

 		// GameStateManager
 		this._gsm = new GameStateManager();
 	}

 	GameEngine.prototype.getGameStateManager = function(){
 		return this._gsm;
 	}

 	GameEngine.prototype.update = function(){
 		this._gsm.update();
 	}

 	GameEngine.prototype.render = function(){
 		this._gsm.render(this._ctx);
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
	 				ge.update();
	 				ge.render();

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

 	window.KaboomBoy.GameEngine = GameEngine;

 })(KaboomBoy.GameStateManager);