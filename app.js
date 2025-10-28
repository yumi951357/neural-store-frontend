// app.js — Neural Store Dashboard (PDF增强版)
// by Infinity (无垠) × 人世间

async function runPipeline() {
  const btn = document.getElementById("runBtn");
  const outputBox = document.getElementById("output");
  btn.disabled = true;
  btn.innerText = "⏳ Generating...";
  outputBox.innerText = "";

  try {
    // 🔹 发请求到后端
    const response = await fetch("https://fiverr-automation-backend.onrender.com/neural/generator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: "Generate a detailed Fiverr Automation Business Plan in English."
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    const text = data.output || data.message || "⚠️ No output received from backend.";

    // 🔹 显示结果
    outputBox.innerText = text;

    // 🔹 自动生成 PDF 文件
    generatePDF(text);

  } catch (err) {
    outputBox.innerText = "❌ Error: " + err.message;
  } finally {
    btn.disabled = false;
    btn.innerText = "Run Neural Pipeline";
  }
}

// 📄 PDF 生成函数
function generatePDF(content) {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "application/pdf" });
  element.href = URL.createObjectURL(file);
  element.download = "Fiverr_Automation_Plan.pdf";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
