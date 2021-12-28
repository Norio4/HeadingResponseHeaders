'use strict';

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function runFetch() {
    const tab = await getCurrentTab();
    const url = tab.url;
    const results = document.getElementById("results");
    const loading = "<pre><code>" + "Loading .."  + "</code></pre>"
    results.innerHTML = loading;
    const res = await fetchHeaders(url)
      .catch(function(err){
        return;
      });
    if(!res){
      return;
    }
    let str = `<h1>Heading Response Headers</h1>
              <h2>${url}</h2>`;
    if(res){
      for(let key in res){
        str += `<li>${key}: ${res[key]}</li>`;
      }
    }else{
      str += "<p>Error</p>";
    }
    const html = `<ul>${str}</ul>`;
    results.innerHTML = html;
}

function fetchHeaders(url, results) {
    return new Promise(function(resolve, reject){
      const req = new XMLHttpRequest();
      req.onload = function() {
          const headers = req.getAllResponseHeaders().split(/\r?\n/);
          const jsonObj = {};
          for (let i= 0; i < headers.length; i++) {
              const thisItem = headers[i];
              console.log(thisItem);
              const firstIndex = thisItem.indexOf(':');
              const key = thisItem.substring(0, firstIndex);
              const value = thisItem.substring(firstIndex + 1).replace(" ", "");
              jsonObj[key] = value;
          }
          delete jsonObj[""];
          return resolve(jsonObj);
      };
      req.onerror = function() {
        return reject();
      };

      req.open('GET', url, true);
      req.send(null);
    });
}

runFetch()
