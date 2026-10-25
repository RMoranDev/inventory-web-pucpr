let parametros = new URLSearchParams(window.location.search);

const rotulos = ["Nome do produto", "Código SKU", "Categoria", "Quantidade", "Preço (R$)", "Data de entrada"];


function pegar(nome) {
    let valor = parametros.get(nome);
    if (valor === null) {
        valor = "";
    }
    return valor.trim();
}

function nomeCategoria(codigo) {
    switch (codigo) {
        case "hardware":
            return "Hardware";
        case "perifericos":
            return "Periféricos";
        case "redes":
            return "Redes";
        case "cabos":
            return "Cabos";
        case "moveis":
            return "Móveis";
        case "monitor":
            return "Monitores";
        default:
            return "";
    }
}

function exibirResultado(tipo, titulo, mensagem) {
    const cabecalho = document.getElementById("resultado-cabecalho");
    const icone = document.getElementById("resultado-icone");

    cabecalho.classList.remove("resultado-erro");
    cabecalho.classList.remove("resultado-duplicado");

    if (tipo === "sucesso") {
        icone.textContent = "✓";
    } else if (tipo === "duplicado") {
        cabecalho.classList.add("resultado-duplicado");
        icone.textContent = "ℹ";
    } else {
        cabecalho.classList.add("resultado-erro");
        icone.textContent = "!";
    }

    document.getElementById("resultado-titulo").textContent = titulo;
    document.getElementById("resultado-mensagem").textContent = mensagem;
}

function limparDados() {
    document.getElementById("dados-produto").innerHTML = "";
}

function dataValida(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return false;
    }
    const partes = data.split("-");
    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    const d = new Date(ano, mes - 1, dia);
    return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
}

function dataHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return ano + "-" + mes + "-" + dia;
}

function validar(nome, sku, categoria, quantidade, preco, data) {
    const valores = [nome, sku, categoria, quantidade, preco, data];

    for (let i = 0; i < valores.length; i++) {
        if (valores[i] === "") {
            return 'O campo obrigatório "' + rotulos[i] + '" não foi informado.';
        }
    }

    if (nome.replace(/\s/g, "").length < 3 || nome.length > 100) {
        return "O nome do produto deve ter entre 3 e 100 caracteres.";
    }
    if (!/^[A-Z]{3}-\d{4}$/.test(sku)) {
        return "O código SKU deve seguir o formato padrão: (ABC-1234).";
    }
    if (nomeCategoria(categoria) === "") {
        return "A categoria selecionada é inválida.";
    }
    if (!/^\d+$/.test(quantidade) || Number(quantidade) <= 0) {
        return "A quantidade deve ser um número inteiro maior que zero.";
    }
    if (!/^\d+(\.\d{1,2})?$/.test(preco)) {
        return "O preço deve ser um valor numérico válido, não negativo, com até duas casas decimais.";
    }
    if (!dataValida(data)) {
        return "A data de entrada informada é inválida.";
    }
    if (data > dataHoje()) {
        return "A data de entrada não pode ser futura.";
    }
    return "";
}

function lerLista(chave) {
    const texto = localStorage.getItem(chave);
    if (texto === null) {
        return [];
    }
    return JSON.parse(texto);
}

function salvarProduto(id, nome, sku, categoria, quantidade, preco, data) {
    const produtos = lerLista("produtos");
    const processados = lerLista("cadastrosProcessados");

    if (processados.includes(id)) {
        exibirResultado("duplicado", "Cadastro já processado", "Este cadastro já foi processado anteriormente. Nenhuma alteração adicional foi realizada no estoque.");
        return true;
    }

    let existente = null;
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].sku === sku) {
            existente = produtos[i];
        }
    }

    let mensagem = "Produto cadastrado com sucesso.";

    if (existente !== null) {
        if (existente.nome.toLowerCase() !== nome.toLowerCase()) {
            exibirResultado("erro", "Conflito de SKU", "O SKU " + sku + ' já está cadastrado para outro produto ("' + existente.nome + '").');
            return false;
        }
        if (existente.categoria !== categoria) {
            exibirResultado("erro", "Conflito de categoria", "O SKU " + sku + ' já está cadastrado sob a categoria "' + nomeCategoria(existente.categoria) + '".');
            return false;
        }

        existente.quantidade = Number(existente.quantidade) + Number(quantidade);
        existente.preco = preco;
        existente.data = data;
        mensagem = 'Estoque do produto "' + existente.nome + '" atualizado com sucesso. Quantidade total: ' + existente.quantidade + ".";
    } else {
        produtos.push({
            sku: sku,
            nome: nome,
            categoria: categoria,
            quantidade: Number(quantidade),
            preco: preco,
            data: data
        });
    }

    processados.push(id);
    localStorage.setItem("produtos", JSON.stringify(produtos));
    localStorage.setItem("cadastrosProcessados", JSON.stringify(processados));

    exibirResultado("sucesso", "Cadastro recebido", mensagem);
    return true;
}

function exibirProduto(nome, sku, categoria, quantidade, preco, data) {
    const area = document.getElementById("dados-produto");
    area.innerHTML = "";

    // data de AAAA-MM-DD para DD/MM/AAAA
    const p = data.split("-");
    const dataBr = p[2] + "/" + p[1] + "/" + p[0];

    const valores = [nome, sku, nomeCategoria(categoria), quantidade, "R$ " + Number(preco).toFixed(2).replace(".", ","), dataBr];

    for (let i = 0; i < valores.length; i++) {
        const linha = document.createElement("div");
        const termo = document.createElement("dt");
        const valor = document.createElement("dd");

        linha.className = "dado-linha";
        termo.textContent = rotulos[i];
        valor.textContent = valores[i];

        linha.appendChild(termo);
        linha.appendChild(valor);
        area.appendChild(linha);
    }
}

function processarCadastro() {
    if (window.location.search === "" || window.location.search === "?") {
        exibirResultado("erro", "Nenhum dado recebido", "Nenhum cadastro foi recebido. Envie o formulário para continuar.");
        limparDados();
        return;
    }

    const id = pegar("idCadastro");
    if (id === "") {
        exibirResultado("erro", "Identificador ausente", "Identificador do cadastro não encontrado. Envie o formulário novamente.");
        limparDados();
        return;
    }

    const nome = pegar("nome");
    const sku = pegar("sku");
    const categoria = pegar("categoria");
    const quantidade = pegar("quantidade");
    const preco = pegar("preco");
    const data = pegar("data");

    const erro = validar(nome, sku, categoria, quantidade, preco, data);
    if (erro !== "") {
        exibirResultado("erro", "Dados inválidos", erro);
        limparDados();
        return;
    }

    salvarProduto(id, nome, sku, categoria, quantidade, preco, data);
    exibirProduto(nome, sku, categoria, quantidade, preco, data);
}

document.addEventListener("DOMContentLoaded", processarCadastro);