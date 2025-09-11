let mediaRecorder;
let recordedChunks = [];
let wholeData;
let message;

let ContentArea = document.getElementById("content-area");
let promptArea = document.getElementById("input-box");
let SubmitButton = document.getElementById("send-btn");
let timerInterval;
let seconds = 0;
const startBtn = document.querySelector(".startRecord");
const stopBtn = document.querySelector(".stopRecord");
const result = document.querySelector(".result-area");
const recordingStatus = document.querySelector("#recordingStatus");
const downloadBtn = document.querySelector(".download-btn");

document.querySelector(".startRecord").addEventListener("click", () => {
  

  // hide start, show stop
  startBtn.style.display = "none";
  stopBtn.style.display = "flex";

  chrome.tabCapture.capture(
    {
      audio: true,
      video: false,
    },
    (stream) => {
      if (stream) {
        startRecording(stream);
        seconds = 0;
        const time = document.getElementById("recordingTime");
        timerInterval = setInterval(() => {
          seconds++;
          const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
          const secs = String(seconds % 60).padStart(2, '0');
          time.textContent = `${mins}:${secs}`;
      }, 1000);

      } else {
        document.querySelector(".userPermission").textContent =
          "Unable to Record";
      }
    }
  );
});

function startRecording(stream) {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const destination = audioContext.createMediaStreamDestination();

  source.connect(audioContext.destination);
  source.connect(destination);

  // Recording destination stream se karo
  mediaRecorder = new MediaRecorder(destination.stream);
  recordedChunks = [];

  mediaRecorder.ondataavailable = (e) => {
    recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = async (e) => {
    let blob = new Blob(recordedChunks, { type: "audio/webm" });
    let url = window.URL.createObjectURL(blob);
    result.style.display = "block"
    let audioElement = document.querySelector(".link");
    audioElement.src = url;
    audioElement.controls = true;
    audioElement.play();

    stopBtn.style.display = "none";

    document.querySelector(".userPermission").textContent =
      "Recording Completed";
   
  };

  mediaRecorder.start();
}

document.querySelector(".stopRecord").addEventListener("click", () => {
  clearInterval(timerInterval);
  recordingStatus.style.display = "none";
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
});

downloadBtn.addEventListener("click", () => {
  if (recordedChunks.length) {
    let blob = new Blob(recordedChunks, { type: "audio/webm" });
    let url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm"; // default filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // free memory
    window.URL.revokeObjectURL(url);
  }
});
