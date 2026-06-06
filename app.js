class Aluno {
    constructor(nome, nota1, nota2) {
        this.nome = nome;
        this.nota1 = Number(nota1);
        this.nota2 = Number(nota2);
    }

    calcularMedia() {
        return ((this.nota1 + this.nota2) / 2).toFixed(2);
    }

    situacao() {
        return this.calcularMedia() >= 6
            ? "Aprovado"
            : "Reprovado";
    }
}

class App {
    constructor() {
        this.alunos =
            JSON.parse(localStorage.getItem("alunos")) || [];

        this.form = document.querySelector("#formAluno");
        this.tabela = document.querySelector("#tabelaAlunos");

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.adicionarAluno();
        });

        this.renderizar();
    }

    adicionarAluno() {
        const nome = document.querySelector("#nome").value.trim();
        const nota1 = document.querySelector("#nota1").value;
        const nota2 = document.querySelector("#nota2").value;

        if (!nome || nota1 === "" || nota2 === "") {
            alert("Preencha todos os campos!");
            return;
        }

        const aluno = new Aluno(nome, nota1, nota2);

        this.alunos.push(aluno);

        this.salvar();
        this.renderizar();

        this.form.reset();
    }

    removerAluno(indice) {
        const confirmar = confirm(
            "Deseja realmente excluir este aluno?"
        );

        if (!confirmar) {
            return;
        }

        this.alunos.splice(indice, 1);

        this.salvar();
        this.renderizar();
    }

    salvar() {
        localStorage.setItem(
            "alunos",
            JSON.stringify(this.alunos)
        );
    }

    renderizar() {
        this.tabela.innerHTML = "";

        if (this.alunos.length === 0) {
            this.tabela.innerHTML = `
                <tr>
                    <td colspan="6" class="sem-alunos">
                        Nenhum aluno cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        this.alunos.forEach((aluno, indice) => {

            const media =
                ((Number(aluno.nota1) +
                Number(aluno.nota2)) / 2).toFixed(2);

            const situacao =
                media >= 6
                    ? "Aprovado"
                    : "Reprovado";

            const classeSituacao =
                situacao === "Aprovado"
                    ? "aprovado"
                    : "reprovado";

            this.tabela.innerHTML += `
                <tr>
                    <td>${aluno.nome}</td>
                    <td>${aluno.nota1}</td>
                    <td>${aluno.nota2}</td>
                    <td>${media}</td>

                    <td class="${classeSituacao}">
                        ${situacao}
                    </td>

                    <td>
                        <button
                            class="btn-excluir"
                            onclick="app.removerAluno(${indice})"
                        >
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    }
}

const app = new App();