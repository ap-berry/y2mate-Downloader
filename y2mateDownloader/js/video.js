
function waitForElementAndCallBack(selector, callback, maxAttempts = 10000, interval = 100) {
    return new Promise(async (resolve, reject) => {
      let attempts = 0;
  
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (element && typeof callback === 'function') {
          callback(element)
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error("Element not found after multiple attempts."));
        } else {
          attempts++;
          setTimeout(checkElement, interval);
        }
      };
  
      checkElement();
    });
  }
  

function textSelector(n){
  return `#mp4 > table > tbody > tr:nth-child(${n}) > td:nth-child(1)`
}
function btnSelector(n){
  return `#mp4 > table > tbody > tr:nth-child(${n}) > td.txt-center > button`
}
function closeTabs(){
  window.close()
}

  async function download(videoFormat){
    await waitForElementAndCallBack("#mp4 > table > tbody", async function (element){
      const rows = element.getElementsByTagName("tr")
      let foundFormat = false
      for(let i = 0; i < rows.length; i++){
        const text = rows[i].getElementsByTagName("td")[0].textContent
        if(text.includes(videoFormat)){
          // download
          waitForElementAndCallBack(btnSelector(i+1), async (el) => {
          el.click()
          await waitForElementAndCallBack("#process-result > div > a", (e) => {e.click()}, 1000000)
            closeTabs()
          })
          foundFormat = true
          break;
        }
      }
      if(!foundFormat){
        alert("Desired Format Not Found. Try Downloading It Yourself")
      }
    })
  }

// Get data from storage
chrome.storage.local.get(["format"], function(result) {
    download(result.format)
    chrome.storage.local.clear()
});
