async function runPipeline() {
  const input = document.getElementById("taskInput").value;
  const outputBox = document.getElementById("outputBox");
  outputBox.innerText = "Running neural pipeline...";

  const endpoints = ["generator", "refiner", "verifier"];
  let resultText = "";

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`https://fiverr-automation-backend.onrender.com/neural/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "brotherkey123"
        },
        body: JSON.stringify({ prompt: input })
      });

      if (res.ok) {
        const data = await res.json();
        resultText += `\n${endpoint.toUpperCase()} ✅\n${data.output}\n`;
      } else {
        resultText += `\n${endpoint.toUpperCase()} ❌ HTTP ${res.status}\n`;
      }
    } catch (e) {
      resultText += `\n${endpoint.toUpperCase()} ❌ ${e.message}\n`;
    }
  }

  outputBox.innerText = resultText || "No output received.";
}