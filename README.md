# Ambientalize-se: Monitoramento de Riscos de Deslizamentos

## 📝 Descrição do Projeto

O **Ambientalize-se** é um aplicativo mobile desenvolvido em React Native com TypeScript. Ele simula uma rede de sensores inteligentes para monitorar indicadores ambientais como umidade do solo, inclinação e temperatura ambiente. Inspirado em iniciativas como o Alerta Rio e Early Warning Systems, o app visa prever riscos de deslizamentos e emitir alertas para áreas vulneráveis, contribuindo para a proteção de comunidades e prevenção de desastres naturais.

> Projeto desenvolvido para a disciplina de *Advanced Programming And Mobile Dev*.

---

## ✨ Funcionalidades Principais

O aplicativo possui 5 telas principais:

1. **Tela de Boas-vindas (`WelcomeScreen`)**  
    Apresenta o nome e a proposta do Ambientalize-se.

2. **Tela de Inserção de Dados Ambientais (`DataEntryScreen`)**  
    Permite inserir manualmente dados de umidade do solo, inclinação, temperatura ambiente, localização e ocorrência de chuva na última semana, simulando sensores.

3. **Tela de Visualização de Riscos (`RiskVisualizationScreen`)**  
    Exibe o nível de risco de deslizamento (Baixo, Médio, Alto, Crítico) com base nos dados inseridos.

4. **Tela de Histórico de Monitoramento (`HistoryScreen`)**  
    Lista cronologicamente todos os dados registrados, permitindo acompanhar a evolução dos indicadores. Inclui opção para apagar todos os dados.

5. **Tela de Ações de Mitigação (`MitigationActionsScreen`)**  
    Fornece recomendações e ações de mitigação conforme o nível de risco identificado, incluindo casos de "Sem Dados", "Dados Inválidos" e "Erro no Cálculo".

---

## 🚀 Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile multiplataforma.
- **TypeScript**: Tipagem estática para maior robustez.
- **Expo**: Ferramentas e serviços para apps React Native.
- **@react-native-async-storage/async-storage**: Armazenamento local persistente.
- **@react-navigation/native** / **@react-navigation/stack**: Gerenciamento de navegação entre telas.

---

## 🛠️ Como Rodar o Projeto

### Pré-requisitos

- **Node.js** (LTS)
- **Expo CLI**  
  Instale globalmente:
  ```bash
  npm install -g expo-cli
  ```
- **Git**

### Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/davirsmoreira/FIAP_Advanced_Programming_And_Mobile_Dev.git
cd FIAP_Advanced_Programming_And_Mobile_Dev/ambientalize-se
```

Instale as dependências:

```bash
npm install
# ou
yarn install
```

Instale dependências adicionais:

```bash
npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
npx expo install react-native-screens react-native-safe-area-context
```

### Executando o Aplicativo

Inicie o servidor de desenvolvimento do Expo:

```bash
npm start
# ou
expo start
```

Abra o aplicativo:

- **Emulador/simulador**: Selecione a opção no terminal ou interface web do Expo.
- **Dispositivo físico**: Baixe o app Expo Go (Google Play Store/App Store), abra e escaneie o QR code.
- **Navegador web**: O Expo permite rodar o app no navegador (algumas funcionalidades podem ser limitadas).

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 👥 Integrantes do Projeto

- Marcelo Rodriguez Corner Filho - RM: 98828
- Bruno Lopes da Silva - RM: 99761