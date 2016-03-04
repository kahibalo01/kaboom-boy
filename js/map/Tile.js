(function(){

	/**
	 *	The basic unit of a tilemap
	 */
	function Tile(index, type){
		this.index = index;
		this.type = type;
	}

	window.KaboomBoy.Tile = Tile;

})();