// Datos simulados profesionales (RRHH)
const metricas = [
    { depto: "ventas", tramites: 78, empleados: 15, mes: "enero" },
    { depto: "it", tramites: 45, empleados: 8, mes: "enero" },
    { depto: "marketing", tramites: 32, empleados: 6, mes: "enero" },
    { depto: "ventas", tramites: 92, empleados: 16, mes: "febrero" },
    { depto: "it", tramites: 51, empleados: 9, mes: "febrero" },
    { depto: "marketing", tramites: 48, empleados: 7, mes: "febrero" },
    { depto: "ventas", tramites: 105, empleados: 18, mes: "marzo" },
    { depto: "it", tramites: 63, empleados: 10, mes: "marzo" },
    { depto: "marketing", tramites: 57, empleados: 8, mes: "marzo" }
];

// Inicializar gráficos
let tramitesChart, empleadosChart;

function updateSummaryCards(data) {
    const totalTramites = data.reduce((sum, item) => sum + item.tramites, 0);
    const totalEmpleados = data.reduce((sum, item) => sum + item.empleados, 0);
    const eficiencia = Math.round((totalTramites / (totalEmpleados * 10)) * 10); // Fórmula simulada
    
    document.getElementById("totalTramites").textContent = totalTramites;
    document.getElementById("totalEmpleados").textContent = totalEmpleados;
    document.getElementById("eficiencia").textContent = `${eficiencia}%`;
}

function renderCharts(filterDepto = "all", filterMonth = "all") {
    const filteredData = metricas.filter(item => {
        return (filterDepto === "all" || item.depto === filterDepto) && 
               (filterMonth === "all" || item.mes === filterMonth);
    });
    
    updateSummaryCards(filteredData);
    
    // Preparar datos para gráficos
    const labels = ["Enero", "Febrero", "Marzo"];
    const deptos = ["ventas", "it", "marketing"];
    
    // Gráfico 1: Trámites por mes (línea)
    const ctx1 = document.getElementById('tramitesChart').getContext('2d');
    if (tramitesChart) tramitesChart.destroy();
    
    tramitesChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: labels,
            datasets: deptos.map(depto => {
                const color = depto === "ventas" ? '#3498db' : depto === "it" ? '#2ecc71' : '#e74c3c';
                return {
                    label: depto.toUpperCase(),
                    data: labels.map((_, i) => {
                        const month = ["enero", "febrero", "marzo"][i];
                        const item = filteredData.find(d => d.depto === depto && d.mes === month);
                        return item ? item.tramites : 0;
                    }),
                    borderColor: color,
                    backgroundColor: color + '20',
                    tension: 0.3,
                    fill: true
                };
            })
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
    
    // Gráfico 2: Empleados por departamento (doughnut)
    const ctx2 = document.getElementById('empleadosChart').getContext('2d');
    if (empleadosChart) empleadosChart.destroy();
    
    empleadosChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: deptos.map(d => d.toUpperCase()),
            datasets: [{
                data: deptos.map(depto => {
                    const items = filteredData.filter(d => d.depto === depto);
                    return items.reduce((sum, item) => sum + item.empleados, 0);
                }),
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} empleados`;
                        }
                    }
                }
            }
        }
    });
}

// Eventos para filtros
document.getElementById('filterDepto').addEventListener('change', function() {
    renderCharts(this.value, document.getElementById('filterMonth').value);
});

document.getElementById('filterMonth').addEventListener('change', function() {
    renderCharts(document.getElementById('filterDepto').value, this.value);
});

// Inicializar con todos los datos
renderCharts();