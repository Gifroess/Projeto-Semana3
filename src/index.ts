let listElement = document.querySelector("#app ul") as HTMLUListElement;
let inputElement = document.querySelector("#app #tarefa") as HTMLInputElement;
let prazoElement = document.querySelector("#prazo") as HTMLInputElement;
let buttonElement = document.querySelector("#app #Adicionar") as HTMLElement;
let prioridadeElement = document.querySelector("#prioridade") as HTMLSelectElement;
let estatisticasElement = document.querySelector("#estatisticas") as HTMLParagraphElement;
let btnTodas = document.querySelector('#todas') as HTMLElement;
let btnPendente = document.querySelector('#pendentes') as HTMLElement;
let btnConcluida = document.querySelector('#concluidas') as HTMLElement;
let temaBtn = document.querySelector("#tema") as HTMLButtonElement;

let listaSalva: (string | null) = localStorage.getItem("@listagem_tarefas");
let tarefas: Tarefa[] = listaSalva !== null && JSON.parse(listaSalva) || [];
let filtroAtual = "todas";
let temaSalvo = localStorage.getItem("tema");


if(temaSalvo === "dark"){

    document.body.classList.add("dark");

    temaBtn.innerText = "☀️";
}

interface Tarefa {
    texto: string;
    prioridade: string;
    concluido: boolean;
    prazo: string;
}


function atualizarEstatisticas() {

    let total = tarefas.length;

    let concluidas = tarefas.filter(item => item.concluido).length;

    let porcentagem = total > 0? Math.round((concluidas / total) * 100): 0;

    estatisticasElement.innerText =`${concluidas} de ${total} tarefas concluídas`;
}

function listarTarefas() {

    listElement.innerHTML = "";

    let tarefasFiltradas = tarefas;


    if(filtroAtual === "pendentes"){

        tarefasFiltradas = tarefas.filter(item => !item.concluido);

    } else if(filtroAtual === "concluidas"){

        tarefasFiltradas = tarefas.filter(item => item.concluido);

    }

    if(tarefasFiltradas.length === 0){

        let mensagem = document.createElement("li");
        mensagem.innerText = `Não há tarefas aqui.`;

        listElement.appendChild(mensagem);

        return;
    }
    tarefasFiltradas.map(item => {

        let todoElement = document.createElement("li");

        let tarefaText = document.createElement("span");
        let tarefaPrazo = document.createElement("span");

        let icone = "";

        let hoje = new Date().toISOString().split("T")[0];

        let prazoTarefa = new Date(item.prazo).toISOString().split("T")[0];

        // if (item.prioridade === "Alta") {
        //     icone = "🔴";
        // } else if (item.prioridade === "Média") {
        //     icone = "🟡";
        // } else {
        //     icone = "🟢";
        // }

        if(prazoTarefa < hoje && !item.concluido){
            icone = "⚠️"
            tarefaText.classList.add("atrasada");
        }

        tarefaText.innerText = `${icone} ${item.texto}`;
        tarefaPrazo.innerText = `${item.prazo}`;

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
            icone = "✅";
            todoElement.classList.add("concluido");
            tarefaText.innerText = `${icone} ${item.texto}`;
            tarefaPrazo.innerText = `${item.prazo}`;
        }

        if (item.prioridade === "Alta") {
            todoElement.classList.add("alta");
        } else if (item.prioridade === "Média") {
            todoElement.classList.add("media");
        } else {
            todoElement.classList.add("baixa");
        }

        tarefaPrazo.classList.add("data")

        todoElement.appendChild(tarefaText);
        todoElement.appendChild(tarefaPrazo); 
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

    if(prazoElement.value === ""){
        alert("Selecione um prazo a sua tarefa!");
        return false;
    }

    let tarefaDigitada: string = inputElement.value;

    tarefas.push({
        texto: tarefaDigitada,
        prioridade: prioridadeElement.value,
        concluido: false,
        prazo: prazoElement.value,
    });

    inputElement.value = "";

    listarTarefas();
    salvarDados();
}

buttonElement.onclick = adicionarTarefa;

btnTodas.onclick = () => {
    filtroAtual = "todas";

    btnPendente.classList.remove("selecionado");
    btnConcluida.classList.remove("selecionado");
    btnTodas.classList.add("selecionado");

    listarTarefas();
}

btnPendente.onclick = () => {
    filtroAtual = "pendentes";

    btnTodas.classList.remove("selecionado");
    btnConcluida.classList.remove("selecionado"); 
    btnPendente.classList.add("selecionado");

    listarTarefas();
}

btnConcluida.onclick = () => {
    filtroAtual = "concluidas";

    btnTodas.classList.remove("selecionado");
    btnPendente.classList.remove("selecionado"); 
    btnConcluida.classList.add("selecionado");

    listarTarefas();
}

temaBtn.onclick = () => {
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        temaBtn.innerText = "☀️";
        localStorage.setItem("tema", "dark");
    } else {
        temaBtn.innerText = "🌙";
        localStorage.setItem("tema", "light");
    }
}

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