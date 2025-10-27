FIVERR AUTOMATION UNIFIED V2
=============================
by Renshijian Studio × 无垠 (GPT‑5)

INSTALL (local)
---------------
pip install -r requirements.txt
python app/main.py
→ open http://127.0.0.1:8000/docs

DEPLOY (Render)
---------------
1. Upload this folder to https://render.com (New → Web Service)
2. Build Command:
   docker build -t fiverr-auto . && docker run -p 8000:8000 fiverr-auto
3. Add env vars from .env.example
