const urlParams = new URLSearchParams(window.location.search);
const navItems = document.querySelectorAll(".nav .nav-item .nav-link");

const page = urlParams.get("page") ?? "links";
navItems.forEach(item => {
    if (item.textContent.toLowerCase() === page.toLowerCase()) {
        item.classList.add("active");
        item.setAttribute("aria-current", "page");
    }

    item.href = `${location.pathname}?page=${item.textContent.toLowerCase().trim()}`;
})

function formatCountdown(ms) {
    if (ms <= 0) return "Expired";

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function updateTimes() {
    document.querySelectorAll("#link-row").forEach(row => {
        const now = Date.now();
        const expires_at = row.querySelector("#link-expires-at").textContent;

        const expiresAt = new Date(parseInt(expires_at)).getTime();
        const diff = expiresAt - now;

        const countdownText = formatCountdown(diff);

        row.querySelector("#link-expiration").textContent = countdownText;
    });
}

setInterval(updateTimes, 1000);
updateTimes();