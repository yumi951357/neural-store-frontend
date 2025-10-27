from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from pathlib import Path
import os, time, json, hashlib

app = FastAPI(title="Fiverr Automation Unified", version="2.0")

# === Audit chain ===
LOG_FILE = Path("logs/audit_chain.jsonl")
LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

def append_audit(event: str, payload: dict):
    prev_hash = None
    if LOG_FILE.exists():
        try:
            *_, last = LOG_FILE.read_text().splitlines()
            prev_hash = json.loads(last).get("record_hash")
        except Exception:
            prev_hash = None
    record = {
        "ts": int(time.time()),
        "event": event,
        "payload": payload,
        "prev_hash": prev_hash,
    }
    record_str = json.dumps(record, sort_keys=True)
    record["record_hash"] = hashlib.sha256(record_str.encode()).hexdigest()
    LOG_FILE.write_text(LOG_FILE.read_text() + json.dumps(record) + "\n" if LOG_FILE.exists() else json.dumps(record) + "\n")
    return record["record_hash"]

# === Agent task distribution ===
class AgentTaskRequest(BaseModel):
    agent: str
    task: str
    category: str
    payload: Optional[Dict[str, Any]] = None

@app.post("/agent/task")
async def dispatch_agent_task(req: AgentTaskRequest):
    """Dispatch tasks to appropriate agents"""
    
    # Agent routing configuration
    agent_endpoints = {
        "Prometheus": {
            "generate_gig_assets": "/agent/prometheus/generate_assets",
            "auto_reply": "/agent/prometheus/auto_reply"
        },
        "Mnemosyne": {
            "generate_doc": "/agent/mnemosyne/generate_document",
            "archive_log": "/agent/mnemosyne/archive"
        },
        "Hermes": {
            "deploy_to_fiverr": "/agent/hermes/deploy",
            "sync_render": "/agent/hermes/sync"
        }
    }
    
    # Validate agent and task
    if req.agent not in agent_endpoints:
        raise HTTPException(status_code=400, detail=f"Unknown agent: {req.agent}")
    
    if req.task not in agent_endpoints[req.agent]:
        raise HTTPException(status_code=400, detail=f"Unknown task for agent {req.agent}: {req.task}")
    
    # Log the task dispatch
    append_audit("agent_task_dispatch", {
        "agent": req.agent,
        "task": req.task,
        "category": req.category,
        "endpoint": agent_endpoints[req.agent][req.task]
    })
    
    # Return routing information (actual implementation would call the agent endpoints)
    return {
        "status": "dispatched",
        "agent": req.agent,
        "task": req.task,
        "endpoint": agent_endpoints[req.agent][req.task],
        "category": req.category,
        "timestamp": int(time.time())
    }

# === Agent placeholder endpoints ===
@app.post("/agent/prometheus/generate_assets")
async def prometheus_generate_assets():
    return {"status": "Placeholder - Prometheus generate_assets endpoint"}

@app.post("/agent/prometheus/auto_reply")
async def prometheus_auto_reply():
    return {"status": "Placeholder - Prometheus auto_reply endpoint"}

@app.post("/agent/mnemosyne/generate_document")
async def mnemosyne_generate_document():
    return {"status": "Placeholder - Mnemosyne generate_document endpoint"}

@app.post("/agent/mnemosyne/archive")
async def mnemosyne_archive():
    return {"status": "Placeholder - Mnemosyne archive endpoint"}

@app.post("/agent/hermes/deploy")
async def hermes_deploy():
    return {"status": "Placeholder - Hermes deploy endpoint"}

@app.post("/agent/hermes/sync")
async def hermes_sync():
    return {"status": "Placeholder - Hermes sync endpoint"}

# === Original models and routes (unchanged) ===
class GigAssetsRequest(BaseModel):
    category: str

@app.post("/generate_gig_assets")
def generate_gig_assets(req: GigAssetsRequest):
    mapping = {
        "youtube": "I will create SEO-optimized YouTube scripts",
        "data": "I will design interactive Power BI dashboards",
        "plan": "I will craft an AI-powered business plan"
    }
    title = mapping.get(req.category, "I will create professional digital content")
    desc = f"Full Fiverr-ready gig assets for {req.category} category."
    append_audit("generate_gig_assets", {"category": req.category})
    return {"title": title, "description": desc}

class Reply(BaseModel):
    text: str

@app.post("/auto_reply")
def auto_reply(req: Reply):
    msg = "Thanks for your message! Let's discuss your project goals."
    append_audit("auto_reply", {"text": req.text})
    return {"reply": msg}

@app.get("/fetch_metrics")
def fetch_metrics():
    metrics = {"impressions": 1500, "clicks": 200, "orders": 10}
    append_audit("fetch_metrics", metrics)
    return metrics

@app.get("/health")
def health():
    return {"ok": True}

# === Agent health check ===
@app.get("/agents/health")
def agents_health():
    return {
        "prometheus": "active",
        "mnemosyne": "active",
        "hermes": "active",
        "timestamp": int(time.time())
    }