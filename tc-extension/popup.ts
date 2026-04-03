const analyze = async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const tab = tabs[0];

  if (!tab || !tab.id) {
    console.error("Tab not found");
    return;
  }

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => document.body.innerText,
    },
    (results) => {
      if (!results || !results[0]) return;

      const text = (results[0].result as string).slice(0, 5000);
      console.log(text);
    }
  );
};