const sleep = ms => new Promise(r => setTimeout(r, ms))

async function closeTabs(){
  window.close();
}
async function switchToAudioDownloadPage(){
  (await waitForElement("#selectTab > li:nth-child(2) > a")).click();
}
async function clickDownloadBtn(){
  (await waitForElement("#audio > table > tbody > tr > td.txt-center > button")).click();
}
async function clickConfirmBtnAndSendDwnLink(){
  let btn_anchor = await waitForElement("#process-result > div > a");
  console.log(btn_anchor)
  chrome.runtime.sendMessage({ link: btn_anchor.href })
}

async function waitForElement(selector, maxAttempts = 1 * 20 * 10, interval = 100){
  for(let i = 0; i < maxAttempts; i++){
    let elem = document.querySelector(selector)
    if(elem){
      return elem;
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
    await clickConfirmBtnAndSendDwnLink()
    await sleep(1E3)
    await closeTabs()
  } catch (e) {
   // chrome.runtime.sendMessage({ error: e })
    throw e;
  }
}

download()
