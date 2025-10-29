async function runPipeline() {
  const input = document.getElementById("input").value;

  const res = await fetch("https://fiverr-automation-backend.onrender.com/neural/generator", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "brotherkey123"
    },
    body: JSON.stringify({ prompt: input })  // ✅ 一定要这一行！
  });

  const data = await res.json();
  displayOutput(data);
}

async function runPipelineWithEndpoint(endpoint) {
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
  displayOutput(data);
}

function displayOutput(data) {
  const outputBox = document.getElementById("output");
  
  // 安全保护：防止空响应
  if (!data || Object.keys(data).length === 0) {
    outputBox.textContent = "No output received (empty response)";
    return;
  }
  
  outputBox.textContent = data.output || "No output received.";
}