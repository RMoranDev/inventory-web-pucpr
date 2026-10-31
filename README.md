# Inventory Web 📦

> Sistema de controle de estoque desenvolvido como projeto prático para a disciplina de **Fundamentos de Programação Web** do curso de Análise e Desenvolvimento de Sistemas da **PUCPR**.

🌐 **Acesse online:** [GitHub Pages](https://rmorandev.github.io/inventory-web-pucpr/)

---

## 🎯 Sobre o Projeto

O **Inventory Web** é uma aplicação web focada em demonstrar na prática os fundamentos do desenvolvimento front-end sem o auxílio de bibliotecas ou frameworks externos. O projeto simula um sistema de gestão de estoque, permitindo cadastrar produtos, validar entradas, listar itens e visualizar métricas básicas.

---

## 🚀 Funcionalidades

- **Página Inicial (`index.html`)**: Apresentação visual da plataforma com navegação direta para cadastro e informações do projeto.
- **Catálogo de Produtos (`produtos.html`)**:
  - Listagem dos produtos cadastrados (armazenados via `localStorage`).
  - Busca em tempo real por nome ou código SKU.
  - Filtro por categorias e status de disponibilidade (*Em estoque* / *Estoque baixo*).
  - Cards com contadores e resumo de estoque.
- **Cadastro de Produtos (`form.html`)**:
  - Formulário com validação em tempo real e no envio via JavaScript (nome, SKU no padrão `AAA000`, categoria, quantidade, preço e data).
  - Envio de dados via método HTTP `GET`.
- **Confirmação e Processamento (`formAction.html`)**:
  - Captura e decodificação dos parâmetros recebidos na query string via `URLSearchParams`.
  - Salvamento dos produtos válidos e feedback dinâmico para o usuário (sucesso, dados duplicados ou erro).
- **Sobre o Projeto (`about.html`)**:
  - Documentação institucional com requisitos cumpridos, tecnologias e informações do autor.
- **Componentes Modulares**:
  - Cabeçalho (com destaque automático da página ativa) e rodapé compartilhados carregados dinamicamente via `fetch()`.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando exclusivamente os três pilares fundamentais da web (sem frameworks):

- **HTML5**: Estrutura semântica (`header`, `nav`, `main`, `section`, `article`, `footer`), formulários e acessibilidade.
- **CSS3**: Layout moderno com **Flexbox** e **CSS Grid**, responsividade para diferentes resoluções e tipografia personalizada (fonte *Poppins*).
- **JavaScript (ES6+)**: Manipulação do DOM, requisições assíncronas com `fetch API`, validações de formulário, persistência com `localStorage` e leitura de query strings com `URLSearchParams`.

---

## 📁 Estrutura de Arquivos

```text
inventory-web-pucpr/
├── components/           # Componentes reutilizáveis
│   ├── header.html       # Menu de navegação superior
│   └── footer.html       # Rodapé da aplicação
├── estilos/
│   └── style.css         # Estilização global e responsiva
├── fontes/               # Tipografia local (Poppins)
├── imagens/              # Ícones e ilustrações em SVG
├── scripts/              # Lógica da aplicação
│   ├── form.js           # Validações do formulário de cadastro
│   ├── formAction.js     # Leitura de parâmetros GET e salvamento
│   ├── main.js           # Carregamento de header/footer e links ativos
│   └── produtos.js       # Listagem, busca, filtros e métricas
├── about.html            # Informações sobre o projeto e requisitos
├── form.html             # Formulário de cadastro de produtos
├── formAction.html       # Página de confirmação dos dados enviados
├── index.html            # Página inicial (Home)
├── produtos.html         # Painel e listagem de produtos
└── README.md             # Documentação do repositório
```

---

## 💻 Como Executar Localmente

Como o projeto faz requisições assíncronas (`fetch`) para carregar os componentes de cabeçalho e rodapé (`components/header.html` e `components/footer.html`), os navegadores modernos exigem que ele seja servido por um servidor local para evitar bloqueios de CORS.

### Opção 1: VS Code (Live Server)
1. Abra o projeto no [VS Code](https://code.visualstudio.com/).
2. Instale a extensão **Live Server**.
3. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.

### Opção 2: Python HTTP Server
No terminal, dentro da pasta raiz do projeto, execute:

```bash
# Python 3
python -m http.server 8000
```
Em seguida, abra o navegador e acesse: `http://localhost:8000`

---

## 👨‍💻 Autor

- **Ricardo Moran**
- Estudante de Análise e Desenvolvimento de Sistemas — **PUCPR**
- GitHub: [@RMoranDev](https://github.com/RMoranDev)
