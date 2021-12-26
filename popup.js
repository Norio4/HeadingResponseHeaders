'use strict';

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function runFetch() {
    let tab = await getCurrentTab();
    let url = tab.url;
    let results = document.getElementById("results");
    var loading = "<pre><code>" + "Loading .."  + "</code></pre>"
    results.innerHTML = loading;
    chrome.scripting.executeScript(
    {
        target: {tabId: tab.id},
        func: fetchHeaders,
        args: [url, results],

    },
    (injectionResults) => {
          // for (const frameResult of injectionResults)
          // alert('Frame: ' + frameResult.result);
    });
}

function fetchHeaders(url, results) {
    alert(url);
    var req = new XMLHttpRequest();
    req.onload = function() {
        var headers = req.getAllResponseHeaders().split(/\r?\n/);

        var _data = new Object();
        var jsonObj = new Object();
        var i =0;
        for (i= 0; i < headers.length; i++) {
            var thisItem = headers[i];
            console.log(thisItem);
            var key = thisItem.substring(0, thisItem.indexOf(':'));
            var value = thisItem.substring(thisItem.indexOf(':')+1).replace(" ", "");;
            jsonObj[key] = value;
        }
        delete jsonObj[""];
        // alert(JSON.stringify(jsonObj, null, 2));
        var keys = Object.keys(jsonObj);
        keys.sort();
        i, len = keys.length;
        var res = {}
        for (i = 0; i < len; i++) {
          k = keys[i];
          res[k] = jsonObj[k];
        }
        alert(JSON.stringify(res, null, 2));

        // var prettyJson = "<pre><code>" + JSON.stringify(jsonObj, null, 2) + "</code></pre>"
        // var results = document.getElementById("results");
        // results.innerHTML = prettyJson;
    };
    req.onerror = function() {
      alert("Network Error");
    };

    req.open('GET', url, true);
    req.send(null);
}

runFetch()
