const startBtn = document.querySelector("#start");
const screens = document.querySelectorAll(".screen");
const timeList = document.querySelector("#time-list");
const timeEl = document.querySelector("#time");
const board = document.querySelector("#board");

let time = 0;
let score = 0;
let miss = 0;
function init() {
	startBtn.addEventListener("click", (event) => {
		event.preventDefault();
		screens[0].classList.add("up");
	});

	timeList.addEventListener("click", (event) => {
		if (event.target.classList.contains("time-btn")) {
			time = parseInt(event.target.getAttribute("data-time"));
			screens[1].classList.add("up");
			startGame();
		}
	});
}

init();

function startGame() {
	const interval = setInterval(decreaseTime, 1000);
	setTimeout(() => {
		clearInterval(interval);
		finishGame();
	}, time * 1000);
	boardListener();
	createRandomCircle();
	setTime(time);
}

function boardListener() {
	board.addEventListener("click", (event) => {
		if (event.target.classList.contains("circle")) {
			score++;
		} else {
			miss++;
		}
	});
}

function decreaseTime() {
	if (time === 0) {
	} else {
		let current = --time;
		if (current < 10) {
			current = `0${current}`;
		}
		setTime(current);
	}
}

function setTime(value) {
	timeEl.innerHTML = `00:${value}`;
}

function finishGame() {
	board.innerHTML = `<h2>Ваш счет: ${score}. Точность: ${Math.floor((score / (score + miss)) * 100)}%</h2>`;
	console.log(score);
	console.log(miss);
}

function createRandomCircle() {
	const circle = document.createElement("div");
	const size = getRandomNumber(10, 60);
	const boardParameters = board.getBoundingClientRect();
	const maxX = boardParameters.width - size;
	const maxY = boardParameters.height - size;
	const x = getRandomNumber(0, maxX);
	const y = getRandomNumber(0, maxY);

	circle.classList.add("circle");
	circle.style.width = `${size}px`;
	circle.style.height = `${size}px`;
	circle.style.top = `${y}px`;
	circle.style.left = `${x}px`;
	board.append(circle);
	circleEvent();
}

function circleEvent() {
	const circle = document.querySelector(".circle");
	circle.addEventListener("click", () => {
		circle.remove();
		createRandomCircle();
	});
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
