// script.js

const videoUpload = document.getElementById('videoUpload');
const videoPlayer = document.getElementById('videoPlayer');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const trimButton = document.getElementById('trimButton');
const textOverlayInput = document.getElementById('textOverlay');
const addTextButton = document.getElementById('addTextButton');
const timelineCanvas = document.getElementById('timelineCanvas');
const ctx = timelineCanvas.getContext('2d');

let videoFile;
let textOverlay = '';

videoUpload.addEventListener('change', handleVideoUpload);

function handleVideoUpload(event) {
    videoFile = event.target.files[0];
    if (videoFile) {
        const videoURL = URL.createObjectURL(videoFile);
        videoPlayer.src = videoURL;
        videoPlayer.load();
        
        videoPlayer.onloadedmetadata = () => {
            endTimeInput.value = videoPlayer.duration;
            drawTimeline();
        };
    }
}

function drawTimeline() {
    const duration = videoPlayer.duration;
    const width = timelineCanvas.width;
    const height = timelineCanvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#007bff';
    ctx.fillRect(0, 0, width, height);
}

trimButton.addEventListener('click', () => {
    const startTime = parseFloat(startTimeInput.value);
    const endTime = parseFloat(endTimeInput.value);

    if (startTime >= 0 && endTime > startTime && endTime <= videoPlayer.duration) {
        videoPlayer.currentTime = startTime;

        videoPlayer.play();

        setTimeout(() => {
            videoPlayer.pause();
        }, (endTime - startTime) * 1000);

        drawTimeline();
    } else {
        alert('Invalid start or end time');
    }
});

addTextButton.addEventListener('click', () => {
    textOverlay = textOverlayInput.value;
    drawOverlay();
});

function drawOverlay() {
    if (textOverlay) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;

        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(textOverlay, 50, 50);

        videoPlayer.src = canvas.toDataURL('video/mp4');
    }
}
