# Download Instructions for Llama 3.2 3B Model

## Quick Download (Recommended)

1. Go to: https://huggingface.co/lmstudio-community/Llama-3.2-3B-Instruct-GGUF

2. Download the Q4 quantized version (~2GB):
   `Llama-3.2-3B-Instruct-Q4_K_M.gguf`

3. Place the file in this folder as:
   `llama-3.2-3b-q4.gguf`

## Alternative: Using huggingface-cli

```bash
pip install huggingface-hub
huggingface-cli download lmstudio-community/Llama-3.2-3B-Instruct-GGUF Llama-3.2-3B-Instruct-Q4_K_M.gguf --local-dir .
mv Llama-3.2-3B-Instruct-Q4_K_M.gguf llama-3.2-3b-q4.gguf
```

## File Structure After Download

```
gizmo/
└── models/
    └── llama-3.2-3b-q4.gguf  (this file, ~2GB)
```
