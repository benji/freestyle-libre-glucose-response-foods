function mgdl_to_mmoll(x) {
  return x / 18.01801801801802
}

var chartColors = [
  'rgb(255, 99, 132)',
  'rgb(153, 102, 255)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(255, 205, 86)',
  'rgb(255, 159, 64)',
  'rgb(201, 203, 207)'
]

function add_date_minutes(d, m) {
  return new Date(d.getTime() + 1000 * 60 * m)
}

function relative_time_minutes(t, ref) {
  return (t.getTime() - ref.getTime()) / 1000 / 60
}

function get_event_dataset(e) {
  var startdata = add_date_minutes(e.startdate, -30)
  var stopdata = add_date_minutes(e.stopdate, 3 * 60)

  var edataset = {
    data: [],
    label: e.name,
    color: chartColors[0]
  }
  for (var i in data) {
    var t = data[i].datetime.getTime()
    if (t >= startdata.getTime() - dt && t <= stopdata.getTime() + dt) {
      if (!e.endresponse || t <= e.endresponse.getTime()) {
        edataset.data.push({
          x: relative_time_minutes(data[i].datetime, e.startdate),
          y: data[i].glucose
        })
      }
    }
  }
  return edataset
}

function renderUI() {
  var overview_dataset = {
    data: [],
    label: 'glucose',
    pointRadius: 0,
    color: chartColors[0]
  }
  for (var i in data) {
    overview_dataset.data.push({
      x: data[i].datetime,
      y: data[i].glucose
    })
  }

  glucose_graph({
    root: $('#overview-wrap'),
    title: 'Overall Glucose',
    datasets: [overview_dataset],
    scroll: true,
    x_type: 'time'
  })

  var events_per_group = {}
  for (var i in events) {
    var e = events[i]
    if (e.groupby) {
      if (!(e.groupby in events_per_group)) events_per_group[e.groupby] = []
      events_per_group[e.groupby].push(e)
    }
  }

  for (var g in events_per_group) {
    var datasets = []
    var colorsIdxMap = {},
      nextAvailColorIdx = 0
    for (var i in events_per_group[g]) {
      var e = events_per_group[g][i]

      if (!(e.name in colorsIdxMap)) colorsIdxMap[e.name] = nextAvailColorIdx++

      var dataset = get_event_dataset(e)
      dataset.color = chartColors[colorsIdxMap[e.name]]
      datasets.push(dataset)
    }

    glucose_graph({
      root: $('#charts'),
      title: g,
      datasets: datasets,
      colorIdx: 0,
      x_type: 'linear',
      x_min: -60,
      //x_max: 3 * 60,
      x_step: 60
    })
  }
}

$(document).ready(function () {
  loadData(
    '../data/freestyle-libre-data.csv',
    '../data/events.csv',
    renderUI)
})