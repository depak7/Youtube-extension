let isPaused = false;

console.log('Content script loaded.');

document.addEventListener('visibilitychange', () => {
  if (!isPaused) return;

  const video = document.querySelector('video');
  if (video) {
    if (document.visibilityState === 'hidden') {
      video.pause();
    } else if (document.visibilityState === 'visible') {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video playback resumed successfully');
          })
          .catch((error) => {
            console.error('Failed to resume video playback:', error);
          });
      }
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.isPaused !== undefined) {
    console.log('Received message:', request);
    isPaused = request.isPaused;
    sendResponse({status: 'success'});
  }
});
