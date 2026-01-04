# Braintrust Proxy Configuration

O Braintrust proxy requer API keys dos provedores configuradas nos secrets.

## Pattern

Quando usar `api.braintrust.dev/v1/proxy/chat/completions`, o Braintrust roteia para o provedor do modelo (OpenAI, Anthropic, etc), mas precisa da API key desse provedor configurada na sua conta Braintrust.

## DO

- Configurar secrets em https://www.braintrust.dev/app/settings/secrets
- Adicionar `OPENAI_API_KEY` ou `ANTHROPIC_API_KEY` conforme o modelo usado
- Verificar qual modelo o script usa (ex: `gpt-5.2` = OpenAI)

## DON'T

- Assumir que `BRAINTRUST_API_KEY` sozinha e suficiente para o proxy
- Ignorar erro "No API keys found"
- Confundir Braintrust API key com provider API keys

## Error Message

```
Error: API error: Error: No API keys found (for gpt-5.2-2025-12-11).
You can configure API secrets at https://www.braintrust.dev/...
```

## Solution

1. Acesse https://www.braintrust.dev/app/settings/secrets
2. Adicione a API key do provedor (OpenAI, Anthropic, etc)
3. Re-execute o script

## Architecture

```
Seu script
    ↓ (BRAINTRUST_API_KEY)
Braintrust Proxy (api.braintrust.dev/v1/proxy)
    ↓ (PROVIDER_API_KEY from secrets)
OpenAI / Anthropic / etc
```

## Source Sessions

- 2026-01-04: Learning extraction falhou com "No API keys found"
