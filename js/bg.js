/*
  Info Obj {
  editable: false,
  frameId: 0,
  frameUrl: "https://www.youtube.com/watch?v=GIPVaV-NI4Y&list=RDGIPVaV-NI4Y&start_radio=1&ab_channel=PixelMate49",
  menuItemId: "audio",
  pageUrl: "https://www.youtube.com/watch?v=GIPVaV-NI4Y&list=RDGIPVaV-NI4Y&start_radio=1&ab,
  linkUrl: "where it takes you", <- when clicked on links
  parentMenuItemId: "video", <- doesnt appear if there is no parent ,
  }
 */

chrome.contextMenus.onClicked.addListener((info) => {
  const storage = chrome.storage.local;

  if (info.linkUrl) {
    console.log(info.linkUrl);
    if (info.parentMenuItemId) {
      storage.set({ format: info.menuItemId });
      openY2mateAndInjectScript("/js/video.js", info.linkUrl);
    } else if (info.menuItemId === "audio") {
      openY2mateAndInjectScript("/js/audio.js", info.linkUrl);
    } else if (info.menuItemId === "open normally") {
      openY2mateAndInjectScript("NoScript", info.linkUrl);
    } else {
      throw "wtf this not possible";
    }
  } else {
    if (info.parentMenuItemId) {
      storage.set({ format: info.menuItemId });
      openY2mateAndInjectScript("/js/video.js");
    } else if (info.menuItemId === "audio") {
      openY2mateAndInjectScript("/js/audio.js");
    } else if (info.menuItemId === "open normally") {
      openY2mateAndInjectScript("NoScript");
    } else {
      throw "wtf this not possible";
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  const contexts = ["link", "page", "video"];
  chrome.contextMenus.create({
    title: "Open with y2mate",
    id: "open normally",
    contexts: contexts,
  });

  const video = chrome.contextMenus.create({
    contexts: contexts,
    title: "Video",
    id: "video",
  });

  chrome.contextMenus.create({
    contexts: contexts,
    title: "Audio (mp3)",
    id: "audio",
  });

  //childs
  chrome.contextMenus.create({
    title: "Auto 1080p to lower quality",
    parentId: video,
    id: "auto",
    contexts: contexts,
  });
  chrome.contextMenus.create({
    title: "1080p HD only",
    parentId: video,
    id: "1080p",
    contexts: contexts,
  });
  chrome.contextMenus.create({
    title: "720p FHD only",
    parentId: video,
    id: "720p",
    contexts: contexts,
  });
  chrome.contextMenus.create({
    title: "480p only",
    parentId: video,
    id: "480p",
    contexts: contexts,
  });
  chrome.contextMenus.create({
    title: "360p only",
    parentId: video,
    id: "360p",
    contexts: contexts,
  });
});

function modifyUrl(url = "") {
  if (url.includes("https://www.youtube.com/watch?v=")) {
    const start = url.indexOf("=") + 1; //because in the substring method takes indexes like this [start, end)
    const end = start + 11; //youtube video id is 11 characters
    const vidID = url.substring(start, end);
    if (vidID) return "https://www.y2mate.com/youtube/" + vidID;
  } else if (url.includes("https://www.youtube.com/shorts/")) {
    const urlparts = url.split("/");
    const vidID = urlparts[urlparts.length - 1];
    if (vidID) return "https://www.y2mate.com/youtube/" + vidID;
  }
}

function openY2mateAndInjectScript(script = "NoScript", url = "optional") {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let modifiedUrl;
    if (url !== "optional") modifiedUrl = modifyUrl(url);
    else modifiedUrl = modifyUrl(tabs[0].url);
    if (!modifiedUrl) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          alert("wrong website or not valid link");
        },
      });
      return 0;
    }
    chrome.tabs.create({ url: modifiedUrl }, (tab) => {
      if (script === "NoScript") {
        return 0;
      }
      //inject scripts
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: [script],
      });
      chrome.tabs.update(tabs[0].id, { active: true });
    });
  });
}

chrome.runtime.onMessage.addListener((req) => {
  if (req.error) console.error(req.error);
  else if (req.message) console.log(req.message);
  else if (req.link) chrome.tabs.create({ url: req.link });
  else if (req.script) openY2mateAndInjectScript(req.script);
  else console.error("Request to background script not valid");
});
