var oilCanvas = document.getElementById('oilChart');
Chart.defaults.global.defaultFontFamily = 'Ubuntu';
Chart.defaults.global.defaultFontSize = 12;
var oilData = {
    labels: [
        "John Doe",
        "Petr Doe",
        "Dmitry Doe"
    ],
    datasets: [
        {
            data: [60, 20, 20],
            backgroundColor: [
                "#686DF1",
                "#CAE988",
                "#E0519E"
            ]
        }]
};
var pieChart = new Chart(oilCanvas, {
    type: 'pie',
    data: oilData,
    options: {
    plugins: {
      legend: false,
      tooltip: false,
    }
  }
});