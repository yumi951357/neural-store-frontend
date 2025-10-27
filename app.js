async function runPipeline() {
  const task = document.getElementById('task').value.trim();
  const status = document.getElementById('status');
  const result = document.getElementById('result');

  if (!task) { status.innerText = "Please enter a task first."; return; }

  try {
    status.innerText = "Agent 1: Generating content...";
    const gen = await fetch(`${API_URL}/neural/generator`, {
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ prompt: task })
    }).then(r => r.json());

    status.innerText = "Agent 2: Refining content...";
    const ref = await fetch(`${API_URL}/neural/refiner`, {
      method: "POST",
      headers: {"Content-Type": "application/json"}, 
      body: JSON.stringify({ text: gen.output })  // 使用 gen.output
    }).then(r => r.json());

    status.innerText = "Agent 3: Verifying and finalizing...";
    const ver = await fetch(`${API_URL}/neural/verifier`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text: ref.output })  // 使用 ref.output
    }).then(r => r.json());

    status.innerText = "✅ Complete.";
    result.innerText = ver.output || "No output received.";  // 使用 ver.output
  } catch (e) {
    status.innerText = "❌ Error. See console.";
    console.error(e);
    result.innerText = String(e?.message || e);
  }
}