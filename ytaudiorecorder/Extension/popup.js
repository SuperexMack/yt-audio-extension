let mediaRecorder;
let recordedChunks = [];
let wholeData;
let message;

let ContentArea = document.getElementById("content-area");
let promptArea = document.getElementById("input-box");
let SubmitButton = document.getElementById("send-btn");

document.querySelector(".startRecord").addEventListener("click", () => {
  chrome.tabCapture.capture(
    {
      audio: true,
      video: false,
    },
    (stream) => {
      if (stream) {
        startRecording(stream);
        document.querySelector(".userPermission").textContent =
          "Listening and Recording ...";
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

    let audioElement = document.querySelector(".link");
    audioElement.src = url;
    audioElement.controls = true;
    audioElement.play();

    document.querySelector(".userPermission").textContent =
      "Hehe 😁 That's ur result Now Download it";
   
  };

  mediaRecorder.start();
}

document.querySelector(".stopRecord").addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
});
