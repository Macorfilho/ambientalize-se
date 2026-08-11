# Ambientalize-se

[![React Native](https://img.shields.io/badge/React%20Native-0.79.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-53-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Status: ativo](https://img.shields.io/badge/status-ativo-success?style=for-the-badge)]()

## Visão Geral

O **Ambientalize-se** é um aplicativo mobile que simula uma rede de sensores inteligentes para o monitoramento de riscos de deslizamentos. O usuário insere dados ambientais (umidade do solo, inclinação do terreno, temperatura ambiente e ocorrência de chuvas) e o app calcula um nível de risco — Baixo, Moderado, Elevado ou Crítico — exibindo ações de mitigação recomendadas para cada cenário.

Inspirado em iniciativas como o Alerta Rio e Early Warning Systems, o projeto visa contribuir para a prevenção de desastres naturais e a proteção de comunidades em áreas vulneráveis. Ele foi desenvolvido para a disciplina de *Advanced Programming And Mobile Dev* da FIAP.

Como o app funciona:

- Entrada de dados ambientais que simulam leituras de sensores de campo.
- Cálculo de risco baseado em um algoritmo de pontuação (umidade, inclinação, chuva recente e temperatura).
- Histórico cronológico de todos os registros, com persistência local.
- Recomendações de ação conforme o nível de risco identificado.

## Tecnologias Utilizadas

| Categoria | Tecnologia | Uso no projeto |
|---|---|---|
| Framework | React Native 0.79.2 | Interface nativa multiplataforma (iOS/Android/Web) |
| Linguagem | TypeScript 5.8 | Tipagem estática de telas, tipos e utilitários |
| Plataforma | Expo SDK 53 | Build, execução e serviços do app |
| Navegação | @react-navigation/native + stack | Navegação entre as 5 telas do app |
| Persistência | @react-native-async-storage/async-storage | Armazenamento local dos registros de monitoramento |
| UI | react-native-safe-area-context / react-native-screens | Áreas seguras e performance de navegação |
| Ícones | @expo/vector-icons (Ionicons) | Ícones da tela de boas-vindas |

## Arquitetura & Funcionalidades

Aplicativo estruturado com **navegação em pilha (Stack)** registrada no `AppNavigator`, telas separadas por responsabilidade e a lógica de cálculo isolada no módulo `utils/riskCalculator.ts`.

```
App.tsx → NavigationContainer → AppNavigator (Stack)
  ├── WelcomeScreen
  ├── DataEntryScreen ──► AsyncStorage 'monitoringData'
  ├── RiskVisualizationScreen ──► utils/riskCalculator.ts
  ├── HistoryScreen ──► calcula risco de cada registro salvo
  └── MitigationActionsScreen ──► ações por nível de risco
```

**Funcionalidades implementadas:**

- **Tela de boas-vindas** (`WelcomeScreen`): apresenta o nome e a proposta do app com chamada para início.
- **Inserção de dados ambientais** (`DataEntryScreen`): formulário com validação de campos obrigatórios para umidade do solo (%), inclinação (graus), temperatura ambiente (°C), localização e switch "Choveu na última semana?". Os dados são persistidos no AsyncStorage e a tela navega para a visualização de riscos.
- **Visualização de riscos** (`RiskVisualizationScreen`): exibe o registro analisado e o nível de risco calculado, com estados de "Sem Dados", "Dados Inválidos" e "Erro no Cálculo".
- **Histórico de monitoramento** (`HistoryScreen`): lista cronológica dos registros (mais recentes primeiro), com pull-to-refresh, risco calculado por item, atalho para ações de mitigação do registro e opção de apagar todos os dados (com confirmação).
- **Ações de mitigação** (`MitigationActionsScreen`): recomendações específicas por nível de risco — inclui orientações de evacuação e contatos da Defesa Civil (199) e Bombeiros (193) para níveis Elevado e Crítico.

**Algoritmo de risco** (`utils/riskCalculator.ts`): pontuação acumulada a partir dos limiares:

| Indicador | Pontuação |
|---|---|
| Umidade do solo | +1 (≥30%), +2 (≥50%), +3 (≥70%) |
| Inclinação do terreno | +1 (≥5°), +2 (≥15°), +3 (≥25°) |
| Chuva na última semana | +4 (base), +2 se umidade ≥50% |
| Temperatura fora da faixa | +0.5 (10–28°C), +1 (<5°C ou >35°C) |

Resultado: score ≥9 = **Crítico**, ≥6 = **Elevado**, ≥3 = **Moderado**, demais = **Baixo**.

## Instalação e Configuração

**Pré-requisitos:**

- Node.js (LTS)
- npm ou yarn
- Expo Go (para executar em dispositivo físico) ou emulador/simulador

**Passo a passo:**

```bash
git clone https://github.com/Macorfilho/ambientalize-se.git
cd ambientalize-se

npm install
# ou
yarn install
```

O app não requer nenhuma variável de ambiente ou chave de API para funcionar.

## Como Executar / Exemplos de Uso

```bash
npm start        # inicia o servidor de desenvolvimento do Expo
npm run android  # abre no emulador Android
npm run ios      # abre no simulador iOS (macOS)
npm run web      # abre no navegador (funcionalidades podem ser limitadas)
```

Após iniciar, escaneie o QR Code com o app **Expo Go** (dispositivo físico) ou selecione a opção de emulador no terminal.

**Fluxo de uso:**

1. Na tela de boas-vindas, toque em "Começar Agora".
2. Preencha os dados ambientais (ex: umidade 75%, inclinação 15°, temperatura 28°C) e informe se choveu na última semana.
3. Toque em "Salvar Dados" para ver o nível de risco calculado.
4. Consulte o histórico para acompanhar a evolução dos indicadores.
5. Acesse "Ações de Mitigação" para ver as recomendações do nível de risco atual.

## Contato / Créditos

Desenvolvido por Marcelo R. Corner Filho.

- Portfólio: https://marcelocorner.dev
- GitHub: https://github.com/Macorfilho
- LinkedIn: https://www.linkedin.com/in/marcelocorner

**Projeto de equipe** (disciplina *Advanced Programming And Mobile Dev*, FIAP):

- Marcelo Rodriguez Corner Filho — RM 98828
- Bruno Lopes da Silva — RM 99761