async function runPipeline() {
  const input = document.getElementById("taskInput").value.trim();
  const outputBox = document.getElementById("outputBox");
  outputBox.innerText = "Running neural pipeline...\n";

  const endpoints = ["generator", "refiner", "verifier"];
  const apiKey = "brotherkey123";
  let resultText = "";

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`https://fiverr-automation-backend.onrender.com/neural/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({ prompt: input })
      });

      const data = await res.json();
      resultText += `${endpoint.toUpperCase()} → ${data.output}\n`;
    } catch (err) {
      resultText += `${endpoint.toUpperCase()} → Error: ${err.message}\n`;
    }
  }

  outputBox.innerText = resultText;
}