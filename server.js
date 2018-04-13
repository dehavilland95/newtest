var express = require('express'); // Express contains some boilerplate to for routing and such
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); // Here's where we include socket.io as a node module 
var all_questions = {};

all_questions = { 
 0: {
    id: 1,
    question: 'Государство, являющееся одновременно и страной, и континентом.',
    answer1: 'Индия',
    answer2: 'Австралия',
    answer3: 'Мадагаскар',
    answer4: 'Гренландия',
    trueanswer: 'Австралия' },
  1: {
    id: 2,
    question: 'Река, на которой стоит Тауэрский мост в Лондоне?',
    answer1: 'Тибр',
    answer2: 'Сена',
    answer3: 'Темза',
    answer4: 'Дунай',
    trueanswer: 'Темза' },
  2: {
    id: 3,
    question: 'Объектом изучения футурологии является...',
    answer1: 'Насекомые',
    answer2: 'Климат',
    answer3: 'Вулканы',
    answer4: 'Будущее',
    trueanswer: 'Будущее' },
  3: {
    id: 4,
    question: 'Назовите столицу Бельгии',
    answer1: 'Брюссель',
    answer2: 'Амстердам',
    answer3: 'Будапешт',
    answer4: 'Мадрид',
    trueanswer: 'Брюссель' },
  4: {
    id: 5,
    question: 'В каком веке нашей эры был основан город Киев?',
    answer1: 'VI',
    answer2: 'IV',
    answer3: 'II',
    answer4: 'X',
    trueanswer: 'VI' } };

// Serve the index page 
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/index.html'); 
});

// Serve the assets directory
app.use('/assets',express.static('assets'))
app.use('/js',express.static('js'))

// Listen on port 5000
app.set('port', (8000));
http.listen(app.get('port'), function(){
  console.log('listening on port',app.get('port'));
});

var players_list = {};
var player_one = '';
var player_two = '';
var questions = {};
var room = {};

io.on('connection', function(socket){

	socket.on('want_play',function(){
		if(player_one){
			player_two = socket.id;

			key = player_one + '' + player_two;

			players_list[player_one] = {key:key};
			players_list[player_two] = {key:key};
			
		    room[key] = {questions:all_questions};
		    room[key].p1_id = player_one;
		    room[key].p2_id = player_two;

		    room[key].p1_s = 0;
		    room[key].p2_s = 0;

		    room[key].p1_answer_num = 0;
		    room[key].p2_answer_num = 0;
		    
		    room[key].ques_num = 0;
		    room[key].last_time = Date.now();
		    room[key].time_check = true;
		    room[key].p1_answer_checker = true; 
		    room[key].p2_answer_checker = true; 

		    console.log(room[key].questions[0]);

		    first_pack = {question:room[key].questions[0].question};
		    first_pack.answer1 = room[key].questions[0].answer1;
		    first_pack.answer2 = room[key].questions[0].answer2;
		    first_pack.answer3 = room[key].questions[0].answer3;
		    first_pack.answer4 = room[key].questions[0].answer4;

		   	io.to(player_one).emit('get_play',{key:key, first_pack: first_pack});
			io.to(player_two).emit('get_play',{key:key, first_pack: first_pack});

			player_one = null;
			player_two = null;

		}else{
			player_one = socket.id;
		}
	});

	socket.on('answered',function(answer){

		if(room[answer.key].time_check){

			if(socket.id == room[answer.key].p1_id){

				if(room[answer.key].p1_answer_checker){

				room[key].p1_answer_num += 1;
				if(room[answer.key].questions[room[key].ques_num].trueanswer == answer.answer){
					room[key].p1_s += 1;
					io.to(socket.id).emit('your_answer', {result: 'yes', question_num:room[key].ques_num});
					io.to(room[answer.key].p2_id).emit('adversary_result', {result: 'yes', question_num:room[key].ques_num});
				}else{
					io.to(socket.id).emit('your_answer',{result: 'no', question_num:room[key].ques_num});
					io.to(room[answer.key].p2_id).emit('adversary_result', {result: 'no', question_num:room[key].ques_num});
				}
					room[answer.key].p1_answer_checker = false;

					if(room[answer.key].p1_answer_checker === false && 
						room[answer.key].p2_answer_checker === false ){
						
						room[key].time_check = false;
				  		room[key].last_time = null;
				  		new_question_func(key);
					}
				}
			}else if(socket.id == room[answer.key].p2_id){

				if(room[answer.key].p2_answer_checker){

				room[key].p2_answer_num += 1;
				if(room[answer.key].questions[room[key].ques_num].trueanswer == answer.answer){
					room[key].p2_s += 1;
					io.to(socket.id).emit('your_answer', {result: 'yes', question_num:room[key].ques_num});
					io.to(room[answer.key].p1_id).emit('adversary_result', {result: 'yes', question_num:room[key].ques_num});
				}else{
					io.to(socket.id).emit('your_answer',{result: 'no', question_num:room[key].ques_num});
					io.to(room[answer.key].p1_id).emit('adversary_result', {result: 'no', question_num:room[key].ques_num});
				}
					room[answer.key].p2_answer_checker = false;
					if(room[answer.key].p1_answer_checker === false && 
						room[answer.key].p2_answer_checker === false ){
						
						room[key].time_check = false;
				  		room[key].last_time = null;
				  		new_question_func(key);
					}
				}
			}
		}

	});

	socket.on('disconnect',function(state){
		if(players_list[socket.id]){
			
		}
	});


});

function new_question_func(key){

	room[key].ques_num += 1;

	if(room[key].ques_num < 5){

	new_question = room[key].questions[room[key].ques_num].question;

	new_pack = {question:new_question};
    new_pack.answer1 = room[key].questions[room[key].ques_num].answer1;
    new_pack.answer2 = room[key].questions[room[key].ques_num].answer2;
    new_pack.answer3 = room[key].questions[room[key].ques_num].answer3;
    new_pack.answer4 = room[key].questions[room[key].ques_num].answer4;

	io.to(room[key].p1_id).emit('new_question', new_pack);
	io.to(room[key].p2_id).emit('new_question', new_pack);

	room[key].p1_answer_checker = true;
	room[key].p2_answer_checker = true;
	room[key].time_check = true;

	room[key].last_time = Date.now();
	
	}else{
		io.to(room[key].p1_id).emit('game_over', {your_score:room[key].p1_s, enemy_score:room[key].p2_s});
		io.to(room[key].p2_id).emit('game_over', {your_score:room[key].p2_s, enemy_score:room[key].p1_s});
	}
}


function timer(){
	  for(var key in room){
	  	if(room[key].last_time !== null){
		  	newtimestemp = Date.now();
		  	if(newtimestemp - room[key].last_time >= 15000){
		  		room[key].time_check = false;
		  		room[key].last_time = null;
		  		new_question_func(key);
		  	}
		}
	}
}

setInterval(timer, 1000); 