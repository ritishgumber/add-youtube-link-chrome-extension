function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome
    .tabs
    .query(queryInfo, function (tabs) {
      var tab = tabs[0];
      var url = tab.url;
      callback(url);
    });

}

function sendYoutubeUrl(url, callback) {

  var parser = document.createElement('a');
  parser.href = url;
  var search = parser.search;
  search = search.split('=');
  var id = search[search.indexOf('?v') + 1];
  console.log(id);
  var videoUrl = 'https://youtube-chrome-extension.herokuapp.com/save?id=' + id
  var xhr = new XMLHttpRequest();
  xhr.open('GET', videoUrl);
  xhr.responseType = 'json';
  xhr.onload = function () {
    var response = xhr.response;
    if (!response.status) {
      callback.error('Error processing video link');
      return;
    }

    callback.success(response);
  };
  xhr.onerror = function () {
    callback.error('Network error.');
  };
  xhr.send();
}

function renderStatus(statusText) {
  document
    .getElementById('status')
    .textContent = statusText;
}

document
  .addEventListener('DOMContentLoaded', function () {
    getCurrentTabUrl(function (url) {
      if (url.startsWith('https://www.youtube.com/watch')) {
        sendYoutubeUrl(url, {
          success: function (res) {
            renderStatus(res.message)
          },
          error: function (err) {
            renderStatus('err' + err)
          }
        });
      } else {
        renderStatus('Open Youtube Video Page! :)');
      }
    });
  });
