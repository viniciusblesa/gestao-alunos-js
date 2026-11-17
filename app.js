class Aluno {
    constructor(nome, nota1, nota2, id = crypto.randomUUID()) {
        this.id = id;
        this.nome = nome;
        this.nota1 = Number(nota1);
        this.nota2 = Number(nota2);
    }

    calcularMedia() {
        return (this.nota1 + this.nota2) / 2;
    }

    situacao() {
        return this.calcularMedia() >= 6 ? "Aprovado" : "Reprovado";
    }
}

class App {
    constructor() {
        this.alunos = this.carregarAlunos();
        this.alunoEmEdicao = null;
        this.form = document.querySelector("#formAluno");
        this.tabela = document.querySelector("#tabelaAlunos");
        this.campoNome = document.querySelector("#nome");
        this.campoNota1 = document.querySelector("#nota1");
        this.campoNota2 = document.querySelector("#nota2");
        this.botaoSalvar = document.querySelector("#botaoSalvar");
        this.botaoCancelar = document.querySelector("#botaoCancelar");
        this.mensagem = document.querySelector("#mensagem");
        this.busca = document.querySelector("#busca");
        this.botaoTema = document.querySelector("#alternarTema");
        this.iconeTema = document.querySelector("#iconeTema");
        this.tema = localStorage.getItem("tema") === "escuro" ? "escuro" : "claro";

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.salvarAluno();
        });
        this.botaoCancelar.addEventListener("click", () => this.cancelarEdicao());
        this.busca.addEventListener("input", () => this.renderizar());
        this.tabela.addEventListener("click", (e) => this.tratarAcao(e));
        this.botaoTema.addEventListener("click", () => this.alternarTema());

        this.aplicarTema();
        this.renderizar();
    }

    alternarTema() {
        this.tema = this.tema === "claro" ? "escuro" : "claro";
        localStorage.setItem("tema", this.tema);
        this.aplicarTema();
    }

    aplicarTema() {
        const temaEscuro = this.tema === "escuro";
        document.documentElement.dataset.theme = temaEscuro ? "dark" : "light";
        this.iconeTema.textContent = temaEscuro ? "☀" : "☾";
        const acao = temaEscuro ? "Ativar tema claro" : "Ativar tema noturno";
        this.botaoTema.setAttribute("aria-label", acao);
        this.botaoTema.title = acao;
        document.querySelector('meta[name="theme-color"]').content = temaEscuro ? "#151d1a" : "#f4f6f2";
    }

    carregarAlunos() {
        try {
            const dados = JSON.parse(localStorage.getItem("alunos") || "[]");
            if (!Array.isArray(dados)) return [];

            return dados
                .filter((aluno) => aluno && typeof aluno.nome === "string")
                .map((aluno) => new Aluno(
                    aluno.nome,
                    aluno.nota1,
                    aluno.nota2,
                    aluno.id || crypto.randomUUID()
                ));
        } catch {
            return [];
        }
    }

    salvarAluno() {
        const nome = this.campoNome.value.trim();
        const nota1 = Number(this.campoNota1.value);
        const nota2 = Number(this.campoNota2.value);

        if (!nome || !this.form.reportValidity()) return;

        if (this.alunoEmEdicao) {
            const aluno = this.alunos.find((item) => item.id === this.alunoEmEdicao);
            if (!aluno) return;
            Object.assign(aluno, { nome, nota1, nota2 });
            this.exibirMensagem("Cadastro atualizado com sucesso.");
        } else {
            this.alunos.push(new Aluno(nome, nota1, nota2));
            this.exibirMensagem("Aluno adicionado com sucesso.");
        }

        this.cancelarEdicao(false);
        this.salvar();
        this.renderizar();
    }

    tratarAcao(evento) {
        const botao = evento.target.closest("button[data-acao]");
        if (!botao) return;

        const aluno = this.alunos.find((item) => item.id === botao.dataset.id);
        if (!aluno) return;

        if (botao.dataset.acao === "editar") {
            this.iniciarEdicao(aluno);
        } else if (botao.dataset.acao === "remover") {
            this.removerAluno(aluno);
        }
    }

    iniciarEdicao(aluno) {
        this.alunoEmEdicao = aluno.id;
        this.campoNome.value = aluno.nome;
        this.campoNota1.value = aluno.nota1;
        this.campoNota2.value = aluno.nota2;
        document.querySelector("#formTitulo").textContent = "Editar aluno";
        this.botaoSalvar.textContent = "Salvar alterações";
        this.botaoCancelar.hidden = false;
        this.campoNome.focus();
        this.exibirMensagem(`Editando ${aluno.nome}.`);
    }

    cancelarEdicao(limparMensagem = true) {
        this.alunoEmEdicao = null;
        this.form.reset();
        document.querySelector("#formTitulo").textContent = "Adicionar aluno";
        this.botaoSalvar.textContent = "Adicionar aluno";
        this.botaoCancelar.hidden = true;
        if (limparMensagem) this.mensagem.textContent = "";
    }

    removerAluno(aluno) {
        if (!confirm(`Deseja excluir o cadastro de ${aluno.nome}?`)) return;

        this.alunos = this.alunos.filter((item) => item.id !== aluno.id);
        if (this.alunoEmEdicao === aluno.id) this.cancelarEdicao();

        this.salvar();
        this.renderizar();
        this.exibirMensagem("Cadastro removido.");
    }

    salvar() {
        localStorage.setItem("alunos", JSON.stringify(this.alunos));
    }

    exibirMensagem(texto) {
        this.mensagem.textContent = texto;
    }

    renderizar() {
        const termo = this.busca.value.trim().toLocaleLowerCase("pt-BR");
        const aprovados = this.alunos.filter((aluno) => aluno.situacao() === "Aprovado").length;
        document.querySelector("#totalAlunos").textContent = this.alunos.length;
        document.querySelector("#totalAprovados").textContent = aprovados;
        document.querySelector("#totalReprovados").textContent = this.alunos.length - aprovados;
        this.tabela.replaceChildren();

        const alunosVisiveis = this.alunos.filter((aluno) =>
            aluno.nome.toLocaleLowerCase("pt-BR").includes(termo)
        );

        if (alunosVisiveis.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");
            celula.colSpan = 6;
            celula.className = "empty-state";
            celula.textContent = termo
                ? "Nenhum aluno encontrado para esta busca."
                : "Nenhum aluno cadastrado. Use o formulário acima para começar.";
            linha.append(celula);
            this.tabela.append(linha);
            return;
        }

        alunosVisiveis.forEach((aluno) => {
            const situacao = aluno.situacao();
            const linha = document.createElement("tr");
            const valores = [
                aluno.nome,
                this.formatarNota(aluno.nota1),
                this.formatarNota(aluno.nota2),
                this.formatarNota(aluno.calcularMedia())
            ];

            valores.forEach((valor) => {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.append(celula);
            });

            const celulaSituacao = document.createElement("td");
            const etiqueta = document.createElement("span");
            etiqueta.className = `status status-${situacao === "Aprovado" ? "aprovado" : "reprovado"}`;
            etiqueta.textContent = situacao;
            celulaSituacao.append(etiqueta);
            linha.append(celulaSituacao);

            const celulaAcoes = document.createElement("td");
            celulaAcoes.className = "actions-cell";
            celulaAcoes.append(
                this.criarBotaoAcao("editar", aluno, "Editar", "button-edit"),
                this.criarBotaoAcao("remover", aluno, "Excluir", "button-delete")
            );
            linha.append(celulaAcoes);
            this.tabela.append(linha);
        });
    }

    formatarNota(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        });
    }

    criarBotaoAcao(acao, aluno, rotulo, classe) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = `button-action ${classe}`;
        botao.dataset.acao = acao;
        botao.dataset.id = aluno.id;
        botao.textContent = rotulo;
        botao.setAttribute("aria-label", `${rotulo} ${aluno.nome}`);
        return botao;
    }
}

new App();