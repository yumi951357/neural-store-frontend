const API_URL = "https://fiverr-automation-backend.onrender.com";

async function runPipeline() {
  const task = document.getElementById('task').value.trim();
  const status = document.getElementById('status');
  const result = document.getElementById('result');

  if (!task) {
    status.innerText = "Please enter a task first.";
    return;
  }

  status.innerText = "Agent 1: Generating content...";
  const gen = await fetch(`${API_URL}/neural/generator`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: task })
  }).then(r => r.json());

  status.innerText = "Agent 2: Refining content...";
  const ref = await fetch(`${API_URL}/neural/refiner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: gen.output })
  }).then(r => r.json());

  status.innerText = "Agent 3: Verifying and finalizing...";
  const ver = await fetch(`${API_URL}/neural/verifier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: ref.output })
  }).then(r => r.json());

  status.innerText = "✅ Complete.";
  result.innerText = ver.output || "No output received.";
}
