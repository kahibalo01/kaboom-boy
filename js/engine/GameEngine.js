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

 	var DEFAULT_SCREEN_WIDTH = 640,
 		DEFAULT_SCREEN_HEIGHT = 480,
 		DEFAULT_SCALE = 1,
 		DEFAULT_FPS = 30;


 	function createCanvas(width, height){
 		var canvas = document.createElement("canvas");
 		canvas.width = width;
 		canvas.height = height;
 		return canvas;
 	}

 	/**
 	 *	Game Engine
 	 */
 	function GameEngine(fps, screenWidth, screenHeight, scale){

 		// Set defaults
 		screenWidth = (typeof screenWidth === "undefined" ? DEFAULT_SCREEN_WIDTH : screenWidth);
 		screenHeight = (typeof screenHeight === "undefined" ? DEFAULT_SCREEN_HEIGHT: screenHeight);
 		scale = (typeof scale === "undefined" ? DEFAULT_SCALE : scale);

 		this._fps = (typeof fps === "undefined" ? DEFAULT_FPS : fps);

		// Main canvas
		this._displayCanvas = createCanvas(screenWidth, screenHeight);
		this._displayContext = this._displayCanvas.getContext("2d");
		this._displayContext.imageSmoothingEnabled = false;

		// Backbuffer (for double buffering)
		this._bufferCanvas = createCanvas(Math.floor(screenWidth / scale), Math.floor(screenHeight / scale));
		this._bufferContext = this._bufferCanvas.getContext("2d");
		this._bufferContext.imageSmoothingEnabled = false;

 		// GameStateManager
 		this._gsm = new GameStateManager();
 	}


 	GameEngine.prototype.init = function(container){
 		container.appendChild(this._displayCanvas);
 	}


 	GameEngine.prototype.getMainCanvas = function(){
 		return this._displayCanvas;
 	} 


 	GameEngine.prototype.getGameStateManager = function(){
 		return this._gsm;
 	}


 	GameEngine.prototype.update = function(){
 		this._gsm.update();
 	}


 	GameEngine.prototype.render = function(){
 		this._bufferContext.clearRect(0, 0, this._bufferCanvas.width, this._bufferCanvas.height);
 		this._gsm.render(this._bufferContext);
 	}


 	GameEngine.prototype.renderToScreen = function(){
 		this._displayContext.clearRect(0, 0, this._displayCanvas.width, this._displayCanvas.height);
 		this._displayContext.drawImage(this._bufferCanvas, 0, 0, this._displayCanvas.width, this._displayCanvas.height);
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
	 				ge.renderToScreen();

	 				nextTime += msPerFrame;
	 				framesLastSecond++;
	 			}

	 			// Minute Timer / FPS counter
	 			if(nextMinute < timestamp){
	 				curFPS = framesLastSecond;
	 				framesLastSecond = 0;
	 				nextMinute += 1000;
	 				//console.log("FPS: " + curFPS);
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

 	// 
 	window.KaboomBoy.GameEngine = GameEngine;

 })(KaboomBoy.GameStateManager);