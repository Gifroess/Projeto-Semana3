let listElement = document.querySelector("#app ul") as HTMLUListElement;
let inputElement = document.querySelector("#app input") as HTMLInputElement;
let buttonElement = document.querySelector("#app button") as HTMLElement;
let prioridadeElement = document.querySelector("#prioridade") as HTMLSelectElement;
let estatisticasElement = document.querySelector("#estatisticas") as HTMLParagraphElement;

let listaSalva: (string | null) = localStorage.getItem("@listagem_tarefas");
let tarefas: Tarefa[] = listaSalva !== null && JSON.parse(listaSalva) || [];

interface Tarefa {
    texto: string;
    prioridade: string;
    concluido: boolean;
}


function atualizarEstatisticas() {

    let total = tarefas.length;

    let concluidas = tarefas.filter(item => item.concluido).length;

    let porcentagem = total > 0? Math.round((concluidas / total) * 100): 0;

    estatisticasElement.innerText =`${concluidas} de ${total} tarefas concluídas (${porcentagem}%)`;
}

function listarTarefas() {

    listElement.innerHTML = "";

    tarefas.map(item => {

        let todoElement = document.createElement("li");

        let tarefaText = document.createElement("span");

        let icone = "";

        if (item.prioridade === "Alta") {
            icone = "🔴";
        } else if (item.prioridade === "Média") {
            icone = "🟡";
        } else {
            icone = "🟢";
        }

        tarefaText.innerText = `${icone} ${item.texto}`;

        let linkElement = document.createElement("a");
        linkElement.setAttribute("href", "#");

        let posicao = tarefas.indexOf(item);

        linkElement.setAttribute(
            "onclick",
            `deletarTarefa(${posicao})`
        );

        linkElement.setAttribute(
            "style",
            "margin-left: 10px"
        );

        linkElement.classList.add("acao");

        let linkText = document.createTextNode(" X ");
        linkElement.appendChild(linkText);

        let concluirBtn = document.createElement("button");
        concluirBtn.innerText = " ✔ ";
        concluirBtn.classList.add("acao");

        concluirBtn.onclick = () => {

            item.concluido = !item.concluido;

            listarTarefas();
            salvarDados();
        };

        if (item.concluido) {
            tarefaText.classList.add("concluido");
        }

        if (item.prioridade === "Alta") {
            tarefaText.classList.add("alta");
        } else if (item.prioridade === "Média") {
            tarefaText.classList.add("media");
        } else {
            tarefaText.classList.add("baixa");
        }

        todoElement.appendChild(tarefaText);
        todoElement.appendChild(linkElement);
        todoElement.appendChild(concluirBtn);

        listElement.appendChild(todoElement);

    });

    atualizarEstatisticas();
}

listarTarefas();

function adicionarTarefa() {

    if (inputElement.value === "") {
        alert("Digite alguma tarefa!");
        return false;
    }

    if (prioridadeElement.value === "") {
        alert("Selecione uma prioridade!");
        return false;
    }

    let tarefaDigitada: string = inputElement.value;

    tarefas.push({
        texto: tarefaDigitada,
        prioridade: prioridadeElement.value,
        concluido: false
    });

    inputElement.value = "";

    listarTarefas();
    salvarDados();
}

buttonElement.onclick = adicionarTarefa;

function deletarTarefa(posicao: number) {

    tarefas.splice(posicao, 1);

    listarTarefas();
    salvarDados();
}

function salvarDados() {
    localStorage.setItem(
        "@listagem_tarefas",
        JSON.stringify(tarefas)
    );
}