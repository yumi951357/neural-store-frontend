const API_URL = "https://fiverr-automation-backend.onrender.com";

// ========== 商业计划生成函数 ==========
async function generateBusinessPlan() {
  const company = document.getElementById('company').value.trim();
  const industry = document.getElementById('industry').value.trim();
  const tone = document.getElementById('tone').value.trim();
  const length = document.getElementById('length').value;
  
  const status = document.getElementById('status');
  const result = document.getElementById('result');

  if (!company || !industry) {
    status.innerText = "Please enter company name and industry.";
    return;
  }

  try {
    status.innerText = "🔄 Generating business plan...";
    
    const response = await fetch(`${API_URL}/neural/businessplan`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        company: company,
        industry: industry,
        tone: tone,
        length: length
      })
    });
    
    const plan = await response.json();
    
    if (plan.error) {
      status.innerText = "❌ Error: " + plan.error;
      return;
    }
    
    status.innerText = "✅ Business Plan generated successfully!";
    result.innerHTML = `
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">${plan.title || 'Business Plan'}</h3>
        <p><strong>Company:</strong> ${plan.company || company}</p>
        <p><strong>Industry:</strong> ${plan.industry || industry}</p>
        <p><strong>Tone:</strong> ${plan.tone || tone}</p>
        <p><strong>Length:</strong> ${plan.length || length}</p>
      </div>
      <hr>
      <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">
        ${plan.content || 'No content generated'}
      </div>
      <button onclick="downloadBusinessPlan()" style="padding: 10px 20px; margin: 15px 0; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
        📥 Download Business Plan
      </button>
    `;
    
  } catch (e) {
    status.innerText = "❌ Error generating business plan";
    console.error(e);
    result.innerText = String(e?.message || e);
  }
}

function downloadBusinessPlan() {
  const content = document.getElementById('result').innerText;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'business-plan.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ========== 原有的三段式流程函数 ==========
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
      body: JSON.stringify({ text: gen.output })
    }).then(r => r.json());

    status.innerText = "Agent 3: Verifying and finalizing...";
    const ver = await fetch(`${API_URL}/neural/verifier`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text: ref.output })
    }).then(r => r.json());

    status.innerText = "✅ Complete.";
    result.innerText = ver.output || "No output received.";
  } catch (e) {
    status.innerText = "❌ Error. See console.";
    console.error(e);
    result.innerText = String(e?.message || e);
  }
}

// ========== 报告生成函数 ==========
async function generateReport() {
  const topic = document.getElementById('topic').value.trim();
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  
  if (!topic) {
    status.innerText = "Please enter a topic first.";
    return;
  }
  
  try {
    status.innerText = "🔄 Generating comprehensive business report...";
    
    const response = await fetch(`${API_URL}/neural/report`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        topic: topic,
        audience: "executives", 
        tone: "professional, data-driven",
        length: "standard"
      })
    });
    
    const report = await response.json();
    
    if (report.error) {
      status.innerText = "❌ Error: " + report.error;
      return;
    }
    
    status.innerText = "✅ Report generated successfully!";
    result.innerHTML = `
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">${report.title || 'Business Report'}</h3>
        <p><strong>Audience:</strong> ${report.audience || 'executives'}</p>
        <p><strong>Tone:</strong> ${report.tone || 'professional'}</p>
        <p><strong>Length:</strong> ${report.length || 'standard'}</p>
      </div>
      <hr>
      <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">
        ${report.content || 'No content generated'}
      </div>
      <button onclick="downloadReport()" style="padding: 10px 20px; margin: 15px 0; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
        📥 Download as .txt
      </button>
    `;
    
  } catch (e) {
    status.innerText = "❌ Error generating report";
    console.error(e);
    result.innerText = String(e?.message || e);
  }
}

function downloadReport() {
  const content = document.getElementById('result').innerText;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'business-report.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}