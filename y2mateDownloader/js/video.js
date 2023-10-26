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

async function findDownloadButton(videoFormat){
  const table = await waitForElement("#mp4 > table > tbody");
  const rows = table.getElementsByTagName("tr");
  let foundFormat = false;

  for (let index = 0; index < rows.length; index++) {
    const text = rows[index].getElementsByTagName("td")[0].textContent;
    if(text.includes(videoFormat)){
      foundFormat = true;
      try{
        await clickToDownload(index+1);
        break;
      }
      catch(err){
        alert("Format Found But Error Occurred"+err.toString());
      }
    }
  }

  if(!foundFormat){
    alert("Desired Format Not Found.Try Download It Yourself");
  }
}

// workflow
async function clickToDownload(buttonIndex){
  const downloadbtn = await waitForElement(btnSelector(buttonIndex))
  downloadbtn.click()
  const confirmbtn = await waitForElement("#process-result > div > a", maxAttempts = 1000000)
  confirmbtn.click()
  closeTabs()
}

// Get data from storage and call
chrome.storage.local.get(["format"], async function(result) {
    await findDownloadButton(result.format)
    chrome.storage.local.clear()
});
