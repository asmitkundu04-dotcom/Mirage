const urlForm = document.getElementById("urlForm");
const scanBtn = document.getElementById("scanBtn");
const message = document.getElementById("message");
const input = document.getElementById("urlInput");
const resConfidence = document.getElementById("resConfidence");
const resUrl = document.getElementById("resUrl");
const resVerdict = document.getElementById("resVerdict");
const resultCard = document.getElementById("result");

const PERCENT_MULTIPLIER = 100;

const toggleScanState = (scanning) => {
  scanBtn.disabled = scanning;
  scanBtn.textContent = scanning ? "Scanning..." : "Scan URL";
};

const displayVerdict = (data) => {
  resUrl.textContent = data.url;
  resVerdict.textContent = data.verdict;
  
  resVerdict.className = ""; 
  if (data.verdict === "Phishing") {
    resVerdict.classList.add("verdict-phishing");
  } else if (data.verdict === "Suspicious") {
    resVerdict.classList.add("verdict-suspicious");
  } else {
    resVerdict.classList.add("verdict-safe");
  }

  resConfidence.textContent = Math.round(data.confidence * PERCENT_MULTIPLIER) + "%";
  resultCard.classList.remove("hidden");
};

urlForm.addEventListener("submit", async (event) => {
  event.preventDefault(); 
  
  const url = input.value.trim();
  
  message.textContent = "";
  resultCard.classList.add("hidden"); 
  resVerdict.className = "";

  if (!url) {
    message.textContent = "Please enter a URL.";
    message.className = "message error";
    return;
  }
  
  toggleScanState(true);

  try {
    const res = await fetch("/scan_url", {
      body: JSON.stringify({ url }),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
    
    if (!res.ok) throw new Error(`Server returned status: ${res.status}`);

    const data = await res.json();
    
    displayVerdict(data);
    
  } catch (err) {
    console.error("Scan Error:", err); 
    message.textContent = "Failed to scan. Please try again.";
    message.className = "message error";
    
  } finally {
    toggleScanState(false);
  }
});
