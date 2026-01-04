# VIZU - Documento Descritivo do Produto

## O Que É

Vizu é uma plataforma web onde usuários fazem upload de fotos para serem avaliadas anonimamente por outras pessoas reais. O objetivo é fornecer dados objetivos sobre como uma foto é percebida, ajudando o usuário a escolher a melhor imagem para seus perfis online.

## Como Funciona a Avaliação

### Escala de Notas
O avaliador escolhe entre quatro opções para cada característica:
- **0** = Não
- **1** = Pouco
- **2** = Sim
- **3** = Muito

### Três Eixos de Avaliação
Cada foto é avaliada em três dimensões:
1. **Atraente**
2. **Inteligente**
3. **Confiante**

O significado de cada eixo varia conforme a categoria da foto:

| Eixo | Dating | Profissional | Social |
|------|--------|--------------|--------|
| Atraente | Bonito(a), Atraente | Profissional, Apresentável | Simpático(a), Agradável |
| Inteligente | Interessante, Boa conversa | Capaz, Competente | Interessante, Divertido(a) |
| Confiante | Confiável, Seguro(a) | Confiável, Sério(a) | Autêntico(a), Genuíno(a) |

### Feedback Adicional (Opcional)
Além das notas, o avaliador pode fornecer:
- Uma tag de "vibe" (sensação que a foto passa)
- Uma tag de sugestão (o que poderia melhorar)
- Nota de texto livre (até 200 caracteres)

## Categorias de Foto

O usuário escolhe para qual contexto a foto será usada:

- **DATING**: Tinder, Bumble, apps de relacionamento
- **PROFISSIONAL**: LinkedIn, CV, perfil corporativo
- **SOCIAL**: Instagram, Facebook, redes sociais

## Normalização de Votos

O sistema corrige vieses individuais dos avaliadores. Pessoas que tendem a dar notas sempre altas ou sempre baixas têm seus votos ajustados para refletir uma avaliação equilibrada.

O peso do voto também considera a experiência do avaliador na plataforma.

## Confiabilidade dos Resultados

A precisão do resultado depende do número de avaliações:
- 10 votos = margem de ±18%
- 25 votos = margem de ±12% (recomendado)
- 50 votos = margem de ±8%

## Modelo de Economia

### Karma (Gratuito)
- Moeda interna que o usuário ganha ao avaliar fotos de outros
- Ganho: +3 karma por avaliação realizada
- Custo: 10 karma para enviar uma foto (teste gratuito)
- Limite máximo: 50 karma
- Regeneração: 1 karma por hora automaticamente

### Créditos (Pago)
- Comprados via Pix
- Custo: 5 créditos para enviar uma foto com filtros de audiência
- Pacotes disponíveis:
  - 10 créditos por R$ 9,90
  - 25 créditos por R$ 19,90
  - 50 créditos por R$ 34,90

## Filtros de Audiência (Premium)

Disponíveis apenas para testes pagos com créditos:
- **Gênero do avaliador**: Masculino, Feminino ou Outro
- **Faixa etária**: Mínimo 18, máximo 65 anos

Permite que o usuário receba avaliações apenas do público que ele deseja atingir.

## Promessas ao Usuário

### Anonimato
Fotos são 100% anônimas. Avaliadores veem apenas a imagem, sem nome ou dados pessoais. Fotos não são indexadas por buscadores.

### Votos Reais
Sistema de verificação em três camadas: validação de conta, análise de padrão de votação e fotos-sentinela para identificar votos aleatórios.

### Avaliação Individual
Fotos não são comparadas lado a lado. Cada imagem é avaliada isoladamente, simulando como ela seria vista em um app real.

## Diferenciais de Mercado

| Aspecto | Vizu |
|---------|------|
| Idioma | Português nativo |
| Pagamento | Pix |
| Base de avaliadores | Brasileiros |
| Conformidade legal | LGPD |

O principal concorrente internacional é o Photofeeler, que opera em inglês, com pagamento em dólar e base de usuários majoritariamente norte-americana.

## Jornada Resumida

1. Usuário cria conta (Google ou email)
2. Faz upload de foto escolhendo categoria e tipo de teste
3. Foto entra na fila de avaliação
4. Outros usuários avaliam anonimamente
5. Após mínimo de avaliações, resultados são liberados
6. Usuário vê scores percentuais (0-100%) para cada eixo

## Missão

Fornecer feedback honesto e anônimo sobre fotos, ajudando pessoas a se apresentarem da melhor forma em contextos digitais.

## Visão

Ser a referência no Brasil para otimização de fotos de perfil.

## Valores

- **Honestidade**: Feedback real, sem filtros sociais
- **Privacidade**: Anonimato garantido para avaliadores e avaliados
- **Acessibilidade**: Funcionalidade básica gratuita através do sistema de karma
