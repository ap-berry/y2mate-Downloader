


let format = null;

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("audioBtn").addEventListener("click", downloadMp4)
  document.getElementById("videoBtn").addEventListener("click", downloadVideo)
  document.getElementById("openUrl").addEventListener("click", openY2mateAndInjectScript)
  document.getElementById("qualitySlct").addEventListener("change", formatSelected)
});

function formatSelected(e){
  document.getElementById("videoBtn").disabled = !(e.target.value !== "none");
    // Set data in storage
  chrome.storage.local.set({ format: document.getElementById("qualitySlct").value });
}

// Function to modify the URL by adding "pp" before the ".com"
function modifyUrl(url = "") {
  if(!url.includes("youtube.com")){
    return null
  }

  if(url.includes("/shorts/")){
    let urlparts = url.split("/")
    return "https://www.y2mate.com/youtube/"+urlparts[urlparts.length-1]
  } 
  else {
    const start = url.indexOf("=")+1 //because in the substring method takes indexes like this [start, end)
    const end = url.indexOf("&", start)

    return "https://www.y2mate.com/youtube/"+url.substring(start, end)
  }
}

function openY2mateAndInjectScript(type){
   chrome.tabs.query({ active: true, currentWindow: true },function (tabs) {
    const modifiedUrl = modifyUrl(tabs[0].url);
    if(modifiedUrl === null){
      alert("Wrong Website")
      return 0;
    }
    chrome.tabs.create({ url : modifiedUrl }, (tab) => {
      if(typeof type !== "string"){
        return 0;
      }
      //inject scripts
      chrome.scripting.executeScript({
        target : { tabId : tab.id},
        files : [type]
      })
    })
  });
}


function downloadMp4(){
  openY2mateAndInjectScript("/js/audio.js");
}

function downloadVideo(){
  openY2mateAndInjectScript("/js/video.js")
}