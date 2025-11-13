# Backend (FastAPI)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# if you ran the old schema before:
rm -f health.db
python -m uvicorn app.main:app --reload --port 8000