const inputText = document.getElementById('input-text');
const actionSelect = document.getElementById('action-select');
const executeBtn = document.getElementById('execute-btn');
const errorAlert = document.getElementById('error-message');
const fileInput = document.getElementById('formFile');
let selectedAction = null;
let copy = false;
const popoverDiv = document.querySelector('.popover-dismiss');
const popover = new bootstrap.Popover('.popover-dismiss', {
  trigger: 'hover focus'
})

function showError(message) {
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
}

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            inputText.value = e.target.result;
        }
        reader.readAsText(file);
    }
});


actionSelect.addEventListener('click', (event) => {
    if (event.target.classList.contains('dropdown-item')) {
        selectedAction = event.target.textContent.trim();
        actionSelect.querySelector('.btn').textContent = selectedAction;
    }
});

inputText.addEventListener('click', (event) => {
    if (copy) {
        inputText.select();
        inputText.setSelectionRange(0, 99999); // For mobile devices
        navigator.clipboard.writeText(inputText.value);
        // position at the mouse click
        popoverDiv.style.top = `${event.clientY - 5}px`;
        popoverDiv.style.left = `${event.clientX}px`;

        popover.show();
        copy = false;
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
            return;
        }
    }
    copy = true;
});

// Hide popover when user moves the mouse or clicks anywhere on the page
document.addEventListener('mousemove', () => {
    if (popover._isShown) {
        popover.hide();
    }
});