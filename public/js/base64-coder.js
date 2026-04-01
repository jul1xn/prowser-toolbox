const inputText = document.getElementById('input-text');
const actionSelect = document.getElementById('action-select');
const executeBtn = document.getElementById('execute-btn');
const errorAlert = document.getElementById('error-message');
let selectedAction = null;

function showError(message) {
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
}

actionSelect.addEventListener('click', (event) => {
    if (event.target.classList.contains('dropdown-item')) {
        selectedAction = event.target.textContent.trim();
        actionSelect.querySelector('.btn').textContent = selectedAction;
    }
});

executeBtn.addEventListener('click', () => {
    const text = inputText.value;
    if (!selectedAction) {
        showError('Please select an action (Encode or Decode).');
        return;
    }
    if (selectedAction === 'Encode') {
        inputText.value = btoa(text);
    }
    else if (selectedAction === 'Decode') {
        try {
            inputText.value = atob(text);
        } catch (e) {
            showError('Invalid Base64 string.');
        }
    }
});