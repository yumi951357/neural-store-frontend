async function runPipeline() {
  const input = document.getElementById("taskInput").value.trim();
  const outputBox = document.getElementById("outputBox");
  if (!input) {
    outputBox.innerText = "⚠️ 请先输入任务。";
    return;
  }

  outputBox.innerText = "🌀 正在运行神经管道...\n";

  const endpoints = ["generator", "refiner", "verifier"];
  const apiKey = "brotherkey123";
  let resultText = "";

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`https://fiverr-automation-backend.onrender.com/neural/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({ prompt: input })
      });

      if (response.ok) {
        const data = await response.json();
        resultText += `${data.output}\n`;
      } else {
        resultText += `❌ ${endpoint} 失败: HTTP ${response.status}\n`;
      }
    } catch (err) {
      resultText += `❌ ${endpoint} 错误: ${err.message}\n`;
    }
  }

  outputBox.innerText = resultText || "❌ 未收到输出。";
}