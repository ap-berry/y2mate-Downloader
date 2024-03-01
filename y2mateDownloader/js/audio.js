const sleep = ms => new Promise(r => setTimeout(r, ms))

function closeTabs(){
  window.close();
}
function switchToAudioDownloadPage(){
  return waitForElementAndClick("#selectTab > li:nth-child(2) > a");
}
function clickDownloadBtn(){
  return waitForElementAndClick("#audio > table > tbody > tr > td.txt-center > button");
}
function clickConfirmBtn(){
  return waitForElementAndClick("#process-result > div > a", 1000000);
}
async function waitForElementAndClick(selector, maxAttempts = 10000, interval = 100){
  for(let i = 0; i < maxAttempts; i++){
    let elem = document.querySelector(selector)
    if(elem){
      elem.click();
      return;
    }
    else{
      await new Promise(resolve => {setTimeout(() => { resolve() }, interval)});
    }
  }

  throw Error("Element Not Found")

}

//workflow
async function download(){
  try {
    await switchToAudioDownloadPage()
    await clickDownloadBtn()
    await clickConfirmBtn()
    await sleep(1E3)
    closeTabs()
  } catch (e) {
    alert(e)
  }
}

download()
