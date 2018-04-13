var time;
var checked_var;
var Game = {

  preload: function(){
    game.load.image('background', 'assets/background.png');
    game.load.image('button_bg', 'assets/button_bg.png');
    game.load.image('button_bg_right', 'assets/button_bg_right.png');
    game.load.image('button_bg_miss', 'assets/button_bg_miss.png');
    game.load.image('question_bg', 'assets/question_bg.png');
    game.load.image('results_table', 'assets/results_table.png');
    game.load.image('miss', 'assets/miss.png');
    game.load.image('success', 'assets/success.png');
  },  
  create: function(){
    game.add.image(0, 0, 'background');
    question_bg = game.add.image(300, 210, 'question_bg');
    bg_1 = game.add.image(310, 330, 'button_bg');
    bg_2 = game.add.image(310, 420, 'button_bg');
    bg_3 = game.add.image(600, 330, 'button_bg');
    bg_4 = game.add.image(600, 420, 'button_bg');
    game.add.image(85, 55, 'results_table');

    game.add.text(100, 35, 'ВЫ', { font: "16px Arial", fill: "white", align: "right" });
    game.add.text(153, 35, 'СОПЕРНИК', { font: "16px Arial", fill: "white", align: "right" });

    one_q = game.add.text(80, 480, 'I', { font: "30px Arial", fill: "white", align: "right" });
    two_q = game.add.text(70, 435, 'II', { font: "30px Arial", fill: "white", align: "right" });
    thre_q = game.add.text(65, 390, 'III', { font: "30px Arial", fill: "white", align: "right" });
    four_q = game.add.text(60, 340, 'IV', { font: "30px Arial", fill: "white", align: "right" });
    five_q = game.add.text(70, 295, 'V', { font: "30px Arial", fill: "white", align: "right" });
    six_q = game.add.text(60, 245, 'VI', { font: "30px Arial", fill: "white", align: "right" });
    seven_q = game.add.text(55, 200, 'VII', { font: "30px Arial", fill: "white", align: "right" });
    eight_q = game.add.text(45, 155, 'VIII', { font: "30px Arial", fill: "white", align: "right" });
    nine_q = game.add.text(60, 105, 'IX', { font: "30px Arial", fill: "white", align: "right" });
    ten_q = game.add.text(70, 60, 'X', { font: "30px Arial", fill: "white", align: "right" });

    one_q.setShadow(2, 2, "#272822", 1, true, true);
    two_q.setShadow(2, 2, "#272822", 1, true, true);
    thre_q.setShadow(2, 2, "#272822", 1, true, true);
    four_q.setShadow(2, 2, "#272822", 1, true, true);
    five_q.setShadow(2, 2, "#272822", 1, true, true);
    six_q.setShadow(2, 2, "#272822", 1, true, true);
    seven_q.setShadow(2, 2, "#272822", 1, true, true);
    eight_q.setShadow(2, 2, "#272822", 1, true, true);
    nine_q.setShadow(2, 2, "#272822", 1, true, true);
    ten_q.setShadow(2, 2, "#272822", 1, true, true);

    bg_right = game.add.image(310, -330, 'button_bg_right');
    bg_miss = game.add.image(310, -330, 'button_bg_miss');

    question_bg.height = 110;


    socket.on('game_over', function(data){
      clearInterval(intid);
      game_over_bg = game.add.image(0, 0, 'background');
      total_score = game.add.text(430, 340, '' + data.your_score+' - '+ data.enemy_score+'', { font: "30px Arial", fill: "white", align: "right" });
      if(data.your_score > data.enemy_score){
        result = game.add.text(380, 300, 'ПОБЕДА', { font: "20px Arial", fill: "white", align: "right" });
      }else if(data.your_score < data.enemy_score){
        result = game.add.text(350, 300, 'ВЫ ПРОИГРАЛИ', { font: "20px Arial", fill: "white", align: "right" });
      }else if(data.your_score == data.enemy_score){
        result = game.add.text(380, 300, 'НИЧЬЯ', { font: "20px Arial", fill: "white", align: "right" });
      }
      result.anchor.setTo(0.5);
      result.x = 480;
      total_score.anchor.setTo(0.5);
      total_score.x = 480;
      result.setShadow(2, 2, "#272822", 1, true, true);
   
    });
    
    socket.on('new_question',function(data){

      if(bg_1.y < 0){
          bg_1.y = 330;
        }else if(bg_2.y < 0){
          bg_2.y = 420;
        }else if(bg_3.y < 0){
          bg_3.y = 330;
        }else if(bg_4.y < 0){
          bg_4.y = 420;
      }
      
      if(bg_right.y > 0){
        bg_right.y = -400;
      }else if(bg_miss.y > 0){
        bg_miss.y = -400;
      }
      
      checked_var = null;

      clearInterval(intid);
      intid = setInterval(functime, 1000);
      time = 15;
      functime();
      question.text = data.question;
      answer1.text = data.answer1;
      answer2.text = data.answer2;
      answer3.text = data.answer3;
      answer4.text = data.answer4;
    });

    socket.on('your_answer',function(data){
      if(data.result == 'yes'){

        if(data.question_num == 0){
          first_ques_result = game.add.image(105, 480, 'success');
        }else if(data.question_num == 1){
          second_ques_result = game.add.image(105, 430, 'success');
        }else if(data.question_num == 2){
          third_ques_result = game.add.image(105, 385, 'success');
        }else if(data.question_num == 3){
          fourth_ques_result = game.add.image(105, 340, 'success');
        }else if(data.question_num == 4){
          fifth_ques_result = game.add.image(105, 295, 'success');
        } 

        if(checked_var == 1){
          bg_1.y = -330;
          bg_right.x = 310;
          bg_right.y = 330;
        }else if(checked_var == 2){
          bg_2.y = -420;
          bg_right.x = 310;
          bg_right.y = 420;
        } else if(checked_var == 3){
          bg_3.y = -330;
          bg_right.x = 600;
          bg_right.y = 330;
        }else if(checked_var == 4){
          bg_4.y = -420;
          bg_right.x = 600;
          bg_right.y = 420;
        }
      }else if(data.result == 'no'){

        if(data.question_num == 0){
          first_ques_result = game.add.image(105, 480, 'miss');
        }else if(data.question_num == 1){
          second_ques_result = game.add.image(105, 430, 'miss');
        }else if(data.question_num == 2){
          third_ques_result = game.add.image(105, 385, 'miss');
        }else if(data.question_num == 3){
          fourth_ques_result = game.add.image(105, 340, 'miss');
        }else if(data.question_num == 4){
          fifth_ques_result = game.add.image(105, 295, 'miss');
        } 

        if(checked_var == 1){
          bg_1.y = -330;
          bg_miss.x = 310;
          bg_miss.y = 330;
        }else if(checked_var == 2){
          bg_2.y = -420;
          bg_miss.x = 310;
          bg_miss.y = 420;
        } else if(checked_var == 3){
          bg_3.y = -330;
          bg_miss.x = 600;
          bg_miss.y = 330;
        }else if(checked_var == 4){
          bg_4.y = -420;
          bg_miss.x = 600;
          bg_miss.y = 420;
        }
      }
    });

    socket.on('adversary_result',function(data){

      if(data.result == 'yes'){
        if(data.question_num == 0){
          adv_first_ques_result = game.add.image(160, 480, 'success');
        }else if(data.question_num == 1){
          adv_second_ques_result = game.add.image(160, 430, 'success');
        }else if(data.question_num == 2){
          adv_third_ques_result = game.add.image(160, 385, 'success');
        }else if(data.question_num == 3){
          adv_fourth_ques_result = game.add.image(160, 340, 'success');
        }else if(data.question_num == 4){
          adv_fifth_ques_result = game.add.image(160, 295, 'success');
        } 
      
      }else if(data.result == 'no'){
        if(data.question_num == 0){
          adv_first_ques_result = game.add.image(160, 480, 'miss');
        }else if(data.question_num == 1){
          adv_second_ques_result = game.add.image(160, 430, 'miss');
        }else if(data.question_num == 2){
          adv_third_ques_result = game.add.image(160, 385, 'miss');
        }else if(data.question_num == 3){
          adv_fourth_ques_result = game.add.image(160, 340, 'miss');
        }else if(data.question_num == 4){
          adv_fifth_ques_result = game.add.image(160, 295, 'miss');
        } 
      }
    });
    
    question = game.add.text(350, 235, first_pack.first_pack.question, { fontSize: '16px', fill: 'white', wordWrap: true, wordWrapWidth: 500 });
    
    answer1 = game.add.text(390, 365, first_pack.first_pack.answer1, { font: "16px Arial", fill: "white", align: "right" });
    answer1.inputEnabled = true; // reason why it is clickable
    answer1.events.onInputUp.add(this.clickone, this);
   
    answer2 = game.add.text(390, 450, first_pack.first_pack.answer2, { font: "16px Arial", fill: "white", align: "right" });
    answer2.inputEnabled = true; // reason why it is clickable
    answer2.events.onInputUp.add(this.clicktwo, this);
   
    answer3 = game.add.text(680, 365, first_pack.first_pack.answer3, { font: "16px Arial", fill: "white", align: "right" });
    answer3.inputEnabled = true; // reason why it is clickable
    answer3.events.onInputUp.add(this.clickthre, this);
   
    answer4 = game.add.text(680, 450, first_pack.first_pack.answer4, { font: "16px Arial", fill: "white", align: "right" });
    answer4.inputEnabled = true; // reason why it is clickable
    answer4.events.onInputUp.add(this.clickfour, this);

    intid = setInterval(functime, 1000);
    time = 15;
    timer = game.add.text(550, 150, time, { font: "30px Arial", fill: "white", align: "right" });
    function functime() {
        time --;
        if(time == 0){
            clearInterval(intid);
        }
    } 
  }, 

  clickone: function (){
       socket.emit('answered', {key:key,answer:answer1.text});
       checked_var = 1;
   },
   clicktwo: function (){
       socket.emit('answered', {key:key,answer:answer2.text});
       checked_var = 2;
   },
   clickthre: function (){
       socket.emit('answered', {key:key,answer:answer3.text});
       checked_var = 3;
   },
   clickfour: function (){
       socket.emit('answered', {key:key,answer:answer4.text});
       checked_var = 4;
   },

  update: function (){
    timer.setText(time);
  }
  
};