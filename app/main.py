from fastapi import FastAPI, Request
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

# === Models ===
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
