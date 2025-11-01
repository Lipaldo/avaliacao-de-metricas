const btnCalcular = document.getElementById('btnCalcular');
let grafico;

btnCalcular.addEventListener('click', () => {
    const VP = parseInt(document.getElementById('vp').value);
    const VN = parseInt(document.getElementById('vn').value);
    const FP = parseInt(document.getElementById('fp').value);
    const FN = parseInt(document.getElementById('fn').value);

    // Cálculo das métricas
    const acuracia = (VP + VN) / (VP + VN + FP + FN);
    const precisao = (VP + FP) > 0 ? VP / (VP + FP) : 0;
    const recall = (VP + FN) > 0 ? VP / (VP + FN) : 0;
    const especificidade = (VN + FP) > 0 ? VN / (VN + FP) : 0;
    const fScore = (precisao + recall) > 0 ? 2 * (precisao * recall) / (precisao + recall) : 0;

    // Criação da tabela
    const tabelaHTML = `
        <h2>📈 Resultados das Métricas</h2>
        <table>
            <tr><th>Métrica</th><th>Valor</th><th>Descrição</th></tr>
            <tr><td>Acurácia</td><td>${acuracia.toFixed(4)}</td><td>Proporção total de acertos</td></tr>
            <tr><td>Precisão</td><td>${precisao.toFixed(4)}</td><td>Predições positivas corretas</td></tr>
            <tr><td>Recall (Sensibilidade)</td><td>${recall.toFixed(4)}</td><td>Capacidade de identificar positivos</td></tr>
            <tr><td>Especificidade</td><td>${especificidade.toFixed(4)}</td><td>Capacidade de identificar negativos</td></tr>
            <tr><td>F-Score</td><td>${fScore.toFixed(4)}</td><td>Equilíbrio entre precisão e recall</td></tr>
        </table>
    `;
    document.getElementById('tabela-resultados').innerHTML = tabelaHTML;

    // Interpretação automática
    let interpretacao = `<h2>🧾 Interpretação</h2>`;
    if (acuracia > 0.9) interpretacao += `<p>O modelo apresenta excelente acurácia (${(acuracia*100).toFixed(2)}%).</p>`;
    else if (acuracia > 0.7) interpretacao += `<p>O modelo tem uma acurácia satisfatória (${(acuracia*100).toFixed(2)}%).</p>`;
    else interpretacao += `<p>A acurácia do modelo é baixa (${(acuracia*100).toFixed(2)}%), indicando espaço para melhoria.</p>`;

    if (precisao > recall) interpretacao += `<p>A precisão (${(precisao*100).toFixed(2)}%) é maior que o recall (${(recall*100).toFixed(2)}%), sugerindo que o modelo evita falsos positivos, mas pode perder verdadeiros positivos.</p>`;
    else if (recall > precisao) interpretacao += `<p>O recall (${(recall*100).toFixed(2)}%) é maior que a precisão (${(precisao*100).toFixed(2)}%), indicando que o modelo detecta bem positivos, mas com mais falsos alarmes.</p>`;
    else interpretacao += `<p>O modelo está equilibrado entre precisão e recall (${(precisao*100).toFixed(2)}% / ${(recall*100).toFixed(2)}%).</p>`;

    interpretacao += `<p>O F-Score (${(fScore*100).toFixed(2)}%) resume o equilíbrio geral entre precisão e recall.</p>`;
    interpretacao += `<p>A especificidade (${(especificidade*100).toFixed(2)}%) mostra o quão bem o modelo identifica corretamente os negativos.</p>`;

    document.getElementById('interpretacao').innerHTML = interpretacao;

    // Criação do gráfico
    const ctx = document.getElementById('grafico').getContext('2d');
    if (grafico) grafico.destroy();

    const cores = [acuracia, precisao, recall, especificidade, fScore].map(v => v > 0.8 ? '#4caf50' : v > 0.5 ? '#ff9800' : '#f44336');

    grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Acurácia', 'Precisão', 'Recall', 'Especificidade', 'F-Score'],
            datasets: [{
                label: 'Valor',
                data: [acuracia, precisao, recall, especificidade, fScore],
                backgroundColor: cores
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, max: 1 } },
            animation: { duration: 800 }
        }
    });
});
