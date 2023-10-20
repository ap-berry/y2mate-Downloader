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

function closeTabs(){
  window.close();
}


async function download(){
  try {
    await waitForElementAndClick("#selectTab > li:nth-child(2) > a")
    await waitForElementAndClick("#audio > table > tbody > tr > td.txt-center > button")
    await waitForElementAndClick("#process-result > div > a", 1000000)
    closeTabs()
  } catch (e) {
    alert(e)
  }
}

download()
