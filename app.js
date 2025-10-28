// app.js — robust prompt sender + debug log
const API = "https://fiverr-automation-backend.onrender.com/api/plan";

function getUserPrompt() {
  // 依次寻找常见输入控件：#task、#userInput、.task、textarea、input[type=text]
  const cand = [
    document.getElementById("task"),
    document.getElementById("userInput"),
    document.querySelector(".task"),
    document.querySelector("textarea"),
    document.querySelector("input[type='text']")
  ];
  const el = cand.find(Boolean);
  return (el && el.value && el.value.trim()) || "";
}

async function runPipeline() {
  const btn = document.getElementById("runBtn") || document.querySelector("button");
  const out = document.getElementById("output") || document.querySelector("pre");
  const prompt = getUserPrompt() || "Generate a practical Fiverr automation plan.";

  if (btn) { btn.disabled = true; btn.innerText = "⏳ Generating…"; }
  if (out) out.textContent = "";

  // 调试打印：你在浏览器控制台能看到真实发送内容
  console.log("[NeuralStore] sending prompt →", prompt);

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const text = data.output  data.message  "No output.";
    if (out) out.textContent = text;

    // 自动下载 TXT
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = Plan_${new Date().toISOString().slice(0,10)}.txt;
    document.body.appendChild(a); a.click(); a.remove();
  } catch (e) {
    if (out) out.textContent = "❌ " + e.message;
    console.error(e);
  } finally {
    if (btn) { btn.disabled = false; btn.innerText = "运行神经管道"; }
  }
}

// 兼容你的 HTML
window.runPipeline = runPipeline;