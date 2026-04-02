const pwdLength = document.getElementById("length");
const pwdLengthLabel = document.getElementById("lengthLabel");
const pwdIncludeNum = document.getElementById("include-numbers");
const pwdIncludeSpecial = document.getElementById("include-special");

const pwdOutputMultiple = document.getElementById("password-output-multiple");
const pwdOutput = document.getElementById("password-output");

const generateBtn = document.getElementById("generate-btn");
const pwdDownload = document.getElementById("download-to-file");

const pwdMultipleContainer = document.getElementById("multiple-passwords-container");
const pwdMultiple = document.getElementById("multiple-passwords");
const pwdAmount = document.getElementById("amount");
const pwdAmountLabel = document.getElementById("amountLabel");

const downloadFileOutput = document.getElementById("downloadFile");

let currentMode = "single";
let currentOutputMode = "text";

function updateOutputMode(mode) {
    currentOutputMode = mode;
    if (currentOutputMode === "text") {
        generateBtn.textContent = "Generate";
    }
    else if (currentOutputMode === "file") {
        generateBtn.textContent = "Generate & download";
    }
}
updateOutputMode("text");

function updateMode(mode) {
    currentMode = mode;
    pwdOutput.style.display = "none";
    pwdOutputMultiple.style.display = "none";
    pwdMultipleContainer.style.display = "none";

    if (mode === "single") {
        pwdOutput.style.display = "block";
    } else if (mode === "multiple") {
        pwdOutputMultiple.style.display = "block";
        pwdMultipleContainer.style.display = "block";
    }
}
updateMode("single");

pwdMultiple.addEventListener("input", () => {
    if (pwdMultiple.checked) {
        updateMode("multiple");
    }
    else {
        updateMode("single");
    }
});

pwdDownload.addEventListener("input", () => {
    if (pwdDownload.checked) {
        updateOutputMode("file");
    }
    else {
        updateOutputMode("text");
    }
});

const CHARACTERS = "qwertyuiopasdfghjklzxcvbnm".split('');
const NUMBERS = "1234567890".split('');
const SPECIAL = "!@#$%^&*()-_=+/?".split('');

pwdLength.addEventListener("input", () => {
    pwdLengthLabel.textContent = pwdLength.value;
});

pwdAmount.addEventListener("input", () => {
    pwdAmountLabel.textContent = pwdAmount.value;
});

generateBtn.addEventListener("click", () => {
    let data = ""
    if (currentMode === "single") {
        let password = generatePassword(pwdIncludeNum.checked, pwdIncludeSpecial.checked, pwdLength.value)
        pwdOutput.value = password;
        data = password
    }
    else if (currentMode === "multiple") {
        let passwords = []
        for (let i = 0; i < pwdAmount.value; i++) {
            passwords.push(generatePassword(pwdIncludeNum.checked, pwdIncludeSpecial.checked, pwdLength.value));
        }
        let passwordsString = passwords.join('\n');
        pwdOutputMultiple.value = passwordsString;
        data = passwordsString;
    }

    if (currentOutputMode === "file") {
        const blob = new Blob([data], {type: "text/plain"});
        const fileUrl = URL.createObjectURL(blob);
        downloadFileOutput.href = fileUrl;
        downloadFileOutput.download = "passwords.txt";
        downloadFileOutput.click();
        URL.revokeObjectURL(fileUrl);
    }
})

function generatePassword(includeNumbers, includeSpecial, length) {
    let password = "";
    let choose = ["char"];
    if (includeNumbers) choose.push("num");
    if (includeSpecial) choose.push("spec");

    for (let i = 0; i < length; i++) {
        var randomType = randomArr(choose);
        switch (randomType) {
            case "char":
                password += randomArr(CHARACTERS);
                break;
            case "num":
                password += randomArr(NUMBERS);
                break;
            case "spec":
                password += randomArr(SPECIAL);
                break;
            default:
                password += randomArr(CHARACTERS);
                break;
        }
    }
    return password
}

function randomArr(array) {
    var random = Math.floor(Math.random() * array.length);
    return array[random]; 
}