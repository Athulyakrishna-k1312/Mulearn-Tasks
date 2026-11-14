
const ball = document.getElementById("ball");

const playBtn = document.getElementById("playBtn");
const resetBtn = document.getElementById("resetBtn");

const statusText = document.getElementById("statusText");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

const totalSteps = 5;

let isPlaying = false;
let runId = 0;

// Function to perform an animation using a Promise
function animateBall(keyframes, duration = 600) {

    const animation = ball.animate(keyframes, {
        duration: duration,
        easing: "ease-in-out",
        fill: "forwards"
    });

    return animation.finished;
}

// Update the progress and current step
function updateProgress(step, message) {

    statusText.textContent = message;
    progressText.textContent = `${step} / ${totalSteps}`;

    progressBar.style.width =
        `${(step / totalSteps) * 100}%`;

    for (let i = 1; i <= totalSteps; i++) {

        const item = document.getElementById(`step${i}`);

        item.classList.remove("active", "done");

        if (i < step) {
            item.classList.add("done");
        }

        if (i === step) {
            item.classList.add("active");
        }
    }
}

// Play animations one after another
async function playAnimation() {

    if (isPlaying) return;

    isPlaying = true;
    playBtn.disabled = true;

    const currentRun = ++runId;

    const stage = document.querySelector(".animation-area");

    const distance = Math.min(
        100,
        Math.max(0, stage.clientWidth / 2 - 65)
    );

    // Reset ball before starting
    ball.getAnimations().forEach(animation => animation.cancel());

    ball.style.transform =
        "translate(0px, 0px) scale(1) rotate(0deg)";

    ball.style.backgroundColor = "#8b5cf6";

    try {

        // STEP 1: Move right
        updateProgress(1, "Moving right...");

        await animateBall([
            { transform: "translate(0px, 0px)" },
            { transform: `translate(${distance}px, 0px)` }
        ]);

        if (currentRun !== runId) return;

        // STEP 2: Bounce up and down
        updateProgress(2, "Bouncing...");

        await animateBall([
            {
                transform: `translate(${distance}px, 0px)`
            },
            {
                transform: `translate(${distance}px, -65px)`
            },
            {
                transform: `translate(${distance}px, 0px)`
            }
        ], 900);

        if (currentRun !== runId) return;

        // STEP 3: Change colour
        updateProgress(3, "Changing colour...");

        await animateBall([
            { backgroundColor: "#8b5cf6" },
            { backgroundColor: "#f97316" }
        ]);

        if (currentRun !== runId) return;

        // STEP 4: Grow bigger
        updateProgress(4, "Growing bigger...");

        await animateBall([
            {
                transform:
                    `translate(${distance}px, 0px) scale(1)`
            },
            {
                transform:
                    `translate(${distance}px, 0px) scale(1.5)`
            }
        ]);

        if (currentRun !== runId) return;

        // STEP 5: Rotate 360 degrees
        updateProgress(5, "Rotating...");

        await animateBall([
            {
                transform:
                    `translate(${distance}px, 0px) scale(1.5) rotate(0deg)`
            },
            {
                transform:
                    `translate(${distance}px, 0px) scale(1.5) rotate(360deg)`
            }
        ], 800);

        if (currentRun !== runId) return;

        // Animation completed
        statusText.textContent = "Animation completed! 🎉";

        const lastStep = document.getElementById("step5");

        lastStep.classList.remove("active");
        lastStep.classList.add("done");

    } catch (error) {

        if (error.name !== "AbortError") {
            console.error(error);
            statusText.textContent = "Animation failed!";
        }

    } finally {

        if (currentRun === runId) {
            isPlaying = false;
            playBtn.disabled = false;
        }
    }
}

// Reset the animation
function resetAnimation() {

    // Invalidate the previous animation sequence
    runId++;

    // Cancel running animations
    ball.getAnimations().forEach(animation => animation.cancel());

    // Restore original appearance
    ball.style.transform =
        "translate(0px, 0px) scale(1) rotate(0deg)";

    ball.style.backgroundColor = "#8b5cf6";

    isPlaying = false;
    playBtn.disabled = false;

    statusText.textContent = "Ready to start";
    progressText.textContent = "0 / 5";
    progressBar.style.width = "0%";

    // Clear all progress indicators
    for (let i = 1; i <= totalSteps; i++) {

        document.getElementById(`step${i}`)
            .classList.remove("active", "done");

    }
}

// Button events
playBtn.addEventListener("click", playAnimation);

resetBtn.addEventListener("click", resetAnimation);
