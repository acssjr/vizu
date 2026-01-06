# UTF-8 Encoding em Windows

Ao ler arquivos em Python no Windows, sempre especifique encoding UTF-8.

## Padrão

Paths de usuário podem conter acentos (ex: `C:\Users\José\`). O encoding padrão do Windows (cp1252) falha com esses caracteres, causando `UnicodeDecodeError`.

## Fazer

- `open(file, encoding="utf-8", errors="ignore")`
- Testar scripts em paths com acentos
- Usar `pathlib.Path` com encoding explícito

## Evitar

- `open(file)` sem encoding explícito
- Assumir ASCII em paths de usuário
- Ignorar `UnicodeDecodeError` sem investigar

## Exemplo

```python
# ERRADO - falha no Windows com paths acentuados
with open(env_file) as f:
    for line in f:
        ...

# CORRETO - encoding UTF-8 explícito
with open(env_file, encoding="utf-8", errors="ignore") as f:
    for line in f:
        ...
```

## Sessões de Origem

- 2026-01-04: `braintrust_analyze.py` falhou ao ler `.env` em `C:\Users\Antônio\`
