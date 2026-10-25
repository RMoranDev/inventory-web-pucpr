function destacarLinkAtivo() {
    const nomeArquivo = window.location.pathname.split('/').pop() || 'index.html';
    const pagAtual = nomeArquivo.toLowerCase();

    const links = document.querySelectorAll('.header-menu a');
    links.forEach(link => {
        link.classList.remove('active');

        const href = link.getAttribute('href');
        if (!href) return;

        let pagLink = href.split('?')[0].split('#')[0].split('/').pop() || 'index.html';
        pagLink = pagLink.toLowerCase();

        if (pagLink === pagAtual || (pagAtual === 'formaction.html' && pagLink === 'form.html')) {
            link.classList.add('active');
        }
    });
}

async function carregarHeader() {
    const container = document.getElementById('header-container');
    if (!container) {
        console.warn('Contêiner #header-container não encontrado.');
        return;
    }

    try {
        const resposta = await fetch('components/header.html');
        if (!resposta.ok) {
            throw new Error(`Erro HTTP ao buscar cabeçalho: ${resposta.status}`);
        }

        container.innerHTML = await resposta.text();
        destacarLinkAtivo();
    } catch (erro) {
        console.error('Erro ao carregar o cabeçalho:', erro);
    }
}

async function carregarFooter() {
    const container = document.getElementById('footer-container');
    if (!container) {
        console.warn('Contêiner #footer-container não encontrado.');
        return;
    }

    try {
        const resposta = await fetch('components/footer.html');
        if (!resposta.ok) {
            throw new Error(`Erro HTTP ao buscar rodapé: ${resposta.status}`);
        }

        container.innerHTML = await resposta.text();
    } catch (erro) {
        console.error('Erro ao carregar o rodapé:', erro);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarHeader();
    carregarFooter();
});
