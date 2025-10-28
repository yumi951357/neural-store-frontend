const API = "https://fiverr-automation-backend.onrender.com/neural/generator";

async function runPipeline() {
  const prompt = document.getElementById("task").value.trim() ||
    "Generate a practical Fiverr automation plan.";
  const output = document.getElementById("output");
  const btn = document.getElementById("runBtn");
  btn.disabled = true;
  output.textContent = "⏳ Running Neural Pipeline...";
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    output.textContent = data.output || "No output.";
  } catch (err) {
    output.textContent = "❌ " + err.message;
  } finally {
    btn.disabled = false;
  }
}
window.runPipeline = runPipeline;