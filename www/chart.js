var include_before_after_minutes = 17
var dt = include_before_after_minutes * 60 * 1000

function glucose_graph(options) {
  var gdata = []

  for (var i in data) {
    var t = data[i].datetime.getTime()
    if (t >= options.start.getTime() - dt && t <= options.stop.getTime() + dt) {
      gdata.push({
        x: data[i].datetime,
        y: data[i].glucose
      })
    }
  }

  var datasets = [{
    label: 'glucose',
    borderWidth: 1,
    borderColor: chartColors[options.colorIdx],
    backgroundColor: chartColors[options.colorIdx],
    pointRadius: 5,
    pointHoverRadius: 15,
    fill: false,
    data: gdata
  }]

  var root = $('#charts')

  var chartDiv = $('<div class=\'chart-container\'></div>')
  root.append(chartDiv)
  var $canvas = $('<canvas></canvas>')
  var canvas = $canvas.get()[0]
  chartDiv.append(canvas)

  var ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: datasets,
      displayColors: true
    },
    options: {
      elements: {
        point: {
          pointStyle: 'star'
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: options.title
      },
      tooltips: {
        mode: 'index'
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            min: options.start,
            max: options.stop
          },
          position: 'bottom',
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'time'
          }
        }],
        yAxes: [{
          type: 'linear',
          position: 'left',
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'glucose (mg/dL)'
          },
          ticks: {
            min: Y_AXIS_MIN_MGDL,
            max: Y_AXIS_MAX_MGDL
          }
        }, {
          type: 'linear',
          position: 'right',
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'glucose (mmol/dL)'
          },
          ticks: {
            min: mgdl_to_mmoll(Y_AXIS_MIN_MGDL),
            max: mgdl_to_mmoll(Y_AXIS_MAX_MGDL),
          },
          gridLines: {
            display: true,
            drawBorder: true,
            drawOnChartArea: false,
          }

        }]
      },
    },

    //lineAt: [0]
  });
}