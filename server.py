"""
Sruthi AI Companion — Model Backend Server
===========================================
This is a lightweight FastAPI server configured to serve the frontend UI
and provide the '/api/chat' endpoint where your AI model connects.

HOW TO RUN:
1. Install requirements:
   pip install -r requirements.txt

2. Start the server:
   python server.py

3. Open your browser:
   http://localhost:8000
"""

import os
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Sruthi AI Companion Backend", version="1.0.0")

# Enable CORS so the UI can connect even if hosted on a different port/origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
#  REQUEST / RESPONSE SCHEMAS
# ============================================================
class ChatRequest(BaseModel):
    message: str
    user_name: Optional[str] = "Friend"


class ChatResponse(BaseModel):
    reply: str


# ============================================================
#  AI MODEL INTEGRATION HOOK
# ============================================================
# PLUG IN YOUR MODEL HERE:
# You can replace this function with your PyTorch model,
# Hugging Face pipeline, Ollama client, Gradio client, etc.
# ============================================================

def generate_model_reply(message: str, user_name: str) -> str:
    """
    Generate response from your model.
    Replace the placeholder logic below with your actual model inference code!
    """

    # -------------------------------------------------------------------------
    # OPTION 1: HuggingFace Transformers (Example)
    # -------------------------------------------------------------------------
    # from transformers import pipeline
    # pipe = pipeline("text-generation", model="your-model-name")
    # prompt = f"User: {message}\nSruthi:"
    # result = pipe(prompt, max_new_tokens=100)
    # return result[0]["generated_text"]

    # -------------------------------------------------------------------------
    # OPTION 2: Ollama (Local LLM e.g., llama3, mistral, gemma)
    # -------------------------------------------------------------------------
    # import requests
    # resp = requests.post("http://localhost:11434/api/generate", json={
    #     "model": "llama3",
    #     "prompt": f"You are Sruthi, a sweet and loving AI companion. User ({user_name}) says: {message}\nSruthi reply:",
    #     "stream": False
    # })
    # return resp.json().get("response", "I'm listening...")

    # -------------------------------------------------------------------------
    # OPTION 3: Connect to an existing Gradio App (using gradio_client)
    # -------------------------------------------------------------------------
    # from gradio_client import Client
    # client = Client("http://127.0.0.1:7860/")  # or your Hugging Face Space URL
    # result = client.predict(message, api_name="/predict")
    # return str(result)

    # -------------------------------------------------------------------------
    # DEFAULT DEMO RESPONSE (when model is not yet connected):
    # -------------------------------------------------------------------------
    name_display = f"{user_name}" if user_name else "there"
    return (
        f"Hi {name_display}! 💕 I received your message: '{message}'. "
        f"Connect your AI model inside generate_model_reply() in server.py to see real model outputs!"
    )


# ============================================================
#  API ENDPOINT
# ============================================================
@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    user_name = req.user_name.strip() if req.user_name else "Friend"
    reply_text = generate_model_reply(req.message.strip(), user_name)

    return ChatResponse(reply=reply_text)


# ============================================================
#  STATIC FILES & FRONTEND SERVING
# ============================================================
current_dir = os.path.dirname(os.path.abspath(__file__))

@app.get("/")
async def serve_index():
    index_path = os.path.join(current_dir, "index.html")
    return FileResponse(index_path)

# Mount all static assets (images, css, js) from the current folder
app.mount("/", StaticFiles(directory=current_dir), name="static")


# ============================================================
#  MAIN ENTRYPOINT
# ============================================================
if __name__ == "__main__":
    print("=" * 60)
    print("Sruthi AI Companion Server")
    print("Server running at: http://localhost:8000")
    print("Connecting UI directly to /api/chat")
    print("=" * 60)
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
