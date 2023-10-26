document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("audioBtn").addEventListener("click", downloadMp4);
  document.getElementById("videoBtn").addEventListener("click", downloadVideo);
  document.getElementById("openUrl").addEventListener("click", openY2mateAndInjectScript);
  document.getElementById("qualitySlct").addEventListener("change", formatSelected);
});

function formatSelected(e){
  document.getElementById("videoBtn").disabled = !(e.target.value !== "none");
    // Set data in storage for later use
  chrome.storage.local.set({ format: document.getElementById("qualitySlct").value });
}

function downloadMp4(){
  chrome.runtime.sendMessage({ script : "/js/audio.js" });
}

function downloadVideo(){
  chrome.runtime.sendMessage({ script : "/js/video.js" });
}