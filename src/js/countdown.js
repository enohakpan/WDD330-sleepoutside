// Get DOM elements
const countdownDisplay = document.getElementById("countdown");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const timeInput = document.getElementById("timeInput");

let timeLeft = 10;
let countdownInterval = null;
let isPaused = false;
let originalTime = 10;

// Initialize pause button state
pauseButton.disabled = true;

// Function to update the display
function updateDisplay(time) {
  countdownDisplay.textContent = time;
}

// Function to stop the countdown
function stopCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = null;
  startButton.textContent = "Start";
  pauseButton.disabled = true;
  timeInput.disabled = false;
  isPaused = false;
}

// Function to handle countdown completion
function handleCountdownComplete() {
  countdownDisplay.textContent = "Time's up!";
  stopCountdown();
  // Reset timeLeft to original input value
  timeLeft = originalTime;
}

// Start button click handler
startButton.addEventListener("click", () => {
  // If countdown is not running and not paused
  if (!countdownInterval && !isPaused) {
    // Get time from input
    timeLeft = parseInt(timeInput.value);
    originalTime = timeLeft;

    // Input validation
    if (isNaN(timeLeft) || timeLeft <= 0) {
      alert("Please enter a valid positive number");
      return;
    }

    // Update button states
    startButton.textContent = "Reset";
    pauseButton.disabled = false;
    timeInput.disabled = true;

    // Start countdown
    updateDisplay(timeLeft);

    countdownInterval = setInterval(() => {
      timeLeft--;
      updateDisplay(timeLeft);

      if (timeLeft <= 0) {
        handleCountdownComplete();
      }
    }, 1000);
  } else {
    // Reset functionality
    stopCountdown();
    updateDisplay(originalTime);
    timeLeft = originalTime;
  }
});

// Pause button click handler
pauseButton.addEventListener("click", () => {
  if (countdownInterval) {
    if (!isPaused) {
      // Pause countdown
      clearInterval(countdownInterval);
      countdownInterval = null;
      pauseButton.textContent = "Resume";
      isPaused = true;
    } else {
      // Resume countdown
      pauseButton.textContent = "Pause";
      isPaused = false;

      countdownInterval = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (timeLeft <= 0) {
          handleCountdownComplete();
        }
      }, 1000);
    }
  }
});
