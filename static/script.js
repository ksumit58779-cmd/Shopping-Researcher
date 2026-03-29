// ─── Loading messages ───
const loadingMessages = [
  "Searching Amazon for you...",
  "Analyzing products...",
  "Comparing prices & ratings...",
  "Personalizing for Sumit...",
  "Almost there..."
];

let loaderInterval = null;
let msgIndex = 0;

// ─── Main Search Handler ───
async function handleSearch() {
  const input  = document.getElementById("searchInput");
  const query  = input.value.trim();

  if (!query) {
    shakeInput();
    return;
  }

  showLoader();
  hideResults();

  try {
    const res  = await fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const data = await res.json();
    hideLoader();

    if (data.error) {
      showResults(`<p style="color:#c0392b;">❌ ${data.error}</p>`, query);
    } else {
      showResults(data.result, query);
    }

  } catch (err) {
    hideLoader();
    showResults(`<p>❌ Something went wrong. Please try again!</p>`, query);
  }
}

// ─── Quick Search from chips ───
function quickSearch(query) {
  document.getElementById("searchInput").value = query;
  handleSearch();
}

// ─── Show Loader ───
function showLoader() {
  const loader     = document.getElementById("loader");
  const loaderText = document.getElementById("loaderText");

  loader.classList.add("active");
  msgIndex = 0;
  loaderText.textContent = loadingMessages[0];

  loaderInterval = setInterval(() => {
    msgIndex = (msgIndex + 1) % loadingMessages.length;
    loaderText.style.opacity = "0";
    setTimeout(() => {
      loaderText.textContent   = loadingMessages[msgIndex];
      loaderText.style.opacity = "1";
    }, 200);
  }, 2000);
}

// ─── Hide Loader ───
function hideLoader() {
  clearInterval(loaderInterval);
  document.getElementById("loader").classList.remove("active");
}

// ─── Show Results ───
function showResults(html, query) {
  const section = document.getElementById("resultsSection");
  const content = document.getElementById("resultsContent");
  const title   = document.getElementById("resultsTitle");

  title.textContent   = `Results for "${query}"`;
  content.innerHTML   = html;
  section.classList.add("active");

  // Smooth scroll to results
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Hide Results ───
function hideResults() {
  document.getElementById("resultsSection").classList.remove("active");
}

// ─── Shake Input on empty search ───
function shakeInput() {
  const box = document.querySelector(".search-box");
  box.style.animation = "none";
  box.style.transform = "translateX(0)";

  let shakes = 0;
  const shake = setInterval(() => {
    box.style.transform = shakes % 2 === 0 ? "translateX(-8px)" : "translateX(8px)";
    shakes++;
    if (shakes > 5) {
      clearInterval(shake);
      box.style.transform = "translateX(0)";
    }
  }, 60);

  box.style.borderColor = "#c0392b";
  setTimeout(() => { box.style.borderColor = ""; }, 800);
}

// ─── Enter Key Support ───
document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

// ─── Loader text fade transition ───
document.getElementById("loaderText").style.transition = "opacity 0.2s ease";

// ─── Page Load Animation ───
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  setTimeout(() => { document.body.style.opacity = "1"; }, 100);
});