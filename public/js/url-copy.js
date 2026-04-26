document.querySelectorAll("#copy").forEach(element => {
    element.addEventListener("click", () => {
        var target = element.getAttribute("target");
        var targetElem = document.getElementById(target);
        targetElem.select();
        targetElem.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(targetElem.value);
        alert("Copied link to clipboard!");
    })
});