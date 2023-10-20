function waitForElementAndClick(selector, maxAttempts = 10000, interval = 100) {
  return new Promise(async (resolve, reject) => {
    let attempts = 0;

    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        element.click();
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
function closeTabs(){
  window.close()
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
