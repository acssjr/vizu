# UTF-8 Encoding em Windows

Ao ler arquivos em Python no Windows, sempre especifique encoding UTF-8.

## Pattern

Paths de usuario podem conter acentos (ex: `C:\Users\Jose\`). O encoding padrao do Windows (cp1252) falha com esses caracteres, causando `UnicodeDecodeError`.

## DO

- `open(file, encoding="utf-8", errors="ignore")`
- Testar scripts em paths com acentos
- Usar `pathlib.Path` com encoding explicito

## DON'T

- `open(file)` sem encoding explicito
- Assumir ASCII em paths de usuario
- Ignorar `UnicodeDecodeError` sem investigar

## Example

```python
# BAD - fails on Windows with accented paths
with open(env_file) as f:
    for line in f:
        ...

# GOOD - explicit UTF-8 encoding
with open(env_file, encoding="utf-8", errors="ignore") as f:
    for line in f:
        ...
```

## Source Sessions

- 2026-01-04: `braintrust_analyze.py` falhou ao ler `.env` em `C:\Users\Antonio\`
