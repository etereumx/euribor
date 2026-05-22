// euribor-chart.js
function getCurrentYear() {
  return new Date().getFullYear();
}

let currentView = 'mensual';

function loadEuriborData(year) {
  if (year === 2025) {
    return euribor2025;
  } else {
    if (currentView === 'diaria') {
      return euribor2026;
    } else {
      // Agrupar por mes para vista mensual
      const grouped = {};
      euribor2026.forEach(d => {
        const mes = d.date.slice(0,7);
        if (!grouped[mes]) grouped[mes] = [];
        grouped[mes].push(d.value);
      });
      return Object.keys(grouped).map(mes => ({ date: mes+'-01', value: +(grouped[mes].reduce((a,b)=>a+b,0)/grouped[mes].length).toFixed(2) }));
    }
  }
}

function setView(view) {
  currentView = view;
  const year = getCurrentYear();
  renderChart(loadEuriborData(year));
}


function renderChart(data) {
  const ctx = document.getElementById('euriborChart').getContext('2d');
  if (window.euriborChartInstance) {
    window.euriborChartInstance.destroy();
  }
  window.euriborChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.date),
      datasets: [{
        label: 'Euribor',
        data: data.map(d => d.value),
        borderColor: 'blue',
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true, title: { display: true, text: 'Fecha' } },
        y: { display: true, title: { display: true, text: 'Valor' } }
      }
    }
  });
}

function setupTabs() {
  document.getElementById('tab-2026').addEventListener('click', function() {
    setActiveTab('tab-2026');
    renderChart(loadEuriborData(2026));
  });
  document.getElementById('tab-2025').addEventListener('click', function() {
    setActiveTab('tab-2025');
    renderChart(loadEuriborData(2025));
  });
}

function setActiveTab(tabId) {
  document.getElementById('tab-2026').classList.remove('active');
  document.getElementById('tab-2025').classList.remove('active');
  document.getElementById(tabId).classList.add('active');
}

window.onload = function() {
  setupTabs();
  document.getElementById('btn-mensual').onclick = function() {
    document.getElementById('btn-mensual').classList.add('active');
    document.getElementById('btn-diaria').classList.remove('active');
    setView('mensual');
  };
  document.getElementById('btn-diaria').onclick = function() {
    document.getElementById('btn-diaria').classList.add('active');
    document.getElementById('btn-mensual').classList.remove('active');
    setView('diaria');
  };
  const year = getCurrentYear();
  if (year === 2025) {
    setActiveTab('tab-2025');
    renderChart(loadEuriborData(2025));
  } else {
    setActiveTab('tab-2026');
    renderChart(loadEuriborData(2026));
  }
};
