class Saper {
	constructor () {
		this.checkTile = this.checkTile.bind(this);
		this.clear = this.clear.bind(this);
		this.setup = this.setup.bind(this);
		this.clickTile = this.clickTile.bind(this);
		this.endGame = this.endGame.bind(this);
		this.checkVictory = this.checkVictory.bind(this);
		this.size = 10;    //начальное количество блоков 10/10
		this.bombFrequency = 0.2; //Частота появления бомб
		this.tileSize = 50;        //размер плиток

		this.board = document.querySelector('.board'); //переменная содержащая ссылку на элемент - доску 
	
		this.tiles; //массив всех плиток (содержит координаты)

		this.restartBtn = document.querySelector('.minesweeper-btn'); //кнопка (Переиграть)  
		this.endscreen = document.querySelector('.endscreen'); //блок результата(победа, поражение)   

		this.theBest = document.querySelector('.bestbtn');   //кнопка лучших результатов

		this.boardSizeBtn1 = document.getElementById('range1');
		this.boardSizeBtn2 = document.getElementById('range2');
		this.boardSizeBtn3 = document.getElementById('range3');

		this.difficultyBtns = document.querySelectorAll('.difficulty'); //хранит ссылки всех трёх кнопок уровней сложности

		this.bombs = [];     //массив бомб
		this.numbers = [];   //массив цифр
		this.numberColors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f1c40f', '#1abc9c', '#34495e', '#7f8c8d',]; //цвета цифр
		this.endscreenContent = {win: '<span>А ты хорош(а)!</span>', lose: 'Вы были подорваны('};
		
		this.gameOver = false;
		
		this.tilefirst = false;  //для проверки первого блока
		//время
		this.minutesBlock = document.querySelector('.js-minutes');
		this.secondsBlock = document.querySelector('.js-seconds');

		this.interval; //переменная отвечающая за интервал времени вызова функции, она используется, чтобы делать остановки clearInterval(this.interval); если бы этого не было бы то можно было бы её не использовать
		this.minutes = 0;
		this.seconds = 0;
		this.tileTime = false;

		//лучший результат
		this.easyEightMinutes = 0;
		this.easyTenMinutes = 0;
		this.easySixteenMinutes = 0;
		this.normalEightMinutes = 0;
		this.normalTenMinutes = 0;
		this.normalSixteenMinutes = 0;
		this.hardEightMinutes = 0;
		this.hardTenMinutes = 0;
		this.hardSixteenMinutes = 0;

		this.easyEightSeconds = 0;
		this.easyTenSeconds = 0;
		this.easySixteenSeconds = 0;
		this.normalEightSeconds = 0;
		this.normalTenSeconds = 0;
		this.normalSixteenSeconds = 0;
		this.hardEightSeconds = 0;
		this.hardTenSeconds = 0;
		this.hardSixteenSeconds = 0;
	}
	
	startTimer = () => {        //таймер, правельная постановка времени
		this.seconds++;
		if (this.seconds <= 9){
			this.secondsBlock.innerHTML = '0' + this.seconds;
		}
		if (this.seconds > 9){
			this.secondsBlock.innerHTML = this.seconds;
		}
		if (this.seconds > 59){
			this.minutes++;
			this.minutesBlock.innerHTML = '0' + this.minutes;
			this.seconds = 0;
			this.secondsBlock.innerHTML = '0' + this.seconds;
		}
		if (this.minutes > 9){
			this.minutesBlock.innerHTML = this.minutes;
		}
	}

	//querySelectorAll(тип) - возвращает все элементы типа
	clear () {  //очищает игровое поле и сбрасывает все переменные и массивы
		this.gameOver = false;
		this.bombs = [];
		this.numbers = [];
		this.endscreen.innerHTML = ''; //пустой текст
		this.endscreen.classList.remove('show'); //удаляет класс 
		this.tiles.forEach(tile => {  //перебор и удаление всех плиток
			tile.remove();
		});
		this.tilefirst = false;
		this.tileTime = false;
		this.seconds = 0;
		this.minutes = 0;
		this.secondsBlock.innerHTML = '00';
		this.minutesBlock.innerHTML = '00';
		clearInterval(this.interval);
		this.setup();
	}

	setup () {        //создает игровое поле с плитками и расставляет бомбы и числа на поле
		for (let i = 0; i < Math.pow(this.size, 2); i++) {
			const tile = document.createElement('div');   //добавление контейнера ввиде плитки
			tile.classList.add('tile');                   //добавление класса div-у плитки
			this.board.appendChild(tile);
		}
		this.tiles = document.querySelectorAll('.tile');
		this.board.style.width = this.size * this.tileSize + 'px';
		
		document.documentElement.style.setProperty('--tileSize', `${this.tileSize}px`);
		
		let x = 0;
		let y = 0;
		this.tiles.forEach((tile) => {          //forEach вызывает для каждой плитки функцию и смотрит где бомбы, а где цифры
			tile.setAttribute('data-tile', `${x},${y}`); //устанавливаем атрибут data-tile и приравниваем ему координаты x и y
			
			let random_boolean = Math.random() < this.bombFrequency;
			if (random_boolean) {
				this.bombs.push(`${x},${y}`);
				if (x > 0) this.numbers.push(`${x-1},${y}`);
				if (x < this.size - 1) this.numbers.push(`${x+1},${y}`);
				if (y > 0) this.numbers.push(`${x},${y-1}`);
				if (y < this.size - 1) this.numbers.push(`${x},${y+1}`);
				if (x > 0 && y > 0) this.numbers.push(`${x-1},${y-1}`);
				if (x < this.size - 1 && y < this.size - 1) this.numbers.push(`${x+1},${y+1}`);
				if (y > 0 && x < this.size - 1) this.numbers.push(`${x+1},${y-1}`);
				if (x > 0 && y < this.size - 1) this.numbers.push(`${x-1},${y+1}`);
			}
			
			x++;  //переход на следующую клетку
			if (x >= this.size) {  //переход на новую строку плиток на доске
				x = 0;
				y++;
			}
			
			tile.oncontextmenu = (e) => {            //нажатие правой кнопкой мыши
				e.preventDefault();  //отменяет всплывающую понель (контекстное меню)
				this.flag(tile);
			}
			
			tile.addEventListener('click', () => {   //клик по клетке
				if (this.tileTime == false) {     //если нажали в первый раз, то запускается время
					clearInterval(this.interval);
					this.interval = setInterval(this.startTimer, 1000);
					this.tileTime = true;
				}
				this.clickTile(tile);
			});
		}); 
		//определяем значение цифр 
		//массив numbers может иметь несколько одинаковых значений
		this.numbers.forEach(num => { //num - две координаты (x,y)
			let coords = num.split(',');   //split разделяет строку num в месте постановки ','. Теперь coords - массив из 2-х переменных x и y 
			let tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0];  //parseInt преобразует строку в число // мы записываем значения в tile т.к. это новый tile
			//dataNum - наша будущая цифра
			let dataNum = parseInt(tile.getAttribute('data-num'));
			if (!dataNum) dataNum = 0;  //это возможно при первом запуске верхней строчки, которая вернёт undefined
			tile.setAttribute('data-num', dataNum + 1);
		});
		
		if (this.bombs.length < 3) this.setup();  //перезапускает генерацию поля, если количество бомб меньше 3
	}

	flag (tile) { //позволяет устанавливать или снимать флаг на плитке
		if (this.gameOver) return;
		if (!tile.classList.contains('tile--checked')) { //contains определяет есть ли класс '...' у tile  (значения bool)
			if (!tile.classList.contains('tile--flagged')) {
				tile.innerHTML = '🚩';                                    
				tile.classList.add('tile--flagged');
			}
			else {
				tile.innerHTML = '';
				tile.classList.remove('tile--flagged');
			}
		}
	}

	clickTile (tile) {   //обрабатывает клик по плитке и проверяет, является ли плитка бомбой или числом
		if (this.gameOver) return;
		if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged')) return;
		let coordinate = tile.getAttribute('data-tile');
		if (this.bombs.includes(coordinate)) {
			if (this.tilefirst == false) {             //проверка - нет ли первой бомбы                    
				this.clear();                                                                                       
				return;                                                    
			}
			this.endGame(tile);
		}
		else {
			this.tilefirst = true;
			let num = tile.getAttribute('data-num');
			if (num != null) {
				tile.classList.add('tile--checked');
				tile.innerHTML = num;
				tile.style.color = this.numberColors[num-1];
				setTimeout(() => {
					this.checkVictory();
				}, 100);
				return;
			}
			this.checkTile(tile, coordinate);
		}
		tile.classList.add('tile--checked');
	}

	checkTile (tile, coordinate) {  //проверяет соседние плитки и открывает их, если они не являются бомбами или числами
		let coords = coordinate.split(',');
		let x = parseInt(coords[0]);
		let y = parseInt(coords[1]);
		
		setTimeout(() => { //вызывается один раз через 10 миллисекунд
			if (x > 0) {
				let targetW = document.querySelectorAll(`[data-tile="${x-1},${y}"]`)[0];
				this.clickTile(targetW);
			}
			if (x < this.size - 1) {
				let targetE = document.querySelectorAll(`[data-tile="${x+1},${y}"]`)[0];
				this.clickTile(targetE);
			}
			if (y > 0) {
				let targetN = document.querySelectorAll(`[data-tile="${x},${y-1}"]`)[0];
				this.clickTile(targetN);
			}
			if (y < this.size - 1) {
				let targetS = document.querySelectorAll(`[data-tile="${x},${y+1}"]`)[0];
				this.clickTile(targetS);
			}
			if (x > 0 && y > 0) {
				let targetNW = document.querySelectorAll(`[data-tile="${x-1},${y-1}"]`)[0];
				this.clickTile(targetNW);
			}
			if (x < this.size - 1 && y < this.size - 1) {
				let targetSE = document.querySelectorAll(`[data-tile="${x+1},${y+1}"]`)[0];
				this.clickTile(targetSE);
			}
			if (y > 0 && x < this.size - 1) {
				let targetNE = document.querySelectorAll(`[data-tile="${x+1},${y-1}"]`)[0];
				this.clickTile(targetNE);
			}
			if (x > 0 && y < this.size - 1) {
				let targetSW = document.querySelectorAll(`[data-tile="${x-1},${y+1}"]`)[0];   
				this.clickTile(targetSW);
			}
		}, 10);
	}

	endGame (tile) { //вызывается при проигрыше и отображает сообщение о поражении, а также показывает все бомбы на поле
		this.endscreen.innerHTML = this.endscreenContent.lose;
		this.endscreen.classList.add('show'); //добавляет класс в элемент endscreen
		this.gameOver = true;
		this.tiles.forEach(tile => {
			let coordinate = tile.getAttribute('data-tile');
			if (this.bombs.includes(coordinate)) {
				clearInterval(this.interval);
				tile.classList.remove('tile--flagged');
				tile.classList.add('tile--checked', 'tile--bomb');
				tile.innerHTML = '💣';                                           
			}
		});
	}

	checkVictory () { //проверяет, выполнены ли условия победы (все плитки, кроме бомб, открыты)
		let win = true;
		this.tiles.forEach(tile => {
			let coordinate = tile.getAttribute('data-tile');
			if (!tile.classList.contains('tile--checked') && !this.bombs.includes(coordinate)) win = false;
		});
		if (win) {
			//проверка на лучшие результаты
			if (this.size == 8 && this.bombFrequency == 0.1 && (this.easyEightMinutes > this.minutes || (this.easyEightMinutes == this.minutes && this.easyEightSeconds > this.seconds) || (this.easyEightMinutes == 0 && this.easyEightSeconds == 0))){
				this.easyEightMinutes = this.minutes;
				this.easyEightSeconds = this.seconds;
			}
			if (this.size == 8 && this.bombFrequency == 0.2 && (this.normalEightMinutes > this.minutes || (this.normalEightMinutes == this.minutes && this.normalEightSeconds > this.seconds) || (this.normalEightMinutes == 0 && this.normalEightSeconds == 0))){
				this.normalEightMinutes = this.minutes;
				this.normalEightSeconds = this.seconds;
			}
			if (this.size == 8 && this.bombFrequency == 0.3 && (this.hardEightMinutes > this.minutes || (this.hardEightMinutes == this.minutes && this.hardEightSeconds > this.seconds) || (this.hardEightMinutes == 0 && this.hardEightSeconds == 0))){
				this.hardEightMinutes = this.minutes;
				this.hardEightSeconds = this.seconds;
			}
			if (this.size == 10 && this.bombFrequency == 0.1 && (this.easyTenMinutes > this.minutes || (this.easyTenMinutes == this.minutes && this.easyTenSeconds > this.seconds) || (this.easyTenMinutes == 0 && this.easyTenSeconds == 0))){
				this.easyTenMinutes = this.minutes;
				this.easyTenSeconds = this.seconds;
			}
			if (this.size == 10 && this.bombFrequency == 0.2 && (this.normalTenMinutes > this.minutes || (this.normalTenMinutes == this.minutes && this.normalTenSeconds > this.seconds) || (this.normalTenMinutes == 0 && this.normalTenSeconds == 0))){
				this.normalTenMinutes = this.minutes;
				this.normalTenSeconds = this.seconds;
			}
			if (this.size == 10 && this.bombFrequency == 0.3 && (this.hardTenMinutes > this.minutes || (this.hardTenMinutes == this.minutes && this.hardTenSeconds > this.seconds) || (this.hardTenMinutes == 0 && this.hardTenSeconds == 0))){
				this.hardTenMinutes = this.minutes;
				this.hardTenSeconds = this.seconds;
			}
			if (this.size == 16 && this.bombFrequency == 0.1 && (this.easySixteenMinutes > this.minutes || (this.easySixteenMinutes == this.minutes && this.easySixteenSeconds > this.seconds) || (this.easySixteenMinutes == 0 && this.easySixteenSeconds == 0))){
				this.easySixteenMinutes = this.minutes;
				this.easySixteenSeconds = this.seconds;
			}
			if (this.size == 16 && this.bombFrequency == 0.2 && (this.normalSixteenMinutes > this.minutes || (this.normalSixteenMinutes == this.minutes && this.normalSixteenSeconds > this.seconds) || (this.normalSixteenMinutes == 0 && this.normalSixteenSeconds == 0))){
				this.normalSixteenMinutes = this.minutes;
				this.normalSixteenSeconds = this.seconds;
			}
			if (this.size == 16 && this.bombFrequency == 0.3 && (this.hardSixteenMinutes > this.minutes || (this.hardSixteenMinutes == this.minutes && this.hardSixteenSeconds > this.seconds) || (this.hardSixteenMinutes == 0 && this.hardSixteenSeconds == 0))){
				this.hardSixteenMinutes = this.minutes;
				this.hardSixteenSeconds = this.seconds;
			}
			//выше проверка на лучшие результаты
			clearInterval(this.interval);
			this.endscreen.innerHTML = this.endscreenContent.win;
			this.endscreen.classList.add('show'); //добавляет класс в элемент endscreen
			this.gameOver = true;
		}
	}
}

let obj = new Saper();
obj.setup();  //вызывается для начала игры и устанавливает игровое поле
//addEventListener(действие, функция что будет происходить)
obj.restartBtn.addEventListener('click', function(e) { //При нажатии на кнопку перезапуска вызывается функция `clear`, т.е. начинается новая игра
	e.preventDefault();       //не даёт всплывать контекстному меню при нажатии правой кнопи мыши                                                                
	obj.clear();
});

obj.boardSizeBtn1.addEventListener('click', function() { //При изменении значения выбора размера поля вызывается функция `clear` и изменяется размер плиток
	obj.size = this.value;
	obj.tileSize = 70 - (obj.size * 2); 
	obj.clear();
});
obj.boardSizeBtn2.addEventListener('click', function() { //При изменении значения выбора размера поля вызывается функция `clear` и изменяется размер плиток
	obj.size = this.value;
	obj.tileSize = 70 - (obj.size * 2); 
	obj.clear();
});
obj.boardSizeBtn3.addEventListener('click', function() { //При изменении значения выбора размера поля вызывается функция `clear` и изменяется размер плиток
	obj.size = this.value;
	obj.tileSize = 70 - (obj.size * 2); 
	obj.clear();
});

//value - частота появления бомб (НО ЭТО ТОЛЬКО В ЭТОМ СЛУЧАЕ)
obj.difficultyBtns.forEach(btn => { //При нажатии на кнопку выбора сложности вызывается функция `clear` и изменяется частота появления бомб
	btn.addEventListener('click', function() {
		obj.bombFrequency = this.value;
		obj.clear();
	});
});

//по нажатии на кнопку THE BEST получаем свои рекорды
obj.theBest.addEventListener('click', function() {
	if (confirm("Вы хотите узнать свои рекорды?")) {
	alert("Поле 8х8, легко - " + obj.easyEightMinutes + ":" + obj.easyEightSeconds + "\n" +
	"Поле 8х8, нормально - " + obj.normalEightMinutes + ":" + obj.normalEightSeconds + "\n" +
	"Поле 8х8, сложно - " + obj.hardEightMinutes + ":" + obj.hardEightSeconds + "\n" +
	"Поле 10х10, легко - " + obj.easyTenMinutes + ":" + obj.easyTenSeconds + "\n" +
	"Поле 10х10, нормально - " + obj.normalTenMinutes + ":" + obj.normalTenSeconds + "\n" +
	"Поле 10х10, сложно - " + obj.hardTenMinutes + ":" + obj.hardTenSeconds + "\n" +
	"Поле 16х16, легко - " + obj.easySixteenMinutes + ":" + obj.easySixteenSeconds + "\n" +
	"Поле 16х16, нормально - " + obj.normalSixteenMinutes + ":" + obj.normalSixteenSeconds + "\n" +
	"Поле 16х16, сложно - " + obj.hardSixteenMinutes + ":" + obj.hardSixteenSeconds);
	}
})

//обработка события закрытия страницы
window.onunload = function() {
    localStorage.setItem("eem", JSON.stringify(obj.easyEightMinutes));
	localStorage.setItem("nem", JSON.stringify(obj.normalEightMinutes));
	localStorage.setItem("hem", JSON.stringify(obj.hardEightMinutes));
	localStorage.setItem("etm", JSON.stringify(obj.easyTenMinutes));
	localStorage.setItem("ntm", JSON.stringify(obj.normalTenMinutes));
	localStorage.setItem("htm", JSON.stringify(obj.hardTenMinutes));
	localStorage.setItem("esm", JSON.stringify(obj.easySixteenMinutes));
	localStorage.setItem("nsm", JSON.stringify(obj.normalSixteenMinutes));
	localStorage.setItem("hsm", JSON.stringify(obj.hardSixteenMinutes));
	localStorage.setItem("ees", JSON.stringify(obj.easyEightSeconds));
	localStorage.setItem("nes", JSON.stringify(obj.normalEightSeconds));
	localStorage.setItem("hes", JSON.stringify(obj.hardEightSeconds));
	localStorage.setItem("ets", JSON.stringify(obj.easyTenSeconds));
	localStorage.setItem("nts", JSON.stringify(obj.normalTenSeconds));
	localStorage.setItem("hts", JSON.stringify(obj.hardTenSeconds));
	localStorage.setItem("ess", JSON.stringify(obj.easySixteenSeconds));
	localStorage.setItem("nss", JSON.stringify(obj.normalSixteenSeconds));
	localStorage.setItem("hss", JSON.stringify(obj.hardSixteenSeconds));
}

//обработка события загрузки страницы
window.onload = function() {
    let eema = localStorage.getItem("eem");
	let nema = localStorage.getItem("nem");
	let hema = localStorage.getItem("hem");
	let etma = localStorage.getItem("etm");
	let ntma = localStorage.getItem("ntm");
	let htma = localStorage.getItem("htm");
	let esma = localStorage.getItem("esm");
	let nsma = localStorage.getItem("nsm");
	let hsma = localStorage.getItem("hsm");
	let eesa = localStorage.getItem("ees");
	let nesa = localStorage.getItem("nes");
	let hesa = localStorage.getItem("hes");
	let etsa = localStorage.getItem("ets");
	let ntsa = localStorage.getItem("nts");
	let htsa = localStorage.getItem("hts");
	let essa = localStorage.getItem("ess");
	let nssa = localStorage.getItem("nss");
	let hssa = localStorage.getItem("hss");

    obj.easyEightMinutes = JSON.parse(eema);
    obj.normalEightMinutes = JSON.parse(nema);
	obj.hardEightMinutes = JSON.parse(hema);
	obj.easyTenMinutes = JSON.parse(etma);
	obj.normalTenMinutes = JSON.parse(ntma);
	obj.hardTenMinutes = JSON.parse(htma);
	obj.easySixteenMinutes = JSON.parse(esma);
	obj.normalSixteenMinutes = JSON.parse(nsma);
	obj.hardSixteenMinutes = JSON.parse(hsma);
	obj.easyEightSeconds = JSON.parse(eesa);
	obj.normalEightSeconds = JSON.parse(nesa);
	obj.hardEightSeconds = JSON.parse(hesa);
	obj.easyTenSeconds = JSON.parse(etsa);
	obj.normalTenSeconds = JSON.parse(ntsa);
	obj.hardTenSeconds = JSON.parse(htsa);
	obj.easySixteenSeconds = JSON.parse(essa);
	obj.normalSixteenSeconds = JSON.parse(nssa);
	obj.hardSixteenSeconds = JSON.parse(hssa);
	if (obj.easyEightMinutes == null){
		obj.easyEightMinutes = 0;
		obj.easyTenMinutes = 0;
		obj.easySixteenMinutes = 0;
		obj.normalEightMinutes = 0;
		obj.normalTenMinutes = 0;
		obj.normalSixteenMinutes = 0;
		obj.hardEightMinutes = 0;
		obj.hardTenMinutes = 0;
		obj.hardSixteenMinutes = 0;
		obj.easyEightSeconds = 0;
		obj.easyTenSeconds = 0;
		obj.easySixteenSeconds = 0;
		obj.normalEightSeconds = 0;
		obj.normalTenSeconds = 0;
		obj.normalSixteenSeconds = 0;
		obj.hardEightSeconds = 0;
		obj.hardTenSeconds = 0;
		obj.hardSixteenSeconds = 0;
	}
}