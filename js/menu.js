var Menu = {

  preload: function(){     
  	game.load.image('background', 'assets/background.png');
  },

  create: function(){
    game.add.image(0, 0, 'background');
    gogame = game.add.text(425, 400, "Играть", { font: "25px Arial", fill: "white", align: "right" });
    gogame.setShadow(2, 2, "#272822", 1, true, true);
    gogame.inputEnabled = true; 
    gogame.events.onInputUp.add(this.play_function, this);
  },
  play_function:function  (){
    game.state.start('Search');
  },
  update: function() {
  	
  }
   
};