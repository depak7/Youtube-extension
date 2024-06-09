document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle');

  chrome.storage.sync.get(['isPaused'], (result) => {
    const isPaused = result.isPaused || false;
    updateButtonState(isPaused);
  });

  toggleButton.addEventListener('click', () => {
    chrome.storage.sync.get(['isPaused'], (result) => {
      const isPaused = !result.isPaused;
      chrome.storage.sync.set({ isPaused }, () => {
        console.log(`Video pause functionality ${isPaused ? 'activated' : 'deactivated'}`);
        updateButtonState(isPaused);

        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { isPaused }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Failed to send message:', chrome.runtime.lastError.message);
              } else {
                console.log('Message sent successfully:', response);
              }
            });
          } else {
            console.error('No active tab found.');
          }
        });
      });
    });
  });

  function updateButtonState(isPaused) {
    toggleButton.textContent = isPaused ? 'Deactivate Pausing' : 'Activate Pausing';
  }
});
