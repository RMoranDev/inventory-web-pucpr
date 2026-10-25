const LIMITE_ESTOQUE_BAIXO = 15;

const nomesCategorias = {
    hardware: "Hardware",
    perifericos: "Periféricos",
    redes: "Redes",
    cabos: "Cabos",
    moveis: "Móveis",
    monitor: "Monitores"
};

const categoriasPadrao = Object.keys(nomesCategorias);

function nomeCategoria(codigo) {
    return nomesCategorias[codigo] || "";
}

// recupera os produtos guardados no navegador
function obterProdutos() {
    const texto = localStorage.getItem("produtos");
    if (texto === null) {
        return [];
    }
    try {
        return JSON.parse(texto);
    } catch (erro) {
        return [];
    }
}

// define o status pela quantidade
function obterStatus(quantidade) {
    if (quantidade <= LIMITE_ESTOQUE_BAIXO) {
        return "Estoque baixo";
    }
    return "Em estoque";
}

// cria célula da tabela
function criarCelula(valor) {
    const celula = document.createElement("td");
    if (valor === undefined || valor === null) {
        valor = "";
    }
    celula.textContent = valor;
    return celula;
}

// cria uma linha para produto
function criarLinhaProduto(produto) {
    const linha = document.createElement("tr");

    let quantidade = Number(produto.quantidade);
    if (isNaN(quantidade)) {
        quantidade = 0;
    }

    let preco = Number(produto.preco);
    if (isNaN(preco)) {
        preco = 0;
    }

    const status = obterStatus(quantidade);

    const etiquetaStatus = document.createElement("span");
    etiquetaStatus.classList.add("produto-status");

    if (status === "Em estoque") {
        etiquetaStatus.classList.add("status-normal");
    } else {
        etiquetaStatus.classList.add("status-baixo");
    }

    etiquetaStatus.textContent = status;

    const celulaStatus = criarCelula("");
    celulaStatus.appendChild(etiquetaStatus);

    const rotuloCategoria = nomeCategoria(produto.categoria);
    
    linha.appendChild(criarCelula(produto.sku));
    linha.appendChild(criarCelula(produto.nome));
    linha.appendChild(criarCelula(rotuloCategoria));
    linha.appendChild(criarCelula(quantidade));
    linha.appendChild(criarCelula(preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })));
    linha.appendChild(celulaStatus);

    return linha;
}

function atualizarIndicadores(produtos) {
    let qtdEstoqueBaixo = 0;
    const categorias = [];

    for (let i = 0; i < produtos.length; i++) {
        const qtd = Number(produtos[i].quantidade);
        if (qtd > 0 && qtd <= LIMITE_ESTOQUE_BAIXO) {
            qtdEstoqueBaixo++;
        }

        const categoria = produtos[i].categoria;
        if (categoria && !categorias.includes(categoria)) {
            categorias.push(categoria);
        }
    }

    document.querySelector("#total-produtos").textContent = produtos.length;
    document.querySelector("#total-estoque-baixo").textContent = qtdEstoqueBaixo;
    document.querySelector("#total-categorias").textContent = categorias.length;
}

function formatarCategoria(categoria) {
    const nome = nomeCategoria(categoria);
    if (nome !== "") {
        return nome;
    }
    return categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
}

function carregarCategorias(produtos) {
    const filtro = document.querySelector("#categoria");
    const valorSelecionado = filtro.value;

    const todas = new Set(categoriasPadrao);
    for (let i = 0; i < produtos.length; i++) {
        const cat = produtos[i].categoria;
        if (cat) {
            todas.add(cat);
        }
    }

    filtro.innerHTML = '<option value="">Todas</option>';

    for (const categoria of todas) {
        const opcao = document.createElement("option");
        opcao.value = categoria;
        opcao.textContent = formatarCategoria(categoria);
        filtro.appendChild(opcao);
    }

    filtro.value = valorSelecionado;
}

// mostra os produtos filtrados na tabela e atualiza o contador
function exibirProdutos(produtosFiltrados, totalCadastrados) {
    const lista = document.getElementById("lista-produtos");
    lista.innerHTML = "";

    if (produtosFiltrados.length === 0) {
        const linha = document.createElement("tr");
        const celula = criarCelula("Nenhum produto encontrado.");
        celula.colSpan = 6;
        linha.appendChild(celula);
        lista.appendChild(linha);
    } else {
        for (let i = 0; i < produtosFiltrados.length; i++) {
            lista.appendChild(criarLinhaProduto(produtosFiltrados[i]));
        }
    }

    document.getElementById("contador-produtos").textContent =
        "Mostrando " + produtosFiltrados.length + " de " + totalCadastrados + " produtos";
}

function aplicarFiltros() {
    const produtos = obterProdutos();

    const termo = document.querySelector("#busca").value.trim().toLowerCase();
    const categoriaSelecionada = document.querySelector("#categoria").value;

    const produtosFiltrados = [];

    for (let i = 0; i < produtos.length; i++) {
        const produto = produtos[i];
        const nome = (produto.nome || "").toLowerCase();

        const correspondeBusca = nome.includes(termo);
        const correspondeCategoria = categoriaSelecionada === "" || produto.categoria === categoriaSelecionada;

        if (correspondeBusca && correspondeCategoria) {
            produtosFiltrados.push(produto);
        }
    }

    exibirProdutos(produtosFiltrados, produtos.length);
}

// inicializa a página
function listarProdutos() {
    const produtos = obterProdutos();
    atualizarIndicadores(produtos);
    carregarCategorias(produtos);
    aplicarFiltros();
}

document.addEventListener("DOMContentLoaded", function () {
    listarProdutos();

    document.getElementById("categoria").addEventListener("change", aplicarFiltros);
    document.getElementById("busca").addEventListener("input", aplicarFiltros);

    
    document.getElementById("form-filtros").addEventListener("submit", function (evento) {
        evento.preventDefault();
        aplicarFiltros();
    });
});