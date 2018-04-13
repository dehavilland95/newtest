var key = '';
var first_pack = {};
var Search = {

  preload: function(){     
  	game.stage.backgroundColor = "#3399DA";
  },

  create: function(){
    game.add.image(0, 0, 'background');
  	search_title = game.add.text(350, 200, "ИЩЕМ ДЛЯ ВАС СОПЕРНИКА", { font: "16px Arial", fill: "white", align: "right" });
  	search_title.setShadow(2, 2, "#272822", 1, true, true);

    document.getElementById("circularG").style.display = 'block';

    socket.emit('want_play');
  	socket.on('get_play',function(data){
  		key = data.key;
  		first_pack = data;
      document.getElementById("circularG").style.display = 'none';
  		game.state.start('Game');
  	});
  },
  
  update: function() {
  	
  }
   
};