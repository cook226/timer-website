// Get DOM elements
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const timerInput = document.getElementById("timerInput");
const loopInput = document.getElementById("loopInput");
const timeDisplay = document.getElementById("timeDisplay");
const beepSound = document.getElementById("beepSound");
const alertBox = document.getElementById("alertBox");

// Create and insert loop counter display element
const loopDisplay = document.createElement("div");
loopDisplay.className = "text-sm text-gray-600 mt-2";
timeDisplay.parentNode.insertBefore(loopDisplay, timeDisplay.nextSibling);

// Initialize global variables
let timer;
let isRunning = false;
let loopCount = 0;
let currentSeconds = 0;
let totalSeconds = 0;

// Configure audio settings after loading
beepSound.addEventListener("loadeddata", () => {
  beepSound.playbackRate = 1.0;
});

// Add event listeners
startButton.addEventListener("click", toggleTimer);
stopButton.addEventListener("click", stopTimer);

/**
 * Toggles the timer between start and pause states
 * Handles input validation and timer logic
 */
function toggleTimer() {
  const inputValue = timerInput.value;

  // Only validate input if starting fresh
  if (!isRunning && currentSeconds === 0) {
    if (!inputValue || inputValue <= 0) {
      alertBox.classList.remove("hidden");
      setTimeout(() => {
        alertBox.classList.add("hidden");
      }, 3000);
      return;
    }
    totalSeconds = parseInt(inputValue);
    currentSeconds = totalSeconds;
  }

  if (!isRunning) {
    // Start timer logic
    isRunning = true;
    const maxLoops = loopInput.value ? parseInt(loopInput.value) : Infinity;
    updateLoopDisplay(maxLoops);
    togglePlayPauseDisplay(true);

    // Start interval timer
    timer = setInterval(() => {
      if (currentSeconds <= 0) {
        beepSound.currentTime = 0;
        beepSound.playbackRate = 2.0;
        beepSound
          .play()
          .catch((error) => console.log("Audio play failed:", error));
        loopCount++;
        updateLoopDisplay(maxLoops);

        // Check if max loops reached
        if (loopCount >= maxLoops) {
          clearInterval(timer);
          isRunning = false;
          resetTimer();
          return;
        }

        currentSeconds = totalSeconds;
      }

      // Update time display
      const displaySeconds = String(currentSeconds).padStart(2, "0");
      timeDisplay.textContent = `00:${displaySeconds}`;
      currentSeconds--;
    }, 1000);
  } else {
    // Pause the timer
    pauseTimer();
  }
}

/**
 * Updates the loop counter display
 * @param {number} maxLoops - Maximum number of loops to display
 */
function updateLoopDisplay(maxLoops) {
  if (maxLoops !== Infinity) {
    loopDisplay.textContent = `Loop: ${loopCount} / ${maxLoops}`;
  } else {
    loopDisplay.textContent = loopCount > 0 ? `Loop: ${loopCount}` : "";
  }
}

/**
 * Toggles the play/pause button display elements
 * @param {boolean} isPause - True to show pause, false to show play
 */
function togglePlayPauseDisplay(isPause) {
  const playElements = document.querySelectorAll(".play-text");
  const pauseElements = document.querySelectorAll(".pause-text");

  playElements.forEach((element) => {
    element.classList.toggle("hidden", isPause);
  });

  pauseElements.forEach((element) => {
    element.classList.toggle("hidden", !isPause);
  });
}

/**
 * Pauses the current timer
 */
function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  togglePlayPauseDisplay(false);
}

/**
 * Resets all timer values and display elements
 */
function resetTimer() {
  timeDisplay.textContent = "00:00";
  timerInput.value = "";
  loopInput.value = "";
  loopCount = 0;
  currentSeconds = 0;
  totalSeconds = 0;
  loopDisplay.textContent = "";
  togglePlayPauseDisplay(false);
}

/**
 * Stops the timer and resets all values
 */
function stopTimer() {
  isRunning = false;
  clearInterval(timer);
  resetTimer();
}
