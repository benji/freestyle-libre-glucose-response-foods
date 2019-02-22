var loadedResources = 0,
  TotalResources = 2;

var data, events;

var exclude_before = moment('02-20-2019 00:00 AM', "MM-DD-YYYY h:mm A");

var onLoadedResource = function (onReady) {
  console.log('loaded resource...')
  loadedResources++;
  if (loadedResources == TotalResources) onReady();
}

function loadData(dataURL, eventsURL, onReady) {
  $.ajax({
    type: "GET",
    url: dataURL + "?ts=" + (new Date().getTime()),
    dataType: "text",
    success: function (_data) {
      loadCSV(_data, 2, function (parts) {
        //04-14-2018 12:12 PM
        var datetime = moment(parts[2], "MM-DD-YYYY h:mm A").toDate();
        if (datetime < exclude_before) return null

        var glucose = parts[4]
        if (glucose == '') glucose = parts[5]
        if (glucose == '') throw 'Glucose value not found.'

        return {
          datetime: datetime,
          glucose: parseInt(glucose)
        }
      }, function (_data) {
        data = _data
        onLoadedResource(onReady)
      });
    }
  });

  $.ajax({
    type: "GET",
    url: eventsURL + "?ts=" + (new Date().getTime()),
    dataType: "text",
    success: function (data) {
      loadCSV(data, 1, function (parts) {
        return {
          type: parts[0],
          name: parts[1],
          startdate: moment(parts[2], "YYYY-MM-DD HH:mm").toDate(),
          stopdate: moment(parts[3], "YYYY-MM-DD HH:mm").toDate()
        }
      }, function (_events) {
        events = _events
        onLoadedResource(onReady)
      });
    }
  });
}

function loadCSV(text, startLine, parseLineFn, onReady) {
  text = text.replace(/\0/g, '');
  var lines = text.split(/\r?\n/g)
  var results = []
  for (var i = startLine; i < lines.length; i++) {
    if (lines[i] == '') continue
    var parts = lines[i].split(',')
    var item = parseLineFn(parts)
    if (item == null) continue
    results.push(item)
  }

  onReady(results)
}