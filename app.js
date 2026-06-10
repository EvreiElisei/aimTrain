const GameState = {
	time: 0,
	score: 0,
	miss: 0,
	intervalId: null,
	isGameActive: false,
};

function formatTime(seconds) {
	const padded = seconds < 10 ? `0${seconds}` : seconds;
	return `00:${padded}`;
}

function calculateAccuracy(score, miss) {
	const total = score + miss;
	if (total === 0) return 0;
	return Math.floor((score / total) * 100);
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function calculateCirclePosition(boardRect, circleSize) {
	const maxX = boardRect.width - circleSize;
	const maxY = boardRect.height - circleSize;
	return {
		x: getRandomNumber(0, maxX),
		y: getRandomNumber(0, maxY),
	};
}

function showScreen(index) {
	const screens = document.querySelectorAll(".screen");
	if (screens[index]) {
		screens[index].classList.add("up");
	}
}

function updateTimerDisplay() {
	const timeEl = document.querySelector("#time");
	if (timeEl) {
		timeEl.innerHTML = formatTime(GameState.time);
	}
}

function showGameResults() {
	const board = document.querySelector("#board");
	if (board) {
		const accuracy = calculateAccuracy(GameState.score, GameState.miss);
		board.innerHTML = `<h2>Ваш счет: ${GameState.score}. Точность: ${accuracy}%</h2>`;
	}
}

function clearBoard() {
	const board = document.querySelector("#board");
	if (board) {
		const circles = board.querySelectorAll(".circle");
		circles.forEach((circle) => circle.remove());
	}
}

function createCircleElement(size, x, y) {
	const circle = document.createElement("div");
	circle.classList.add("circle");
	circle.style.width = `${size}px`;
	circle.style.height = `${size}px`;
	circle.style.top = `${y}px`;
	circle.style.left = `${x}px`;
	return circle;
}

function appendCircleToBoard(circle) {
	const board = document.querySelector("#board");
	if (board) {
		board.append(circle);
	}
}

function removeCircle(circle) {
	if (circle && circle.remove) {
		circle.remove();
	}
}

function createRandomCircle() {
	const board = document.querySelector("#board");
	if (!board || !GameState.isGameActive) return null;

	const boardRect = board.getBoundingClientRect();
	const size = getRandomNumber(10, 60);
	const { x, y } = calculateCirclePosition(boardRect, size);

	const circle = createCircleElement(size, x, y);
	appendCircleToBoard(circle);

	return circle;
}

function handleCircleClick(circle) {
	if (!GameState.isGameActive) return;

	GameState.score++;
	removeCircle(circle);
	createRandomCircle();
}

function handleBoardClick(event) {
	if (!GameState.isGameActive) return;

	if (event.target.classList.contains("circle")) {
		handleCircleClick(event.target);
	} else {
		GameState.miss++;
	}
}

function decreaseTime() {
	if (!GameState.isGameActive) return;

	if (GameState.time > 0) {
		GameState.time--;
		updateTimerDisplay();
	}

	if (GameState.time === 0) {
		finishGame();
	}
}

function startTimer() {
	GameState.intervalId = setInterval(() => {
		decreaseTime();
	}, 1000);
}

function stopTimer() {
	if (GameState.intervalId) {
		clearInterval(GameState.intervalId);
		GameState.intervalId = null;
	}
}

function finishGame() {
	GameState.isGameActive = false;
	stopTimer();
	clearBoard();
	showGameResults();
}

function startGame(initialTime) {
	GameState.time = initialTime;
	GameState.score = 0;
	GameState.miss = 0;
	GameState.isGameActive = true;

	clearBoard();

	updateTimerDisplay();

	startTimer();
	createRandomCircle();

	const board = document.querySelector("#board");
	if (board) {
		board.removeEventListener("click", handleBoardClick);
		board.addEventListener("click", handleBoardClick);
	}
}

function initStartButton() {
	const startBtn = document.querySelector("#start");
	if (startBtn) {
		startBtn.addEventListener("click", (event) => {
			event.preventDefault();
			showScreen(0);
		});
	}
}

function initTimeSelection() {
	const timeList = document.querySelector("#time-list");
	if (timeList) {
		timeList.addEventListener("click", (event) => {
			if (event.target.classList.contains("time-btn")) {
				const selectedTime = parseInt(event.target.getAttribute("data-time"));
				if (!isNaN(selectedTime) && selectedTime > 0) {
					showScreen(1);
					startGame(selectedTime);
				}
			}
		});
	}
}

function init() {
	initStartButton();
	initTimeSelection();
}

init();
