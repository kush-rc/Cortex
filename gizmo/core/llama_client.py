"""
Llama Client for GIZMO
Runs Llama 3.2 3B locally using llama-cpp-python
"""
import os
import threading
from pathlib import Path

# Will be imported after installation
try:
    from llama_cpp import Llama
    LLAMA_AVAILABLE = True
except ImportError:
    LLAMA_AVAILABLE = False
    Llama = None


class LlamaClient:
    """Local Llama LLM interface for GIZMO."""
    
    def __init__(self, model_path: str = None):
        """
        Initialize Llama client.
        
        Args:
            model_path: Path to GGUF model file
        """
        # Default model path
        if model_path is None:
            base_dir = Path(__file__).parent.parent
            model_path = str(base_dir / "models" / "llama-3.2-3b-q4.gguf")
        
        self.model_path = model_path
        self.llm = None
        self._lock = threading.Lock()  # Prevent concurrent model access
        
    def load(self):
        """Load the model (call once at startup)."""
        if not LLAMA_AVAILABLE:
            print("⚠️ llama-cpp-python not found. Running in MOCK mode.")
            self.llm = "MOCK"
            return

        if not os.path.exists(self.model_path):
            print(f"⚠️ Model not found at {self.model_path}. Running in MOCK mode.")
            self.llm = "MOCK"
            return
        
        print(f"Loading Llama model from {self.model_path}...")
        try:
            self.llm = Llama(
                model_path=self.model_path,
                n_ctx=8192,  # Supports deep product specs + 4-message history + catalog without overflow
                n_batch=512,  # Process 512 tokens at once for faster prompt ingestion (default is 8)
                n_threads=os.cpu_count() or 4,
                n_gpu_layers=-1,  # -1 offloads all layers to GPU for max speed
                flash_attn=True,  # Faster attention computation on supported GPUs
                verbose=False
            )
            print("Llama model loaded!")
        except Exception as e:
             print(f"❌ Failed to load model: {e}. Running in MOCK mode.")
             self.llm = "MOCK"
    
    def generate(self, prompt: str, system: str = None, max_tokens: int = 512, history: list = None) -> str:
        """
        Generate a response with optional conversation history.
        Thread-safe: only one generation can run at a time.
        """
        if self.llm is None:
            self.load()
            
        if self.llm == "MOCK":
            return "I am Gizmo (Mock Mode). The AI model is not loaded, but I can still help you with basic product info!"
        
        # Build chat format
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
            
        if history:
            # Ensure history only contains role/content to prevent formatting errors
            for msg in history:
                if isinstance(msg, dict) and "role" in msg and "content" in msg:
                    messages.append({"role": msg["role"], "content": msg["content"]})
                    
        messages.append({"role": "user", "content": prompt})
        
        # Format as chat
        formatted = ""
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            formatted += f"<|{role}|>\n{content}\n"
        formatted += "<|assistant|>\n"
        
        # Thread-safe generation — only one request at a time
        with self._lock:
            try:
                output = self.llm(
                    formatted,
                    max_tokens=max_tokens,
                    temperature=0.1,  # Low temp for highly accurate, deterministic, factual responses
                    stop=["<|", "\n\n\n", "<---", "<--", "<—", "<•", "<3>", "(Note:", "[Personality", "[I will", "[Note:", "[Rules"],
                    echo=False
                )
                
                result = output["choices"][0]["text"].strip()
                
                # Post-processing: strip any leaked internal reasoning
                import re
                # Remove any stray <...> tokens (garbage from LLM)
                result = re.sub(r'\s*<[^>]{0,10}>\s*', ' ', result).strip()
                # Cut at any "<---" or "<--" annotation
                result = re.split(r'\s*<-{2,}', result)[0].strip()
                # Cut at "[Personality rules" or similar bracketed instructions
                result = re.split(r'\s*\[(?:Personality|I will|Note|Rules|As per)', result)[0].strip()
                # Remove lines that start with common LLM self-talk patterns
                cleaned_lines = []
                for line in result.split('\n'):
                    lower = line.strip().lower()
                    if any(lower.startswith(p) for p in [
                        'as per the rules', 'i will not', 'i should', 'the rules state',
                        'according to my rules', 'my rules say', 'note:', 'personality rules'
                    ]):
                        continue
                    cleaned_lines.append(line)
                result = '\n'.join(cleaned_lines).strip()
                
                # Guard against empty response after cleanup
                if not result:
                    return "I can only help with Cortex product questions. What would you like to know?"
                return result
            except Exception as e:
                print(f"❌ LLM generation error: {e}")
                return "I can only help with Cortex product questions. What would you like to know?"
    
    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self.llm is not None


import requests

class GroqClient:
    """Groq API client as a drop-in replacement for local LlamaClient."""

    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = "llama-3.2-3b-preview"
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"

    def generate(self, prompt: str, system: str = None, max_tokens: int = 512, history: list = None) -> str:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        if history:
            for msg in history:
                if isinstance(msg, dict) and "role" in msg and "content" in msg:
                    messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": prompt})

        response = requests.post(
            self.base_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": self.model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": 0.1
            },
            timeout=30
        )
        
        if response.status_code != 200:
            print(f"❌ Groq API error: {response.text}")
            return "I can only help with Cortex product questions. What would you like to know?"
            
        data = response.json()
        return data["choices"][0]["message"]["content"]

    def load(self):
        pass

    def is_loaded(self) -> bool:
        return bool(self.api_key)

# Singleton instance
_client = None

def get_llama_client(model_path: str = None):
    """Get or create the client singleton (either Groq or Llama depending on env)."""
    global _client
    if _client is None:
        use_groq = os.getenv("USE_GROQ", "false").lower() == "true"
        if use_groq:
            _client = GroqClient()
        else:
            _client = LlamaClient(model_path)
    return _client
