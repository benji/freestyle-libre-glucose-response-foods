var include_before_after_minutes = 17
var dt = include_before_after_minutes * 60 * 1000
var Y_AXIS_MIN_MGDL = 60
var Y_AXIS_MAX_MGDL = 200

function glucose_graph(options) {
  var datasets = []

  for (var i in options.datasets) {
    var dataset = options.datasets[i]
    datasets.push({
      label: dataset.label,
      borderWidth: 1,
      borderColor: dataset.color,
      backgroundColor: dataset.color,
      pointRadius: typeof (dataset.pointRadius) == 'undefined' ? 5 : dataset.pointRadius,
      pointHoverRadius: 15,
      fill: false,
      data: dataset.data
    })
  }

  var marks = []
  var greenzoneColor = 'rgba(100 ,200, 100, 0.2)'
  var yellowZoneColor = 'rgba(226 ,216, 72, 0.2)'
  var annotations = [{
    id: 'boxGlucoseNormalLevelFasting',
    type: 'box',
    yScaleID: 'y-axis-0',
    yMin: 75,
    yMax: 100,
    backgroundColor: greenzoneColor,
    borderColor: greenzoneColor,
  }, {
    id: 'boxGlucoseNormalLevelMeal',
    type: 'box',
    yScaleID: 'y-axis-0',
    yMin: 100,
    yMax: 135,
    backgroundColor: yellowZoneColor,
    borderColor: yellowZoneColor,
  }]


  var chartDiv = $('<div class=\'chart-container\'></div>')
  options.root.append(chartDiv)

  var $canvas = $('<canvas></canvas>')
  var canvas = $canvas.get()[0]
  chartDiv.append(canvas)

  var ctx = canvas.getContext('2d');

  var x_ticks = {}
  if (options.x_min) x_ticks.min = options.x_min
  if (options.x_max) x_ticks.max = options.x_max
  if (options.x_step) x_ticks.stepSize = options.x_step

  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: datasets,
      displayColors: true
    },
    options: {
      annotation: {
        drawTime: "afterDraw",
        annotations: annotations
      },
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
          type: options.x_type,
          time: {
            min: options.start,
            max: options.stop
          },
          position: 'bottom',
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'time'
          },
          ticks: x_ticks
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

    marks: marks
  });
}