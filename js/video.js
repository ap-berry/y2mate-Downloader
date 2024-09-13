const sleep = ms => new Promise(r => setTimeout(r, ms))
let continueIfFormatNotFound = false
let possibleFormats = [ "1080p", "720p", "480p", "360p" ]
function textSelector(n){
  return `#mp4 > table > tbody > tr:nth-child(${n}) > td:nth-child(1)`
}
function btnSelector(n){
  return `#mp4 > table > tbody > tr:nth-child(${n}) > td.txt-center > button`
}
function closeTabs(){
  window.close()
}



async function waitForElement(selector, maxAttempts = 10000, interval = 100){
  for (let i = 0; i < maxAttempts; i++) {
    let elem = document.querySelector(selector)
    if(elem){
      return elem;
    } 
    else{
      await new Promise(resolve => setTimeout( resolve , interval))
    }
  }
  throw Error("Element Not Found")
}

async function findDownloadButton(videoFormat, n = 0){
  const table = await waitForElement("#mp4 > table > tbody");
  const rows = table.getElementsByTagName("tr");
  let foundFormat = false;

  if (videoFormat == "auto"){
    continueIfFormatNotFound = true
    if(possibleFormats.length == 0){
      alert("Possible formats are not specified in the code")
      return
    }
    videoFormat = possibleFormats[0]
  }

  for (let index = 0; index < rows.length; index++) {
    const text = rows[index].getElementsByTagName("td")[0].textContent;
    if(text.includes(videoFormat)){
      foundFormat = true;
      try{
        await download(index+1);
        break;
      }
      catch(err){
        alert("Format Found But Error Occurred"+err.toString());
      }
    }
  }

  if(!foundFormat){
    if(continueIfFormatNotFound){
      let nextIndex = n+1
      if(nextIndex < possibleFormats.length){
        findDownloadButton(possibleFormats[nextIndex], nextIndex)
        return
      }
    }
    alert("Desired Format Not Found.Try Downloading It Yourself");
  }
}

// workflow
async function download(buttonIndex){
  const downloadbtn = await waitForElement(btnSelector(buttonIndex))
  downloadbtn.click()
  const confirmbtn_anchor = await waitForElement("#process-result > div > a")
  chrome.runtime.sendMessage({ link : confirmbtn_anchor.href })
  await sleep(1E3)
  closeTabs()
}

// Get data from storage and call
chrome.storage.local.get(["format"], async function(result) {
    await findDownloadButton(result.format)
    chrome.storage.local.clear()
});
