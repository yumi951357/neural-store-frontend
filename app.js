// app.js — Neural Store Frontend (fixed to call /api/plan)

const API = "https://fiverr-automation-backend.onrender.com/api/plan";

async function runPipeline() {
  const btn = document.getElementById("runBtn");
  const out = document.getElementById("output");
  const taskInput = document.getElementById("task");
  const prompt = (taskInput?.value || "").trim() || "Generate a practical Fiverr automation plan.";

  btn.disabled = true;
  btn.innerText = "⏳ 生成中…";
  out.textContent = "";

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    const text = data.            