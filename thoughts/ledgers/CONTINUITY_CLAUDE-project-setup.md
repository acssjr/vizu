# Session: project-setup
Updated: 2025-12-29T20:35:00Z

## Goal
Configurar o Claude Continuity Kit completamente. Done quando:
- Estrutura de diretórios criada
- Artifact Index DB inicializado
- Skills funcionando via /comando
- Hooks registrados e funcionais
- Braintrust tracing funcionando

## Constraints
- Windows environment (com WSL no PATH)
- Usar UV para Python
- Manter compatibilidade com Claude Code CLI

## Key Decisions
- Hooks globais: Copiados para `$HOME/.claude/` ao invés de paths relativos ao projeto
- Settings global: Copiado `.claude/settings.json` para `~/.claude/settings.json`
- Commands criados em `.claude/commands/` para aparecer no autocomplete `/`

## Learnings (IMPORTANT)

### Windows Path Format Issue
**Problema:** Hooks TypeScript não encontravam arquivos no Windows.

**Causa raiz:** Git Bash usa `/c/vizu/...` mas Node.js no Windows espera `C:/vizu/...`

**Solução:** Claude Code define `CLAUDE_PROJECT_DIR` no formato Windows correto quando executa hooks.

### Skills vs Commands
**Descoberta:** Skills (`.claude/skills/`) NÃO aparecem no autocomplete `/`. Commands (`.claude/commands/`) aparecem.

**Ação:** Criados 10 commands wrapper para as skills principais.

### Hook Errors - RESOLVIDO ✓
**Sintoma:** "UserPromptSubmit hook error" + HTTP 400 com "id/span_id must contain at least 1 character"

**Causa raiz:** `uuidgen` não existe no Windows. A função `generate_uuid()` falhava silenciosamente (erro capturado pelo pipe) e retornava string vazia.

**Solução:** Modificado `~/.claude/plugins/braintrust-tracing/hooks/common.sh` linha 210-232 com fallback chain:
1. `uuidgen` (Linux/macOS)
2. `/dev/urandom` + sed (Git Bash Windows) ← funciona!
3. `python3 uuid` (fallback universal)

**Verificação:** Log mostra "Turn 1 started: 679a39b7-..." sem erros HTTP 400.

## State
- Done:
  - [x] Rodar init-project.sh
  - [x] Criar estrutura de diretórios
  - [x] Inicializar context.db com schema (24 tabelas FTS)
  - [x] Copiar hooks para $HOME/.claude/hooks/
  - [x] Copiar handlers (dist/*.mjs)
  - [x] Copiar scripts para $HOME/.claude/scripts/
  - [x] Testar skill continuity_ledger
  - [x] Testar skill create_handoff
  - [x] Criar handoff e indexar no Artifact Index
  - [x] Instalar plugin Braintrust em $HOME/.claude/plugins/
  - [x] Copiar settings.json para ~/.claude/settings.json
  - [x] Diagnosticar e testar SessionStart hook
  - [x] Criar 10 commands para skills principais
  - [x] Debug sistemático dos hooks Braintrust (RESOLVIDO)
- Now: [→] Validar tracing em sessão real
- Next:
  - [ ] Testar próxima sessão Claude Code com tracing
  - [ ] Verificar eventos no dashboard Braintrust

## Open Questions
- CONFIRMED: uuidgen não existe no Windows (Git Bash não inclui) ✓
- CONFIRMED: Claude Code usa Git Bash para executar hooks ✓
- CONFIRMED: Erro era uuidgen - resolvido com fallback /dev/urandom ✓
- CONFIRMED: Hooks registrados em settings.json ✓
- CONFIRMED: API Key Braintrust válida ✓
- CONFIRMED: Projeto claude-code existe no Braintrust ✓

## Commands Criados (10)
```
.claude/commands/
├── commit.md
├── onboard.md
├── create_handoff.md
├── resume_handoff.md
├── continuity_ledger.md
├── create_plan.md
├── implement_plan.md
├── debug.md
├── research.md
└── tdd.md
```

## Braintrust Status
- Projeto: `claude-code` (ID: a8cec5bc-46bb-4f9a-a5fe-0927fc14bdcc)
- Plugin: `~/.claude/plugins/braintrust-tracing/`
- Status: ✓ FUNCIONANDO (fix aplicado em common.sh:210-232)
- Último teste: Turn criado com UUID 679a39b7-5398-4655-1afe-07a06e8103cb

## Working Set
- Branch: `main`
- Key files:
  - `.claude/commands/` - 10 commands criados
  - `.claude/skills/` - 33 skills disponíveis
  - `~/.claude/plugins/braintrust-tracing/hooks/common.sh` - arquivo com erro
  - `~/.claude/settings.json` - configuração global
- Test cmd debug hooks:
  ```bash
  echo '{"prompt": "test"}' | bash ~/.claude/plugins/braintrust-tracing/hooks/user_prompt_submit.sh 2>&1
  ```
