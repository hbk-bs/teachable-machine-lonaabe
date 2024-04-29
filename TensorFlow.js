const URL = "https://teachablemachine.withgoogle.com/models/CpVHOQCyu/";
let model, webcam, ctx, maxPredictions;
function startTimer() {
    var remainingTime = 30; // Timer von 30 Sekunden
    var timerElement = document.getElementById('timer');
    var interval = setInterval(function() {
        remainingTime--;
        var seconds = remainingTime % 60;
        timerElement.textContent = "00:" + (seconds < 10 ? "0" + seconds : seconds);

        if (remainingTime <= 0) {
            clearInterval(interval);
            timerElement.textContent = "Zeit abgelaufen!";
        }
    }, 1000);
}

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const size = 500;  // Größe der Kameraansicht anpassen
    const flip = true; // Webcam spiegeln
    webcam = new tmPose.Webcam(size, size, flip);
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    const canvas = document.getElementById("canvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext('2d');
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

window.onload = init;
notizen
<script src="TensorFlow.js" defer></script>
 <div id="timer">00:30</div>
 <button onclick="startTimer()">Timer starten</button>
 <canvas id="canvas"></canvas>