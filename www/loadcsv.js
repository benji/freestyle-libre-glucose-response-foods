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
        console.log(_data)
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
        var o = {
          type: parts[0],
          name: parts[2],
          startdate: moment(parts[3], "YYYY-MM-DD HH:mm").toDate(),
          stopdate: moment(parts[4], "YYYY-MM-DD HH:mm").toDate()
        }
        if (parts[1] != '') o.groupby = parts[1]
        if (parts[5] != '') o.endresponse = moment(parts[5], "YYYY-MM-DD HH:mm").toDate()
        return o
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