function validarCampoNome() {
    const nome = document.querySelector("#nome");
    const mensagem = document.querySelector("#mensagem-nome");

    if (nome == null || mensagem == null) {
        return;
    }

    nome.addEventListener("input", function () {
        let texto = nome.value.trimStart();
        texto = texto.replace(/\s+/g, " ");
        nome.value = texto;

        const semEspacos = texto.replaceAll(" ", "");

        if (texto === "") {
            nome.setCustomValidity("");
            mensagem.textContent = "";
            mensagem.className = "mensagem";
        } else if (semEspacos.length < 3) {
            nome.setCustomValidity("Digite pelo menos 3 caracteres, sem contar espaços.");
            mensagem.textContent = "Digite pelo menos 3 caracteres, sem contar espaços.";
            mensagem.className = "mensagem erro";
        } else {
            nome.setCustomValidity("");
            mensagem.textContent = "";
            mensagem.className = "mensagem";
        }
    });
}

function validarCampoSku() {
    const sku = document.querySelector("#sku");
    const mensagem = document.querySelector("#mensagem-sku");

    if (sku == null || mensagem == null) {
        return;
    }

    sku.addEventListener("input", function () {
        const texto = sku.value.toUpperCase();
        let letras = "";
        let numeros = "";

        for (let i = 0; i < texto.length; i++) {
            const c = texto[i];

            if (letras.length < 3) {
                if (c >= "A" && c <= "Z") {
                    letras = letras + c;
                }
            } else if (numeros.length < 4) {
                if (c >= "0" && c <= "9") {
                    numeros = numeros + c;
                }
            }
        }

        let valor = letras;
        if (numeros.length > 0) {
            valor = letras + "-" + numeros;
        }
        sku.value = valor;

        if (valor === "") {
            mensagem.textContent = "";
            mensagem.className = "mensagem";
        } else if (valor.length < 8) {
            mensagem.textContent = "Formato inválido. Use ABC-1234.";
            mensagem.className = "mensagem erro";
        } else {
            mensagem.textContent = "SKU válido!";
            mensagem.className = "mensagem sucesso";
        }
    });
}

function dataHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return ano + "-" + mes + "-" + dia;
}

function ativarValidacao(id, obterErro) {
    const campo = document.querySelector("#" + id);
    const mensagem = document.querySelector("#mensagem-" + id);

    if (campo == null || mensagem == null) {
        return;
    }

    function atualizar() {
        const erro = obterErro(campo);
        campo.setCustomValidity(erro);

        if (erro === "") {
            mensagem.textContent = "";
            mensagem.className = "mensagem";
        } else {
            mensagem.textContent = erro;
            mensagem.className = "mensagem erro";
        }
    }

    campo.addEventListener("input", atualizar);
    campo.addEventListener("change", atualizar);
    campo.addEventListener("blur", atualizar);
}

function erroCategoria(campo) {
    if (campo.value === "") {
        return "Selecione uma categoria.";
    }
    return "";
}

function erroQuantidade(campo) {
    if (campo.validity.badInput) {
        return "Digite apenas números.";
    }
    if (campo.value === "") {
        return "Informe a quantidade.";
    }
    if (!/^\d+$/.test(campo.value)) {
        return "Use apenas números inteiros, sem ponto, vírgula ou letras.";
    }
    if (Number(campo.value) < 1) {
        return "A quantidade deve ser no mínimo 1.";
    }
    return "";
}

function erroPreco(campo) {
    if (campo.validity.badInput) {
        return "Digite um valor numérico válido.";
    }
    if (campo.value === "") {
        return "Informe o preço.";
    }
    if (!/^\d+(\.\d{1,2})?$/.test(campo.value)) {
        return "Use um valor positivo com até 2 casas decimais (ex.: 19,90).";
    }
    return "";
}

function erroData(campo) {
    if (campo.validity.badInput) {
        return "Data inválida.";
    }
    if (campo.value === "") {
        return "Informe a data de entrada.";
    }
    if (campo.value > dataHoje()) {
        return "A data de entrada não pode ser futura.";
    }
    return "";
}

function erroObservacoes(campo) {
    if (campo.value.trim() === "") {
        return "Escreva uma observação.";
    }
    if (campo.value.length > 255) {
        return "Máximo de 255 caracteres.";
    }
    return "";
}

document.addEventListener("DOMContentLoaded", function () {
    validarCampoNome();
    validarCampoSku();

    ativarValidacao("categoria", erroCategoria);
    ativarValidacao("quantidade", erroQuantidade);
    ativarValidacao("preco", erroPreco);
    ativarValidacao("data", erroData);
    ativarValidacao("observacoes", erroObservacoes);

    const campoData = document.querySelector("#data");
    if (campoData != null) {
        campoData.max = dataHoje();
    }

    const form = document.querySelector("#form-produto");

    if (form != null) {
        form.addEventListener("submit", function () {
            const idInput = document.querySelector("#idCadastro");
            if (idInput != null) {
                idInput.value = Date.now();
            }
        });

        form.addEventListener("reset", function () {
            const mensagens = document.querySelectorAll(".mensagem");
            for (let i = 0; i < mensagens.length; i++) {
                mensagens[i].textContent = "";
                mensagens[i].className = "mensagem";
            }

            for (let i = 0; i < form.elements.length; i++) {
                form.elements[i].setCustomValidity("");
            }
        });
    }
});