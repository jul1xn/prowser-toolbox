const fileUpload = document.getElementById("file-upload");
const fileUploadForm = document.getElementById("file-form");
const fileUploadField = document.getElementById("file-field");
const loader = document.getElementById("loader");

if (fileUpload) {
    fileUpload.addEventListener("click", () => {
        fileUploadField.click();
    })
}

if (fileUploadField) {
    fileUploadField.addEventListener("change", () => {
        loader.style.display = "block";
        fileUploadForm.submit();
    });
}

document.querySelectorAll("#copy").forEach(element => {
    element.addEventListener("click", () => {
        var target = element.getAttribute("target");
        var targetElem = document.getElementById(target);
        targetElem.select();
        targetElem.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(targetElem.value);
        alert("Copied link to clipboard!");
    })
})

document.addEventListener("paste", async (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
        if (item.type.startsWith("image")) {
            const file = item.getAsFile();
            if (!file) return;

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            fileUploadField.files = dataTransfer.files;

            loader.style.display = "block";
            fileUploadForm.submit();
            return;
        }

        if (item.kind === "file") {
            const file = item.getAsFile();
            if (!file) return;

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            fileUploadField.files = dataTransfer.files;

            loader.style.display = "block";
            fileUploadForm.submit();
            return;
        }
    }
});