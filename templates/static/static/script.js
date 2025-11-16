const input = document.getElementById("urlInput");
const scanBtn = document.getElementById("scanBtn");
const resultBox = document.getElementById("result");

scanBtn.addEventListener("click", async () => {
  const url = input.value.trim();
  if (!url) {
    resultBox.textContent = "Please enter a URL.";
    resultBox.style.color = "red";
    return;
  }

  scanBtn.disabled = true;
  resultBox.textContent = "Checking...";
  resultBox.style.color = "#777";

  try {
    const res = await fetch("/scan_url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    if (!res.ok) {
      throw new Error(`Server responded with status: ${res.status}`);
    }

    const data = await res.json();
    resultBox.textContent = `URL: ${data.url}\nVerdict: ${data.verdict}\nConfidence: ${Math.round(data.confidence * 100)}%`;
    resultBox.style.color =
      data.verdict === "Phishing" ? "red" :
      data.verdict === "Suspicious" ? "orange" : "green";

  } catch (err) {
    console.error("Scan failed:", err);
    resultBox.textContent = "Failed to check. Please try again.";
    resultBox.style.color = "red";
  } finally {
    scanBtn.disabled = false;
  }
});
