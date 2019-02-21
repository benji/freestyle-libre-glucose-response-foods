function loadData(onReady) {
  $.ajax({
    type: "GET",
    url: "../data/freestyle-libre-data.csv",
    dataType: "text",
    success: function (data) {
      prepareData(data, onReady);
    }
  });
}

var exclude_before = moment('02-20-2019 00:00 AM', "MM-DD-YYYY h:mm A");

function prepareData(allText, onReady) {
  var cleanText = allText.replace(/\0/g, '');
  var lines = cleanText.split(/\r\n/g)
  var results = []
  for (var i = 2; i < lines.length; i++) {
    if (lines[i] == '') continue
    var parts = lines[i].split(',')

    //04-14-2018 12:12 PM
    var datetime = moment(parts[2], "MM-DD-YYYY h:mm A").toDate();
    if (datetime < exclude_before) continue

    var glucose = parts[4]
    if (glucose == '') glucose = parts[5]
    if (glucose == '') throw 'Glucose value not found.'

    results.push({
      datetime: datetime,
      glucose: parseInt(glucose)
    })
  }

  onReady(results)
}