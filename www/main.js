function mgdl_to_mmoll(x) {
  return x / 18.01801801801802
}

var chartColors = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)'
]



function add_date_minutes(d, m) {
  return new Date(d.getTime() + 1000 * 60 * m)
}

$(document).ready(function () {
  loadData(function () {
    console.log(data)

    glucose_graph({
      title: 'overview',
      start: data[0].datetime,
      stop: data[data.length - 1].datetime,
      colorIdx: 0
    })

    for (var i in events) {
      var e = events[i]

      glucose_graph({
        title: e.name,
        start: add_date_minutes(e.datetime, -60),
        stop: add_date_minutes(e.datetime, 3 * 60),
        mark: {
          label: e.name,
          t: e.datetime
        },
        colorIdx: 0,
        marks: [{
          label: e.name,
          time: e.datetime
        }]
      })
    }
  })
})