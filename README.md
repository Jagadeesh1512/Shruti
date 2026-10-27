# Sruthi AI Companion — Frontend UI & Model Connection

This folder contains the complete, production-ready frontend UI for **Sruthi** and a plug-and-play Python backend to connect your AI model.

All mock testing responses have been removed. The chat interface is wired directly to call your backend model via `POST /api/chat`.

---

## 🚀 Quick Start (Run in 1 Minute)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Server
```bash
python server.py
```

### 3. Open in Browser
Visit [http://localhost:8000](http://localhost:8000).

---

## 🧠 Connecting Your AI Model

Open `server.py` and locate the function:

```python
def generate_model_reply(message: str, user_name: str) -> str:
    # PLUG YOUR MODEL HERE!
    ...
```

Here are ready-to-use snippets for common setups:

### Option A: Hugging Face Transformers
```python
from transformers import pipeline

# Load your model once at top of server.py
pipe = pipeline("text-generation", model="your-model-name", device="cuda")

def generate_model_reply(message: str, user_name: str) -> str:
    prompt = f"System: You are Sruthi, a loving and sweet AI companion.\nUser: {message}\nSruthi:"
    out = pipe(prompt, max_new_tokens=150, temperature=0.7)
    return out[0]["generated_text"].split("Sruthi:")[-1].strip()
```

### Option B: Ollama (Local Llama 3, Mistral, Gemma, Phi)
```python
import requests

def generate_model_reply(message: str, user_name: str) -> str:
    res = requests.post("http://localhost:11434/api/generate", json={
        "model": "llama3",
        "prompt": f"You are Sruthi, an affectionate AI companion. User ({user_name}): {message}\nSruthi:",
        "stream": False
    })
    return res.json().get("response", "I'm here for you!")
```

### Option C: Gradio Backend (Gradio Client)
If your model is running inside a Gradio app or Hugging Face Space:
```bash
pip install gradio_client
```
```python
from gradio_client import Client

# Connect to local Gradio or remote Hugging Face Space
client = Client("http://127.0.0.1:7860/")

def generate_model_reply(message: str, user_name: str) -> str:
    result = client.predict(message, api_name="/predict")
    return str(result)
```

### Option D: OpenAI / Compatible API
```python
import openai

client = openai.OpenAI(api_key="YOUR_API_KEY")

def generate_model_reply(message: str, user_name: str) -> str:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"You are Sruthi, a sweet and loving AI companion chatting with {user_name}."},
            {"role": "user", "content": message}
        ]
    )
    return resp.choices[0].message.content
```

---

## 📡 API Contract

If you want to use your own backend framework (Flask, Django, Express, FastAPI, Go, etc.):

- **Endpoint**: `POST /api/chat`
- **Request Body**:
  ```json
  {
    "message": "Hello Sruthi!",
    "user_name": "Alex"
  }
  ```
- **Response Body**:
  ```json
  {
    "reply": "Hello Alex! 💕 How has your day been?"
  }
  ```

### Changing Endpoint URL
If your backend is hosted on a different port or domain (e.g. `http://localhost:5000/chat`), edit line 10 in `app.js`:
```javascript
const MODEL_API_ENDPOINT = 'http://localhost:5000/chat';
```

---

## 📁 File Structure

```text
UI/
├── index.html                  # Main UI markup (Intro & Chat Screens)
├── styles.css                  # Responsive styles, glowing neon theme, hidden scrollbars
├── animations.js               # Ambient particles, heart bursts, message reveal
├── app.js                      # Screen router & direct model fetch connector
├── server.py                   # FastAPI server with model integration hook
├── requirements.txt            # Python dependencies (fastapi, uvicorn)
├── Shruti.jpeg                 # Bot avatar image
├── intro_widescreen_4k.jpg     # Intro screen 4K graphic
├── intro_widescreen.jpg        # Intro screen graphic
├── chat_neon_bg_4k.jpg         # Chat background
├── shruti_exact_logo.svg       # Exact vector calligraphy logo
└── README.md                   # This documentation guide
```
