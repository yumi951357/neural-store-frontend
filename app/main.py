from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# ---------- 数据模型 ----------
class GenerationRequest(BaseModel):
    prompt: str

# ---------- FastAPI 初始化 ----------
app = FastAPI(title="Fiverr Automation Backend")

# ---------- CORS 允许前端访问 ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://frontend-qes3y9hm4-yumi951357s-projects.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- 健康检查 ----------
@app.get("/")
async def root():
    return {"status": "ok", "message": "Fiverr Automation Backend active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "uptime": "✔️"}

# ---------- 主接口：/neural/generator ----------
@app.post("/neural/generator")
async def neural_generator(request: GenerationRequest):
    try:
        # 模拟生成逻辑，可以改为你真实的 AI 生成函数
        response_text = f"✨ Generated output for prompt: {request.prompt}"
        return {"status": "success", "result": response_text}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ---------- 异常捕获 ----------
@app.middleware("http")
async def add_exception_handler(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ---------- 本地运行 ----------
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080)
