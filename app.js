async function runPipeline(endpoint) {
  const input = document.getElementById("input").value;

  const res = await fetch(`https://fiverr-automation-backend.onrender.com/neural/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "brotherkey123"
    },
    body: JSON.stringify({ prompt: input })
  });

  const data = await res.json();
  document.getElementById("output").textContent = data.output || "No output received.";
}
