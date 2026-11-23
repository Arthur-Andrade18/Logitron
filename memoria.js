const pairs = [
  ["p → q", "¬p ∨ q"],
  ["¬(p ∧ q)", "¬p ∨ ¬q"],
  ["¬(p ∨ q)", "¬p ∧ ¬q"],
  ["¬(p → q)", "p ∧ ¬q"],
  ["¬¬p", "p"],
  ["p ∨ q", "q ∨ p"],
  ["p ↔ q", "(p → q) ∧ (q → p)"],
  ["p ∧ (q ∨ r)", "(p ∧ q) ∨ (p ∧ r)"]
];

const board = document.querySelector("#board");
const movesDisplay = document.querySelector("#moves");
const pairsDisplay = document.querySelector("#pairs");
const message = document.querySelector("#message");
const resetButton = document.querySelector("#reset");
const playerOneCard = document.querySelector("#player-1-card");
const playerTwoCard = document.querySelector("#player-2-card");
const playerOneTime = document.querySelector("#player-1-time");
const playerTwoTime = document.querySelector("#player-2-time");
const turnIndicator = document.querySelector("#turn-indicator");
const playerOneScore = document.querySelector("#player-1-score");
const playerTwoScore = document.querySelector("#player-2-score");
const openScoreButton = document.querySelector("#open-score");
const closeScoreButton = document.querySelector("#close-score");
const scoreDialog = document.querySelector("#score-dialog");
const scorePlayerOne = document.querySelector("#score-player-1");
const scorePlayerTwo = document.querySelector("#score-player-2");
const scoreOnePoints = document.querySelector("#score-1-points");
const scoreTwoPoints = document.querySelector("#score-2-points");
const scoreOneTime = document.querySelector("#score-1-time");
const scoreTwoTime = document.querySelector("#score-2-time");
const scoreMoves = document.querySelector("#score-moves");
const scorePairs = document.querySelector("#score-pairs");

const playerTimeLimit = 180;
const playerTimes = { 1: playerTimeLimit, 2: playerTimeLimit };
const playerBaseTimes = { 1: playerTimeLimit, 2: playerTimeLimit };
const playerScores = { 1: 0, 2: 0 };

let firstCard = null;
let secondCard = null;
let locked = false;
let moves = 0;
let matchedPairs = 0;
let mismatchTimeout = null;
let currentPlayer = 1;
let turnStartedAt = null;
let timerInterval = null;
let gameFinished = false;

function shuffle(cards) {
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }
  return cards;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function renderPlayers() {
  playerOneTime.textContent = formatTime(playerTimes[1]);
  playerTwoTime.textContent = formatTime(playerTimes[2]);
  playerOneScore.textContent = playerScores[1].toString();
  playerTwoScore.textContent = playerScores[2].toString();
  playerOneCard.classList.toggle("is-active", currentPlayer === 1);
  playerTwoCard.classList.toggle("is-active", currentPlayer === 2);
  turnIndicator.textContent = `Jogador ${currentPlayer}`;

  scoreOnePoints.textContent = `${playerScores[1]} ${playerScores[1] === 1 ? "ponto" : "pontos"}`;
  scoreTwoPoints.textContent = `${playerScores[2]} ${playerScores[2] === 1 ? "ponto" : "pontos"}`;
  scoreOneTime.textContent = `${formatTime(playerTimes[1])} restantes`;
  scoreTwoTime.textContent = `${formatTime(playerTimes[2])} restantes`;
  scorePlayerOne.classList.toggle("is-active", currentPlayer === 1);
  scorePlayerTwo.classList.toggle("is-active", currentPlayer === 2);
  scoreMoves.textContent = moves.toString();
  scorePairs.textContent = `${matchedPairs} / ${pairs.length}`;
}

function updateTurnTimer() {
  if (gameFinished || turnStartedAt === null) return;

  const elapsedSeconds = Math.floor((Date.now() - turnStartedAt) / 1000);
  const remaining = Math.max(0, playerBaseTimes[currentPlayer] - elapsedSeconds);
  playerTimes[currentPlayer] = remaining;
  renderPlayers();

  if (remaining <= 0) {
    gameFinished = true;
    window.clearInterval(timerInterval);
    timerInterval = null;
    message.textContent = `Tempo esgotado! ${currentPlayer === 1 ? "Jogador 2" : "Jogador 1"} venceu.`;
  }
}

function switchTurn() {
  if (gameFinished) return;

  const elapsedSeconds = Math.floor((Date.now() - turnStartedAt) / 1000);
  const remaining = Math.max(0, playerBaseTimes[currentPlayer] - elapsedSeconds);
  playerTimes[currentPlayer] = remaining;

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  playerBaseTimes[currentPlayer] = playerTimes[currentPlayer];
  turnStartedAt = Date.now();
  renderPlayers();
  message.textContent = `Vez do Jogador ${currentPlayer}.`;
}

function revealCard(card) {
  card.classList.add("is-revealed");
  card.setAttribute("aria-label", `Proposição ${card.dataset.proposition}`);
  card.querySelector(".card-back").hidden = true;
  card.querySelector(".card-proposition").hidden = false;
}

function hideCard(card) {
  card.classList.remove("is-revealed");
  card.setAttribute("aria-label", "Carta fechada");
  card.querySelector(".card-back").hidden = false;
  card.querySelector(".card-proposition").hidden = true;
}

function finishTurn() {
  firstCard = null;
  secondCard = null;
  locked = false;
}

function finishMatch() {
  gameFinished = true;
  window.clearInterval(timerInterval);
  timerInterval = null;

  if (playerScores[1] === playerScores[2] && playerTimes[1] === playerTimes[2]) {
    message.textContent = `Parabéns! Jogo terminado em empate com ${moves} jogadas.`;
    renderPlayers();
    return;
  }

  let winner;
  if (playerScores[1] !== playerScores[2]) {
    winner = playerScores[1] > playerScores[2] ? 1 : 2;
  } else {
    winner = playerTimes[1] > playerTimes[2] ? 1 : 2;
  }

  message.textContent = `Parabéns! Jogador ${winner} venceu com ${moves} jogadas.`;
  renderPlayers();
}

function selectCard(event) {
  const card = event.currentTarget;
  if (gameFinished || locked || card === firstCard || card.classList.contains("is-matched")) return;

  if (turnStartedAt === null) {
    turnStartedAt = Date.now();
    timerInterval = window.setInterval(updateTurnTimer, 1000);
  }

  revealCard(card);

  if (firstCard === null) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves += 1;
  movesDisplay.textContent = moves.toString();
  locked = true;

  if (firstCard.dataset.pair === secondCard.dataset.pair) {
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs += 1;
    playerScores[currentPlayer] += 1;
    pairsDisplay.textContent = `${matchedPairs} / ${pairs.length}`;

    if (matchedPairs === pairs.length) {
      finishMatch();
      finishTurn();
      return;
    }

    message.textContent = `Par correto! Jogador ${currentPlayer} marcou ponto.`;
    finishTurn();
    window.setTimeout(() => {
      if (!gameFinished) {
        switchTurn();
      }
    }, 600);
    return;
  }

  message.textContent = `Não formam um par. Vez do Jogador ${currentPlayer === 1 ? 2 : 1}.`;
  mismatchTimeout = window.setTimeout(() => {
    hideCard(firstCard);
    hideCard(secondCard);
    mismatchTimeout = null;
    finishTurn();
    if (!gameFinished) {
      switchTurn();
    }
  }, 1200);
}

function createCard(proposition, pairId) {
  const card = document.createElement("button");
  card.className = "memory-card";
  card.type = "button";
  card.dataset.pair = pairId.toString();
  card.dataset.proposition = proposition;
  card.setAttribute("aria-label", "Carta fechada");
  card.innerHTML = '<span class="card-back" aria-hidden="true">?</span><span class="card-proposition" hidden></span>';
  card.querySelector(".card-proposition").textContent = proposition;
  card.addEventListener("click", selectCard);
  return card;
}

function startNewGame() {
  if (timerInterval !== null) window.clearInterval(timerInterval);
  if (mismatchTimeout !== null) window.clearTimeout(mismatchTimeout);

  const cards = pairs.flatMap(([first, second], pairId) => [
    createCard(first, pairId),
    createCard(second, pairId)
  ]);
  shuffle(cards);
  board.replaceChildren(...cards);

  firstCard = null;
  secondCard = null;
  locked = false;
  moves = 0;
  matchedPairs = 0;
  mismatchTimeout = null;
  currentPlayer = 1;
  gameFinished = false;
  playerTimes[1] = playerTimeLimit;
  playerTimes[2] = playerTimeLimit;
  playerScores[1] = 0;
  playerScores[2] = 0;
  playerBaseTimes[1] = playerTimeLimit;
  playerBaseTimes[2] = playerTimeLimit;
  turnStartedAt = Date.now();
  timerInterval = window.setInterval(updateTurnTimer, 1000);
  movesDisplay.textContent = "0";
  pairsDisplay.textContent = `0 / ${pairs.length}`;
  renderPlayers();
  message.textContent = "Vire duas cartas e descubra se as proposições são equivalentes.";
}

resetButton.addEventListener("click", startNewGame);
openScoreButton.addEventListener("click", () => {
  renderPlayers();
  scoreDialog.showModal();
});
closeScoreButton.addEventListener("click", () => scoreDialog.close());
scoreDialog.addEventListener("click", (event) => {
  if (event.target === scoreDialog) scoreDialog.close();
});
startNewGame();
