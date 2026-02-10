# WikiSearch Frontend

Um mini motor de busca para Wikipedia com interface moderna construída em React + TypeScript.

## 🚀 Tecnologias

- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de CSS
- **PostCSS** - Processamento de CSS

## 📋 Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**

## 🛠️ Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/SEU_USUARIO/wiksearch-frontend.git
cd wiksearch-frontend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```
Edite o `.env` com a URL da sua API:
```
VITE_API_URL=http://localhost:3000
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

5. **Abra no navegador:**
```
http://localhost:5173
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção

## 🔧 Build de Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 📁 Estrutura do Projeto

```
src/
  ├── App.tsx          # Componente principal
  ├── main.tsx         # Ponto de entrada
  └── index.css        # Estilos globais
public/              # Arquivos estáticos
```

## 🌟 Funcionalidades

- ✅ Busca em tempo real na Wikipedia
- ✅ Resumo automático dos resultados  
- ✅ Interface responsiva e moderna
- ✅ Links diretos para artigos da Wikipedia

---

**Desenvolvido por:** [@PolyannaMeira](https://github.com/PolyannaMeira)
