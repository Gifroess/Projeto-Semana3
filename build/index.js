"use strict";
let listElement = document.querySelector("#app ul");
let inputElement = document.querySelector("#app input");
let prazoElement = document.querySelector("#prazo");
let buttonElement = document.querySelector("#app button");
let prioridadeElement = document.querySelector("#prioridade");
let estatisticasElement = document.querySelector("#estatisticas");
let btnTodas = document.querySelector('#todas');
let btnPendente = document.querySelector('#pendentes');
let btnConcluida = document.querySelector('#concluidas');
let listaSalva = localStorage.getItem("@listagem_tarefas");
let tarefas = listaSalva !== null && JSON.parse(listaSalva) || [];
let filtroAtual = "todas";
function atualizarEstatisticas() {
    let total = tarefas.length;
    let concluidas = tarefas.filter(item => item.concluido).length;
    let porcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    estatisticasElement.innerText = `${concluidas} de ${total} tarefas concluídas (${porcentagem}%)`;
}
function listarTarefas() {
    listElement.innerHTML = "";
    let tarefasFiltradas = tarefas;
    if (filtroAtual === "pendentes") {
        tarefasFiltradas = tarefas.filter(item => !item.concluido);
    }
    else if (filtroAtual === "concluidas") {
        tarefasFiltradas = tarefas.filter(item => item.concluido);
    }
    if (tarefasFiltradas.length === 0) {
        let mensagem = document.createElement("li");
        mensagem.innerText = `Não há tarefas aqui.`;
        listElement.appendChild(mensagem);
        return;
    }
    tarefasFiltradas.map(item => {
        let todoElement = document.createElement("li");
        let tarefaText = document.createElement("span");
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
        if (prazoTarefa < hoje && !item.concluido) {
            icone = "⚠️";
            tarefaText.classList.add("atrasada");
        }
        tarefaText.innerText = `${icone} ${item.texto} - ${item.prazo}`;
        let linkElement = document.createElement("a");
        linkElement.setAttribute("href", "#");
        let posicao = tarefas.indexOf(item);
        linkElement.setAttribute("onclick", `deletarTarefa(${posicao})`);
        linkElement.setAttribute("style", "margin-left: 10px");
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
            tarefaText.innerText = `${icone} ${item.texto} - ${item.prazo}`;
        }
        if (item.prioridade === "Alta") {
            todoElement.classList.add("alta");
        }
        else if (item.prioridade === "Média") {
            todoElement.classList.add("media");
        }
        else {
            todoElement.classList.add("baixa");
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
    if (prazoElement.value === "") {
        alert("Selecione um prazo a sua tarefa!");
        return false;
    }
    let tarefaDigitada = inputElement.value;
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
    listarTarefas();
};
btnPendente.onclick = () => {
    filtroAtual = "pendentes";
    listarTarefas();
};
btnConcluida.onclick = () => {
    filtroAtual = "concluidas";
    listarTarefas();
};
function deletarTarefa(posicao) {
    tarefas.splice(posicao, 1);
    listarTarefas();
    salvarDados();
}
function salvarDados() {
    localStorage.setItem("@listagem_tarefas", JSON.stringify(tarefas));
}
