# Feature Specification: Vizu - Plataforma de Otimização de Imagem Social

**Feature Branch**: `001-photo-rating-platform`
**Created**: 2025-12-29
**Status**: Draft
**Input**: Plataforma brasileira de otimização de imagem social inspirada no Photofeeler

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submeter Foto para Avaliação (Priority: P1)

Um usuário deseja descobrir como sua foto de perfil é percebida por outras pessoas. Ele faz upload de uma foto, seleciona a categoria de uso (profissional, namoro ou social) e aguarda avaliações de outros usuários da comunidade.

**Why this priority**: Esta é a funcionalidade central da plataforma. Sem a capacidade de submeter fotos para avaliação, não há produto viável.

**Independent Test**: Pode ser testado completamente fazendo upload de uma foto e verificando que ela entra na fila de avaliação. Entrega valor imediato ao usuário.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado, **When** ele faz upload de uma foto válida e seleciona categoria "Profissional", **Then** a foto é aceita e exibida como "aguardando avaliações"
2. **Given** um usuário com foto submetida, **When** a foto recebe avaliações suficientes, **Then** ele visualiza suas pontuações nos três eixos (Atração, Confiança, Inteligência)
3. **Given** um usuário fazendo upload, **When** a foto contém conteúdo inadequado, **Then** o sistema rejeita automaticamente com mensagem explicativa
4. **Given** um usuário não autenticado, **When** ele tenta submeter foto, **Then** é redirecionado para cadastro/login

---

### User Story 2 - Avaliar Fotos de Outros Usuários (Priority: P1)

Um usuário deseja contribuir com a comunidade avaliando fotos de outras pessoas. Ele acessa a área de votação, visualiza uma foto por vez e atribui notas de 1 a 10 para cada eixo (Atração, Confiança, Inteligência).

**Why this priority**: Sem avaliadores, as fotos submetidas nunca receberiam feedback. Esta história é co-dependente da P1 anterior para o sistema funcionar.

**Independent Test**: Pode ser testado acessando a fila de votação e completando avaliações. O sistema deve registrar os votos e atualizar o Karma do avaliador.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado com Karma disponível, **When** ele acessa a área de votação, **Then** visualiza uma foto com controles para avaliar cada eixo
2. **Given** um usuário avaliando uma foto, **When** ele atribui notas nos três eixos e confirma, **Then** as notas são registradas e ele visualiza a próxima foto
3. **Given** um usuário que avaliou uma foto, **When** o voto é registrado, **Then** seu saldo de Karma aumenta proporcionalmente
4. **Given** um usuário com Karma zerado, **When** ele tenta acessar votação, **Then** é informado que precisa ganhar Karma (comprando créditos ou aguardando regeneração)

---

### User Story 3 - Visualizar Resultados e Estatísticas (Priority: P2)

Um usuário que submeteu fotos deseja entender detalhadamente como cada foto performou. Ele acessa o painel de resultados para ver pontuações médias normalizadas, distribuição de votos e comparativo entre suas fotos.

**Why this priority**: Resultados são o valor entregue ao usuário, mas dependem das histórias P1 funcionando.

**Independent Test**: Com fotos que já receberam votos, o usuário pode visualizar estatísticas completas e tomar decisões sobre qual foto usar.

**Acceptance Scenarios**:

1. **Given** uma foto com mínimo de avaliações recebidas, **When** o usuário acessa resultados, **Then** visualiza pontuação normalizada (1-10) para cada eixo com indicador de confiança estatística
2. **Given** múltiplas fotos avaliadas, **When** o usuário acessa dashboard, **Then** pode comparar performance lado a lado
3. **Given** uma foto com poucas avaliações, **When** o usuário acessa resultados, **Then** vê indicador de "dados insuficientes" com estimativa de votos necessários

---

### User Story 4 - Comprar Créditos via Pix (Priority: P2)

Um usuário deseja acelerar o processo de avaliação de suas fotos ou desbloquear funcionalidades premium. Ele acessa a loja, escolhe um pacote de créditos com preço entre R$ 1,99 e R$ 9,90, e paga instantaneamente via Pix.

**Why this priority**: Monetização é essencial para sustentabilidade, mas o core gratuito deve funcionar primeiro.

**Independent Test**: Usuário completa compra via Pix e vê créditos refletidos imediatamente em sua conta.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado, **When** ele seleciona pacote de R$ 4,90 e escolhe Pix, **Then** visualiza QR Code para pagamento
2. **Given** um usuário com QR Code exibido, **When** o pagamento é confirmado, **Then** os créditos são adicionados em até 5 segundos
3. **Given** uma transação em andamento, **When** o pagamento falha ou expira, **Then** o usuário é notificado e pode tentar novamente
4. **Given** um usuário que completou compra, **When** solicita comprovante, **Then** recebe recibo digital com todos os dados fiscais

---

### User Story 5 - Gerenciar Conta e Dados Pessoais (Priority: P3)

Um usuário brasileiro deseja exercer seus direitos sob a LGPD. Ele pode visualizar todos os dados coletados, solicitar exportação completa ou exclusão de sua conta e dados biométricos.

**Why this priority**: Conformidade legal é obrigatória, mas pode ser implementada após funcionalidades core.

**Independent Test**: Usuário acessa configurações de privacidade e consegue exportar/excluir seus dados.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado, **When** acessa "Meus Dados", **Then** visualiza lista completa de informações coletadas
2. **Given** um usuário solicitando exportação, **When** confirma identidade, **Then** recebe arquivo com todos os seus dados em até 48 horas
3. **Given** um usuário solicitando exclusão, **When** confirma via email, **Then** todos os dados (incluindo biométricos) são removidos em até 72 horas
4. **Given** exclusão de conta, **When** processo completa, **Then** todas as fotos e avaliações associadas são anonimizadas ou removidas

---

### User Story 6 - Cadastro e Autenticação (Priority: P1)

Um novo usuário deseja começar a usar a plataforma. Ele se cadastra com email ou login social, confirma sua identidade e aceita os termos de uso e política de privacidade (LGPD).

**Why this priority**: Gate de entrada obrigatório para todas as outras funcionalidades.

**Independent Test**: Novo usuário completa cadastro e consegue acessar a plataforma.

**Acceptance Scenarios**:

1. **Given** um visitante, **When** inicia cadastro com email válido, **Then** recebe link de confirmação
2. **Given** um visitante, **When** escolhe login social (Google), **Then** é autenticado e direcionado para completar perfil
3. **Given** usuário em cadastro, **When** não aceita termos LGPD, **Then** não pode prosseguir
4. **Given** usuário cadastrado, **When** faz login, **Then** acessa dashboard pessoal

---

### Edge Cases

- O que acontece quando um avaliador tenta avaliar sua própria foto? Sistema DEVE impedir
- Como o sistema lida com fotos duplicadas do mesmo usuário? Sistema DEVE detectar e alertar
- O que acontece se um usuário faz muitas avaliações muito rápidas (bot)? Sistema DEVE detectar padrão anômalo e aplicar rate limiting
- Como tratar avaliadores com viés extremo (sempre nota 1 ou sempre nota 10)? Algoritmo de normalização DEVE ajustar peso dos votos
- O que acontece se Pix falha no meio da transação? Sistema DEVE ter reconciliação automática
- Como lidar com fotos de menores de idade? Sistema DEVE rejeitar automaticamente e reportar
- O que acontece com avaliações de um usuário que é banido? DEVE ser reavaliado se impacta estatísticas

## Requirements *(mandatory)*

### Functional Requirements

**Cadastro e Autenticação**
- **FR-001**: Sistema DEVE permitir cadastro via email com confirmação
- **FR-002**: Sistema DEVE permitir login social (Google como mínimo)
- **FR-003**: Sistema DEVE exigir aceite explícito de termos de uso e política de privacidade
- **FR-004**: Sistema DEVE validar idade mínima de 18 anos

**Submissão de Fotos**
- **FR-005**: Sistema DEVE aceitar upload de fotos nos formatos JPEG e PNG
- **FR-006**: Sistema DEVE validar dimensões mínimas de foto (ex: 400x400 pixels)
- **FR-007**: Sistema DEVE moderar automaticamente conteúdo inadequado (nudez, violência) antes de aceitar
- **FR-008**: Sistema DEVE permitir seleção de categoria: Profissional, Namoro ou Social
- **FR-009**: Sistema DEVE limitar quantidade de fotos ativas por usuário gratuito (ex: 3 fotos)
- **FR-009a**: Sistema DEVE oferecer dois tipos de teste: gratuito (Karma) e pago (Créditos)
- **FR-009b**: Testes gratuitos (Karma) DEVEM receber avaliações de qualquer usuário elegível
- **FR-009c**: Testes pagos (Créditos) DEVEM permitir filtrar avaliadores por gênero e faixa etária

**Sistema de Avaliação**
- **FR-010**: Sistema DEVE apresentar fotos individualmente para avaliação (sem comparação A/B)
- **FR-011**: Sistema DEVE coletar notas de 1 a 10 para três eixos: Atração, Confiança, Inteligência
- **FR-012**: Sistema DEVE impedir que usuário avalie suas próprias fotos
- **FR-013**: Sistema DEVE distribuir fotos priorizando aquelas com menos avaliações
- **FR-014**: Sistema DEVE registrar metadados do avaliador (sem identificação pessoal) para normalização

**Algoritmo de Normalização**
- **FR-015**: Sistema DEVE calcular viés do avaliador baseado em histórico de notas
- **FR-016**: Sistema DEVE ajustar peso de cada voto conforme rigor/lenidade do avaliador
- **FR-017**: Sistema DEVE recalcular pontuações quando novos votos são registrados
- **FR-018**: Sistema DEVE indicar nível de confiança estatística baseado em quantidade de votos

**Economia de Karma e Créditos**
- **FR-019**: Sistema DEVE creditar Karma ao usuário por cada avaliação completada
- **FR-020**: Sistema DEVE debitar Karma quando usuário submete foto para teste gratuito
- **FR-021**: Sistema DEVE regenerar Karma automaticamente ao longo do tempo (ex: X pontos/hora)
- **FR-022**: Sistema DEVE manter Créditos como moeda separada (apenas comprada, não regenera)
- **FR-022a**: Sistema DEVE debitar Créditos quando usuário submete foto para teste pago com filtros
- **FR-022b**: Sistema DEVE exibir claramente a diferença entre teste gratuito e pago antes da submissão

**Pagamentos**
- **FR-023**: Sistema DEVE processar pagamentos via Pix com confirmação instantânea
- **FR-024**: Sistema DEVE oferecer pacotes entre R$ 1,99 e R$ 9,90
- **FR-025**: Sistema DEVE gerar comprovante de pagamento com dados fiscais
- **FR-026**: Sistema DEVE suportar checkout transparente (gateway a definir)

**Conformidade LGPD**
- **FR-027**: Sistema DEVE manter registro de consentimento do usuário
- **FR-028**: Sistema DEVE permitir visualização de todos os dados coletados
- **FR-029**: Sistema DEVE permitir exportação de dados em formato legível
- **FR-030**: Sistema DEVE permitir exclusão completa de dados (direito ao esquecimento)
- **FR-031**: Sistema DEVE tratar dados biométricos (características faciais) com proteção adicional
- **FR-032**: Sistema DEVE notificar usuários em caso de incidente de segurança

**Performance e Entrega**
- **FR-033**: Sistema DEVE entregar fotos otimizadas para dispositivos móveis
- **FR-034**: Sistema DEVE cachear rankings e estatísticas para acesso rápido
- **FR-035**: Sistema DEVE suportar carregamento progressivo de imagens

### Key Entities

- **Usuário**: Pessoa cadastrada na plataforma. Possui perfil, histórico de fotos, Karma, histórico de transações e preferências
- **Foto**: Imagem submetida para avaliação. Pertence a um usuário, possui categoria, status de moderação, e conjunto de avaliações recebidas
- **Avaliação**: Voto dado por um usuário a uma foto. Contém notas para os três eixos, timestamp, e metadados do avaliador para normalização
- **Karma**: Moeda gratuita regenerável. Creditado por avaliar fotos, debitado para testes gratuitos (sem filtros de audiência)
- **Créditos**: Moeda paga não-regenerável. Comprada via Pix/cartão, usada para testes premium com filtros de gênero/idade
- **Transação**: Registro de compra de créditos. Inclui valor, método de pagamento, status e comprovante
- **Consentimento**: Registro de aceite de termos pelo usuário. Essencial para conformidade LGPD

### Assumptions

1. **Idade mínima**: Plataforma restrita a maiores de 18 anos (padrão para apps de namoro/imagem pessoal)
2. **Idioma inicial**: Interface em português brasileiro, com suporte a inglês como segundo idioma planejado
3. **Moderação**: Rejeição automática de conteúdo NSFW é suficiente para lançamento; moderação humana pode ser adicionada posteriormente
4. **Votos mínimos**: Uma foto precisa de pelo menos 20 votos para exibir resultados confiáveis
5. **Karma inicial**: Novos usuários recebem Karma suficiente para submeter 1 foto gratuita e avaliar 10 fotos
6. **Regeneração de Karma**: Taxa base de 1 Karma por hora, até máximo de 50
7. **Autenticação**: Login social (Google) é suficiente; Apple Sign-In será adicionado para iOS
8. **Pagamentos**: Pix como método primário; checkout transparente para cartões (gateway a definir)
9. **Dados biométricos**: Características faciais extraídas para moderação são consideradas dados biométricos sob LGPD
10. **Segmentação de avaliadores**: Filtros de gênero e idade são funcionalidade premium (requer Créditos, não Karma)
11. **Custo por teste**: Testes gratuitos consomem Karma; testes com filtros consomem Créditos (modelo Photofeeler)

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Experiência do Usuário**
- **SC-001**: Usuários conseguem completar cadastro em menos de 2 minutos
- **SC-002**: Upload e processamento de foto completa em menos de 5 segundos em conexão 4G
- **SC-003**: Fotos carregam em menos de 1 segundo em dispositivos móveis
- **SC-004**: Usuários conseguem avaliar 10 fotos em menos de 3 minutos
- **SC-005**: 90% dos usuários que submetem foto visualizam resultados em até 24 horas

**Qualidade dos Dados**
- **SC-006**: Pontuações normalizadas apresentam desvio padrão menor que 1.5 após 50 votos
- **SC-007**: Menos de 5% das fotos são rejeitadas incorretamente pela moderação automática
- **SC-008**: Menos de 0.1% de conteúdo inadequado passa pela moderação

**Engajamento**
- **SC-009**: 60% dos usuários que avaliam 5 fotos retornam na semana seguinte
- **SC-010**: Taxa de conclusão de avaliação (usuário que começa e termina) acima de 85%

**Monetização**
- **SC-011**: Transações Pix confirmadas em menos de 10 segundos após pagamento
- **SC-012**: Taxa de abandono no checkout menor que 30%
- **SC-013**: Menos de 1% de transações com falha de reconciliação

**Conformidade**
- **SC-014**: 100% das solicitações de exportação de dados atendidas em até 48 horas
- **SC-015**: 100% das solicitações de exclusão de dados concluídas em até 72 horas
- **SC-016**: Zero incidentes de vazamento de dados biométricos
